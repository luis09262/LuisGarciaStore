import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, CheckCircle2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { EmptyCartGraphic, StoreCartBagIcon } from '../ui/CustomBrandIcons';

export const DrawerCart: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    cartSubtotal,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const discountAmount = promoApplied ? cartSubtotal * 0.1 : 0;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.08;
  const shippingCost = cartSubtotal >= freeShippingThreshold ? 0 : 9.50;
  const grandTotal = cartSubtotal - discountAmount + estimatedTax + (cartSubtotal > 0 ? shippingCost : 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'VARIEPLUS10' || code === 'VARIE10' || code === 'VERTICE10' || code === 'TIENDA10' || code === 'WARM10') {
      setPromoApplied(true);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);

    const orderId = `VP-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsList = cart.map((item, index) => {
      const sizeInfo = item.selectedSize ? ` (${item.selectedSize})` : '';
      const itemSubtotal = formatCurrency(item.product.price * item.quantity);
      const itemUnit = formatCurrency(item.product.price);
      const photoUrl = item.product.images[0] || '';
      return `${index + 1}. *${item.quantity}x ${item.product.name}*${sizeInfo}\n   • Categoría: ${item.product.category}\n   • Unitario: ${itemUnit} | Subtotal: ${itemSubtotal}\n   • Foto: ${photoUrl}`;
    }).join('\n\n');

    const discountLine = promoApplied ? `• *Descuento (10% OFF):* -${formatCurrency(discountAmount)} [${promoCode.toUpperCase()}]\n` : '';
    const shippingLine = shippingCost === 0 ? '• *Envío:* GRATIS (Promoción Desbloqueada)\n' : `• *Envío:* ${formatCurrency(shippingCost)}\n`;
    const taxesLine = `• *Impuestos Estimados (8%):* ${formatCurrency(estimatedTax)}\n`;

    const message = 
`🏛️ *¡NUEVO PEDIDO - VARIEPLUS STORE & TECH!*
━━━━━━━━━━━━━━━━━━━━━━
🆔 *Nº de Pedido:* #${orderId}
📅 *Fecha:* ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}

📦 *PRODUCTOS SOLICITADOS:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━
📊 *RESUMEN DE PAGO:*
• *Subtotal:* ${formatCurrency(cartSubtotal)}
${discountLine}${shippingLine}${taxesLine}
🔥 *TOTAL A PAGAR:* ${formatCurrency(grandTotal)}
━━━━━━━━━━━━━━━━━━━━━━
💳 *MÉTODOS DE PAGO:*
• Yape / Plin / Transferencia Bancaria (BCP, BBVA, Interbank) / Tarjeta

¡Hola! Quiero confirmar este pedido y proceder con el pago seguro. Por favor me facilitan los datos para la transferencia y entrega. ¡Gracias!`;

    const whatsappUrl = `https://wa.me/51930640381?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsCheckingOut(false);
      // Open WhatsApp in new tab or navigate directly
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleResetOrderState = () => {
    setOrderComplete(false);
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#EFECE6]"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#EFECE6] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    Carrito de Compras
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F4F1EA] text-[#666059]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-lg text-[#666059] hover:text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Dynamic Progress Bar */}
              <div className="bg-[#FAF7F2] p-4 border-b border-[#EFECE6]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                    <Truck className="w-4 h-4 text-[#C85A32]" />
                    {amountNeededForFreeShipping > 0 ? (
                      <span>
                        Agrega{' '}
                        <strong className="text-[#C85A32]">
                          {formatCurrency(amountNeededForFreeShipping)}
                        </strong>{' '}
                        más para Envío Gratis
                      </span>
                    ) : (
                      <span className="text-[#2D4A3E] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ¡Envío Gratis Desbloqueado!
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#666059]">
                    {freeShippingProgress}%
                  </span>
                </div>
                {/* Progress track */}
                <div className="w-full h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      freeShippingProgress >= 100 ? 'bg-[#2D4A3E]' : 'bg-[#C85A32]'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {orderComplete ? (
                  /* Order Confirmation State */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#EAF2ED] text-[#2D4A3E] flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      ¡Pedido Confirmado!
                    </h3>
                    <p className="text-xs text-[#666059] max-w-xs">
                      Hemos recibido tu pedido correctamente. Te enviaremos un correo electrónico con los detalles del envío y número de seguimiento.
                    </p>
                    <div className="p-3 bg-[#F4F1EA] rounded-lg text-xs font-mono text-[#1A1A1A] w-full">
                      Nº de Pedido: #VT-{Math.floor(100000 + Math.random() * 900000)}
                    </div>
                    <Button
                      variant="primary"
                      className="w-full mt-2"
                      onClick={handleResetOrderState}
                    >
                      Seguir Comprando
                    </Button>
                  </div>
                ) : cart.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4 space-y-4">
                    <EmptyCartGraphic className="py-1" />
                    <div className="space-y-1.5 max-w-xs">
                      <h3 className="text-base font-bold text-[#1A1A1A]">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-xs text-[#666059] leading-relaxed">
                        Explora nuestras guitarras eléctricas, amplificadores, PlayStation 5, herramientas de taller y gadgets tecnológicos.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      pill
                      onClick={closeCart}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="mt-2"
                    >
                      Ver Productos
                    </Button>
                  </div>
                ) : (
                  /* Cart Line Items */
                  <div className="divide-y divide-[#EFECE6]">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 first:pt-0 last:pb-0 flex gap-3.5 group"
                      >
                        {/* Product Image Thumbnail */}
                        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-lg bg-[#F4F1EA] border border-[#EFECE6] overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] line-clamp-1 leading-snug">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#8C8479] hover:text-[#C85A32] p-1 -mr-1 transition-colors cursor-pointer"
                                aria-label="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-[11px] text-[#8C8479] mt-0.5">
                              {item.product.category}
                            </p>

                            {item.selectedSize && (
                              <div className="mt-1">
                                <span className="text-[11px] font-medium text-[#666059] bg-[#F4F1EA] px-2 py-0.5 rounded-md">
                                  {item.selectedSize}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-2 pt-1">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#E0DBD1] rounded-md bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-[#F4F1EA] text-[#666059] hover:text-[#1A1A1A] transition-colors"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#1A1A1A] min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-[#F4F1EA] text-[#666059] hover:text-[#1A1A1A] transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer / Checkout Area */}
              {cart.length > 0 && !orderComplete && (
                <div className="p-4 sm:p-5 border-t border-[#EFECE6] bg-white space-y-3">
                  {/* Promo code bar */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código promocional (ej. VARIEPLUS10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 h-9 px-3 text-xs bg-[#F4F1EA] rounded-md border border-transparent focus:border-[#C85A32] focus:bg-white outline-none uppercase placeholder:normal-case text-[#1A1A1A]"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      disabled={!promoCode || promoApplied}
                    >
                      {promoApplied ? '¡Aplicado!' : 'Aplicar'}
                    </Button>
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-[#666059] pt-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        {formatCurrency(cartSubtotal)}
                      </span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-[#C85A32] font-medium">
                        <span>Descuento (10% OFF)</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="font-semibold text-[#2D4A3E]">GRATIS</span>
                        ) : (
                          formatCurrency(shippingCost)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Impuestos Estimados (8%)</span>
                      <span>{formatCurrency(estimatedTax)}</span>
                    </div>

                    <div className="border-t border-[#EFECE6] pt-2 flex justify-between text-sm font-bold text-[#1A1A1A]">
                      <span>Total</span>
                      <span className="text-base text-[#C85A32]">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button - WhatsApp Direct Checkout */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-[0_4px_16px_rgba(200,90,50,0.28)] hover:shadow-[0_6px_22px_rgba(200,90,50,0.38)]"
                    isLoading={isCheckingOut}
                    onClick={handleWhatsAppCheckout}
                    leftIcon={<MessageCircle className="w-4 h-4 text-emerald-300" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceder al Pago Seguro
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C8479]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Compra directa y protegida vía WhatsApp (+51 930 640 381)</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

