import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from './styles/theme';
import { Navbar } from './components/common/Navbar';
import { Home, Experiment, Record, Report, Profile } from './pages';
import '@mantine/core/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
          <Navbar />
          <main style={{ paddingTop: '60px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiment/:id" element={<Experiment />} />
              <Route path="/record" element={<Record />} />
              <Route path="/report" element={<Report />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MantineProvider>
  );
}
