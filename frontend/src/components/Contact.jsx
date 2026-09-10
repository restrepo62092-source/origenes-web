import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, MapPin, FlaskConical, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { culturesData } from '../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CONFIRMATION_MESSAGE =
  'Solicitud registrada con éxito. La Dirección Técnica de Orígenes Khachi emitirá el dictamen preliminar en menos de 24 horas.';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  department: '',
  municipality: '',
  culture: '',
  hectares: '',
  message: '',
  soil_ec: '',
  soil_ph: ''
};

const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
  'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

const Contact = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.department ||
        !formData.municipality || !formData.culture || !formData.hectares || !formData.message) {
      toast.error('Complete todos los campos requeridos del portal de auditoría');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('Describa la problemática observada con al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        municipality: formData.municipality,
        culture: formData.culture,
        hectares: parseFloat(formData.hectares),
        message: formData.message,
        soil_ec: formData.soil_ec !== '' ? parseFloat(formData.soil_ec) : null,
        soil_ph: formData.soil_ph !== '' ? parseFloat(formData.soil_ph) : null
      };

      const response = await axios.post(`${BACKEND_URL}/api/contact/`, payload);

      if (response.status === 201) {
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            'event_category': 'Auditoría',
            'event_label': 'Portal Santuario-Cronos - Solicitud enviada'
          });
        }

        toast.success(CONFIRMATION_MESSAGE, { duration: 8000 });
        setFormData(EMPTY_FORM);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error al registrar la auditoría:', error);
      toast.error('No fue posible registrar la solicitud. Por favor intente nuevamente.', {
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-orange-900 text-white relative overflow-hidden"
      data-testid="contact-section"
    >
      <div id="auditoria" className="absolute -top-24" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-6">
              <FlaskConical className="w-4 h-4 text-orange-300" />
              <span className="text-orange-100 text-sm font-medium">Portal de Auditoría Santuario-Cronos</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="audit-title">
              Solicitar Auditoría Bio-Agronómica Inicial: Santuario-Cronos
            </h2>
            <p className="text-lg text-green-100 mb-8 leading-relaxed" data-testid="audit-subtitle">
              Diagnóstico presintomático de vulnerabilidad a fitopatógenos y desbalance fisiológico
              basado en la Ley de Trofobiosis y el Efecto Rovira.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Dirección Técnica</div>
                  <div className="text-green-100" data-testid="contact-email">gerencia@origeneskhachi.org</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Teléfono / WhatsApp</div>
                  <div className="text-green-100" data-testid="contact-phone-1">+57 300 558 2757</div>
                  <div className="text-green-100" data-testid="contact-phone-2">+57 310 321 2780</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Sede Operativa</div>
                  <div className="text-green-100" data-testid="contact-address">Finca La Esperanza, Vda La Rambla<br/>San Antonio del Tequendama</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-orange-300 flex-shrink-0" />
              <div>
                <div className="text-sm text-green-100 mb-1">Dictamen preliminar</div>
                <div className="text-xl font-bold">Emitido en menos de 24 horas</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10" data-testid="audit-success-panel">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-11 h-11 text-green-800" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">Auditoría registrada</h3>
                <p className="text-gray-700 leading-relaxed mb-8" data-testid="audit-confirmation-message">
                  {CONFIRMATION_MESSAGE}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="audit-new-request-btn"
                  onClick={() => setSubmitted(false)}
                  className="border-2 border-green-900 text-green-900 hover:bg-green-900 hover:text-white"
                >
                  Registrar otra auditoría
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                <div>
                  <Label htmlFor="audit-name" className="text-green-900">Nombre Completo del Productor / Empresa *</Label>
                  <Input
                    id="audit-name"
                    data-testid="contact-name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={setField('name')}
                    className="mt-2 border-gray-300 focus:border-orange-500"
                    placeholder="Ej: Agrícola La Rambla S.A.S."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audit-email" className="text-green-900">Correo Electrónico *</Label>
                    <Input
                      id="audit-email"
                      data-testid="contact-email-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={setField('email')}
                      className="mt-2 border-gray-300 focus:border-orange-500"
                      placeholder="productor@empresa.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audit-phone" className="text-green-900">Teléfono / WhatsApp de Contacto *</Label>
                    <Input
                      id="audit-phone"
                      data-testid="contact-phone-input"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={setField('phone')}
                      className="mt-2 border-gray-300 focus:border-orange-500"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audit-department" className="text-green-900">Departamento *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger id="audit-department" data-testid="contact-department-select" className="mt-2 border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept} data-testid={`dept-${dept}`}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audit-municipality" className="text-green-900">Municipio *</Label>
                    <Input
                      id="audit-municipality"
                      data-testid="contact-municipality-input"
                      type="text"
                      required
                      value={formData.municipality}
                      onChange={setField('municipality')}
                      className="mt-2 border-gray-300 focus:border-orange-500"
                      placeholder="Ej: San Antonio del Tequendama"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audit-culture" className="text-green-900">Cultivo Principal *</Label>
                    <Select
                      value={formData.culture}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, culture: value }))}
                    >
                      <SelectTrigger id="audit-culture" data-testid="contact-culture-select" className="mt-2 border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {culturesData.map((culture) => (
                          <SelectItem key={culture.name} value={culture.name} data-testid={`culture-${culture.name}`}>{culture.name}</SelectItem>
                        ))}
                        <SelectItem value="Otro" data-testid="culture-Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audit-hectares" className="text-green-900">Área del Cultivo (Hectáreas) *</Label>
                    <Input
                      id="audit-hectares"
                      data-testid="contact-hectares-input"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      value={formData.hectares}
                      onChange={setField('hectares')}
                      className="mt-2 border-gray-300 focus:border-orange-500"
                      placeholder="Ej: 12.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="audit-message" className="text-green-900">Síntomas o problemática actual observada en campo *</Label>
                  <Textarea
                    id="audit-message"
                    data-testid="contact-message-input"
                    required
                    value={formData.message}
                    onChange={setField('message')}
                    className="mt-2 border-gray-300 focus:border-orange-500 min-h-[140px]"
                    placeholder="Describa clorosis, deformaciones, incidencia de plagas, manejo nutricional actual, historial de aplicaciones..."
                  />
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <div className="text-xs font-semibold text-green-900 uppercase tracking-wider mb-3">
                    Parámetros edáficos (opcional)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="audit-soil-ec" className="text-green-900">Conductividad Eléctrica del Suelo (dS/m)</Label>
                      <Input
                        id="audit-soil-ec"
                        data-testid="contact-soil-ec-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.soil_ec}
                        onChange={setField('soil_ec')}
                        className="mt-2 bg-white border-gray-300 focus:border-orange-500"
                        placeholder="Ej: 1.25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="audit-soil-ph" className="text-green-900">pH del Suelo</Label>
                      <Input
                        id="audit-soil-ph"
                        data-testid="contact-soil-ph-input"
                        type="number"
                        min="0"
                        max="14"
                        step="0.1"
                        value={formData.soil_ph}
                        onChange={setField('soil_ph')}
                        className="mt-2 bg-white border-gray-300 focus:border-orange-500"
                        placeholder="Ej: 5.8"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  data-testid="contact-submit-btn"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? 'Registrando auditoría...' : 'Enviar Datos para Auditoría Fisiometabólica'}
                  <FlaskConical className="ml-2 w-5 h-5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
