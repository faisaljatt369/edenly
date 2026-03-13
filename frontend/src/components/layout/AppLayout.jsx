import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout = ({ children, fullWidth = false }) => (
  <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{
      flex: 1,
      maxWidth: fullWidth ? '100%' : 1200,
      width: '100%',
      margin: '0 auto',
      padding: fullWidth ? 0 : 'var(--space-8) var(--space-6)',
    }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default AppLayout;
