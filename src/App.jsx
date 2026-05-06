import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import BootScreen from './components/BootScreen'
import CategoryCarousel from './components/CategoryCarousel'
import Taskbar from './components/Taskbar'
import WindowFrame from './components/WindowFrame'
import { categories } from './data/categories'
import { siteConfig } from './data/siteConfig'
import Lifemaxxing from './lifemaxxing/Lifemaxxing'
import Caine from './caine/Caine'

function Model({ path, ...props }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene.clone()} {...props} />
}

function MovingLights() {
  const purpleLight = useRef()
  const pinkLight = useRef()
  const blueLight = useRef()
  const redLight = useRef()
  const cyanLight = useRef()
  const whiteSweep = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (purpleLight.current) {
      purpleLight.current.position.x = Math.sin(t * 0.9) * 6
      purpleLight.current.position.y = 3.2 + Math.sin(t * 1.2) * 0.7
      purpleLight.current.position.z = -1.5 + Math.cos(t * 0.8) * 2.2
    }

    if (pinkLight.current) {
      pinkLight.current.position.x = Math.cos(t * 0.8) * 6.5
      pinkLight.current.position.y = 3.1 + Math.cos(t * 1.1) * 0.6
      pinkLight.current.position.z = -1.2 + Math.sin(t * 0.9) * 2
    }

    if (blueLight.current) {
      blueLight.current.position.x = Math.sin(t * 1.1) * 4.5
      blueLight.current.position.y = -0.2 + Math.sin(t * 0.7) * 0.5
      blueLight.current.position.z = 1.2 + Math.cos(t * 0.9) * 2.2
    }

    if (redLight.current) {
      redLight.current.position.x = Math.sin(t * 0.6 + 1.7) * 5.8
      redLight.current.position.y = 2.8 + Math.cos(t * 1.05) * 0.5
      redLight.current.position.z = -2.8 + Math.sin(t * 0.7) * 1.8
    }

    if (cyanLight.current) {
      cyanLight.current.position.x = Math.cos(t * 0.75 + 2.1) * 5.4
      cyanLight.current.position.y = 2.4 + Math.sin(t * 0.95) * 0.55
      cyanLight.current.position.z = -2.2 + Math.cos(t * 0.65) * 1.7
    }

    if (whiteSweep.current) {
      whiteSweep.current.position.x = Math.sin(t * 0.5) * 3.2
      whiteSweep.current.position.y = 4 + Math.sin(t * 0.8) * 0.5
      whiteSweep.current.position.z = 0.5 + Math.cos(t * 0.55) * 2.5
    }
  })

  return (
    <>
      <pointLight ref={purpleLight} intensity={12} distance={18} color="#7c3aed" />
      <pointLight ref={pinkLight} intensity={11} distance={18} color="#ff2f7d" />
      <pointLight ref={blueLight} intensity={8} distance={14} color="#00d9ff" />
      <pointLight ref={redLight} intensity={9} distance={16} color="#ff3b3b" />
      <pointLight ref={cyanLight} intensity={8} distance={15} color="#5ef2ff" />
      <pointLight ref={whiteSweep} intensity={6} distance={14} color="#fff6dc" />
    </>
  )
}

function BackgroundScene() {
  return (
    <Canvas className="background-canvas" camera={{ position: [0, 1.2, 10], fov: 42 }}>
      <color attach="background" args={['#0d0b10']} />
      <fog attach="fog" args={['#0d0b10', 7, 22]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 5, 2]} intensity={0.28} color="#d8d0c8" />
      <pointLight position={[0, 2.2, 2.1]} intensity={1.4} distance={8} color="#f8efe4" />
      <pointLight position={[0, 3.8, -3.5]} intensity={0.7} distance={9} color="#ff8a00" />
      <pointLight position={[0, 2.2, 2.1]} intensity={1.4} distance={8} color="#6734f3" />
      <pointLight position={[0, 3.8, -3.5]} intensity={0.7} distance={9} color="#339aee" />

      <MovingLights />

      <Model
        path="/models/abandoned_school.glb"
        position={[0, -2.1, 3]}
        rotation={[0, 2.4, 0]}
        scale={2.3}
      />

      <fog attach="fog" args={['#120d16', 6, 24]} />
    </Canvas>
  )
}

function getInitialFocusedIndex() {
  const index = categories.findIndex((item) => item.id === siteConfig.firstFocusedCategoryId)
  return index === -1 ? 0 : index
}

export default function App() {
  if (window.location.pathname.toLowerCase().startsWith('/caine')) {
    return <Caine />
  }

  if (window.location.pathname.toLowerCase().startsWith('/lifemaxxing')) {
    return <Lifemaxxing />
  }

  const audioRef = useRef(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [booted, setBooted] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(getInitialFocusedIndex())
  const [windows, setWindows] = useState([])
  const [dragging, setDragging] = useState(null)
  const [highestZ, setHighestZ] = useState(10)

  const focusedCategory = useMemo(
    () => categories[((focusedIndex % categories.length) + categories.length) % categories.length],
    [focusedIndex]
  )

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!dragging) return
      setWindows((current) =>
        current.map((windowItem) =>
          windowItem.id === dragging.id
            ? {
                ...windowItem,
                x: event.clientX - dragging.offsetX,
                y: event.clientY - dragging.offsetY,
              }
            : windowItem
        )
      )
    }

    const handleMouseUp = () => setDragging(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  useEffect(() => {
    const handleWheel = (event) => {
      if (!booted) return
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        if (event.deltaY > 0) setFocusedIndex((prev) => prev + 1)
        if (event.deltaY < 0) setFocusedIndex((prev) => prev - 1)
      } else {
        if (event.deltaX > 0) setFocusedIndex((prev) => prev + 1)
        if (event.deltaX < 0) setFocusedIndex((prev) => prev - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [booted])

  useEffect(() => {
  const audio = audioRef.current
  if (!audio) return

  if (audioEnabled) {
    audio.volume = 0.35
    audio.play().catch(() => {})
  } else {
    audio.pause()
  }
  }, [audioEnabled])

  const toggleAudio = () => {
  setAudioEnabled((prev) => !prev)
  }

  const openCategoryWindow = (category) => {
    setWindows((current) => {
      const existing = current.find((windowItem) => windowItem.category.id === category.id)
      if (existing) {
        return current.map((windowItem) =>
          windowItem.id === existing.id
            ? { ...windowItem, minimized: false, zIndex: highestZ + 1 }
            : windowItem
        )
      }

      const nextZ = highestZ + 1
      setHighestZ(nextZ)

      return [
        ...current,
        {
          id: `${category.id}-${Date.now()}`,
          title: category.title,
          category,
          x: 90 + current.length * 28,
          y: 90 + current.length * 24,
          zIndex: nextZ,
          maximized: false,
          minimized: false,
        },
      ]
    })
  }

  const closeWindow = (id) => {
    setWindows((current) => current.filter((windowItem) => windowItem.id !== id))
  }

  const minimizeWindow = (id) => {
    setWindows((current) =>
      current.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, minimized: true } : windowItem
      )
    )
  }

  const toggleMaximize = (id) => {
    setWindows((current) =>
      current.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, maximized: !windowItem.maximized } : windowItem
      )
    )
  }

  const focusWindow = (id) => {
    const nextZ = highestZ + 1
    setHighestZ(nextZ)
    setWindows((current) =>
      current.map((windowItem) =>
        windowItem.id === id
          ? { ...windowItem, minimized: false, zIndex: nextZ }
          : windowItem
      )
    )
  }

  const startDrag = (event, id) => {
    const windowItem = windows.find((item) => item.id === id)
    if (!windowItem || windowItem.maximized) return
    focusWindow(id)
    setDragging({
      id,
      offsetX: event.clientX - windowItem.x,
      offsetY: event.clientY - windowItem.y,
    })
  }

  return (
    <div className="app-shell">
      <audio ref={audioRef} src="/audio/bg-music.mp3" loop preload="auto" />
      <BackgroundScene />
      <div className="room-vignette" />
      <div className="crt-overlay" />

      {!booted ? (
        <BootScreen
          owner={siteConfig.owner}
          tagline={siteConfig.tagline}
          onDone={() => setBooted(true)}
        />
      ) : (
        <>
          <header className="site-mark">
            <div className="site-mark-badge">
              <img src="/images/ui/titlebar-logo.png" alt="Cole Timlin" />
            </div>
          </header>

          <main className="desktop-layer">
            <CategoryCarousel
              categories={categories}
              focusedIndex={focusedIndex}
              setFocusedIndex={setFocusedIndex}
              onOpen={openCategoryWindow}
            />

            <div className="hint-line">
              <span>{focusedCategory.description}</span>
            </div>

            {windows.map((windowItem) => (
              <WindowFrame
                key={windowItem.id}
                windowItem={windowItem}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onToggleMaximize={toggleMaximize}
                onDragStart={startDrag}
              />
            ))}
          </main>

          <Taskbar
            socials={siteConfig.socials}
            windows={windows}
            onFocusWindow={focusWindow}
            audioEnabled={audioEnabled}
            onToggleAudio={toggleAudio}
          />
        </>
      )}
    </div>
  )
}
