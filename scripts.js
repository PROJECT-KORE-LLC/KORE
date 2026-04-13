// 1. Wire the button on load
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', initializeEngine);
        console.log("✅ Button securely wired.");
    }
});

let heartbeatInterval;
let recognition; 
let isSanctuaryActive = false;

function initializeEngine() {
    console.log("🚀 KORE Engine Initializing...");

    // 2. Remove the Homepage Curtain
    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.classList.remove('active');
        setTimeout(() => { intro.style.display = 'none'; }, 1000);
    }

    // 3. Unlock Audio
    if ("vibrate" in navigator) navigator.vibrate(50); 
    const audio = document.getElementById('sanctuary-audio');
    if (audio) audio.load(); 

    // 4. Setup Microphone
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = true;
        
        recognition.onstart = function() { console.log("🎙️ PAX IS LISTENING..."); };

        recognition.onresult = function(event) {
            let transcript = Array.from(event.results).map(r => r[0].transcript).join('').toLowerCase();
            console.log("🧠 Mic heard: ", transcript); 
            
            // If they say ANY of these words, it shuts down
            if (transcript.includes("pax") || transcript.includes("safe") || transcript.includes("stop")) {
                console.log("🛑 VOCAL TETHER CONFIRMED! Shutting down.");
                dismissHijack(); 
            }
        };

        recognition.onerror = function(event) { console.error("❌ MIC ERROR: ", event.error); };
        
        recognition.onend = function() {
            if (isSanctuaryActive && recognition) {
                try { recognition.start(); } catch(e) {}
            }
        };
    } else {
        console.error("❌ Web Speech API NOT supported on this browser.");
    }
}

function engageSanctuary() {
    const layer = document.getElementById('somatic-layer');
    const audio = document.getElementById('sanctuary-audio');
    
    if (layer && !layer.classList.contains('active')) {
        isSanctuaryActive = true;
        layer.classList.add('active');
        startHeartbeat();
        
        if (audio) { audio.volume = 0.5; audio.play().catch(e => console.error(e)); } 
        if (recognition) { try { recognition.start(); } catch(e) {} }
    }
}

function dismissHijack(event) {
    if (event) event.stopPropagation(); 
    const layer = document.getElementById('somatic-layer');
    const audio = document.getElementById('sanctuary-audio');
    
    if (layer) {
        isSanctuaryActive = false;
        layer.classList.remove('active');
        stopHeartbeat();
        
        if (audio) { audio.pause(); audio.currentTime = 0; }
        if (recognition) { try { recognition.stop(); } catch(e) {} }
    }
}

function startHeartbeat() {
    if ("vibrate" in navigator) {
        clearInterval(heartbeatInterval);
        navigator.vibrate(100);
        heartbeatInterval = setInterval(() => navigator.vibrate(150), 1000);
    }
}

function stopHeartbeat() {
    clearInterval(heartbeatInterval);
    if ("vibrate" in navigator) navigator.vibrate(0);
}

function triggerSomaticHijack() {
    if (!isSanctuaryActive) engageSanctuary();
}
