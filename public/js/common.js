// common.js — loader only; logic lives in the four focused modules below
// Load order matters: music.js defines globals that settings.js and sounds.js consume
(function() {
    const base = document.currentScript
        ? document.currentScript.src.replace(/common\.js.*$/, '')
        : 'js/';
    ['music.js', 'sounds.js', 'breadcrumb.js', 'settings.js'].forEach(function(file) {
        const s = document.createElement('script');
        s.src = base + file;
        document.head.appendChild(s);
    });

    // Navigation helpers used inline by hub.html and mission pages
    window.startMission = function(type) { window.location.href = type + '.html'; };
    window.goHome = function() { window.location.href = 'hub.html'; };
})();
