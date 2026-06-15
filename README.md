# TRUST OS — UPI Fraud Detection Platform

**A real-time fraud detection system built on top of UPI payments, designed for India's 500M+ users across all literacy levels and geographies.**

🔗 **Live Demo:** https://phenomenal-sprite-dbfc9d.netlify.app/

---

## What it does

TRUST OS silently monitors UPI transactions and intercepts fraud before money leaves the account — with zero added latency to the UPI rail.

---

## Modules

**BehaviorCore** — Scores user behavior silently on-device. Detects hesitation, unusual typing speed, and session anomalies.

**ScamRadar** — Detects social engineering signals in real time. Flags active phone calls during transactions, copy-pasted amounts, round numbers, and new high-value payees.

**MuleShield** — Pre-computed VPA trust scoring via instant database lookup. Blocks known mule accounts before NPCI settlement.

**VulnGuard** — Vulnerability profiling for rural and first-time users. Delivers warnings in Hindi, Telugu, and other vernacular languages with simple Yes/No UI — the only fraud system designed for India's Tier-2/3 demographic.

**TrustMesh** *(Architecture)* — Designed inter-bank pseudonymised fraud signal sharing via NPCI's Kafka infrastructure. Pending RBI regulatory framework.

---

## Tech Stack

React Native (Expo) · FastAPI · Redis · scikit-learn

---

## Get Started

```bash
npm install
npx expo start --web
```

Or just open the live demo directly — no setup needed.

---

## India Scale

All detection runs client-side or via pre-computed lookups. Zero latency added to UPI's 5,000+ TPS rail. Designed to handle 1 billion users without architectural changes.

---

## Future Improvements

- **ESP32 Panic Button** — One press freezes UPI account and alerts a registered family member via SMS
- **BC Agent Traffic Light** — Physical LED indicator at Banking Correspondent desks showing real-time transaction risk
- **TrustMesh** — Full inter-bank fraud signal network pending RBI regulatory framework

---

## Inspiration

Built for India's 500M Tier-2/3 UPI users who receive fraud warnings in English they cannot read. TRUST OS speaks their language.
