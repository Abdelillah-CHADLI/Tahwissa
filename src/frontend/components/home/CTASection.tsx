interface CTASectionProps {
  onNavigate: (path: string) => void;
}

export default function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="py-12 xs:py-16 sm:py-20 bg-teal-700">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-4xl text-center">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 xs:mb-4">
          Ready to Explore Algeria?
        </h2>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Join thousands of travelers discovering the beauty of Algeria with local guides and trusted agencies
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 xs:gap-3 sm:gap-4">
          <button 
            onClick={() => onNavigate('/signup')}
            className="bg-[#cbf492] hover:bg-[#b8e678] text-gray-900 px-4 xs:px-6 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-4 rounded-lg font-bold text-sm xs:text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto min-h-11"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}