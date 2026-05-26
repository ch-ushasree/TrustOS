import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import Dashboard from './dashboard';

const MULE_DATABASE: Record<string, {
  reason: string;
  riskLevel: string;
  reportCount: number;
  flaggedSince: string;
}> = {
  'fraud123@upi':    { reason: 'Multiple fraud reports', riskLevel: 'Critical', reportCount: 47, flaggedSince: 'Jan 2024' },
  'scammer@upi':     { reason: 'Known mule account', riskLevel: 'Critical', reportCount: 89, flaggedSince: 'Mar 2023' },
  'fake.agent@upi':  { reason: 'Impersonating bank agent', riskLevel: 'High', reportCount: 23, flaggedSince: 'Jun 2024' },
  'lottery@upi':     { reason: 'Lottery scam account', riskLevel: 'Critical', reportCount: 134, flaggedSince: 'Dec 2022' },
  'kbc.prize@upi':   { reason: 'KBC prize fraud', riskLevel: 'Critical', reportCount: 201, flaggedSince: 'Aug 2023' },
  'refund.help@upi': { reason: 'Fake refund scam', riskLevel: 'High', reportCount: 31, flaggedSince: 'Feb 2024' },
  'rbi.officer@upi': { reason: 'Impersonating RBI official', riskLevel: 'Critical', reportCount: 67, flaggedSince: 'Apr 2024' },
  'quick.cash@upi':  { reason: 'Money laundering pattern', riskLevel: 'High', reportCount: 18, flaggedSince: 'Jul 2024' },
};

function checkMuleDatabase(vpa: string) {
  const entry = MULE_DATABASE[vpa.toLowerCase().trim()];
  if (entry) return { isFlagged: true, ...entry };
  return { isFlagged: false };
}

function runBehaviorCore(
  vpa: string,
  amount: string,
  typingDuration: number,
  micActive: boolean,
  userTier: number
) {
  let riskScore = 0;
  const signals: string[] = [];
  const numAmount = parseFloat(amount);

  if (micActive) { riskScore += 0.4; signals.push('Phone call active during transaction'); }
  if (numAmount >= 10000) { riskScore += 0.25; signals.push('Large amount (above ₹10,000)'); }
  if (numAmount % 1000 === 0 && numAmount > 0) { riskScore += 0.2; signals.push('Round number — possibly scammer-dictated'); }
  if (typingDuration < 5000) { riskScore += 0.2; signals.push('Filled too quickly'); }
  if (!vpa.includes('@')) { riskScore += 0.15; signals.push('Invalid VPA format'); }

  return {
    riskScore: Math.min(riskScore, 1),
    signals,
    useVernacular: userTier === 3
  };
}

export default function HomeScreen() {
  const [screen, setScreen] = useState('home');
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [userTier, setUserTier] = useState(1);
  const [riskData, setRiskData] = useState<any>(null);
  const [muleData, setMuleData] = useState<any>(null);
  const screenStartTime = useRef<number>(0);

  const resetAll = () => {
    setVpa(''); setAmount(''); setMicActive(false);
    screenStartTime.current = 0;
    setRiskData(null); setMuleData(null);
  };

  const handleReviewPayment = () => {
    const muleResult = checkMuleDatabase(vpa);
    if (muleResult.isFlagged) {
      setMuleData(muleResult);
      setScreen('mule_warning');
      return;
    }
    const typingDuration = Date.now() - screenStartTime.current;
    const result = runBehaviorCore(vpa, amount, typingDuration, micActive, userTier);
    setRiskData(result);
    if (result.riskScore >= 0.4) {
      setScreen(result.useVernacular ? 'warning_hindi' : 'warning');
    } else {
      setScreen('confirm');
    }
  };

  // ── DASHBOARD ─────────────────────────────────────────
  if (screen === 'dashboard') {
    return (
      <View style={styles.dashContainer}>
        <View style={styles.dashTopBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setScreen('home')}
          >
            <Text style={styles.backBtnText}>← Back to App</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dashContent}>
          <Dashboard />
        </View>
      </View>
    );
  }

  // ── HOME ──────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <View style={styles.outer}>
        <View style={styles.phone}>
          <Text style={styles.header}>TRUST OS</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <Text style={styles.balance}>₹24,500.00</Text>
          </View>
          <View style={styles.tierCard}>
            <Text style={styles.tierLabel}>Demo — select user persona</Text>
            <View style={styles.tierRow}>
              {[
                { t: 1, label: 'Urban' },
                { t: 2, label: 'Semi-urban' },
                { t: 3, label: 'Rural (Hindi)' },
              ].map(({ t, label }) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tierBtn, userTier === t && styles.tierBtnActive]}
                  onPress={() => setUserTier(t)}
                >
                  <Text style={[styles.tierBtnText,
                    userTier === t && styles.tierBtnTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>🧪 Test MuleShield — try these flagged VPAs:</Text>
            {Object.keys(MULE_DATABASE).slice(0, 4).map(v => (
              <TouchableOpacity key={v} onPress={() => { setVpa(v); setScreen('send'); }}>
                <Text style={styles.hintVpa}>→ {v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { screenStartTime.current = 0; setScreen('send'); }}
          >
            <Text style={styles.buttonText}>Send Money</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => setScreen('dashboard')}
          >
            <Text style={styles.dashboardBtnText}>📊 View Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── SEND ──────────────────────────────────────────────
  if (screen === 'send') {
    if (screenStartTime.current === 0) screenStartTime.current = Date.now();
    return (
      <View style={styles.outer}>
        <View style={styles.phone}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustBadgeText}>🛡 TRUST OS is watching</Text>
          </View>
          <Text style={styles.title}>Send Money</Text>
          <Text style={styles.label}>UPI ID (VPA)</Text>
          <TextInput
            style={styles.input}
            placeholder="example@upi"
            value={vpa}
            onChangeText={setVpa}
          />
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity
            style={[styles.micToggle, micActive && styles.micToggleActive]}
            onPress={() => setMicActive(!micActive)}
          >
            <Text style={styles.micToggleText}>
              {micActive ? '📞 Call active (tap to end)' : '📵 No call (tap to simulate call)'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.micHint}>↑ Simulates mic/call detection</Text>
          <TouchableOpacity style={styles.button} onPress={handleReviewPayment}>
            <Text style={styles.buttonText}>Review Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { resetAll(); setScreen('home'); }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── MULE WARNING ──────────────────────────────────────
  if (screen === 'mule_warning') {
    return (
      <ScrollView contentContainerStyle={styles.outer}>
        <View style={styles.phone}>
          <View style={styles.muleCircle}>
            <Text style={styles.muleIcon}>🚫</Text>
          </View>
          <Text style={styles.muleBigTitle}>Payment Blocked</Text>
          <Text style={styles.muleBigSub}>MuleShield has flagged this account</Text>
          <View style={styles.muleCard}>
            <Text style={styles.muleVpaLabel}>Flagged VPA</Text>
            <Text style={styles.muleVpaValue}>{vpa}</Text>
            <View style={styles.divider}/>
            <View style={styles.muleRow}>
              <Text style={styles.muleRowLabel}>Risk Level</Text>
              <View style={[styles.riskBadge,
                muleData?.riskLevel === 'Critical' ?
                styles.riskBadgeCritical : styles.riskBadgeHigh]}>
                <Text style={styles.riskBadgeText}>{muleData?.riskLevel}</Text>
              </View>
            </View>
            <View style={styles.muleRow}>
              <Text style={styles.muleRowLabel}>Reason</Text>
              <Text style={styles.muleRowValue}>{muleData?.reason}</Text>
            </View>
            <View style={styles.muleRow}>
              <Text style={styles.muleRowLabel}>Reports</Text>
              <Text style={styles.muleRowValue}>{muleData?.reportCount} fraud reports</Text>
            </View>
            <View style={styles.muleRow}>
              <Text style={styles.muleRowLabel}>Flagged since</Text>
              <Text style={styles.muleRowValue}>{muleData?.flaggedSince}</Text>
            </View>
          </View>
          <View style={styles.muleInfoCard}>
            <Text style={styles.muleInfoText}>
              🛡 This account was flagged before NPCI settlement. Your money has NOT been sent.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.safeBtn}
            onPress={() => { resetAll(); setScreen('home'); }}
          >
            <Text style={styles.safeBtnText}>✓ Go back to safety</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setScreen('confirm')}
          >
            <Text style={styles.dangerBtnText}>Override — proceed anyway</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── WARNING (English) ─────────────────────────────────
  if (screen === 'warning') {
    return (
      <ScrollView contentContainerStyle={styles.outer}>
        <View style={styles.phone}>
          <View style={styles.warningCircle}>
            <Text style={styles.warningIcon}>⚠</Text>
          </View>
          <Text style={styles.warningBigTitle}>Fraud Risk Detected</Text>
          <Text style={styles.warningBigSub}>
            TRUST OS has flagged this transaction as high risk
          </Text>
          <View style={styles.riskCard}>
            <Text style={styles.riskScoreLabel}>Risk Score</Text>
            <Text style={styles.riskScoreValue}>
              {Math.round((riskData?.riskScore ?? 0) * 100)}%
            </Text>
            <View style={styles.riskBar}>
              <View style={[styles.riskFill,
                { width: `${Math.round((riskData?.riskScore ?? 0) * 100)}%` as any }
              ]} />
            </View>
          </View>
          <View style={styles.signalsCard}>
            <Text style={styles.signalsTitle}>Signals detected:</Text>
            {riskData?.signals.map((signal: string, i: number) => (
              <Text key={i} style={styles.signalItem}>• {signal}</Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setScreen('confirm')}
          >
            <Text style={styles.dangerBtnText}>I understand, proceed anyway</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.safeBtn}
            onPress={() => { resetAll(); setScreen('home'); }}
          >
            <Text style={styles.safeBtnText}>Cancel this payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── WARNING (Hindi) ───────────────────────────────────
  if (screen === 'warning_hindi') {
    return (
      <ScrollView contentContainerStyle={styles.outer}>
        <View style={styles.phone}>
          <View style={styles.warningCircle}>
            <Text style={styles.warningIcon}>⚠</Text>
          </View>
          <Text style={styles.warningBigTitle}>धोखाधड़ी का खतरा!</Text>
          <Text style={styles.warningBigSub}>
            यह लेनदेन संदिग्ध लग रहा है। क्या कोई आपसे पैसे भेजवा रहा है?
          </Text>
          <View style={styles.riskCard}>
            <Text style={styles.riskScoreLabel}>जोखिम स्तर</Text>
            <Text style={styles.riskScoreValue}>
              {Math.round((riskData?.riskScore ?? 0) * 100)}%
            </Text>
            <View style={styles.riskBar}>
              <View style={[styles.riskFill,
                { width: `${Math.round((riskData?.riskScore ?? 0) * 100)}%` as any }
              ]} />
            </View>
          </View>
          <View style={styles.hindiTipsCard}>
            <Text style={styles.hindiTip}>⛔ कोई भी बैंक अधिकारी आपसे UPI पर पैसे नहीं मांगता</Text>
            <Text style={styles.hindiTip}>⛔ OTP या PIN किसी को न बताएं</Text>
            <Text style={styles.hindiTip}>⛔ अनजान व्यक्ति को पैसे न भेजें</Text>
          </View>
          <TouchableOpacity
            style={styles.safeBtn}
            onPress={() => { resetAll(); setScreen('home'); }}
          >
            <Text style={styles.safeBtnText}>✓ भुगतान रद्द करें (सुरक्षित रहें)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setScreen('confirm')}
          >
            <Text style={styles.dangerBtnText}>फिर भी भेजें</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── CONFIRM ───────────────────────────────────────────
  if (screen === 'confirm') {
    return (
      <View style={styles.outer}>
        <View style={styles.phone}>
          <Text style={styles.title}>Confirm Payment</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Sending to</Text>
            <Text style={styles.value}>{vpa}</Text>
            <View style={styles.divider} />
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.bigAmount}>₹{amount}</Text>
          </View>
          {(riskData?.riskScore ?? 0) === 0 && !muleData ? (
            <View style={styles.clearCard}>
              <Text style={styles.clearText}>✓ TRUST OS — Transaction looks clean</Text>
            </View>
          ) : (
            <View style={styles.lowRiskCard}>
              <Text style={styles.lowRiskText}>⚠ TRUST OS — Proceed with caution</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen('success')}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setScreen('send')}
          >
            <Text style={styles.cancelText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────
  return (
    <View style={styles.outer}>
      <View style={styles.phone}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Payment Successful</Text>
        <Text style={styles.successSub}>Verified by TRUST OS</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Sent to</Text>
          <Text style={styles.value}>{vpa}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.bigAmount}>₹{amount}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { resetAll(); setScreen('home'); }}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flexGrow: 1, backgroundColor: '#e5e7eb',
    alignItems: 'center', justifyContent: 'center', padding: 20 },
  phone: { backgroundColor: '#f5f5f5', width: 390,
    borderRadius: 40, padding: 24,
    alignItems: 'center', justifyContent: 'center' },
  dashContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  dashTopBar: { backgroundColor: '#fff', paddingHorizontal: 20,
    paddingVertical: 12, borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5' },
  backBtn: { backgroundColor: '#4F46E5', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    alignSelf: 'flex-start' },
  backBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  dashContent: { flex: 1 },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  balanceCard: { backgroundColor: '#fff', borderRadius: 16,
    padding: 24, width: '100%', marginBottom: 16 },
  balanceLabel: { fontSize: 13, color: '#888', marginBottom: 4 },
  balance: { fontSize: 32, fontWeight: '700', color: '#1a1a1a' },
  tierCard: { backgroundColor: '#fff', borderRadius: 12,
    padding: 14, width: '100%', marginBottom: 12,
    borderWidth: 0.5, borderColor: '#ddd' },
  tierLabel: { fontSize: 11, color: '#888', marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5 },
  tierRow: { flexDirection: 'row', gap: 8 },
  tierBtn: { flex: 1, padding: 8, borderRadius: 8,
    borderWidth: 0.5, borderColor: '#ddd',
    backgroundColor: '#f5f5f5', alignItems: 'center' },
  tierBtnActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  tierBtnText: { fontSize: 12, color: '#666', fontWeight: '500' },
  tierBtnTextActive: { color: '#fff' },
  hintCard: { backgroundColor: '#EEF2FF', borderRadius: 12,
    padding: 14, width: '100%', marginBottom: 16,
    borderWidth: 0.5, borderColor: '#C7D2FE' },
  hintTitle: { fontSize: 12, color: '#4338CA', fontWeight: '600', marginBottom: 8 },
  hintVpa: { fontSize: 12, color: '#4338CA', marginBottom: 4 },
  trustBadge: { backgroundColor: '#EEF2FF', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 20, borderWidth: 0.5, borderColor: '#C7D2FE' },
  trustBadgeText: { fontSize: 12, color: '#4338CA', fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 20, alignSelf: 'flex-start' },
  label: { fontSize: 13, color: '#888', alignSelf: 'flex-start', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14,
    fontSize: 16, marginBottom: 16, borderWidth: 0.5,
    borderColor: '#ddd', width: '100%' },
  micToggle: { width: '100%', padding: 14, borderRadius: 10,
    backgroundColor: '#F3F4F6', borderWidth: 0.5,
    borderColor: '#ddd', alignItems: 'center', marginBottom: 4 },
  micToggleActive: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  micToggleText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  micHint: { fontSize: 11, color: '#9CA3AF', marginBottom: 16, alignSelf: 'flex-start' },
  button: { backgroundColor: '#4F46E5', borderRadius: 12,
    padding: 16, width: '100%', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dashboardBtn: { backgroundColor: '#1a1a1a', borderRadius: 12,
    padding: 14, width: '100%', alignItems: 'center', marginTop: 8 },
  dashboardBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  cancelBtn: { padding: 16, width: '100%', alignItems: 'center' },
  cancelText: { color: '#666', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%', marginBottom: 16 },
  divider: { height: 0.5, backgroundColor: '#eee', marginVertical: 14 },
  value: { fontSize: 16, fontWeight: '500', marginTop: 4, color: '#1a1a1a' },
  bigAmount: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  muleCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEE2E2', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16 },
  muleIcon: { fontSize: 36 },
  muleBigTitle: { fontSize: 24, fontWeight: '700',
    color: '#991B1B', marginBottom: 8, textAlign: 'center' },
  muleBigSub: { fontSize: 13, color: '#666',
    textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  muleCard: { backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%', marginBottom: 12 },
  muleVpaLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  muleVpaValue: { fontSize: 15, fontWeight: '600', color: '#991B1B', marginBottom: 8 },
  muleRow: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 10 },
  muleRowLabel: { fontSize: 13, color: '#888' },
  muleRowValue: { fontSize: 13, fontWeight: '500', color: '#1a1a1a', flex: 1, textAlign: 'right' },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  riskBadgeCritical: { backgroundColor: '#FEE2E2' },
  riskBadgeHigh: { backgroundColor: '#FEF3C7' },
  riskBadgeText: { fontSize: 12, fontWeight: '600', color: '#991B1B' },
  muleInfoCard: { backgroundColor: '#D1FAE5', borderRadius: 12,
    padding: 14, width: '100%', marginBottom: 16,
    borderWidth: 0.5, borderColor: '#6EE7B7' },
  muleInfoText: { fontSize: 13, color: '#065F46', lineHeight: 20 },
  warningCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEE2E2', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16 },
  warningIcon: { fontSize: 36 },
  warningBigTitle: { fontSize: 22, fontWeight: '700',
    color: '#991B1B', marginBottom: 8, textAlign: 'center' },
  warningBigSub: { fontSize: 13, color: '#666',
    textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  riskCard: { backgroundColor: '#FEE2E2', borderRadius: 12,
    padding: 16, width: '100%', marginBottom: 12,
    borderWidth: 0.5, borderColor: '#FCA5A5' },
  riskScoreLabel: { fontSize: 12, color: '#991B1B', marginBottom: 4 },
  riskScoreValue: { fontSize: 32, fontWeight: '700', color: '#991B1B' },
  riskBar: { height: 6, backgroundColor: '#FECACA',
    borderRadius: 3, marginTop: 8, width: '100%' },
  riskFill: { height: 6, backgroundColor: '#EF4444', borderRadius: 3 },
  signalsCard: { backgroundColor: '#fff', borderRadius: 12,
    padding: 16, width: '100%', marginBottom: 16,
    borderWidth: 0.5, borderColor: '#ddd' },
  signalsTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 10 },
  signalItem: { fontSize: 13, color: '#DC2626', marginBottom: 6, lineHeight: 18 },
  hindiTipsCard: { backgroundColor: '#fff', borderRadius: 12,
    padding: 16, width: '100%', marginBottom: 20,
    borderWidth: 0.5, borderColor: '#ddd' },
  hindiTip: { fontSize: 13, color: '#1a1a1a', marginBottom: 10, lineHeight: 20 },
  dangerBtn: { backgroundColor: '#EF4444', borderRadius: 12,
    padding: 16, width: '100%', alignItems: 'center', marginBottom: 10 },
  dangerBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  safeBtn: { backgroundColor: '#D1FAE5', borderRadius: 12,
    padding: 16, width: '100%', alignItems: 'center', marginBottom: 10 },
  safeBtnText: { color: '#065F46', fontSize: 15, fontWeight: '600' },
  lowRiskCard: { backgroundColor: '#FEF3C7', borderRadius: 10,
    padding: 12, width: '100%', marginBottom: 12,
    borderWidth: 0.5, borderColor: '#F59E0B' },
  lowRiskText: { fontSize: 13, color: '#92400E', fontWeight: '500' },
  clearCard: { backgroundColor: '#D1FAE5', borderRadius: 10,
    padding: 12, width: '100%', marginBottom: 12,
    borderWidth: 0.5, borderColor: '#6EE7B7' },
  clearText: { fontSize: 13, color: '#065F46', fontWeight: '500' },
  successCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#D1FAE5', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20 },
  successIcon: { fontSize: 36, color: '#059669' },
  successTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#059669', marginBottom: 32, fontWeight: '500' },
});