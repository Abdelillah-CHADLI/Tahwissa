interface CTASectionProps {
  onNavigate: (path: string) => void;
}

export default function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="py-20 bg-teal-700">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore Algeria?</h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of travelers discovering the beauty of Algeria with local guides and trusted agencies
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onNavigate('/signup')}
            className="bg-[#cbf492] hover:bg-[#b8e678] text-gray-900 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </button>

        </div>
      </div>
    </section>
  );
}