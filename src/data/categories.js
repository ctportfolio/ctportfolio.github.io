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
        title: 'Direction Board',
        description: 'Add images and videos directly inside this tab. Saved locally in your browser for quick portfolio staging.',
        images: [],
        videos: []
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
    }
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
      { id: 'design-01', title: 'Poster One', image: '', description: 'Replace with your actual work.' }
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
