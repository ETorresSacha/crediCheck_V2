import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DataCustomer from "../../components/dataCustomer/DataCustomer";
import UseStorage from "../../components/hooks/UseHookStorage";
import Calculator from "../calculator/Calculator";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import "react-native-get-random-values"; // generea valores aleatorios para que el uuid no se repita
//import { v4 as uuidv4 } from "uuid"; //! eliminar de package.json
import { validationDataPerson } from "../../utils/validation/Validation";
import Header from "../../components/header/Header";
import { TEA } from "../../utils/calculoCuota/Formulas";
import Usura from "../../modals/usura/Usura,";
// importación de la base de datos (Firebase)
import { database } from "../../backend/fb";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const NewForm = (props) => {
  //const uuid = uuidv4();
  const navigation = useNavigation();
  const { onSaveCronograma } = UseStorage();
  const [errorsP, setErrorsP] = useState({});
  const [errores, setErrores] = useState({});
  const [clean, setClean] = useState(false);
  const [valuePrest, setValuePrest] = useState(false);
  const [valueError, setValueError] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Habilita el modal de USURA
  const [tea, setTea] = useState();
  const [confirmacion, setConfirmacion] = useState(false); // confirma si acepta o no la USURA

  // TODO --> Editar los datos
  // *** Propiedades que se usan para editar ***
  const editValue = props.route.params ? props.route.params?.editValue : null;
  const user = props.route.params ? props.route.params?.user : null;
  const id = props.route.params ? props.route.params?.id : null;
  const typeColor = props.route.params ? props.route.params?.typeColor : null;
  const enable = props.route.params ? props.route.params?.enable : null;
  const dataConfiguration = props.route.params?.dataConfiguration; // Datos de la configuración

  // ****
  console.log(id);

  const [dataPerson, setDataPerson] = useState({
    // id: !user ? null : user?.id,
    nombre: !user ? "" : user?.nombre,
    apellido: !user ? "" : user?.apellido,
    dni: !user ? "" : user?.dni,
    correo: !user ? "" : user?.correo,
    direccion: !user ? "" : user?.direccion,
    celular: !user ? "" : user?.celular,
    canceled: !user ? false : user?.canceled,
    // Datos del préstamo
    periodo: !user ? "" : user?.periodo,
    capital: !user ? "" : user?.capital,
    interes: !user ? "" : user?.interes,
    cuotas: !user ? "" : user?.cuotas,
    fechaDesembolso: !user ? "" : user?.fechaDesembolso,
    fechaPrimeraCuota: !user ? "" : user?.fechaPrimeraCuota,
    resultPrestamo: !user ? [] : user?.resultPrestamo,
    interesMoratorio: null, // Se deja la variable para que mas adelante se pueda implementar el interes moratorio (validar la funcionalidad entre los componentes relacionados)
  });

  useEffect(() => {
    // Limpia es estado
    if (clean) {
      setDataPerson({
        // uuid,
        nombre: "",
        apellido: "",
        dni: "",
        correo: "",
        direccion: "",
        celular: "",
        canceled: false,
        capital: "",
        cuotas: "",
        interes: "",
        fechaDesembolso: "",
        fechaPrimeraCuota: "",
        periodo: "",
        resultPrestamo: [],
        interesMoratorio: null,
      });
    }
  }, [clean]);

  // TODO ---> Guardar los datos
  const handleDataKeep = async () => {
    setConfirmacion(false); // confirmación de guardar los datos en estado false

    // Validación
    setValuePrest(true);
    setErrores(validationDataPerson(dataPerson));

    //Guardar datos
    let errorCustomer = validationDataPerson(dataPerson);
    let valuesErrorDataCustomer = Object.values(errorCustomer); // Errores del componente DataCustomer
    let valuesErrorPrestamos = Object.values(errorsP); // Errores del componente Prestamo

    // calculamos el TEA
    const interesAnual = TEA(dataPerson?.interes, 12);
    setTea(interesAnual);

    if (valuesErrorDataCustomer.some((error) => error !== "") || !valueError) {
      let typeError = valuesErrorDataCustomer.find((element) => element != ""); // Busca el tipo de error que existe en dataCustomer
      let typeError2 = valuesErrorPrestamos.find((element) => element != ""); // Busca el tipo de error que existe en Prestamo

      Alert.alert(typeError ? typeError : typeError2);
    } else {
      try {
        Alert.alert("GUARDAR", "¿Desea continuar?", [
          {
            text: "Si",
            onPress: async () => {
              if (interesAnual > 113) setIsVisible(true);
              else setConfirmacion(true);
            },
            style: "destructive",
          },
          {
            text: "No",
            style: "destructive",
          },
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert("Ocurrió un error");
      }
    }
  };
  //! PODRIAMOS OPTIMIZAR EL CODIGO TRATANDO DE DON USAR UN ESTADO, SINO DIRECTAMENTE LA FUNCION DE GUARDAR, PERO ESTO SERIA LLAMADO CUANDO CUMPLA LA CONDICION DE USURA, DIRECTMAENTE (VER MAS ADELANTE)
  // Confirmacion y guardar
  //console.log("dataPerson: ", dataPerson);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        if (confirmacion == true) {
          setValuePrest(false);

          // Guarda los datos en el local storage
          //await onSaveCronograma(dataPerson, editValue);

          // Guarda los datos en Firestore (Firebase)
          // Cliente nuevo
          if (!editValue) {
            await addDoc(collection(database, "customers"), dataPerson);
          }

          // Editar cliente
          if (editValue == true) {
            const docRef = doc(database, "customers", id);
            console.log(docRef);

            await updateDoc(docRef, dataPerson);
          }

          // Editar
          if (editValue) {
            console.log("manda a detalle");

            navigation.navigate("Detalle", {
              id: id,
              typeColor: typeColor,
              enable: enable ? enable : null,
              dataConfiguration: dataConfiguration,
            });
          }
          setClean(true);
        }
      };

      load(); // llamado a la función
    }, [confirmacion]),
  );
  return (
    <View style={[styles.container]}>
      <Header
        title={editValue ? " Editar cliente" : "Nuevo cliente"}
        back={editValue ? "Detalle" : "Clientes"}
        data={
          !editValue
            ? dataConfiguration
            : { typeColor, editValue, id, enable, dataConfiguration }
        }
      />
      <ScrollView
        style={{
          borderColor: "rgb(198, 198, 198)",
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <DataCustomer
          setErrores={setErrores}
          errores={errores}
          setDataPerson={setDataPerson}
          dataPerson={dataPerson}
          setClean={setClean}
          editValue={editValue}
        />
        <Calculator
          errorsP={errorsP}
          setErrorsP={setErrorsP}
          clean={clean}
          setClean={setClean}
          dataPerson={dataPerson}
          setDataPerson={setDataPerson}
          valuePrest={valuePrest}
          setValueError={setValueError}
          setValuePrest={setValuePrest}
          editValue={editValue}
          user={user}
          dataConfiguration={dataConfiguration}
          valueProps={props.route.params}
        />

        {/* modal de USURA */}
        {/* <Usura
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          tea={tea}
          //uuid={dataPerson?.uuid} //! necesita el id
          setConfirmacion={setConfirmacion}
        /> */}
        <View
          style={{
            alignItems: "center",
            marginTop: "2%",
          }}
        >
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleDataKeep}
          >
            <Text style={styles.text}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default NewForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b21",
    display: "flex",
    paddingTop: 30,
  },
  buttonContainer: {
    alignItems: "center",
    width: 250,
    height: 40,
    borderRadius: 10,
    elevation: 3,
    justifyContent: "center",
    backgroundColor: "#4ecb71",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
