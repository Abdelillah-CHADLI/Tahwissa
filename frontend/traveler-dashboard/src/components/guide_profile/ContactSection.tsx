import { motion } from 'motion/react';
import { Mail, Phone, Navigation } from 'lucide-react';
import { colors } from '../../assets/colors';

interface ContactSectionProps {
  guide: {
    email: string;
    phone: string;
    location: string;
  };
}

const ContactSection = ({ guide }: ContactSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: colors.secondary.green,
      borderColor: colors.primary.green,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm border p-6"
        style={{ borderColor: colors.primary.green }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="flex items-center p-4 rounded-lg border-2 cursor-pointer"
            style={{ borderColor: colors.primary.green }}
          >
            <div 
              className="p-2 rounded-lg mr-4"
              style={{ backgroundColor: `${colors.primary.green}20` }}
            >
              <Mail 
                className="w-5 h-5" 
                style={{ color: colors.primary.green }} 
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{guide.email}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="flex items-center p-4 rounded-lg border-2 cursor-pointer"
            style={{ borderColor: colors.primary.green }}
          >
            <div 
              className="p-2 rounded-lg mr-4"
              style={{ backgroundColor: `${colors.primary.green}20` }}
            >
              <Phone 
                className="w-5 h-5" 
                style={{ color: colors.primary.green }} 
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{guide.phone}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="flex items-center p-4 rounded-lg border-2 cursor-pointer"
            style={{ borderColor: colors.primary.green }}
          >
            <div 
              className="p-2 rounded-lg mr-4"
              style={{ backgroundColor: `${colors.primary.green}20` }}
            >
              <Navigation 
                className="w-5 h-5" 
                style={{ color: colors.primary.green }} 
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{guide.location}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactSection;