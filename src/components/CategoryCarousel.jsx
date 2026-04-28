import { useMemo } from 'react'
import { motion } from 'framer-motion'

function mod(n, m) {
  return ((n % m) + m) % m
}

export default function CategoryCarousel({
  categories,
  focusedIndex,
  setFocusedIndex,
  onOpen,
}) {
  const visible = useMemo(() => {
    const current = categories[mod(focusedIndex, categories.length)]
    const prev = categories[mod(focusedIndex - 1, categories.length)]
    const next = categories[mod(focusedIndex + 1, categories.length)]
    return [prev, current, next]
  }, [categories, focusedIndex])

  const positions = ['left', 'center', 'right']

  return (
    <section className="carousel-shell">
      <div className="carousel-track">
        {visible.map((category, index) => {
          const position = positions[index]
          const isFocused = position === 'center'

          return (
            <motion.button
              key={`${category.id}-${position}`}
              type="button"
              className={`category-card ${position} ${isFocused ? 'focused' : 'unfocused'}`}
              onClick={() => {
                if (isFocused) onOpen(category)
                else setFocusedIndex((prevIndex) => {
                  if (position === 'left') return prevIndex - 1
                  if (position === 'right') return prevIndex + 1
                  return prevIndex
                })
              }}
              whileHover={isFocused ? { y: -4, scale: 1.02 } : { scale: 0.96 }}
              whileTap={{ scale: 0.98 }}
              aria-label={isFocused ? `Open ${category.title}` : `Focus ${category.title}`}
            >
              <div className="category-object">
                <div className={`object-core ${category.id}`}>
                {category.icon ? (
                  <img
                    src={category.icon}
                    alt={category.title}
                    className="category-image"
                    draggable="false"
                  />
                ) : (
                  <span>{category.emoji}</span>
              )}
            </div>
              </div>
              <div className="category-title">{category.title}</div>
            </motion.button>
          )
        })}
      </div>

      <div className="carousel-controls">
        <button type="button" className="ghost-nav" onClick={() => setFocusedIndex((i) => i - 1)}>
          ←
        </button>
        <button type="button" className="ghost-nav" onClick={() => setFocusedIndex((i) => i + 1)}>
          →
        </button>
      </div>
    </section>
  )
}