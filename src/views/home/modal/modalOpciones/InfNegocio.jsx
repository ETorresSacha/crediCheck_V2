import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import UseStorageBusiness from "../../../../components/hooks/UseHookDataNeg";
import { validationInfNegocios } from "../../../../utils/validation/Validation";

const InfNegocio = ({ enablerNeg, setEnableNeg, setDataHome, setEnable }) => {
  const { onSaveDataBusiness, onGetBusiness } = UseStorageBusiness();

  const [data, setData] = useState({
    negocio: "",
    direccion: "",
    celular: "",
  });

  // Cargar los datos de la financiera
  const loadNegocio = async () => {
    try {
      let result = await onGetBusiness();
      result = result == undefined ? data : result;
      setDataHome(result); // Actualiza los datos del negocio y es visible en el "home" cuando se modifica en el modal

      setData({
        ...data,
        negocio: result[0]?.negocio,
        direccion: result[0]?.direccion,
        celular: result[0]?.celular,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNegocio();
  }, []);

  // GUARDAR LOS DATOS DE LA CONFIGURACIÓN DEL NEGOCIO
  const handleDataKeep = async () => {
    // Validación
    let errorData = validationInfNegocios(data);

    let valuesText = Object.values(errorData);
    if (valuesText.some((error) => error != "")) {
      Alert.alert("El número de celular debe tener 9 caracteres");
    } else {
      try {
        Alert.alert("GUARDAR", "¿Desea continuar?", [
          {
            text: "Si",
            onPress: async () => {
              await onSaveDataBusiness({
                negocio: data?.negocio,
                direccion: data?.direccion,
                celular: data?.celular,
              });

              Alert.alert("Se guardó correctamente");
              setEnable(true); // Es simplemente para actualizar los datos en el home despues de guardar los cambios
              setEnableNeg(false); // Cerrar el modal
            },
            style: "destructive",
          },
          {
            text: "No",
            style: "destructive",
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        transparent={true}
        visible={enablerNeg}
        onRequestClose={() => setEnableNeg(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEnableNeg(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                width: "70%",
              }}
            >
              INFORMACIÓN DE LA FINANCIERA
            </Text>
          </View>

          {/* ------------------ NOMBRE ------------------*/}
          <View style={styles.containerText}>
            <Text style={styles.titleText}>Financiera</Text>
            <TextInput
              value={data.negocio}
              style={styles.text}
              placeholder={"Nombre"}
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setData({ ...data, negocio: text });
              }}
            />
          </View>
          {/* ------------------ DIRECCIÓN ------------------*/}
          <View style={styles.containerText}>
            <Text style={styles.titleText}>Dirección</Text>
            <TextInput
              value={data.direccion}
              style={styles.text}
              placeholder={"Dirección"}
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setData({ ...data, direccion: text });
              }}
            />
          </View>
          {/* ------------------ CELULAR ------------------*/}
          <View style={styles.containerText}>
            <Text style={styles.titleText}>Celular</Text>
            <TextInput
              value={data.celular}
              style={styles.text}
              placeholder={"Celular"}
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setData({ ...data, celular: text });
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Pressable style={styles.buttonContainer} onPress={handleDataKeep}>
              <Text style={styles.textGuardar}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default InfNegocio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(31, 36, 36)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "beige",
    position: "absolute",
    top: "15%",
    left: "10%",
    right: "10%",
    borderRadius: 15,
    borderWidth: 1,
    paddingVertical: 10,
  },

  containerText: {
    marginTop: 10,
  },
  titleText: {
    paddingLeft: 20,
    fontSize: RFPercentage(2.2),
    color: "black",
  },
  text: {
    height: 40,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "grey",
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 25,
    paddingLeft: 10,
    fontSize: 16,
    color: "black",
  },
  buttonContainer: {
    marginVertical: 30,
    alignItems: "center",
    width: RFPercentage(35),
    height: 40,

    justifyContent: "center",
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#4ecb71",
  },
  textGuardar: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
