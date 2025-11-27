import { motion } from 'motion/react';
import { ArrowRight, LogIn, Users } from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import homeImg from '../../assets/imgs/home.png';

interface HeroSectionProps {
    onNavigate: (path: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
    return (
        <motion.section
            className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute inset-0">
                <motion.img
                    src={homeImg}
                    alt="Algerian Landscape"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#348086]/90 via-[#348086]/50 to-[#348086]/10" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center max-w-7xl">
                <motion.div
                    className="max-w-2xl text-center lg:text-left"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    >
                        Your Gateway to Authentic Algerian Travel
                    </motion.h1>

                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-white/95 mb-6 sm:mb-8 leading-relaxed max-w-3xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    >
                        Connect with local guides, discover verified tours, and join a community of travelers
                        exploring the beauty of Algeria - from Sahara deserts to Mediterranean shores, from
                        ancient ruins to mountain peaks.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                    >
                        <button
                            onClick={() => onNavigate(ROUTES.EXPLORE)}
                            className="bg-[#cbf492] hover:bg-[#b8e678] text-gray-900 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            Start Exploring <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button
                            onClick={() => onNavigate(ROUTES.SIGN_IN)}
                            className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                        >
                            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In
                        </button>

                        <button
                            onClick={() => onNavigate(ROUTES.SIGN_UP)}
                            className="bg-white border-2 border-[#348086] text-[#348086] hover:bg-[#348086] hover:text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                        >
                            <Users className="w-4 h-4 sm:w-5 sm:h-5" /> Sign Up
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}