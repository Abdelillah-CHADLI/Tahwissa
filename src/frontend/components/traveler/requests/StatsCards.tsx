import { Clock, CheckCircle, XCircle } from "lucide-react";

type StatsCardsProps = {
    pendingCount: number;
    confirmedCount: number;
    cancelledCount: number;
}

function StatsCards({ pendingCount, confirmedCount, cancelledCount }: StatsCardsProps) {
    return ( // 3 stats cards for pending, confirmed, declined
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-xs sm:text-sm text-yellow-800">Pending</p>
                        <h3 className="text-xl font-bold text-yellow-900">{pendingCount}</h3>
                    </div>
                    <Clock className="hidden sm:block w-5 h-5 shrink-0 text-yellow-600" />
                </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-xs sm:text-sm text-green-800">Confirmed</p>
                        <h3 className="text-xl font-bold text-green-900">{confirmedCount}</h3>
                    </div>
                    <CheckCircle className="hidden sm:block w-5 h-5 shrink-0 text-green-600" />
                </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-xs sm:text-sm text-red-800">Cancelled</p>
                        <h3 className="text-xl font-bold text-red-900">{cancelledCount}</h3>
                    </div>
                    <XCircle className="hidden sm:block w-5 h-5 shrink-0 text-red-600" />
                </div>
            </div>
        </div>
    );
}

export default StatsCards;