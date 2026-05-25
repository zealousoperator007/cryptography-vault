function encryptData() {
    const text = document.getElementById('inputText').value;
    const pass = document.getElementById('passphrase').value;
    const algo = document.getElementById('algorithm').value;
    let output = "";

    if (!text || !pass) {
        alert("Please enter text and a passphrase! Don't be lazy.);
        return;
    }

    try {
        if (algo === "AES") {
            // AES Encryption
            output = CryptoJS.AES.encrypt(text, pass).toString();
        } else if (algo === "DES") {
            // DES Encryption (Note: DES is insecure! Use TripleDES if possible)
            output = CryptoJS.DES.encrypt(text, pass).toString();
        } else if (algo === "RSA") {
            // RSA is asymmetric. It needs public/private keys. 
            // For a simple demo, we'll alert the user that this requires key pairs.
            alert("RSA requires Public/Private key pairs. Implementing full RSA in vanilla JS without libraries like JSEncrypt is complex. Stick to AES for symmetric speed!");
            return;
        }
        document.getElementById('outputText').value = output;
    } catch (e) {
        console.error(e);
        alert("Encryption failed. Check your inputs.");
    }
}

function decryptData() {
    const text = document.getElementById('inputText').value; // Usually you paste the encrypted text here
    const pass = document.getElementById('passphrase').value;
    const algo = document.getElementById('algorithm').value;
    let output = "";

    try {
        if (algo === "AES") {
            const bytes = CryptoJS.AES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else if (algo === "DES") {
            const bytes = CryptoJS.DES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        }
        
        if (!output) {
            output = "Decryption failed. Wrong passphrase or corrupted data.";
        }
        document.getElementById('outputText').value = output;
    } catch (e) {
        document.getElementById('outputText').value = "Error: Invalid ciphertext or passphrase.";
    }
}