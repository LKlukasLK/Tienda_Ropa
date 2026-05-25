import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-black text-white tracking-tighter">
                MODA<span className="text-indigo-400">SHOP</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Tu tienda de ropa online con las últimas tendencias en moda. 
              Calidad, estilo y sostenibilidad en cada prenda.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors" title="Twitter / X">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M17.232 4.768l-3.675 3.675"/></svg>
              </a>
            </div>
          </div>

          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Sobre Nosotros</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/sobre-nosotros" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Envíos y devoluciones
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/coleccion" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Colección
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Carrer de la Moda, 42<br />
                  08001 Barcelona, España
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <a href="tel:+34931234567" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +34 931 234 567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <a href="mailto:hola@modashop.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  hola@modashop.com
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Lun - Vie: 10:00 - 20:00<br />
                Sáb: 10:00 - 14:00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LKDEV. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Creado por Lucas Padilla
          </p>
        </div>
      </div>
    </footer>
  );
};
