// TOTP Code Generator Application
class TOTPGenerator {
    constructor() {
        this.secretKey = '';
        this.interval = 30;
        this.digits = 6;
        this.timer = null;
        this.timeLeft = this.interval;
        this.currentCode = '';
        this.translator = null;
        this.timerActive = false;
        this.init();
    }

    init() {
        // DOM Elements References
        this.secretKeyInput = document.getElementById('secretKey');
        this.clearKeyBtn = document.getElementById('clearKey');
        this.generateCodeBtn = document.getElementById('generateCode');
        this.copyCodeBtn = document.getElementById('copyCode');
        this.saveCodeBtn = document.getElementById('saveCode');
        this.currentCodeEl = document.getElementById('currentCode');
        this.timerProgress = document.getElementById('timerProgress');
        this.timeLeftEl = document.getElementById('timeLeft');
        this.timerSection = document.getElementById('timerSection');
        
        this.setupEventListeners();
        
        this.loadSecretKey();
        
        document.querySelectorAll('.use-key-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exampleKey = e.target.closest('.example-key').getAttribute('data-key');
                this.secretKeyInput.value = this.formatKey(exampleKey);
                this.secretKey = exampleKey;
                this.saveSecretKey();
                this.generateAndDisplayCode();
                this.showNotification(this.getTranslatedText('notification_example_used'));
            });
        });
        
        // Don't start timer automatically
        // Timer will start only when secret key is available
        this.checkAndStartTimer();
        
        // Initialize translator reference
        this.translator = window.translator;
    }

    getTranslatedText(key) {
        if (this.translator && this.translator.getTranslatedText) {
            return this.translator.getTranslatedText(key);
        }
        const englishTranslations = {
            'notification_example_used': 'Example key used!',
            'notification_copied': 'Code copied to clipboard!',
            'notification_invalid_key': 'Please enter a valid key first',
            'notification_invalid_code': 'Please generate a valid code first',
            'notification_key_cleared': 'Secret key cleared',
            'notification_saved': 'Key and code downloaded as file!',
            'notification_copy_error': 'Error copying code',
            'enter_key_for_code': 'Enter secret key to see code'
        };
        return englishTranslations[key] || key;
    }

    setupEventListeners() {
        this.clearKeyBtn.addEventListener('click', () => {
            this.clearSecretKey();
        });

        this.generateCodeBtn.addEventListener('click', () => {
            this.generateAndDisplayCode();
        });

        this.copyCodeBtn.addEventListener('click', () => {
            this.copyCodeToClipboard();
        });

        this.saveCodeBtn.addEventListener('click', () => {
            this.saveKeyAndCode();
        });

        this.secretKeyInput.addEventListener('input', (e) => {
            const formattedKey = e.target.value.trim().toUpperCase().replace(/[^A-Z2-7]/g, '');
            this.secretKey = formattedKey;

            e.target.value = this.formatKey(formattedKey);
            this.generateAndDisplayCode();
            this.saveSecretKey();
            this.checkAndStartTimer();
        });

        this.secretKeyInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                const rawKey = this.secretKeyInput.value.trim().toUpperCase().replace(/[^A-Z2-7]/g, '');
                this.secretKey = rawKey;
                this.secretKeyInput.value = this.formatKey(rawKey);
                this.generateAndDisplayCode();
                this.saveSecretKey();
                this.checkAndStartTimer();
            }, 10);
        });
    }

    // Key Format Function
    formatKey(key) {
        if (!key) return '';
        let formatted = '';
        for (let i = 0; i < key.length; i++) {
            formatted += key.charAt(i);
            if ((i + 1) % 4 === 0 && i !== key.length - 1) {
                formatted += ' ';
            }
        }
        return formatted;
    }

    // Base32 to Hex Conversion
    base32ToHex(base32) {
        base32 = base32.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        let hex = '';
        
        for (let i = 0; i < base32.length; i++) {
            const val = alphabet.indexOf(base32.charAt(i));
            if (val === -1) {
                throw new Error('Invalid Base32 character: ' + base32.charAt(i));
            }
            bits += val.toString(2).padStart(5, '0');
        }
        
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            const chunk = bits.substr(i, 8);
            const byte = parseInt(chunk, 2);
            hex += byte.toString(16).padStart(2, '0');
        }
        
        return hex;
    }

    // Generate TOTP Code
    generateTOTP(secret, time) {
        try {
            const keyHex = this.base32ToHex(secret);
            const key = CryptoJS.enc.Hex.parse(keyHex);
            const timeStep = Math.floor(time / this.interval);
            const timeHex = timeStep.toString(16).padStart(16, '0');
            const timeWordArray = CryptoJS.enc.Hex.parse(timeHex);
            const hmac = CryptoJS.HmacSHA1(timeWordArray, key);
            const hmacHex = hmac.toString(CryptoJS.enc.Hex);
            const offset = parseInt(hmacHex.charAt(hmacHex.length - 1), 16);
            
            let binary = '';
            for (let i = 0; i < 4; i++) {
                const hexByte = hmacHex.substr((offset * 2) + (i * 2), 2);
                binary += parseInt(hexByte, 16).toString(2).padStart(8, '0');
            }
            
            binary = parseInt(binary, 2) & 0x7fffffff;
            
            const otp = binary % Math.pow(10, this.digits);
            return otp.toString().padStart(this.digits, '0');
            
        } catch (error) {
            console.error('Error in generateTOTP:', error);
            throw error;
        }
    }

    // Generate and Display Code
    generateAndDisplayCode() {
        if (!this.secretKey) {
            const placeholderText = this.getTranslatedText('enter_key_for_code');
            this.currentCodeEl.innerHTML = `<span class="code-placeholder"><i class="fas fa-key"></i> ${placeholderText}</span>`;
            this.currentCodeEl.style.color = 'rgba(255, 255, 255, 0.8)';
            this.stopTimer();
            this.timerSection.classList.remove('active');
            this.timeLeftEl.textContent = '--s';
            this.timerProgress.style.width = '0%';
            return;
        }

        try {
            const now = Math.floor(Date.now() / 1000);
            this.currentCode = this.generateTOTP(this.secretKey, now);
            
            const formattedCode = this.currentCode.substring(0, 3) + ' ' + this.currentCode.substring(3);
            this.currentCodeEl.textContent = formattedCode;
            this.currentCodeEl.style.color = 'white';
            
            this.startOrResetTimer();
            
        } catch (error) {
            const invalidKeyText = this.translator && this.translator.currentLanguage === 'BD' 
                ? 'অবৈধ সিক্রেট কী ফরম্যাট' 
                : 'Invalid secret key format';
            this.currentCodeEl.innerHTML = `<span class="code-placeholder" style="color:#e74c3c;"><i class="fas fa-exclamation-triangle"></i> ${invalidKeyText}</span>`;
            this.stopTimer();
            this.timerSection.classList.remove('active');
            console.error('Error generating code:', error);
        }
    }

    // Timer Management
    checkAndStartTimer() {
        if (this.secretKey && !this.timerActive) {
            this.startTimer();
            this.timerSection.classList.add('active');
        } else if (!this.secretKey && this.timerActive) {
            this.stopTimer();
            this.timerSection.classList.remove('active');
        }
    }

    startOrResetTimer() {
        if (!this.timerActive && this.secretKey) {
            this.startTimer();
            this.timerSection.classList.add('active');
        } else {
            this.resetTimer();
        }
    }

    startTimer() {
        if (!this.secretKey) {
            this.stopTimer();
            return;
        }
        
        clearInterval(this.timer);
        this.timerActive = true;
        
        // Calculate initial time left
        const now = Math.floor(Date.now() / 1000);
        const timeStep = Math.floor(now / this.interval);
        const nextStepTime = (timeStep + 1) * this.interval;
        this.timeLeft = nextStepTime - now;
        
        if (this.timeLeft <= 0) {
            this.timeLeft = this.interval;
        }
        
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        this.updateTimer();
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.timerActive = false;
        this.timerSection.classList.remove('active');
        this.timeLeftEl.textContent = '--s';
        this.timerProgress.style.width = '0%';
    }

    updateTimer() {
        this.timeLeft--;
        
        if (this.timeLeft <= 0) {
            this.timeLeft = this.interval;
            this.generateAndDisplayCode();
        }
        
        const progressPercent = (this.timeLeft / this.interval) * 100;
        this.timerProgress.style.width = `${progressPercent}%`;
        
        if (this.timeLeft <= 10) {
            this.timerProgress.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (this.timeLeft <= 20) {
            this.timerProgress.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else {
            this.timerProgress.style.background = 'linear-gradient(90deg, #2ecc71, #3498db)';
        }
        
        this.timeLeftEl.textContent = `${this.timeLeft}s`;
    }

    resetTimer() {
        this.timeLeft = this.interval;
        this.updateTimer();
    }

    // Copy Code to Clipboard
    copyCodeToClipboard() {
        if (!this.currentCode || this.currentCode.length !== 6 || !/^\d+$/.test(this.currentCode)) {
            this.showNotification(this.getTranslatedText('notification_invalid_code'), 'error');
            return;
        }
        
        const codeText = this.currentCode;
        
        navigator.clipboard.writeText(codeText).then(() => {
            this.showNotification(this.getTranslatedText('notification_copied'));
        }).catch(err => {
            console.error('Copy failed:', err);
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showNotification(this.getTranslatedText('notification_copied'));
            } catch (fallbackErr) {
                this.showNotification(this.getTranslatedText('notification_copy_error'), 'error');
            }
            document.body.removeChild(textArea);
        });
    }

    // Save Key and Code
    saveKeyAndCode() {
        if (!this.secretKey) {
            this.showNotification(this.getTranslatedText('notification_invalid_key'), 'error');
            return;
        }
        
        if (!this.currentCode || this.currentCode.length !== 6) {
            this.showNotification(this.getTranslatedText('notification_invalid_code'), 'error');
            return;
        }
        
        const timestamp = new Date().toLocaleString(this.getLocaleForLanguage());
        
        let content = this.generateFileContent(timestamp);
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = this.generateFilename();
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        this.showNotification(this.getTranslatedText('notification_saved'));
    }

    getLocaleForLanguage() {
        const lang = this.translator ? this.translator.currentLanguage : 'US';
        switch(lang) {
            case 'BD': return 'bn-BD';
            case 'IN': return 'hi-IN';
            case 'SA': return 'ar-SA';
            case 'FR': return 'fr-FR';
            case 'DE': return 'de-DE';
            case 'ES': return 'es-ES';
            case 'PT': return 'pt-PT';
            case 'CN': return 'zh-CN';
            case 'JP': return 'ja-JP';
            case 'KR': return 'ko-KR';
            case 'RU': return 'ru-RU';
            default: return 'en-US';
        }
    }

    generateFileContent(timestamp) {
        const lang = this.translator ? this.translator.currentLanguage : 'US';
        
        switch(lang) {
            case 'BD':
                return `Authenticator Code Generator - সিক্রেট কী ও কোড
==========================================
সংরক্ষণের তারিখ: ${timestamp}

আপনার সিক্রেট কী: ${this.formatKey(this.secretKey)}
বর্তমান কোড: ${this.currentCode}
কোডের মেয়াদ: ${this.timeLeft} সেকেন্ড

গুরুত্বপূর্ণ:
1. এই সিক্রেট কী কাউকে দিবেন না বা কারো সাথে শেয়ার করবেন না।
2. কী-টি নিরাপদ স্থানে সংরক্ষণ করুন।
3. এই কোডটি প্রতি 30 সেকেন্ডে পরিবর্তিত হবে।
==========================================
TOTP কোড জেনারেটর ব্যবহার করে আপনার অ্যাকাউন্টের নিরাপত্তা বৃদ্ধি করুন।
`;
            
            case 'IN':
                return `Authenticator Code Generator - सीक्रेट की और कोड
==========================================
सहेजने की तारीख: ${timestamp}

आपकी सीक्रेट की: ${this.formatKey(this.secretKey)}
वर्तमान कोड: ${this.currentCode}
कोड की वैधता: ${this.timeLeft} सेकंड

महत्वपूर्ण:
1. इस सीक्रेट की को किसी को न दें और न ही किसी के साथ साझा करें।
2. की को सुरक्षित स्थान पर संग्रहीत करें।
3. यह कोड हर 30 सेकंड में बदल जाएगा।
==========================================
TOTP कोड जनरेटर का उपयोग करके अपने खाते की सुरक्षा बढ़ाएं।
`;
            
            case 'SA':
                return `مولد رمز المصادقة - المفتاح السري والرمز
==========================================
تاريخ الحفظ: ${timestamp}

مفتاحك السري: ${this.formatKey(this.secretKey)}
الرمز الحالي: ${this.currentCode}
صلاحية الرمز: ${this.timeLeft} ثانية

مهم:
1. لا تعطي هذا المفتاح السري لأي شخص ولا تشاركه مع أحد.
2. قم بتخزين المفتاح في مكان آمن.
3. سيتغير هذا الرمز كل 30 ثانية.
==========================================
استخدم مولد رمز TOTP لتعزيز أمان حسابك.
`;
            
            case 'FR':
                return `Générateur de Code Authenticator - Clé Secrète & Code
==========================================
Date de sauvegarde: ${timestamp}

Votre clé secrète: ${this.formatKey(this.secretKey)}
Code actuel: ${this.currentCode}
Validité du code: ${this.timeLeft} secondes

Important:
1. Ne donnez pas cette clé secrète à qui que ce soit et ne la partagez pas.
2. Stockez la clé dans un endroit sûr.
3. Ce code changera toutes les 30 secondes.
==========================================
Utilisez le Générateur de Code TOTP pour renforcer la sécurité de votre compte.
`;
            
            case 'DE':
                return `Authenticator Code Generator - Geheimer Schlüssel & Code
==========================================
Gespeichertes Datum: ${timestamp}

Ihr geheimer Schlüssel: ${this.formatKey(this.secretKey)}
Aktueller Code: ${this.currentCode}
Code-Gültigkeit: ${this.timeLeft} Sekunden

Wichtig:
1. Geben Sie diesen geheimen Schlüssel niemandem und teilen Sie ihn mit niemandem.
2. Bewahren Sie den Schlüssel an einem sicheren Ort auf.
3. Dieser Code ändert sich alle 30 Sekunden.
==========================================
Verwenden Sie den TOTP-Code-Generator, um die Sicherheit Ihres Kontos zu erhöhen.
`;
            
            case 'ES':
                return `Generador de Código Authenticator - Clave Secreta y Código
==========================================
Fecha guardada: ${timestamp}

Su clave secreta: ${this.formatKey(this.secretKey)}
Código actual: ${this.currentCode}
Validez del código: ${this.timeLeft} segundos

Importante:
1. No dé esta clave secreta a nadie ni la comparta con nadie.
2. Almacene la clave en un lugar seguro.
3. Este código cambiará cada 30 segundos.
==========================================
Utilice el Generador de Código TOTP para mejorar la seguridad de su cuenta.
`;
            
            case 'PT':
                return `Gerador de Código Authenticator - Chave Secreta e Código
==========================================
Data salva: ${timestamp}

Sua chave secreta: ${this.formatKey(this.secretKey)}
Código atual: ${this.currentCode}
Validade do código: ${this.timeLeft} segundos

Importante:
1. Não dê esta chave secreta a ninguém e não a compartilhe.
2. Armazene a chave em um local seguro.
3. Este código mudará a cada 30 segundos.
==========================================
Use o Gerador de Código TOTP para melhorar a segurança da sua conta.
`;
            
            case 'CN':
                return `验证器代码生成器 - 密钥和代码
==========================================
保存日期: ${timestamp}

您的密钥: ${this.formatKey(this.secretKey)}
当前代码: ${this.currentCode}
代码有效期: ${this.timeLeft} 秒

重要:
1. 不要将此密钥给任何人或与任何人共享。
2. 将密钥存储在安全的地方。
3. 此代码每30秒更改一次。
==========================================
使用TOTP代码生成器增强您的账户安全性。
`;
            
            case 'JP':
                return `認証コードジェネレーター - シークレットキーとコード
==========================================
保存日時: ${timestamp}

あなたのシークレットキー: ${this.formatKey(this.secretKey)}
現在のコード: ${this.currentCode}
コードの有効期間: ${this.timeLeft} 秒

重要:
1. このシークレットキーを誰にも渡さないでください。
2. キーは安全な場所に保管してください。
3. このコードは30秒ごとに変更されます。
==========================================
TOTPコードジェネレーターを使用してアカウントのセキュリティを強化してください。
`;
            
            case 'KR':
                return `인증 코드 생성기 - 비밀 키 및 코드
==========================================
저장 날짜: ${timestamp}

귀하의 비밀 키: ${this.formatKey(this.secretKey)}
현재 코드: ${this.currentCode}
코드 유효 기간: ${this.timeLeft} 초

중요:
1. 이 비밀 키를 누구에게도 주지 말고 공유하지 마십시오.
2. 키를 안전한 장소에 보관하십시오.
3. 이 코드는 30초마다 변경됩니다.
==========================================
TOTP 코드 생성기를 사용하여 계정 보안을 강화하십시오.
`;
            
            case 'RU':
                return `Генератор кода аутентификатора - Секретный ключ и код
==========================================
Дата сохранения: ${timestamp}

Ваш секретный ключ: ${this.formatKey(this.secretKey)}
Текущий код: ${this.currentCode}
Срок действия кода: ${this.timeLeft} секунд

Важно:
1. Не давайте этот секретный ключ никому и не делитесь им.
2. Храните ключ в безопасном месте.
3. Этот код будет меняться каждые 30 секунд.
==========================================
Используйте генератор кода TOTP для повышения безопасности вашей учетной записи.
`;
            
            default: // English
                return `Authenticator Code Generator - Secret Key & Code
==========================================
Saved Date: ${timestamp}

Your Secret Key: ${this.formatKey(this.secretKey)}
Current Code: ${this.currentCode}
Code Validity: ${this.timeLeft} seconds

Important:
1. Do not give this secret key to anyone or share it with anyone.
2. Store the key in a secure place.
3. This code will change every 30 seconds.
==========================================
Use the TOTP Code Generator to enhance your account security.
`;
        }
    }

    generateFilename() {
        const lang = this.translator ? this.translator.currentLanguage : 'US';
        const timestamp = new Date().getTime();
        
        switch(lang) {
            case 'BD': return `AuthenticatorKey_Bangla_${timestamp}.txt`;
            case 'IN': return `AuthenticatorKey_Hindi_${timestamp}.txt`;
            case 'SA': return `AuthenticatorKey_Arabic_${timestamp}.txt`;
            case 'FR': return `AuthenticatorKey_French_${timestamp}.txt`;
            case 'DE': return `AuthenticatorKey_German_${timestamp}.txt`;
            case 'ES': return `AuthenticatorKey_Spanish_${timestamp}.txt`;
            case 'PT': return `AuthenticatorKey_Portuguese_${timestamp}.txt`;
            case 'CN': return `AuthenticatorKey_Chinese_${timestamp}.txt`;
            case 'JP': return `AuthenticatorKey_Japanese_${timestamp}.txt`;
            case 'KR': return `AuthenticatorKey_Korean_${timestamp}.txt`;
            case 'RU': return `AuthenticatorKey_Russian_${timestamp}.txt`;
            default: return `AuthenticatorKey_English_${timestamp}.txt`;
        }
    }

    // Clear Secret Key
    clearSecretKey() {
        this.secretKey = '';
        this.secretKeyInput.value = '';
        this.currentCode = '';
        const placeholderText = this.getTranslatedText('enter_key_for_code');
        this.currentCodeEl.innerHTML = `<span class="code-placeholder"><i class="fas fa-key"></i> ${placeholderText}</span>`;
        this.currentCodeEl.style.color = 'rgba(255, 255, 255, 0.8)';
        this.stopTimer();
        this.timerSection.classList.remove('active');
        localStorage.removeItem('authenticator_secret_key');
        this.showNotification(this.getTranslatedText('notification_key_cleared'));
    }

    saveSecretKey() {
        if (this.secretKey) {
            localStorage.setItem('authenticator_secret_key', this.secretKey);
        }
    }

    loadSecretKey() {
        const savedKey = localStorage.getItem('authenticator_secret_key');
        if (savedKey) {
            this.secretKey = savedKey;
            this.secretKeyInput.value = this.formatKey(savedKey);
            this.generateAndDisplayCode();
            this.checkAndStartTimer();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize the application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const app = new TOTPGenerator();
        window.totpApp = app;
        
        setTimeout(() => {
            if (app.secretKey) {
                app.generateAndDisplayCode();
            }
        }, 500);
    }, 100);
});