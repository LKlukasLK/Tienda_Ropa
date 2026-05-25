import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Package, Lock, LogOut, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { showPopup } from '../components/Notificacion';
import api from '../api/axios';

type Perfil = {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  avatar: string | null;
  rol: string;
  createdAt: string;
  direcciones: Direccion[];
  _count: { pedidos: number };
};

type Direccion = {
  id: number;
  titulo: string;
  calle: string;
  ciudad: string;
  codigoPostal: string;
  referencia: string | null;
};

type Tab = 'datos' | 'direcciones' | 'pedidos' | 'password';

export const MiPerfil = () => {
  const navigate = useNavigate();
  const { user, logout, setAuth } = useAuthStore();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [tab, setTab] = useState<Tab>('datos');

  // Formulario datos
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Formulario password
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [cambiandoPass, setCambiandoPass] = useState(false);

  // Direcciones
  const [nuevaDir, setNuevaDir] = useState({ titulo: '', calle: '', ciudad: '', codigoPostal: '', referencia: '' });
  const [mostrarFormDir, setMostrarFormDir] = useState(false);
  const [creandoDir, setCreandoDir] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get<Perfil>('/usuarios/perfil').then(r => {
      setPerfil(r.data);
      setNombre(r.data.nombre);
      setApellidos(r.data.apellidos);
      setEmail(r.data.email);
      setTelefono(r.data.telefono || '');
    }).catch(() => navigate('/login'));
  }, [user, navigate]);

  const guardarDatos = async () => {
    setGuardando(true);
    try {
      const { data } = await api.patch('/usuarios/perfil', { nombre, apellidos, email, telefono });
      setPerfil(prev => prev ? { ...prev, ...data } : null);
      setAuth(data, localStorage.getItem('token')!);
      showPopup({ type: 'success', title: 'Guardado', message: 'Datos actualizados correctamente.' });
    } catch (err: any) {
      showPopup({ type: 'error', title: 'Error', message: err.response?.data?.error || 'No se pudieron guardar los datos.' });
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPass = async () => {
    if (!passwordNueva || passwordNueva.length < 6) {
      showPopup({ type: 'warning', title: 'Contraseña', message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    setCambiandoPass(true);
    try {
      await api.put('/usuarios/password', { passwordActual, passwordNueva });
      showPopup({ type: 'success', title: 'Cambiada', message: 'Contraseña actualizada correctamente.' });
      setPasswordActual('');
      setPasswordNueva('');
    } catch (err: any) {
      showPopup({ type: 'error', title: 'Error', message: err.response?.data?.error || 'No se pudo cambiar la contraseña.' });
    } finally {
      setCambiandoPass(false);
    }
  };

  const crearDireccion = async () => {
    if (!nuevaDir.titulo || !nuevaDir.calle || !nuevaDir.ciudad || !nuevaDir.codigoPostal) {
      showPopup({ type: 'warning', title: 'Campos incompletos', message: 'Rellena todos los campos obligatorios.' });
      return;
    }
    setCreandoDir(true);
    try {
      await api.post('/usuarios/direcciones', nuevaDir);
      const { data } = await api.get<Perfil>('/usuarios/perfil');
      setPerfil(data);
      setNuevaDir({ titulo: '', calle: '', ciudad: '', codigoPostal: '', referencia: '' });
      setMostrarFormDir(false);
      showPopup({ type: 'success', title: 'Añadida', message: 'Dirección guardada correctamente.' });
    } catch {
      showPopup({ type: 'error', title: 'Error', message: 'No se pudo guardar la dirección.' });
    } finally {
      setCreandoDir(false);
    }
  };

  const eliminarDireccion = async (id: number) => {
    try {
      await api.delete(`/usuarios/direcciones/${id}`);
      const { data } = await api.get<Perfil>('/usuarios/perfil');
      setPerfil(data);
    } catch {
      showPopup({ type: 'error', title: 'Error', message: 'No se pudo eliminar la dirección.' });
    }
  };

  if (!perfil) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'datos' as Tab, label: 'Datos Personales', icon: User },
    { id: 'direcciones' as Tab, label: 'Direcciones', icon: MapPin },
    { id: 'pedidos' as Tab, label: 'Mis Pedidos', icon: Package },
    { id: 'password' as Tab, label: 'Contraseña', icon: Lock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <h1 className="text-3xl font-black text-gray-900 mb-10">Mi Perfil</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-black text-indigo-600">{perfil.nombre.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-black text-gray-900">{perfil.nombre} {perfil.apellidos}</p>
                  <p className="text-xs text-gray-400 font-medium">{perfil.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {tabs.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      tab === t.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {t.label}
                  </button>
                );
              })}
              <hr className="my-2 border-gray-100" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 min-w-0">
          {tab === 'datos' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Datos Personales</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Apellidos</label>
                  <input value={apellidos} onChange={e => setApellidos(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Teléfono</label>
                  <input value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <button onClick={guardarDatos} disabled={guardando} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50">
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <span className="text-xs text-gray-400">Miembro desde {new Date(perfil.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          )}

          {tab === 'direcciones' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900">Mis Direcciones</h2>
                <button onClick={() => setMostrarFormDir(!mostrarFormDir)} className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-500 transition-colors">
                  <Plus size={18} /> Añadir
                </button>
              </div>

              {mostrarFormDir && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Título *</label>
                      <input value={nuevaDir.titulo} onChange={e => setNuevaDir(p => ({ ...p, titulo: e.target.value }))} placeholder="Ej: Casa, Oficina..." className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Código Postal *</label>
                      <input value={nuevaDir.codigoPostal} onChange={e => setNuevaDir(p => ({ ...p, codigoPostal: e.target.value }))} className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Calle *</label>
                      <input value={nuevaDir.calle} onChange={e => setNuevaDir(p => ({ ...p, calle: e.target.value }))} className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Ciudad *</label>
                      <input value={nuevaDir.ciudad} onChange={e => setNuevaDir(p => ({ ...p, ciudad: e.target.value }))} className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Referencia (opcional)</label>
                      <input value={nuevaDir.referencia} onChange={e => setNuevaDir(p => ({ ...p, referencia: e.target.value }))} placeholder="Piso, portal, etc." className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-colors" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={crearDireccion} disabled={creandoDir} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50">
                      {creandoDir ? 'Guardando...' : 'Guardar Dirección'}
                    </button>
                    <button onClick={() => setMostrarFormDir(false)} className="text-gray-500 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {perfil.direcciones.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No tienes direcciones guardadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {perfil.direcciones.map(dir => (
                    <div key={dir.id} className="flex items-start justify-between bg-gray-50 rounded-xl p-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-gray-900">{dir.titulo}</span>
                          <span className="text-xs bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">Por defecto</span>
                        </div>
                        <p className="text-sm text-gray-500">{dir.calle}</p>
                        <p className="text-sm text-gray-500">{dir.ciudad}, {dir.codigoPostal}</p>
                        {dir.referencia && <p className="text-xs text-gray-400 mt-1">{dir.referencia}</p>}
                      </div>
                      <button onClick={() => eliminarDireccion(dir.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'pedidos' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Mis Pedidos</h2>
              <div className="text-center py-12">
                <Package size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Tienes {perfil._count.pedidos} pedidos realizados</p>
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Cambiar Contraseña</h2>
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Contraseña Actual</label>
                  <input type="password" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Nueva Contraseña</label>
                  <input type="password" value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
                </div>
                <button onClick={cambiarPass} disabled={cambiandoPass} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50">
                  {cambiandoPass ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
