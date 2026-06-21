import { useState } from 'react';
import { propertyApi } from '../services/api';
import { formatCurrency } from '../utils';
import { Building2, Loader2 } from 'lucide-react';

interface PropertyInfoFormProps {
  auctionId: string;
  auctionTitle: string;
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PropertyInfoForm({
  auctionId,
  auctionTitle,
  initialData,
  onSuccess,
  onCancel,
}: PropertyInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyFeeArrears: initialData?.propertyFeeArrears || 0,
    waterArrears: initialData?.waterArrears || 0,
    electricityArrears: initialData?.electricityArrears || 0,
    gasArrears: initialData?.gasArrears || 0,
    heatingArrears: initialData?.heatingArrears || 0,
    hasAccessControl: initialData?.hasAccessControl ?? true,
    parkingSpace: initialData?.parkingSpace || '',
    decorationDeposit: initialData?.decorationDeposit || 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await propertyApi.updateArrears(auctionId, formData);
      onSuccess();
    } catch (error) {
      console.error('保存物业信息失败', error);
      alert('保存物业信息失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const totalArrears =
    formData.propertyFeeArrears +
    formData.waterArrears +
    formData.electricityArrears +
    formData.gasArrears +
    formData.heatingArrears;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Building2 size={20} />
          <span className="font-medium">物业信息录入</span>
        </div>
        <div className="text-sm text-blue-600">拍卖标的：{auctionTitle}</div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <span>💰</span> 欠费信息
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              物业费欠费（元）
            </label>
            <input
              type="number"
              value={formData.propertyFeeArrears}
              onChange={(e) => handleChange('propertyFeeArrears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              水费欠费（元）
            </label>
            <input
              type="number"
              value={formData.waterArrears}
              onChange={(e) => handleChange('waterArrears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              电费欠费（元）
            </label>
            <input
              type="number"
              value={formData.electricityArrears}
              onChange={(e) => handleChange('electricityArrears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              燃气费欠费（元）
            </label>
            <input
              type="number"
              value={formData.gasArrears}
              onChange={(e) => handleChange('gasArrears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1.5">
              供暖费欠费（元）
            </label>
            <input
              type="number"
              value={formData.heatingArrears}
              onChange={(e) => handleChange('heatingArrears', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg flex justify-between items-center">
          <span className="text-sm text-yellow-700">欠费合计</span>
          <span className="text-lg font-bold text-yellow-700">
            {formatCurrency(totalArrears)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <span>🔑</span> 设施信息
        </h4>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-700">门禁系统</span>
            <p className="text-xs text-gray-400">是否有门禁卡/门禁权限</p>
          </div>
          <button
            type="button"
            onClick={() => handleChange('hasAccessControl', !formData.hasAccessControl)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              formData.hasAccessControl ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                formData.hasAccessControl ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            车位信息
          </label>
          <input
            type="text"
            value={formData.parkingSpace}
            onChange={(e) => handleChange('parkingSpace', e.target.value)}
            placeholder="例如：地下车库B区023号"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            装修押金（元）
          </label>
          <input
            type="number"
            value={formData.decorationDeposit}
            onChange={(e) => handleChange('decorationDeposit', Number(e.target.value))}
            placeholder="如有装修押金请填写"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          保存物业信息
        </button>
      </div>
    </form>
  );
}
