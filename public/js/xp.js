import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function updateXP(points, missionId = null) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Per-mission daily cap: only award XP once per mission per calendar day
  if (missionId && userSnap.exists()) {
    const played = userSnap.data().dailyXP || {};
    const key = `${missionId}_${todayKey()}`;
    if (played[key]) return;
  }

  const updateData = {
    xp: increment(points),
    missionsCompleted: increment(1),
  };
  if (missionId) {
    updateData.completedMissions = arrayUnion(missionId);
    updateData[`dailyXP.${missionId}_${todayKey()}`] = true;
  }

  if (userSnap.exists()) {
    await updateDoc(userRef, updateData);
  } else {
    await setDoc(userRef, {
      email: user.email,
      xp: points,
      missionsCompleted: 1,
      completedMissions: missionId ? [missionId] : [],
      dailyXP: missionId ? { [`${missionId}_${todayKey()}`]: true } : {},
      achievements: [],
    });
  }
}

export async function getUserData() {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return { xp: 0, missionsCompleted: 0, achievements: [] };
  }
}
