import { Clock, CheckCircle, XCircle } from "lucide-react";

type StatsCardsProps = {
    pendingCount: number;
    confirmedCount: number;
    declinedCount: number;
}

function StatsCards({ pendingCount, confirmedCount, declinedCount }: StatsCardsProps) {
    return ( // 3 stats cards for pending, confirmed, declined
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <div className="flex justify-between">
                    <div>
                        <p className="text-yellow-800">Pending</p>
                        <h3 className="text-xl font-bold text-yellow-900">{pendingCount}</h3>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="flex justify-between">
                    <div>
                        <p className="text-green-800">Confirmed</p>
                        <h3 className="text-xl font-bold text-green-900">{confirmedCount}</h3>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="flex justify-between">
                    <div>
                        <p className="text-red-800">Declined</p>
                        <h3 className="text-xl font-bold text-red-900">{declinedCount}</h3>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
            </div>
        </div>
    );
}

export default StatsCards;