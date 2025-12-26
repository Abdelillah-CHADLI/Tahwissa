import { Clock, CheckCircle, XCircle, Calendar, MapPin, Users, Banknote, Mail, Phone } from "lucide-react";


type Request = {
    id: string;
    type: string;
    providerName: string;
    tourName: string;
    requestDate: string;
    preferredDate: string;
    status: string;
    travelers: number;
    price: number;
    duration: number;
    location: string;
    message: string;
    contactEmail: string;
    contactPhone: string;
    confirmedDetails?: string;
    declineReason?: string;
}

type RequestCardProps = {
    request: Request;
    onFollowUp?: (requestId: string) => void;
    onRequestAgain?: (requestId: string) => void;
    onViewDetails?: (requestId: string) => void;
}

const getStatusIcon = (status: string) => {
    if (status === "pending") return <Clock className="w-4 h-4" />;
    if (status === "confirmed") return <CheckCircle className="w-4 h-4" />;
    if (status === "declined") return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
};

const getStatusColor = (status: string) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "confirmed") return "bg-green-100 text-green-800";
    if (status === "declined") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
};

function RequestCard({ request }: RequestCardProps) {
    return (
        <div className="border rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg">{request.providerName}</h3>
                    <p className="text-gray-600">{request.tourName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{request.preferredDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{request.travelers} people</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Requested {request.requestDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{request.duration} day{request.duration !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    <span className="font-medium">{request.price} DZD</span>
                </div>
            </div>

            <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-sm">{request.message}</p>
            </div>

            {request.status === "confirmed" && request.confirmedDetails && (
                <div className="bg-green-50 p-3 rounded mb-3">
                    <p className="text-sm text-green-800">{request.confirmedDetails}</p>
                </div>
            )}

            {request.status === "declined" && request.declineReason && (
                <div className="bg-red-50 p-3 rounded mb-3">
                    <p className="text-sm text-red-800">{request.declineReason}</p>
                </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{request.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{request.contactPhone}</span>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default RequestCard;