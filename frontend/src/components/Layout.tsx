import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/search', label: '搜索', icon: '🔍' },
  { path: '/me', label: '我的', icon: '👤' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Campus Hub</span>
        </Link>
        <nav className="app-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>Campus Hub V1 MVP</p>
      </footer>
    </div>
  );
}
