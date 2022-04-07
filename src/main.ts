import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";
import firebase from "firebase/compat";

type InitConfig = {
  containerId?: string;
  userToken?: string;
};

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

const defaultConfig: InitConfig = {
  containerId: "relazonContainer",
  userToken: "",
};

export const container = window.document.createElement("div");

export function init(config?: InitConfig) {
  const app = createApp(App);
  container.id = config?.containerId || defaultConfig.containerId || "";
  document.body.appendChild(container);
  app.use(createPinia());
  firebase.initializeApp(firebaseConfig);
  app.mount("#relazonContainer");
}

if (import.meta.env.DEV) {
  init();
}
