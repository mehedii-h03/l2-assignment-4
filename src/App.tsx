import { Outlet } from "react-router";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[90vh]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
