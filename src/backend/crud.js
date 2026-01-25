// CRUD para Firestore (Crear, Leer, Actualizar, Eliminar)
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import { database } from "./fb";
import { orderData } from "../utils/thunks/Thunks";



// Obtener datos de firebase
export const onGetCustomers = (enable,callback)=>{
  const collectionRef = collection(database, "customers");
const q = query(collectionRef); 
  return onSnapshot(q,(querySnapshot) => {
      console.log("entroa");
        let result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Usar el spread operator es más limpio si traes todo
        }));

         result =  orderData("fecha", result, false, enable); // ordena de forma ascendente de acuerdo a la fecha

        callback(result)
      }

    );
    
   
      }


