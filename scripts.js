let heartbeatInterval;

window.onload = function() {
    // Auto-start after 3 seconds
    setTimeout(() => {
        engageSanctuary();
    }, 3000); 
};

function engageSanctuary() {
    const layer = document.getElementById('somatic-layer');
    if (layer && !layer.classList.contains('active')) {
        layer.classList.add('active');
        startHeartbeat();
        console.log("Sanctuary Engaged");
    }
}

function dismissHijack(event) {
    if (event) event.stopPropagation(); 
    const layer = document.getElementById('somatic-layer');
    if (layer) {
        layer.classList.remove('active');
        stopHeartbeat();
        console.log("Sanctuary Dismissed");
    }
}

function startHeartbeat() {
    if ("vibrate" in navigator) {
        // Clear any old ones first
        clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(() => {
            navigator.vibrate(200); 
        }, 1000);
    }
}

function stopHeartbeat() {
    clearInterval(heartbeatInterval);
    if ("vibrate" in navigator) navigator.vibrate(0);
}

// This allows you to click the desk to bring it back
function triggerSomaticHijack() {
    const layer = document.getElementById('somatic-layer');
    if (layer) {
        if (layer.classList.contains('active')) {
            // If it's on, don't do anything (let the X handle it)
        } else {
            engageSanctuary();
        }
    }
}
