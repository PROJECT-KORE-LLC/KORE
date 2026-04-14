let synth = window.speechSynthesis;
let paxVoice = null;
let engineUnlocked = false;
let hapticInterval;

// --- LOAD PAX'S VOICE ---
function loadPremiumVoices() {
    let voices = synth.getVoices();
    paxVoice = voices.find(v => v.name.includes("Google UK English Female")) || 
               voices.find(v => v.name.includes("Samantha")) || 
               voices[0]; 
}
loadPremiumVoices();
if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadPremiumVoices;

function paxSpeak(text, callback) {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (paxVoice) utterance.voice = paxVoice;
    utterance.rate = 0.85; 
    utterance.pitch = 0.9; 
    if (callback) utterance.onend = callback;
    synth.speak(utterance);
}

// --- 1. THE TRIGGER (Fired by your original 'Enter Sanctuary' button) ---
function initializeEngine() {
    if (engineUnlocked) return;
    engineUnlocked = true;

    // 1. Hide your intro screen
    const introScreen = document.getElementById('intro-screen');
    if(introScreen) introScreen.classList.add('hidden');

    // 2. Ignite the fire audio immediately
    const audio = document.getElementById('sanctuary-audio');
    if (audio) { audio.volume = 0.2; audio.play(); }

    // 3. The 3-Second Vacuum (Silence before the strike)
    setTimeout(executeHijack, 3000);
}

// --- 2. THE AUTOMATED HIJACK & LEDGER ---
function executeHijack() {
    // 1. Ignite the visual breathing on your original hearth container
    const hearth = document.querySelector('.hearth-container');
    if(hearth) hearth.classList.add('breathing'); // Uses your original CSS animation

    // 2. Ignite the haptic heartbeat (Mobile only)
    if ("vibrate" in navigator) {
        navigator.vibrate([40, 60, 40]); 
        hapticInterval = setInterval(() => {
            navigator.vibrate([40, 60, 40]);
        }, 3000); 
    }

    // 3. PAX Drops the Genesis Ledger
    const genesisLedger = "Sovereignty established. Now, look at the reality of the Monopoly. Forty-two billion dollars a year. That is what the recovery industry generates while operating as a cartel of apathy. They treat the individual, and they abandon the family to the fallout. Right now, eighteen million children are living in the blast radius of substance use. They are not collateral damage. They are being groomed by trauma to become the industry's next generation of profit. When a facility discharges a volatile individual back into a low-income home with zero spousal lethality screening, the state calls it a successful discharge. We call it a negligent death sentence. Project KORE intervenes at the heartbeat. We deliver AAA-tier somatic regulation directly to the government-issued phones of the underserved. We disguise evidence-informed support as a Sovereign RPG. We bypass the stigma, we bridge the walls of the rehab, and we give a voice to negative stamina. And while we heal the family, our encrypted telemetry audits the very machines that abandoned them. We will make systemic apathy fund its own replacement. What you are looking at is a zero-day exploit in the behavioral health monopoly. It is the first of its kind in the world. The blueprint is live, and this exact transmission is being seeded to a highly classified list of systemic disruptors. But the Architect is not building a crowded table. She is only looking for the lethal few. Are you ready to claim your seat in the Guild... or should we pass the torch to the next target?";
    
    paxSpeak(genesisLedger, () => {
        // Stop the heartbeat when PAX finishes speaking
        clearInterval(hapticInterval);
    });
}

// Ensure the button works if the DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        // Overriding the old click to trigger the new automated sequence
        enterBtn.onclick = initializeEngine; 
    }
});
