// Guard for locked missions — call at top of each mission's module script
// Usage: await guardMission('darkweb', 50);
import { auth } from "./firebase.js";
import { getUserData } from "./xp.js";
import { isUnlocked, getUnlockXP } from "./unlocks.js";

export async function guardMission(missionId) {
  const user = auth.currentUser;
  if (!user) { window.location.href = "login.html"; return; }
  const data = await getUserData();
  const xp = data?.xp || 0;
  if (!isUnlocked(missionId, xp)) {
    const required = getUnlockXP(missionId);
    document.body.innerHTML = `
      <div class="container" style="text-align:center;padding:60px 40px;">
        <div style="font-size:48px;margin-bottom:16px;">🔒</div>
        <h2 style="font-family:var(--font-cyber);color:#ff003c;">Mission Locked</h2>
        <p style="color:#888;font-size:14px;">You need <strong style="color:var(--neon-cyan);">${required} XP</strong> to unlock this mission.</p>
        <p style="color:#555;font-size:13px;">You currently have <strong style="color:#c0c8d0;">${xp} XP</strong>. Complete other missions to earn more.</p>
        <button class="primary-btn" onclick="window.location.href='index.html'" style="margin-top:24px;clip-path:none;">← Back to Hub</button>
      </div>`;
  }
}
