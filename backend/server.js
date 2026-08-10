require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const COOKIE_SECURE = process.env.NODE_ENV === 'production';
const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || 'lax';

if (!MONGODB_URI) throw new Error('MONGODB_URI is required');
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'محاولات كثيرة. حاول مرة أخرى لاحقًا.' }
});

const dataLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'طلبات كثيرة. حاول مرة أخرى لاحقًا.' }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  passwordHash: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: null },
  settings: {
    drowsyLimit: { type: Number, default: 2, min: 0.5, max: 4 },
    earThreshold: { type: Number, default: 0.12, min: 0.10, max: 0.40 },
    adaptiveCalibration: { type: Boolean, default: true }
  }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

/*
 * PRIVACY-FIRST SESSION MODEL
 *
 * Stored:
 * - user ownership
 * - session start/end timestamps
 * - duration
 * - alert count
 * - total alert duration
 * - completion state
 *
 * NOT stored:
 * - camera frames/video
 * - face images
 * - MediaPipe landmarks
 * - EAR samples
 * - audio
 * - raw biometric data
 */
const monitoringSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true },
  durationSeconds: { type: Number, required: true, min: 1, max: 86400 },
  alertCount: { type: Number, required: true, min: 0, max: 10000 },
  alertSeconds: { type: Number, required: true, min: 0, max: 86400 },
  avgEar: { type: Number, min: 0, max: 2, default: null },
  minEar: { type: Number, min: 0, max: 2, default: null },
  perclos: { type: Number, min: 0, max: 100, default: null },
  riskScore: { type: Number, min: 0, max: 100, default: null },
  completed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

monitoringSessionSchema.index({ userId: 1, endedAt: -1 });
const MonitoringSession = mongoose.model('MonitoringSession', monitoringSessionSchema);

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    settings: {
      drowsyLimit: user.settings?.drowsyLimit ?? 2,
      earThreshold: user.settings?.earThreshold ?? 0.12,
      adaptiveCalibration: user.settings?.adaptiveCalibration !== false
    }
  };
}

function createToken(user) {
  return jwt.sign({ sub: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie('anti_sleep_token', token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

function clearAuthCookie(res) {
  res.clearCookie('anti_sleep_token', {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    path: '/'
  });
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.anti_sleep_token;
    if (!token) return res.status(401).json({ message: 'غير مسجل الدخول.' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'الحساب غير موجود.' });

    req.user = user;
    next();
  } catch (_) {
    return res.status(401).json({ message: 'جلسة الدخول غير صالحة أو منتهية.' });
  }
}

app.get('/api/health', async (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    ok: dbReady,
    service: 'anti-sleep-backend',
    database: dbReady ? 'connected' : 'disconnected'
  });
});

/* ========================= AUTH ========================= */

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: 'الاسم يجب أن يكون بين 2 و60 حرفًا.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'البريد الإلكتروني غير صالح.' });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: 'كلمة المرور يجب أن تكون بين 8 و128 حرفًا.' });
    }

    const exists = await User.exists({ email });
    if (exists) return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل مسبقًا.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    setAuthCookie(res, createToken(user));
    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل مسبقًا.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'تعذر إنشاء الحساب حاليًا.' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });

    user.lastLoginAt = new Date();
    await user.save();

    setAuthCookie(res, createToken(user));
    return res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'تعذر تسجيل الدخول حاليًا.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});



/* ========================= PROFILE / SETTINGS ========================= */
app.get('/api/auth/settings', requireAuth, (req, res) => {
  res.json({ settings: {
    drowsyLimit: req.user.settings?.drowsyLimit ?? 2,
    earThreshold: req.user.settings?.earThreshold ?? 0.12,
    adaptiveCalibration: req.user.settings?.adaptiveCalibration !== false
  }});
});

app.patch('/api/auth/settings', dataLimiter, requireAuth, async (req, res) => {
  try {
    const drowsyLimit = Number(req.body.drowsyLimit ?? req.user.settings?.drowsyLimit ?? 2);
    const earThreshold = Number(req.body.earThreshold ?? req.user.settings?.earThreshold ?? 0.12);
    const adaptiveCalibration = req.body.adaptiveCalibration !== false;
    if (!Number.isFinite(drowsyLimit) || drowsyLimit < 0.5 || drowsyLimit > 4) {
      return res.status(400).json({ message: 'حد الإنذار يجب أن يكون بين 0.5 و4 ثوانٍ.' });
    }
    if (!Number.isFinite(earThreshold) || earThreshold < 0.10 || earThreshold > 0.40) {
      return res.status(400).json({ message: 'عتبة EAR غير صالحة.' });
    }
    req.user.settings = { drowsyLimit, earThreshold, adaptiveCalibration };
    await req.user.save();
    res.json({ settings: req.user.settings });
  } catch (err) {
    console.error('Settings update failed:', err);
    res.status(500).json({ message: 'تعذر حفظ الإعدادات حاليًا.' });
  }
});

/* ========================= PRIVATE DATA ========================= */

// Save only privacy-safe session statistics.
app.post('/api/data/sessions', dataLimiter, requireAuth, async (req, res) => {
  try {
    const durationSeconds = Math.round(Number(req.body.durationSeconds));
    const alertCount = Math.round(Number(req.body.alertCount));
    const alertSeconds = Number(req.body.alertSeconds);
    const completed = req.body.completed !== false;
    const optionalNumber = (value, min, max) => {
      if (value === null || value === undefined || value === '') return null;
      const n = Number(value);
      return Number.isFinite(n) && n >= min && n <= max ? n : NaN;
    };
    const avgEar = optionalNumber(req.body.avgEar, 0, 2);
    const minEar = optionalNumber(req.body.minEar, 0, 2);
    const perclos = optionalNumber(req.body.perclos, 0, 100);
    const riskScore = optionalNumber(req.body.riskScore, 0, 100);

    if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 86400) {
      return res.status(400).json({ message: 'مدة الجلسة غير صالحة.' });
    }
    if (!Number.isFinite(alertCount) || alertCount < 0 || alertCount > 10000) {
      return res.status(400).json({ message: 'عدد التنبيهات غير صالح.' });
    }
    if (!Number.isFinite(alertSeconds) || alertSeconds < 0 || alertSeconds > durationSeconds) {
      return res.status(400).json({ message: 'مدة التنبيه غير صالحة.' });
    }
    if ([avgEar, minEar, perclos, riskScore].some(Number.isNaN)) {
      return res.status(400).json({ message: 'بيانات التحليل غير صالحة.' });
    }

    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - durationSeconds * 1000);

    const session = await MonitoringSession.create({
      userId: req.user._id,
      startedAt,
      endedAt,
      durationSeconds,
      alertCount,
      alertSeconds: Number(alertSeconds.toFixed(1)),
      avgEar: avgEar === null ? null : Number(avgEar.toFixed(4)),
      minEar: minEar === null ? null : Number(minEar.toFixed(4)),
      perclos: perclos === null ? null : Number(perclos.toFixed(1)),
      riskScore: riskScore === null ? null : Math.round(riskScore),
      completed
    });

    res.status(201).json({
      ok: true,
      session: {
        id: String(session._id),
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        durationSeconds: session.durationSeconds,
        alertCount: session.alertCount,
        alertSeconds: session.alertSeconds,
        avgEar: session.avgEar,
        minEar: session.minEar,
        perclos: session.perclos,
        riskScore: session.riskScore,
        completed: session.completed
      }
    });
  } catch (err) {
    console.error('Session save failed:', err);
    res.status(500).json({ message: 'تعذر حفظ جلسة المراقبة حاليًا.' });
  }
});

app.get('/api/data/sessions', dataLimiter, requireAuth, async (req, res) => {
  try {
    let limit = Number.parseInt(req.query.limit, 10);
    if (!Number.isFinite(limit)) limit = 30;
    limit = Math.min(Math.max(limit, 1), 100);

    const sessions = await MonitoringSession.find({ userId: req.user._id })
      .sort({ endedAt: -1 })
      .limit(limit)
      .select('startedAt endedAt durationSeconds alertCount alertSeconds avgEar minEar perclos riskScore completed -_id')
      .lean();

    res.json({ sessions });
  } catch (err) {
    console.error('Session list failed:', err);
    res.status(500).json({ message: 'تعذر تحميل سجل الجلسات حاليًا.' });
  }
});

app.get('/api/data/stats', dataLimiter, requireAuth, async (req, res) => {
  try {
    const [result] = await MonitoringSession.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          sessionCount: { $sum: 1 },
          totalDurationSeconds: { $sum: '$durationSeconds' },
          totalAlerts: { $sum: '$alertCount' },
          totalAlertSeconds: { $sum: '$alertSeconds' }
        }
      }
    ]);

    if (!result) {
      return res.json({
        sessionCount: 0,
        totalDurationSeconds: 0,
        totalAlerts: 0,
        totalAlertSeconds: 0,
        averageRiskScore: 0,
        averagePerclos: 0,
        averageDurationSeconds: 0
      });
    }

    res.json({
      sessionCount: result.sessionCount,
      totalDurationSeconds: result.totalDurationSeconds,
      totalAlerts: result.totalAlerts,
      totalAlertSeconds: Number(result.totalAlertSeconds.toFixed(1)),
      averageDurationSeconds: result.sessionCount
        ? Math.round(result.totalDurationSeconds / result.sessionCount)
        : 0
    });
  } catch (err) {
    console.error('Stats failed:', err);
    res.status(500).json({ message: 'تعذر تحميل الإحصائيات حاليًا.' });
  }
});

// Privacy control: delete ONLY the authenticated user's monitoring data.
app.delete('/api/data/sessions', dataLimiter, requireAuth, async (req, res) => {
  try {
    const result = await MonitoringSession.deleteMany({ userId: req.user._id });
    res.json({ ok: true, deletedCount: result.deletedCount || 0 });
  } catch (err) {
    console.error('Session deletion failed:', err);
    res.status(500).json({ message: 'تعذر حذف بيانات المراقبة حاليًا.' });
  }
});

app.use((req, res) => res.status(404).json({ message: 'المسار غير موجود.' }));

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Anti-Sleep backend listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
