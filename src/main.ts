// @ts-nocheck
declare module "relazon";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";
import firebase from "firebase/compat";

export type DefaultColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
};

export type InitConfig = {
  containerId?: string;
  userToken?: string;
  colors: DefaultColors;
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

export const defaultColors: DefaultColors = {
  primary: "#181925",
  primaryLight: "#282A3E",
  secondary: "#EDF2F4",
};

export let defaultConfig: InitConfig = {
  containerId: "relazonContainer",
  userToken: "",
  colors: defaultColors,
};

export const container = window.document.createElement("div");

export function init(config?: InitConfig) {
  const app = createApp(App);
  defaultConfig = { ...config, ...defaultConfig };
  container.id = config?.containerId || defaultConfig.containerId || "";
  document.body.appendChild(container);
  app.use(createPinia());
  firebase.initializeApp(firebaseConfig);
  app.mount("#relazonContainer");
}

if (import.meta.env.DEV) {
  init();
}
