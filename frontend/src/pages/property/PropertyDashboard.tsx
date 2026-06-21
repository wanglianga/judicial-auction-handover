import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi } from '../../services/api';
import type { Auction } from '../../types';
import { formatCurrency } from '../../utils';
import { Building2, CheckCircle, Clock, Plus, Edit } from 'lucide-react';
import Modal from '../../components/Modal';
import PropertyInfoForm from '../../components/PropertyInfoForm';

export default function PropertyDashboard() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await auctionApi.getAll();
      setAuctions(data);
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = auctions.filter((a) => !a.propertyArrears).length;
  const completedCount = auctions.filter((a) => a.propertyArrears).length;
  const totalArrears = auctions.reduce(
    (sum, a) => sum + (a.propertyArrears?.propertyFeeArrears || 0),
    0
  );

  const handleOpenForm = (auction: Auction, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAuction(auction);
    setModalOpen(true);
  };

  const handleCardClick = (auction: Auction, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    navigate(`/auction/${auction.id}`);
  };

  const handleSaveSuccess = () => {
    setModalOpen(false);
    setSelectedAuction(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">待录入标的</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已录入标的</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">物业欠费总额</span>
            <Building2 size={20} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalArrears)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">物业信息管理</h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : auctions.length > 0 ? (
            <div className="space-y-3">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  onClick={(e) => handleCardClick(auction, e)}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {auction.propertyArrears ? (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                          已录入
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                          待录入
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{auction.caseNumber}</span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">{auction.title}</h3>
                  <div className="text-sm text-gray-500 mb-3">📍 {auction.propertyInfo.address}</div>

                  {auction.propertyArrears ? (
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">物业费欠费：</span>
                        <span className="text-red-500 font-medium">
                          {formatCurrency(auction.propertyArrears.propertyFeeArrears)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleOpenForm(auction, e)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit size={14} />
                        修改
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => handleOpenForm(auction, e)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Plus size={16} />
                        录入物业信息
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">暂无待处理标的</div>
          )}
        </div>
      </div>

      {selectedAuction && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedAuction.propertyArrears ? '修改物业信息' : '录入物业信息'}
          size="lg"
        >
          <PropertyInfoForm
            auctionId={selectedAuction.id}
            auctionTitle={selectedAuction.title}
            initialData={selectedAuction.propertyArrears}
            onSuccess={handleSaveSuccess}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
