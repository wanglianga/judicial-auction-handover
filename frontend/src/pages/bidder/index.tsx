import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import BidderDashboard from './BidderDashboard';

const menuItems = [
  { label: '工作台', path: '/bidder', icon: '🏠' },
  { label: '拍卖大厅', path: '/bidder/auctions', icon: '🏛️' },
  { label: '我的竞拍', path: '/bidder/my-bids', icon: '📋' },
  { label: '保证金', path: '/bidder/deposits', icon: '💰' },
  { label: '我的贷款', path: '/bidder/loans', icon: '🏦' },
];

export default function BidderModule() {
  return (
    <Layout role="bidder" menuItems={menuItems}>
      <Routes>
        <Route index element={<BidderDashboard />} />
        <Route path="auctions" element={<BidderDashboard />} />
        <Route path="my-bids" element={<BidderDashboard />} />
        <Route path="deposits" element={<BidderDashboard />} />
        <Route path="loans" element={<BidderDashboard />} />
        <Route path="*" element={<Navigate to="/bidder" replace />} />
      </Routes>
    </Layout>
  );
}
