import './caine.css'

const links = {
  instagram: 'https://www.instagram.com/whocaine/',
  tiktok: 'https://www.tiktok.com/@cainekss',
  youtube: 'https://www.youtube.com/@caine2kk',
  soundcloud: 'https://soundcloud.com/static-83801875',
  spotify: 'https://open.spotify.com/search/Caine%20Mars%20feat%20Cope',
  appleMusic: 'https://music.apple.com/us/search?term=Caine%20Mars%20feat%20Cope',
  amazonMusic: 'https://music.amazon.com/search/Caine%20Mars%20feat%20Cope',
}

function LinkButton({ href, children, small = false }) {
  return (
    <a
      className={`caine-button${small ? ' caine-button-small' : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
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
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/static-83801875/mars-feat-cope&color=%23c51111&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false"
          />
        </div>

        <nav className="caine-grid caine-socials" aria-label="Social links">
          <LinkButton href={links.instagram} small>
            Instagram
          </LinkButton>
          <LinkButton href={links.tiktok} small>
            TikTok
          </LinkButton>
          <LinkButton href={links.youtube} small>
            YouTube
          </LinkButton>
        </nav>

        <nav className="caine-grid" aria-label="Music links">
          <LinkButton href={links.soundcloud}>SoundCloud</LinkButton>
          <LinkButton href={links.spotify}>Spotify</LinkButton>
        </nav>

        <nav className="caine-grid" aria-label="More music links">
          <LinkButton href={links.appleMusic}>Apple Music</LinkButton>
          <LinkButton href={links.amazonMusic}>Amazon Music</LinkButton>
        </nav>
      </section>
    </main>
  )
}
