import Header from "./components/Header/Header";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Banner from "./components/Banner/Banner";
import ConverterLayout from "./components/ConverterLayout/ConverterLayout";
import AboutSection from "./components/AboutSection/AboutSection";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
    
      <Header />
      <Banner />
      <ConverterLayout />
      <AboutSection />
      <Footer />

    </>
  );
}

export default App;
