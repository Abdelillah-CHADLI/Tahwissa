const PopularTags = () => {
  const tags = [
    'Desert Tours',
    'Mountain Hiking',
    'Coastal Adventures',
    'Cultural Tours',
    'Historical Sites',
    'Food Tours'
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">Popular:</span>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;