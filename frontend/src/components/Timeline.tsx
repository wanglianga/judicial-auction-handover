import type { TimelineEvent } from '../types';
import { formatDate } from '../utils';

interface TimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<string, string> = {
  auction_created: '📝',
  deposit_paid: '💰',
  auction_ended: '🏆',
  deal_confirmed: '📜',
  loan_applied: '🏦',
  loan_approved: '✅',
  loan_disbursed: '💸',
  balance_paid: '💵',
  property_arrears_updated: '🏢',
  tax_calculated: '🧾',
  eviction_created: '🔨',
  eviction_completed: '🔓',
  key_handover: '🔑',
  acceptance_completed: '🤝',
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-lg">
              {eventIcons[event.type] || '📌'}
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 my-1" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-800">{event.title}</h4>
              <span className="text-xs text-gray-400">{formatDate(event.time)}</span>
            </div>
            <p className="text-sm text-gray-500">{event.description}</p>
            {event.operator && (
              <span className="text-xs text-gray-400 mt-1 block">操作人：{event.operator}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
