import {BrowserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom';
import './App.css';

import DirectMethods from './pages/DirectMethods';
import InterativeMethods from './pages/IntereativeMethods';
import InterpolationMethods from './pages/InterpolationMethods';
import NumericalIntegration from './pages/NumericalIntegration';

// Componente para destacar o link ativo
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  );
};

// Página inicial melhorada
const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">
          🧮 Calculadora de Métodos Numéricos
        </h1>
        <p className="home-subtitle">
          Ferramenta completa para resolução de problemas numéricos em cálculo numérico
        </p>
      </div>

      <div className="topics-grid">
        <NavLink to="/diretos">
          <div className="card topic-card">
            <div className="topic-icon">📊</div>
            <h3 className="topic-title">Tópico 1</h3>
            <p className="topic-subtitle">Métodos Diretos</p>
            <p className="topic-description">
              Gauss, LU, Gauss-Jordan
            </p>
          </div>
        </NavLink>

        <NavLink to="/iterativos">
          <div className="card topic-card">
            <div className="topic-icon">🔄</div>
            <h3 className="topic-title">Tópico 2</h3>
            <p className="topic-subtitle">Métodos Iterativos</p>
            <p className="topic-description">
              Gauss-Seidel
            </p>
          </div>
        </NavLink>

        <NavLink to="/interpolacao">
          <div className="card topic-card">
            <div className="topic-icon">📈</div>
            <h3 className="topic-title">Tópico 3</h3>
            <p className="topic-subtitle">Interpolação</p>
            <p className="topic-description">
              Lagrange, Newton, Mínimos Quadrados
            </p>
          </div>
        </NavLink>

        <NavLink to="/integracao">
          <div className="card topic-card">
            <div className="topic-icon">∫</div>
            <h3 className="topic-title">Tópico 4</h3>
            <p className="topic-subtitle">Integração Numérica</p>
            <p className="topic-description">
              Trapézio, Simpson
            </p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

function App(){
  return(
    <Router>
      <div className="app-container">
        <header className='App-header'>
          <h1 className="header-title">Calculadora de Métodos Numéricos</h1>
          <nav className="nav-bar">
            <NavLink to="/">Início</NavLink>
            <NavLink to="/diretos">Tópico 1</NavLink>
            <NavLink to="/iterativos">Tópico 2</NavLink>
            <NavLink to="/interpolacao">Tópico 3</NavLink>
            <NavLink to="/integracao">Tópico 4</NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/diretos" element={<DirectMethods/>}/>
            <Route path="/iterativos" element={<InterativeMethods/>}/>
            <Route path="/interpolacao" element={<InterpolationMethods/>}/>
            <Route path="/integracao" element={<NumericalIntegration/>}/>

            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h2 style={{ color: 'var(--error-color)', fontSize: '2em', marginBottom: '20px' }}>404</h2>
                <p style={{ color: 'var(--text-medium)', fontSize: '1.2em' }}>Página Não Encontrada</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                  Voltar ao Início
                </Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;