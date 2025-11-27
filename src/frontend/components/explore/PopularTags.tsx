interface PopularTagsProps {
  onTagClick: (tag: string) => void;
}

const PopularTags = ({ onTagClick }: PopularTagsProps) => {
  const tags = [
    'Desert Tours', 'Mountain Hiking', 'Coastal Adventures', 
    'Cultural Tours', 'Historical Sites', 'Food Tours'
  ];

  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-xs text-gray-500 whitespace-nowrap">Popular:</span>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-colors whitespace-nowrap shrink-0"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;