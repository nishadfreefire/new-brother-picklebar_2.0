import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Phone, 
  MapPin, 
  Tag, 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Copy, 
  Trash2, 
  Plus, 
  Minus, 
  AlertCircle,
  Clock,
  ShoppingBag,
  PackageCheck,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { DeliveryZone, PaymentMethod, Order } from '../types';
import { 
  BANGLADESH_DISTRICTS, 
  BANGLADESH_DIVISIONS, 
  DISTRICT_BANGLA_NAMES, 
  getDistrictsByDivision 
} from '../data/bangladeshData';
import { navigateTo } from '../utils/router';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
    coupons,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    settings,
    setIsTrackingOpen,
    setActiveTrackingOrder
  } = useStore();

  const { lang } = useLanguage();

  const activeCoupons = (coupons || []).filter(c => {
    if (!c.isActive) return false;
    if (c.expiryDate) {
      const exp = new Date(c.expiryDate);
      if (!isNaN(exp.getTime()) && exp < new Date()) return false;
    }
    return true;
  });

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedThana, setSelectedThana] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside-dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  const isCodEnabled = settings?.enableCashOnDelivery !== false;
  const isBkashEnabled = settings?.enableBkash !== false;
  const isNagadEnabled = settings?.enableNagad !== false;

  useEffect(() => {
    if (paymentMethod === 'cod' && !isCodEnabled) {
      if (isBkashEnabled) setPaymentMethod('bkash');
      else if (isNagadEnabled) setPaymentMethod('nagad');
    } else if (paymentMethod === 'bkash' && !isBkashEnabled) {
      if (isNagadEnabled) setPaymentMethod('nagad');
      else if (isCodEnabled) setPaymentMethod('cod');
    } else if (paymentMethod === 'nagad' && !isNagadEnabled) {
      if (isBkashEnabled) setPaymentMethod('bkash');
      else if (isCodEnabled) setPaymentMethod('cod');
    }
  }, [isCodEnabled, isBkashEnabled, isNagadEnabled, paymentMethod]);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [isCouponError, setIsCouponError] = useState(false);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    document.title = 'চেকআউট | নিউ ব্রাদার্স আচার বার';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Filtered Districts based on selected Division
  const availableDistricts = selectedDivision 
    ? getDistrictsByDivision(selectedDivision) 
    : BANGLADESH_DISTRICTS;

  // Available Thanas based on selected District
  const currentDistrictObj = BANGLADESH_DISTRICTS.find(d => d.district === selectedDistrict);
  const availableThanas = currentDistrictObj ? currentDistrictObj.thanas : [];

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divId = e.target.value;
    setSelectedDivision(divId);
    setSelectedDistrict('');
    setSelectedThana('');
    setCity('');

    if (divId === 'Dhaka') {
      setDeliveryZone('inside-dhaka');
    } else if (divId) {
      setDeliveryZone('outside-dhaka');
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    setSelectedThana('');
    setCity(dist);

    if (dist === 'Dhaka') {
      setDeliveryZone('inside-dhaka');
    } else if (dist === 'Gazipur' || dist === 'Narayanganj') {
      setDeliveryZone('sub-dhaka');
    } else if (dist) {
      setDeliveryZone('outside-dhaka');
    }
  };

  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim();
    if (!targetCode) return;
    setIsCouponLoading(true);
    setCouponMsg('');

    const result = await applyCouponCode(targetCode.toUpperCase());
    setIsCouponLoading(false);
    if (result.success) {
      setCouponMsg(result.message || 'কুপন সফলভাবে প্রয়োগ হয়েছে!');
      setIsCouponError(false);
      setCouponInput('');
    } else {
      setCouponMsg(result.message || 'ভুল কুপন কোড!');
      setIsCouponError(true);
    }
  };

  // Delivery calculation
  let deliveryFee = 70;
  if (settings) {
    if (deliveryZone === 'inside-dhaka') deliveryFee = settings.deliveryFeeInsideDhaka;
    else if (deliveryZone === 'sub-dhaka') deliveryFee = settings.deliveryFeeSubDhaka;
    else deliveryFee = settings.deliveryFeeOutsideDhaka;

    if (settings.freeDeliveryThreshold && cartSubtotal >= settings.freeDeliveryThreshold) {
      deliveryFee = 0;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('আপনার কার্ট খালি! অনুগ্রহ করে প্রথমে আচার যোগ করুন।');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) লিখুন');
      return;
    }

    if (!selectedDivision) {
      setErrorMessage('অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন');
      return;
    }

    if (!selectedDistrict) {
      setErrorMessage('অনুগ্রহ করে আপনার জেলা নির্বাচন করুন');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setErrorMessage('অনুগ্রহ করে বিকাশ/নগদ Transaction ID (TrxID) প্রদান করুন');
      return;
    }

    setIsSubmitting(true);

    const divisionObj = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision);
    const divisionLabel = divisionObj ? `${divisionObj.nameBn} (${divisionObj.nameEn})` : selectedDivision;
    const districtBn = DISTRICT_BANGLA_NAMES[selectedDistrict] || selectedDistrict;

    const fullAddressDetails = `${address.trim()}${selectedThana ? `, থানা: ${selectedThana}` : ''}, জেলা: ${districtBn} (${selectedDistrict}), বিভাগ: ${divisionLabel}`;

    try {
      const res = await placeOrder({
        customerName: customerName.trim(),
        phone: cleanPhone,
        altPhone: altPhone.trim() || undefined,
        email: email.trim() || undefined,
        deliveryZone,
        address: fullAddressDetails,
        city: selectedDistrict,
        orderNotes: orderNotes.trim() || undefined,
        paymentMethod,
        transactionId: transactionId.trim() || undefined
      });

      setIsSubmitting(false);

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas-confetti fails
        }
      } else {
        setErrorMessage(res.error || 'অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে।');
    }
  };

  const copyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // 1. ORDER CONFIRMED VIEW
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-[#0F392B] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-[#0F392B]" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-2">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Thank you, {completedOrder.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Your artisanal pickle order has been received. Our representative will call your number shortly to confirm delivery.
            </p>
          </div>

          {/* Order ID Badge */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] text-stone-400 block font-medium">Order ID:</span>
              <span className="text-base sm:text-lg font-black text-[#0F392B] tracking-wider">
                {completedOrder.id}
              </span>
            </div>
            <button
              onClick={copyOrderId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{isCopied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Summary Box */}
          <div className="text-left bg-[#FAF8F5] p-4 sm:p-6 rounded-2xl border border-[#E7DECD] space-y-3 text-xs sm:text-sm">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2">
              Order Summary
            </h3>
            <div className="space-y-2">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-stone-700">
                    {item.productName || item.banglaName} ({item.size}) × {item.quantity}
                  </span>
                  <span className="font-bold text-stone-900">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-2 space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>৳{completedOrder.deliveryFee}</span>
              </div>
              {completedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-৳{completedOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-[#0F392B] pt-1 border-stone-200">
                <span>Total Amount:</span>
                <span>৳{completedOrder.totalAmount}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
              📍 <strong>Address:</strong> {completedOrder.address} | 📞 <strong>Phone:</strong> {completedOrder.phone}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTrackingOrder(completedOrder);
                setIsTrackingOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20 border border-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-emerald-200" />
              <span>Track Order Live</span>
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Back to Home</span>
            </button>
          </div>

          {/* WhatsApp Support Assist */}
          <div className="pt-2">
            <a
              href={getWhatsAppUrl(
                settings,
                `Assalamu Alaikum, I would like to inquire about my order ID ${completedOrder.id}. Total amount: ৳${completedOrder.totalAmount}.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact us on WhatsApp for any assistance</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART VIEW
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 bg-[#fefbf3] text-[#967623] rounded-3xl flex items-center justify-center mx-auto border border-[#fceabd]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Your Cart is Currently Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Please browse our authentic artisanal pickles and add your favorite jars before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F392B] hover:bg-[#164E3D] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Explore All Pickles</span>
        </button>
      </div>
    );
  }

  // 3. MAIN DEDICATED CHECKOUT PAGE
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0F392B] transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>Order & Checkout</span>
            <span className="text-xs font-bold text-[#0F392B] bg-[#0F392B]/10 px-2.5 py-0.5 rounded-full">
              100% Secure
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cash on Delivery & Fast Home Delivery</span>
        </div>
      </div>

      {/* Checkout Content: 2-Column Responsive Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Customer Information & Delivery Address (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          

          {/* 2. Customer Personal & Delivery Address Form */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <MapPin className="w-4 h-4 text-[#0F392B]" />
              <span>Delivery Information & Address:</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Md. Kamrul Hasan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B]"
                  required
                />
              </div>

              {/* Primary Mobile */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B]"
                  required
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">Provide an active phone number for delivery call</span>
              </div>

              {/* Alternative Mobile */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={e => setAltPhone(e.target.value)}
                  placeholder="Alternative number (if any)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B]"
                />
              </div>

              {/* 3-Step Geographic Address Selector: Division -> District -> Thana */}
              <div className="sm:col-span-2 space-y-3 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-800">
                    <MapPin className="w-4 h-4 text-[#0F392B]" />
                    <span>ডেলিভারি ঠিকানা নির্বাচন (বিভাগ ➔ জেলা ➔ থানা)</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <span className="text-[11px] text-[#0F392B] font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full inline-block w-fit">
                    ৩টি ধাপে সহজে খুঁজুন
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Step 1: Division */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#0F392B] text-white text-[10px] font-bold flex items-center justify-center">১</span>
                      <span>বিভাগ (Division) <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B] appearance-none pr-8 cursor-pointer font-medium shadow-2xs"
                        required
                      >
                        <option value="">বিভাগ সিলেক্ট করুন</option>
                        {BANGLADESH_DIVISIONS.map(div => (
                          <option key={div.id} value={div.id}>
                            {div.nameBn} ({div.nameEn})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Step 2: District */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#0F392B] text-white text-[10px] font-bold flex items-center justify-center">২</span>
                      <span>জেলা (District) <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        disabled={!selectedDivision}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B] appearance-none pr-8 cursor-pointer font-medium disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed shadow-2xs"
                        required
                      >
                        <option value="">
                          {selectedDivision ? 'জেলা সিলেক্ট করুন' : 'আগে বিভাগ সিলেক্ট করুন'}
                        </option>
                        {availableDistricts.map(d => {
                          const bn = DISTRICT_BANGLA_NAMES[d.district] || d.district;
                          return (
                            <option key={d.district} value={d.district}>
                              {bn} ({d.district})
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Step 3: Thana / Upazila */}
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#0F392B] text-white text-[10px] font-bold flex items-center justify-center">৩</span>
                      <span>থানা / উপজেলা</span>
                    </label>
                    <div className="relative">
                      {availableThanas.length > 0 ? (
                        <select
                          value={selectedThana}
                          onChange={e => setSelectedThana(e.target.value)}
                          disabled={!selectedDistrict}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B] appearance-none pr-8 cursor-pointer font-medium disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed shadow-2xs"
                        >
                          <option value="">থানা সিলেক্ট করুন (ঐচ্ছিক)</option>
                          {availableThanas.map(t => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={selectedThana}
                          onChange={e => setSelectedThana(e.target.value)}
                          disabled={!selectedDistrict}
                          placeholder={selectedDistrict ? 'থানা / এরিয়া লিখুন' : 'আগে জেলা সিলেক্ট করুন'}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B] disabled:bg-stone-100 disabled:text-stone-400 shadow-2xs"
                        />
                      )}
                      {availableThanas.length > 0 && (
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Detailed Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  Full Address (House, Road, Area) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. House #12, Road #05, Block-C, Banani, Dhaka"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0F392B] focus:border-[#0F392B]"
                  required
                />
              </div>

              {/* Order Notes */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  Special Instructions / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="e.g. Deliver in the afternoon / Call before delivery"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#0F392B]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method Selection */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <CreditCard className="w-4 h-4 text-[#0F392B]" />
              <span>Payment Method:</span>
            </h2>

            {/* Compact payment method selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cash On Delivery */}
              {isCodEnabled && (
                <label
                  className={`px-3.5 py-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0F392B] bg-[#0F392B]/5 ring-1 ring-[#0F392B]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#0F392B] w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery (COD)'}
                  </span>
                </label>
              )}

              {/* bKash */}
              {isBkashEnabled && (
                <label
                  className={`px-3.5 py-3 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#D12053] bg-pink-50/40 ring-1 ring-[#D12053]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="accent-[#D12053] w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm font-bold text-stone-900">
                      bKash
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#E2136E]/15 text-[#D12053] font-black px-2 py-0.5 rounded">bKash</span>
                </label>
              )}

              {/* Nagad */}
              {isNagadEnabled && (
                <label
                  className={`px-3.5 py-3 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="accent-[#EA580C] w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm font-bold text-stone-900">
                      Nagad
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#F7941D]/15 text-[#EA580C] font-black px-2 py-0.5 rounded">Nagad</span>
                </label>
              )}
            </div>

            {/* TrxID box if online payment is chosen */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-stone-700">
                    {paymentMethod === 'bkash' ? 'bKash Send Money / Personal Number:' : 'Nagad Send Money / Personal Number:'}{' '}
                    <strong className="font-mono text-stone-900 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                      {paymentMethod === 'bkash' ? (settings?.bkashNumber || '01711234567') : (settings?.nagadNumber || '01711234567')}
                    </strong>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded">
                    Send Money (সেন্ড মানি)
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="Enter Transaction ID (TrxID) - যেমন: 9J4K2L1M"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#0F392B] bg-white"
                    required={paymentMethod === 'bkash' || paymentMethod === 'nagad'}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Items Summary & Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Order Items Review */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0F392B]" />
                <span>Order Summary ({cart.length})</span>
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                Subtotal: ৳{cartSubtotal}
              </span>
            </div>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.selectedVariant.size}`} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-medium block">
                      Size: {item.selectedVariant.size} • ৳{item.selectedVariant.price}
                    </span>

                    {/* Quantity modifier directly inside checkout */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity - 1)}
                          className="px-2 py-0.5 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-stone-900 bg-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity + 1)}
                          className="px-2 py-0.5 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant.size)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-stone-900">
                      ৳{item.selectedVariant.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#B8922A]" />
              <span>Discount / Promo Code:</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Coupon: <strong>{appliedCoupon.code}</strong> (-৳{couponDiscount})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponMsg('');
                    }}
                    placeholder={activeCoupons.length > 0 ? `Coupon code (e.g. ${activeCoupons[0].code})` : 'Enter coupon code'}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs uppercase font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isCouponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-[#0F5338] hover:bg-[#0B442D] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isCouponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs font-bold ${isCouponError ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponMsg}
                  </p>
                )}
                {activeCoupons.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-stone-500 font-medium">{lang === 'bn' ? 'চলমান অফার:' : 'Active Offers:'}</span>
                    {activeCoupons.map(c => {
                      const discountText = c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCouponInput(c.code);
                            handleApplyCoupon(c.code);
                          }}
                          className="text-[11px] font-bold text-[#0F5338] bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 cursor-pointer transition-colors"
                        >
                          {c.code} ({discountText})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price Calculation Bill */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Billing Summary
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-stone-900">৳{cartSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold text-stone-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Free</span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-৳{couponDiscount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total Payable:</span>
                <span className="text-2xl font-black text-[#0F5338]">
                  ৳{finalTotal}
                </span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0F5338] via-[#166A48] to-[#0A432B] hover:from-[#0B442D] hover:via-[#11563A] hover:to-[#073622] text-white text-sm font-black tracking-wide shadow-xl shadow-emerald-950/25 border border-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order (৳{finalTotal})</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>

            {/* WhatsApp Assist */}
            <div className="text-center pt-1">
              <a
                href={getWhatsAppUrl(
                  settings,
                  `আসসালামু আলাইকুম, আমি নিউ ব্রাদার্স আচার বার থেকে সরাসরি WhatsApp-এ অর্ডার করতে চাই। কার্টের আইটেম: ${cart.map(i => `${i.product.name} (${i.selectedVariant.size} x ${i.quantity})`).join(', ')}। মোট: ৳${finalTotal}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার করতে ক্লিক করুন</span>
              </a>
            </div>

            <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
              <span>🛡️ No Advance Payment Required</span>
              <span>•</span>
              <span>📦 Safe Glass Jar Delivery Guaranteed</span>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
