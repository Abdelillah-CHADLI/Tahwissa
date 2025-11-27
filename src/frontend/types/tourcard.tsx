import { MapPin, Calendar, Users, DollarSign, MoreVertical} from "lucide-react";

interface TourCardProps {
    image: string;
    status: string;
    category: string;
    title: string;
    location: string;
    duration: string;
    groupSize: string;
    price: number;
    bookings: number;
    startDate: string;
    onEdit?: () => void;
}

export function TourCard({
    image,
    status,
    category,
    title,
    location,
    duration,
    groupSize,
    price,
    bookings,
    startDate,
    onEdit
}: TourCardProps) {

    return (
        <div className="border border-gray-300 rounded-3xl overflow-hidden shadow-sm bg-white">
            <div className="relative">
                <img src={image} className="w-full h-48 object-cover" />

                <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                        {status}
                    </span>
                    <button className="bg-[#375E5E] text-white p-2 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                <span className="absolute bottom-3 left-3 bg-[#375E5E] text-white px-3 py-1 rounded-full text-sm">
                    {category}
                </span>
            </div>

            <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold">{title}</h2>

                <div className="flex items-center text-gray-600 gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>

                <div className="flex justify-between items-center text-gray-700 pt-1">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {groupSize}
                    </div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {price}
                    </div>
                </div>

                <hr />

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 text-sm">Bookings</p>
                        <p className="font-semibold text-xl">{bookings}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {startDate}
                    </div>

                    <button
                        onClick={onEdit}
                        className="px-5 py-2 rounded-xl border text-gray-700 hover:bg-gray-100 transition"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
