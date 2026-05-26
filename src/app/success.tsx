import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Success() {
  const router = useRouter();

  return (
    <View style={styles.outer}>
      <View style={styles.phone}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.sub}>Your money has been sent securely</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>TXN{Math.floor(Math.random() * 9000000 + 1000000)}</Text>
          <View style={styles.divider}/>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.status}>✓ Verified by TRUST OS</Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#e5e7eb',
    alignItems: 'center', justifyContent: 'center' },
  phone: { backgroundColor: '#f5f5f5', width: 390,
    minHeight: 700, borderRadius: 40, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
    alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#D1FAE5', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20 },
  icon: { fontSize: 36, color: '#059669' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  sub: { fontSize: 14, color: '#666', marginBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%', marginBottom: 32 },
  label: { fontSize: 13, color: '#888' },
  value: { fontSize: 15, fontWeight: '500', marginTop: 2 },
  divider: { height: 0.5, backgroundColor: '#eee', marginVertical: 14 },
  status: { fontSize: 15, fontWeight: '600', color: '#059669', marginTop: 2 },
  homeBtn: { backgroundColor: '#4F46E5', borderRadius: 12,
    padding: 16, width: '100%', alignItems: 'center' },
  homeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});