import { MapPin, Star, Users, Calendar } from 'lucide-react';

interface GuideHeaderProps {
  guide: {
    name: string;
    specialty: string;
    location: string;
    rating?: number | null;
    toursCount?: number | null;
    experience: string;
    image?: string;
  };
}

const GuideHeader = ({ guide }: GuideHeaderProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const hasRating = guide.rating !== null && guide.rating !== undefined;
  const hasToursCount = guide.toursCount !== null && guide.toursCount !== undefined;
  const hasImage = guide.image && guide.image !== '';

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shrink-0">
            {hasImage ? (
              <img 
                src={guide.image} 
                alt={guide.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{guide.specialty}</p>
            <div className="flex items-center justify-center md:justify-start text-gray-500 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{guide.location}</span>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-6 mb-6">
              <div className="flex items-center gap-4 text-gray-600">
                {hasRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{guide.rating}</span>
                  </div>
                )}
                {hasToursCount && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{guide.toursCount} tours</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{guide.experience}</span>
                </div>
              </div>
            </div>

            {hasRating && (
              <div className="flex justify-center md:justify-start items-center gap-2">
                {renderStars(guide.rating!)}
                <span className="font-semibold text-gray-900">{guide.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideHeader;