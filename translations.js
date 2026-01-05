// Internationalization and Translation Module
class Translator {
    constructor() {
        this.userLanguage = navigator.language || navigator.userLanguage;
        this.userCountry = this.getCountryFromLanguage();
        this.translations = {};
        this.init();
    }

    init() {
        // Load translations based on user's country/language
        this.loadTranslations();
        
        // Check for saved language preference
        this.loadSavedLanguage();
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred_language');
        if (savedLang) {
            this.userCountry = savedLang;
            this.applyTranslations();
            
            // Update language selector
            setTimeout(() => {
                const langSelect = document.getElementById('languageSelect');
                if (langSelect) {
                    langSelect.value = savedLang;
                }
            }, 100);
        }
    }

    getCountryFromLanguage() {
        const lang = this.userLanguage;
        if (lang.includes('-')) {
            return lang.split('-')[1].toUpperCase();
        }
        
        const languageToCountry = {
            'en': 'US',
            'bn': 'BD',
            'hi': 'IN',
            'ar': 'SA',
            'fr': 'FR',
            'de': 'DE',
            'es': 'ES',
            'pt': 'PT',
            'zh': 'CN',
            'ja': 'JP',
            'ko': 'KR',
            'ru': 'RU'
        };
        
        return languageToCountry[lang.split('-')[0]] || 'US';
    }

    loadTranslations() {
        this.translations = {
            'BD': {
                'title': 'Authenticator Code Generator',
                'subtitle': 'TOTP-ভিত্তিক নিরাপদ দ্বি-পদক্ষেপ যাচাইকরণ কোড তৈরি করুন',
                'setup_key': 'আপনার সেটআপ কী দিন',
                'secret_key_placeholder': 'আপনার সিক্রেট কী এখানে লিখুন বা পেষ্ট করুন (Base16/32 ফরম্যাট)',
                'clear': 'ক্লিয়ার',
                'key_tip': 'টিপ: গুগল অথেন্টিকেটর, মাইক্রোসফট অথেন্টিকেটর এর সাথে সামঞ্জস্যপূর্ণ',
                'current_otp': 'বর্তমান ওটিপি কোড',
                'copy_code': 'কোড কপি করুন',
                'save_key_code': 'কী+কোড সংরক্ষণ করুন',
                'enter_key_for_code': 'কোড দেখতে সিক্রেট কী দিন',
                'generate_code': 'কোড জেনারেট করুন',
                'how_to_use': 'কিভাবে ব্যবহার করবেন?',
                'step1': 'আপনার অ্যাকাউন্টের সিক্রেট কী (Base16/32 ফরম্যাট) ইনপুট বক্সে লিখুন। গুগল, মাইক্রোসফট, ফেসবুক ইত্যাদির ২-ফ্যাক্টর অথেন্টিকেশন কী কাজ করবে।',
                'step2': '"কোড জেনারেট করুন" বাটনে ক্লিক করুন বা স্বয়ংক্রিয়ভাবে কোড তৈরি দেখুন।',
                'step3': '৬-অঙ্কের কোডটি ৩০ সেকেন্ডের জন্য বৈধ থাকবে। "কোড কপি করুন" বাটনে ক্লিক করে ব্যবহার করুন।',
                'step4': '"কী+কোড সংরক্ষণ করুন" বাটনে ক্লিক করে আপনার কী এবং কোড একটি টেক্সট ফাইল হিসেবে ডাউনলোড করুন।',
                'example_keys': 'উদাহরণ কী (পরীক্ষার জন্য)',
                'use_key': 'ব্যবহার করুন',
                'security_notice': 'এটি একটি নিরাপদ TOTP কোড জেনারেটর। আপনার সিক্রেট কী ব্রাউজার মেমোরিতে সংরক্ষিত হয় কিন্তু সার্ভারে পাঠানো হয় না।',
                'published_by': 'Published by',
                'apply_language': 'ভাষা প্রয়োগ করুন',
                'notification_copied': 'কোড ক্লিপবোর্ডে কপি করা হয়েছে!',
                'notification_invalid_key': 'প্রথমে একটি বৈধ কী ইনপুট করুন',
                'notification_invalid_code': 'প্রথমে একটি বৈধ কোড জেনারেট করুন',
                'notification_key_cleared': 'সিক্রেট কী ক্লিয়ার করা হয়েছে',
                'notification_example_used': 'উদাহরণ কী ব্যবহার করা হয়েছে!',
                'notification_saved': 'কী এবং কোড ফাইল হিসেবে ডাউনলোড হয়েছে!',
                'notification_copy_error': 'কোড কপি করতে সমস্যা হয়েছে',
                'notification_language_changed': 'ভাষা পরিবর্তন করা হয়েছে!'
            },
            
            'US': {
                'title': 'Authenticator Code Generator',
                'subtitle': 'Generate secure TOTP-based two-factor authentication codes',
                'setup_key': 'Enter Your Setup Key',
                'secret_key_placeholder': 'Enter or paste your secret key here (Base16/32 Format)',
                'clear': 'Clear',
                'key_tip': 'Tip: Compatible with Google Authenticator, Microsoft Authenticator',
                'current_otp': 'Current OTP Code',
                'copy_code': 'Copy Code',
                'save_key_code': 'Save Key + Code',
                'enter_key_for_code': 'Enter secret key to see code',
                'generate_code': 'Generate Code',
                'how_to_use': 'How to Use?',
                'step1': 'Enter your account secret key (Base16/32 Format) in the input box. Works with Google, Microsoft, Facebook, etc. 2-factor authentication keys.',
                'step2': 'Click "Generate Code" button or watch the code generate automatically.',
                'step3': 'The 6-digit code will be valid for 30 seconds. Click "Copy Code" to use it.',
                'step4': 'Click "Save Key + Code" to download your key and code as a text file.',
                'example_keys': 'Example Keys (For Testing)',
                'use_key': 'Use',
                'security_notice': 'This is a secure TOTP code generator. Your secret key is stored in browser memory but not sent to any server.',
                'published_by': 'Published by',
                'apply_language': 'Apply Language',
                'notification_copied': 'Code copied to clipboard!',
                'notification_invalid_key': 'Please enter a valid key first',
                'notification_invalid_code': 'Please generate a valid code first',
                'notification_key_cleared': 'Secret key cleared',
                'notification_example_used': 'Example key used!',
                'notification_saved': 'Key and code downloaded as file!',
                'notification_copy_error': 'Error copying code',
                'notification_language_changed': 'Language changed successfully!'
            },
            
            'IN': {
                'title': 'Authenticator Code Generator',
                'subtitle': 'TOTP-आधारित सुरक्षित दो-चरणीय प्रमाणीकरण कोड जनरेट करें',
                'setup_key': 'अपनी सेटअप कुंजी दर्ज करें',
                'secret_key_placeholder': 'अपनी सीक्रेट की यहाँ दर्ज करें या पेस्ट करें (Base16/32 प्रारूप)',
                'clear': 'साफ करें',
                'key_tip': 'टिप: Google Authenticator, Microsoft Authenticator के साथ संगत',
                'current_otp': 'वर्तमान OTP कोड',
                'copy_code': 'कोड कॉपी करें',
                'save_key_code': 'कुंजी+कोड सहेजें',
                'enter_key_for_code': 'कोड देखने के लिए सीक्रेट की दर्ज करें',
                'generate_code': 'कोड जनरेट करें',
                'how_to_use': 'कैसे उपयोग करें?',
                'step1': 'अपने खाते की सीक्रेट की (Base16/32 प्रारूप) इनपुट बॉक्स में दर्ज करें। Google, Microsoft, Facebook आदि के 2-कारक प्रमाणीकरण कुंजियाँ काम करेंगी।',
                'step2': '"कोड जनरेट करें" बटन पर क्लिक करें या स्वचालित रूप से कोड जनरेट होते देखें।',
                'step3': '6-अंकीय कोड 30 सेकंड के लिए वैध रहेगा। उपयोग करने के लिए "कोड कॉपी करें" बटन पर क्लिक करें।',
                'step4': 'अपनी कुंजी और कोड को टेक्स्ट फ़ाइल के रूप में डाउनलोड करने के लिए "कुंजी+कोड सहेजें" बटन पर क্লिक करें।',
                'example_keys': 'उदाहरण कुंजियाँ (परीक्षण के लिए)',
                'use_key': 'उपयोग करें',
                'security_notice': 'यह एक सुरक्षित TOTP कोड जनरेटर है। आपकी सीक्रेट की ब्राउज़र मेमोरी में संग्रहीत है लेकिन सर्वर पर नहीं भेजी जाती है।',
                'published_by': 'Published by',
                'apply_language': 'भाषा लागू करें',
                'notification_copied': 'कोड क्लिपबोर्ड पर कॉपी किया गया!',
                'notification_invalid_key': 'पहले एक वैध कुंजी दर्ज करें',
                'notification_invalid_code': 'पहले एक वैध कोड जनरेट करें',
                'notification_key_cleared': 'सीक्रेट की साफ की गई',
                'notification_example_used': 'उदाहरण कुंजी का उपयोग किया गया!',
                'notification_saved': 'कुंजी और कोड फ़ाइल के रूप में डाउनलोड किया गया!',
                'notification_copy_error': 'कोड कॉपी करने में त्रुटि',
                'notification_language_changed': 'भाषा सफलतापूर्वक बदली गई!'
            },
            
            'SA': {
                'title': 'مولد رمز المصادقة',
                'subtitle': 'قم بإنشاء رموز المصادقة الثنائية الآمنة القائمة على TOTP',
                'setup_key': 'أدخل مفتاح الإعداد الخاص بك',
                'secret_key_placeholder': 'أدخل أو الصق مفتاحك السري هنا (تنسيق Base16/32)',
                'clear': 'مسح',
                'key_tip': 'ملاحظة: متوافق مع Google Authenticator، Microsoft Authenticator',
                'current_otp': 'رمز OTP الحالي',
                'copy_code': 'نسخ الرمز',
                'save_key_code': 'حفظ المفتاح + الرمز',
                'enter_key_for_code': 'أدخل المفتاح السري لرؤية الرمز',
                'generate_code': 'إنشاء الرمز',
                'how_to_use': 'كيفية الاستخدام؟',
                'step1': 'أدخل مفتاح حسابك السري (تنسيق Base16/32) في مربع الإدخال. يعمل مع مفاتيح المصادقة الثنائية لـ Google، Microsoft، Facebook، إلخ.',
                'step2': 'انقر على زر "إنشاء الرمز" أو شاهد الرمز ينشأ تلقائياً.',
                'step3': 'سيكون الرمز المكون من 6 أرقام صالحاً لمدة 30 ثانية. انقر على "نسخ الرمز" لاستخدامه.',
                'step4': 'انقر على "حفظ المفتاح + الرمز" لتنزيل مفتاحك ورمزك كملف نصي.',
                'example_keys': 'مفاتيح مثال (لأغراض الاختبار)',
                'use_key': 'استخدام',
                'security_notice': 'هذا مولد رموز TOTP آمن. يتم تخزين مفتاحك السري في ذاكرة المتصفح ولكن لا يتم إرساله إلى أي خادم.',
                'published_by': 'منشور بواسطة',
                'apply_language': 'تطبيق اللغة',
                'notification_copied': 'تم نسخ الرمز إلى الحافظة!',
                'notification_invalid_key': 'الرجاء إدخال مفتاح صحيح أولاً',
                'notification_invalid_code': 'الرجاء إنشاء رمز صحيح أولاً',
                'notification_key_cleared': 'تم مسح المفتاح السري',
                'notification_example_used': 'تم استخدام المفتاح المثال!',
                'notification_saved': 'تم تنزيل المفتاح والرمز كملف!',
                'notification_copy_error': 'خطأ في نسخ الرمز',
                'notification_language_changed': 'تم تغيير اللغة بنجاح!'
            },
            
            'FR': {
                'title': 'Générateur de Code Authenticator',
                'subtitle': 'Générez des codes d\'authentification à deux facteurs sécurisés basés sur TOTP',
                'setup_key': 'Entrez Votre Clé de Configuration',
                'secret_key_placeholder': 'Entrez ou collez votre clé secrète ici (Format Base16/32)',
                'clear': 'Effacer',
                'key_tip': 'Astuce: Compatible avec Google Authenticator، Microsoft Authenticator',
                'current_otp': 'Code OTP Actuel',
                'copy_code': 'Copier le Code',
                'save_key_code': 'Sauvegarder Clé + Code',
                'enter_key_for_code': 'Entrez la clé secrète pour voir le code',
                'generate_code': 'Générer le Code',
                'how_to_use': 'Comment Utiliser?',
                'step1': 'Entrez votre clé secrète de compte (Format Base16/32) dans la boîte de saisie. Fonctionne avec les clés d\'authentification à deux facteurs de Google، Microsoft، Facebook، etc.',
                'step2': 'Cliquez sur le bouton "Générer le Code" ou regardez le code se générer automatiquement.',
                'step3': 'Le code à 6 chiffres sera valable pendant 30 secondes. Cliquez sur "Copier le Code" pour l\'utiliser.',
                'step4': 'Cliquez sur "Sauvegarder Clé + Code" pour télécharger votre clé et votre code sous forme de fichier texte.',
                'example_keys': 'Clés d\'Exemple (Pour les Tests)',
                'use_key': 'Utiliser',
                'security_notice': 'Ceci est un générateur de code TOTP sécurisé. Votre clé secrète est stockée dans la mémoire du navigateur mais n\'est pas envoyée à un serveur.',
                'published_by': 'Publié par',
                'apply_language': 'Appliquer la Langue',
                'notification_copied': 'Code copié dans le presse-papiers!',
                'notification_invalid_key': 'Veuillez d\'abord entrer une clé valide',
                'notification_invalid_code': 'Veuillez d\'abord générer un code valide',
                'notification_key_cleared': 'Clé secrète effacée',
                'notification_example_used': 'Clé d\'exemple utilisée!',
                'notification_saved': 'Clé et code téléchargés sous forme de fichier!',
                'notification_copy_error': 'Erreur lors de la copie du code',
                'notification_language_changed': 'Langue changée avec succès!'
            },
            
            'DE': {
                'title': 'Authenticator Code Generator',
                'subtitle': 'Erzeugen Sie sichere TOTP-basierte Zwei-Faktor-Authentifizierungscodes',
                'setup_key': 'Geben Sie Ihren Setup-Schlüssel ein',
                'secret_key_placeholder': 'Geben Sie hier Ihren geheimen Schlüssel ein oder fügen Sie ihn ein (Base16/32 Format)',
                'clear': 'Löschen',
                'key_tip': 'Tipp: Kompatibel mit Google Authenticator، Microsoft Authenticator',
                'current_otp': 'Aktueller OTP-Code',
                'copy_code': 'Code kopieren',
                'save_key_code': 'Schlüssel + Code speichern',
                'enter_key_for_code': 'Geben Sie den geheimen Schlüssel ein، um den Code zu sehen',
                'generate_code': 'Code generieren',
                'how_to_use': 'Wie verwendet man?',
                'step1': 'Geben Sie Ihren geheimen Kontoschlüssel (Base16/32 Format) in das Eingabefeld ein. Funktioniert mit 2-Faktor-Authentifizierungsschlüsseln von Google، Microsoft، Facebook، usw.',
                'step2': 'Klicken Sie auf die Schaltfläche "Code generieren" oder beobachten Sie، wie der Code automatisch generiert wird.',
                'step3': 'Der 6-stellige Code ist 30 Sekunden lang gültig. Klicken Sie auf "Code kopieren"، um ihn zu verwenden.',
                'step4': 'Klicken Sie auf "Schlüssel + Code speichern"، um Ihren Schlüssel und Code als Textdatei herunterzuladen.',
                'example_keys': 'Beispielschlüssel (Zum Testen)',
                'use_key': 'Verwenden',
                'security_notice': 'Dies ist ein sicherer TOTP-Code-Generator. Ihr geheimer Schlüssel wird im Browserspeicher gespeichert، aber nicht an einen Server gesendet.',
                'published_by': 'Veröffentlicht von',
                'apply_language': 'Sprache anwenden',
                'notification_copied': 'Code in die Zwischenablage kopiert!',
                'notification_invalid_key': 'Bitte geben Sie zuerst einen gültigen Schlüssel ein',
                'notification_invalid_code': 'Bitte generieren Sie zuerst einen gültigen Code',
                'notification_key_cleared': 'Geheimer Schlüssel gelöscht',
                'notification_example_used': 'Beispielschlüssel verwendet!',
                'notification_saved': 'Schlüssel und Code als Datei heruntergeladen!',
                'notification_copy_error': 'Fehler beim Kopieren des Codes',
                'notification_language_changed': 'Sprache erfolgreich geändert!'
            },
            
            'ES': {
                'title': 'Generador de Código Authenticator',
                'subtitle': 'Genere códigos seguros de autenticación de dos factores basados en TOTP',
                'setup_key': 'Ingrese Su Clave de Configuración',
                'secret_key_placeholder': 'Ingrese o pegue su clave secreta aquí (Formato Base16/32)',
                'clear': 'Limpiar',
                'key_tip': 'Consejo: Compatible con Google Authenticator، Microsoft Authenticator',
                'current_otp': 'Código OTP Actual',
                'copy_code': 'Copiar Código',
                'save_key_code': 'Guardar Clave + Código',
                'enter_key_for_code': 'Ingrese la clave secreta para ver el código',
                'generate_code': 'Generar Código',
                'how_to_use': '¿Cómo Usar?',
                'step1': 'Ingrese su clave secreta de cuenta (Formato Base16/32) en el cuadro de entrada. Funciona con claves de autenticación de dos factores de Google، Microsoft، Facebook، etc.',
                'step2': 'Haga clic en el botón "Generar Código" o vea el código generarse automáticamente.',
                'step3': 'El código de 6 dígitos será válido por 30 segundos. Haga clic en "Copiar Código" para usarlo.',
                'step4': 'Haga clic en "Guardar Clave + Código" para descargar su clave y código como archivo de texto.',
                'example_keys': 'Claves de Ejemplo (Para Pruebas)',
                'use_key': 'Usar',
                'security_notice': 'Este es un generador de código TOTP seguro. Su clave secreta se almacena en la memoria del navegador pero no se envía a ningún servidor.',
                'published_by': 'Publicado por',
                'apply_language': 'Aplicar Idioma',
                'notification_copied': '¡Código copiado al portapapeles!',
                'notification_invalid_key': 'Por favor، ingrese una clave válida primero',
                'notification_invalid_code': 'Por favor، genere un código válido primero',
                'notification_key_cleared': 'Clave secreta limpiada',
                'notification_example_used': '¡Clave de ejemplo utilizada!',
                'notification_saved': '¡Clave y código descargados como archivo!',
                'notification_copy_error': 'Error al copiar el código',
                'notification_language_changed': '¡Idioma cambiado exitosamente!'
            },
            
            'PT': {
                'title': 'Gerador de Código Authenticator',
                'subtitle': 'Gere códigos seguros de autenticação de dois fatores baseados em TOTP',
                'setup_key': 'Digite Sua Chave de Configuração',
                'secret_key_placeholder': 'Digite ou cole sua chave secreta aqui (Formato Base16/32)',
                'clear': 'Limpar',
                'key_tip': 'Dica: Compatível com Google Authenticator، Microsoft Authenticator',
                'current_otp': 'Código OTP Atual',
                'copy_code': 'Copiar Código',
                'save_key_code': 'Salvar Chave + Código',
                'enter_key_for_code': 'Digite a chave secreta para ver o código',
                'generate_code': 'Gerar Código',
                'how_to_use': 'Como Usar?',
                'step1': 'Digite sua chave secreta da conta (Formato Base16/32) na caixa de entrada. Funciona com chaves de autenticação de dois fatores do Google، Microsoft، Facebook، etc.',
                'step2': 'Clique no botão "Gerar Código" ou veja o código ser gerado automaticamente.',
                'step3': 'O código de 6 dígitos será válido por 30 segundos. Clique em "Copiar Código" para usá-lo.',
                'step4': 'Clique em "Salvar Chave + Código" para baixar sua chave e código como um arquivo de texto.',
                'example_keys': 'Chaves de Exemplo (Para Testes)',
                'use_key': 'Usar',
                'security_notice': 'Este é um gerador de código TOTP seguro. Sua chave secreta é armazenada na memória do navegador mas não é enviada a nenhum servidor.',
                'published_by': 'Publicado por',
                'apply_language': 'Aplicar Idioma',
                'notification_copied': 'Código copiado para a área de transferência!',
                'notification_invalid_key': 'Por favor، digite uma chave válida primeiro',
                'notification_invalid_code': 'Por favor، gere um código válido primeiro',
                'notification_key_cleared': 'Chave secreta limpa',
                'notification_example_used': 'Chave de exemplo usada!',
                'notification_saved': 'Chave e código baixados como arquivo!',
                'notification_copy_error': 'Erro ao copiar o código',
                'notification_language_changed': 'Idioma alterado com sucesso!'
            },
            
            'CN': {
                'title': '验证器代码生成器',
                'subtitle': '生成基于TOTP的安全双因素身份验证代码',
                'setup_key': '输入您的设置密钥',
                'secret_key_placeholder': '在此输入或粘贴您的密钥（Base16/32格式）',
                'clear': '清除',
                'key_tip': '提示：兼容Google验证器，Microsoft验证器',
                'current_otp': '当前OTP代码',
                'copy_code': '复制代码',
                'save_key_code': '保存密钥 + 代码',
                'enter_key_for_code': '输入密钥以查看代码',
                'generate_code': '生成代码',
                'how_to_use': '如何使用？',
                'step1': '在输入框中输入您的账户密钥（Base16/32格式）。适用于Google、Microsoft、Facebook等的双因素身份验证密钥。',
                'step2': '点击"生成代码"按钮或观看代码自动生成。',
                'step3': '6位代码将在30秒内有效。点击"复制代码"以使用它。',
                'step4': '点击"保存密钥 + 代码"将您的密钥和代码下载为文本文件。',
                'example_keys': '示例密钥（用于测试）',
                'use_key': '使用',
                'security_notice': '这是一个安全的TOTP代码生成器。您的密钥存储在浏览器内存中，但不会发送到任何服务器。',
                'published_by': '发布者',
                'apply_language': '应用语言',
                'notification_copied': '代码已复制到剪贴板！',
                'notification_invalid_key': '请先输入有效的密钥',
                'notification_invalid_code': '请先生成有效的代码',
                'notification_key_cleared': '密钥已清除',
                'notification_example_used': '已使用示例密钥！',
                'notification_saved': '密钥和代码已下载为文件！',
                'notification_copy_error': '复制代码时出错',
                'notification_language_changed': '语言更改成功！'
            },
            
            'JP': {
                'title': '認証コードジェネレーター',
                'subtitle': '安全なTOTPベースの二要素認証コードを生成',
                'setup_key': 'セットアップキーを入力',
                'secret_key_placeholder': 'ここにシークレットキーを入力または貼り付け（Base16/32形式）',
                'clear': 'クリア',
                'key_tip': 'ヒント：Google認証システム、Microsoft認証システムと互換性あり',
                'current_otp': '現在のOTPコード',
                'copy_code': 'コードをコピー',
                'save_key_code': 'キー+コードを保存',
                'enter_key_for_code': 'コードを表示するにはシークレットキーを入力',
                'generate_code': 'コードを生成',
                'how_to_use': '使用方法',
                'step1': 'アカウントのシークレットキー（Base16/32形式）を入力ボックスに入力します。Google、Microsoft、Facebookなどの二要素認証キーに対応しています。',
                'step2': '「コードを生成」ボタンをクリックするか、自動的にコードが生成されるのを見ます。',
                'step3': '6桁のコードは30秒間有効です。使用するには「コードをコピー」をクリックします。',
                'step4': '「キー+コードを保存」をクリックして、キーとコードをテキストファイルとしてダウンロードします。',
                'example_keys': 'サンプルキー（テスト用）',
                'use_key': '使用',
                'security_notice': 'これは安全なTOTPコードジェネレーターです。シークレットキーはブラウザのメモリに保存されますが、サーバーには送信されません。',
                'published_by': '発行者',
                'apply_language': '言語を適用',
                'notification_copied': 'コードをクリップボードにコピーしました！',
                'notification_invalid_key': 'まず有効なキーを入力してください',
                'notification_invalid_code': 'まず有効なコードを生成してください',
                'notification_key_cleared': 'シークレットキーをクリアしました',
                'notification_example_used': 'サンプルキーを使用しました！',
                'notification_saved': 'キーとコードをファイルとしてダウンロードしました！',
                'notification_copy_error': 'コードのコピー中にエラーが発生しました',
                'notification_language_changed': '言語を正常に変更しました！'
            },
            
            'KR': {
                'title': '인증 코드 생성기',
                'subtitle': '안전한 TOTP 기반 2단계 인증 코드 생성',
                'setup_key': '설정 키 입력',
                'secret_key_placeholder': '여기에 비밀 키를 입력하거나 붙여넣기 (Base16/32 형식)',
                'clear': '지우기',
                'key_tip': '팁: Google Authenticator، Microsoft Authenticator와 호환',
                'current_otp': '현재 OTP 코드',
                'copy_code': '코드 복사',
                'save_key_code': '키+코드 저장',
                'enter_key_for_code': '코드를 보려면 비밀 키 입력',
                'generate_code': '코드 생성',
                'how_to_use': '사용 방법',
                'step1': '계정 비밀 키 (Base16/32 형식)를 입력 상자에 입력하세요. Google، Microsoft، Facebook 등의 2단계 인증 키와 작동합니다.',
                'step2': '"코드 생성" 버튼을 클릭하거나 코드가 자동으로 생성되는 것을 확인하세요.',
                'step3': '6자리 코드는 30초 동안 유효합니다. 사용하려면 "코드 복사"를 클릭하세요.',
                'step4': '"키+코드 저장"을 클릭하여 키와 코드를 텍스트 파일로 다운로드하세요.',
                'example_keys': '예제 키 (테스트용)',
                'use_key': '사용',
                'security_notice': '이것은 안전한 TOTP 코드 생성기입니다. 비밀 키는 브라우저 메모리에 저장되지만 서버로 전송되지 않습니다.',
                'published_by': '게시자',
                'apply_language': '언어 적용',
                'notification_copied': '코드가 클립보드에 복사되었습니다!',
                'notification_invalid_key': '먼저 유효한 키를 입력하세요',
                'notification_invalid_code': '먼저 유효한 코드를 생성하세요',
                'notification_key_cleared': '비밀 키가 지워졌습니다',
                'notification_example_used': '예제 키가 사용되었습니다!',
                'notification_saved': '키와 코드가 파일로 다운로드되었습니다!',
                'notification_copy_error': '코드 복사 중 오류 발생',
                'notification_language_changed': '언어가 성공적으로 변경되었습니다!'
            },
            
            'RU': {
                'title': 'Генератор кода аутентификатора',
                'subtitle': 'Создавайте безопасные коды двухфакторной аутентификации на основе TOTP',
                'setup_key': 'Введите ваш ключ настройки',
                'secret_key_placeholder': 'Введите или вставьте ваш секретный ключ здесь (формат Base16/32)',
                'clear': 'Очистить',
                'key_tip': 'Совет: Совместим с Google Authenticator، Microsoft Authenticator',
                'current_otp': 'Текущий код OTP',
                'copy_code': 'Копировать код',
                'save_key_code': 'Сохранить ключ + код',
                'enter_key_for_code': 'Введите секретный ключ для просмотра кода',
                'generate_code': 'Сгенерировать код',
                'how_to_use': 'Как использовать?',
                'step1': 'Введите ваш секретный ключ аккаунта (формат Base16/32) в поле ввода. Работает с ключами двухфакторной аутентификации Google، Microsoft، Facebook и т.д.',
                'step2': 'Нажмите кнопку "Сгенерировать код" или наблюдайте، как код генерируется автоматически.',
                'step3': '6-значный код будет действителен в течение 30 секунд. Нажмите "Копировать код"， чтобы использовать его.',
                'step4': 'Нажмите "Сохранить ключ + код"， чтобы загрузить ваш ключ и код в виде текстового файла.',
                'example_keys': 'Примеры ключей (для тестирования)',
                'use_key': 'Использовать',
                'security_notice': 'Это безопасный генератор кодов TOTP. Ваш секретный ключ хранится в памяти браузера، но не отправляется на сервер.',
                'published_by': 'Опубликовано',
                'apply_language': 'Применить язык',
                'notification_copied': 'Код скопирован в буфер обмена!',
                'notification_invalid_key': 'Пожалуйста، сначала введите действительный ключ',
                'notification_invalid_code': 'Пожалуйста, сначала сгенерируйте действительный код',
                'notification_key_cleared': 'Секретный ключ очищен',
                'notification_example_used': 'Пример ключа использован!',
                'notification_saved': 'Ключ и код загружены как файл!',
                'notification_copy_error': 'Ошибка при копировании кода',
                'notification_language_changed': 'Язык успешно изменен!'
            }
        };
        
        this.applyTranslations();
    }

    applyTranslations() {
        const country = this.userCountry;
        const langData = this.translations[country] || this.translations['US'];
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                element.setAttribute('placeholder', langData[key]);
            }
        });
        
        let htmlLang = 'en';
        if (country === 'BD') htmlLang = 'bn';
        else if (country === 'IN') htmlLang = 'hi';
        else if (country === 'SA') htmlLang = 'ar';
        else if (country === 'CN') htmlLang = 'zh';
        else if (country === 'JP') htmlLang = 'ja';
        else if (country === 'KR') htmlLang = 'ko';
        else if (country === 'RU') htmlLang = 'ru';
        else if (country === 'FR') htmlLang = 'fr';
        else if (country === 'DE') htmlLang = 'de';
        else if (country === 'ES') htmlLang = 'es';
        else if (country === 'PT') htmlLang = 'pt';
        
        document.documentElement.lang = htmlLang;
        this.currentLanguage = country;
    }

    changeLanguage(languageCode) {
        if (this.translations[languageCode]) {
            const langData = this.translations[languageCode];
            
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langData[key]) {
                    element.textContent = langData[key];
                }
            });
            
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (langData[key]) {
                    element.setAttribute('placeholder', langData[key]);
                }
            });
            
            let htmlLang = 'en';
            if (languageCode === 'BD') htmlLang = 'bn';
            else if (languageCode === 'IN') htmlLang = 'hi';
            else if (languageCode === 'SA') htmlLang = 'ar';
            else if (languageCode === 'CN') htmlLang = 'zh';
            else if (languageCode === 'JP') htmlLang = 'ja';
            else if (languageCode === 'KR') htmlLang = 'ko';
            else if (languageCode === 'RU') htmlLang = 'ru';
            else if (languageCode === 'FR') htmlLang = 'fr';
            else if (languageCode === 'DE') htmlLang = 'de';
            else if (languageCode === 'ES') htmlLang = 'es';
            else if (languageCode === 'PT') htmlLang = 'pt';
            
            document.documentElement.lang = htmlLang;
            this.currentLanguage = languageCode;
            
            const langSelect = document.getElementById('languageSelect');
            if (langSelect) {
                langSelect.value = languageCode;
            }
            
            localStorage.setItem('preferred_language', languageCode);
            
            if (window.totpApp && window.totpApp.generateAndDisplayCode) {
                setTimeout(() => {
                    window.totpApp.generateAndDisplayCode();
                }, 100);
            }
            
            return true;
        }
        return false;
    }
}

// Initialize translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new Translator();
    
    // Language selector event
    document.getElementById('applyLanguage').addEventListener('click', () => {
        const langSelect = document.getElementById('languageSelect');
        const selectedLang = langSelect.value;
        
        const notification = document.getElementById('notification');
        notification.textContent = 'Changing language...';
        notification.style.display = 'block';
        notification.style.backgroundColor = '#3498db';
        
        if (window.translator.changeLanguage(selectedLang)) {
            notification.textContent = window.translator.getTranslatedText('notification_language_changed');
            notification.style.backgroundColor = '#2ecc71';
        } else {
            notification.textContent = 'Failed to change language';
            notification.style.backgroundColor = '#e74c3c';
        }
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    });
    
    window.translator.getTranslatedText = function(key) {
        if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }
        return this.translations['US'][key] || key;
    };
});