import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cookie, Sandwich, Coffee, IceCream, Pizza } from 'lucide-react';

export default function Landing() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const floatingIcons = [
    { Icon: Cookie, delay: 0.2, x: -20, y: -120 },
    { Icon: Sandwich, delay: 0.4, x: 120, y: -80 },
    { Icon: Coffee, delay: 0.6, x: -150, y: 60 },
    { Icon: IceCream, delay: 0.8, x: 140, y: 100 },
    { Icon: Pizza, delay: 1, x: -80, y: 140 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 w-full h-screen z-50 ${fadeOut ? 'fade-out' : ''}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#BED1BD] via-[#e4d5d3] to-[#FFC3BE]">
        {/* Decorative circles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* Floating icons */}
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 0.7, x, y }}
              transition={{
                delay,
                duration: 0.8,
                ease: "easeOut"
              }}
              className="absolute left-1/2 top-1/2"
            >
              <Icon className="w-8 h-8 md:w-12 md:h-12 text-[#70AE6E]" />
            </motion.div>
          ))}

          {/* Logo and text container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <img
                src="/logo.png"
                alt="SnackHunt Logo"
                className="w-24 h-24 md:w-32 md:h-32 mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl md:text-4xl font-normal text-gray-800 mb-2"
            >
              Selamat Datang di
            </motion.h1>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold text-black tracking-tight"
            >
              SnackHunt
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 text-lg md:text-xl text-gray-600"
            >
              Temukan Jajanan Favoritmu
            </motion.p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-[#70AE6E] rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .fade-out {
          animation: fadeOut 1s ease-out forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </motion.div>
  );
}

