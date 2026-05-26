export const categories = [
  {
    id: 'creative-direction',
    title: 'Creative Direction',
    description: 'Campaign concepts, visual worlds, references, videos, and images.',
    icon: '/images/categories/graphics.png',
    emoji: 'CD',
    accent: 'soft-white',
    projects: [
      {
        id: 'creative-01',
        title: 'mars - caine',
        description: 'Creative directed the entirety of this project. Recorded vocals, created both covers (scrapped and released), directed and edited the scrapped music video, mixed and mastered the song, and sent it to DSPs.',
        images: [
          '/images/graphic-design/thumbnails/Mars.png',
          '/images/creative-direction/caine/mars-dsp-release.png'
        ],
        videos: ['/videos/editing/caine/mars-scrapped-video.mp4']
      },
      {
        id: 'creative-02',
        title: 'cashcrosses - caine',
        description: "I, in collaboration with caine, creative directed the release of his debut album 'cashcrosses.' (June 05, 2026). I created covers for the four singles released prior to the album, as well as the album cover, created social media promotional videos for caine, directed, shot and edited the music video for 'BIL2F,' mixed and mastered eight of the tracks. As well as this, I created all scrapped album art when the title was 'caine.'",
        images: [
          '/images/creative-direction/caine/mars-dsp-release.png',
          '/images/creative-direction/caine/2fuckinon-homage.png',
          '/images/creative-direction/caine/cashcrosses.png',
          '/images/creative-direction/caine/bil2f-cover.png',
          '/images/creative-direction/caine/cainecover.png',
          '/images/creative-direction/caine/xans-and-adderall.png',
          '/images/creative-direction/caine/caine-tracks.png',
          '/images/creative-direction/caine/caine-cover.png'
        ],
        videos: [
          '/videos/editing/caine/mars-scrapped-video.mp4',
          '/videos/editing/caine/bil2f-music-video.mp4'
        ],
        audios: [
          '/audio/caine/bil2f-hyperpopmix.wav',
          '/audio/caine/xans-and-adderall.wav'
        ],
        audioTitles: [
          'BIL2F hyperpop mix',
          'xans and adderall'
        ]
      }
    ]
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Selected stills and shoots.',
    icon: '/images/categories/photography.png',
    emoji: '◉',
    accent: 'soft-white',
    projects: [
      { id: 'photo-01', title: 'Marble Mustang', image: '/images/photography/covers/Marble Final.jpg', description: 'Shot of a 2023 Ford Mustang Mach 1, through a marble. Shot on a Canon Rebel T7.' },
      { id: 'photo-02', title: 'Splash', image: '/images/photography/covers/splash.png', description: 'A shot of water splashing out of a cup, like an advertisement, using fast shutter speed. Shot on a Canon Rebel T3.' },
      { id: 'photo-03', title: 'Pilot G-2', image: '/images/photography/covers/Macro.jpg', description: 'A shot of a Pilot G-2 gel pen, using a macro lens. Shot on a Canon Rebel T3.' },
      { id: 'shoot-01', title: 'Metropolitan Museum of Art', images: ['/images/photography/covers/Met1.jpeg',
        '/images/photography/covers/Met2.jpeg', '/images/photography/covers/Met3.jpeg'
      ], description: 'Shots from the Metropolitan Museum of Art in New York, New York.' },
      {
        id: 'shoot-02',
        title: 'Caine SoHo Photoshoot',
        images: [
          '/images/photography/caine-soho/img-1149.jpg',
          '/images/photography/caine-soho/img-1156.jpg',
          '/images/photography/caine-soho/img-1164.jpg'
        ],
        description: "Shots of upcoming artist, caine, leading up to his album 'cashcrosses,' taken in SoHo, New York City."
      },
    ]
  },
  {
    id: 'editing',
    title: 'Editing',
    description: 'Short-form edits and visual work.',
    icon: '/images/categories/editing.png',
    emoji: '▣',
    accent: 'muted-silver',
    projects: [
    {
      id: 'edit-01',
      title: 'SUCK! - Maxon Margiela Edit',
      video: '/videos/editing/suck.MOV',
      description: "TikTok edit by me, paid for by maxon's team."
    },
    {
      id: 'edit-02',
      title: 'Scrapped Percaso Rolling Loud Visuals',
      videos: [
        '/videos/editing/caine/percaso-rolling-loud-01.mp4',
        '/videos/editing/caine/percaso-rolling-loud-02.mp4',
        '/videos/editing/caine/percaso-rolling-loud-03.mp4'
      ],
      description: "Was given the opportunity to create visuals for Percaso's set at Rolling Loud Orlando 2026, however my vision didn't match the vision of Percaso and his team."
    },
    {
      id: 'edit-03',
      title: 'Scrapped Music Video "mars" - caine',
      video: '/videos/editing/caine/mars-scrapped-video.mp4',
      description: 'Unfinished, scrapped music video for "mars" by caine.'
    },
    {
      id: 'edit-04',
      title: 'BIL2F - Caine Music Video',
      video: '/videos/editing/caine/bil2f-music-video.mp4',
      description: 'Directed, shot and edited "BIL2F" by caine.',
      links: [
        {
          label: 'Watch on YouTube',
          href: 'https://www.youtube.com/watch?v=t6FFCVwA-K4',
          type: 'youtube'
        },
        {
          label: 'Listen on Spotify',
          href: 'https://open.spotify.com/track/1a02ubS54ieBIrv3pvRXZx?si=c9e76d2faa7f4876',
          type: 'spotify'
        }
      ]
    },
    ]
  },
  {
    id: 'websites',
    title: 'Websites',
    description: 'Design and build work.',
    icon: '/images/categories/websites.png',
    emoji: '◎',
    accent: 'fog-grey',
    projects: [
      { id: 'web-01', title: 'ubgschool.com', images: ['/images/web/screenshots/UBG1.PNG',
        '/images/web/screenshots/UBG2.PNG',
        '/images/web/screenshots/UBG3.PNG',
        '/images/web/screenshots/UBG4.PNG',
        '/images/web/screenshots/UBG5.PNG',
        '/images/web/screenshots/UBG6.PNG'], 
        description: 'During hybrid schooling, I took on a solo project to create an unblocked gaming website for students. I earned revenue through ad placements and donations, and the site reached over 25,000 daily visitors before eventually getting blocked.',
        live: '',
      github: 'https://github.com/ColeTimlin/coletimlin.github.io'
      },
    ]
  },
  {
    id: 'coding',
    title: 'Coding',
    description: 'Projects, experiments, and builds.',
    icon: '/images/categories/coding.png',
    emoji: '⌘',
    accent: 'slate',
    projects: [
      { id: 'code-01', title: 'GitHub Project', image: '', description: 'Replace with repo, screenshots, and notes.' }
    ]
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Posters, mockups, and Photoshop.',
    icon: '/images/categories/graphics.png',
    emoji: '▤',
    accent: 'dust',
    projects: [
      { id: 'design-01', title: 'Mars by Caine - Cover Art', image: '/images/graphic-design/thumbnails/Mars.png', description: 'Created song cover art for "Mars" by Caine.' },
      { id: 'design-02', title: 'Roblox Game Thumbnail', image: '/images/graphic-design/thumbnails/Roomtopia Thumbnail 1.png', description: 'Created thumbnail for "Roomtopia," a Roblox game.' },
      { id: 'design-03', title: 'Blocks Pyramid', image: '/images/graphic-design/thumbnails/Blocks Skeleton.png', description: 'Created simplistic yet interesting tee-shirt design for "Blocks," a brand I used to run.' }
    ]
  },
  {
    id: 'clothing',
    title: 'Clothing',
    description: 'Mockups, graphics, and garment concepts.',
    icon: '/images/categories/clothing.png',
    emoji: '◒',
    accent: 'charcoal',
    projects: [
      { id: 'cloth-01',
        title: 'Mind Over Matter',
        image: '/images/clothing/mockups/mind-over-matter.png',
        description: 'Pullover hoodie design from mid 2025.' 
      },
      { id: 'cloth-02',
        title: 'Emoji Hoodie',
        image: '/images/clothing/mockups/EmojiPullover.png',
        description: 'Pullover hoodie design from early 2025.' 
      },
      { id: 'cloth-02',
        title: 'Flower Hoodie',
        images: 
        ['/images/clothing/mockups/LiftedFlowerWhite.png',
          '/images/clothing/mockups/LiftedFlowerBlack.png',
          '/images/clothing/mockups/lft black pullover.png',
          '/images/clothing/mockups/lft white pullover.png'
        ],
        description: 'Pullover hoodie design from early 2025.' 
      },
    ]
  },
  {
    id: 'marketing',
    title: 'Social Media Marketing',
    description: 'Growth, strategy, and account work.',
    icon: '/images/categories/smm.png',
    emoji: '♫',
    accent: 'gunmetal',
    projects: [
      {
      id: 'mkt-01',
      title: 'Maxon Margiela',
      videos: ['/videos/editing/suck.MOV',
        '/videos/editing/maxon-huda.mp4'
      ],
      description: "Creating + editing dopaminergic content to drive the release of maxon's 2025 album, 'Filthy.'"
    }
    ]
  },
  {
    id: 'about',
    title: 'About / Contact',
    description: 'Basic info and contact.',
    icon: '/images/categories/about.png',
    emoji: '✉',
    accent: 'ash',
    projects: []
  }
]
