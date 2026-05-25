import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/BarraNavegacion';
import { Footer } from './components/PiePagina';
import { Popup } from './components/Notificacion';
import { Home } from './pages/Inicio';
import { Coleccion } from './pages/Coleccion';
import { ProductDetail } from './pages/DetalleProducto';
import { Carrito } from './pages/Carrito';
import { Checkout } from './pages/ProcesarPago';
import {Login} from "./pages/IniciarSesion";
import { SobreNosotros } from './pages/SobreNosotros';
import { PagoExitoso } from './pages/PagoExitoso';
import { MiPerfil } from './pages/MiPerfil';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coleccion" element={<Coleccion />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          </Routes>
        </main>
        <Footer />
        <Popup />
      </div>
    </Router>
  );
}

export default App;