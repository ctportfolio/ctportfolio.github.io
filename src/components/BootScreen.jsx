import { motion } from 'framer-motion'

export default function BootScreen({ owner, tagline, onDone }) {
  return (
    <motion.div
      className="boot-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="boot-card">
        <div className="boot-avatar" aria-hidden="true">
          <div className="avatar-head" />
          <div className="avatar-body" />
        </div>
        <div className="boot-name">{owner}</div>
        <div className="boot-tagline">{tagline}</div>
        <div className="boot-loader" role="progressbar" aria-label="Loading portfolio">
          <motion.div
            className="boot-loader-fill"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            onAnimationComplete={onDone}
          />
        </div>
      </div>
    </motion.div>
  )
}