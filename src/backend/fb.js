import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Extraemos la config de forma segura
const firebaseExtraConfig = Constants.expoConfig?.extra?.firebaseConfig;

if (!firebaseExtraConfig || !firebaseExtraConfig.apiKey) {  
  console.error("Error: No se encontró la configuración de Firebase. Revisa tus variables de entorno.");
}

const firebaseConfig = {
  apiKey: firebaseExtraConfig.apiKey,
  authDomain: firebaseExtraConfig.authDomain,
  projectId: firebaseExtraConfig.projectId,
  storageBucket: firebaseExtraConfig.storageBucket,
  messagingSenderId: firebaseExtraConfig.messagingSenderId,
  appId: firebaseExtraConfig.appId,
  measurementId: firebaseExtraConfig.measurementId
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);