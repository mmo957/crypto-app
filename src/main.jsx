import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import trTranslation from "./translations/tr/global.json";
import gerTranslation from "./translations/de/global.json";
import enTranslation from "./translations/en/global.json";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

i18next.init({
  interpolation: { escapeValue: false },
  lng: window.navigator.language || "en",
  resources: {
    tr: {
      translation: trTranslation,
    },
    de: {
      translation: gerTranslation,
    },
    en: {
      translation: enTranslation,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
