import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import CourtModule from './pages/court';
import BidderModule from './pages/bidder';
import EvaluationModule from './pages/evaluation';
import PropertyModule from './pages/property';
import BankModule from './pages/bank';
import TaxModule from './pages/tax';
import EvictionModule from './pages/eviction';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auction/:id" element={<AuctionDetailPage />} />
        <Route path="/court/*" element={<CourtModule />} />
        <Route path="/bidder/*" element={<BidderModule />} />
        <Route path="/evaluation/*" element={<EvaluationModule />} />
        <Route path="/property/*" element={<PropertyModule />} />
        <Route path="/bank/*" element={<BankModule />} />
        <Route path="/tax/*" element={<TaxModule />} />
        <Route path="/eviction/*" element={<EvictionModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
