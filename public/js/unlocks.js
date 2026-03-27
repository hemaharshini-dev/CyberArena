// ── UNLOCK DEFINITIONS ───────────────────────────────────────
// Each unlock: { id, xpRequired, type, label, description }
// type: 'mission' | 'badge' | 'feature'

export const UNLOCKS = [
  // Missions locked until XP threshold
  { id: 'darkweb',  xpRequired: 50,  type: 'mission', label: '🌐 Dark Web Market',    description: 'Reach 50 XP to unlock' },
  { id: 'incident', xpRequired: 100, type: 'mission', label: '🚨 Incident Response',  description: 'Reach 100 XP to unlock' },
  { id: 'ai',       xpRequired: 75,  type: 'mission', label: '🤖 AI Crime Lab',        description: 'Reach 75 XP to unlock' },

  // Cosmetic badges
  { id: 'badge_detective', xpRequired: 50,  type: 'badge', label: '🔍 Detective',      description: 'Awarded at 50 XP' },
  { id: 'badge_shield',    xpRequired: 200, type: 'badge', label: '🛡️ Shield',         description: 'Awarded at 200 XP' },
  { id: 'badge_elite',     xpRequired: 500, type: 'badge', label: '👑 Elite Guardian', description: 'Awarded at 500 XP' },

  // Features
  { id: 'feature_creator',  xpRequired: 150, type: 'feature', label: '🧪 Mission Creator', description: 'Reach 150 XP to unlock the custom mission builder' },
  { id: 'feature_hardmode', xpRequired: 300, type: 'feature', label: '🔥 Hard Mode',        description: 'Reach 300 XP — all missions run at Elite difficulty' },
];

// ── CHECK WHAT'S UNLOCKED ─────────────────────────────────────
export function getUnlocked(xp) {
  return UNLOCKS.filter(u => xp >= u.xpRequired).map(u => u.id);
}

export function isUnlocked(id, xp) {
  const unlock = UNLOCKS.find(u => u.id === id);
  if (!unlock) return true; // not in unlock list = always available
  return xp >= unlock.xpRequired;
}

export function getUnlockXP(id) {
  const unlock = UNLOCKS.find(u => u.id === id);
  return unlock ? unlock.xpRequired : 0;
}

// ── NEWLY UNLOCKED (since last check) ────────────────────────
export function getNewlyUnlocked(oldXP, newXP) {
  return UNLOCKS.filter(u => oldXP < u.xpRequired && newXP >= u.xpRequired);
}

// ── APPLY LOCK STATE TO MISSION BUTTONS ──────────────────────
export function applyLockStates(xp) {
  const missionLocks = UNLOCKS.filter(u => u.type === 'mission');
  const featureLocks = UNLOCKS.filter(u => u.type === 'feature');

  [...missionLocks, ...featureLocks].forEach(unlock => {
    // Find button by its onclick containing the mission id
    const missionId = unlock.id.replace('feature_', '');
    const btn = document.querySelector(`button[onclick*="startMission('${missionId}')"]`);
    if (!btn) return;

    if (xp < unlock.xpRequired) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      btn.style.position = 'relative';
      // Add lock overlay if not already there
      if (!btn.querySelector('.lock-overlay')) {
        const lock = document.createElement('span');
        lock.className = 'lock-overlay';
        lock.innerHTML = `🔒 <span style="font-size:10px;display:block;margin-top:2px;">${unlock.xpRequired} XP</span>`;
        lock.style.cssText = 'position:absolute;top:6px;right:8px;font-size:12px;color:#ff003c;font-family:var(--font-main);text-align:center;line-height:1.2;';
        btn.appendChild(lock);
      }
      btn.title = unlock.description;
    } else {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
      const lock = btn.querySelector('.lock-overlay');
      if (lock) lock.remove();
      btn.title = '';
    }
  });
}

// ── NOTIFICATION BELL ─────────────────────────────────────────
export function addUnlockNotification(unlock) {
  const notifications = JSON.parse(localStorage.getItem('unlockNotifications') || '[]');
  // Don't add duplicates
  if (notifications.find(n => n.id === unlock.id)) return;
  notifications.push({ id: unlock.id, label: unlock.label, description: unlock.description, read: false });
  localStorage.setItem('unlockNotifications', JSON.stringify(notifications));
}

export function getUnreadCount() {
  const notifications = JSON.parse(localStorage.getItem('unlockNotifications') || '[]');
  return notifications.filter(n => !n.read).length;
}

export function markAllRead() {
  const notifications = JSON.parse(localStorage.getItem('unlockNotifications') || '[]');
  notifications.forEach(n => n.read = true);
  localStorage.setItem('unlockNotifications', JSON.stringify(notifications));
}

export function getNotifications() {
  return JSON.parse(localStorage.getItem('unlockNotifications') || '[]');
}
