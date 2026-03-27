function startMission(type) {
  window.location.href = type + ".html";
}

function goHome() {
  window.location.href = "hub.html";
}

window.toggleHighContrast = function() {
    document.body.parentElement.classList.toggle('high-contrast');
    const isHighContrast = document.body.parentElement.classList.contains('high-contrast');
    localStorage.setItem('high-contrast', isHighContrast);
    const savedFont = localStorage.getItem('fontSize') || 'font-md';
    highlightFontBtn(savedFont);
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
let currentTrack = localStorage.getItem('musicTrack') || 'cyberpunk';

// --- Shared reverb convolver ---
function createReverb() {
    const convolver = musicCtx.createConvolver();
    const len = musicCtx.sampleRate * 2;
    const buf = musicCtx.createBuffer(2, len, musicCtx.sampleRate);
    for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
    convolver.buffer = buf;
    return convolver;
}

// --- TRACK 1: Cyberpunk (120 BPM arpeggio + kick/hihat) ---
function startCyberpunk() {
    const reverb = createReverb();
    const reverbGain = musicCtx.createGain();
    reverbGain.gain.value = 0.25;
    reverb.connect(reverbGain);
    reverbGain.connect(musicMaster);
    musicNodes.push(reverb, reverbGain);

    // Bass drone
    [55, 55.4].forEach(freq => {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = freq; g.gain.value = 0.07;
        osc.connect(g); g.connect(musicMaster); osc.start();
        musicNodes.push(osc, g);
    });

    // Minor pentatonic arpeggio: A2 C3 D3 E3 G3
    const arpNotes = [110, 130.81, 146.83, 164.81, 196];
    let arpIdx = 0;
    const BPM = 120, step = (60 / BPM) * 0.5 * 1000;
    function scheduleArp() {
        if (!musicOn) return;
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = arpNotes[arpIdx % arpNotes.length];
        const t = musicCtx.currentTime;
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(g); g.connect(reverb); g.connect(musicMaster);
        osc.start(t); osc.stop(t + 0.2);
        arpIdx++;
        musicScheduler = setTimeout(scheduleArp, step);
    }
    scheduleArp();

    // Kick + hihat rhythm
    let beat = 0;
    const beatStep = (60 / BPM) * 1000;
    function scheduleBeat() {
        if (!musicOn) return;
        const t = musicCtx.currentTime;
        // Kick on beats 0 and 2
        if (beat % 4 === 0 || beat % 4 === 2) {
            const k = musicCtx.createOscillator(), kg = musicCtx.createGain();
            k.type = 'sine';
            k.frequency.setValueAtTime(150, t);
            k.frequency.exponentialRampToValueAtTime(40, t + 0.15);
            kg.gain.setValueAtTime(0.18, t);
            kg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            k.connect(kg); kg.connect(musicMaster); k.start(t); k.stop(t + 0.25);
        }
        // Hihat on every beat
        const buf = musicCtx.createBuffer(1, musicCtx.sampleRate * 0.05, musicCtx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = musicCtx.createBufferSource();
        const hg = musicCtx.createGain();
        const hf = musicCtx.createBiquadFilter();
        hf.type = 'highpass'; hf.frequency.value = 8000;
        src.buffer = buf; hg.gain.value = 0.04;
        src.connect(hf); hf.connect(hg); hg.connect(musicMaster);
        src.start(t);
        beat++;
        setTimeout(scheduleBeat, beatStep);
    }
    scheduleBeat();
}

// --- TRACK 2: Dark Ambient (slow evolving pads + sub-bass) ---
function startDarkAmbient() {
    const reverb = createReverb();
    const reverbGain = musicCtx.createGain();
    reverbGain.gain.value = 0.5;
    reverb.connect(reverbGain); reverbGain.connect(musicMaster);
    musicNodes.push(reverb, reverbGain);

    // Sub-bass
    const sub = musicCtx.createOscillator();
    const subG = musicCtx.createGain();
    sub.type = 'sine'; sub.frequency.value = 40; subG.gain.value = 0.12;
    sub.connect(subG); subG.connect(musicMaster); sub.start();
    musicNodes.push(sub, subG);

    // Slow evolving pads
    [82.4, 110, 138.6, 164.8].forEach((freq, i) => {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        const lfo = musicCtx.createOscillator();
        const lfoG = musicCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        g.gain.value = 0.05;
        lfo.frequency.value = 0.05 + i * 0.03; lfoG.gain.value = 0.03;
        lfo.connect(lfoG); lfoG.connect(g.gain);
        osc.connect(g); g.connect(reverb); g.connect(musicMaster);
        lfo.start(); osc.start();
        musicNodes.push(osc, g, lfo, lfoG);
    });

    // Occasional deep thud
    function scheduleThud() {
        if (!musicOn) return;
        const t = musicCtx.currentTime;
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(60, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.8);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1);
        osc.connect(g); g.connect(musicMaster); osc.start(t); osc.stop(t + 1);
        musicScheduler = setTimeout(scheduleThud, 3000 + Math.random() * 2000);
    }
    scheduleThud();
}

// --- TRACK 3: Hacker Terminal (glitchy bleeps) ---
function startHackerTerminal() {
    // Irregular glitchy bleep pattern
    const bleepNotes = [440, 523, 349, 392, 659, 294, 587];
    let idx = 0;
    function scheduleBleep() {
        if (!musicOn) return;
        const t = musicCtx.currentTime;
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
        osc.frequency.value = bleepNotes[idx % bleepNotes.length];
        const dur = 0.04 + Math.random() * 0.08;
        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g); g.connect(musicMaster);
        osc.start(t); osc.stop(t + dur);
        idx++;
        musicScheduler = setTimeout(scheduleBleep, 120 + Math.random() * 400);
    }
    scheduleBleep();

    // Low pulse
    [55, 73.4].forEach(freq => {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = freq; g.gain.value = 0.05;
        osc.connect(g); g.connect(musicMaster); osc.start();
        musicNodes.push(osc, g);
    });
}

function startAmbientMusic() {
    if (musicCtx.state === 'suspended') musicCtx.resume();
    stopAmbientMusic();
    if (currentTrack === 'cyberpunk') startCyberpunk();
    else if (currentTrack === 'dark') startDarkAmbient();
    else if (currentTrack === 'hacker') startHackerTerminal();
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

    // Music bar — bottom right
    const bar = document.createElement('div');
    bar.id = 'audioControlBar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Audio controls');
    bar.style.cssText = 'position:fixed;bottom:15px;right:15px;z-index:9999;display:flex;flex-direction:column;align-items:stretch;gap:6px;background:rgba(0,0,0,0.92);border:1px solid var(--neon-cyan);padding:8px 10px;border-radius:4px;font-size:12px;';
    bar.innerHTML = `
        <select id="trackSelect" aria-label="Select music track"
            style="background:#111;color:var(--neon-cyan);border:1px solid #333;font-size:10px;padding:3px 6px;cursor:pointer;font-family:var(--font-main);border-radius:3px;width:100%;">
            <option value="cyberpunk" ${currentTrack==='cyberpunk'?'selected':''}>⚡ Cyberpunk</option>
            <option value="dark"      ${currentTrack==='dark'     ?'selected':''}>🌑 Dark Ambient</option>
        </select>
        <div style="display:flex;align-items:center;gap:6px;">
            <button id="musicBtn" onclick="toggleMusic()" title="Music: ${musicOn ? 'ON' : 'OFF'}" aria-label="Toggle ambient music"
                style="padding:3px 8px;font-size:10px;clip-path:none;color:${musicOn ? 'var(--neon-cyan)' : '#444'};">🎵</button>
            <span style="color:#333;">|</span>
            <span style="color:var(--neon-cyan);" aria-hidden="true">🔊</span>
            <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${globalVolume}"
                style="width:70px;accent-color:var(--neon-cyan);cursor:pointer;" title="Volume" aria-label="Volume control" />
            <button id="muteBtn" onclick="toggleMute()" style="padding:3px 8px;font-size:10px;clip-path:none;" aria-label="Toggle mute">${globalMuted ? '🔇' : '🔈'}</button>
        </div>
    `;
    document.body.appendChild(bar);

    // Font size bar — top right
    const fontBar = document.createElement('div');
    fontBar.id = 'fontControlBar';
    fontBar.setAttribute('role', 'toolbar');
    fontBar.setAttribute('aria-label', 'Font size controls');
    fontBar.style.cssText = 'position:fixed;top:55px;right:15px;z-index:9999;display:flex;align-items:center;gap:6px;background:rgba(0,0,0,0.92);border:1px solid var(--neon-cyan);padding:5px 10px;border-radius:4px;font-size:12px;';
    fontBar.innerHTML = `
        <span style="color:#555;font-size:10px;letter-spacing:1px;">TEXT</span>
        <button id="fsBtn-sm" onclick="setFontSize('font-sm')" style="padding:3px 6px;font-size:9px;clip-path:none;" title="Small text" aria-label="Small font size">A</button>
        <button id="fsBtn-md" onclick="setFontSize('font-md')" style="padding:3px 6px;font-size:11px;clip-path:none;" title="Medium text" aria-label="Medium font size">A</button>
        <button id="fsBtn-lg" onclick="setFontSize('font-lg')" style="padding:3px 6px;font-size:14px;clip-path:none;" title="Large text" aria-label="Large font size">A</button>
    `;
    document.body.appendChild(fontBar);

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

    document.getElementById('trackSelect').onchange = (e) => {
        currentTrack = e.target.value;
        localStorage.setItem('musicTrack', currentTrack);
        if (musicOn) startAmbientMusic();
    };

    if (musicOn) startAmbientMusic();
    highlightFontBtn(savedFont);
}

function highlightFontBtn(cls) {
    const isHC = document.documentElement.classList.contains('high-contrast') ||
                 document.body.parentElement.classList.contains('high-contrast');
    ['font-sm', 'font-md', 'font-lg'].forEach(c => {
        const btn = document.getElementById('fsBtn-' + c.replace('font-', ''));
        if (!btn) return;
        const active = c === cls;
        if (isHC) {
            btn.style.setProperty('background', active ? '#fff' : '#000', 'important');
            btn.style.setProperty('color', active ? '#000' : '#fff', 'important');
            btn.style.setProperty('border-color', '#000', 'important');
            btn.style.setProperty('outline', active ? '2px solid #000' : 'none', 'important');
        } else {
            btn.style.color = active ? 'var(--neon-cyan)' : '#555';
            btn.style.borderColor = active ? 'var(--neon-cyan)' : '#333';
            btn.style.background = active ? 'rgba(0,243,255,0.1)' : 'transparent';
        }
    });
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
    highlightFontBtn(cls);
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
    'daily': 'Daily Challenge',
    'incident': 'Incident Response',
    'creator': 'Mission Creator',
    'wiki': 'Cyber-Wiki',
    'login': 'Login',
    'index': 'Hub',
    'hub': 'Hub'
};

function injectBreadcrumb() {
    const existing = document.getElementById('breadcrumb');
    if (existing) return; // wiki.html already has one

    const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    if (path === 'hub' || path === 'index' || path === 'login' || path === '') return;

    const pageName = PAGE_NAMES[path] || path;
    const crumb = document.createElement('div');
    crumb.id = 'breadcrumb';
    crumb.style.cssText = 'font-size:11px;color:#666;margin-bottom:10px;text-align:left;';
    crumb.innerHTML = `<a href="hub.html" style="color:#666;text-decoration:none;" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='#666'">Hub</a> <span style="color:#444;">›</span> <span style="color:var(--neon-cyan);">${pageName}</span>`;

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
