import { AnimatePresence, motion } from 'framer-motion';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps, router }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-h-screen"
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
