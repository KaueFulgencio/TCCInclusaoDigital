import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  inputError: {
    borderWidth: 2,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonLabel: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  helpHeaderButton: {
    marginRight: 10,
  },
  helpHeaderButtonText: {
    fontSize: 14,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioText: {
    marginLeft: 8,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  settingsHeaderButton: {
    marginRight: 5,
  },
  headerButtonText: {
    fontSize: 16,
  },
});

export default styles;
