import "./App.scss";
import { ToastContainer } from "react-toastify";
import Router from "./config/Router";
import AppContext from "./config/Context";

function App() {
  return (
    <AppContext>
      <Router />

      <ToastContainer closeOnClick draggable theme="dark" />
    </AppContext>
  );
}

export default App;
