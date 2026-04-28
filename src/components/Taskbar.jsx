import { Github, Instagram, Mail, Twitter, AppWindow, Volume2, VolumeX } from 'lucide-react'

export default function Taskbar({
  socials,
  windows,
  onFocusWindow,
  audioEnabled,
  onToggleAudio,
}) {
  return (
    <div className="taskbar">
      <button type="button" className="os-button" aria-label="System menu">
        <span className="os-mark">◧</span>
      </button>

      <div className="taskbar-windows">
        {windows.map((windowItem) => (
          <button
            key={windowItem.id}
            type="button"
            className={`taskbar-window ${windowItem.minimized ? 'is-minimized' : ''}`}
            onClick={() => onFocusWindow(windowItem.id)}
          >
            <AppWindow size={14} />
            <span>{windowItem.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-socials">
        <button type="button" className="taskbar-icon-button" onClick={onToggleAudio} aria-label="Toggle audio">
          {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <Instagram size={16} />
        </a>
        <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <Github size={16} />
        </a>
        <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="X">
          <Twitter size={16} />
        </a>
        <a href={socials.email} aria-label="Email">
          <Mail size={16} />
        </a>
      </div>
    </div>
  )
}