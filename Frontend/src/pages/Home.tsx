import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';
import type { Producto } from '../types';
import { productService } from '../services/product.service';
export const Home = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Llamada al backend
        const fetchProductos = async () => {
            try {
                const data = await productService.getAll();
                setProductos(data.resultados);
            } catch (error) {
                console.error("Error al traer productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando catálogo...</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Hero Section Simple */}
            <section className="relative bg-gray-900 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        NUEVA TEMPORADA <span className="text-indigo-400">2026</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Explora nuestra colección exclusiva con materiales sostenibles y diseños vanguardistas.
                    </p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 mx-auto">
                        Ver Colección <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Grid de Productos */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Lo más buscado</h2>
                        <div className="h-1 w-20 bg-indigo-600 mt-2"></div>
                    </div>
                    <span className="text-gray-500 font-medium">{productos.length} Productos encontrados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {productos.map((producto) => (
                        <div key={producto.id} className="group relative">
                            {/* Imagen del Producto */}
                            <Link to={`/producto/${producto.id}`}>
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
                                    <img
                                        src={producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Badge de Categoría */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-gray-900 px-3 py-1 rounded-full shadow-sm">
                                            {producto.categoria?.nombre || 'General'}
                                        </span>
                                    </div>
                                    {/* Botón rápido (se ve en hover) */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <button className="w-full bg-white py-3 rounded-xl font-bold text-gray-900 flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <ShoppingBag size={18} /> Vista Rápida
                                        </button>
                                    </div>
                                </div>
                            </Link>

                            {/* Información */}
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
                    ))}
                </div>
            </main>
        </div>
    );
};