// 1. The "Observer" Logic: This runs automatically when the page loads
window.onload = function() {
    console.log("Companion is observing... initiating soft amber glow in 3 seconds.");
    
    // Simulating the biometric trigger delay
    setTimeout(() => {
        const layer = document.getElementById('somatic-layer');
        if (layer) {
            layer.classList.add('active');
            console.log("Somatic Hijack: Engaged (Auto-Start)");
        }
    }, 3000); 
};

// 2. The "Agency" Logic: This allows the user to kill the effect instantly
function dismissHijack(event) {
    // This stops the click from "bubbling" up and accidentally re-triggering the room
    if (event) event.stopPropagation(); 
    
    const layer = document.getElementById('somatic-layer');
    if (layer) {
        layer.classList.remove('active');
        console.log("User exercised Agency: Hijack Disengaged.");
    }
}

// 3. The "Manual Toggle" Logic: For testing purposes if you click the desk
function triggerSomaticHijack() {
    const layer = document.getElementById('somatic-layer');
    if (layer) {
        layer.classList.toggle('active');
    }
}
