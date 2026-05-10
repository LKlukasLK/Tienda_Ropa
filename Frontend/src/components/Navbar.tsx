import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <h1 className="text-2xl font-bold text-indigo-600 tracking-tighter">
                            MODA<span className="text-gray-900">SHOP</span>
                        </h1>
                    </div>

                    {/* Links Escritorio */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Tienda</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Hombre</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Mujer</a>
                    </div>

                    {/* Iconos */}
                    <div className="flex items-center space-x-5">
                        <button className="text-gray-600 hover:text-indigo-600"><Search size={22} /></button>
                        <button className="text-gray-600 hover:text-indigo-600">{user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-700">Hola, {user.nombre}</span>
                                <button onClick={logout} className="text-xs text-red-500 font-bold hover:underline">Salir</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                                <User size={22} />
                            </Link>
                        )}</button>
                        <button className="text-gray-600 hover:text-indigo-600 relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                        </button>
                        <button className="md:hidden text-gray-600"><Menu size={22} /></button>
                    </div>
                </div>
            </div>
        </nav>
    );
};