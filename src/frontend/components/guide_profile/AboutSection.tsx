import { motion } from 'motion/react';
import { Check, Users, Globe, Building } from 'lucide-react';
import { colors } from '../../assets/colors';

interface AboutSectionProps {
  guide: {
    about: string;
    languages?: string[];
    certifications: string[];
    type?: 'guide' | 'agency';
    employeesCount?: number;
    establishedYear?: number;
  };
}

const AboutSection = ({ guide }: AboutSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const isAgency = guide.type === 'agency';

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 mb-8 leading-relaxed">{guide.about}</p>
        
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-200 pt-8 pb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {isAgency ? 'Company Information' : 'Languages'}
          </h3>
          <div className="space-y-4">
            {isAgency ? (
              <>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    {guide.employeesCount} {guide.employeesCount === 1 ? 'employee' : 'employees'}
                  </span>
                </div>
                {guide.establishedYear && (
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      Established in {guide.establishedYear}
                    </span>
                  </div>
                )}
              </>
            ) : (
              guide.languages?.map((language, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <Globe className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{language}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-200 pt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {isAgency ? 'Services & Specializations' : 'Certifications & Qualifications'}
          </h3>
          <div className="space-y-4">
            {guide.certifications.map((certification, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="flex items-center"
              >
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">{certification}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;