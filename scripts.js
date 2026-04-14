// --- 1. INITIALIZATION & PORTAL LOGIC ---
let heartbeatInterval;
let isSanctuaryActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', initializeEngine);
        console.log("✅ Hearth Portal Wired.");
    }
});

// --- 2. THE VOICE ENGINE ---
let synth = window.speechSynthesis; 
let paxVoice = null;

function loadPremiumVoices() {
    let voices = synth.getVoices();
    paxVoice = voices.find(v => v.name.includes("Google UK English Female")) || 
               voices.find(v => v.name.includes("Samantha")) || 
               voices[0]; 
}
loadPremiumVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadPremiumVoices;
}

function paxSpeak(text) {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (paxVoice) utterance.voice = paxVoice;
    utterance.rate = 0.85; 
    utterance.pitch = 0.9; 
    
    const audio = document.getElementById('sanctuary-audio');
    if (audio) audio.volume = 0.5; 

    synth.speak(utterance);
}

// --- 3. CORE LOGIC (Dropping the Wall & Fire) ---
function initializeEngine() {
    const audio = document.getElementById('sanctuary-audio');
    if (audio) {
        audio.volume = 0.15; 
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.log("Browser blocked audio."));
        }
    }

    const intro = document.getElementById('intro-screen');
    if (intro) {
        intro.classList.add('hidden');
        setTimeout(() => { intro.style.display = 'none'; }, 1500); 
    }

    // The 3-second vacuum before the strike
    setTimeout(engageSanctuary, 3000);
}

function engageSanctuary() {
    const layer = document.getElementById('somatic-layer');
    const hearth = document.querySelector('.hearth-container'); 
    
    if (!isSanctuaryActive) {
        isSanctuaryActive = true;
        if (layer) layer.classList.add('active');
        if (hearth) hearth.classList.add('breathing'); 
        
        startHeartbeat();
        
        const genesisLedger = "Sovereignty established. Now, look at the reality of the Monopoly. Forty-two billion dollars a year. That is what the recovery industry generates while operating as a cartel of apathy. They treat the individual, and they abandon the family to the fallout. Right now, eighteen million children are living in the blast radius of substance use. They are not collateral damage. They are being groomed by trauma to become the industry's next generation of profit. When a facility discharges a volatile individual back into a low-income home with zero spousal lethality screening, the state calls it a successful discharge. We call it a negligent death sentence. Project KORE intervenes at the heartbeat. We deliver AAA-tier somatic regulation directly to the government-issued phones of the underserved. We disguise evidence-informed support as a Sovereign RPG. We bypass the stigma, we bridge the walls of the rehab, and we give a voice to negative stamina. And while we heal the family, our encrypted telemetry audits the very machines that abandoned them. We will make systemic apathy fund its own replacement. What you are looking at is a zero-day exploit in the behavioral health monopoly. It is the first of its kind in the world. The blueprint is live, and this exact transmission is being seeded to a highly classified list of systemic disruptors. But the Architect is not building a crowded table. She is only looking for the lethal few. Are you ready to claim your seat in the Guild... or should we pass the torch to the next target?";
        
        paxSpeak(genesisLedger);
    }
}

function startHeartbeat() { 
    if ("vibrate" in navigator) { 
        clearInterval(heartbeatInterval); 
        heartbeatInterval = setInterval(() => navigator.vibrate(150), 1000); 
    } 
}

// --- 4. ARCHITECT'S MANUAL OVERRIDE ---
document.addEventListener('keydown', (event) => {
    const exitScreen = document.getElementById('exit-screen');
    
    if (event.key.toLowerCase() === 'e') {
        if(exitScreen) {
            exitScreen.style.display = 'flex'; 
            exitScreen.classList.remove('hidden'); 
        }
        setTimeout(() => {
            paxSpeak("The Old Road awaits.");
        }, 1000);
    }
});
