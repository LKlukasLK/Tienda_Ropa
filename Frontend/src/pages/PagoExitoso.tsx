import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';

export const PagoExitoso = () => {
  const [vaciando, setVaciando] = useState(true);
  const fetchCart = useCartStore(s => s.fetchCart);

  useEffect(() => {
    api.delete('/carrito').then(() => {
      fetchCart();
    }).finally(() => setVaciando(false));
  }, [fetchCart]);

  if (vaciando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Confirmando tu pedido...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">¡Pago Exitoso!</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Tu pedido ha sido realizado correctamente. Te enviaremos un email con los detalles del envío.
      </p>
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-indigo-600" />
          <span className="text-sm text-gray-600">Recibirás tu pedido en 3-5 días laborables</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/coleccion" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
          Seguir Comprando <ArrowRight size={18} />
        </Link>
        <Link to="/" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
          Volver a Tienda
        </Link>
      </div>
    </div>
  );
};
