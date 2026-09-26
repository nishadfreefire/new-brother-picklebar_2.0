import React, { useState, useEffect } from 'react';
import { 
  X, Lock, LayoutDashboard, Package, ShoppingCart, 
  Tag, Settings, RefreshCw, TrendingUp, Eye, Search, Truck,
  Star, LogOut, Youtube, Image, ChevronRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { extractYouTubeId } from '../utils/youtube';
import { useStore } from '../context/StoreContext';
import { Order, StoreSettings } from '../types';

type TabType = 'dashboard' | 'products' | 'orders' | 'coupons' | 'slider' | 'settings';

export const AdminDashboard: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    settings,
    updateSettings,
    coupons
  } = useStore();

  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [settingsForm, setSettingsForm] = useState<Partial<StoreSettings>>({});

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error);
      fetch('/api/orders').then(r => r.json()).then(setAllOrders).catch(console.error);
      setSettingsForm(settings || {});
    }
  }, [isAuthenticated, settings]);

  const handleLogin = () => {
    if (pinInput === (settings?.adminPin || '1234')) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Wrong PIN!');
    }
    setPinInput('');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your PIN</p>
          </div>

          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter PIN"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-2 text-center text-xl"
            autoFocus
          />
          
          {pinError && <p className="text-red-500 text-sm mb-4">{pinError}</p>}
          
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-2"
          >
            Login
          </button>

          {!isStandalonePage && (
            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className={`${isStandalonePage ? 'min-h-screen' : 'fixed inset-0 z-50'} bg-gray-50 flex`}>
      {/* Sidebar */}
      <div className="w-64 bg-green-900 flex flex-col">
        <div className="p-6 border-b border-green-800">
          <h2 className="text-white font-bold text-xl">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'slider', label: 'Slider', icon: Image },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item: any) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? 'bg-yellow-500 text-white' : 'text-green-100 hover:bg-green-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-800">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              if (!isStandalonePage) setIsAdminOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b px-6 py-4">
          <h1 className="text-2xl font-bold">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Products'}
            {activeTab === 'orders' && 'Orders'}
            {activeTab === 'coupons' && 'Coupons'}
            {activeTab === 'slider' && 'Slider Settings'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {stats && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-500 text-white rounded-xl p-6">
                    <ShoppingCart className="w-8 h-8 mb-4" />
                    <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
                    <p className="text-blue-100">Total Orders</p>
                  </div>
                  <div className="bg-green-500 text-white rounded-xl p-6">
                    <TrendingUp className="w-8 h-8 mb-4" />
                    <p className="text-3xl font-bold">৳{stats.totalRevenue || 0}</p>
                    <p className="text-green-100">Revenue</p>
                  </div>
                  <div className="bg-purple-500 text-white rounded-xl p-6">
                    <Package className="w-8 h-8 mb-4" />
                    <p className="text-3xl font-bold">{products.length}</p>
                    <p className="text-purple-100">Products</p>
                  </div>
                  <div className="bg-orange-500 text-white rounded-xl p-6">
                    <Clock className="w-8 h-8 mb-4" />
                    <p className="text-3xl font-bold">{stats.pendingOrders || 0}</p>
                    <p className="text-orange-100">Pending</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
                {allOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex justify-between p-4 bg-gray-50 rounded-lg mb-2">
                    <div>
                      <p className="font-bold">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className="text-lg font-bold">৳{order.totalAmount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Products Management Coming Soon</p>
              <p className="text-gray-500">Total: {products.length} products</p>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Orders Management Coming Soon</p>
              <p className="text-gray-500">Total: {allOrders.length} orders</p>
            </div>
          )}

          {/* Coupons */}
          {activeTab === 'coupons' && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Coupons Management Coming Soon</p>
              <p className="text-gray-500">Total: {coupons.length} coupons</p>
            </div>
          )}

          {/* Slider */}
          {activeTab === 'slider' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-4">Slider Title</h3>
                <input
                  type="text"
                  value={settingsForm.sliderTitle || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sliderTitle: e.target.value })}
                  placeholder="Slider Title"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-4">Video URL</h3>
                <input
                  type="url"
                  value={settingsForm.craftVideoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, craftVideoUrl: e.target.value })}
                  placeholder="YouTube URL"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-4">Slider Images</h3>
                {[1, 2, 3].map(num => (
                  <div key={num} className="mb-4">
                    <label className="block font-semibold mb-2">Image {num}</label>
                    <input
                      type="url"
                      value={(settingsForm as any)[`sliderImage${num}Url`] || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, [`sliderImage${num}Url`]: e.target.value })}
                      placeholder={`Image ${num} URL`}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={async () => {
                  await updateSettings(settingsForm);
                  showToast('Saved!');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg"
              >
                Save Slider Settings
              </button>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-bold text-lg mb-4">Delivery Charges</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Inside Dhaka</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeInsideDhaka || 70}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Sub Dhaka</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeSubDhaka || 100}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeSubDhaka: Number(e.target.value) })}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Outside Dhaka</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeOutsideDhaka || 130}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  await updateSettings(settingsForm);
                  showToast('Saved!');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg"
              >
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
