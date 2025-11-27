import { Clock, CheckCircle, XCircle } from "lucide-react";

type EmptyStateProps = {
    activeTab: string;
}
function EmptyState({ activeTab }: EmptyStateProps) {
    const getIcon = () => {
        if (activeTab === "pending") return <Clock className="w-12 h-12 mx-auto" />;
        if (activeTab === "confirmed") return <CheckCircle className="w-12 h-12 mx-auto" />;
        if (activeTab === "declined") return <XCircle className="w-12 h-12 mx-auto" />;
        return <Clock className="w-12 h-12 mx-auto" />;
    };

    const getMessage = () => {
        if (activeTab === "all") return "You don't have any requests yet";
        return `You don't have any ${activeTab} requests`;
    };

    return (
        <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
                {getIcon()}
            </div>
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-gray-600">{getMessage()}</p>
        </div>
    )



}

export default EmptyState;