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

// --- THE VOICE ENGINE UPGRADE ---
let synth = window.speechSynthesis; 
let paxVoice = null;

function loadPremiumVoices() {
    let availableVoices = synth.getVoices();
    if (availableVoices.length === 0) return;
    paxVoice = availableVoices.find(v => v.name.includes("Google UK English Female")) || 
               availableVoices.find(v => v.name.includes("Samantha")) || 
               availableVoices.find(v => v.name.includes("Moira")) || 
               availableVoices.find(v => v.name.includes("Microsoft Hazel")) || 
               availableVoices.find(v => v.name.includes("Fiona")) || 
               availableVoices.find(v => v.lang === 'en-GB') || 
               availableVoices[0]; 
    console.log("🗣️ PAX Voice Selected: " + paxVoice.name);
}

loadPremiumVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadPremiumVoices;
}

window.paxUtterances = []; 

function paxSpeak(text, isExit = false) {
    // If she is talking, instantly cut her off so your new command works
    if (synth.speaking) synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    window.paxUtterances.push(utterance); 
    
    if (paxVoice) utterance.voice = paxVoice;
    utterance.rate = 0.85; 
    utterance.pitch = 0.9; 
    
    const audio = document.getElementById('sanctuary-audio');
    if (audio) audio.volume = 0.1; 

    utterance.onend = function () {
        if (audio && isSanctuaryActive) audio.volume = 0.5;
        
        // THE CRITICAL FIX: Wake the mic back up immediately after she finishes talking!
        if (!isExit && isSanctuaryActive && recognition) {
            try { recognition.start(); console.log("🎙️ PAX finished. Mic awake."); } catch(e) {}
        }
    };

    synth.speak(utterance);
}

function initializeEngine() {
    console.log("🚀 KORE Engine Initializing...");

    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.classList.remove('active');
        setTimeout(() => { intro.style.display = 'none'; }, 1000);
    }

    if ("vibrate" in navigator) navigator.vibrate(50); 
    const audio = document.getElementById('sanctuary-audio');
    if (audio) audio.load(); 

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = false; 
        
        recognition.onstart = function() { console.log("🎙️ PAX IS LISTENING..."); };

        recognition.onresult = function(event) {
            let transcript = Array.from(event.results).map(r => r[0].transcript).join('').toLowerCase();
            console.log("🧠 Mic heard: ", transcript); 
            
            const vocalDisplay = document.getElementById('hud-vocal');

            // --- THE AI INTENT ROUTER ---
            if (transcript.includes("pax") || transcript.includes("safe") || transcript.includes("stop") || transcript.includes("good") || transcript.includes("okay")) {
                if (vocalDisplay) vocalDisplay.innerHTML = "<span class='calm'>TETHER CONFIRMED.</span>";
                
                // 1. Immediately trigger the UI shutdown
                dismissHijack(); 
                
                // 2. Tell her to speak her final line (true = this is an exit, do not wake mic)
                paxSpeak("Tether confirmed. I am with you.", true); 
            } 
            else if (transcript.includes("stress") || transcript.includes("panic") || transcript.includes("bad") || transcript.includes("help") || transcript.includes("scared")) {
                if (vocalDisplay) vocalDisplay.innerHTML = "<span class='alert'>DISTRESS DETECTED.</span>";
                paxSpeak("I hear you. You are not alone. Breathe with my light.");
            }
            else if (transcript.includes("who are you") || transcript.includes("what are you")) {
                if (vocalDisplay) vocalDisplay.innerHTML = "<span class='calm'>IDENTITY QUERY.</span>";
                paxSpeak("I am PAX. Your cognitive sanctuary.");
            }
            else {
                if (vocalDisplay) vocalDisplay.innerHTML = "<span class='alert'>ANALYZING...</span>";
                paxSpeak("I am listening. Keep breathing.");
            }
        };

        recognition.onerror = function(event) { console.error("❌ MIC ERROR: ", event.error); };
        
        recognition.onend = function() {
            // Only fall back to this if she isn't talking
            if (isSanctuaryActive && recognition && !synth.speaking) {
                try { recognition.start(); } catch(e) {}
            }
        };
    } else {
        console.error("❌ Web Speech API NOT supported on this browser.");
    }
}

function engageSanctuary() {
    const layer = document.getElementById('somatic-layer');
    const wayshrine = document.querySelector('.wayshrine-container'); 
    const audio = document.getElementById('sanctuary-audio');
    
    if (layer && !layer.classList.contains('active')) {
        isSanctuaryActive = true;
        layer.classList.add('active');
        if (wayshrine) wayshrine.classList.add('breathing'); 
        
        startHeartbeat();
        runTelemetrySimulation(); 
        
        if (audio) { audio.volume = 0.5; audio.play().catch(e => console.error(e)); } 
        
        // Start the intro sequence
        setTimeout(() => {
            paxSpeak("Sanctuary protocol engaged. Speak to me.");
            // Force the mic on after she starts her intro
            setTimeout(() => { if (recognition) { try { recognition.start(); } catch(e) {} } }, 2000);
        }, 1500);
    }
}

function dismissHijack(event) {
    if (event) event.stopPropagation(); 
    const layer = document.getElementById('somatic-layer');
    const audio = document.getElementById('sanctuary-audio');
    const wayshrine = document.querySelector('.wayshrine-container');
    const summary = document.getElementById('session-summary'); 
    
    if (layer) {
        clearInterval(bpmInterval); 
        if (wayshrine) wayshrine.classList.remove('breathing');
        
        // Immediately shut off the mic so it doesn't accidentally trigger again
        if (recognition) { try { recognition.stop(); } catch(e) {} }
        isSanctuaryActive = false; // Flags the whole system to stop looping

        // Wait 1 second so she can say "Tether confirmed", then fade everything out
        setTimeout(() => {
            layer.classList.remove('active');
            stopHeartbeat();
            if (audio) { audio.pause(); audio.currentTime = 0; }
            
            // Drop the frosted glass summary screen!
            if (summary) summary.classList.add('active');
        }, 1000);
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

function closeSummary() {
    const summary = document.getElementById('session-summary');
    if (summary) summary.classList.remove('active');
}

let bpmInterval;
function runTelemetrySimulation() {
    const bpmDisplay = document.getElementById('hud-bpm');
    const statusDisplay = document.getElementById('hud-status');
    const vocalDisplay = document.getElementById('hud-vocal');
    
    let currentBPM = 118;
    if (bpmDisplay) { bpmDisplay.innerText = currentBPM; bpmDisplay.className = "alert"; }
    if (statusDisplay) { statusDisplay.innerText = "DETECTED"; statusDisplay.className = "alert"; }
    if (vocalDisplay) vocalDisplay.innerText = "LISTENING...";

    clearInterval(bpmInterval);
    bpmInterval = setInterval(() => {
        if (currentBPM > 60) {
            currentBPM -= Math.floor(Math.random() * 3) + 1; 
            if (bpmDisplay) bpmDisplay.innerText = currentBPM;
            if (currentBPM < 85 && bpmDisplay && bpmDisplay.className === "alert") {
                bpmDisplay.className = "calm";
                if (statusDisplay) { statusDisplay.innerText = "REGULATING"; statusDisplay.className = "calm"; }
            }
        } else {
            clearInterval(bpmInterval);
            if (statusDisplay) statusDisplay.innerText = "OPTIMAL";
        }
    }, 800);
}
