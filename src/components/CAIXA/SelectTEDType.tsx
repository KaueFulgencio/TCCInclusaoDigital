import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { TransferType } from '../../screens/TEDFlow';

const options: { label: string; value: TransferType }[] = [
  { label: 'TED mesma titularidade', value: 'same' },
  { label: 'TED para terceiros', value: 'third' },
  { label: 'TED para Depósito Judicial', value: 'judicial' },
];

const SelectTEDType = ({ onSelect }: { onSelect: (type: TransferType) => void }) => {
  const [selected, setSelected] = React.useState<TransferType | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transferência eletrônica disponível</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.transactionsSection}>
          <Text style={styles.label}>Minhas transações:</Text>
          <View style={styles.transactionBox}>
            <Text style={styles.transactionText}>Não há transações</Text>
          </View>
          <View style={styles.divider} />
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>
            Selecione o tipo de transferência eletrônica disponível
          </Text>
          <View style={styles.underline} />
        </View>

        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, selected === opt.value && styles.selected]}
            onPress={() => setSelected(opt.value)}
          >
            <View style={styles.radioOuter}>
              {selected === opt.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0039A6',
    padding: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  transactionsSection: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  transactionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    color: '#0071CE',
    fontSize: 15,
  },
  divider: {
    height: 3,
    backgroundColor: '#D3D3D3',
    marginTop: 12,
  },
  selectContainer: {
    marginBottom: 12,
  },
  selectLabel: {
    fontSize: 15,
    color: '#005CA9',
    fontWeight: 'bold',
  },
  underline: {
    height: 3,
    backgroundColor: '#DDD',
    marginTop: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 14,
    backgroundColor: '#FFF',
  },
  selected: {
    borderColor: '#0039A6',
    backgroundColor: '#E6F0FF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0039A6',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0039A6',
  },
  optionText: {
    fontSize: 15,
    color: '#222',
  },
  button: {
    backgroundColor: '#F39200',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#fbc474',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SelectTEDType;
