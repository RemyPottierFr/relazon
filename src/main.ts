import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";
import firebase from "firebase/compat";

const app = createApp(App);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MESUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DB,
};

firebase.initializeApp(firebaseConfig);

app.use(createPinia());
const relazonContainer = window.document.createElement("div");
relazonContainer.id = "relazonContainer";
document.body.appendChild(relazonContainer);
app.mount("#relazonContainer");
