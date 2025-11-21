import { motion } from 'framer-motion';
import { Search, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../utils/routes';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-12 h-12 text-teal-600" />,
      title: "Explore Algeria",
      description: "Discover thousands of tours and activities across 69 regions. From Sahara deserts to Mediterranean coasts, Atlas mountains to ancient Roman ruins.",
      route: ROUTES.EXPLORE,
      delay: 0.1
    },
    {
      icon: <Users className="w-12 h-12 text-teal-600" />,
      title: "Connect with Local Guides & Agencies",
      description: "Find verified local guides and trusted travel agencies. Get authentic experiences with experts who know Algeria's hidden gems.",
      route: ROUTES.GUIDES,
      delay: 0.2
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-lime-600" />,
      title: "Join the Community",
      description: "Share your travel stories, rate destinations, write reviews, and get inspired by fellow travelers exploring Algeria and sharing their own experience.",
      route: ROUTES.COMMUNITY,
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Title & Description */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to plan, book, and experience the perfect Algerian adventure
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ 
                duration: 0.6, 
                delay: feature.delay
              }}
              viewport={{ once: true }}
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
      className="group bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 transition-all duration-300 cursor-pointer hover:border-[#348086]"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <motion.a 
        href={route}
        className="group/btn inline-flex items-center gap-2 font-semibold text-gray-900 bg-transparent hover:bg-[#348086] px-6 py-2.5 rounded-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        Learn More 
        <motion.span
          className="transition-transform duration-300 group-hover/btn:translate-x-1"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </motion.a>
    </motion.div>
  );
}