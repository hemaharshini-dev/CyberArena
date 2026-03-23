function startMission(type) {
  window.location.href = type + ".html";
}

function goHome() {
  window.location.href = "index.html";
}

window.toggleHighContrast = function() {
    document.body.parentElement.classList.toggle('high-contrast');
    const isHighContrast = document.body.parentElement.classList.contains('high-contrast');
    localStorage.setItem('high-contrast', isHighContrast);
};

// Apply preference on load
if (localStorage.getItem('high-contrast') === 'true') {
    document.body.parentElement.classList.add('high-contrast');
}

// =====================
// AUDIO CONTROL CENTER
// =====================
let globalMuted = localStorage.getItem('muted') === 'true';
let globalVolume = parseFloat(localStorage.getItem('volume') || '0.5');

function injectAudioControls() {
    const existing = document.getElementById('audioControlBar');
    if (existing) return;

    const bar = document.createElement('div');
    bar.id = 'audioControlBar';
    bar.style.cssText = 'position:fixed;bottom:15px;right:15px;z-index:9999;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.8);border:1px solid var(--neon-cyan);padding:6px 12px;border-radius:4px;font-size:12px;';
    bar.innerHTML = `
        <span style="color:var(--neon-cyan);">🔊</span>
        <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${globalVolume}"
            style="width:70px;accent-color:var(--neon-cyan);cursor:pointer;" title="Volume" />
        <button id="muteBtn" onclick="toggleMute()" style="padding:3px 8px;font-size:10px;clip-path:none;">${globalMuted ? '🔇' : '🔈'}</button>
    `;
    document.body.appendChild(bar);

    document.getElementById('volumeSlider').oninput = (e) => {
        globalVolume = parseFloat(e.target.value);
        localStorage.setItem('volume', globalVolume);
        if (globalMuted) { globalMuted = false; localStorage.setItem('muted', false); document.getElementById('muteBtn').innerText = '🔈'; }
    };
}

window.toggleMute = function() {
    globalMuted = !globalMuted;
    localStorage.setItem('muted', globalMuted);
    document.getElementById('muteBtn').innerText = globalMuted ? '🔇' : '🔈';
};

document.addEventListener('DOMContentLoaded', injectAudioControls);

// =====================
// DYNAMIC BREADCRUMBS
// =====================
const PAGE_NAMES = {
    'phishing': 'Phishing Detective',
    'social': 'Social Engineering',
    'smishing': 'Smishing Simulator',
    'ai': 'AI Crime Lab',
    'malware': 'Malware Escape',
    'password': 'Password Lab',
    'darkweb': 'Dark Web Market',
    'creator': 'Mission Creator',
    'wiki': 'Cyber-Wiki',
    'login': 'Login',
    'index': 'Hub'
};

function injectBreadcrumb() {
    const existing = document.getElementById('breadcrumb');
    if (existing) return; // wiki.html already has one

    const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    if (path === 'index' || path === 'login' || path === '') return;

    const pageName = PAGE_NAMES[path] || path;
    const crumb = document.createElement('div');
    crumb.id = 'breadcrumb';
    crumb.style.cssText = 'font-size:11px;color:#666;margin-bottom:10px;text-align:left;';
    crumb.innerHTML = `<a href="index.html" style="color:#666;text-decoration:none;" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='#666'">Hub</a> <span style="color:#444;">›</span> <span style="color:var(--neon-cyan);">${pageName}</span>`;

    const container = document.querySelector('.container');
    if (container) {
        const backBtn = container.querySelector('.back-btn');
        if (backBtn) {
            backBtn.insertAdjacentElement('afterend', crumb);
        } else {
            container.prepend(crumb);
        }
    }
}

document.addEventListener('DOMContentLoaded', injectBreadcrumb);

// Immersive Audio System
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.playSound = function(type) {
    if (globalMuted) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const vol = globalVolume * 0.2; // scale to reasonable range
    
    if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'click') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(vol * 0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
};

// Attach click sound to all buttons globally
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        window.playSound('click');
    }
});
