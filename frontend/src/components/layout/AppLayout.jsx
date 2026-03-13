import Navbar from './Navbar';

const AppLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)' }}>
    <Navbar />
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      {children}
    </main>
  </div>
);

export default AppLayout;
