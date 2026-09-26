import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Tag, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { navigateTo } from '../utils/router';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
    coupons,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const activeCoupons = (coupons || []).filter(c => {
    if (!c.isActive) return false;
    if (c.expiryDate) {
      const exp = new Date(c.expiryDate);
      if (!isNaN(exp.getTime()) && exp < new Date()) return false;
    }
    return true;
  });

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 1500;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput);
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Always in English */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#0F392B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Your Shopping Bag
              </h3>
              <span className="text-xs text-stone-400">
                {cartItemCount} {cartItemCount === 1 ? 'item selected' : 'items selected'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar - Always in English */}
        <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 text-xs">
          <div className="flex justify-between items-center font-medium text-stone-700 mb-1.5">
            {isFreeShipping ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Truck className="w-3.5 h-3.5" /> 
                Free Delivery Unlocked!
              </span>
            ) : (
              <span>
                Add ৳{remainingForFreeShip} more for Free Delivery
              </span>
            )}
            <span className="text-[#0F5338] font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#0F5338] to-[#166A48]'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-stone-400">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-2xl">
                🥒
              </div>
              <p className="text-xs font-medium max-w-xs mx-auto text-stone-600">
                Your shopping bag is empty
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('/products');
                }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-xs font-bold shadow-sm shadow-emerald-950/20 border border-emerald-500/20 cursor-pointer"
              >
                Browse Pickles
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={`${item.product.id}-${item.selectedVariant.size}`}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center gap-3 relative"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {item.selectedVariant.size} • ৳{item.selectedVariant.price}
                  </div>

                  {/* Quantity Incrementer */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-[#0F5338]">
                      ৳{item.selectedVariant.price * item.quantity}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedVariant.size)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout - Always in English */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3">
            
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-৳{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-semibold text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder={
                        activeCoupons.length > 0 
                          ? `Coupon Code (e.g. ${activeCoupons[0].code})`
                          : 'Enter coupon code'
                      }
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F5338] to-[#166A48] hover:from-[#0B442D] hover:to-[#11563A] text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                  {activeCoupons.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      <span className="text-[10px] text-stone-500 font-medium">
                        Offers:
                      </span>
                      {activeCoupons.slice(0, 3).map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCouponInput(c.code);
                            applyCouponCode(c.code);
                          }}
                          className="text-[10px] font-bold text-[#0F5338] bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer"
                        >
                          {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1 font-medium">{couponError}</p>}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">৳{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-৳{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-medium text-stone-700">
                  {isFreeShipping 
                    ? <span className="text-emerald-700 font-bold">FREE</span> 
                    : 'Calculated at checkout'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Amount:</span>
                <span className="text-xl font-black text-[#0F5338]">
                  ৳{Math.max(0, cartSubtotal - couponDiscount)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white font-bold text-sm shadow-lg shadow-emerald-950/25 border border-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* WhatsApp Assist */}
            <div className="text-center pt-1">
              <a
                href={getWhatsAppUrl(
                  settings,
                  `Hello New Brother Picklebar, I would like to order: ${cart.map(i => `${i.product.name} (${i.selectedVariant.size} x ${i.quantity})`).join(', ')}. Subtotal: ৳${cartSubtotal}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order directly on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
