import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAccessibility } from "../context/AccessibilityContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const HistoryScreen = () => {
  const { settings, colors } = useAccessibility();

  interface Usuario {
    id: string;
    nome: string;
    idade?: number;
    // Adicione outros campos conforme necessário
  }
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Usuario {
    id: string;
    nome: string;
    idade?: number;
    // Adicione outros campos conforme necessário
  }
  const listarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista: Usuario[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          idade: doc.data().idade,
        });
      });
      setUsuarios(lista);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      // setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  const transactions = [
    {
      id: 1,
      type: "PIX Enviado",
      value: "150,00",
      date: "10/05/2023",
      recipient: "João Silva",
    },
    {
      id: 2,
      type: "PIX Recebido",
      value: "230,50",
      date: "08/05/2023",
      sender: "Maria Souza",
    },
    {
      id: 3,
      type: "PIX Enviado",
      value: "75,20",
      date: "05/05/2023",
      recipient: "Carlos Oliveira",
    },
    {
      id: 4,
      type: "PIX Recebido",
      value: "500,00",
      date: "01/05/2023",
      sender: "Empresa XYZ",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.cardBackground },
      ]}
    >
      {/* Seção de Usuários */}
      <Text style={[styles.title, { color: colors.text }]}>
        Lista de Usuários
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : usuarios.length === 0 ? (
        <Text style={[styles.noDataText, { color: colors.text }]}>
          Nenhum usuário encontrado
        </Text>
      ) : (
        usuarios.map((usuario) => (
          <View
            key={usuario.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.texto, { color: colors.text }]}>
              Nome: {usuario.nome}
            </Text>
            {"idade" in usuario && (
              <Text style={[styles.texto, { color: colors.text }]}>
                Idade: {usuario.idade}
              </Text>
            )}
          </View>
        ))
      )}

      {/* Seção de Transações */}
      <Text
        style={[
          styles.title,
          {
            fontSize: settings.fontSize + 4,
            color: colors.text,
            marginTop: 30,
          },
        ]}
      >
        Histórico de Transações
      </Text>

      <View style={styles.filterContainer}>
        <Text
          style={[
            styles.filterText,
            {
              fontSize: settings.fontSize,
              color: colors.text,
            },
          ]}
        >
          Filtros:
        </Text>
        <View style={styles.filterButtons}>
          <View
            style={[styles.filterButton, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  fontSize: settings.fontSize,
                  color: colors.cardBackground,
                },
              ]}
            >
              Todos
            </Text>
          </View>
          <View
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
            >
              Enviados
            </Text>
          </View>
          <View
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
            >
              Recebidos
            </Text>
          </View>
        </View>
      </View>

      {transactions.map((transaction) => (
        <View
          key={transaction.id}
          style={[
            styles.transactionCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.transactionHeader}>
            <Icon
              name={
                transaction.type === "PIX Enviado"
                  ? "arrow-top-right"
                  : "arrow-bottom-left"
              }
              size={24}
              color={transaction.type === "PIX Enviado" ? "#ff4444" : "#00aa00"}
            />
            <View style={styles.transactionInfo}>
              <Text
                style={[
                  styles.transactionType,
                  {
                    fontSize: settings.fontSize,
                    color: colors.text,
                  },
                ]}
              >
                {transaction.type}
              </Text>
              <Text
                style={[
                  styles.transactionDate,
                  {
                    fontSize: settings.fontSize - 2,
                    color: colors.placeholder,
                  },
                ]}
              >
                {transaction.date}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionValue,
                {
                  fontSize: settings.fontSize + 2,
                  color:
                    transaction.type === "PIX Enviado" ? "#ff4444" : "#00aa00",
                },
              ]}
            >
              R$ {transaction.value}
            </Text>
          </View>
          <View style={styles.transactionDetail}>
            <Text
              style={[
                styles.transactionDetailText,
                {
                  fontSize: settings.fontSize,
                  color: colors.text,
                },
              ]}
            >
              {transaction.type === "PIX Enviado" ? "Para:" : "De:"}{" "}
              {transaction.type === "PIX Enviado"
                ? transaction.recipient
                : transaction.sender}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    elevation: 2,
  },
  texto: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterText: {
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    width: "30%",
    alignItems: "center",
  },
  filterButtonText: {
    fontWeight: "bold",
  },
  transactionCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  transactionType: {
    fontWeight: "bold",
  },
  transactionDate: {
    marginTop: 2,
  },
  transactionValue: {
    fontWeight: "bold",
  },
  transactionDetail: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  transactionDetailText: {},
});

export default HistoryScreen;
