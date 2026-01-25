import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import UseStorage from "../../components/hooks/UseHookStorage";
import { useNavigation } from "@react-navigation/native";
import Pay from "../../components/pay/Pay";
import Notification from "../../components/notification/Notification";
import Header from "../../components/header/Header";
import Loading from "../../components/loading/Loading";
import Entypo from "@expo/vector-icons/Entypo";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { calculoMora } from "../../utils/calculoCuota/CalculosFuncionesCrediticios";
// base de datos (Firebase)
import { database } from "../../backend/fb";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

const Detail = (props) => {
  const { onGetCronograma, onDeleteCustomer } = UseStorage();
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [valueProps, setValueProps] = useState({
    typeColor: "",
    id: "",
    enable: "",
    dataConfiguration: "",
  });

  const [indice, setIndice] = useState(0); // Para modificar el índice correcto cuando se realiza un pago
  const [updatePrestamo, setUpdatePrestamo] = useState([]); // ResultPrestamo
  const [modify, setModify] = useState([]); // Para editar el status del pago
  const [dataSee, setDataSee] = useState(); // Datos que se renderizará
  const [canceledShare, setCanceledShare] = useState(false); // Cuota cancelada
  const [customers, setCustomers] = useState([]);

  //todo--> Trae los datos guardados de la base de datos (Firestore)
  useEffect(() => {
    const collectionRef = collection(database, "customers");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Setea los clientes
        setCustomers(result);
      },
      (error) => {
        console.error("Error al traer clientes: ", error);
      },
    );

    return () => unsubscribe();
  }, []);

  // Carga el cliente por su ID
  const loadCustomerId = async (id) => {
    try {
      const result = customers?.filter((element) => element.id == id);
      setUser(result);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCustomerId(valueProps?.id);
      //return () => unsubscribe();
    }, [valueProps, customers]),
  );

  useEffect(() => {
    setModify(user);
    setUpdatePrestamo(user[0]?.resultPrestamo);

    let result = user[0]?.resultPrestamo.find(
      (element) => element.statusPay == false,
    );

    setDataSee(result);

    if (user[0]?.canceled) {
      if (!user[0]?.montoCanceled) {
        setIndice(user[0]?.resultPrestamo.length);
        setDataSee(user[0]?.resultPrestamo[user[0]?.resultPrestamo.length - 1]);
      } else {
        setIndice(result?.cuota - 1);
        setDataSee(result);
      }
      setCanceledShare(true);
    } else {
      if (result != undefined) {
        result = {
          ...result,
          mora: calculoMora(
            result,
            valueProps?.dataConfiguration,
            user[0]?.interes, // calculamos la mora
          ),
        };

        setDataSee(result);

        setIndice(dataSee?.cuota == undefined ? null : dataSee?.cuota - 1);
        setCanceledShare(false);
      }
    }
  }, [user, indice, modify, canceledShare]); //! tener en cuenta, se esta eliminando el dataSee, si algo no funciona puede ser por esto

  // Actualiza los valores de valueProps
  useFocusEffect(
    React.useCallback(() => {
      setValueProps({
        ...valueProps,
        id: props?.route?.params?.id,
        typeColor: props?.route?.params?.typeColor,
        enable: props?.route?.params?.enable,
        dataConfiguration: props?.route?.params?.dataConfiguration,
      });

      //return () => unsubscribe();
    }, []),
  );

  // Editar
  const edit = (value) => {
    navigation.navigate("Nuevo cliente", {
      editValue: true,
      user: value,
      id: valueProps?.id,
      typeColor: valueProps?.typeColor,
      enable: valueProps?.enable,
      dataConfiguration: valueProps?.dataConfiguration,
    });
  };

  // Eliminar
  const handleDelete = async (value) => {
    try {
      const docRef = doc(database, "customers", value);
      deleteDoc(docRef);
      navigation.navigate("Clientes", { enable: valueProps?.enable });
    } catch (error) {
      console.error();
    }
  };
  const alertDelete = (value) => {
    Alert.alert("Eliminar", "¿Desea continuar?", [
      {
        text: "Si",
        onPress: () => handleDelete(value),
        style: "destructive",
      },
      {
        text: "No",
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {dataSee == undefined ? (
        <Loading />
      ) : (
        <ScrollView>
          <View>
            <Header
              title={"Detalle"}
              back={"Clientes"}
              data={
                !valueProps?.enable
                  ? valueProps?.dataConfiguration
                  : { enable: valueProps?.enable }
              }
            />

            {/* Datos del cliente */}
            <View style={styles.containerData}>
              <View style={styles.containerTitle}>
                <Text style={styles.title}>DATOS DEL CLIENTE</Text>

                {/* ***Íconos de opciones */}
                <View style={styles.iconos}>
                  {valueProps?.enable ? null : (
                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() => edit(user[0])}
                    >
                      <Entypo name="pencil" size={30} color="cornsilk" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => alertDelete(valueProps?.id)}
                  >
                    <Entypo name="trash" size={30} color="cornsilk" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ***Datos */}
              <View style={styles.Data}>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Nombres: </Text>
                  <Text style={styles.itemText}>{user[0]?.nombre}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Apellidos: </Text>
                  <Text style={styles.itemText}>{user[0]?.apellido}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>DNI: </Text>
                  <Text style={styles.itemText}>{user[0]?.dni}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Celular: </Text>
                  <Text style={styles.itemText}>{user[0]?.celular}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>Correo: </Text>
                  <Text style={styles.itemText}>{user[0]?.correo}</Text>
                </View>
              </View>
            </View>

            {/* Detalles del préstamo y pagos */}
            <Pay
              data={user}
              indice={indice}
              setIndice={setIndice}
              modify={modify}
              dataSee={dataSee}
              setDataSee={setDataSee}
              canceledShare={canceledShare}
              setCanceledShare={setCanceledShare}
              updatePrestamo={updatePrestamo}
              valueProps={valueProps}
              setValueProps={setValueProps}
              setUser={setUser}
            />

            {/* Medios para notificaciones */}
            <Notification
              data={user}
              typeColor={valueProps?.typeColor}
              dataSee={dataSee}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b21",
    verticalAlign: "middle",
    paddingTop: 30,
  },

  containerData: {
    borderBottomColor: "white",
  },
  containerTitle: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "rgba(36, 146, 224, 0.625)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  title: {
    paddingVertical: 10,
    color: "cornsilk",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  Data: {
    padding: 15,
    gap: 5,
  },
  item: {
    display: "flex",
    flexDirection: "row",
  },
  itemTitle: {
    width: 90,
    color: "cornsilk",
    fontSize: RFValue(13.5),
    fontWeight: "bold",
  },
  itemText: {
    color: "white",
    fontSize: RFValue(14),
  },
  iconos: {
    gap: 5,
    display: "flex",
    flexDirection: "row",
  },
  icon: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  verCronograma: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    width: RFPercentage(40),
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
