import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import type { Producto } from '../types';

export const ProductDetail = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!producto) return <div className="p-20 text-center">Cargando producto...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Imagen */}
      <div className="rounded-3xl overflow-hidden bg-gray-100">
        <img src={producto.imagen || ''} alt={producto.nombre} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">
          {producto.categoria.nombre}
        </span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">{producto.nombre}</h1>
        <p className="text-3xl font-light text-gray-700 mt-4">{producto.precio}€</p>
        <p className="text-gray-500 mt-6 leading-relaxed">{producto.descripcion}</p>

        {/* Variantes (Tallas/Colores) */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-900">Selecciona tu talla:</h3>
          <div className="flex gap-3 mt-3">
            {producto.variantes.map(v => (
              <button 
                key={v.id}
                className={`px-4 py-2 border rounded-xl font-medium transition-all ${v.stock > 0 ? 'hover:border-indigo-600' : 'opacity-30 cursor-not-allowed'}`}
                disabled={v.stock === 0}
              >
                {v.talla} - {v.color}
              </button>
            ))}
          </div>
        </div>

        <button className="mt-10 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};