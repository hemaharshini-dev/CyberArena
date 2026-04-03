// music.js — Ambient music engine
window.globalMuted = localStorage.getItem('muted') === 'true';
window.globalVolume = parseFloat(localStorage.getItem('volume') || '0.5');
window.musicOn = localStorage.getItem('musicOn') === 'true';

const musicCtx = new (window.AudioContext || window.webkitAudioContext)();
const musicMaster = musicCtx.createGain();
musicMaster.connect(musicCtx.destination);
musicMaster.gain.value = 0;

let musicNodes = [];
let musicScheduler = null;
let currentTrack = localStorage.getItem('musicTrack') || 'cyberpunk';

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

function startCyberpunk() {
    const reverb = createReverb();
    const reverbGain = musicCtx.createGain();
    reverbGain.gain.value = 0.25;
    reverb.connect(reverbGain); reverbGain.connect(musicMaster);
    musicNodes.push(reverb, reverbGain);

    [55, 55.4].forEach(freq => {
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = freq; g.gain.value = 0.07;
        osc.connect(g); g.connect(musicMaster); osc.start();
        musicNodes.push(osc, g);
    });

    const arpNotes = [110, 130.81, 146.83, 164.81, 196];
    let arpIdx = 0;
    const step = (60 / 120) * 0.5 * 1000;
    function scheduleArp() {
        if (!window.musicOn) return;
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
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

    let beat = 0;
    const beatStep = (60 / 120) * 1000;
    function scheduleBeat() {
        if (!window.musicOn) return;
        const t = musicCtx.currentTime;
        if (beat % 4 === 0 || beat % 4 === 2) {
            const k = musicCtx.createOscillator(), kg = musicCtx.createGain();
            k.type = 'sine';
            k.frequency.setValueAtTime(150, t);
            k.frequency.exponentialRampToValueAtTime(40, t + 0.15);
            kg.gain.setValueAtTime(0.18, t);
            kg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            k.connect(kg); kg.connect(musicMaster); k.start(t); k.stop(t + 0.25);
        }
        const buf = musicCtx.createBuffer(1, musicCtx.sampleRate * 0.05, musicCtx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = musicCtx.createBufferSource(), hg = musicCtx.createGain();
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

function startDarkAmbient() {
    const reverb = createReverb();
    const reverbGain = musicCtx.createGain();
    reverbGain.gain.value = 0.5;
    reverb.connect(reverbGain); reverbGain.connect(musicMaster);
    musicNodes.push(reverb, reverbGain);

    const sub = musicCtx.createOscillator(), subG = musicCtx.createGain();
    sub.type = 'sine'; sub.frequency.value = 40; subG.gain.value = 0.12;
    sub.connect(subG); subG.connect(musicMaster); sub.start();
    musicNodes.push(sub, subG);

    [82.4, 110, 138.6, 164.8].forEach((freq, i) => {
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
        const lfo = musicCtx.createOscillator(), lfoG = musicCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = 0.05;
        lfo.frequency.value = 0.05 + i * 0.03; lfoG.gain.value = 0.03;
        lfo.connect(lfoG); lfoG.connect(g.gain);
        osc.connect(g); g.connect(reverb); g.connect(musicMaster);
        lfo.start(); osc.start();
        musicNodes.push(osc, g, lfo, lfoG);
    });

    function scheduleThud() {
        if (!window.musicOn) return;
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

function startHackerTerminal() {
    const bleepNotes = [440, 523, 349, 392, 659, 294, 587];
    let idx = 0;
    function scheduleBleep() {
        if (!window.musicOn) return;
        const t = musicCtx.currentTime;
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
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

    [55, 73.4].forEach(freq => {
        const osc = musicCtx.createOscillator(), g = musicCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = freq; g.gain.value = 0.05;
        osc.connect(g); g.connect(musicMaster); osc.start();
        musicNodes.push(osc, g);
    });
}

window.startAmbientMusic = function() {
    if (musicCtx.state === 'suspended') musicCtx.resume();
    window.stopAmbientMusic();
    if (currentTrack === 'cyberpunk') startCyberpunk();
    else if (currentTrack === 'dark') startDarkAmbient();
    else if (currentTrack === 'hacker') startHackerTerminal();
    musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMaster.gain.setValueAtTime(0, musicCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(window.globalVolume * 0.4, musicCtx.currentTime + 2);
};

window.stopAmbientMusic = function() {
    clearTimeout(musicScheduler);
    musicScheduler = null;
    musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMaster.gain.setValueAtTime(musicMaster.gain.value, musicCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.5);
    setTimeout(() => {
        musicNodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
        musicNodes = [];
    }, 600);
};

window.syncMusicVolume = function() {
    if (window.musicOn && !window.globalMuted) {
        musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
        musicMaster.gain.setValueAtTime(musicMaster.gain.value, musicCtx.currentTime);
        musicMaster.gain.linearRampToValueAtTime(window.globalVolume * 0.4, musicCtx.currentTime + 0.1);
    }
};

window.muteMusicGain = function() {
    musicMaster.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMaster.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.2);
};

window.changeTrack = function(val) {
    currentTrack = val;
    localStorage.setItem('musicTrack', currentTrack);
    if (window.musicOn) window.startAmbientMusic();
};

window.toggleMusic = function() {
    window.musicOn = !window.musicOn;
    localStorage.setItem('musicOn', window.musicOn);
    const btn = document.getElementById('musicBtn');
    if (window.musicOn) {
        btn.innerText = '🎵 Music: ON';
        btn.style.color = 'var(--neon-cyan)';
        btn.style.borderColor = 'var(--neon-cyan)';
        btn.title = 'Music: ON';
        window.startAmbientMusic();
    } else {
        btn.innerText = '🎵 Music: OFF';
        btn.style.color = '#444';
        btn.style.borderColor = '#333';
        btn.title = 'Music: OFF';
        window.stopAmbientMusic();
    }
};
