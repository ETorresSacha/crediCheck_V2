import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { calculoCanlelarDeuda } from "../../utils/calculoCuota/CalculosFuncionesCrediticios";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import UseStorage from "../hooks/UseHookStorage";
import { database } from "../../backend/fb";
import { doc, updateDoc } from "firebase/firestore";

const ModalCancelPay = ({
  isVisible,
  setIsVisible,
  resultPrestamo,
  valueProps,
  interes,
  dataSee,
  modify,
  setCanceledShare,
  setEnable,
}) => {
  const { onUpdateStatusPay } = UseStorage();

  let deuda = calculoCanlelarDeuda(
    resultPrestamo,
    valueProps?.dataConfiguration,
    interes,
  );

  let montoTotal = (
    parseFloat(deuda?.capitalMora) +
    parseFloat(deuda?.mora) +
    parseFloat(deuda?.capitalPendiente) +
    parseFloat(deuda?.interes)
  ).toFixed(2);

  let detallePago = [
    { "Cuotas Pendientes": deuda?.capitalMora },
    { Mora: deuda?.mora },
    { "Capital restante": deuda?.capitalPendiente },
    { "Interés generado": deuda?.interes },
  ];

  const funcionPagar = async (id) => {
    //Cancelación de la deuda
    let objeto = {
      ...modify[0],
      canceled: true,
      montoCanceled: montoTotal,
    };
    modify.splice(0, 1, objeto);
    console.log(valueProps?.id);

    Alert.alert("Cancelar la deuda", "¿Desea continuar?", [
      {
        text: "Si",
        onPress: async () => {
          setIsVisible(false);
          //! await onUpdateStatusPay(modify);
          const docRef = doc(database, "customers", id);
          await updateDoc(docRef, modify[0]);

          setEnable(false);
          setCanceledShare(true);
        },
        style: "destructive",
      },
      {
        text: "No",
        onPress: async () => setIsVisible(false),
        style: "destructive",
      },
    ]);
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <View style={{ padding: 10 }}>
          <View style={{ paddingBottom: 15, alignContent: "center" }}>
            <Text
              style={{
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              CANCELAR LA DEUDA
            </Text>
          </View>

          <View style={styles.graficoContainer}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>Capital: </Text>
              <Text style={styles.itemText}>
                S/ {parseFloat(modify[0]?.capital).toFixed(2)}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Cuotas cancelados: </Text>
                <Text style={styles.itemText}>{dataSee?.cuota - 1}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>Cuotas pendientes: </Text>
                <Text style={styles.itemText}>
                  {resultPrestamo?.length - (dataSee?.cuota - 1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={styles.itemTitle}>
              Deducción de la cuenta a saldar
            </Text>
          </View>
          {/* detalle de la cuenta a pagar */}
          <View style={{ paddingHorizontal: 10 }}>
            {detallePago.map((objeto, index) => {
              return Object.entries(objeto).map(([llave, valor]) => {
                return (
                  <View
                    style={[styles.item, { width: RFPercentage(32) }]}
                    key={index}
                  >
                    <Text style={styles.itemTitleDetalle}>{llave} </Text>
                    <View style={styles.conteinerDato}>
                      <Text style={[styles.itemText]}>S/</Text>
                      <Text
                        style={[
                          styles.itemText,
                          { justifyContent: "flex-end" },
                        ]}
                      >
                        {valor}
                      </Text>
                    </View>
                  </View>
                );
              });
            })}
            {/* monto a cancelar */}
            <View
              style={[styles.item, { width: RFPercentage(32), paddingTop: 10 }]}
            >
              <Text style={[styles.itemTitleDetalle, { color: "orange" }]}>
                Monto a cancelar
              </Text>
              <View style={styles.conteinerDato}>
                <Text
                  style={[
                    styles.itemText,
                    { color: "orange", fontWeight: "bold" },
                  ]}
                >
                  S/
                </Text>
                <Text
                  style={[
                    styles.itemText,
                    {
                      justifyContent: "flex-end",
                      color: "orange",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {montoTotal}
                </Text>
              </View>
            </View>
          </View>

          {/* botón de cancelar la deuda */}
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <TouchableOpacity
              style={styles.btnPagar}
              onPress={() => funcionPagar(valueProps?.id)}
            >
              <Text style={styles.subTitle}> Pagar la deuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalCancelPay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(6, 18, 20, 0.836)",
    borderRadius: 15,
    position: "absolute",
    top: "30%",
    left: "7%",
    right: "7%",
    borderColor: "white",
    borderWidth: 1,
    paddingVertical: 10,
  },
  graficoContainer: {
    //flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: {
    color: "cornsilk",
    fontWeight: "bold",
  },
  itemTitleDetalle: {
    color: "cornsilk",
    fontWeight: "bold",
  },
  itemText: {
    color: "white",
    fontSize: RFValue(12),
  },
  conteinerDato: {
    flexDirection: "row",
    width: RFPercentage(11),
    justifyContent: "space-between",
  },
  btnPagar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: RFPercentage(5),
    width: RFPercentage(30),
    justifyContent: "center",
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    backgroundColor: "orange",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
