import type { Auction } from '../types';
import { statusMap, formatCurrency } from '../utils';
import { useNavigate } from 'react-router-dom';

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const navigate = useNavigate();
  const statusInfo = statusMap[auction.status];

  return (
    <div
      onClick={() => navigate(`/auction/${auction.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        <span className="text-xs text-gray-400">{auction.caseNumber}</span>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{auction.title}</h3>
      
      <div className="text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1 mb-1">
          <span>📍</span>
          <span className="truncate">{auction.propertyInfo.address}</span>
        </div>
        <div className="flex gap-4 text-xs">
          <span>🏠 {auction.propertyInfo.area}㎡</span>
          <span>📋 {auction.propertyInfo.houseType}</span>
        </div>
      </div>

      <div className="flex items-end justify-between pt-3 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-400">起拍价</div>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(auction.auctionNotice?.startPrice || 0)}
          </div>
        </div>
        {auction.transactionPrice && (
          <div className="text-right">
            <div className="text-xs text-gray-400">成交价</div>
            <div className="text-lg font-bold text-red-500">
              {formatCurrency(auction.transactionPrice)}
            </div>
          </div>
        )}
      </div>

      {auction.riskDisclosure && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {auction.riskDisclosure.leaseRisks.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded">有租约</span>
            )}
            {auction.householdInfo.hasOccupancy && (
              <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded">有占用</span>
            )}
            {auction.viewingRestriction.hasRestriction && (
              <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded">看样受限</span>
            )}
            {auction.mortgageInfo.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">有抵押</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
