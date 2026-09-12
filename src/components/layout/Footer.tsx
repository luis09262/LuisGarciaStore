import React, { useState } from 'react';
import { Mail, Check, ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { Button } from '../ui/Button';
import { StoreBrandLogo } from '../ui/CustomBrandIcons';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#EDE8DF] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Four Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-[#2C2C2C]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#262626] text-[#E5A88B] flex items-center justify-center flex-shrink-0 border border-[#333]">
              <ShieldCheck className="w-5 h-5 text-[#E5A88B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Garantía Directa</h4>
              <p className="text-xs text-[#9E988E] mt-0.5">Todos los productos cuentan con garantía completa contra defectos de fábrica.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#262626] text-[#E5A88B] flex items-center justify-center flex-shrink-0 border border-[#333]">
              <Truck className="w-5 h-5 text-[#E5A88B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Envíos Rápidos y Seguros</h4>
              <p className="text-xs text-[#9E988E] mt-0.5">Embalaje de alta protección y seguimiento en tiempo real para todos tus pedidos.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#262626] text-[#E5A88B] flex items-center justify-center flex-shrink-0 border border-[#333]">
              <RotateCcw className="w-5 h-5 text-[#E5A88B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Devoluciones Fáciles</h4>
              <p className="text-xs text-[#9E988E] mt-0.5">Dispones de 30 días para cambios y devoluciones sin complicaciones.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#262626] text-[#E5A88B] flex items-center justify-center flex-shrink-0 border border-[#333]">
              <Headphones className="w-5 h-5 text-[#E5A88B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Atención Especializada</h4>
              <p className="text-xs text-[#9E988E] mt-0.5">Soporte técnico y asesoría para ayudarte a elegir el mejor producto.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#2C2C2C]">
          {/* Brand Description */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 flex items-center justify-center">
                <picture>
                  <source srcSet="/varieplus.webp" type="image/webp" />
                  <source srcSet="/varieplus.png" type="image/png" />
                  <img
                    src="/varieplus.webp"
                    alt="VariePlus Logo"
                    width={150}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/zGKV0rdD/varieplus.png';
                    }}
                    className="h-10 w-auto max-w-[150px] object-contain drop-shadow-xs"
                  />
                </picture>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                  Varie<span className="text-[#E06D44]">Plus</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E06D44] uppercase mt-1">
                  STORE & TECH
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#9E988E] leading-relaxed max-w-sm">
              Tienda especializada en guitarras eléctricas, amplificadores de sonido, consolas PlayStation 5, herramientas de taller y gadgets de tecnología de última generación.
            </p>
            <div className="pt-2 text-xs text-[#F5B59A] font-semibold">
              Diseñado y programado por Luis Garcia
            </div>
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Categorías</h5>
            <ul className="space-y-2 text-xs text-[#9E988E]">
              <li><a href="#product-catalog" className="hover:text-white transition-colors">Guitarras & Sonido</a></li>
              <li><a href="#product-catalog" className="hover:text-white transition-colors">Gaming & Consolas</a></li>
              <li><a href="#product-catalog" className="hover:text-white transition-colors">Herramientas & Taller</a></li>
              <li><a href="#product-catalog" className="hover:text-white transition-colors">Gadgets & Tecnología</a></li>
              <li><a href="#product-catalog" className="hover:text-white transition-colors">Ver Todo el Catálogo</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Ayuda & Soporte</h5>
            <ul className="space-y-2 text-xs text-[#9E988E]">
              <li><a href="#" className="hover:text-white transition-colors">Seguir Mi Pedido</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Políticas de Envío</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Centro de Devoluciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto Directo</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription Column */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white">Novedades & Ofertas</h5>
            <p className="text-xs text-[#9E988E] leading-relaxed">
              Suscríbete para recibir lanzamientos de productos, promociones especiales y actualizaciones del catálogo.
            </p>

            {subscribed ? (
              <div className="p-3.5 bg-[#23352B] border border-[#2D4A3E] rounded-lg text-[#95C8A6] text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#6EE7B7]" />
                <span>¡Suscripción exitosa! Te mantendremos informado sobre nuevos ingresos y ofertas.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#7A746B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Ingresa tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 text-xs bg-[#262626] border border-[#3A3A3A] focus:border-[#C85A32] rounded-lg text-white outline-none placeholder:text-[#666]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Unirse
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A746B]">
          <p>© {new Date().getFullYear()} VariePlus Store. Todos los derechos reservados. Diseñado y programado por Luis Garcia.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#EDE8DF] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#EDE8DF] transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-[#EDE8DF] transition-colors">Garantía Oficial</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

