import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import api from '../api/axios';
import { showPopup } from '../components/Notificacion';

export const Carrito = () => {
  const { items, removeItem, totalPrice, totalItems, loading } = useCartStore();
  const navigate = useNavigate();
  const handleCheckout = async () => {
  try {
    // 1. Crear el pedido en el Backend
    // (Asegúrate de pasar la dirección de envío real, aquí un ejemplo)
    const res = await api.post('/pedidos', {
      direccionEnvio: {
        titulo: "Casa", calle: "Calle Principal 1", ciudad: "Madrid", codigoPostal: "28001"
      },
      items: items.map(i => ({ varianteId: i.varianteId, cantidad: i.cantidad }))
    });

    // 2. Ir a la página de Checkout con el ID del pedido
    navigate('/checkout', { state: { pedidoId: res.data.id, total: totalPrice() } });
  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    showPopup({ type: 'error', title: 'Error', message: 'No se pudo procesar el pedido. Inténtalo de nuevo.' });
  }
};

  // Función para formatear dinero
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-gray-300" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Tu carrito está vacío</h2>
        <p className="text-gray-500 mt-4 mb-10">Parece que aún no has añadido nada a tu selección.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all"
        >
          <ArrowLeft size={20} /> Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-gray-900">Tu Carrito</h1>
        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
          {totalItems()} artículos
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LISTA DE PRODUCTOS */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Imagen */}
              <div className="w-full sm:w-32 h-40 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.variante.producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'} 
                  alt={item.variante.producto.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detalles */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{item.variante.producto.nombre}</h3>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">
                      Talla: {item.variante.talla} | Color: {item.variante.color}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase">Cantidad</span>
                    <span className="font-black text-gray-900">{item.cantidad}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Subtotal</p>
                    <p className="text-xl font-black text-indigo-600">
                      {formatMoney(parseFloat(item.variante.producto.precio) * item.cantidad)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white sticky top-24 shadow-2xl shadow-indigo-200">
            <h2 className="text-2xl font-black mb-8">Resumen</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatMoney(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span className="text-green-400 font-bold italic">Gratis</span>
              </div>
              <div className="h-px bg-gray-800 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-black text-indigo-400">{formatMoney(totalPrice())}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/50">
              <CreditCard size={22} />
              Finalizar Compra
            </button>

            <p className="text-[10px] text-center text-gray-500 mt-6 uppercase tracking-widest font-bold">
              Pagos seguros procesados por Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
