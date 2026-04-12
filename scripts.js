// --- THE KORE VANGUARD ENGINE: PHASE 1 --- //

let heartbeatInterval;
let recognition; // The Speech Engine

// 1. Initialize the Vocal Tether
function initializeVocalTether() {
    // Check if the browser supports Speech Recognition (Chrome/Safari)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening until dismissed
        recognition.interimResults = true; // Read words as they are spoken
        
        recognition.onstart = function() {
            console.log("PAX is listening...");
        };

        recognition.onresult = function(event) {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            
            // Convert to lowercase to make it easier to match
            let spokenWords = transcript.toLowerCase();
            console.log("User said: ", spokenWords);

            // THE TETHER PHRASE: If they say "pax" or "safe", dismiss the hijack
            if (spokenWords.includes("pax") || spokenWords.includes("safe") || spokenWords.includes("i'm safe")) {
                console.log("Vocal Tether Confirmed. Dismissing Sanctuary.");
                dismissHijack(); 
            }
        };

        recognition.onerror = function(event) {
            console.log("Vocal Tether Error: ", event.error);
        };
    } else {
        console.log("Speech Recognition not supported in this browser.");
    }
}

// 2. The Standard Hijack Logic
window.onload = function() {
    console.log("Observer active. Tap screen to authorize haptics and mic.");
    initializeVocalTether(); // Prep the mic on load
};

function engageSanctuary() {
    const layer = document.getElementById('somatic-layer');
    if (layer && !layer.classList.contains('active')) {
        layer.classList.add('active');
        startHeartbeat();
        
        // Start listening when the sanctuary engages
        if (recognition) {
            try {
                recognition.start();
            } catch(e) {
                console.log("Mic already active.");
            }
        }
    }
}

function dismissHijack(event) {
    if (event) event.stopPropagation(); 
    const layer = document.getElementById('somatic-layer');
    if (layer) {
        layer.classList.remove('active');
        stopHeartbeat();
        
        // Stop listening when dismissed
        if (recognition) {
            recognition.stop();
            console.log("PAX stopped listening.");
        }
    }
}

function startHeartbeat() {
    if ("vibrate" in navigator) {
        clearInterval(heartbeatInterval);
        navigator.vibrate(100);
        heartbeatInterval = setInterval(() => {
            navigator.vibrate(150); 
        }, 1000);
    }
}

function stopHeartbeat() {
    clearInterval(heartbeatInterval);
    if ("vibrate" in navigator) navigator.vibrate(0);
}

function triggerSomaticHijack() {
    const layer = document.getElementById('somatic-layer');
    if (layer && !layer.classList.contains('active')) {
        engageSanctuary();
    }
}
