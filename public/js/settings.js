// settings.js — Settings panel UI, high-contrast, font size, mute

// High contrast
window.toggleHighContrast = function() {
    document.documentElement.classList.toggle('high-contrast');
    localStorage.setItem('high-contrast', document.documentElement.classList.contains('high-contrast'));
    highlightFontBtn(localStorage.getItem('fontSize') || 'font-md');
};
if (localStorage.getItem('high-contrast') === 'true') {
    document.documentElement.classList.add('high-contrast');
}

function highlightFontBtn(cls) {
    const sel = document.getElementById('fontSizeSelect');
    if (sel) sel.value = cls;
}

window.setFontSize = function(cls) {
    document.documentElement.className = document.documentElement.className
        .replace(/font-(sm|md|lg)/g, '').trim() + ' ' + cls;
    localStorage.setItem('fontSize', cls);
    highlightFontBtn(cls);
};

window.toggleMute = function() {
    window.globalMuted = !window.globalMuted;
    localStorage.setItem('muted', window.globalMuted);
    const btn = document.getElementById('muteBtn');
    btn.innerText = window.globalMuted ? '🔇' : '🔈';
    btn.setAttribute('aria-label', window.globalMuted ? 'Unmute' : 'Mute');
    if (window.globalMuted) {
        window.muteMusicGain && window.muteMusicGain();
    } else if (window.musicOn) {
        window.syncMusicVolume && window.syncMusicVolume();
    }
};

function injectSettingsPanel() {
    if (document.getElementById('settingsToggleBtn')) return;

    const savedFont = localStorage.getItem('fontSize') || 'font-md';
    document.documentElement.className = document.documentElement.className
        .replace(/font-(sm|md|lg)/g, '').trim() + ' ' + savedFont;

    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settingsToggleBtn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Settings';
    settingsBtn.setAttribute('aria-label', 'Open settings');
    settingsBtn.style.cssText = 'position:fixed;top:55px;right:15px;z-index:10000;padding:6px 10px;font-size:16px;clip-path:none;background:rgba(0,0,0,0.92);border:1px solid var(--neon-cyan);border-radius:4px;cursor:pointer;';
    settingsBtn.onclick = () => {
        const panel = document.getElementById('settingsPanel');
        const open = panel.style.display === 'flex';
        panel.style.display = open ? 'none' : 'flex';
        localStorage.setItem('settingsPanelOpen', !open);
    };
    document.body.appendChild(settingsBtn);

    const track = localStorage.getItem('musicTrack') || 'cyberpunk';
    const vol = window.globalVolume ?? 0.5;
    const muted = window.globalMuted;
    const musicOn = window.musicOn;
    const panelOpen = localStorage.getItem('settingsPanelOpen') === 'true';

    const panel = document.createElement('div');
    panel.id = 'settingsPanel';
    panel.style.cssText = `position:fixed;top:95px;right:15px;z-index:9999;display:${panelOpen ? 'flex' : 'none'};flex-direction:column;gap:10px;background:rgba(0,0,0,0.95);border:1px solid var(--neon-cyan);padding:12px 14px;border-radius:4px;font-size:12px;min-width:180px;`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Settings panel');
    panel.innerHTML = `
        <div style="color:var(--neon-cyan);font-size:11px;letter-spacing:1px;border-bottom:1px solid #222;padding-bottom:6px;">⚙️ SETTINGS</div>

        <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#888;font-size:10px;letter-spacing:1px;">🔤 FONT SIZE</label>
            <select id="fontSizeSelect" aria-label="Font size" onchange="setFontSize(this.value)"
                style="background:#111;color:var(--neon-cyan);border:1px solid #333;font-size:11px;padding:4px 6px;cursor:pointer;font-family:var(--font-main);border-radius:3px;">
                <option value="font-sm">Small</option>
                <option value="font-md">Medium</option>
                <option value="font-lg">Large</option>
            </select>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#888;font-size:10px;letter-spacing:1px;">🎵 MUSIC TRACK</label>
            <select id="trackSelect" aria-label="Select music track" onchange="changeTrack(this.value)"
                style="background:#111;color:var(--neon-cyan);border:1px solid #333;font-size:11px;padding:4px 6px;cursor:pointer;font-family:var(--font-main);border-radius:3px;">
                <option value="cyberpunk" ${track==='cyberpunk'?'selected':''}>⚡ Cyberpunk</option>
                <option value="dark"      ${track==='dark'     ?'selected':''}>🌑 Dark Ambient</option>
                <option value="hacker"    ${track==='hacker'   ?'selected':''}>💻 Hacker Terminal</option>
            </select>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#888;font-size:10px;letter-spacing:1px;">🔊 VOLUME</label>
            <div style="display:flex;align-items:center;gap:6px;">
                <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${vol}"
                    style="flex:1;accent-color:var(--neon-cyan);cursor:pointer;" title="Volume" aria-label="Volume control" />
                <button id="muteBtn" onclick="toggleMute()" style="padding:3px 8px;font-size:12px;clip-path:none;" aria-label="${muted ? 'Unmute' : 'Mute'}">${muted ? '🔇' : '🔈'}</button>
            </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;">
            <label style="color:#888;font-size:10px;letter-spacing:1px;">🎵 MUSIC</label>
            <button id="musicBtn" onclick="toggleMusic()" title="Music: ${musicOn ? 'ON' : 'OFF'}" aria-label="Toggle ambient music"
                style="padding:5px;font-size:11px;clip-path:none;color:${musicOn ? 'var(--neon-cyan)' : '#444'};border-color:${musicOn ? 'var(--neon-cyan)' : '#333'};"
            >${musicOn ? '🎵 Music: ON' : '🎵 Music: OFF'}</button>
        </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('volumeSlider').oninput = (e) => {
        window.globalVolume = parseFloat(e.target.value);
        localStorage.setItem('volume', window.globalVolume);
        if (window.globalMuted) {
            window.globalMuted = false;
            localStorage.setItem('muted', false);
            document.getElementById('muteBtn').innerText = '🔈';
        }
        window.syncMusicVolume && window.syncMusicVolume();
    };

    highlightFontBtn(savedFont);
    if (window.musicOn) window.startAmbientMusic && window.startAmbientMusic();
}

document.addEventListener('DOMContentLoaded', injectSettingsPanel);
