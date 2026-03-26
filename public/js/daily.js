import { db, auth } from "./firebase.js";
import {
  doc, getDoc, setDoc, collection, query,
  orderBy, limit, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── DATE KEY ──────────────────────────────────────────────────
export function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ── SEEDED RANDOM (deterministic per day) ─────────────────────
function seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(dateKey) {
  return dateKey.replace(/-/g,'').split('').reduce((a,c) => a + c.charCodeAt(0), 0);
}

// ── CHALLENGE POOL ────────────────────────────────────────────
const POOL = [
  {
    type: "phishing",
    question: "You receive an email from <strong>security@paypa1-alerts.com</strong> saying your account is locked. What do you do?",
    choices: [
      { text: "Click the link in the email to unlock your account.", correct: false, explain: "paypa1 ≠ paypal — this is a lookalike domain designed to trick you." },
      { text: "Go directly to paypal.com in your browser and check your account.", correct: true, explain: "Always navigate directly to the official site instead of clicking email links." },
      { text: "Reply to the email asking for more details.", correct: false, explain: "Replying confirms your email is active and may invite further attacks." },
      { text: "Forward it to a friend to check.", correct: false, explain: "Your friend could also be tricked. Report it to your email provider instead." }
    ]
  },
  {
    type: "social",
    question: "Someone calls claiming to be from your bank's fraud team. They say your card was used in Dubai and need your CVV to cancel the transaction. What do you do?",
    choices: [
      { text: "Give them the CVV — it's urgent and they called you.", correct: false, explain: "Banks never ask for your CVV over the phone. This is vishing." },
      { text: "Hang up and call the number on the back of your card.", correct: true, explain: "Always verify by calling the official number yourself, never trust inbound calls." },
      { text: "Ask them to email you the details first.", correct: false, explain: "Attackers can also send convincing emails. Always call back on the official number." },
      { text: "Give them only the first two digits to test them.", correct: false, explain: "Any partial information can be used to build trust for further manipulation." }
    ]
  },
  {
    type: "password",
    question: "Which of these passwords is the strongest?",
    choices: [
      { text: "P@ssw0rd123!", correct: false, explain: "Common substitutions (@ for a, 0 for o) are well-known to crackers and in every dictionary attack." },
      { text: "correct-horse-battery-staple", correct: true, explain: "A passphrase of 4+ random words has extremely high entropy and is easy to remember." },
      { text: "MyDog$Name2024", correct: false, explain: "Personal information combined with a year is predictable and easily guessed." },
      { text: "Qx9!mZ", correct: false, explain: "Short passwords are weak regardless of complexity — length matters most." }
    ]
  },
  {
    type: "malware",
    question: "Your colleague opens an email attachment and their screen shows a ransom note. Files are being encrypted. What's the FIRST thing to do?",
    choices: [
      { text: "Pay the ransom immediately to stop the encryption.", correct: false, explain: "Payment doesn't guarantee recovery and funds further attacks. Never pay first." },
      { text: "Run antivirus software on the infected machine.", correct: false, explain: "Running tools on an infected, network-connected machine can spread the malware further." },
      { text: "Physically disconnect the machine from the network immediately.", correct: true, explain: "Isolation stops lateral spread. This is always step one in ransomware response." },
      { text: "Restart the computer to clear the malware.", correct: false, explain: "Restarting doesn't remove ransomware and may trigger additional payloads." }
    ]
  },
  {
    type: "smishing",
    question: "You get an SMS: 'Your HDFC account is suspended. Verify now: hdfc-secure-verify.net'. What do you do?",
    choices: [
      { text: "Click the link — your bank account might actually be suspended.", correct: false, explain: "Banks never send suspension notices via SMS with third-party links." },
      { text: "Call the number in the SMS to verify.", correct: false, explain: "The number in the SMS is also controlled by the attacker." },
      { text: "Open your bank's official app or call the number on your card.", correct: true, explain: "Always verify through official channels you already know, not ones provided in the message." },
      { text: "Reply STOP to unsubscribe.", correct: false, explain: "Replying confirms your number is active and may lead to more targeted attacks." }
    ]
  },
  {
    type: "mfa",
    question: "You receive 5 rapid MFA push notifications you didn't request. What does this mean and what should you do?",
    choices: [
      { text: "Approve one to make them stop — it's probably a glitch.", correct: false, explain: "This is an MFA fatigue attack. Approving gives the attacker full access to your account." },
      { text: "Ignore them — they'll stop eventually.", correct: false, explain: "Ignoring doesn't address the root cause. Your password is likely already compromised." },
      { text: "Deny all, change your password immediately, and report to IT.", correct: true, explain: "Rapid unsolicited MFA requests mean your password is compromised. Deny, rotate credentials, and report." },
      { text: "Turn off MFA to stop the notifications.", correct: false, explain: "Disabling MFA removes your last line of defence and makes the attacker's job easier." }
    ]
  },
  {
    type: "darkweb",
    question: "You find your work email in a breach database from 2022. The leaked data includes your hashed password. What should you do?",
    choices: [
      { text: "Nothing — it's hashed so it's safe.", correct: false, explain: "Hashed passwords can be cracked, especially if they're weak or unsalted. Always rotate." },
      { text: "Change only the password for that specific service.", correct: false, explain: "If you reused that password elsewhere, all those accounts are at risk too." },
      { text: "Change that password everywhere you used it and enable MFA on all accounts.", correct: true, explain: "Assume the hash will be cracked. Rotate all reused passwords and add MFA as a second layer." },
      { text: "Delete your account on that service.", correct: false, explain: "Deleting the account doesn't protect other services where you used the same password." }
    ]
  },
  {
    type: "quishing",
    question: "A QR code on a restaurant table asks you to scan to view the menu. Before scanning, what should you check?",
    choices: [
      { text: "Nothing — QR codes on restaurant tables are always safe.", correct: false, explain: "Attackers place fake QR stickers over legitimate ones in public spaces." },
      { text: "Check if the QR code sticker is placed over another sticker underneath.", correct: true, explain: "Physical inspection for overlaid stickers is the key defence against QR code tampering." },
      { text: "Only scan if the restaurant looks reputable.", correct: false, explain: "Appearance of legitimacy is exactly what attackers exploit. Always inspect the QR code itself." },
      { text: "Scan it but don't enter any personal information.", correct: false, explain: "Simply visiting a malicious URL can trigger drive-by downloads or credential harvesting pages." }
    ]
  },
  {
    type: "phishing",
    question: "An email from <strong>ceo@yourcompany-corp.com</strong> asks you to urgently wire £50,000 to a new supplier. Your CEO is travelling. What do you do?",
    choices: [
      { text: "Process it — the CEO's email address looks correct.", correct: false, explain: "This is a Business Email Compromise (BEC) attack. The domain yourcompany-corp.com ≠ yourcompany.com." },
      { text: "Reply to the email asking for confirmation.", correct: false, explain: "Replying goes back to the attacker's address. Always verify through a separate channel." },
      { text: "Call your CEO directly on their known phone number to verify.", correct: true, explain: "Any financial request must be verified via a second, independent channel — especially when urgent." },
      { text: "Forward to your manager and let them decide.", correct: false, explain: "Forwarding delays response. The correct action is immediate verification via phone." }
    ]
  },
  {
    type: "social",
    question: "A new 'IT contractor' visits your office and asks to plug a USB drive into a server to 'run diagnostics'. You don't recognise them. What do you do?",
    choices: [
      { text: "Let them — they have a contractor badge.", correct: false, explain: "Badges can be faked. Baiting via USB is a classic physical social engineering attack." },
      { text: "Escort them to reception and verify their identity with your IT manager before allowing access.", correct: true, explain: "Always verify unknown visitors through official channels before granting any system access." },
      { text: "Watch them while they do it to make sure nothing bad happens.", correct: false, explain: "Malware installs in seconds. Watching doesn't prevent it." },
      { text: "Ask them to come back tomorrow when your manager is in.", correct: false, explain: "Better than letting them in, but the correct action is immediate verification, not deferral." }
    ]
  },
  {
    type: "password",
    question: "A website stores your password as an MD5 hash without salting. Why is this dangerous?",
    choices: [
      { text: "MD5 is too long and wastes storage.", correct: false, explain: "MD5 produces a fixed 128-bit hash — storage is not the issue." },
      { text: "Identical passwords produce identical hashes, enabling rainbow table attacks.", correct: true, explain: "Without salting, attackers can precompute hashes for common passwords and instantly crack them in bulk." },
      { text: "MD5 hashes can be reversed back to the original password.", correct: false, explain: "MD5 is one-way and cannot be directly reversed, but it can be cracked via rainbow tables." },
      { text: "MD5 is too slow for login verification.", correct: false, explain: "MD5 is actually very fast — which is part of the problem. Fast hashing makes brute force easier." }
    ]
  },
  {
    type: "malware",
    question: "You find a USB drive in the car park labelled 'Salary Review 2024'. What do you do?",
    choices: [
      { text: "Plug it into your work computer to see what's on it.", correct: false, explain: "This is a classic baiting attack. USB drives in car parks are a well-known malware delivery method." },
      { text: "Plug it into a personal computer instead — safer than work.", correct: false, explain: "Your personal device is equally at risk and may be connected to the same network." },
      { text: "Hand it to IT Security without plugging it in anywhere.", correct: true, explain: "IT Security can safely analyse the drive in an isolated environment. Never plug in unknown USB devices." },
      { text: "Throw it away — problem solved.", correct: false, explain: "Disposing of it doesn't help IT understand the threat or warn others." }
    ]
  }
];

// ── GET TODAY'S CHALLENGE ─────────────────────────────────────
export function getTodayChallenge() {
  const key = getTodayKey();
  const seed = dateToSeed(key);
  const rand = seededRand(seed);
  const idx = Math.floor(rand() * POOL.length);
  // Shuffle choices deterministically
  const q = JSON.parse(JSON.stringify(POOL[idx]));
  q.choices = q.choices.map(c => ({ ...c, _sort: rand() }))
                        .sort((a,b) => a._sort - b._sort)
                        .map(({ _sort, ...c }) => c);
  return q;
}

// ── CHECK IF ALREADY PLAYED TODAY ────────────────────────────
export async function hasPlayedToday() {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const key = getTodayKey();
    const ref = doc(db, "dailyScores", key, "players", user.uid);
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (e) {
    console.warn("hasPlayedToday error:", e.code, e.message);
    return false;
  }
}

// ── SUBMIT DAILY SCORE ────────────────────────────────────────
export async function submitDailyScore(correct, timeTaken) {
  const user = auth.currentUser;
  if (!user) return;
  const key = getTodayKey();
  const xpEarned = correct ? Math.max(10, 30 - Math.floor(timeTaken / 2)) : 5;
  const ref = doc(db, "dailyScores", key, "players", user.uid);
  await setDoc(ref, {
    email: user.email,
    correct,
    timeTaken,
    xp: xpEarned,
    timestamp: serverTimestamp()
  });
  return xpEarned;
}

// ── LOAD DAILY LEADERBOARD ────────────────────────────────────
export async function getDailyLeaderboard() {
  const key = getTodayKey();
  const q = query(
    collection(db, "dailyScores", key, "players"),
    orderBy("xp", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), uid: d.id }));
}
