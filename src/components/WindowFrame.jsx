import {
  Expand,
  Minus,
  X,
  Volume2,
  VolumeX,
  Play,
  ExternalLink,
  Github,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function getProjectMedia(project) {
  if (Array.isArray(project.images) && project.images.length) return project.images
  if (project.image) return [project.image]
  return []
}

function getProjectVideos(project) {
  if (Array.isArray(project.videos) && project.videos.length) return project.videos
  if (project.video) return [project.video]
  return []
}

function ZoomableImage({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [start, setStart] = useState({ x: 0, y: 0 })

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (event) => {
    if (zoom <= 1) return
    setDragging(true)
    setStart({
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    })
  }

  const handleMouseMove = (event) => {
    if (!dragging) return
    setOffset({
      x: event.clientX - start.x,
      y: event.clientY - start.y,
    })
  }

  const handleMouseUp = () => setDragging(false)

  useEffect(() => {
    if (!open) return

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [open, dragging, start, offset])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        resetView()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <div className="zoom-image-wrap">
        <img src={src} alt={alt} className={className} loading="lazy" />
        <button
          type="button"
          className="zoom-trigger"
          onClick={() => setOpen(true)}
          aria-label="Zoom image"
        >
          <Search size={15} />
        </button>
      </div>

      {open && (
        <div className="image-zoom-overlay" onClick={() => { setOpen(false); resetView() }}>
          <div className="image-zoom-toolbar" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="zoom-ui-btn" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
              <ZoomOut size={15} />
            </button>
            <button type="button" className="zoom-ui-btn" onClick={() => setZoom((z) => Math.min(4, z + 0.25))}>
              <ZoomIn size={15} />
            </button>
            <button type="button" className="zoom-ui-btn" onClick={resetView}>
              <RotateCcw size={15} />
            </button>
            <button
              type="button"
              className="zoom-ui-btn danger"
              onClick={() => { setOpen(false); resetView() }}
            >
              <X size={15} />
            </button>
          </div>

          <div className="image-zoom-stage" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              className={`image-zoomed ${zoom > 1 ? 'can-pan' : ''}`}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
              onMouseDown={handleMouseDown}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      )}
    </>
  )
}

function ProjectBundle({ project }) {
  const media = getProjectMedia(project)

  return (
    <article className="project-bundle">
      <div className="project-bundle-header">
        {project.title ? <div className="project-title">{project.title}</div> : null}
        {project.description ? <div className="project-description">{project.description}</div> : null}

        {(project.live || project.github) ? (
          <div className="project-links">
            {project.live ? (
              <a href={project.live} target="_blank" rel="noreferrer" className="project-link-button">
                <ExternalLink size={14} />
                <span>Live</span>
              </a>
            ) : null}

            {project.github ? (
              <a href={project.github} target="_blank" rel="noreferrer" className="project-link-button">
                <Github size={14} />
                <span>GitHub</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {media.length ? (
        <div className="project-media-group">
          {media.map((src, index) => (
            <div key={`${project.id}-image-${index}`} className="project-media-frame">
              <ZoomableImage
                src={src}
                alt={`${project.title || 'Project'} ${index + 1}`}
                className="project-gallery-image"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="media-placeholder bundled">preview</div>
      )}
    </article>
  )
}

function PhotoGrid({ projects }) {
  return (
    <div className="photo-grid">
      {projects.map((project) => {
        const imageSrc = project.image || (Array.isArray(project.images) ? project.images[0] : '')

        return (
          <div className="photo-tile" key={project.id}>
            {imageSrc ? (
              <div className="photo-image-shell">
                <ZoomableImage
                  src={imageSrc}
                  alt={project.title || 'Photography piece'}
                  className="project-gallery-image"
                />
              </div>
            ) : (
              <div className="media-placeholder">image</div>
            )}

            {project.title ? <div className="project-title">{project.title}</div> : null}
            {project.description ? <div className="project-description">{project.description}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

function VideoCard({ project }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.controls = false
    }
  }, [])

  const togglePlay = (event) => {
    event?.stopPropagation?.()
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const resetVideo = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
    setIsPlaying(false)
  }

  return (
    <div className={`video-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="video-stage" onClick={togglePlay}>
        <video
          ref={videoRef}
          className="custom-video"
          preload="metadata"
          playsInline
          onEnded={resetVideo}
        >
          {project.video ? <source src={project.video} type="video/mp4" /> : null}
        </video>

        {!isPlaying && (
          <button type="button" className="overlay-play" onClick={togglePlay} aria-label="Play video">
            <Play size={26} fill="currentColor" />
          </button>
        )}
      </div>

      <div className="video-actions">
        <button type="button" className="square-action" onClick={() => setIsExpanded((v) => !v)} aria-label="Toggle focus mode">
          {isExpanded ? <X size={16} /> : <Expand size={16} />}
        </button>
        <button type="button" className="square-action" onClick={toggleMute} aria-label="Toggle mute">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {project.title ? <div className="project-title">{project.title}</div> : null}
      {project.description ? <div className="project-description">{project.description}</div> : null}
    </div>
  )
}

function BundleList({ projects }) {
  return (
    <div className="bundle-list">
      {projects.map((project) => (
        <ProjectBundle key={project.id} project={project} />
      ))}
    </div>
  )
}

function AboutPane() {
  return (
    <div className="about-pane">
      <p>Cole Timlin</p>
      <p>Photography / Editing / Design / Marketing</p>
      <p>ctimlincontact@gmail.com</p>
    </div>
  )
}

function MarketingMixedList({ projects }) {
  return (
    <div className="video-list">
      {projects.map((project) => {
        const videos = getProjectVideos(project)

        if (videos.length) {
          return (
            <div key={project.id} className="project-bundle">
              <div className="project-bundle-header">
                {project.title ? <div className="project-title">{project.title}</div> : null}
                {project.description ? <div className="project-description">{project.description}</div> : null}
              </div>

              <div className="project-media-group">
                {videos.map((src, index) => (
                  <VideoCard
                    key={`${project.id}-video-${index}`}
                    project={{
                      ...project,
                      video: src,
                      title: index === 0 ? '' : '',
                      description: ''
                    }}
                  />
                ))}
              </div>

              {Array.isArray(project.images) && project.images.length ? (
                <div className="project-media-group">
                  {project.images.map((src, index) => (
                    <div key={`${project.id}-image-${index}`} className="project-media-frame">
                      <ZoomableImage
                        src={src}
                        alt={`${project.title || 'Project'} image ${index + 1}`}
                        className="project-gallery-image"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )
        }

        return <ProjectBundle key={project.id} project={project} />
      })}
    </div>
  )
}

function CreativeDirectionPane({ projects }) {
  return (
    <div className="creative-direction-pane">
      <div className="creative-direction-toolbar">
        <div>
          <div className="project-title">Creative Direction</div>
          <div className="project-description">Campaign concepts, visual systems, references, videos, and image-led direction work.</div>
        </div>
      </div>

      {projects.length ? (
        <div className="creative-media-grid">
          {projects.map((project) => {
            const images = getProjectMedia(project)
            const videos = getProjectVideos(project)

            return (
              <article className="creative-media-card" key={project.id}>
                <div className="project-bundle-header">
                  {project.title ? <div className="project-title">{project.title}</div> : null}
                  {project.description ? <div className="project-description">{project.description}</div> : null}
                </div>

                {images.length ? (
                  <div className="project-media-group">
                    {images.map((src, index) => (
                      <div key={`${project.id}-image-${index}`} className="project-media-frame">
                        <ZoomableImage
                          src={src}
                          alt={`${project.title || 'Creative direction'} image ${index + 1}`}
                          className="project-gallery-image"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {videos.length ? (
                  <div className="project-media-group">
                    {videos.map((src, index) => (
                      <VideoCard
                        key={`${project.id}-video-${index}`}
                        project={{
                          ...project,
                          video: src,
                          title: '',
                          description: '',
                        }}
                      />
                    ))}
                  </div>
                ) : null}

                {!images.length && !videos.length ? (
                  <div className="media-placeholder bundled">Add images or videos in src/data/categories.js</div>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="creative-empty-state">
          <span>Add Creative Direction projects in src/data/categories.js.</span>
        </div>
      )}
    </div>
  )
}

function WindowContent({ category }) {
  if (category.id === 'creative-direction') return <CreativeDirectionPane projects={category.projects} />

  if (category.id === 'photography') return <PhotoGrid projects={category.projects} />

  if (category.id === 'editing') {
    return (
      <div className="video-list">
        {category.projects.map((project) => {
          const videos = getProjectVideos(project)

          return videos.map((src, index) => (
            <VideoCard
              key={`${project.id}-video-${index}`}
              project={{
                ...project,
                video: src,
                title: index === 0 ? project.title : '',
                description: index === 0 ? project.description : ''
              }}
            />
          ))
        })}
      </div>
    )
  }

  if (category.id === 'marketing') {
    return <MarketingMixedList projects={category.projects} />
  }

  if (category.id === 'about') return <AboutPane />
  return <BundleList projects={category.projects} />
}

export default function WindowFrame({
  windowItem,
  onClose,
  onMinimize,
  onToggleMaximize,
  onDragStart,
}) {
  const { title, zIndex, maximized, minimized, x, y } = windowItem

  if (minimized) return null

  return (
    <div
      className={`vm-window ${maximized ? 'maximized' : ''}`}
      data-category={windowItem.category.id}
      style={{
        zIndex,
        left: maximized ? 0 : x,
        top: maximized ? 0 : y,
      }}
    >
      <div className="vm-titlebar" onMouseDown={(event) => onDragStart(event, windowItem.id)}>
        <div className="vm-title-left">
          <span className="window-dot" />
          <span>{title}</span>
        </div>

        <div className="vm-title-actions">
          <button type="button" onClick={() => onMinimize(windowItem.id)} aria-label="Minimize">
            <Minus size={14} />
          </button>
          <button type="button" onClick={() => onToggleMaximize(windowItem.id)} aria-label="Maximize">
            <Expand size={14} />
          </button>
          <button type="button" className="close-action" onClick={() => onClose(windowItem.id)} aria-label="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="vm-content">
        <WindowContent category={windowItem.category} />
      </div>
    </div>
  )
}
