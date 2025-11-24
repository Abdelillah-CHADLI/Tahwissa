import { motion } from 'motion/react';
import { MapPin, Compass, Users, Star } from 'lucide-react';

export default function StatsSection() {
const stats = [
    {
        icon: <MapPin className="w-8 h-8 text-[#348086]" />,
        number: "69 Wilayas",
        label: "Across Algeria",
        delay: 0
    },
    {
        icon: <Compass className="w-8 h-8 text-[#348086]" />,
        number: "—",
        label: "Tours Coming Soon",
        delay: 0.1
    },
    {
        icon: <Users className="w-8 h-8 text-[#348086]" />,
        number: "—",
        label: "Guides Coming Soon",
        delay: 0.2
    },
    {
        icon: <Star className="w-8 h-8 text-[#348086]" />,
        number: "—",
        label: "Reviews Coming Soon",
        delay: 0.3
    }
];

  return (
    <section className="py-16 bg-white border-b">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true }}
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
    <div className="text-center group cursor-pointer">
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">{number}</div>

      <div className="text-gray-600">{label}</div>
    </div>
  );
}