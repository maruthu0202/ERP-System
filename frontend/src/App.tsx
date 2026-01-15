const React = require('react');

function App() {
  const [user, setUser] = React.useState(null);

  const login = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const users = {
      'admin': { username: 'admin', role: 'ADMIN' },
      'sales': { username: 'sales', role: 'SALES_EXECUTIVE' }
    };
    if (users[username]) {
      setUser(users[username]);
    } else {
      alert('Try: admin or sales');
    }
  };

  if (!user) {
    return (
      <div style={{padding: '50px', fontFamily: 'Arial'}}>
        <h1 style={{textAlign: 'center', color: '#1976d2'}}>
          🚀 ERP System - WORKING!
        </h1>
        <div style={{maxWidth: '400px', margin: '0 auto', padding: '40px', border: '1px solid #ddd', borderRadius: '8px'}}>
          <h2 style={{textAlign: 'center'}}>ERP Login ✅</h2>
          <form onSubmit={login} style={{display: 'flex', flexDirection: 'column'}}>
            <input
              name="username"
              placeholder="Username"
              style={{
                padding: '12px', 
                marginBottom: '20px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
            <button 
              type="submit" 
              style={{
                padding: '12px', 
                backgroundColor: '#1976d2', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666'}}>
              Try: admin | sales
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: '50px', fontFamily: 'Arial'}}>
      <div style={{
        backgroundColor: '#1976d2', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1>🚀 ERP Dashboard LIVE!</h1>
        <p>Welcome {user.username.toUpperCase()} ({user.role})</p>
      </div>
      <div style={{
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '40px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{color: '#1976d2'}}>🎉 SUCCESS!</h2>
        <div style={{margin: '20px 0'}}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            marginRight: '10px',
            marginBottom: '10px'
          }}>
            ✅ Frontend 100% Working
          </span>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '10px'
          }}>
            ✅ Ready for CRUD APIs
          </span>
        </div>
        <button 
          onClick={() => setUser(null)}
          style={{
            padding: '12px 24px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

module.exports = App;
