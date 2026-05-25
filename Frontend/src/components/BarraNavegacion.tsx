import { useEffect, useState } from 'react';
import { ShoppingCart, User, Menu, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const totalItems = useCartStore((state) => state.totalItems);
    const fetchCart = useCartStore((state) => state.fetchCart);
    const location = useLocation();

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">
                            MODA<span className="text-gray-900">SHOP</span>
                        </h1>
                    </Link>

                    <div className="hidden md:flex space-x-8">
                        <Link to="/coleccion" className="text-gray-600 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest">Colección</Link>
                        <Link to="/sobre-nosotros" className="text-gray-600 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest">Sobre Nosotros</Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:flex items-center">
                            {user ? (
                                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-2xl border border-gray-100">
                                    <Link to="/mi-perfil" className="text-right hover:opacity-80 transition-opacity">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Hola,</p>
                                        <span className="text-sm font-black text-gray-900">{user.nombre}</span>
                                    </Link>
                                    <button 
                                        onClick={logout} 
                                        className="text-red-500 hover:bg-red-100 p-2 rounded-xl transition-colors"
                                        title="Salir"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 p-2 border border-gray-100 rounded-full">
                                    <User size={22} />
                                </Link>
                            )}
                        </div>

                        <Link to="/carrito" className="text-gray-600 hover:text-indigo-600 relative p-2">
                            <ShoppingCart size={22} />
                            {totalItems() > 0 && (
                                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {totalItems()}
                                </span>
                            )}
                        </Link>

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600 p-2">
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-1">
                        <Link to="/coleccion" className="block px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                            Colección
                        </Link>
                        <Link to="/sobre-nosotros" className="block px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                            Sobre Nosotros
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        {user ? (
                            <>
                                <Link to="/mi-perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-black text-indigo-600">{user.nombre.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Hola,</p>
                                        <p className="font-black text-gray-900">{user.nombre}</p>
                                    </div>
                                </Link>
                                <Link to="/mi-perfil" className="block px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                                    Mi Perfil
                                </Link>
                                <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-4 py-3 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};