import { motion } from 'motion/react';

export default function ProcessSection() {
  const steps = [
    {
      number: "1",
      title: "Explore Tours",
      description: "Browse verified tours and activities",
      delay: 0
    },
    {
      number: "2", 
      title: "Choose Your Guide",
      description: "Select from trusted local guides or agencies",
      delay: 0.15
    },
    {
      number: "3",
      title: "Book & Connect",
      description: "Contact directly and plan your trip",
      delay: 0.3
    },
    {
      number: "4",
      title: "Share Experience",
      description: "Rate and inspire others in the community",
      delay: 0.45
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Your journey to discovering Algeria starts here
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center group cursor-pointer relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.delay }}
              viewport={{ once: true }}
            >
              {index !== steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-[#348086]/30 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: step.delay + 0.3 }}
                  viewport={{ once: true }}
                />
              )}

              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-[#348086] rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 group-hover:bg-[#2a6970] group-hover:scale-110 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}