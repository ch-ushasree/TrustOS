import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Confirm() {
  const router = useRouter();
  const { vpa, amount } = useLocalSearchParams();

  return (
    <View style={styles.outer}>
      <View style={styles.phone}>
        <Text style={styles.title}>Confirm Payment</Text>

        <View style={styles.card}>
          <Text style={styles.row}>Sending to</Text>
          <Text style={styles.value}>{vpa}</Text>
          <View style={styles.divider} />
          <Text style={styles.row}>Amount</Text>
          <Text style={styles.amount}>₹{amount}</Text>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠ Please verify</Text>
          <Text style={styles.warningText}>
            Make sure you know this person. Fraudsters often
            impersonate bank officials or family members.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => router.push('/success')}
        >
          <Text style={styles.confirmText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Go Back</Text>
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
    justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16,
    padding: 20, marginBottom: 16 },
  divider: { height: 0.5, backgroundColor: '#eee', marginVertical: 14 },
  row: { fontSize: 13, color: '#888' },
  value: { fontSize: 16, fontWeight: '500', marginTop: 2 },
  amount: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', marginTop: 2 },
  warningCard: { backgroundColor: '#FEF3C7', borderRadius: 12,
    padding: 16, marginBottom: 24, borderWidth: 0.5,
    borderColor: '#F59E0B' },
  warningTitle: { fontSize: 14, fontWeight: '600',
    color: '#92400E', marginBottom: 6 },
  warningText: { fontSize: 13, color: '#92400E', lineHeight: 18 },
  confirmBtn: { backgroundColor: '#4F46E5', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 12 },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  cancelText: { color: '#666', fontSize: 15 },
});