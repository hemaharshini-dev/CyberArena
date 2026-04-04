import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Returns true if XP was awarded, false if already earned before
export async function updateXP(points, missionId = null) {
  const user = auth.currentUser;
  if (!user) return false;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Permanent cap: only award XP once ever per mission
  if (missionId && userSnap.exists()) {
    const completed = userSnap.data().completedMissions || [];
    if (completed.includes(missionId)) return false;
  }

  const updateData = {
    xp: increment(points),
    missionsCompleted: increment(1),
  };
  if (missionId) {
    updateData.completedMissions = arrayUnion(missionId);
  }

  if (userSnap.exists()) {
    await updateDoc(userRef, updateData);
  } else {
    await setDoc(userRef, {
      email: user.email,
      xp: points,
      missionsCompleted: 1,
      completedMissions: missionId ? [missionId] : [],
      achievements: [],
    });
  }
  return true;
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
