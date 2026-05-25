import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Producto } from '../types';

export const ProductCard = ({ producto }: { producto: Producto }) => {
  return (
    <div className="group relative">
      <Link to={`/producto/${producto.id}`}>
        <div className="aspect-[5/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
          <img
            src={producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-gray-900 px-3 py-1 rounded-full shadow-sm">
              {producto.categoria?.nombre || 'General'}
            </span>
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <button className="w-full bg-white py-3 rounded-xl font-bold text-gray-900 flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <ShoppingBag size={18} /> Vista Rápida
            </button>
          </div>
        </div>
      </Link>
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/producto/${producto.id}`}>
            <h3 className="text-gray-900 font-bold text-lg hover:text-indigo-600 transition-colors leading-tight">
              {producto.nombre}
            </h3>
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-3 line-clamp-1">{producto.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900">{producto.precio}€</span>
        </div>
      </div>
    </div>
  );
};
