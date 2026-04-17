import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      services: 'what i do',
      stack: 'tools',
      process: 'how i work',
      principles: 'my approach',
      faq: 'faq',
      contacts: 'contacts',
    },
    cta: {
      discuss: 'discuss project',
    },
    contacts: {
      title: 'contacts',
      items: {
        telegram: 'telegram',
        email: 'email',
        github: 'github',
      },
    },
    switchLang: 'ru',
    theme: {
      light: 'light',
      dark: 'dark',
    },
    pageTitle: 'denis sofonov — web developer',
    name: 'hi, i\'m\ndenis',
    role: 'web developer',
    heroBio: 'frontend developer, 4+ years. i\'ve built landing pages, e-commerce platforms, admin panels and internal tools for companies of different sizes. i also do design in figma and work with backend — enough to take a project from concept to production on my own.',
    heroLabels: {
      availableForHire: 'free for new work',
    },
    stack: {
      title: 'tools',
      groups: [
        {
          cat: 'frontend',
          items: ['vue 3', 'nuxt', 'react', 'typescript', 'tailwind', 'scss', 'pinia', 'gsap', 'anime.js'],
        },
        {
          cat: 'backend',
          items: ['node', 'express', 'python', 'fastapi', 'postgres', 'supabase', 'redis'],
        },
        {
          cat: 'design',
          items: ['figma', 'illustrator', 'photoshop', 'framer', 'spline'],
        },
        {
          cat: 'workflow',
          items: ['git', 'github', 'linear', 'vercel', 'vite', 'pnpm', 'docker'],
        },
      ],
    },
    whatIBuild: {
      title: 'what i do',
      includes: 'what you get',
      items: [
        {
          name: 'Landing page',
          desc: 'A single-page site that works as a sales tool. Clear value proposition, strong CTA, fast load. Designed and developed from scratch — no templates.',
          duration: '14–20 days',
          price: 'from $1,200',
          includes: [
            'Unique design in Figma',
            'Responsive development',
            'Animations & micro-interactions',
            'SEO basics & meta tags',
            'Hosting setup & launch',
            'Contact form or integration',
          ],
        },
        {
          name: 'Multi-page site',
          desc: 'A multi-page site for a company or brand. Thought-out structure, clear navigation, room to grow. CMS integration if you want to edit content yourself.',
          duration: '30–45 days',
          price: 'from $2,500',
          includes: [
            'Up to 10 unique pages',
            'Custom design per page',
            'CMS setup (if needed)',
            'Blog or news section',
            'Responsive & cross-browser',
            'Analytics integration',
            'Hosting setup & launch',
          ],
        },
        {
          name: 'E-commerce',
          desc: 'Online stores with product catalog, cart, checkout, and payment. Custom-built or on a platform — depends on the scale and budget.',
          duration: '30–60 days',
          price: 'from $3,000',
          includes: [
            'Product catalog & filters',
            'Shopping cart & checkout',
            'Payment gateway integration',
            'Order management',
            'Responsive design',
            'SEO & performance optimization',
          ],
        },
        {
          name: 'Web app',
          desc: 'Dashboards, admin panels, internal tools, client portals. Complex logic behind a clean, intuitive interface. Built with Vue/Nuxt and a real backend.',
          duration: '45–90 days',
          price: 'from $4,000',
          includes: [
            'Interface design in Figma',
            'Frontend on Vue 3 / Nuxt',
            'Backend API (Node or Python)',
            'Auth & role-based access',
            'Database design',
            'Deployment & CI/CD',
          ],
        },
        {
          name: 'Support & retainer',
          desc: 'Ongoing help for an existing site — bug fixes, content tweaks, small features, security updates. Hourly for one-offs, monthly retainer if you need steady capacity.',
          duration: 'ongoing',
          price: 'from $40/hour',
          includes: [
            'Bug fixes & technical issues',
            'Content & copy updates',
            'Library & security updates',
            'Small feature additions',
            'Performance monitoring',
            'Priority response on retainer',
          ],
        },
      ],
    },
    process: {
      title: 'how i work',
      steps: [
        {
          name: 'Talk',
          desc: 'A short call to understand what you need. I ask the hard questions early so nothing important gets missed. No commitment — just a conversation that tells both of us if it\'s a fit.',
          eta: '1 day',
          out: 'brief',
          does: ['initial scoping', 'goals & constraints', 'fit check'],
        },
        {
          name: 'Plan',
          desc: 'Clear milestones, fixed price, no guesswork. I write up the full scope — pages, features, tech choices — so you know exactly what you\'re buying before anything starts.',
          eta: '2–3 days',
          out: 'proposal',
          does: ['scope definition', 'tech decisions', 'milestone breakdown'],
        },
        {
          name: 'Build',
          desc: 'You see progress every week on a live preview. Feedback, adjustments, next step. No surprises at the end — you watch it come together as it happens.',
          eta: '4–12 weeks',
          out: 'product',
          does: ['weekly previews', 'iterative reviews', 'continuous deployment'],
        },
        {
          name: 'Launch',
          desc: 'Site goes live. I handle the technical setup — DNS, analytics, monitoring — and stay around for two weeks of free fixes for anything that breaks.',
          eta: '1 week',
          out: 'live site',
          does: ['deployment & dns', 'analytics setup', 'two-week warranty'],
        },
      ],
    },
    principles: {
      title: 'my approach',
      items: [
        {
          label: 'first',
          title: 'i dive into your business',
          body: 'I learn what you sell, who your audience is, and how people find you now. Without that, any design or code is just a template.',
        },
        {
          label: 'second',
          title: 'your feedback beats my ideas',
          body: 'If you have a vision, I help you ship it. If not, I propose one — but the final call is always yours. I don\'t argue for the sake of it.',
        },
        {
          label: 'third',
          title: 'plain-english updates, no jargon',
          body: 'I explain decisions in language you can evaluate. No "refactoring the reducer architecture" — you know what\'s happening, why, and what trade-offs were made.',
        },
        {
          label: 'fourth',
          title: 'fewer projects, more focus',
          body: 'I run 2–3 projects at a time, not 5. Each one gets real attention and real hours — not 20% of my bandwidth split across a queue.',
        },
      ],
    },
    faq: {
      title: 'faq',
      items: [
        {
          q: 'How does payment work?',
          a: 'Usually 50% upfront to lock the slot, 50% on launch. For longer projects we split it into milestones. Wire transfer, Wise, or whatever works on your side — I\'ll adapt.',
        },
        {
          q: 'How many revisions do I get?',
          a: 'Unlimited within the agreed scope. I\'d rather iterate until it\'s right than cut corners. Scope changes (new pages, new features) are a separate conversation.',
        },
        {
          q: 'Do you sign an NDA?',
          a: 'Yes, happy to. Send your template or I can provide a simple one. I also keep all in-progress work private by default.',
        },
        {
          q: 'Who owns the code and design?',
          a: 'You do — fully, after final payment. Source files, Figma, repos, everything. I keep the right to show the work in my portfolio unless you ask me not to.',
        },
        {
          q: 'What about after launch?',
          a: 'Two weeks of free fixes for anything broken. After that I offer hourly support or a monthly retainer if you want ongoing updates.',
        },
        {
          q: 'Can you work with my existing team?',
          a: 'Yes. I\'ve worked inside product teams, design teams, and solo. Slack, Linear, GitHub, Figma — whatever you use, I\'ll plug in.',
        },
        {
          q: 'Do you take on small jobs?',
          a: 'Depends on the fit. One-off changes to existing sites — usually no. Small but sharp one-shot builds (a landing, a tool) — yes, absolutely.',
        },
        {
          q: 'Where are you based?',
          a: 'Moscow. I work with clients anywhere — Europe, US, wherever. Async-first, but happy to jump on calls in your timezone.',
        },
      ],
    },
  },
  ru: {
    nav: {
      services: 'что я делаю',
      stack: 'инструменты',
      process: 'как я работаю',
      principles: 'мой подход',
      faq: 'вопросы',
      contacts: 'контакты',
    },
    cta: {
      discuss: 'обсудить проект',
    },
    contacts: {
      title: 'контакты',
      items: {
        telegram: 'телеграм',
        email: 'почта',
        github: 'github',
      },
    },
    switchLang: 'en',
    theme: {
      light: 'светлая',
      dark: 'тёмная',
    },
    pageTitle: 'денис софонов — веб-разработчик',
    name: 'привет,\nя денис',
    role: 'веб-разработчик',
    heroBio: 'фронтенд-разработчик, 4+ года. делал лендинги, e-commerce, админки и внутренние системы для компаний разного масштаба. также работаю с дизайном в figma и бэкендом — достаточно чтобы вести проект от идеи до продакшна целиком.',
    heroLabels: {
      availableForHire: 'открыт к работе',
    },
    stack: {
      title: 'инструменты',
      groups: [
        {
          cat: 'фронтенд',
          items: ['vue 3', 'nuxt', 'react', 'typescript', 'tailwind', 'scss', 'pinia', 'gsap', 'anime.js'],
        },
        {
          cat: 'бэкенд',
          items: ['node', 'express', 'python', 'fastapi', 'postgres', 'supabase', 'redis'],
        },
        {
          cat: 'дизайн',
          items: ['figma', 'illustrator', 'photoshop', 'framer', 'spline'],
        },
        {
          cat: 'процесс',
          items: ['git', 'github', 'linear', 'vercel', 'vite', 'pnpm', 'docker'],
        },
      ],
    },
    whatIBuild: {
      title: 'что я делаю',
      includes: 'что вы получаете',
      items: [
        {
          name: 'Лендинг',
          desc: 'Одностраничный сайт, который работает как инструмент продаж. Чёткое УТП, сильный призыв к действию, быстрая загрузка. Дизайн и код с нуля — без шаблонов.',
          duration: '14–20 дней',
          price: 'от 100 000 ₽',
          includes: [
            'Уникальный дизайн в Figma',
            'Адаптивная вёрстка',
            'Анимации и микро-взаимодействия',
            'Базовое SEO и мета-теги',
            'Настройка хостинга и запуск',
            'Форма обратной связи или интеграция',
          ],
        },
        {
          name: 'Многостраничный сайт',
          desc: 'Мультистраничный сайт для компании или бренда. Продуманная структура, понятная навигация, возможность расти. CMS если нужно редактировать контент самостоятельно.',
          duration: '30–45 дней',
          price: 'от 200 000 ₽',
          includes: [
            'До 10 уникальных страниц',
            'Индивидуальный дизайн каждой страницы',
            'Настройка CMS (при необходимости)',
            'Блог или раздел новостей',
            'Адаптив и кросс-браузерность',
            'Подключение аналитики',
            'Настройка хостинга и запуск',
          ],
        },
        {
          name: 'Интернет-магазин',
          desc: 'Онлайн-магазины с каталогом, корзиной, оплатой. Кастомная разработка или на платформе — зависит от масштаба и бюджета.',
          duration: '30–60 дней',
          price: 'от 250 000 ₽',
          includes: [
            'Каталог товаров и фильтры',
            'Корзина и оформление заказа',
            'Подключение платёжной системы',
            'Управление заказами',
            'Адаптивный дизайн',
            'SEO и оптимизация скорости',
          ],
        },
        {
          name: 'Веб-приложение',
          desc: 'Дашборды, админки, внутренние инструменты, клиентские порталы. Сложная логика за чистым интерфейсом. Vue/Nuxt + настоящий бэкенд.',
          duration: '45–90 дней',
          price: 'от 400 000 ₽',
          includes: [
            'Дизайн интерфейса в Figma',
            'Фронтенд на Vue 3 / Nuxt',
            'Бэкенд API (Node или Python)',
            'Авторизация и роли доступа',
            'Проектирование базы данных',
            'Деплой и CI/CD',
          ],
        },
        {
          name: 'Поддержка и ретейнер',
          desc: 'Постоянная поддержка существующего сайта — баг-фиксы, правки контента, небольшие фичи, обновления безопасности. Почасовая для разовых задач, месячный ретейнер если нужна постоянная ёмкость.',
          duration: 'постоянно',
          price: 'от 3 000 ₽/час',
          includes: [
            'Баг-фиксы и технические проблемы',
            'Правки контента и текстов',
            'Обновления библиотек и безопасности',
            'Добавление небольших фичей',
            'Мониторинг производительности',
            'Приоритетный ответ на ретейнере',
          ],
        },
      ],
    },
    process: {
      title: 'как я работаю',
      steps: [
        {
          name: 'Созвон',
          desc: 'Короткий звонок чтобы понять что нужно. Задаю сложные вопросы сразу, чтобы ничего важного не упустить. Без обязательств — просто разговор, который покажет нам обоим, подходим ли друг другу.',
          eta: '1 день',
          out: 'бриф',
          does: ['первичный скоупинг', 'цели и ограничения', 'проверка совместимости'],
        },
        {
          name: 'План',
          desc: 'Понятные этапы, фиксированная цена, без подводных камней. Расписываю весь объём — страницы, фичи, технологии — чтобы вы точно знали что покупаете до старта.',
          eta: '2–3 дня',
          out: 'предложение',
          does: ['фиксация объёма', 'выбор технологий', 'разбивка по этапам'],
        },
        {
          name: 'Сборка',
          desc: 'Каждую неделю вы видите прогресс на живом превью. Обратная связь, правки, дальше. Никаких сюрпризов в конце — вы наблюдаете как всё складывается в реальном времени.',
          eta: '4–12 недель',
          out: 'продукт',
          does: ['еженедельные превью', 'итеративные ревью', 'непрерывный деплой'],
        },
        {
          name: 'Запуск',
          desc: 'Сайт выходит в свет. Беру на себя техническую часть — DNS, аналитика, мониторинг — и остаюсь на связи две недели для бесплатных правок, если что-то сломалось.',
          eta: '1 неделя',
          out: 'готовый сайт',
          does: ['деплой и dns', 'настройка аналитики', 'две недели гарантии'],
        },
      ],
    },
    principles: {
      title: 'мой подход',
      items: [
        {
          label: 'первое',
          title: 'погружаюсь в ваш бизнес',
          body: 'Разбираюсь, что вы продаёте, кому, и как люди находят вас сейчас. Без этого любой дизайн и код — просто шаблон.',
        },
        {
          label: 'второе',
          title: 'ваши правки важнее моих идей',
          body: 'Если у вас есть видение — помогаю реализовать. Если нет — предлагаю своё, но финальное слово всегда за вами. Не спорю ради споров.',
        },
        {
          label: 'третье',
          title: 'обновления без технического жаргона',
          body: 'Объясняю решения на языке, который можно оценить. Никаких «рефакторим редьюсеры» — вы понимаете, что происходит, зачем, и на какие компромиссы мы идём.',
        },
        {
          label: 'четвёртое',
          title: 'меньше проектов, больше фокуса',
          body: 'Веду 2–3 проекта одновременно, не 5. Каждый получает реальное внимание и реальные часы, а не 20% пропускной способности, размазанной по очереди.',
        },
      ],
    },
    faq: {
      title: 'вопросы',
      items: [
        {
          q: 'Как устроена оплата?',
          a: 'Обычно 50% предоплата — чтобы закрепить слот, 50% на запуске. Для длинных проектов разбиваем на этапы. Перевод, ИП, Wise — подстроюсь под то, как удобно вам.',
        },
        {
          q: 'Сколько правок включено?',
          a: 'В рамках согласованного скоупа — без ограничений. Лучше дожать до нужного вида, чем срезать углы. Новые страницы или фичи — отдельное обсуждение.',
        },
        {
          q: 'Подписываете NDA?',
          a: 'Да, без проблем. Пришлите свой шаблон или я дам простой. В процессе работы ничего не показываю публично без вашего согласия.',
        },
        {
          q: 'Кому принадлежит код и дизайн?',
          a: 'Вам — полностью, после финальной оплаты. Исходники, Figma, репозитории, всё. Оставляю за собой право показывать работу в портфолио, если вы не попросите иначе.',
        },
        {
          q: 'Что после запуска?',
          a: 'Две недели бесплатных правок на случай если что-то сломалось. Дальше — почасовая поддержка или ежемесячный ретейнер, если нужны регулярные обновления.',
        },
        {
          q: 'Можете работать с моей командой?',
          a: 'Да. Работал внутри продуктовых команд, дизайн-команд, и один. Slack, Linear, GitHub, Figma — под любой стек, который у вас.',
        },
        {
          q: 'Берёте мелкие задачи?',
          a: 'Смотря какие. Разовые правки на существующих сайтах — обычно нет. Небольшие, но ёмкие проекты под ключ (лендинг, внутренний инструмент) — да, беру.',
        },
        {
          q: 'Откуда вы?',
          a: 'Москва. Работаю с клиентами где угодно — Европа, США, кто угодно. По умолчанию async, но с удовольствием созвонюсь в вашем часовом поясе.',
        },
      ],
    },
  },
}

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})
