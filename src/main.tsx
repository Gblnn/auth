import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "@/index.css"
import "@/styles/style.css"
import "@/styles/utils.css"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider.tsx";
import "@/WEB/css/clash-grotesk.css"
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import AuthProvider from "./components/AuthProvider.tsx";

TimeAgo.addDefaultLocale(en);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
