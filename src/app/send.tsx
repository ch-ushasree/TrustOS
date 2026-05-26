import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SendMoney() {
  const router = useRouter();
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <View style={styles.outer}>
      <View style={styles.phone}>
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
          style={styles.payBtn}
          onPress={() => router.push({
            pathname: '/confirm',
            params: { vpa, amount }
          })}
        >
          <Text style={styles.payText}>Review Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Cancel</Text>
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
  title: { fontSize: 20, fontWeight: '600', marginBottom: 32 },
  label: { fontSize: 13, color: '#666', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14,
    fontSize: 16, marginBottom: 16, borderWidth: 0.5,
    borderColor: '#ddd' },
  payBtn: { backgroundColor: '#4F46E5', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 8 },
  payText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  backText: { color: '#666', fontSize: 15 },
});