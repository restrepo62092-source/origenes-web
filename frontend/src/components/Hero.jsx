import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { heroData } from '../data/mock';

const Hero = () => {
  const scrollToAudit = () => {
    if (window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'CTA',
        'event_label': 'Hero CTA - Solicitar Auditoría Santuario-Cronos'
      });
    }
    const target = document.getElementById('auditoria') || document.getElementById('contacto');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/34182340/pexels-photo-34182340.jpeg"
          alt="Agricultura de Precisión"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/95 via-green-900/90 to-orange-950/85"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-8 backdrop-blur-sm animate-fade-in">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-orange-100 text-sm font-medium">Líderes en Agricultura de Precisión</span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <img 
                src="/logo-origenes.jpg" 
                alt="ORÍGENES Logo" 
                className="h-32 w-32 object-contain"
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight animate-slide-up">
            {heroData.title}
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-orange-400 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {heroData.subtitle}
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {heroData.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick={scrollToAudit}
              data-testid="hero-audit-cta-btn"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {heroData.ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToServices}
              className="border-2 border-white text-white hover:bg-white hover:text-green-900 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              {heroData.secondaryCtaText}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {heroData.stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">{stat.number}</div>
                <div className="text-gray-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
