import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ConverterLayout from "./components/ConverterLayout/ConverterLayout";
import Footer from "./components/Footer/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppbar";
import Banner from "./components/Banner/Banner"
import { ThemeProvider, createTheme } from "@mui/material";

function App() {

  const theme = createTheme({
      palette: {
        mode: "light",
        primary: {
          main: "#1A237E"
        }
      }
  })
  return (
    <>

      <ThemeProvider theme={theme}>



        <ResponsiveAppBar />
        <Banner />
        <ConverterLayout />
        <Footer />

      </ThemeProvider>

    </>
  );
}

export default App;
