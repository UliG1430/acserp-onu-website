import React from 'react';
import { bodies } from '../data/bodies';
import { useInView } from 'react-intersection-observer';
import SEOHelmet from '../components/SEOHelmet';
import organsMetadata from '../data/organsMetadata';

const Model = () => {
  // Función para obtener el color del órgano basado en el ID
  const getOrganColor = (bodyId) => {
    const organ = organsMetadata.find(org => {
             // Mapeo de IDs de bodies a IDs de organsMetadata
       const idMapping = {
         13: "STI",
         2: "AG", 
         6: "CS",
         7: "ECOSOC",
         4: "CDH",
         11: "ONUM",
         12: "PNUMA",
         14: "UNESCO",
         1: "ACNUR",
         15: "UNICEF",
         9: "OMS",
         3: "CAJ",
         8: "OIT",
         10: "ONUDD",
         5: "UNODA"
       };
      return org.id === idMapping[bodyId];
    });
    return organ ? organ.color : "#3B82F6"; // Color por defecto si no se encuentra
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SEOHelmet 
        title="Órganos - Modelo ONU La Plata"
        description="Explorá los órganos y comités del Modelo ONU La Plata, donde los estudiantes debaten y resuelven problemas globales."
      />

      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-24 w-full overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
                         <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
               Órganos
             </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl font-light leading-relaxed text-blue-100 max-w-4xl mx-auto">
            Conocé todos los órganos que formaron parte de los{' '}
            <span className="font-semibold text-white">Modelos Intercolegiales de Naciones Unidas</span> en La Plata.
            A lo largo de los años, nuestra Asociación ha desarrollado una amplia variedad de órganos y comités, permitiendo a los y las participantes abordar las principales temáticas de la agenda internacional desde distintas perspectivas. Explorá cada uno y descubrí su impacto.
          </p>
          

        </div>
      </section>

      {/* Órganos Grid Mejorado */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {bodies.map((body, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            const isEven = index % 2 === 0;

            return (
              <div
                key={body.id}
                ref={ref}
                className={`mb-16 last:mb-0 ${
                  inView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                } transition-all duration-1000 ease-out`}
              >
                                 <div className={`
                   relative overflow-hidden rounded-2xl shadow-2xl
                   ${isEven ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}
                   border border-gray-100
                   transform transition-all duration-500 ease-out
                   hover:scale-[1.02] hover:shadow-3xl hover:-translate-y-2
                   group cursor-pointer
                 `}>
                                     {/* Background Accent */}
                   <div 
                     className="absolute top-0 left-0 w-full h-1 transition-all duration-500 ease-out group-hover:h-2 group-hover:animate-pulse"
                     style={{ backgroundColor: getOrganColor(body.id) }}
                   ></div>
                   
                   {/* Shimmer Effect */}
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none">
                     <div 
                       className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                       style={{
                         background: `linear-gradient(90deg, transparent, ${getOrganColor(body.id)}20, transparent)`
                       }}
                     ></div>
                   </div>
                  
                  <div className={`
                    flex flex-col lg:flex-row items-center p-8 lg:p-12
                    ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}
                  `}>
                                         {/* Logo Section */}
                     <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
                       <div className="relative">
                         <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                           <img
                             src={body.logo}
                             alt={body.nombre}
                             className="object-contain w-80 h-40 lg:w-[500px] lg:h-[250px]"
                           />
                         </div>
                       </div>
                     </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 lg:px-8">
                      <div className="text-center lg:text-left">
                                                 {/* Title */}
                         <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-500 ease-out group-hover:scale-105 group-hover:translate-x-2">
                           {body.nombre}
                         </h2>
                        
                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                          {body.descripcion}
                        </p>

                                                 {/* Tópico VIII Edición */}
                         <div 
                           className="p-4 rounded-r-lg mb-6 border-l-4 transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:border-l-8"
                           style={{ 
                             backgroundColor: getOrganColor(body.id) === "#000000" 
                               ? "rgba(0, 0, 0, 0.1)" 
                               : `${getOrganColor(body.id)}15`,
                             borderLeftColor: getOrganColor(body.id)
                           }}
                         >
                           <h3 
                             className="text-lg font-semibold mb-2"
                             style={{ color: getOrganColor(body.id) }}
                           >
                             Tópico - VIII Edición
                           </h3>
                           <p className="text-gray-700">
                            {body.id === 13 && "EJE 1: Nuevas agendas de seguridad; EJE 2: Hegemonía económica mundial en disputa"}
                            {body.id === 2 && "Inteligencia artificial en procesos electorales. Desafíos globales de regulación, privacidad y equidad en campañas políticas"}
                            {body.id === 6 && "Crisis en la región de Cachemira. Conflicto territorial y las consecuencias de su escalada"}
                            {body.id === 7 && "Sostenibilidad de la deuda pública. Retos para el desarrollo, la autonomía fiscal y la estabilidad económica global"}
                            {body.id === 4 && "Militarización de las fuerzas de seguridad. Del ejercicio legítimo de la violencia al abuso de poder"}
                            {body.id === 11 && "Economía de la fertilidad y gestación subrogada. Dilemas éticos y jurídicos sobre la instrumentalización de la mujer"}
                            {body.id === 12 && "Políticas verdes o desarrollo: ¿una falsa dicotomía? Tensión entre la responsabilidad histórica del norte y los desafíos del sur global"}
                            {body.id === 14 && "Lenguas silenciadas. La herencia de la colonización, la globalización y la exclusión lingüística"}
                            {body.id === 1 && "Derecho al retorno. Obstáculos políticos, sociales y jurídicos para su implementación"}
                            {body.id === 15 && "Trata con fines de explotación. La infancia en peligro: desafíos transnacionales para la protección de los derechos de niñas y niños"}
                            {body.id === 9 && "Regulación de la edición genética. Entre los fines terapéuticos y las ambiciones eugenésicas"}
                            {body.id === 3 && "Crímenes de lesa humanidad. Debate jurídico y avance del negacionismo internacional"}
                            {body.id === 8 && "La reconfiguración del trabajo en la era de las plataformas. Tensiones entre flexibilidad, regulación y derechos laborales"}
                            {body.id === 10 && "Corrupción estatal. Crimen transnacional, lavado de activos y vacíos legales en la regulación internacional"}
                                                         {body.id === 5 && "Producción, trazabilidad y uso de las armas. El rol de los Estados en la plena vigencia de los acuerdos internacionales existentes"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

     
    </div>
  );
};

export default Model;
