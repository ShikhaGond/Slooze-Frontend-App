import React, { useState, useEffect, createContext, useContext } from 'react';
import { LayoutDashboard, Package, LogOut, Sun, Moon, Plus, Edit2, Trash2, X } from 'lucide-react';

// Theme Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// Auth Context
const AuthContext = createContext(null);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Theme colors
const themes = {
  light: {
    bg: '#f3f4f6',
    bgCard: '#ffffff',
    bgHover: '#f9fafb',
    bgInput: '#ffffff',
    text: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    gradient: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)'
  },
  dark: {
    bg: '#111827',
    bgCard: '#1f2937',
    bgHover: '#374151',
    bgInput: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#374151',
    gradient: 'linear-gradient(to bottom right, #111827, #1e1b4b)'
  }
};

// Mock API
const mockAPI = {
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 500));
    const users = {
      'manager@company.com': { id: 1, name: 'John Manager', role: 'Manager', email: 'manager@company.com' },
      'keeper@company.com': { id: 2, name: 'Jane Keeper', role: 'Store Keeper', email: 'keeper@company.com' }
    };
    if (users[email] && password === 'password123') return { success: true, user: users[email] };
    return { success: false, error: 'Invalid credentials' };
  },
  getProducts: async () => {
    await new Promise(r => setTimeout(r, 300));
    return [
      { id: 1, name: 'Coffee Beans', category: 'Beverages', quantity: 150, price: 12.99, supplier: 'Bean Co.' },
      { id: 2, name: 'Rice', category: 'Grains', quantity: 500, price: 8.50, supplier: 'Farm Fresh' },
      { id: 3, name: 'Olive Oil', category: 'Oils', quantity: 75, price: 15.99, supplier: 'Mediterranean Ltd' },
      { id: 4, name: 'Sugar', category: 'Sweeteners', quantity: 200, price: 5.99, supplier: 'Sweet Corp' },
      { id: 5, name: 'Wheat Flour', category: 'Grains', quantity: 300, price: 7.49, supplier: 'Mill Masters' }
    ];
  },
  getDashboardStats: async () => {
    await new Promise(r => setTimeout(r, 300));
    return { totalProducts: 5, totalValue: 12450.50, lowStock: 2, categories: 4 };
  }
};

// Auth Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cms_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await mockAPI.login(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('cms_user', JSON.stringify(result.user));
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const t = themes[theme];

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <div style={{ minHeight: '100vh', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: t.bgCard, borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '32px', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Package style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#6366f1' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: t.text }}>Commodities System</h1>
          <p style={{ color: t.textMuted, marginTop: '8px' }}>Sign in to your account</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: t.textSecondary, marginBottom: '8px' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 16px', border: `1px solid ${t.border}`, borderRadius: '8px', background: t.bgInput, color: t.text, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: t.textSecondary, marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 16px', border: `1px solid ${t.border}`, borderRadius: '8px', background: t.bgInput, color: t.text, boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: t.bgHover, borderRadius: '8px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: t.textSecondary, marginBottom: '8px' }}>Demo Credentials:</p>
          <p style={{ fontSize: '0.75rem', color: t.textMuted }}>Manager: manager@company.com</p>
          <p style={{ fontSize: '0.75rem', color: t.textMuted }}>Store Keeper: keeper@company.com</p>
          <p style={{ fontSize: '0.75rem', color: t.textMuted, marginTop: '4px' }}>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [stats, setStats] = useState(null);
  const { theme } = useTheme();
  const t = themes[theme];

  useEffect(() => { mockAPI.getDashboardStats().then(setStats); }, []);

  if (!stats) return <div style={{ padding: '32px', textAlign: 'center', color: t.text }}>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, color: '#6366f1' },
    { label: 'Total Value', value: `$${stats.totalValue.toFixed(2)}`, color: '#22c55e' },
    { label: 'Low Stock Items', value: stats.lowStock, color: '#f97316' },
    { label: 'Categories', value: stats.categories, color: '#a855f7' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: t.text }}>Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: t.bgCard, padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: t.textMuted }}>{s.label}</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: s.color, marginTop: '8px' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: t.bgCard, padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: t.text, marginBottom: '16px' }}>Recent Activity</h3>
        {['Coffee Beans stock updated - 2 hours ago', 'New supplier added - 5 hours ago', 'Olive Oil price updated - 1 day ago'].map((item, i) => (
          <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? `1px solid ${t.border}` : 'none', color: t.textSecondary, fontSize: '0.875rem' }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

// Product Modal
function ProductModal({ product, onClose, onSave }) {
  const { theme } = useTheme();
  const t = themes[theme];
  const [formData, setFormData] = useState(product || { name: '', category: '', quantity: '', price: '', supplier: '' });

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.price || !formData.supplier) {
      alert('Please fill in all fields'); return;
    }
    onSave(formData);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: `1px solid ${t.border}`, borderRadius: '8px', background: t.bgInput, color: t.text, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: t.textSecondary, marginBottom: '4px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
      <div style={{ background: t.bgCard, borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxWidth: '28rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${t.border}` }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: t.text }}>{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted }}><X size={24} /></button>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['name', 'category', 'quantity', 'price', 'supplier'].map(field => (
            <div key={field}>
              <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type={field === 'quantity' || field === 'price' ? 'number' : 'text'} value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', border: `1px solid ${t.border}`, borderRadius: '8px', background: 'transparent', color: t.textSecondary, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#4f46e5', color: 'white', cursor: 'pointer' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Component
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { theme } = useTheme();
  const t = themes[theme];

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => { setLoading(true); setProducts(await mockAPI.getProducts()); setLoading(false); };
  const handleAddEdit = () => { setShowModal(false); setEditingProduct(null); loadProducts(); };
  const handleEdit = (p) => { setEditingProduct(p); setShowModal(true); };
  const handleDelete = (id) => { if (confirm('Delete this product?')) setProducts(products.filter(p => p.id !== id)); };

  if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: t.text }}>Loading products...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: t.text }}>Products Inventory</h2>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div style={{ background: t.bgCard, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: t.bgHover }}>
            <tr>
              {['Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: t.textMuted, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${t.border}` }}>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: t.text }}>{p.name}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: t.textSecondary }}>{p.category}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: t.textSecondary }}>{p.quantity}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: t.textSecondary }}>${p.price}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: t.textSecondary }}>{p.supplier}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <ProductModal product={editingProduct} onClose={() => { setShowModal(false); setEditingProduct(null); }} onSave={handleAddEdit} />}
    </div>
  );
}

// Main App Component
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, logout, loading } = useAuth();
  const theme = darkMode ? 'dark' : 'light';
  const t = themes[theme];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!user) return <ThemeContext.Provider value={{ theme, toggleDarkMode }}><Login /></ThemeContext.Provider>;

  const canViewDashboard = user.role === 'Manager';
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Manager'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['Manager', 'Store Keeper'] }
  ];

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode }}>
      <div style={{ minHeight: '100vh', background: t.bg, transition: 'background 0.3s' }}>
        {/* Header */}
        <header style={{ background: t.bgCard, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Package style={{ width: '32px', height: '32px', color: '#6366f1' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: t.text }}>Commodities System</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: t.text }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: t.textMuted }}>{user.role}</div>
              </div>
              <button onClick={toggleDarkMode} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: t.textSecondary }}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#dc2626', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '32px' }}>
          {/* Sidebar */}
          <aside style={{ width: '256px', flexShrink: 0 }}>
            <nav style={{ background: t.bgCard, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map(item => {
                const Icon = item.icon;
                const hasAccess = item.roles.includes(user.role);
                const isActive = currentView === item.id;
                return (
                  <button key={item.id} onClick={() => hasAccess && setCurrentView(item.id)} disabled={!hasAccess}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: hasAccess ? 'pointer' : 'not-allowed',
                      background: isActive ? '#4f46e5' : 'transparent', color: isActive ? 'white' : hasAccess ? t.textSecondary : t.textMuted, opacity: hasAccess ? 1 : 0.5 }}>
                    <Icon size={20} />
                    <span style={{ fontWeight: '500' }}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            {currentView === 'dashboard' && canViewDashboard && <Dashboard />}
            {currentView === 'dashboard' && !canViewDashboard && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '8px' }}>You don't have permission to access the dashboard.</div>
            )}
            {currentView === 'products' && <Products />}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// Root Component
export default function CommoditiesManagementSystem() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}