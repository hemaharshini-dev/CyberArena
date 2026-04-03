// breadcrumb.js — Auto-inject navigation breadcrumb on mission pages
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
    if (document.getElementById('breadcrumb')) return;

    const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    if (['hub', 'index', 'login', ''].includes(path)) return;

    const crumb = document.createElement('div');
    crumb.id = 'breadcrumb';
    crumb.style.cssText = 'font-size:11px;color:#666;margin-bottom:10px;text-align:left;';
    crumb.innerHTML = `<a href="hub.html" style="color:#666;text-decoration:none;" onmouseover="this.style.color='var(--neon-cyan)'" onmouseout="this.style.color='#666'">Hub</a> <span style="color:#444;">›</span> <span style="color:var(--neon-cyan);">${PAGE_NAMES[path] || path}</span>`;

    const container = document.querySelector('.container');
    if (!container) return;
    const backBtn = container.querySelector('.back-btn');
    if (backBtn) backBtn.insertAdjacentElement('afterend', crumb);
    else container.prepend(crumb);
}

document.addEventListener('DOMContentLoaded', injectBreadcrumb);
