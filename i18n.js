/* Anti Sleep System — complete Arabic / French / English localization layer */
(function () {
  'use strict';

  const LANG_KEY = 'antiSleepLanguage';
  const DEFAULT_LANG = 'ar';
  const SUPPORTED = ['ar', 'fr', 'en'];

  const T = {
    ar: {},
    en: {
      'غير نشط':'Inactive','نظام المراقبة:':'Monitoring system:','الوضع الذكي':'Smart mode','حساب':'Account','واجهة مختصرة':'Compact interface','👤 حساب':'👤 Account','👤 تسجيل الدخول':'👤 Sign in',
      'Driver Monitoring Mode':'Driver Monitoring Mode','Driver Mode':'Driver Mode','Screen Wake Lock':'Screen Wake Lock','Monitoring':'Monitoring','تفعيل الوضع':'Enable mode','غير نشط':'Inactive','جاهز':'Ready',
      'يمنع إطفاء الشاشة تلقائياً أثناء المراقبة عند تفعيل الوضع.':'Keeps the screen awake while monitoring when enabled.',
      'تحليل ذكي':'Smart analysis','FaceMesh لتحليل نقاط الوجه ومراقبة العين بشكل لحظي.':'FaceMesh analyzes facial landmarks and monitors the eyes in real time.',
      'مراقبة EAR':'EAR monitoring','عرض نسبة العين والمسافة العمودية لمتابعة الإغلاق.':'Displays eye ratio and vertical distance to track closure.',
      'إنذار فوري':'Instant alarm','تنبيه صوتي ومرئي عند تجاوز حد الإغلاق المحدد.':'Audio and visual alert when the closure limit is exceeded.',
      'إحصائيات الجلسة':'Session statistics','عدد الإغلاقات والإنذارات والمتوسط وأطول مدة.':'Closures, alarms, averages and longest duration.',
      'حالة العينين':'Eye state','👁️ مفتوحة':'👁️ Open','مدة إغلاق العين':'Eye closure duration','المسافة (y)':'Distance (y)','نسبة العين (EAR)':'Eye aspect ratio (EAR)','الإنذار خلال':'Alarm in',
      'إنذار! استيقظ فوراً':'Alarm! Wake up now','▶ بدء الكاميرا':'▶ Start camera','⏹ إيقاف':'⏹ Stop','⏱️ حد الإنذار (ثانية)':'⏱️ Alarm limit (seconds)','🎯 عتبة EAR':'🎯 EAR threshold','🔊 الصوت':'🔊 Sound','🔊 غير مكتوم':'🔊 Unmuted','🔇 مكتوم':'🔇 Muted','إعادة الإحصائيات':'Reset statistics',
      '🧠 تقييم خطر النعاس':'🧠 Drowsiness risk assessment','تحليل محلي يجمع EAR + PERCLOS + مدة الإغلاق + وضعية الرأس':'Local analysis combines EAR + PERCLOS + closure duration + head pose',
      'إغلاق طويل':'Long closure','الرأس':'Head','مستقيم':'Straight','🎯 معايرة تلقائية':'🎯 Auto calibration','المعايرة الافتراضية':'Default calibration','العين اليمنى':'Right eye','العين اليسرى':'Left eye','الرمشات':'Blinks','جودة الوجه':'Face quality','الرأس':'Head',
      '🔒 لا يتم إرسال الفيديو أو صور الوجه أو landmarks أو عينات EAR الخام إلى الخادم. يتم إرسال ملخصات الجلسة فقط عند تسجيل المستخدم.':'🔒 Video, face images, landmarks and raw EAR samples are never sent to the server. Only session summaries are synced when you are signed in.',
      'إنذار':'Alarm','إغلاق':'Closure','⏳ أطول إغلاق للعين:':'⏳ Longest eye closure:','📈 متوسط:':'📈 Average:','📈 تحليل EAR المباشر':'📈 Live EAR analysis','آخر 60 قراءة':'Last 60 readings','ابدأ الكاميرا لعرض البيانات':'Start the camera to display data','EAR الحالي':'Current EAR','أدنى EAR':'Minimum EAR','متوسط EAR':'Average EAR',
      '🧠 جودة التتبع':'🧠 Tracking quality','في انتظار الكاميرا':'Waiting for camera','ابدأ النظام للحصول على تقييم التتبع.':'Start the system to get a tracking assessment.','الوجه والعينان قيد التتبع بشكل مستقر.':'Face and eyes are being tracked steadily.','جيد':'Good','التتبع يعمل، حافظ على إضاءة ومسافة ثابتة.':'Tracking is working. Keep stable lighting and distance.','يحتاج تحسين':'Needs improvement','ضع الوجه داخل الإطار وتأكد من الإضاءة.':'Keep your face inside the frame and check the lighting.',
      '📷 الكاميرا':'📷 Camera','👤 الوجه':'👤 Face','👁️ تتبع العين':'👁️ Eye tracking','🔊 الإنذار الصوتي':'🔊 Alarm audio','SESSION TIME':'SESSION TIME','📥 تصدير التقرير':'📥 Export report','🗑️ مسح السجل':'🗑️ Clear history',
      '🚨 مركز التنبيهات':'🚨 Alert center','آخر إنذار':'Last alarm','إنذارات الجلسة':'Session alarms','إجمالي زمن الإنذار':'Total alarm time','FPS تقريبي':'Approx. FPS','🔒':'🔒','الخصوصية:':'Privacy:','المعالجة تتم داخل المتصفح، لا يتم رفع فيديو الكاميرا بواسطة هذا التطبيق':'Processing happens in the browser; camera video is not uploaded by this application',
      '⚡ حالة النظام':'⚡ System status','Active':'Active','Checking':'Checking','Offline Ready':'Offline Ready','Supported':'Supported','Reduced Motion':'Reduced Motion','Web App':'Web App','Service Worker':'Service Worker',
      '🕘 سجل الجلسات':'🕘 Session history','محلي على جهازك':'Local on this device','لا توجد جلسات محفوظة بعد.':'No saved sessions yet.','☁️ بيانات حسابك':'☁️ Your account data','إحصائيات':'Statistics','جلسات محفوظة':'Saved sessions','وقت المراقبة':'Monitoring time','إجمالي التنبيهات':'Total alarms','متوسط الجلسة':'Average session','↻ مزامنة البيانات':'↻ Sync data','🗑 حذف بيانات الجلسات من قاعدة البيانات':'🗑 Delete session data from database','🔒 التطبيق لا يحتفظ بفيديو التتبع ولا أي صور للوجه ولا أي بيانات حساسة في قاعدة البيانات':'🔒 The app does not store tracking video, face images or sensitive data in the database',
      'نصيحة:':'Tip:','ضع الوجه أمام الكاميرا بإضاءة جيدة وحافظ على مسافة مناسبة للحصول على تتبع أكثر استقراراً.':'Place your face in front of the camera with good lighting and keep a suitable distance for more stable tracking.','قد بحذر من فضلك، عائلتك في إنتظارك':'Please drive carefully, your family is waiting for you','• تحيا الجزائر •':'• Long live Algeria •',
      'استيقظ فوراً!':'Wake up now!','DROWSINESS DETECTED':'DROWSINESS DETECTED','افتح عينيك وركز على الطريق':'Open your eyes and focus on the road','حسابك في Anti Sleep System':'Your Anti Sleep System account','أنشئ حسابًا أو سجّل الدخول للوصول إلى حسابك من أي جهاز.':'Create an account or sign in to access your account from any device.','تسجيل الدخول':'Sign in','إنشاء حساب':'Create account','البريد الإلكتروني':'Email','كلمة المرور':'Password','الاسم':'Name','🔐 تسجيل الدخول':'🔐 Sign in','✨ إنشاء الحساب':'✨ Create account','↪ تسجيل الخروج':'↪ Sign out',
      'غير مكتوم':'Unmuted','مكتوم':'Muted','ممتاز':'Excellent','مستخدم':'User','الشاشة مستيقظة':'Screen awake','التطبيق مثبت أو التثبيت غير متاح حاليًا':'The app is already installed or installation is currently unavailable','متصل':'Connected','غير متاح':'Unavailable','غير مدعوم':'Unsupported','غير مؤكد':'Unconfirmed','غير مكتملة':'Incomplete','مكتملة':'Completed','انتظار':'Waiting','مكتشف':'Detected','مستقر':'Stable','نشط':'Active','تشغيل':'Running','خطأ':'Error','جاري المعايرة... افتح عينيك وانظر للكاميرا':'Calibrating... Open your eyes and look at the camera','✓ تمت المعايرة':'✓ Calibration complete','✓':'✓','ضع الوجه داخل الإطار وتأكد من الإضاءة.':'Keep your face inside the frame and check the lighting.',
      'عتبة تكيفية: --':'Adaptive threshold: --','عتبة تكيفية:':'Adaptive threshold:','منخفض ⚠️':'Low ⚠️','مدار ↔':'Turned ↔','في الخلفية':'In background','في انتظار التركيز':'Waiting for focus','في انتظار العودة':'Waiting to return','محلي — تعذر مزامنة السحابة':'Local — cloud sync unavailable','☁️ الحساب + محلي':'☁️ Account + local','⛶ ملء الشاشة':'⛶ Fullscreen','⤢ إنهاء الشاشة الكاملة':'⤢ Exit fullscreen','▦ واجهة كاملة':'▦ Full interface','▦ واجهة مختصرة':'▦ Compact interface','● متصل':'● Connected','● وضع عدم الاتصال':'● Offline','🔴 إنذار!':'🔴 Alarm!','😴 مغلقة':'😴 Closed','🚗 Driver Monitoring Mode مفعل':'🚗 Driver Monitoring Mode enabled','👤 الحساب':'👤 Account',
      'SAFE':'SAFE','LOW':'LOW','MODERATE':'MODERATE','HIGH':'HIGH','CRITICAL':'CRITICAL','جاهز للمراقبة':'Ready for monitoring','الوضع نشط':'Mode active','تعذر التفعيل':'Activation failed','تعذر الوصول إلى الكاميرا. تأكد من منح الإذن.':'Unable to access the camera. Make sure permission is granted.','تعذر تشغيل الصوت:':'Unable to start audio:','تعذر تفعيل إبقاء الشاشة مستيقظة':'Unable to keep the screen awake','تفعيل أو إيقاف وضع مراقبة السائق':'Enable or disable driver monitoring mode','تم إنشاء الحساب وتسجيل الدخول.':'Account created and signed in.','تم إنهاء جلسة المراقبة':'Monitoring session ended','تم إيقاف Driver Monitoring Mode':'Driver Monitoring Mode disabled','تم التحرير مؤقتاً':'Temporarily released','تم بدء جلسة المراقبة':'Monitoring session started','تم تثبيت Anti Sleep System بنجاح':'Anti Sleep System installed successfully','تم تحرير Wake Lock مؤقتاً وسيتم استعادته عند العودة':'Wake Lock was temporarily released and will be restored when you return','تم تسجيل الخروج.':'Signed out.','تم تسجيل الدخول بنجاح.':'Signed in successfully.','تم تصدير تقرير الجلسة':'Session report exported','تم تفعيل الواجهة المختصرة':'Compact interface enabled','تم حذف بيانات المراقبة من MongoDB.':'Monitoring data deleted from MongoDB.','تم حذف سجل الجلسات':'Session history deleted','تمت استعادة الواجهة الكاملة':'Full interface restored','تمت مزامنة بيانات الحساب.':'Account data synchronized.','هل تريد حذف سجل الجلسات المحفوظ محليًا؟':'Delete the locally saved session history?','سيتم حذف سجل جلسات المراقبة والإحصائيات من MongoDB نهائيًا. هل تريد المتابعة؟':'All monitoring sessions and statistics will be permanently deleted from MongoDB. Continue?','حدث خطأ في الخادم':'A server error occurred','حساب':'Account','خطأ في الكاميرا:':'Camera error:','⏳ جارٍ التشغيل...':'⏳ Starting...','⏳ جارٍ التنفيذ...':'⏳ Processing...','🎯 بدأت المعايرة التلقائية لمدة 8 ثوانٍ':'🎯 Automatic calibration started for 8 seconds','✅ موقع الإنذار جاهز! اضغط "بدء الكاميرا".':'✅ Alarm system ready! Press "Start camera".','تفعيل الوضع':'Enable mode','مكتوم':'Muted','غير نشط':'Inactive',
      'هذا البريد الإلكتروني مسجل مسبقًا.':'This email is already registered.','البريد الإلكتروني أو كلمة المرور غير صحيحة.':'Incorrect email or password.','تعذر إنشاء الحساب حاليًا.':'Unable to create the account right now.','تعذر تسجيل الدخول حاليًا.':'Unable to sign in right now.','غير مسجل الدخول.':'Not signed in.','الحساب غير موجود.':'Account not found.','جلسة الدخول غير صالحة أو منتهية.':'Session is invalid or expired.','الاسم يجب أن يكون بين 2 و60 حرفًا.':'Name must be between 2 and 60 characters.','البريد الإلكتروني غير صالح.':'Invalid email address.','كلمة المرور يجب أن تكون بين 8 و128 حرفًا.':'Password must be between 8 and 128 characters.','حد الإنذار يجب أن يكون بين 0.5 و4 ثوانٍ.':'Alarm limit must be between 0.5 and 4 seconds.','عتبة EAR غير صالحة.':'Invalid EAR threshold.','تعذر حفظ الإعدادات حاليًا.':'Unable to save settings right now.','مدة الجلسة غير صالحة.':'Invalid session duration.','عدد التنبيهات غير صالح.':'Invalid alert count.','مدة التنبيه غير صالحة.':'Invalid alert duration.','بيانات التحليل غير صالحة.':'Invalid analytics data.','تعذر حفظ جلسة المراقبة حاليًا.':'Unable to save the monitoring session right now.','تعذر تحميل سجل الجلسات حاليًا.':'Unable to load session history right now.','تعذر تحميل الإحصائيات حاليًا.':'Unable to load statistics right now.','تعذر حذف بيانات المراقبة حاليًا.':'Unable to delete monitoring data right now.','المسار غير موجود.':'Route not found.','محاولات كثيرة. حاول مرة أخرى لاحقًا.':'Too many attempts. Try again later.','طلبات كثيرة. حاول مرة أخرى لاحقًا.':'Too many requests. Try again later.',
      '8 أحرف على الأقل':'At least 8 characters','ث':'s','د':'min','س':'h','/ دقيقة':'/ min','0.0 ث':'0.0 s','0.0ث':'0.0s','0د':'0min','0 / دقيقة':'0 / min'
    },
    fr: {
      'غير نشط':'Inactif','نظام المراقبة:':'Système de surveillance :','الوضع الذكي':'Mode intelligent','حساب':'Compte','واجهة مختصرة':'Interface compacte','👤 حساب':'👤 Compte','👤 تسجيل الدخول':'👤 Connexion',
      'Driver Monitoring Mode':'Mode de surveillance du conducteur','Driver Mode':'Mode conducteur','Screen Wake Lock':'Maintien de l’écran','Monitoring':'Surveillance','تفعيل الوضع':'Activer le mode','غير نشط':'Inactif','جاهز':'Prêt',
      'يمنع إطفاء الشاشة تلقائياً أثناء المراقبة عند تفعيل الوضع.':'Garde l’écran actif pendant la surveillance lorsque le mode est activé.',
      'تحليل ذكي':'Analyse intelligente','FaceMesh لتحليل نقاط الوجه ومراقبة العين بشكل لحظي.':'FaceMesh analyse les points du visage et surveille les yeux en temps réel.',
      'مراقبة EAR':'Surveillance EAR','عرض نسبة العين والمسافة العمودية لمتابعة الإغلاق.':'Affiche le ratio de l’œil et la distance verticale pour suivre la fermeture.',
      'إنذار فوري':'Alerte instantanée','تنبيه صوتي ومرئي عند تجاوز حد الإغلاق المحدد.':'Alerte sonore et visuelle lorsque la durée de fermeture dépasse la limite.',
      'إحصائيات الجلسة':'Statistiques de session','عدد الإغلاقات والإنذارات والمتوسط وأطول مدة.':'Fermetures, alertes, moyennes et durée maximale.',
      'حالة العينين':'État des yeux','👁️ مفتوحة':'👁️ Ouverts','مدة إغلاق العين':'Durée de fermeture','المسافة (y)':'Distance (y)','نسبة العين (EAR)':'Ratio de l’œil (EAR)','الإنذار خلال':'Alerte dans',
      'إنذار! استيقظ فوراً':'Alerte ! Réveillez-vous maintenant','▶ بدء الكاميرا':'▶ Démarrer la caméra','⏹ إيقاف':'⏹ Arrêter','⏱️ حد الإنذار (ثانية)':'⏱️ Limite d’alerte (secondes)','🎯 عتبة EAR':'🎯 Seuil EAR','🔊 الصوت':'🔊 Son','🔊 غير مكتوم':'🔊 Son activé','🔇 مكتوم':'🔇 Muet','إعادة الإحصائيات':'Réinitialiser les statistiques',
      '🧠 تقييم خطر النعاس':'🧠 Évaluation du risque de somnolence','تحليل محلي يجمع EAR + PERCLOS + مدة الإغلاق + وضعية الرأس':'L’analyse locale combine EAR + PERCLOS + durée de fermeture + position de la tête',
      'إغلاق طويل':'Fermeture prolongée','الرأس':'Tête','مستقيم':'Droit','🎯 معايرة تلقائية':'🎯 Calibration automatique','المعايرة الافتراضية':'Calibration par défaut','العين اليمنى':'Œil droit','العين اليسرى':'Œil gauche','الرمشات':'Clignements','جودة الوجه':'Qualité du visage',
      '🔒 لا يتم إرسال الفيديو أو صور الوجه أو landmarks أو عينات EAR الخام إلى الخادم. يتم إرسال ملخصات الجلسة فقط عند تسجيل المستخدم.':'🔒 Les vidéos, images du visage, landmarks et échantillons EAR bruts ne sont jamais envoyés au serveur. Seuls les résumés de session sont synchronisés lorsque vous êtes connecté.',
      'إنذار':'Alerte','إغلاق':'Fermeture','⏳ أطول إغلاق للعين:':'⏳ Plus longue fermeture :','📈 متوسط:':'📈 Moyenne :','📈 تحليل EAR المباشر':'📈 Analyse EAR en direct','آخر 60 قراءة':'60 dernières mesures','ابدأ الكاميرا لعرض البيانات':'Démarrez la caméra pour afficher les données','EAR الحالي':'EAR actuel','أدنى EAR':'EAR minimum','متوسط EAR':'EAR moyen',
      '🧠 جودة التتبع':'🧠 Qualité du suivi','في انتظار الكاميرا':'En attente de la caméra','ابدأ النظام للحصول على تقييم التتبع.':'Démarrez le système pour évaluer le suivi.','الوجه والعينان قيد التتبع بشكل مستقر.':'Le visage et les yeux sont suivis de manière stable.','جيد':'Bon','التتبع يعمل، حافظ على إضاءة ومسافة ثابتة.':'Le suivi fonctionne. Gardez un éclairage et une distance stables.','يحتاج تحسين':'À améliorer','ضع الوجه داخل الإطار وتأكد من الإضاءة.':'Placez votre visage dans le cadre et vérifiez l’éclairage.',
      '📷 الكاميرا':'📷 Caméra','👤 الوجه':'👤 Visage','👁️ تتبع العين':'👁️ Suivi des yeux','🔊 الإنذار الصوتي':'🔊 Alerte sonore','SESSION TIME':'DURÉE DE SESSION','📥 تصدير التقرير':'📥 Exporter le rapport','🗑️ مسح السجل':'🗑️ Effacer l’historique',
      '🚨 مركز التنبيهات':'🚨 Centre des alertes','آخر إنذار':'Dernière alerte','إنذارات الجلسة':'Alertes de la session','إجمالي زمن الإنذار':'Durée totale des alertes','FPS تقريبي':'FPS approx.','الخصوصية:':'Confidentialité :','المعالجة تتم داخل المتصفح، لا يتم رفع فيديو الكاميرا بواسطة هذا التطبيق':'Le traitement est effectué dans le navigateur ; la vidéo de la caméra n’est pas téléversée par cette application',
      '⚡ حالة النظام':'⚡ État du système','Active':'Actif','Checking':'Vérification','Offline Ready':'Prêt hors ligne','Supported':'Pris en charge','Reduced Motion':'Mouvement réduit','Web App':'Application Web','Service Worker':'Service Worker',
      '🕘 سجل الجلسات':'🕘 Historique des sessions','محلي على جهازك':'Local sur cet appareil','لا توجد جلسات محفوظة بعد.':'Aucune session enregistrée.','☁️ بيانات حسابك':'☁️ Données de votre compte','إحصائيات':'Statistiques','جلسات محفوظة':'Sessions enregistrées','وقت المراقبة':'Temps de surveillance','إجمالي التنبيهات':'Total des alertes','متوسط الجلسة':'Durée moyenne','↻ مزامنة البيانات':'↻ Synchroniser les données','🗑 حذف بيانات الجلسات من قاعدة البيانات':'🗑 Supprimer les sessions de la base de données','🔒 التطبيق لا يحتفظ بفيديو التتبع ولا أي صور للوجه ولا أي بيانات حساسة في قاعدة البيانات':'🔒 L’application ne stocke ni vidéo de suivi, ni images du visage, ni données sensibles dans la base de données',
      'نصيحة:':'Conseil :','ضع الوجه أمام الكاميرا بإضاءة جيدة وحافظ على مسافة مناسبة للحصول على تتبع أكثر استقراراً.':'Placez votre visage devant la caméra avec un bon éclairage et gardez une distance adaptée pour un suivi plus stable.','قد بحذر من فضلك، عائلتك في إنتظارك':'Conduisez prudemment, votre famille vous attend','• تحيا الجزائر •':'• Vive l’Algérie •',
      'استيقظ فوراً!':'Réveillez-vous !','DROWSINESS DETECTED':'SOMNOLENCE DÉTECTÉE','افتح عينيك وركز على الطريق':'Ouvrez les yeux et concentrez-vous sur la route','حسابك في Anti Sleep System':'Votre compte Anti Sleep System','أنشئ حسابًا أو سجّل الدخول للوصول إلى حسابك من أي جهاز.':'Créez un compte ou connectez-vous pour accéder à votre compte depuis n’importe quel appareil.','تسجيل الدخول':'Connexion','إنشاء حساب':'Créer un compte','البريد الإلكتروني':'E-mail','كلمة المرور':'Mot de passe','الاسم':'Nom','🔐 تسجيل الدخول':'🔐 Connexion','✨ إنشاء الحساب':'✨ Créer le compte','↪ تسجيل الخروج':'↪ Déconnexion',
      'غير مكتوم':'Son activé','مكتوم':'Muet','ممتاز':'Excellent','مستخدم':'Utilisateur','الشاشة مستيقظة':'Écran actif','التطبيق مثبت أو التثبيت غير متاح حاليًا':'L’application est déjà installée ou l’installation est indisponible actuellement','متصل':'Connecté','غير متاح':'Indisponible','غير مدعوم':'Non pris en charge','غير مؤكد':'Non confirmé','غير مكتملة':'Incomplète','مكتملة':'Terminée','انتظار':'En attente','مكتشف':'Détecté','مستقر':'Stable','نشط':'Actif','تشغيل':'En cours','خطأ':'Erreur','جاري المعايرة... افتح عينيك وانظر للكاميرا':'Calibration... Ouvrez les yeux et regardez la caméra','✓ تمت المعايرة':'✓ Calibration terminée','ضع الوجه داخل الإطار وتأكد من الإضاءة.':'Placez votre visage dans le cadre et vérifiez l’éclairage.',
      'عتبة تكيفية: --':'Seuil adaptatif : --','عتبة تكيفية:':'Seuil adaptatif :','منخفض ⚠️':'Faible ⚠️','مدار ↔':'Tourné ↔','في الخلفية':'En arrière-plan','في انتظار التركيز':'En attente du focus','في انتظار العودة':'En attente du retour','محلي — تعذر مزامنة السحابة':'Local — synchronisation cloud indisponible','☁️ الحساب + محلي':'☁️ Compte + local','⛶ ملء الشاشة':'⛶ Plein écran','⤢ إنهاء الشاشة الكاملة':'⤢ Quitter le plein écran','▦ واجهة كاملة':'▦ Interface complète','▦ واجهة مختصرة':'▦ Interface compacte','● متصل':'● Connecté','● وضع عدم الاتصال':'● Hors ligne','🔴 إنذار!':'🔴 Alerte !','😴 مغلقة':'😴 Fermés','🚗 Driver Monitoring Mode مفعل':'🚗 Mode de surveillance activé','👤 الحساب':'👤 Compte',
      'SAFE':'SÛR','LOW':'FAIBLE','MODERATE':'MODÉRÉ','HIGH':'ÉLEVÉ','CRITICAL':'CRITIQUE','جاهز للمراقبة':'Prêt pour la surveillance','الوضع نشط':'Mode actif','تعذر التفعيل':'Échec de l’activation','تعذر الوصول إلى الكاميرا. تأكد من منح الإذن.':'Impossible d’accéder à la caméra. Vérifiez l’autorisation.','تعذر تشغيل الصوت:':'Impossible de démarrer le son :','تعذر تفعيل إبقاء الشاشة مستيقظة':'Impossible de garder l’écran actif','تفعيل أو إيقاف وضع مراقبة السائق':'Activer ou désactiver le mode de surveillance du conducteur','تم إنشاء الحساب وتسجيل الدخول.':'Compte créé et connexion effectuée.','تم إنهاء جلسة المراقبة':'Session de surveillance terminée','تم إيقاف Driver Monitoring Mode':'Mode de surveillance du conducteur désactivé','تم التحرير مؤقتاً':'Libéré temporairement','تم بدء جلسة المراقبة':'Session de surveillance démarrée','تم تثبيت Anti Sleep System بنجاح':'Anti Sleep System installé avec succès','تم تحرير Wake Lock مؤقتاً وسيتم استعادته عند العودة':'Le Wake Lock a été libéré temporairement et sera restauré à votre retour','تم تسجيل الخروج.':'Déconnexion effectuée.','تم تسجيل الدخول بنجاح.':'Connexion réussie.','تم تصدير تقرير الجلسة':'Rapport de session exporté','تم تفعيل الواجهة المختصرة':'Interface compacte activée','تم حذف بيانات المراقبة من MongoDB.':'Données de surveillance supprimées de MongoDB.','تم حذف سجل الجلسات':'Historique des sessions supprimé','تمت استعادة الواجهة الكاملة':'Interface complète restaurée','تمت مزامنة بيانات الحساب.':'Données du compte synchronisées.','هل تريد حذف سجل الجلسات المحفوظ محليًا؟':'Supprimer l’historique des sessions enregistré localement ?','سيتم حذف سجل جلسات المراقبة والإحصائيات من MongoDB نهائيًا. هل تريد المتابعة؟':'Toutes les sessions et statistiques de surveillance seront supprimées définitivement de MongoDB. Continuer ?','حدث خطأ في الخادم':'Une erreur serveur est survenue','خطأ في الكاميرا:':'Erreur caméra :','⏳ جارٍ التشغيل...':'⏳ Démarrage...','⏳ جارٍ التنفيذ...':'⏳ Traitement...','🎯 بدأت المعايرة التلقائية لمدة 8 ثوانٍ':'🎯 Calibration automatique démarrée pour 8 secondes','✅ موقع الإنذار جاهز! اضغط "بدء الكاميرا".':'✅ Système d’alerte prêt ! Appuyez sur "Démarrer la caméra".','8 أحرف على الأقل':'Au moins 8 caractères',
      'هذا البريد الإلكتروني مسجل مسبقًا.':'Cette adresse e-mail est déjà enregistrée.','البريد الإلكتروني أو كلمة المرور غير صحيحة.':'Adresse e-mail ou mot de passe incorrect.','تعذر إنشاء الحساب حاليًا.':'Impossible de créer le compte pour le moment.','تعذر تسجيل الدخول حاليًا.':'Impossible de se connecter pour le moment.','غير مسجل الدخول.':'Non connecté.','الحساب غير موجود.':'Compte introuvable.','جلسة الدخول غير صالحة أو منتهية.':'Session invalide ou expirée.','الاسم يجب أن يكون بين 2 و60 حرفًا.':'Le nom doit contenir entre 2 et 60 caractères.','البريد الإلكتروني غير صالح.':'Adresse e-mail invalide.','كلمة المرور يجب أن تكون بين 8 و128 حرفًا.':'Le mot de passe doit contenir entre 8 et 128 caractères.','حد الإنذار يجب أن يكون بين 0.5 و4 ثوانٍ.':'La limite d’alerte doit être comprise entre 0,5 et 4 secondes.','عتبة EAR غير صالحة.':'Seuil EAR invalide.','تعذر حفظ الإعدادات حاليًا.':'Impossible d’enregistrer les paramètres pour le moment.','مدة الجلسة غير صالحة.':'Durée de session invalide.','عدد التنبيهات غير صالح.':'Nombre d’alertes invalide.','مدة التنبيه غير صالحة.':'Durée d’alerte invalide.','بيانات التحليل غير صالحة.':'Données d’analyse invalides.','تعذر حفظ جلسة المراقبة حاليًا.':'Impossible d’enregistrer la session de surveillance pour le moment.','تعذر تحميل سجل الجلسات حاليًا.':'Impossible de charger l’historique des sessions.','تعذر تحميل الإحصائيات حاليًا.':'Impossible de charger les statistiques.','تعذر حذف بيانات المراقبة حاليًا.':'Impossible de supprimer les données de surveillance.','المسار غير موجود.':'Route introuvable.','محاولات كثيرة. حاول مرة أخرى لاحقًا.':'Trop de tentatives. Réessayez plus tard.','طلبات كثيرة. حاول مرة أخرى لاحقًا.':'Trop de requêtes. Réessayez plus tard.',
      '8 أحرف على الأقل':'Au moins 8 caractères','ث':'s','د':'min','س':'h','/ دقيقة':'/ min','0.0 ث':'0.0 s','0.0ث':'0.0s','0د':'0min','0 / دقيقة':'0 / min'
    }
  };

  const EN_STATIC = {
    'Anti Sleep System by MADOUNINE HACENE': { ar:'Anti Sleep System by MADOUNINE HACENE', fr:'Anti Sleep System par MADOUNINE HACENE' },
    'Anti Sleep System • by MADOUNINE Hacene •': { ar:'Anti Sleep System • par MADOUNINE Hacene •', fr:'Anti Sleep System • par MADOUNINE Hacene •' },
    'WebRTC + MediaPipe FaceMesh + Canvas API + Web Audio API + AI': { ar:'WebRTC + MediaPipe FaceMesh + Canvas API + Web Audio API + AI', fr:'WebRTC + MediaPipe FaceMesh + Canvas API + Web Audio API + IA' },
    'Driver Monitoring Mode': { ar:'وضع مراقبة السائق', fr:'Mode de surveillance du conducteur' },
    'Driver Mode': { ar:'وضع السائق', fr:'Mode conducteur' },
    'Screen Wake Lock': { ar:'إبقاء الشاشة مستيقظة', fr:'Maintien de l’écran' },
    'Monitoring': { ar:'المراقبة', fr:'Surveillance' },
    'Active': { ar:'نشط', fr:'Actif' },
    'Checking': { ar:'جارٍ التحقق', fr:'Vérification' },
    'Offline Ready': { ar:'جاهز دون اتصال', fr:'Prêt hors ligne' },
    'Reduced Motion': { ar:'الحركة المخففة', fr:'Mouvement réduit' },
    'Supported': { ar:'مدعوم', fr:'Pris en charge' },
    'Web App': { ar:'تطبيق ويب', fr:'Application Web' },
    'Service Worker': { ar:'عامل الخدمة', fr:'Service Worker' },
    'Live': { ar:'مباشر', fr:'En direct' },
    'SESSION TIME': { ar:'وقت الجلسة', fr:'DURÉE DE SESSION' },
    'DROWSINESS DETECTED': { ar:'تم اكتشاف النعاس', fr:'SOMNOLENCE DÉTECTÉE' },
    'SAFE': { ar:'آمن', fr:'SÛR' }, 'LOW': { ar:'منخفض', fr:'FAIBLE' }, 'MODERATE': { ar:'متوسط', fr:'MODÉRÉ' }, 'HIGH': { ar:'مرتفع', fr:'ÉLEVÉ' }, 'CRITICAL': { ar:'حرج', fr:'CRITIQUE' },
    'EAR': { ar:'EAR', fr:'EAR' }, 'PERCLOS': { ar:'PERCLOS', fr:'PERCLOS' }, 'Yaw': { ar:'Yaw', fr:'Yaw' }, 'Pitch': { ar:'Pitch', fr:'Pitch' },
    'DROWSINESS WARNING OVERLAY': { ar:'نافذة تحذير النعاس', fr:'FENÊTRE D’ALERTE DE SOMNOLENCE' },
    'Language': { ar:'اللغة', fr:'Langue' }
  };

  // EN_STATIC is a small dictionary for source strings that were originally
  // written in English. IMPORTANT: never put the EN_STATIC objects themselves
  // into T[lang], otherwise DOM textContent receives an object and renders
  // "[object Object]". Each language must contain a plain string only.
  for (const [key, value] of Object.entries(EN_STATIC)) {
    T.ar[key] = value.ar ?? key;
    T.en[key] = value.en ?? key;
    T.fr[key] = value.fr ?? key;
  }

  // Dynamic UI strings that are produced by the monitoring engine.
  const EXTRA = {
    'الوضع المختصر': { ar:'الوضع المختصر', en:'Compact mode', fr:'Mode compact' },
    'الوضع الذكي': { ar:'الوضع الذكي', en:'Smart mode', fr:'Mode intelligent' },
    'الوضع نشط': { ar:'الوضع نشط', en:'Mode active', fr:'Mode actif' },
    'جاهز للمراقبة': { ar:'جاهز للمراقبة', en:'Ready for monitoring', fr:'Prêt pour la surveillance' },
    'جاهز': { ar:'جاهز', en:'Ready', fr:'Prêt' },
    'تشغيل': { ar:'تشغيل', en:'Running', fr:'En cours' },
    'مكتشف': { ar:'مكتشف', en:'Detected', fr:'Détecté' },
    'انتظار': { ar:'انتظار', en:'Waiting', fr:'En attente' },
    'مستقر': { ar:'مستقر', en:'Stable', fr:'Stable' },
    'غير نشط': { ar:'غير نشط', en:'Inactive', fr:'Inactif' },
    'الشاشة مستيقظة': { ar:'الشاشة مستيقظة', en:'Screen awake', fr:'Écran actif' },
    'في انتظار التركيز': { ar:'في انتظار التركيز', en:'Waiting for focus', fr:'En attente du focus' },
    'في انتظار العودة': { ar:'في انتظار العودة', en:'Waiting to return', fr:'En attente du retour' },
    'في الخلفية': { ar:'في الخلفية', en:'In background', fr:'En arrière-plan' },
    'تم التحرير مؤقتاً': { ar:'تم التحرير مؤقتاً', en:'Temporarily released', fr:'Libéré temporairement' },
    'تعذر التفعيل': { ar:'تعذر التفعيل', en:'Activation failed', fr:'Échec de l’activation' },
    'غير مدعوم': { ar:'غير مدعوم', en:'Unsupported', fr:'Non pris en charge' },
    'غير متاح': { ar:'غير متاح', en:'Unavailable', fr:'Indisponible' },
    'متصل': { ar:'متصل', en:'Connected', fr:'Connecté' },
    'خطأ': { ar:'خطأ', en:'Error', fr:'Erreur' },
    'تم بدء جلسة المراقبة': { ar:'تم بدء جلسة المراقبة', en:'Monitoring session started', fr:'Session de surveillance démarrée' },
    'تم إنهاء جلسة المراقبة': { ar:'تم إنهاء جلسة المراقبة', en:'Monitoring session ended', fr:'Session de surveillance terminée' },
    'موقع الإنذار جاهز! اضغط "بدء الكاميرا".': { ar:'موقع الإنذار جاهز! اضغط "بدء الكاميرا".', en:'Alarm system ready! Press "Start camera".', fr:'Système d’alerte prêt ! Appuyez sur "Démarrer la caméra".' }
  };
  for (const [key, value] of Object.entries(EXTRA)) {
    T.ar[key] = value.ar; T.en[key] = value.en; T.fr[key] = value.fr;
  }

  // Keep a canonical source for every translated text node/attribute.
  const originalText = new WeakMap();
  const originalAttr = new WeakMap();
  let applying = false;

  function currentLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }

  function normalize(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
  }

  const reverseMap = new Map();

  function rebuildReverseMap() {
    reverseMap.clear();
    const allKeys = new Set([
      ...Object.keys(T.ar || {}),
      ...Object.keys(T.en || {}),
      ...Object.keys(T.fr || {}),
      ...Object.keys(EN_STATIC || {}),
      ...Object.keys(EXTRA || {})
    ]);
    for (const key of allKeys) {
      const candidates = [
        key,
        T.ar?.[key],
        T.en?.[key],
        T.fr?.[key],
        EN_STATIC?.[key]?.ar,
        EN_STATIC?.[key]?.en,
        EN_STATIC?.[key]?.fr,
        EXTRA?.[key]?.ar,
        EXTRA?.[key]?.en,
        EXTRA?.[key]?.fr
      ];
      for (const candidate of candidates) {
        if (candidate == null || typeof candidate !== 'string') continue;
        const normalized = normalize(candidate);
        if (normalized) reverseMap.set(normalized, key);
      }
    }
  }

  // Guarantee that every key exists in every language as a plain string.
  // This prevents missing-key crashes and keeps language switching reversible.
  const ALL_TRANSLATION_KEYS = new Set([...Object.keys(T.ar), ...Object.keys(T.en), ...Object.keys(T.fr)]);
  for (const key of ALL_TRANSLATION_KEYS) {
    if (typeof T.ar[key] !== 'string') T.ar[key] = key;
    if (typeof T.en[key] !== 'string') T.en[key] = T.en[key] == null ? key : String(T.en[key]);
    if (typeof T.fr[key] !== 'string') T.fr[key] = T.fr[key] == null ? (T.en[key] || key) : String(T.fr[key]);
  }

  rebuildReverseMap();

  function translateString(value, lang = currentLang()) {
    if (value == null || value === '') return value;

    // Never allow an object to reach a DOM text node. This is the exact cause
    // of the previous "[object Object]" rendering bug.
    if (typeof value === 'object') {
      if (typeof value[lang] === 'string') return value[lang];
      if (typeof value.en === 'string') return value.en;
      if (typeof value.fr === 'string') return value.fr;
      if (typeof value.ar === 'string') return value.ar;
      return '';
    }

    const raw = String(value);
    const key = normalize(raw);
    const canonicalKey = reverseMap.get(key) || key;
    const translated = T[lang]?.[canonicalKey];

    if (typeof translated === 'string' && translated.length) return translated;

    // Mixed/dynamic strings: translate known fragments while preserving numbers
    // and runtime values such as "12.4 FPS" or "🚨 2 • ...".
    let out = raw;
    const candidates = [];
    for (const canonical of Object.keys(T.ar || {})) {
      const variants = [canonical, T.ar?.[canonical], T.en?.[canonical], T.fr?.[canonical]];
      for (const variant of variants) {
        if (typeof variant === 'string' && normalize(variant).length > 1) {
          candidates.push([String(variant), T[lang]?.[canonical]]);
        }
      }
    }
    candidates.sort((a,b) => b[0].length - a[0].length);
    for (const [source, target] of candidates) {
      if (typeof target !== 'string' || !target || source === target) continue;
      if (out.includes(source)) out = out.split(source).join(target);
    }

    // Dynamic units.
    if (/\d[\d.,]*\s*ث/.test(out)) out = out.replace(/(\d[\d.,]*)\s*ث/g, '$1 s');
    if (/\d[\d.,]*\s*د/.test(out)) out = out.replace(/(\d[\d.,]*)\s*د/g, '$1 min');
    if (/\d[\d.,]*\s*س/.test(out)) out = out.replace(/(\d[\d.,]*)\s*س/g, '$1 h');
    if (/\/\s*دقيقة/.test(out)) out = out.replace(/\/\s*دقيقة/g, '/ min');
    if (out.startsWith('عتبة تكيفية:')) out = out.replace('عتبة تكيفية:', lang === 'fr' ? 'Seuil adaptatif :' : 'Adaptive threshold:');

    return out;
  }

  function shouldSkip(node) {
    const el = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    if (!el) return true;
    const blocked = el.closest('script,style,noscript,template,[data-i18n-skip]');
    return !!blocked;
  }

  function rememberText(node) {
    if (node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  }

  function translateTextNode(node, lang) {
    if (node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) return;
    rememberText(node);
    const source = originalText.get(node);
    const translated = translateString(source, lang);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  }

  function translateAttributes(root, lang) {
    const nodes = [];
    if (root.nodeType === Node.ELEMENT_NODE) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll('*'));
    nodes.forEach(el => {
      if (el.closest('script,style,noscript,template,[data-i18n-skip]')) return;
      for (const attr of ['placeholder','title','aria-label','aria-description']) {
        if (!el.hasAttribute(attr)) continue;
        let bag = originalAttr.get(el);
        if (!bag) { bag = {}; originalAttr.set(el, bag); }
        if (bag[attr] == null) bag[attr] = el.getAttribute(attr);

        // IMPORTANT:
        // Only write the attribute when its translated value is actually
        // different. Otherwise MutationObserver can observe its own
        // setAttribute() call forever and freeze the application when
        // switching languages.
        const translated = translateString(bag[attr], lang);
        if (el.getAttribute(attr) !== translated) {
          el.setAttribute(attr, translated);
        }
      }
    });
  }

  function walk(root, lang) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => translateTextNode(n, lang));
    translateAttributes(root, lang);
  }

  function updateDirection(lang) {
    const rtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body?.classList.toggle('language-rtl', rtl);
    document.body?.classList.toggle('language-ltr', !rtl);
  }

  function updateLanguageButtons(lang) {
    document.querySelectorAll('[data-language]').forEach(btn => {
      const active = btn.dataset.language === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateMeta(lang) {
    const titles = {
      ar: 'Anti Sleep System by MADOUNINE HACENE',
      en: 'Anti Sleep System by MADOUNINE HACENE',
      fr: 'Anti Sleep System par MADOUNINE HACENE'
    };
    const descriptions = {
      ar: 'نظام احترافي لمراقبة النعاس أثناء القيادة، يعمل محلياً داخل المتصفح مع حماية الخصوصية.',
      en: 'Professional browser-based driver drowsiness monitoring with local analysis and privacy-first design.',
      fr: 'Système professionnel de surveillance de la somnolence du conducteur, avec analyse locale et protection de la vie privée.'
    };
    document.title = titles[lang];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', descriptions[lang]);
  }

  function setLanguage(lang, persist = true) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    if (persist) localStorage.setItem(LANG_KEY, lang);
    applying = true;
    try {
      updateDirection(lang);
      walk(document.body, lang);
      translateAttributes(document.documentElement, lang);
      updateMeta(lang);
      updateLanguageButtons(lang);
    } finally {
      applying = false;
    }
    window.dispatchEvent(new CustomEvent('antiSleepLanguageChanged', { detail: { lang } }));
  }

  window.t = function (key, fallback) {
    const lang = currentLang();
    const value = T[lang]?.[key] ?? (lang === 'ar' ? key : T.en?.[key]) ?? fallback ?? key;
    return translateString(value, lang);
  };

  window.getAntiSleepLanguage = currentLang;
  window.setAntiSleepLanguage = setLanguage;

  function init() {
    // Add the language switcher without touching existing controls.
    const toolActions = document.querySelector('.tool-actions');
    if (toolActions && !document.getElementById('languageSwitcher')) {
      const wrap = document.createElement('div');
      wrap.className = 'language-switcher';
      wrap.id = 'languageSwitcher';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Language');
      wrap.innerHTML = '<span class="language-icon">🌐</span><button type="button" data-language="ar" aria-pressed="true">AR</button><button type="button" data-language="fr" aria-pressed="false">FR</button><button type="button" data-language="en" aria-pressed="false">EN</button>';
      const compact = document.getElementById('compactBtn');
      toolActions.insertBefore(wrap, compact || toolActions.firstChild);
    }

    document.querySelectorAll('[data-language]').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.language));
    });

    // Remember source text before the first translation.
    walk(document.body, 'ar');
    setLanguage(currentLang(), false);

    const observer = new MutationObserver(records => {
      if (applying) return;
      const lang = currentLang();
      applying = true;
      for (const record of records) {
        if (record.type === 'characterData') translateTextNode(record.target, lang);
        else if (record.type === 'childList') record.addedNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, lang);
          else if (node.nodeType === Node.ELEMENT_NODE) walk(node, lang);
        });
        else if (record.type === 'attributes') translateAttributes(record.target, lang);
      }
      applying = false;
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder','title','aria-label','aria-description'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
