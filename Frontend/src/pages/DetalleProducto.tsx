import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service'; // Usando el servicio
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingBag, Check } from 'lucide-react';
import type { Producto } from '../types';
import { showPopup } from '../components/Notificacion';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [producto, setProducto] = useState<Producto | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Store del Carrito y Auth
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (id) {
      productService.getById(id)
        .then(res => setProducto(res))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      showPopup({ type: 'warning', title: 'Inicia sesión', message: 'Debes iniciar sesión para comprar', action: { label: 'Iniciar Sesión', onClick: () => navigate('/login') } });
      return;
    }

    if (!selectedVariant) {
      showPopup({ type: 'warning', title: 'Selecciona una talla', message: 'Por favor, selecciona una talla antes de añadir al carrito.' });
      return;
    }

    setIsAdding(true);
    await addItem(selectedVariant, 1);
    setIsAdding(false);
    
    showPopup({ type: 'success', title: '¡Añadido!', message: 'Producto añadido al carrito correctamente.' });
  };

  if (!producto) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Imagen */}
      <div className="rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-inner">
        <img 
          src={producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'} 
          alt={producto.nombre} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <nav className="flex mb-4 text-xs font-bold uppercase tracking-widest text-indigo-600">
          <span>Tienda</span>
          <span className="mx-2 text-gray-300">/</span>
          <span>{producto.categoria.nombre}</span>
        </nav>
        
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">{producto.nombre}</h1>
        <p className="text-4xl font-light text-gray-400 mt-4">{producto.precio}€</p>
        
        <div className="h-px bg-gray-100 my-8"></div>
        
        <p className="text-gray-500 leading-relaxed text-lg">{producto.descripcion}</p>

        {/* Variantes (Tallas/Colores) */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Selecciona tu talla:</h3>
            <button className="text-xs text-gray-400 underline">Guía de tallas</button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {producto.variantes.map(v => (
              <button 
                key={v.id}
                onClick={() => setSelectedVariant(v.id)}
                className={`
                  relative px-6 py-3 border-2 rounded-2xl font-bold transition-all
                  ${selectedVariant === v.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-300 text-gray-600'}
                  ${v.stock === 0 ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
                `}
                disabled={v.stock === 0}
              >
                {v.talla}
                {selectedVariant === v.id && (
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-0.5">
                    <Check size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedVariant && (
            <p className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
              <Check size={16} /> ¡Talla disponible!
            </p>
          )}
        </div>

        {/* Botón de Acción */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`
            mt-12 flex items-center justify-center gap-3 w-full py-5 rounded-3xl font-black text-lg transition-all transform active:scale-[0.98]
            ${isAdding ? 'bg-gray-400' : 'bg-gray-900 hover:bg-indigo-600 shadow-xl hover:shadow-indigo-200 text-white'}
          `}
        >
          {isAdding ? 'Añadiendo...' : (
            <>
              <ShoppingBag size={22} />
              Añadir al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};