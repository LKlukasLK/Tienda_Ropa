import { useEffect, useState } from 'react';
import { ShoppingBag, Search, X, SlidersHorizontal } from 'lucide-react';
import type { Producto } from '../types';
import { productService } from '../services/product.service';
import { ProductCard } from '../components/TarjetaProducto';
import api from '../api/axios';

type Filtros = {
  search: string;
  categoria: string;
  color: string;
  talla: string;
  minPrecio: string;
  maxPrecio: string;
};

type FiltrosOpciones = {
  colores: string[];
  tallas: string[];
  precioMin: number;
  precioMax: number;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  _count: { productos: number };
};

export const Coleccion = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [opciones, setOpciones] = useState<FiltrosOpciones>({ colores: [], tallas: [], precioMin: 0, precioMax: 1000 });
  const [filtros, setFiltros] = useState<Filtros>({ search: '', categoria: '', color: '', talla: '', minPrecio: '', maxPrecio: '' });
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const [cats, opts] = await Promise.all([
          api.get<Categoria[]>('/categorias'),
          productService.getFiltros()
        ]);
        setCategorias(cats.data);
        setOpciones(opts);
        if (opts.precioMin) setFiltros(prev => ({ ...prev, minPrecio: String(opts.precioMin) }));
        if (opts.precioMax) setFiltros(prev => ({ ...prev, maxPrecio: String(opts.precioMax) }));
      } catch (err) {
        console.error("Error al cargar opciones de filtro", err);
      }
    };
    fetchOpciones();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page: pagina, limit: 12 };
        if (filtros.search) params.search = filtros.search;
        if (filtros.categoria) params.categoria = filtros.categoria;
        if (filtros.color) params.color = filtros.color;
        if (filtros.talla) params.talla = filtros.talla;
        if (filtros.minPrecio) params.minPrecio = filtros.minPrecio;
        if (filtros.maxPrecio) params.maxPrecio = filtros.maxPrecio;
        const data = await productService.getAll(params);
        setProductos(data.resultados);
        setTotalPaginas(data.info.paginas);
        setTotalProductos(data.info.totalRegistros);
      } catch (err) {
        console.error("Error al cargar productos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [filtros, pagina]);

  const limpiarFiltros = () => {
    setFiltros({ search: '', categoria: '', color: '', talla: '', minPrecio: String(opciones.precioMin), maxPrecio: String(opciones.precioMax) });
    setPagina(1);
  };

  const hayFiltrosActivos = filtros.search || filtros.categoria || filtros.color || filtros.talla;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Colección</h1>
            <p className="text-gray-500 text-sm mt-1">{totalProductos} productos encontrados</p>
          </div>
          <button
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filtros */}
          <aside className={`${filtrosAbiertos ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:block lg:relative lg:w-64 lg:min-w-[16rem]`}>
            {/* Overlay móvil */}
            {filtrosAbiertos && (
              <div className="fixed inset-0 bg-black/50" onClick={() => setFiltrosAbiertos(false)} />
            )}

            <div className={`relative w-80 max-w-full bg-white lg:bg-transparent h-full lg:h-auto overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-24 ${filtrosAbiertos ? '' : ''}`}>
              {/* Header móvil */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-black text-gray-900">Filtros</h2>
                <button onClick={() => setFiltrosAbiertos(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Búsqueda */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Buscar</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={filtros.search}
                      onChange={e => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Categoría</label>
                  <select
                    value={filtros.categoria}
                    onChange={e => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.nombre} ({cat._count.productos})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                {opciones.colores.length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {opciones.colores.map(color => (
                        <button
                          key={color}
                          onClick={() => setFiltros(prev => ({ ...prev, color: prev.color === color ? '' : color }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            filtros.color === color
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Talla */}
                {opciones.tallas.length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Talla</label>
                    <div className="flex flex-wrap gap-2">
                      {opciones.tallas.map(talla => (
                        <button
                          key={talla}
                          onClick={() => setFiltros(prev => ({ ...prev, talla: prev.talla === talla ? '' : talla }))}
                          className={`w-10 h-10 rounded-lg text-sm font-bold border transition-all ${
                            filtros.talla === talla
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {talla}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precio */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Precio</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filtros.minPrecio}
                      onChange={e => setFiltros(prev => ({ ...prev, minPrecio: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                    <span className="text-gray-400 font-bold">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filtros.maxPrecio}
                      onChange={e => setFiltros(prev => ({ ...prev, maxPrecio: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  {hayFiltrosActivos && (
                    <button
                      onClick={limpiarFiltros}
                      className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Productos */}
          <main className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No hay productos</h3>
                <p className="text-gray-500 mb-6">No encontramos productos con esos filtros.</p>
                <button
                  onClick={limpiarFiltros}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-500 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                      onClick={() => setPagina(p => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPagina(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                          p === pagina
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
