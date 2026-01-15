const React = require('react');
const { createRoot } = require('react-dom/client');

function App() {
  const [user, setUser] = React.useState(null);
  const [tab, setTab] = React.useState('login');
  const [data, setData] = React.useState({
    products: [], customers: [], suppliers: [], sales: [], purchases: [], grns: [], invoices: [],
    dashboard: { sales: 0, purchases: 0, lowStock: 0 }
  });
  const [formData, setFormData] = React.useState({});

  const users = {
    admin: { id: 1, username: 'admin', password: 'admin', role: 'ADMIN' },
    sales: { id: 2, username: 'sales', password: 'admin', role: 'SALES_EXECUTIVE' },
    purchase: { id: 3, username: 'purchase', password: 'admin', role: 'PURCHASE_MANAGER' },
    inventory: { id: 4, username: 'inventory', password: 'admin', role: 'INVENTORY_MANAGER' },
    accountant: { id: 5, username: 'accountant', password: 'admin', role: 'ACCOUNTANT' }
  };

  const permissions = {
    ADMIN: ['dashboard', 'products', 'customers', 'suppliers', 'sales', 'purchase', 'grn', 'invoices', 'reports'],
    SALES_EXECUTIVE: ['dashboard', 'customers', 'sales', 'invoices'],
    PURCHASE_MANAGER: ['dashboard', 'suppliers', 'purchase', 'grn'],
    INVENTORY_MANAGER: ['dashboard', 'products', 'grn'],
    ACCOUNTANT: ['dashboard', 'invoices', 'reports']
  };

  const login = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (users[username] && users[username].password === password) {
      setUser(users[username]);
      setTab('dashboard');
    } else alert('Invalid credentials!');
  };

  const apiCall = async (endpoint, method = 'GET', body) => {
    try {
      const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch { return []; }
  };

  const refreshAll = async () => {
    const [products, customers, suppliers, sales, purchases, grns, invoices] = await Promise.all([
      apiCall('products'), apiCall('customers'), apiCall('suppliers'),
      apiCall('sales-orders'), apiCall('purchase-orders'), apiCall('grns'), apiCall('invoices')
    ]);
    setData({ products, customers, suppliers, sales, purchases, grns, invoices });
  };

  const logout = () => {
    setUser(null); setTab('login');
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const submitOrderForm = async (endpoint) => {
    try {
      await apiCall(endpoint, 'POST', formData);
      refreshAll();
      setFormData({});
      alert('✅ Created successfully!');
    } catch(e) {
      alert('❌ Error creating order');
    }
  };

  if (tab === 'login') {
    return React.createElement('div', { style: loginStyle },
      React.createElement('div', { style: loginCard },
        React.createElement('h1', { style: logo }, '🚀 ENTERPRISE ERP'),
        React.createElement('form', { onSubmit: login, style: formStyle },
          React.createElement('div', { style: inputGroup },
            React.createElement('label', { style: labelStyle }, 'Username'),
            React.createElement('input', { name: 'username', style: input })
          ),
          React.createElement('div', { style: inputGroup },
            React.createElement('label', { style: labelStyle }, 'Password'),
            React.createElement('input', { name: 'password', type: 'password', style: input })
          ),
          React.createElement('button', { type: 'submit', style: btnPrimary }, 'LOGIN'),
          React.createElement('div', { style: helpText }, 'admin/admin | sales/admin | purchase/admin')
        )
      )
    );
  }

  const rolePerms = permissions[user.role] || [];
  return React.createElement('div', { style: appLayout },
    React.createElement('header', { style: headerStyle },
      React.createElement('div', null,
        React.createElement('h2', {}, 'ERP Dashboard'),
        React.createElement('span', { style: breadcrumb }, tab.replace(/([A-Z])/g, ' $1'))
      ),
      React.createElement('div', { style: headerRight },
        React.createElement('span', {}, `${user.username.toUpperCase()} | ${user.role}`),
        React.createElement('button', { onClick: logout, style: btnDanger }, 'LOGOUT')
      )
    ),
    React.createElement('div', { style: mainLayout },
      React.createElement('nav', { style: sidebarStyle },
        rolePerms.map(t => React.createElement('button', {
          key: t, onClick: () => { setTab(t); refreshAll(); },
          style: tab === t ? navActive : navItem
        }, getIcon(t), t.charAt(0).toUpperCase() + t.slice(1)))
      ),
      React.createElement('main', { style: contentStyle }, renderTab())
    )
  );

  function renderTab() {
    const tabs = {
      dashboard: renderDashboard, products: renderProducts, customers: renderCustomers,
      suppliers: renderSuppliers, sales: renderSales, purchase: renderPurchase,
      grn: renderGRN, invoices: renderInvoices, reports: renderReports
    };
    return tabs[tab]?.() || renderDashboard();
  }

  function renderDashboard() {
    refreshAll();
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Dashboard'),
      React.createElement('div', { style: statsGrid },
        statCard('📦 Products', data.products.length || 0, '#3b82f6'),
        statCard('👥 Customers', data.customers.length || 0, '#10b981'),
        statCard('🏭 Suppliers', data.suppliers.length || 0, '#f59e0b'),
        statCard('🛒 Sales Orders', data.sales.length || 0, '#8b5cf6'),
        statCard('💰 Invoices', data.invoices.length || 0, '#ef4444'),
        statCard('⚠️ Low Stock', data.products.filter(p => p.currentStock <= (p.reorderLevel || 10)).length || 0, '#f97316')
      )
    );
  }

  function renderProducts() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Products'),
      crudForm('products', [
        'Product Name', 'SKU', 'Category', 'Unit Price (₹)', 'Current Stock', 'Reorder Level'
      ], ['name', 'sku', 'category', 'unitPrice', 'currentStock', 'reorderLevel']),
      dataTable(data.products, 'products', ['name', 'sku', 'category', `₹${d=>d.unitPrice}`, 'currentStock', 'reorderLevel'], 'products')
    );
  }

  function renderCustomers() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Customers'),
      crudForm('customers', [
        'Customer Name', 'Email', 'Phone', 'Address', 'GSTIN'
      ], ['name', 'email', 'phone', 'address', 'gstin']),
      dataTable(data.customers, 'customers', ['name', 'email', 'phone', 'address', 'gstin'], 'customers')
    );
  }

  function renderSuppliers() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Suppliers'),
      crudForm('suppliers', [
        'Supplier Name', 'Email', 'Phone', 'Address', 'GSTIN'
      ], ['name', 'email', 'phone', 'address', 'gstin']),
      dataTable(data.suppliers, 'suppliers', ['name', 'email', 'phone', 'address', 'gstin'], 'suppliers')
    );
  }

  function renderSales() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Sales Orders'),
      simpleOrderForm('sales-orders', 'Customer', data.customers, 'sales'),
      dataTable(data.sales, 'sales-orders', ['customer', 'items', 'status', 'total', 'date'], 'sales-orders')
    );
  }

  function renderPurchase() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Purchase Orders'),
      simpleOrderForm('purchase-orders', 'Supplier', data.suppliers, 'purchase'),
      dataTable(data.purchases, 'purchase-orders', ['supplier', 'items', 'status', 'date'], 'purchase-orders')
    );
  }

  function renderGRN() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Goods Receipt Note'),
      simpleGRNForm(),
      dataTable(data.grns, 'grns', ['purchaseOrder', 'items', 'receivedDate'], 'grns')
    );
  }

  function renderInvoices() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Invoices'),
      dataTable(data.invoices, 'invoices', ['customer', 'amount', 'status', 'salesOrder', 'date'], 'invoices')
    );
  }

  function renderReports() {
    return React.createElement('div', null,
      React.createElement('h1', { style: pageTitle }, 'Reports'),
      React.createElement('div', { style: statsGrid },
        fakeChart('Sales Trend', '#3b82f6'),
        fakeChart('Stock Levels', '#10b981'),
        fakeChart('Revenue', '#ef4444')
      )
    );
  }

  // ✅ PERFECT SIMPLE FORMS - NO JSON!
  function crudForm(endpoint, labels, fields) {
    return React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: cardTitle }, 'Add New Record'),
      React.createElement('form', { onSubmit: async e => {
        e.preventDefault();
        await apiCall(endpoint, 'POST', Object.fromEntries(new FormData(e.target)));
        refreshAll();
        e.target.reset();
      }},
        React.createElement('div', { style: formGrid },
          labels.map((label, i) =>
            React.createElement('div', { key: i, style: inputGroup },
              React.createElement('label', { style: labelStyle }, label),
              React.createElement('input', {
                name: fields[i],
                style: input,
                type: fields[i].includes('email') ? 'email' : fields[i].includes('Price') ? 'number' : 'text',
                placeholder: `Enter ${label.toLowerCase()}`
              })
            )
          )
        ),
        React.createElement('button', { type: 'submit', style: btnSuccess }, '➕ Add Record')
      )
    );
  }

  // ✅ NO JSON - SIMPLE DROPDOWNS + NUMBERS
  function simpleOrderForm(endpoint, entityType, entities, formType) {
    return React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: cardTitle }, `New ${formType === 'sales' ? 'Sales' : 'Purchase'} Order`),
      React.createElement('div', { style: formGrid },
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, `${entityType} *`),
          React.createElement('select', {
            value: formData[`${formType}Id`] || '',
            onChange: e => updateFormData(`${formType}Id`, parseInt(e.target.value)),
            style: selectStyle,
            required: true
          },
            React.createElement('option', { value: '' }, `Select ${entityType}`),
            entities.map(item => React.createElement('option', { key: item.id, value: item.id }, item.name))
          )
        ),
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Product *'),
          React.createElement('select', {
            value: formData.productId || '',
            onChange: e => updateFormData('productId', parseInt(e.target.value)),
            style: selectStyle,
            required: true
          },
            React.createElement('option', { value: '' }, 'Select Product'),
            data.products.map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))
          )
        ),
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Quantity *'),
          React.createElement('input', {
            type: 'number',
            value: formData.qty || '',
            onChange: e => updateFormData('qty', parseInt(e.target.value)),
            style: input,
            min: 1,
            placeholder: 'Enter quantity',
            required: true
          })
        ),
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Total Amount (₹)'),
          React.createElement('input', {
            type: 'number',
            value: formData.totalAmount || '',
            onChange: e => updateFormData('totalAmount', parseFloat(e.target.value)),
            style: input,
            placeholder: 'Enter total',
            min: 0
          })
        )
      ),
      React.createElement('button', {
        onClick: () => submitOrderForm(endpoint),
        style: btnSuccess,
        disabled: !formData[`${formType}Id`] || !formData.productId || !formData.qty
      }, `🛒 Create ${formType === 'sales' ? 'Sales' : 'Purchase'} Order`)
    );
  }

  function simpleGRNForm() {
    return React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: cardTitle }, 'Goods Receipt Note (GRN)'),
      React.createElement('div', { style: formGrid },
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Purchase Order *'),
          React.createElement('select', {
            value: formData.purchaseOrderId || '',
            onChange: e => updateFormData('purchaseOrderId', parseInt(e.target.value)),
            style: selectStyle,
            required: true
          },
            React.createElement('option', { value: '' }, 'Select Purchase Order'),
            data.purchases.map(po => React.createElement('option', { key: po.id, value: po.id }, `PO-${po.id}`))
          )
        ),
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Product *'),
          React.createElement('select', {
            value: formData.productId || '',
            onChange: e => updateFormData('productId', parseInt(e.target.value)),
            style: selectStyle,
            required: true
          },
            React.createElement('option', { value: '' }, 'Select Product'),
            data.products.map(p => React.createElement('option', { key: p.id, value: p.id }, p.name))
          )
        ),
        React.createElement('div', { style: inputGroup },
          React.createElement('label', { style: labelStyle }, 'Received Quantity *'),
          React.createElement('input', {
            type: 'number',
            value: formData.received || '',
            onChange: e => updateFormData('received', parseInt(e.target.value)),
            style: input,
            min: 1,
            placeholder: 'Enter received qty',
            required: true
          })
        )
      ),
      React.createElement('button', {
        onClick: () => submitOrderForm('grns'),
        style: btnSuccess,
        disabled: !formData.purchaseOrderId || !formData.productId || !formData.received
      }, '✅ Receive Goods & Update Stock')
    );
  }

  function dataTable(items, endpoint, cols, type) {
    return React.createElement('div', { style: cardStyle },
      React.createElement('h3', { style: cardTitle }, `${cols[0]} List`),
      items.length === 0 ?
        React.createElement('div', { style: emptyState }, 'No records. Add above!') :
        React.createElement('div', { style: tableContainer },
          items.map(item =>
            React.createElement('div', { key: item.id, style: tableRow },
              cols.slice(0, -1).map((col, i) => 
                React.createElement('div', { key: i, style: tableCell },
                  typeof col === 'string' ? item[col] || '-' : col(item)
                )
              ),
              React.createElement('button', {
                onClick: () => window.confirm('Delete?') && apiCall(type || endpoint, 'DELETE', item.id),
                style: btnDangerSmall
              }, '🗑️')
            )
          )
        )
    );
  }

  function statCard(title, value, color) {
    return React.createElement('div', { style: statCardStyle(color) },
      React.createElement('div', { style: statIconStyle }, getIcon(title.toLowerCase())),
      React.createElement('h3', { style: statTitle }, title),
      React.createElement('div', { style: statValue }, value)
    );
  }

  function fakeChart(title, color) {
    return React.createElement('div', { style: chartStyle(color) },
      React.createElement('h4', {}, title),
      React.createElement('div', { style: fakeBars }, '📈 [Chart Data]')
    );
  }

  function getIcon(name) {
    const icons = {
      dashboard: '📊', products: '📦', customers: '👥', suppliers: '🏭', sales: '🛒',
      purchase: '🛒', grn: '✅', invoices: '💰', reports: '📈'
    };
    return React.createElement('span', { style: iconStyle }, icons[name] || '📋');
  }
}

// PRODUCTION STYLES
const loginStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui, sans-serif' };
const loginCard = { background: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: '420px' };
const logo = { textAlign: 'center', fontSize: '36px', fontWeight: '800', color: '#1f2937', marginBottom: '32px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '24px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#374151' };
const input = { padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', transition: 'all 0.2s', backgroundColor: 'white' };
const selectStyle = { ...input, padding: '16px' };
const btnPrimary = { padding: '16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' };
const helpText = { textAlign: 'center', color: '#6b7280', fontSize: '14px' };

const appLayout = { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const headerStyle = { background: 'white', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 };
const breadcrumb = { color: '#6b7280', fontSize: '14px' };
const headerRight = { display: 'flex', alignItems: 'center', gap: '20px' };
const btnDanger = { padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

const mainLayout = { display: 'flex', minHeight: 'calc(100vh - 90px)' };
const sidebarStyle = { width: '300px', background: 'white', boxShadow: '4px 0 20px rgba(0,0,0,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' };
const navItem = { padding: '20px', border: 'none', borderRadius: '16px', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '16px', fontWeight: '500', transition: 'all 0.3s', color: '#64748b' };
const navActive = { ...navItem, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)' };
const iconStyle = { fontSize: '24px', minWidth: '32px' };

const contentStyle = { flex: 1, padding: '40px', overflowY: 'auto' };
const pageTitle = { fontSize: '40px', fontWeight: '800', color: '#1f2937', marginBottom: '40px' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px' };
const statCardStyle = (color) => ({ background: `linear-gradient(135deg, ${color}20, ${color}10)`, padding: '40px', borderRadius: '24px', textAlign: 'center', border: `1px solid ${color}40`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' });
const statIconStyle = { fontSize: '48px', marginBottom: '24px' };
const statTitle = { fontSize: '18px', color: '#64748b', marginBottom: '16px' };
const statValue = { fontSize: '48px', fontWeight: '800', color: '#1f2937' };

const cardStyle = { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', marginBottom: '32px', border: '1px solid #f1f5f9' };
const cardTitle = { fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' };
const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' };
const btnSuccess = { width: '100%', padding: '20px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' };
const tableContainer = { maxHeight: '500px', overflowY: 'auto', borderRadius: '16px' };
const tableRow = { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr', gap: '24px', padding: '24px', background: '#f8fafc', borderRadius: '16px', marginBottom: '16px', alignItems: 'center' };
const tableCell = { fontSize: '16px', color: '#374151' };
const btnDangerSmall = { padding: '12px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const emptyState = { padding: '80px 40px', textAlign: 'center', color: '#9ca3af', fontSize: '20px' };
const chartStyle = (color) => ({ ...cardStyle, background: `${color}10`, textAlign: 'center' });
const fakeBars = { height: '200px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', marginTop: '20px', fontSize: '24px' };

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(App));
}
