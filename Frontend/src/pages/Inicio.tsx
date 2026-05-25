import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Producto } from '../types';
import { productService } from '../services/product.service';
import { ProductCard } from '../components/TarjetaProducto';
export const Home = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Llamada al backend
        const fetchProductos = async () => {
            try {
                const data = await productService.getAll({ limit: 6 });
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
                    <Link to="/coleccion" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 mx-auto w-fit">
                        Ver Colección <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Grid de Productos */}
            <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Lo más buscado</h2>
                        <div className="h-1 w-20 bg-indigo-600 mt-2"></div>
                    </div>
                    <span className="text-gray-500 font-medium">{productos.length} Productos encontrados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {productos.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </main>
        </div>
    );
};
