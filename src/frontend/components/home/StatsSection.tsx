import { motion } from 'motion/react';
import { MapPin, Compass, Users, Star } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: <MapPin className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#348086]" />,
      number: "Algeria",
      label: "Places to explore",
      delay: 0
    },
    {
      icon: <Compass className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#348086]" />,
      number: "Tours",
      label: "Experiences to discover",
      delay: 0.1
    },
    {
      icon: <Users className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#348086]" />,
      number: "Local hosts",
      label: "Guides and agencies",
      delay: 0.2
    },
    {
      icon: <Star className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#348086]" />,
      number: "Community",
      label: "Stories from travelers",
      delay: 0.3
    }
  ];

  return (
    <section className="border-b bg-white py-8 sm:py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <StatCard
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="text-center group cursor-pointer p-1 xs:p-2 sm:p-0">
      <div className="flex justify-center mb-1 xs:mb-2 sm:mb-3">
        <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">{number}</div>

      <div className="text-gray-600 text-xs xs:text-sm md:text-base leading-tight px-1">{label}</div>
    </div>
  );
}
