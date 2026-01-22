import 'dotenv/config'; 
// He modificado la extensión del archivo de .json a .js para poder importar las variables de entorno
// Esto es útil para mantener las claves y configuraciones sensibles fuera del control de versiones.
// app.json ahora es app.config.js - y se esta exportando un objeto JavaScript, ver linea abajo.

export default {
  expo: {
    name: "crediCheck",
    slug: "crediCheck",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#19202c"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      notificationIcon: "./assets/iconNotificaciones.png",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#19202c"
      },
      edgeToEdgeEnabled: true,
      permissions: ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      blockedPermissions: ["android.permission.READ_EXTERNAL_STORAGE"],
      package: "com.erikk31.crediCheck"
    },
    plugins: [
      [
        "expo-document-picker",
        {
          "appleTeamId": "c4c321b6-ea4e-4ea6-8abc-93b5b9e7bf21",
          "iCloudContainerEnvironment": "undefined"
        }
      ]
    ],
    owner: "erikk31",
    // --- TODO LO "EXTRA" DEBE IR EN UN SOLO OBJETO ---
    extra: {
      eas: {
        projectId: "c4c321b6-ea4e-4ea6-8abc-93b5b9e7bf21"
      },
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
      }
    }
  }
};