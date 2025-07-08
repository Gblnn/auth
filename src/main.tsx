import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "@/index.css"
import "@/styles/style.css"
import "@/styles/utils.css"
// import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider.tsx";
import "@/WEB/css/clash-grotesk.css"
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import AuthProvider from "./components/AuthProvider.tsx";
import { Toaster } from "sonner";

TimeAgo.addDefaultLocale(en);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <Toaster/>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
