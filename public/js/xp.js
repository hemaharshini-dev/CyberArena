import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function updateXP(points, missionId = null) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const updateData = {
    xp: increment(points),
    missionsCompleted: increment(1),
  };
  if (missionId) updateData.completedMissions = arrayUnion(missionId);

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
