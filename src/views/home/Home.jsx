import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ItemsHome from "../../components/itemsHome/ItemsHome";
import { SimpleLineIcons } from "@expo/vector-icons";
import UseStorageConfiguration from "../../components/hooks/UseHookConfiguration";
import UseStorageBusiness from "../../components/hooks/UseHookDataNeg";
import fondoHome from "../../../assets/fondoHome.jpg";
import logoCrediCheck from "../../../assets/logoCrediCheck.png";
import Configuracion from "./modal/Configuracion";
const Home = () => {
  const { onGetBusiness } = UseStorageBusiness();
  const { onGetConfiguration } = UseStorageConfiguration();
  const [isVisible, setIsVisible] = useState(false);
  const [enable, setEnable] = useState(false); // Para visualizar los cambios en el home
  const [dataBusiness, setDataBusiness] = useState([]); // Para los datos de la informacion del negocio
  const [dataConfiguration, setDataConfiguration] = useState({}); //Datos de la configuración
  const [copy, setCopy] = useState({}); // Sirve para verificar si se nota el cambio del interes moratorio

  // Cargar los datos de la financiera //! EVALUAR SI SE GUARDARAN LOS DATOS EN STORAGE O EN FIREBASE
  const loadNegocio = async () => {
    try {
      const result = await onGetBusiness();
      setDataBusiness(result == undefined ? dataBusiness : result);
      setEnable(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar los datos de la configuración
  const loadCongiguration = async () => {
    try {
      let result = await onGetConfiguration();

      //copia
      setCopy({
        ...dataConfiguration,
        intMoratorio: !result ? "0" : result[0]?.intMoratorio,
      });

      setDataConfiguration({
        ...dataConfiguration,
        intMoratorio: !result ? "0" : result[0]?.intMoratorio,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Cerrar el modal
  const handleModalClose = async (shouldUpdate) => {
    if (shouldUpdate) {
      Alert.alert("Se guardó correctamente");
    }
    setIsVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNegocio();
      loadCongiguration();
    }, [enable, setDataConfiguration]),
  );

  return (
    <ImageBackground source={fondoHome} style={styles.background}>
      {/* HEADER */}
      <View style={styles.conteinerHeader}>
        <View style={styles.rightConteiner}>
          <Image source={logoCrediCheck} style={styles.profileImage}></Image>
        </View>
        <Pressable
          style={styles.leftConteiner}
          onPress={() => setIsVisible(true)}
        >
          <SimpleLineIcons
            name="options-vertical"
            style={{ color: "cornsilk", fontSize: 25 }}
          />
        </Pressable>
      </View>

      {/* MODAL OPCIONES */}
      <Configuracion
        visible={isVisible}
        onClose={handleModalClose}
        setDataHome={setDataBusiness}
        setEnable={setEnable}
        dataConfiguration={dataConfiguration}
        setDataConfiguration={setDataConfiguration}
        copy={copy}
      />

      {/* BIENVENIDO */}
      <View style={{ paddingTop: 20 }}>
        <View style={styles.institutionTitle}>
          <Text style={styles.title}>BIENVENIDO</Text>
        </View>
        <View style={styles.containerSwitch}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.subTitle}>
              {!dataBusiness[0]?.negocio
                ? "Tu Financiera"
                : dataBusiness[0]?.negocio}
            </Text>
          </View>
        </View>
      </View>

      {/* ITEMS DE LAS OPCIONES */}
      <ItemsHome dataConfiguration={dataConfiguration} />
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // o 'contain' según tu preferencia
    paddingTop: 30,
    padding: 12,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "rgb(31, 36, 36)",
  },
  conteinerHeader: {
    padding: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 24,
  },
  title: {
    paddingVertical: 10,
    color: "cornsilk",
    fontSize: 17,
    fontWeight: "bold",
  },

  institutionTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  containerSwitch: {
    display: "flex",
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  subTitle: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
  },
  leftConteiner: {
    justifyContent: "center",
    marginLeft: 10,
  },
  rightConteiner: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
