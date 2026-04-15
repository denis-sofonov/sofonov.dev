export interface Bookmark {
  title: string
  url: string
  desc: string
  tags: string[]
  added?: string
}

// Add / edit / remove — this is your personal curation.
export const bookmarks: Bookmark[] = [
  // DESIGN / REFERENCES
  {
    title: 'awwwards',
    url: 'https://awwwards.com',
    desc: 'галерея сайтов с хорошим дизайном, отсюда беру большинство референсов.',
    tags: ['design', 'ref'],
  },

  // FONTS
  {
    title: 'pangram pangram',
    url: 'https://pangrampangram.com',
    desc: 'бесплатные шрифты с характером: right grotesk, neue montreal, editorial new.',
    tags: ['font', 'foundry'],
  },
  {
    title: 'fontshare',
    url: 'https://fontshare.com',
    desc: 'бесплатная foundry от itf: satoshi, general sans, clash display.',
    tags: ['font', 'foundry'],
  },
  {
    title: 'google fonts',
    url: 'https://fonts.google.com',
    desc: 'базовый источник, отсюда onest, manrope, space mono.',
    tags: ['font'],
  },

  // LIBRARIES / NPM
  {
    title: 'anime.js',
    url: 'https://animejs.com',
    desc: 'лёгкая библиотека анимации, v4 норм. ~12kb gzipped.',
    tags: ['npm', 'animation'],
  },
  {
    title: 'gsap',
    url: 'https://gsap.com',
    desc: 'индустриальный стандарт для сложных таймлайнов и ScrollTrigger.',
    tags: ['npm', 'animation'],
  },
  {
    title: 'three.js',
    url: 'https://threejs.org',
    desc: '3d-движок для веба, без альтернатив.',
    tags: ['npm', '3d'],
  },

  // AI
  {
    title: 'anthropic docs',
    url: 'https://docs.anthropic.com',
    desc: 'claude api, mcp-серверы, tool use — основной источник.',
    tags: ['ai', 'docs'],
  },

  // TOOLS
  {
    title: 'remove.bg',
    url: 'https://remove.bg',
    desc: 'убирает фон с картинки за секунду, без регистрации.',
    tags: ['tool'],
  },
  {
    title: 'squoosh',
    url: 'https://squoosh.app',
    desc: 'оптимизация изображений в браузере, google.',
    tags: ['tool'],
  },
  {
    title: 'coolors',
    url: 'https://coolors.co',
    desc: 'генератор палитр — если нужна быстро и не хочется думать.',
    tags: ['tool', 'design'],
  },
  {
    title: 'codepen',
    url: 'https://codepen.io',
    desc: 'песочница для быстрых экспериментов и референсов html/css/js.',
    tags: ['tool', 'dev'],
  },

  // 3D / INTERACTIVE
  {
    title: 'spline',
    url: 'https://spline.design',
    desc: '3d-редактор в браузере, экспортит в код/scene. бесплатный тариф щедрый.',
    tags: ['3d', 'tool', 'design'],
  },
  {
    title: 'rive',
    url: 'https://rive.app',
    desc: 'интерактивные анимации с state machine, экспорт в web/ios/android.',
    tags: ['animation', 'tool'],
  },
  {
    title: 'lottiefiles',
    url: 'https://lottiefiles.com',
    desc: 'комьюнити и редактор lottie-анимаций, много бесплатных ассетов.',
    tags: ['animation', 'tool', 'asset'],
  },
  {
    title: 'blender',
    url: 'https://blender.org',
    desc: 'бесплатный 3d-комбайн индустриального уровня, десктоп.',
    tags: ['3d', 'tool'],
  },
  {
    title: 'sketchfab',
    url: 'https://sketchfab.com',
    desc: 'библиотека 3d-моделей, много бесплатных с cc-лицензией.',
    tags: ['3d', 'asset'],
  },

  // ASSETS
  {
    title: 'unsplash',
    url: 'https://unsplash.com',
    desc: 'бесплатные фотки в высоком разрешении, без атрибуции.',
    tags: ['asset', 'photo'],
  },
  {
    title: 'pexels',
    url: 'https://pexels.com',
    desc: 'бесплатные фото и видео, unsplash-альтернатива с видосами.',
    tags: ['asset', 'photo', 'video'],
  },
  {
    title: 'phosphor icons',
    url: 'https://phosphoricons.com',
    desc: 'огромная icon-библиотека с разными весами, открытая лицензия.',
    tags: ['asset', 'icons'],
  },
  {
    title: 'lucide',
    url: 'https://lucide.dev',
    desc: 'форк feather icons, чистые и консистентные, npm-пакет.',
    tags: ['asset', 'icons', 'npm'],
  },

  // READING
  {
    title: 'paul graham essays',
    url: 'https://paulgraham.com/articles.html',
    desc: 'эссе про стартапы, код и как думать. читаю по одному в неделю.',
    tags: ['reading'],
  },
]
