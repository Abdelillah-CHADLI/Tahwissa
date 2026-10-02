import { motion } from 'motion/react';
import { Search, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../utils/routes';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-teal-600" />,
      title: "Explore Algeria",
      description: "Browse tours and activities across Algeria, from Sahara deserts and Mediterranean coasts to mountains and ancient ruins.",
      route: ROUTES.EXPLORE,
      delay: 0.1
    },
    {
      icon: <Users className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-teal-600" />,
      title: "Connect with Local Guides & Agencies",
      description: "Find verified local guides and trusted travel agencies. Get authentic experiences with experts who know Algeria's hidden gems.",
      route: ROUTES.GUIDES,
      delay: 0.2
    },
    {
      icon: <MessageCircle className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-lime-600" />,
      title: "Join the Community",
      description: "Share your travel stories, rate destinations, write reviews, and get inspired by fellow travelers exploring Algeria and sharing their own experience.",
      route: ROUTES.COMMUNITY,
      delay: 0.3
    }
  ];

  return (
    <section className="py-12 xs:py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl">
        <motion.div 
          className="text-center mb-8 xs:mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
            What We Offer
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 xs:px-4">
            Everything you need to plan, book, and experience the perfect Algerian adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 xs:gap-6 sm:gap-8 fold:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ 
                duration: 0.6, 
                delay: feature.delay
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                route={feature.route}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  route
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  route: string;
}) {
  return (
    <motion.div 
      className="group bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-6 sm:p-8 shadow-sm border-2 border-gray-100 transition-all duration-300 cursor-pointer hover:border-[#348086] h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3 xs:mb-4 sm:mb-6 flex justify-center lg:justify-start">{icon}</div>
      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4 text-center lg:text-left">
        {title}
      </h3>
      <p className="text-gray-600 text-xs xs:text-sm sm:text-base mb-3 xs:mb-4 sm:mb-6 leading-relaxed text-center lg:text-left grow">
        {description}
      </p>
      
      <motion.a 
        href={route}
        className="group/btn inline-flex items-center justify-center lg:justify-start gap-1 xs:gap-2 font-semibold text-gray-900 bg-transparent hover:bg-[#348086] px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 rounded-lg transition-all duration-300 w-full lg:w-auto text-center text-xs xs:text-sm sm:text-base min-h-11"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        Learn More 
        <motion.span
          className="transition-transform duration-300 group-hover/btn:translate-x-1"
        >
          <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
        </motion.span>
      </motion.a>
    </motion.div>
  );
}
