function encryptData() {
    // 1. Get Elements
    const textInput = document.getElementById('inputText');
    const passInput = document.getElementById('passphrase');
    const algoSelect = document.getElementById('algorithm');
    const outputBox = document.getElementById('outputText');

    const text = textInput.value;
    const pass = passInput.value;
    const algo = algoSelect.value;

    // 2. Validation
    if (!text || !pass) {
        // Fixed the missing quote here! 
        alert("Please enter text and a passphrase! Don't be lazy."); 
        return;
    }

    let output = "";

    try {
        if (algo === "AES") {
            // AES-256 Encryption
            output = CryptoJS.AES.encrypt(text, pass).toString();
        } else if (algo === "DES") {
            // DES Encryption (Weak, but functional for demo)
            output = CryptoJS.DES.encrypt(text, pass).toString();
        } else if (algo === "RSA") {
            // RSA requires key pairs. We cannot do simple symmetric RSA with just a passphrase.
            // For this demo, we will block it or suggest AES.
            alert("⚠️ RSA Error: RSA is asymmetric encryption. It requires a Public Key to encrypt and a Private Key to decrypt. You cannot use a simple passphrase for RSA encryption in this manner. Please switch to AES-256 for symmetric security.");
            return;
        }

        // 3. Output Result
        outputBox.value = output;
        console.log("✅ Encryption Successful!");
        
    } catch (e) {
        console.error("Encryption Error:", e);
        alert("Encryption failed. See console for details.");
    }
}

function decryptData() {
    // 1. Get Elements
    const textInput = document.getElementById('inputText'); // User pastes encrypted text here
    const passInput = document.getElementById('passphrase');
    const algoSelect = document.getElementById('algorithm');
    const outputBox = document.getElementById('outputText');

    const text = textInput.value;
    const pass = passInput.value;
    const algo = algoSelect.value;

    // 2. Validation
    if (!text || !pass) {
        alert("Please enter the encrypted ciphertext and the passphrase!");
        return;
    }

    let output = "";

    try {
        if (algo === "AES") {
            const bytes = CryptoJS.AES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else if (algo === "DES") {
            const bytes = CryptoJS.DES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else if (algo === "RSA") {
             alert("️ RSA Decryption requires a Private Key. This demo does not support raw RSA decryption with a passphrase.");
             return;
        }

        // 3. Check if decryption resulted in empty string (wrong password)
        if (!output) {
            output = "❌ Decryption Failed: Wrong passphrase or corrupted data.";
            outputBox.style.color = "red";
        } else {
            outputBox.style.color = "green"; // Success color
        }
        
        outputBox.value = output;

    } catch (e) {
        console.error("Decryption Error:", e);
        outputBox.value = "❌ Error: Invalid ciphertext format or wrong algorithm selected.";
        outputBox.style.color = "red";
    }
}
