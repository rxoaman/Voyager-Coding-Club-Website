import React, { useRef, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MemberDetailPage from './pages/MemberDetailPage';
import NotFound from './pages/NotFound';
import { Terminal, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Voyager Portal Runtime Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0D1524] border border-red-500/40 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">TELEMETRY SYSTEM REBOOT REQUIRED</h2>
            <p className="font-mono text-xs text-red-400 mb-4 bg-red-950/40 p-3 rounded-lg border border-red-900/50 text-left overflow-x-auto">
              {this.state.error?.message || 'An unexpected runtime state occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00FF88] text-black font-mono font-bold text-xs hover:brightness-110 transition-all shadow-glow-green"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RESTART TELEMETRY</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const navLogoTargetRef = useRef(null);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col justify-between selection:bg-[#00FF88] selection:text-black">
          {/* Fixed Navbar with Flight Target Container */}
          <Navbar navLogoTargetRef={navLogoTargetRef} />

          {/* Dynamic Route View */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home navLogoTargetRef={navLogoTargetRef} />} />
              <Route path="/team/:id" element={<MemberDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
