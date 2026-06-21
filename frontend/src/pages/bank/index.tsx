import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import BankDashboard from './BankDashboard';

const menuItems = [
  { label: '工作台', path: '/bank', icon: '🏠' },
  { label: '待审批', path: '/bank/pending', icon: '⏳' },
  { label: '已审批', path: '/bank/approved', icon: '✅' },
  { label: '放款管理', path: '/bank/disbursed', icon: '💵' },
  { label: '统计报表', path: '/bank/statistics', icon: '📊' },
];

export default function BankModule() {
  return (
    <Layout role="bank" menuItems={menuItems}>
      <Routes>
        <Route index element={<BankDashboard />} />
        <Route path="pending" element={<BankDashboard />} />
        <Route path="approved" element={<BankDashboard />} />
        <Route path="disbursed" element={<BankDashboard />} />
        <Route path="statistics" element={<BankDashboard />} />
        <Route path="*" element={<Navigate to="/bank" replace />} />
      </Routes>
    </Layout>
  );
}
