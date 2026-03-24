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
let musicOn = localStorage.getItem('musicOn') === 'true';

// =====================
// AMBIENT MUSIC ENGINE
// =====================
const musicCtx = new (window.AudioContext || window.webkitAudioContext)();
const musicMaster = musicCtx.createGain();
musicMaster.connect(musicCtx.destination);
musicMaster.gain.value = 0;

let musicNodes = [];
let musicScheduler = null;

// Cyberpunk bass drone: layered detuned oscillators
function startAmbientMusic() {
    if (musicCtx.state === 'suspended') musicCtx.resume();
    stopAmbientMusic();

    // Bass drone — two detuned saws for thickness
    [55, 55.3].forEach(freq => {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        g.gain.value = 0.08;
        osc.connect(g);
        g.connect(musicMaster);
        osc.start();
        musicNodes.push(osc, g);
    });

    // Mid pad — slow sine shimmer
    [110, 165, 220].forEach((freq, i) => {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.value = 0.04;
        // Slow LFO tremolo
        const lfo = musicCtx.createOscillator();
        const lfoGain = musicCtx.createGain();
        lfo.frequency.value = 0.3 + i * 0.1;
        lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();
        osc.connect(g);
        g.connect(musicMaster);
        osc.start();
        musicNodes.push(osc, g, lfo, lfoGain);
    });

    // Hi-freq shimmer
    const shimmer = musicCtx.createOscillator();
    const shimmerGain = musicCtx.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.value = 880;
    shimmerGain.gain.value = 0.015;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(musicMaster);
    shimmer.start();
    musicNodes.push(shimmer, shimmerGain);

    // Rhythmic pulse — soft kick-like thump every ~600ms
    function schedulePulse() {
        if (!musicOn) return;
        const kick = musicCtx.createOscillator();
        const kickGain = musicCtx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(120, musicCtx.currentTime);
        kick.frequency.exponentialRampToValueAtTime(40, musicCtx.currentTime + 0.15);
        kickGain.gain.setValueAtTime(0.12, musicCtx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, musicCtx.currentTime + 0.2);
        kick.connect(kickGain);
        kickGain.connect(musicMaster);
        kick.start();
        kick.stop(musicCtx.currentTime + 0.2);
        musicScheduler = setTimeout(schedulePulse, 600);
    }
    schedulePulse();

    // Fade in
    musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMaster.gain.setValueAtTime(0, musicCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(globalVolume * 0.4, musicCtx.currentTime + 2);
}

function stopAmbientMusic() {
    clearTimeout(musicScheduler);
    musicScheduler = null;
    // Fade out then disconnect
    musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMaster.gain.setValueAtTime(musicMaster.gain.value, musicCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.5);
    setTimeout(() => {
        musicNodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
        musicNodes = [];
    }, 600);
}

function syncMusicVolume() {
    if (musicOn && !globalMuted) {
        musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
        musicMaster.gain.setValueAtTime(musicMaster.gain.value, musicCtx.currentTime);
        musicMaster.gain.linearRampToValueAtTime(globalVolume * 0.4, musicCtx.currentTime + 0.1);
    }
}

window.toggleMusic = function() {
    musicOn = !musicOn;
    localStorage.setItem('musicOn', musicOn);
    const btn = document.getElementById('musicBtn');
    if (musicOn) {
        btn.innerText = '🎵';
        btn.title = 'Music: ON';
        btn.style.color = 'var(--neon-cyan)';
        startAmbientMusic();
    } else {
        btn.innerText = '🎵';
        btn.title = 'Music: OFF';
        btn.style.color = '#444';
        stopAmbientMusic();
    }
};

function injectAudioControls() {
    const existing = document.getElementById('audioControlBar');
    if (existing) return;

    // Apply saved font size
    const savedFont = localStorage.getItem('fontSize') || 'font-md';
    document.documentElement.className = document.documentElement.className
        .replace(/font-(sm|md|lg)/g, '').trim() + ' ' + savedFont;

    const bar = document.createElement('div');
    bar.id = 'audioControlBar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Audio and display controls');
    bar.style.cssText = 'position:fixed;bottom:15px;right:15px;z-index:9999;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.8);border:1px solid var(--neon-cyan);padding:6px 12px;border-radius:4px;font-size:12px;';
    bar.innerHTML = `
        <button id="musicBtn" onclick="toggleMusic()" title="Music: ${musicOn ? 'ON' : 'OFF'}" aria-label="Toggle ambient music"
            style="padding:3px 8px;font-size:10px;clip-path:none;color:${musicOn ? 'var(--neon-cyan)' : '#444'};">🎵</button>
        <span style="color:#333;">|</span>
        <span style="color:var(--neon-cyan);" aria-hidden="true">🔊</span>
        <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${globalVolume}"
            style="width:70px;accent-color:var(--neon-cyan);cursor:pointer;" title="Volume" aria-label="Volume control" />
        <button id="muteBtn" onclick="toggleMute()" style="padding:3px 8px;font-size:10px;clip-path:none;" aria-label="Toggle mute">${globalMuted ? '🔇' : '🔈'}</button>
        <span style="color:#333;">|</span>
        <button onclick="setFontSize('font-sm')" style="padding:3px 6px;font-size:9px;clip-path:none;" title="Small text" aria-label="Small font size">A</button>
        <button onclick="setFontSize('font-md')" style="padding:3px 6px;font-size:11px;clip-path:none;" title="Medium text" aria-label="Medium font size">A</button>
        <button onclick="setFontSize('font-lg')" style="padding:3px 6px;font-size:14px;clip-path:none;" title="Large text" aria-label="Large font size">A</button>
    `;
    document.body.appendChild(bar);

    document.getElementById('volumeSlider').oninput = (e) => {
        globalVolume = parseFloat(e.target.value);
        localStorage.setItem('volume', globalVolume);
        if (globalMuted) {
            globalMuted = false;
            localStorage.setItem('muted', false);
            document.getElementById('muteBtn').innerText = '🔈';
        }
        syncMusicVolume();
    };

    if (musicOn) startAmbientMusic();
}

window.toggleMute = function() {
    globalMuted = !globalMuted;
    localStorage.setItem('muted', globalMuted);
    document.getElementById('muteBtn').innerText = globalMuted ? '🔇' : '🔈';
    document.getElementById('muteBtn').setAttribute('aria-label', globalMuted ? 'Unmute' : 'Mute');
    if (globalMuted) {
        musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
        musicMaster.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.2);
    } else if (musicOn) {
        syncMusicVolume();
    }
};

window.setFontSize = function(cls) {
    document.documentElement.className = document.documentElement.className
        .replace(/font-(sm|md|lg)/g, '').trim() + ' ' + cls;
    localStorage.setItem('fontSize', cls);
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
