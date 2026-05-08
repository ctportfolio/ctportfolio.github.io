import './caine.css'
import amazonMusicIcon from './amazon-music.png'

const links = {
  instagram: 'https://www.instagram.com/whocaine/',
  tiktok: 'https://www.tiktok.com/@cainekss',
  youtube: 'https://www.youtube.com/@caine2kk',
  soundcloud: 'https://soundcloud.com/caine2?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
  spotify: 'https://open.spotify.com/artist/5a9UAWTi1BMCgdXVFXxmYE?si=RyYuz_YvSIW8us08D6TkxQ',
  appleMusic: 'https://music.apple.com/us/artist/caine/1896343545',
  amazonMusic: 'https://music.amazon.com/artists/B000QJIAZC/caine',
}

const soundcloudEmbedSource =
  'https://soundcloud.com/caine2/mars-feat-cope?si=42e50e3dabb74a6f9b1cf0e55152631d&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'

const icons = {
  instagram: 'https://cdn.simpleicons.org/instagram/FFFFFF',
  tiktok: 'https://cdn.simpleicons.org/tiktok/FFFFFF',
  youtube: 'https://cdn.simpleicons.org/youtube/FFFFFF',
  soundcloud: 'https://cdn.simpleicons.org/soundcloud/FFFFFF',
  spotify: 'https://cdn.simpleicons.org/spotify/FFFFFF',
  appleMusic: 'https://cdn.simpleicons.org/applemusic/FFFFFF',
  amazonMusic: amazonMusicIcon,
}

function LinkButton({ href, label, icon, small = false }) {
  return (
    <a
      className={`caine-button${small ? ' caine-button-small' : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <img src={icon} alt="" aria-hidden="true" />
    </a>
  )
}

export default function Caine() {
  return (
    <main className="caine-page" aria-label="Caine links">
      <section className="caine-panel">
        <img className="caine-logo" src="/images/caine/caine-logo.png" alt="Caine" />

        <div className="caine-release">
          <p>Recent Release</p>
          <iframe
            className="caine-player"
            title="Mars feat. Cope by Caine on SoundCloud"
            scrolling="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudEmbedSource)}&color=%23c51111&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`}
          />
        </div>

        <nav className="caine-grid caine-socials" aria-label="Social links">
          <LinkButton href={links.instagram} label="Instagram" icon={icons.instagram} small />
          <LinkButton href={links.tiktok} label="TikTok" icon={icons.tiktok} small />
          <LinkButton href={links.youtube} label="YouTube" icon={icons.youtube} small />
        </nav>

        <nav className="caine-grid" aria-label="Music links">
          <LinkButton href={links.soundcloud} label="SoundCloud" icon={icons.soundcloud} />
          <LinkButton href={links.spotify} label="Spotify" icon={icons.spotify} />
        </nav>

        <nav className="caine-grid" aria-label="More music links">
          <LinkButton href={links.appleMusic} label="Apple Music" icon={icons.appleMusic} />
          <LinkButton href={links.amazonMusic} label="Amazon Music" icon={icons.amazonMusic} />
        </nav>
      </section>
    </main>
  )
}
