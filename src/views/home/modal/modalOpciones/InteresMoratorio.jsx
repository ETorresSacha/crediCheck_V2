import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import equal from "deep-equal";
import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { validationConfiguration } from "../../../../utils/validation/Validation";
import UseStorageConfiguration from "../../../../components/hooks/UseHookConfiguration";

const InteresMortorio = ({
  enablerConf,
  setEnableConf,
  dataConfiguration,
  setDataConfiguration,
  copy,
}) => {
  const { onSaveDataConfiguration } = UseStorageConfiguration();

  const handleKeep = async (value) => {
    // Validando
    let error = validationConfiguration(value);
    let valuesError = Object.values(error);

    if (valuesError.some((error) => error != "")) {
      let typeError = valuesError.find((element) => element != ""); // Busca el tipo de error que existe
      Alert.alert(typeError);
    } else {
      await onSaveDataConfiguration(value);
      setEnableConf(false);
    }
  };

  // Modificaión de la tasa moratoria
  const onPressConfig = () => {
    if (!equal(copy, dataConfiguration)) {
      Alert.alert("GUARDAR", "¿Desea guardar los cambios?", [
        {
          text: "Si",
          onPress: async () => {
            handleKeep(dataConfiguration);
            setDataConfiguration(dataConfiguration);
            //setEnableConf(false);
          },
          style: "destructive",
        },
        {
          text: "No",
          style: "destructive",
          onPress: async () => {
            setEnableConf(false);
            setDataConfiguration(copy);
          },
        },
      ]);
    } else {
      setEnableConf(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Modal
        transparent={true}
        visible={enablerConf}
        onRequestClose={() => setEnableConf(false)}
      >
        <TouchableWithoutFeedback onPress={() => onPressConfig()}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              INTERÉS MORATORIO
            </Text>
          </View>

          {/* Tasa Prima Mensual */}
          {/* <View style={styles.containerInput}>
        <Text>Tasa Prima Mensual</Text>
        <View style={styles.inputView}>
          <TextInput
            value={dataConfiguration.tpm}
            style={styles.input}
            placeholderTextColor="gray"
            onChangeText={(text) => {
              setDataConfiguration({ ...dataConfiguration, tpm: text });
            }}
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 20 }}>%</Text>
        </View>
      </View> */}

          {/* Comisión de Cobranza Variable */}
          {/* <View style={styles.containerInput}>
        <Text>Comisión de Cobranza Variable</Text>
        <View style={styles.inputView}>
          <TextInput
            value={dataConfiguration.ccv}
            style={styles.input}
            placeholderTextColor="gray"
            onChangeText={(text) => {
              setDataConfiguration({ ...dataConfiguration, ccv: text });
            }}
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 20 }}>%</Text>
        </View>
      </View> */}

          {/* Interés Moratorio */}

          <View style={styles.containerInput}>
            <Text style={{ fontFamily: "Palatino", fontSize: 18 }}>
              Interés Moratorio:
            </Text>
            <View style={styles.inputView}>
              <TextInput
                value={dataConfiguration?.intMoratorio}
                style={styles.input}
                placeholderTextColor="gray"
                onChangeText={(text) => {
                  setDataConfiguration({
                    ...dataConfiguration,
                    intMoratorio: text,
                  });
                }}
                keyboardType="numeric"
              />
              <Text style={{ fontSize: 20 }}>%</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 11,
              }}
            >
              "En caso de mora, se aplicará un recargo porcentual adicional a la
              tasa de interés diaria establecida."
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.btnCalcular}
              onPress={() => handleKeep(dataConfiguration)}
            >
              <Text style={styles.textBtn}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default InteresMortorio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(31, 36, 36)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  containerInput: {
    width: 230,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  modalContent: {
    backgroundColor: "beige",
    position: "absolute",
    top: "15%",
    left: "10%",
    right: "10%",
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
  },
  inputView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 5,
    alignItems: "center",
  },
  input: {
    alignItems: "center",
    textAlign: "center",
    color: "black",
    borderBottomColor: "black",
    width: 60,

    fontSize: 17,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingTop: 30,
    alignItems: "center",
  },
  btnCalcular: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4ecb71",
    width: RFPercentage(32),
    height: 40,
    borderRadius: 15,
  },
  textBtn: {
    fontSize: 19,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
