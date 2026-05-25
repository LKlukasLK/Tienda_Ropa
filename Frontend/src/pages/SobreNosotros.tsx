import { Link } from 'react-router-dom';
import { Shield, Leaf, Heart, Users, Award, Truck } from 'lucide-react';

export const SobreNosotros = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gray-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Sobre <span className="text-indigo-400">Nosotros</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Más que una tienda de ropa. Una forma de entender la moda.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">Nuestra Historia</span>
            <h2 className="text-3xl font-black text-gray-900 mt-3 mb-6">
              Nacimos en Barcelona con una idea clara
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <span className="font-bold text-gray-900">MODASHOP</span> nació en 
                <span className="font-bold text-gray-900"> 2016</span> en el corazón de 
                <span className="font-bold text-gray-900"> Barcelona</span>. Lo que empezó 
                como un pequeño proyecto entre amigos se convirtió en una marca de ropa 
                que viste a más de <span className="font-bold text-gray-900">50.000 clientes</span> en toda España.
              </p>
              <p>
                Nuestra filosofía es sencilla: <span className="font-bold text-gray-900">moda accesible, 
                sostenible y con personalidad</span>. Creemos que la ropa es una extensión de 
                quiénes somos, y por eso cada prenda que diseñamos está pensada para 
                hacerte sentir auténtico.
              </p>
              <p>
                Trabajamos con <span className="font-bold text-gray-900">talleres locales</span> 
                y materiales de proximidad para reducir nuestra huella ambiental. 
                Para nosotros, la moda responsable no es una tendencia, es nuestro compromiso.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-3xl aspect-[4/3] flex items-center justify-center">
            <span className="text-gray-400 font-bold text-lg">Barcelona · 2016</span>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">Nuestros Valores</span>
            <h2 className="text-3xl font-black text-gray-900 mt-3">
              Lo que nos define
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Sostenibilidad', text: 'Usamos materiales ecológicos y procesos responsables para cuidar del planeta.' },
              { icon: Heart, title: 'Calidad', text: 'Seleccionamos cada tejido y cada costura para que tus prendas duren temporada tras temporada.' },
              { icon: Users, title: 'Compromiso Local', text: 'Colaboramos con talleres de proximidad y apoyamos la economía local.' },
              { icon: Award, title: 'Diseño Exclusivo', text: 'Cada colección está pensada por nuestro equipo creativo con sede en Barcelona.' },
              { icon: Shield, title: 'Confianza', text: 'Más de 50.000 clientes avalan nuestra calidad y servicio.' },
              { icon: Truck, title: 'Envío Rápido', text: 'Entregas en 24-48 horas a toda la península. Devoluciones gratuitas.' },
            ].map((valor, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
                  <valor.icon size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3">{valor.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{valor.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-black text-sm uppercase tracking-widest">El Equipo</span>
          <h2 className="text-3xl font-black text-gray-900 mt-3">
            Las personas detrás de MODASHOP
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Martina García', role: 'Fundadora & CEO', bio: 'Apasionada de la moda sostenible con 15 años de experiencia en el sector.' },
            { name: 'Carlos Ruiz', role: 'Director Creativo', bio: 'Diseñador textil formado en París y Milán. Define la identidad visual de cada colección.' },
            { name: 'Laura Sánchez', role: 'Head de Producción', bio: 'Supervisa la cadena de suministro garantizando condiciones justas y calidad.' },
            { name: 'David Torres', role: 'Marketing & Comunidad', bio: 'Conecta la marca con los clientes a través de historias que inspiran.' },
          ].map((persona, i) => (
            <div key={i} className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-5 flex items-center justify-center">
                <span className="text-gray-400 font-black text-2xl">{persona.name.charAt(0)}</span>
              </div>
              <h3 className="font-black text-gray-900">{persona.name}</h3>
              <p className="text-indigo-600 font-bold text-sm mt-1">{persona.role}</p>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{persona.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            ¿Listo para descubrir tu próximo estilo?
          </h2>
          <p className="text-indigo-200 mb-8">
            Explora nuestra colección y encuentra las prendas que hablan de ti.
          </p>
          <Link
            to="/coleccion"
            className="inline-block bg-white text-indigo-600 px-10 py-3.5 rounded-full font-black text-sm hover:bg-gray-100 transition-colors"
          >
            Ver Colección
          </Link>
        </div>
      </section>
    </div>
  );
};
