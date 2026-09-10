import React from 'react';
import { Mail, Phone, MapPin, Leaf } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo-origenes.jpg" 
                alt="ORÍGENES Logo" 
                className="h-16 w-16 object-contain bg-white rounded-lg p-1"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">ORÍGENES</span>
                <span className="text-orange-400 font-semibold">NUTRICIÓN Y PRECISIÓN</span>
              </div>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Transformando la agricultura colombiana con tecnología de precisión y soluciones personalizadas.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Leaf className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-green-100">17+ años de experiencia</span>
            </div>
          </div>

          {/* Column 2 - Servicios */}
          <div>
            <h3 className="text-lg font-bold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Agricultura de Precisión</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Monitoreo en Tiempo Real</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Nutrición Especializada</li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">Formulación Magistral</li>
            </ul>
          </div>

          {/* Column 3 - Cultivos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Cultivos</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li>Café y Cacao</li>
              <li>Aguacate y Cítricos</li>
              <li>Papa y Maíz</li>
              <li>Hortalizas</li>
              <li>Flores</li>
              <li>Y muchos más...</li>
            </ul>
          </div>

          {/* Column 4 - Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-100">gerencia@origeneskhachi.org</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-100">+57 300 558 2757 / +57 313 338 4608</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-100">Finca La Esperanza, Vda La Rambla, San Antonio del Tequendama</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-green-200">
              © {currentYear} ORÍGENES: Nutrición y Precisión. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-green-200">
              <span className="hover:text-orange-400 transition-colors cursor-pointer">Política de Privacidad</span>
              <span className="hover:text-orange-400 transition-colors cursor-pointer">Términos y Condiciones</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
