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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  passwordHash: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: null }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email, createdAt: user.createdAt };
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

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'anti-sleep-backend' });
});

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (name.length < 2 || name.length > 60) return res.status(400).json({ message: 'الاسم يجب أن يكون بين 2 و60 حرفًا.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'البريد الإلكتروني غير صالح.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'كلمة المرور يجب أن تكون بين 8 و128 حرفًا.' });

    const exists = await User.exists({ email });
    if (exists) return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل مسبقًا.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    setAuthCookie(res, createToken(user));
    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل مسبقًا.' });
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

app.use((req, res) => res.status(404).json({ message: 'المسار غير موجود.' }));

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Anti-Sleep backend listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
