import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN001', vpa: 'rahul.sharma@upi', amount: 250, risk: 0.05, status: 'passed', module: 'BehaviorCore', time: '2s ago' },
  { id: 'TXN002', vpa: 'lottery@upi', amount: 50000, risk: 0.99, status: 'blocked', module: 'MuleShield', time: '8s ago' },
  { id: 'TXN003', vpa: 'priya.k@upi', amount: 1200, risk: 0.12, status: 'passed', module: 'BehaviorCore', time: '15s ago' },
  { id: 'TXN004', vpa: 'fraud123@upi', amount: 25000, risk: 0.97, status: 'blocked', module: 'MuleShield', time: '23s ago' },
  { id: 'TXN005', vpa: 'rbi.officer@upi', amount: 75000, risk: 0.95, status: 'blocked', module: 'ScamRadar', time: '31s ago' },
  { id: 'TXN006', vpa: 'amit.verma@upi', amount: 500, risk: 0.08, status: 'passed', module: 'BehaviorCore', time: '44s ago' },
  { id: 'TXN007', vpa: 'unknown99@upi', amount: 30000, risk: 0.78, status: 'warned', module: 'ScamRadar', time: '52s ago' },
  { id: 'TXN008', vpa: 'sunita.devi@upi', amount: 100, risk: 0.03, status: 'passed', module: 'VulnGuard', time: '1m ago' },
  { id: 'TXN009', vpa: 'kbc.prize@upi', amount: 99000, risk: 0.99, status: 'blocked', module: 'MuleShield', time: '1m ago' },
  { id: 'TXN010', vpa: 'meera.iyer@upi', amount: 3500, risk: 0.15, status: 'passed', module: 'BehaviorCore', time: '2m ago' },
];

const MODULE_STATS = [
  { name: 'BehaviorCore', icon: '🧠', blocked: 12, color: '#4F46E5' },
  { name: 'ScamRadar', icon: '📡', blocked: 8, color: '#DC2626' },
  { name: 'MuleShield', icon: '🛡', blocked: 34, color: '#D97706' },
  { name: 'VulnGuard', icon: '🌍', blocked: 6, color: '#059669' },
];

export default function Dashboard() {
  const [liveCount, setLiveCount] = useState(5241);
  const [blockedCount, setBlockedCount] = useState(60);
  const [savedAmount, setSavedAmount] = useState(2847500);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 3) + 1);
      setTick(t => t + 1);
      if (Math.random() > 0.7) {
        setBlockedCount(c => c + 1);
        setSavedAmount(c => c + Math.floor(Math.random() * 50000) + 5000);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk >= 0.7) return '#DC2626';
    if (risk >= 0.4) return '#D97706';
    return '#059669';
  };

  const getStatusStyle = (status: string) => {
    if (status === 'blocked') return styles.statusBlocked;
    if (status === 'warned') return styles.statusWarned;
    return styles.statusPassed;
  };

  const getStatusText = (status: string) => {
    if (status === 'blocked') return 'BLOCKED';
    if (status === 'warned') return 'WARNED';
    return 'PASSED';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>TRUST OS</Text>
          <Text style={styles.headerSub}>Fraud Intelligence Dashboard</Text>
        </View>
        <View style={styles.liveDot}>
          <View style={[styles.dot, { opacity: tick % 2 === 0 ? 1 : 0.3 }]} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{liveCount.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Transactions monitored</Text>
        </View>
        <View style={[styles.statCard, styles.statCardRed]}>
          <Text style={[styles.statNumber, { color: '#DC2626' }]}>{blockedCount}</Text>
          <Text style={styles.statLabel}>Blocked today</Text>
        </View>
        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={[styles.statNumber, { color: '#059669', fontSize: 16 }]}>
            ₹{(savedAmount / 100000).toFixed(1)}L
          </Text>
          <Text style={styles.statLabel}>Saved from fraud</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Module Status</Text>
      <View style={styles.modulesRow}>
        {MODULE_STATS.map(m => (
          <View key={m.name} style={styles.moduleCard}>
            <Text style={styles.moduleIcon}>{m.icon}</Text>
            <Text style={styles.moduleName}>{m.name}</Text>
            <Text style={[styles.moduleBlocked, { color: m.color }]}>
              {m.blocked} blocked
            </Text>
            <View style={styles.moduleActiveDot} />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Live Transaction Feed</Text>
      <View style={styles.feedCard}>
        {MOCK_TRANSACTIONS.map((txn, i) => (
          <View key={txn.id} style={[styles.feedRow,
            i < MOCK_TRANSACTIONS.length - 1 && styles.feedRowBorder]}>
            <View style={styles.feedLeft}>
              <Text style={styles.feedVpa}>{txn.vpa}</Text>
              <Text style={styles.feedMeta}>{txn.module} · {txn.time}</Text>
            </View>
            <View style={styles.feedRight}>
              <Text style={styles.feedAmount}>₹{txn.amount.toLocaleString()}</Text>
              <View style={[styles.feedStatus, getStatusStyle(txn.status)]}>
                <Text style={styles.feedStatusText}>{getStatusText(txn.status)}</Text>
              </View>
            </View>
            <View style={styles.feedRisk}>
              <Text style={[styles.feedRiskScore, { color: getRiskColor(txn.risk) }]}>
                {Math.round(txn.risk * 100)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.latencyCard}>
        <Text style={styles.latencyTitle}>⚡ Performance at India scale</Text>
        <View style={styles.latencyRow}>
          <Text style={styles.latencyLabel}>BehaviorCore latency</Text>
          <Text style={styles.latencyValue}>0ms (on-device)</Text>
        </View>
        <View style={styles.latencyRow}>
          <Text style={styles.latencyLabel}>MuleShield lookup</Text>
          <Text style={styles.latencyValue}>&lt;2ms (Redis)</Text>
        </View>
        <View style={styles.latencyRow}>
          <Text style={styles.latencyLabel}>UPI rail impact</Text>
          <Text style={[styles.latencyValue, { color: '#059669' }]}>Zero</Text>
        </View>
        <View style={styles.latencyRow}>
          <Text style={styles.latencyLabel}>Current UPI TPS</Text>
          <Text style={styles.latencyValue}>5,000+</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  liveDot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669' },
  liveText: { fontSize: 11, color: '#059669', fontWeight: '700', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 12, borderWidth: 0.5, borderColor: '#e5e5e5' },
  statCardRed: { borderColor: '#FECACA' },
  statCardGreen: { borderColor: '#A7F3D0' },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#888', lineHeight: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  modulesRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  moduleCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 10, borderWidth: 0.5, borderColor: '#e5e5e5', alignItems: 'center' },
  moduleIcon: { fontSize: 20, marginBottom: 4 },
  moduleName: { fontSize: 10, color: '#444', fontWeight: '600',
    marginBottom: 4, textAlign: 'center' },
  moduleBlocked: { fontSize: 10, fontWeight: '700', marginBottom: 6 },
  moduleActiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669' },
  feedCard: { backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 0.5, borderColor: '#e5e5e5', marginBottom: 16, overflow: 'hidden' },
  feedRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  feedRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  feedLeft: { flex: 1 },
  feedVpa: { fontSize: 12, color: '#1a1a1a', fontWeight: '500' },
  feedMeta: { fontSize: 10, color: '#999', marginTop: 2 },
  feedRight: { alignItems: 'flex-end', gap: 4 },
  feedAmount: { fontSize: 12, color: '#1a1a1a', fontWeight: '600' },
  feedStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBlocked: { backgroundColor: '#FEE2E2' },
  statusWarned: { backgroundColor: '#FEF3C7' },
  statusPassed: { backgroundColor: '#D1FAE5' },
  feedStatusText: { fontSize: 9, fontWeight: '700', color: '#1a1a1a', letterSpacing: 0.5 },
  feedRisk: { width: 36, alignItems: 'center' },
  feedRiskScore: { fontSize: 12, fontWeight: '700' },
  latencyCard: { backgroundColor: '#fff', borderRadius: 16,
    padding: 16, borderWidth: 0.5, borderColor: '#e5e5e5' },
  latencyTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  latencyRow: { flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  latencyLabel: { fontSize: 13, color: '#888' },
  latencyValue: { fontSize: 13, color: '#1a1a1a', fontWeight: '500' },
});