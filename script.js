/**
 * Cryptography Vault Logic
 * Author: Shadow Knight (Refined by Qwen3.6)
 * Date: May 31, 2026
 */

// Helper Function: Show Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show'; // Reset class
    
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}

// Helper Function: Copy to Clipboard
function copyToClipboard() {
    const outputBox = document.getElementById('outputText');
    if (!outputBox.value) return;

    outputBox.select();
    outputBox.setSelectionRange(0, 99999); // For mobile devices

    navigator.clipboard.writeText(outputBox.value).then(() => {
        showToast("✅ Copied to Clipboard!");
    }).catch(err => {
        showToast("❌ Failed to copy.", true);
        console.error('Could not copy text: ', err);
    });
}

// Main Encryption Function
function encryptData() {
    const textInput = document.getElementById('inputText');
    const passInput = document.getElementById('passphrase');
    const algoSelect = document.getElementById('algorithm');
    const outputBox = document.getElementById('outputText');

    const text = textInput.value.trim();
    const pass = passInput.value;
    const algo = algoSelect.value;

    // 1. Validation
    if (!text) {
        showToast("⚠️ Please enter some text to encrypt.", true);
        return;
    }
    if (!pass) {
        showToast("⚠️ Please enter a passphrase.", true);
        return;
    }
    if (pass.length < 4) {
        showToast("⚠️ Passphrase too weak (min 4 chars).", true);
        return;
    }

    let output = "";

    try {
        // 2. Encryption Logic
        if (algo === "AES") {
            // AES-256 is default in CryptoJS when using a passphrase
            output = CryptoJS.AES.encrypt(text, pass).toString();
        } else if (algo === "DES") {
            output = CryptoJS.DES.encrypt(text, pass).toString();
        } else if (algo === "RC4") {
            output = CryptoJS.RC4.encrypt(text, pass).toString();
        } else {
            throw new Error("Unsupported Algorithm");
        }

        // 3. Output Result
        outputBox.value = output;
        outputBox.style.color = "#00ff41"; // Green for success
        showToast(" Encrypted Successfully!");
        
    } catch (e) {
        console.error("Encryption Error:", e);
        showToast("❌ Encryption Failed. Check Console.", true);
        outputBox.value = "";
    }
}

// Main Decryption Function
function decryptData() {
    const textInput = document.getElementById('inputText');
    const passInput = document.getElementById('passphrase');
    const algoSelect = document.getElementById('algorithm');
    const outputBox = document.getElementById('outputText');

    const text = textInput.value.trim();
    const pass = passInput.value;
    const algo = algoSelect.value;

    // 1. Validation
    if (!text) {
        showToast("⚠️ Please paste ciphertext to decrypt.", true);
        return;
    }
    if (!pass) {
        showToast("⚠️ Please enter the passphrase.", true);
        return;
    }

    // Basic Base64 Regex Check to prevent wasting CPU on plain text
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(text)) {
        showToast("❌ Invalid Ciphertext Format (Must be Base64).", true);
        outputBox.value = "Error: Input is not valid encrypted data.";
        outputBox.style.color = "#ff3333";
        return;
    }

    let output = "";

    try {
        // 2. Decryption Logic
        if (algo === "AES") {
            const bytes = CryptoJS.AES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else if (algo === "DES") {
            const bytes = CryptoJS.DES.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else if (algo === "RC4") {
            const bytes = CryptoJS.RC4.decrypt(text, pass);
            output = bytes.toString(CryptoJS.enc.Utf8);
        } else {
            throw new Error("Unsupported Algorithm");
        }

        // 3. Check Result
        if (!output) {
            // If output is empty, it usually means wrong password or corrupted data
            outputBox.value = "❌ Decryption Failed: Wrong passphrase or corrupted data.";
            outputBox.style.color = "#ff3333"; // Red
            showToast(" Wrong Passphrase!", true);
        } else {
            outputBox.value = output;
            outputBox.style.color = "#00ff41"; // Green
            showToast("🔓 Decrypted Successfully!");
        }

    } catch (e) {
        console.error("Decryption Error:", e);
        outputBox.value = "❌ Error: Malformed ciphertext or algorithm mismatch.";
        outputBox.style.color = "#ff3333";
        showToast("❌ Decryption Error.", true);
    }
}
