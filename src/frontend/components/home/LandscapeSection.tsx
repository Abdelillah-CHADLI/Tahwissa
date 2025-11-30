import { motion } from 'motion/react';

export default function LandscapeSection() {
  const landscapes = [
    {
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
      title: "Sahara Desert",
      subtitle: "Golden dunes and starlit nights",
      delay: 0.1
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      title: "Atlas Mountains",
      subtitle: "Majestic peaks and hiking trails",
      delay: 0.2
    },
    {
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      title: "Mediterranean Coast",
      subtitle: "Crystal clear waters and beaches",
      delay: 0.3
    }
  ];

  return (
    <section className="py-12 xs:py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl">
    <section className="py-12 xs:py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl">
        <motion.div 
          className="text-center mb-8 xs:mb-12 sm:mb-16"
          className="text-center mb-8 xs:mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
            Algeria's Natural Diversity
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 xs:px-4">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
            Algeria's Natural Diversity
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 xs:px-4">
            Experience the stunning contrasts of Algeria's landscapes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          {landscapes.map((landscape, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6, delay: landscape.delay }}
              viewport={{ once: true, margin: "-50px" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <LandscapeCard
                image={landscape.image}
                title={landscape.title}
                subtitle={landscape.subtitle}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandscapeCard({ image, title, subtitle }: { image: string; title: string; subtitle: string }) {
  return (
    <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl">
    <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-6 text-white">
        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold mb-1 xs:mb-2">{title}</h3>
        <p className="text-white/90 text-xs xs:text-sm sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}