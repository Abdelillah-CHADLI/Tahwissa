import { MapPin, Calendar, Users, MoreVertical, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TourCardProps {
    image: string;
    status?: string;
    category: string;
    title: string;
    location: string;
    duration: string;
    groupSize: string;
    price: number;
    bookings: number;
    startDate: string;
    onEdit?: () => void;
    onDelete?: () => void;
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
    onEdit,
    onDelete
}: TourCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const getDisplayStatus = () => {
        if (startDate) {
            const tourDate = new Date(startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (tourDate < today) {
                return "Ended";
            }
        }
        return status || "Active";
    };

    const displayStatus = getDisplayStatus();
    const statusColor = displayStatus === "Ended" ? "bg-gray-500" : "bg-green-500";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="panel overflow-hidden">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-44 object-cover" />

                <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`${statusColor} text-white text-xs px-2.5 py-1 rounded-md`}>
                        {displayStatus}
                    </span>
                    <div className="relative" ref={menuRef} onKeyDown={event => { if (event.key === 'Escape') setShowMenu(false); }}>
                        <button 
                            aria-label={`Actions for ${title}`} aria-expanded={showMenu}
                            className="bg-[#375E5E] text-white p-2 rounded-lg hover:bg-[#2c4b4b] transition-colors"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete?.();
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Tour
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <span className="absolute bottom-3 left-3 bg-brand-ink text-white px-2.5 py-1 rounded-md text-xs">
                    {category}
                </span>
            </div>

            <div className="p-5 space-y-3">
                <h2 className="text-lg leading-6 font-semibold">{title}</h2>

                <div className="flex items-center text-gray-600 gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-700 pt-1">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {groupSize}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-brand-ink">{price.toLocaleString()} DZD</span>
                    </div>
                </div>

                <hr className="border-line" />

                <div className="flex flex-wrap gap-3 justify-between items-center text-sm">
                    <div>
                        <p className="text-gray-600 text-sm">Bookings</p>
                        <p className="font-semibold text-xl">{bookings}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {startDate}
                    </div>

                    <button
                        onClick={onEdit}
                        className="button button-secondary"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
