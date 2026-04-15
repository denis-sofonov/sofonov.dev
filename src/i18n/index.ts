import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      home: 'home',
      main: 'hi',
      about: 'about',
      services: 'what i do',
      process: 'how i do',
      rates: 'rates',
      work: 'work',
      stack: 'what i use',
      now: 'now',
      bookmarks: 'bookmarks',
      contact: 'contact',
    },
    sections: {
      main: 'TITLE',
      about: 'PROFILE',
      services: 'ENGAGEMENT',
      process: 'METHOD',
      work: 'CASES',
      stack: 'TOOLCHAIN',
      contact: 'LINKS',
    },
    activity: {
      prefix: 'here\'s my code',
      link: 'github →',
    },
    bookmarks: {
      title: 'bookmarks',
      subtitle: 'links i save instead of losing them in browser bookmarks. sites, libs, tools, references.',
      all: 'all',
      empty: 'nothing matches — try another tag.',
    },
    now: {
      updated: 'updated april 2026 · moscow',
      intro: 'a snapshot of what I\'m into right now. updated every couple of months.',
      sections: [
        {
          label: 'working on',
          items: [
            'building a no-code automation platform on nuxt 4 from scratch.',
            'bpmn modeler + viewer on bpmn-js / camunda — custom providers, renderers, diff between diagram versions.',
            'no-code form builder with 20+ field types, zod validation, versioned schemas.',
            'drag-and-drop widget system for workspaces, rbac with fine-grained permissions.',
          ],
        },
        {
          label: 'learning',
          items: [
            'python backend — fastapi, sqlalchemy, alembic, postgres, pydantic. building rest apis, writing migrations, getting comfortable with async.',
            'node.js deeper — beyond nuxt\'s nitro layer: express, custom rest servers, cli tools.',
            'moving toward fullstack with vue/nuxt + node + fastapi as the daily trio.',
          ],
        },
        {
          label: 'absorbing',
          items: [
            'web brutalism, post-brutalism, anti-design — the stuff that feels alive.',
            'indie personal sites and type foundries — where design still feels like someone\'s handwriting.',
            'three.js scenes, kinetic typography, playful micro-interactions.',
          ],
        },
        {
          label: 'side',
          items: [
            'this portfolio — a design playground i keep iterating on.',
            'ai / llm tools — mcp servers, daily workflow, not a gimmick.',
          ],
        },
      ],
    },
    aboutSecondary: 'I like the part where a gnarly requirement slowly turns into something obvious. Fewer meetings, more tight feedback loops. Strong opinions on type systems, weak opinions on tabs vs spaces.',
    aboutSignoff: '— denis, moscow',
    viewLive: 'view live',
    rates: {
      tag: 'PRICING',
      year: '2026',
      sheet: 'SHEET 01 / 01',
      rev: 'REV A · DRAFT',
      title: 'RATES',
      subtitle: 'Three engagement modes. Clear ranges. No hidden lines.',
      items: [
        {
          num: '01',
          name: 'CONSULT',
          desc: 'Hourly calls, code reviews, technical audits.',
          note: '1 HOUR MINIMUM · REMOTE',
          price: '€60',
          suffix: '/ H',
        },
        {
          num: '02',
          name: 'PROJECT',
          desc: 'Fixed-scope build with milestone billing.',
          note: 'WRITTEN ESTIMATE · SIGNED UPFRONT',
          price: '€5,000',
          suffix: 'FROM',
        },
        {
          num: '03',
          name: 'RETAINER',
          desc: 'Ongoing iteration, monthly hours bank.',
          note: 'POST-LAUNCH SUPPORT · MONTHLY',
          price: '€2,500',
          suffix: '/ MO',
        },
      ],
      note: 'Every engagement starts with a free 30-minute brief.',
      terms: 'USD · EUR · RUB · SWIFT or WISE',
    },
    process: {
      label: 'how i do',
      title: 'how we build it',
      subtitle: 'Five steps from first call to live product. Simple, predictable, no hidden stuff.',
      stages: [
        {
          name: 'talk',
          desc: 'A 30-min call, no prep needed. You tell me what you want, I listen and ask the right questions. By the end you have a sharper picture of the problem, and we either agree it\'s worth building or part as friends — no pressure.',
          eta: '1 day',
          out: 'aligned brief',
        },
        {
          name: 'plan',
          desc: 'I break the work into milestones with rough dates and fixed prices where possible. One plain doc: every chunk has a defined shape, an estimate, and a clear signal for when it\'s done. No "we\'ll figure it out later".',
          eta: '2-3 days',
          out: 'proposal + timeline',
        },
        {
          name: 'sketch',
          desc: 'Wireframes and flows in Figma. We agree on structure and screens before any code is written. This is where 80% of the ugly surprises surface — a flow that seemed obvious in conversation turns out to need three more screens. Way cheaper to find them here.',
          eta: '1-2 weeks',
          out: 'clickable prototype',
        },
        {
          name: 'build',
          desc: 'Iterative work on a live dev env you can poke at anytime. Weekly demos, typed tested code, green CI all the way through. You see it grow week by week — no "we\'ll show you at the end", no surprise rewrites two weeks before launch.',
          eta: '4-12 weeks',
          out: 'working product',
        },
        {
          name: 'ship',
          desc: 'Deploy to your infra, handover docs, a short call to walk you through what you\'ll touch. Two weeks of free fixes on top — if something breaks in week three, I patch it. No new ticket, no new invoice.',
          eta: '1 week',
          out: 'live product + docs',
        },
      ],
    },
    name: 'hi, i\'m\ndenis',
    role: 'fullstack engineer, moscow',
    experience: '4+ years',
    location: 'moscow',
    heroPitch: 'I build web apps end-to-end — from the first idea to something you can actually click. Frontend, backend, everything in between. One engineer, full ownership.',
    heroStats: { projects: 'projects' },
    heroLabels: {
      availableForHire: 'free for new work',
      focusVal: 'frontend-first fullstack',
      langVal: 'ru — native · en — b2',
    },
    metaBars: {
      about: { name: 'about' },
    },
    switchLang: 'ru',
    theme: {
      light: 'light',
      dark: 'dark',
    },
    statement: 'From a one-page landing to a complex platform — I take it end-to-end. Clean architecture, UI that feels right, a backend that doesn\'t wake you up at 3am. One person who understands the whole picture.',
    whatIBuild: {
      title: 'what i build',
      items: [
        {
          name: 'web apps',
          desc: 'SPAs, SSR apps, admin panels, dashboards, e-commerce — from MVP to production. Full cycle: architecture, UI, API, deploy.',
        },
        {
          name: 'frontend',
          desc: 'Vue 3 / Nuxt, TypeScript, component libraries, design systems, animations, responsive layouts. Pixel-perfect, fast, accessible.',
        },
        {
          name: 'backend & api',
          desc: 'Node.js, Python/FastAPI, PostgreSQL, Redis. REST APIs, auth, real-time with WebSocket. Everything the interface needs to work.',
        },
        {
          name: 'architecture',
          desc: 'Project setup from scratch, CI/CD, code quality, scalable structure. Built so a team can maintain it, not just the author.',
        },
        {
          name: 'support',
          desc: 'Ongoing maintenance for projects I\'ve built — or existing codebases that need steady hands. Bug fixing, performance work, small features, dependency updates.',
        },
        {
          name: 'ui/ux & design',
          desc: 'Interface design without a designer. Responsive layouts, design systems, animations. From Figma mockup to production.',
        },
      ],
    },
    cta: {
      title: 'let\'s work',
      subtitle: 'Got a web app, a platform, or a frontend you\'re worried about? Write me — I\'ll reply.',
    },
    projects: {
      title: 'projects',
      items: [
        {
          name: 'enterprise platform',
          desc: 'Built a complex internal tool from zero as sole frontend architect. Visual editors, form builders, role-based access, OAuth integration.',
          stack: 'Nuxt 4 / TypeScript / OAuth 2.0',
        },
        {
          name: 'e-commerce',
          desc: 'Frontend for a high-traffic platform with millions of users. Modular architecture, internal UI library, admin dashboards.',
          stack: 'Vue 3 / Pinia / SCSS',
        },
        {
          name: 'saas apps',
          desc: 'Multiple web apps delivered end-to-end. Auth systems, complex forms, i18n, responsive UI. Fast delivery, full ownership.',
          stack: 'Vue 3 / TypeScript / REST API',
        },
      ],
    },
    jobs: {
      title: 'where i\'ve worked',
      items: [
        {
          period: '2024 — now',
          company: 'glavnivc',
          role: 'senior frontend engineer',
          desc: 'Sole architect of an enterprise no-code automation platform. Designed the entire system from scratch on Nuxt 4. BPMN process editor, visual form builder, OAuth 2.0 with RBAC. Owned every technical decision, established CI pipelines and code quality standards.',
          metrics: ['0→1 platform', 'sole architect', 'Nuxt 4'],
        },
        {
          period: '2023 — 2024',
          company: 'azbuka vkusa',
          role: 'frontend engineer',
          desc: 'Worked on a high-traffic e-commerce platform. Delivered the full Vue 2→3 migration on production without downtime. Evolved the internal UI component library, built admin dashboards and an interface constructor.',
          metrics: ['Vue 2→3', 'zero downtime', 'millions of users'],
        },
        {
          period: '2022 — 2023',
          company: 'web studio',
          role: 'frontend engineer',
          desc: 'Delivered multiple production apps end-to-end as the sole frontend engineer. Enterprise auth, complex multi-step forms, RBAC, full i18n. Shipped fast, owned everything.',
          metrics: ['end-to-end', 'solo dev', 'fast delivery'],
        },
      ],
    },
    demos: {
      title: 'demo builds',
      disclaimer: 'concept builds for fictional brands — not client work',
      view: 'view live',
      note: 'Three sample builds shown here — more on request.',
      items: [
        {
          name: 'northwind',
          niche: 'b2b saas · analytics',
          desc: 'Modern minimal SaaS landing for an AI-powered analytics product. Dark mode, gradient mesh, animated mockups, scroll-triggered reveals.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/northwind',
        },
        {
          name: 'atelier',
          niche: 'creative · design studio',
          desc: 'Bold creative studio site with custom cursor, hover image reveals on project list, massive marquees and aggressive display typography.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/atelier',
        },
        {
          name: 'lumen',
          niche: 'hospitality · wine bar',
          desc: 'Editorial luxury site for a natural wine bar. Serif typography, warm palette, real photography, sticky scroll storytelling.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/lumen',
        },
      ],
    },
    stack: {
      title: 'what i use',
      subtitle: 'Tools I reach for every day. Four years, forty-plus packages, no surprises.',
      groups: [
        {
          label: 'frontend',
          items: [
            { name: 'JavaScript', note: 'first language, still the one I think in.' },
            { name: 'TypeScript', note: 'no plain JS for me anymore.' },
            { name: 'Vue',        note: 'four years in, still enjoying it.' },
            { name: 'Nuxt',       note: 'the reason I do fullstack from the frontend.' },
            { name: 'Pinia',      note: 'state without the boilerplate.' },
            { name: 'SCSS',       note: 'still the cleanest way to write styles.' },
            { name: 'Tailwind',   note: 'fast prototyping, clean result.' },
            { name: 'Vite',       note: 'ruined every other bundler for me.' },
          ],
        },
        {
          label: 'backend',
          items: [
            { name: 'Node.js',     note: 'when it needs to speak the same language as the frontend.' },
            { name: 'Python',      note: 'for heavier logic and anything AI-adjacent.' },
            { name: 'FastAPI',     note: 'simplest way to stand up an API.' },
            { name: 'PostgreSQL',  note: 'never regretted picking it once.' },
            { name: 'Redis',       note: 'cache, queue, pub/sub — solves too many things.' },
            { name: 'Nginx',       note: 'boring, reliable, never had a bad day with it.' },
            { name: 'WebSocket',   note: 'for when "instant" actually matters.' },
            { name: 'REST API',    note: 'the default — not the best, but the most understood.' },
          ],
        },
        {
          label: 'tools',
          items: [
            { name: 'Git',        note: 'obviously.' },
            { name: 'Docker',     note: 'thanks for killing "works on my machine".' },
            { name: 'Figma',      note: 'where I live when there\'s no designer.' },
            { name: 'Vitest',     note: 'fast. just fast.' },
            { name: 'ESLint',     note: 'keeps me honest.' },
            { name: 'CI/CD',      note: 'green ticks before merge, always.' },
            { name: 'Storybook',  note: 'for when components need to live without context.' },
            { name: 'AI/LLM',     note: 'every day, not a gimmick.' },
          ],
        },
      ],
    },
    links: 'links',
    footer: {
      copyright: '© {year} DS',
    },
    northwind: {
      nav: {
        features: 'Features',
        product: 'Product',
        pricing: 'Pricing',
        docs: 'Docs',
        signin: 'Sign in',
        signup: 'Get started',
      },
      hero: {
        badge: 'Northwind 2.0 — Read the launch post',
        title: 'Product analytics, finally fast.',
        titleAccent: 'finally fast.',
        subtitle: 'Northwind is the analytics platform built for product teams who ship daily. Real-time events, AI queries, zero data engineers required.',
        ctaPrimary: 'Start for free',
        ctaSecondary: 'Book a demo',
        noCard: 'No credit card · Free 50K events / month',
        usedBy: 'TRUSTED BY 12,000+ TEAMS WORLDWIDE',
      },
      stats: {
        eyebrow: 'NUMBERS',
        title: 'Engineered for scale.',
        subtitle: 'Northwind processes billions of events without breaking a sweat.',
        items: [
          { value: '12B+', label: 'Events processed daily' },
          { value: '<200ms', label: 'Median query latency' },
          { value: '99.99%', label: 'Uptime SLA in 2025' },
          { value: '12,000+', label: 'Teams shipping with us' },
        ],
      },
      bento: {
        eyebrow: 'CAPABILITIES',
        title: 'A complete analytics stack. In one place.',
        subtitle: 'Everything you need to understand your users — without stitching ten tools together.',
        cards: {
          live: {
            tag: 'LIVE EVENTS',
            title: 'See what\'s happening. Right now.',
            desc: 'Every user action arrives in your dashboard within 200ms. No batch jobs, no waiting.',
          },
          ai: {
            tag: 'AI QUERIES',
            title: 'Ask in plain English.',
            desc: 'Get charts back. No SQL, no waiting on your data team. Powered by GPT-5 fine-tuned on your schema.',
          },
          funnels: {
            tag: 'FUNNELS',
            title: 'Built-in funnels & retention',
            desc: 'Cohort analysis, retention curves, conversion funnels — configured in two clicks.',
          },
          alerts: {
            tag: 'ALERTS',
            title: 'Get notified when it matters',
            desc: 'Slack, email, webhook. Smart anomaly detection that doesn\'t spam.',
          },
          privacy: {
            tag: 'PRIVACY',
            title: 'GDPR & SOC 2 compliant',
            desc: 'Self-host on your own infra in under 10 minutes. EU & US regions.',
          },
          sdk: {
            tag: 'SDKs',
            title: 'Drop-in libraries',
            desc: 'JavaScript, Swift, Kotlin, Python, Go. Zero config. Auto-instrumented.',
          },
        },
      },
      code: {
        eyebrow: 'DEVELOPER FIRST',
        title: 'Three lines of code. Done.',
        subtitle: 'No yaml, no schemas, no migrations. Drop in our SDK and you\'re tracking events in 30 seconds.',
        tabs: ['JavaScript', 'Python', 'Swift', 'Go'],
      },
      how: {
        eyebrow: 'HOW IT WORKS',
        title: 'From zero to insight in 5 minutes.',
        subtitle: 'No data engineers. No setup calls. No bullshit.',
        steps: [
          {
            num: '01',
            title: 'Install the SDK',
            desc: 'Drop our SDK into your app. JavaScript, Python, Swift, Kotlin, Go — pick your stack.',
          },
          {
            num: '02',
            title: 'Send events',
            desc: 'Track any user action with one line. We auto-detect schemas and types — no config needed.',
          },
          {
            num: '03',
            title: 'Get insights',
            desc: 'Open the dashboard. Ask questions in plain English. Build funnels in two clicks.',
          },
        ],
      },
      testimonials: {
        eyebrow: 'WHAT TEAMS SAY',
        title: 'Loved by product teams everywhere.',
        items: [
          {
            quote: 'Northwind replaced 5 different tools we were paying for. The AI queries alone saved us 20 hours a week.',
            name: 'Sarah Chen',
            role: 'Head of Product, Linear',
          },
          {
            quote: 'I used to wait days for our data team to build dashboards. Now I just ask in English and get charts back instantly.',
            name: 'Marcus Werner',
            role: 'PM, Vercel',
          },
          {
            quote: 'The SDK is the cleanest API I\'ve worked with in years. Three lines and we were tracking everything.',
            name: 'Priya Sharma',
            role: 'Staff Engineer, Notion',
          },
          {
            quote: 'We migrated from Mixpanel in an afternoon. The query speed is genuinely 10x faster — not marketing fluff.',
            name: 'James Okonkwo',
            role: 'CTO, Raycast',
          },
        ],
      },
      pricing: {
        eyebrow: 'PRICING',
        title: 'Pay for what you measure.',
        subtitle: 'No per-seat pricing. No hidden fees. Cancel anytime.',
        plans: [
          {
            name: 'Free',
            price: '$0',
            period: 'forever',
            desc: 'For side projects and early-stage startups.',
            features: ['50K events / month', '1 project', 'Community support', 'Open SDKs', '7-day data retention'],
            cta: 'Start for free',
          },
          {
            name: 'Pro',
            price: '$49',
            period: 'per month',
            desc: 'For teams shipping real products.',
            features: ['5M events / month', 'Unlimited projects', 'AI queries (GPT-5)', 'Slack alerts', 'Priority support', '1-year retention'],
            cta: 'Start 14-day trial',
            highlight: true,
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: 'tailored',
            desc: 'For teams with custom needs.',
            features: ['Unlimited events', 'SSO / SAML / SCIM', 'On-prem deploy', 'SLA & DPA', 'Dedicated CSM', 'Custom retention'],
            cta: 'Talk to sales',
          },
        ],
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Questions? Answered.',
        items: [
          {
            q: 'How is Northwind different from Mixpanel or Amplitude?',
            a: 'Three things: 10x faster queries (sub-200ms median vs 5-10 seconds), AI queries in plain English instead of clunky chart builders, and pricing that doesn\'t punish you for growing.',
          },
          {
            q: 'Can I self-host Northwind?',
            a: 'Yes. We provide a one-line Docker deploy and full Kubernetes Helm charts. Self-host on AWS, GCP, Azure, or your own infra. Available on Pro and Enterprise.',
          },
          {
            q: 'How do you handle GDPR and privacy?',
            a: 'Northwind is GDPR and SOC 2 Type II certified. EU customers can pin data to EU regions. Full DPA available. We never train models on your data.',
          },
          {
            q: 'What happens if I exceed my plan\'s event limit?',
            a: 'We never silently drop events or shut you down. You\'ll get notified at 80% and 100%, and overages are billed at $0.50 per 100K events — no surprises.',
          },
          {
            q: 'Is there a free trial for Pro?',
            a: 'Yes — 14 days, no credit card required. You also get the full Free tier forever, no time limit.',
          },
          {
            q: 'How do I migrate from another tool?',
            a: 'We provide one-click importers for Mixpanel, Amplitude, PostHog, and Segment. Most teams migrate in under an hour.',
          },
        ],
      },
      cta: {
        eyebrow: 'GET STARTED',
        title: 'Stop flying blind.',
        subtitle: 'Get real product insights in 5 minutes. Free forever for up to 50K events / month.',
        button: 'Start for free',
        secondary: 'Talk to sales',
      },
      sticky: {
        eyebrow: 'BUILT FOR PRODUCT TEAMS',
        title: 'Every tool you wished Mixpanel had. None of the bullshit.',
        subtitle: 'Northwind is what happens when product engineers build analytics for themselves.',
        scenes: [
          {
            tag: '01 — REAL-TIME',
            title: 'Events arrive in 200ms.',
            desc: 'Not 5 seconds. Not "eventually consistent". Real-time means real-time.',
          },
          {
            tag: '02 — AI QUERIES',
            title: 'Ask in plain English.',
            desc: 'Stop fighting chart builders. Type a question, get the answer with charts.',
          },
          {
            tag: '03 — INSTANT FUNNELS',
            title: 'Funnels in two clicks.',
            desc: 'Drag steps, set filters, done. No SQL, no setup, no waiting.',
          },
          {
            tag: '04 — SMART ALERTS',
            title: 'Anomaly detection that doesn\'t spam.',
            desc: 'AI watches your metrics 24/7 and pings you only when something actually matters.',
          },
        ],
      },
      compare: {
        eyebrow: 'WHY NORTHWIND',
        title: 'Built different. Priced differently.',
        subtitle: 'See how Northwind compares to legacy analytics tools.',
        cols: ['Feature', 'Northwind', 'Mixpanel', 'Amplitude'],
        rows: [
          { name: 'Real-time events (<200ms)', nw: true, mp: false, am: false },
          { name: 'AI queries in plain English', nw: true, mp: false, am: false },
          { name: 'Self-host on your infra', nw: true, mp: false, am: false },
          { name: 'Open-source SDKs', nw: true, mp: true, am: false },
          { name: 'Built-in funnels & retention', nw: true, mp: true, am: true },
          { name: 'Per-seat pricing', nw: false, mp: true, am: true },
          { name: 'Vendor lock-in', nw: false, mp: true, am: true },
          { name: 'Pricing transparency', nw: true, mp: false, am: false },
        ],
      },
      story: {
        eyebrow: 'CUSTOMER STORY',
        quote: 'We migrated from Mixpanel in an afternoon. Northwind is genuinely 10x faster, and the AI queries replaced our entire data team\'s ad-hoc reporting work.',
        author: 'James Okonkwo',
        role: 'CTO at Raycast',
        metrics: [
          { value: '10×', label: 'Faster queries' },
          { value: '4hrs', label: 'To migrate' },
          { value: '$0', label: 'Per seat' },
        ],
      },
      usecases: {
        eyebrow: 'FOR EVERY ROLE',
        title: 'One platform. Three perspectives.',
        subtitle: 'Northwind speaks to product managers, engineers, and founders — all at once.',
        tabs: [
          {
            label: 'PRODUCT MANAGERS',
            title: 'Ship faster. Measure smarter.',
            desc: 'Track features, run A/B tests, and find growth bottlenecks without bugging your data team.',
            features: [
              'Visual funnels and cohorts',
              'A/B test results in real-time',
              'AI queries for instant answers',
              'Slack alerts on key metrics',
            ],
          },
          {
            label: 'ENGINEERS',
            title: 'A SDK you\'ll actually enjoy.',
            desc: 'Three-line install, type-safe events, schema auto-detection. Self-host if you want to.',
            features: [
              'Open-source SDKs in 6 languages',
              'Self-hostable via Docker / K8s',
              'Type-safe events with TypeScript',
              'Webhook & API for everything',
            ],
          },
          {
            label: 'FOUNDERS',
            title: 'Know your numbers cold.',
            desc: 'Live dashboards for what matters. No analyst required. Investor-ready in 5 minutes.',
            features: [
              'MRR, churn, retention out of the box',
              'Investor dashboard sharing',
              'Custom KPI tracking',
              'Free for early-stage startups',
            ],
          },
        ],
      },
      newsletter: {
        title: 'Build with us.',
        desc: 'Monthly product updates, engineering deep-dives, and customer stories. No spam.',
        button: 'Subscribe',
      },
      pricingToggle: {
        monthly: 'Monthly',
        annual: 'Annual',
        save: 'Save 20%',
      },
    },
    forma: {
      nav: {
        product: 'Product',
        story: 'Story',
        specs: 'Specs',
        support: 'Support',
        cart: 'Cart',
      },
      hero: {
        eyebrow: 'NEW · FORMA ONE',
        title: 'Sound, made personal.',
        sub: 'Forty hours of battery. Adaptive noise cancellation. Custom 40mm beryllium drivers. Designed in Copenhagen.',
        price: '$549',
        priceLabel: 'or 4 × $137.25 with Affirm',
        cta: 'Add to bag',
        secondary: 'Compare models',
        shipping: 'Free shipping · Returns within 30 days',
      },
      ticker: 'AVAILABLE NOW · FREE SHIPPING WORLDWIDE · 30 DAY RETURNS · 2 YEAR WARRANTY · ',
      story: {
        eyebrow: '/ THE STORY',
        scenes: [
          {
            tag: '01 / SOUND',
            title: 'A 40mm driver, made of beryllium.',
            desc: 'Beryllium is lighter and stiffer than aluminium, which means it moves faster and stops sooner. The result is sound that\'s precise without being clinical, warm without being muddy.',
          },
          {
            tag: '02 / SILENCE',
            title: 'Adaptive noise cancellation.',
            desc: 'Six microphones map the noise around you 48,000 times a second. The result: a 32 dB drop in cabin noise on a long flight, and a 28 dB drop in subway clatter.',
          },
          {
            tag: '03 / BATTERY',
            title: 'Forty hours, on a single charge.',
            desc: 'A four-hour movie, eight hours of meetings, three hours of music, and you\'re still at 50%. A five-minute USB-C charge gives you another four hours.',
          },
          {
            tag: '04 / FIT',
            title: 'Memory foam, real leather.',
            desc: 'Hand-stitched real leather over slow-rebound memory foam. After ten minutes you\'ll forget you\'re wearing them. After ten hours you\'ll still be comfortable.',
          },
        ],
      },
      specs: {
        eyebrow: '/ SPECIFICATIONS',
        title: 'Built like instruments. Spec\'d like ones.',
        groups: [
          {
            label: 'AUDIO',
            items: [
              { name: 'Drivers', value: '40mm beryllium' },
              { name: 'Frequency response', value: '4 Hz – 40 kHz' },
              { name: 'Codec support', value: 'aptX Lossless / LDAC / AAC' },
              { name: 'Sound modes', value: 'Studio · Spatial · Adaptive' },
            ],
          },
          {
            label: 'BATTERY',
            items: [
              { name: 'Playback', value: '40 hours (ANC off) / 28 hours (ANC on)' },
              { name: 'Standby', value: '200 hours' },
              { name: 'Quick charge', value: '5 min = 4 hrs playback' },
              { name: 'Full charge', value: '90 minutes via USB-C' },
            ],
          },
          {
            label: 'CONNECTIVITY',
            items: [
              { name: 'Bluetooth', value: '5.4 / Multipoint (3 devices)' },
              { name: 'Wired', value: '3.5mm jack / USB-C lossless' },
              { name: 'Range', value: '15 m line of sight' },
              { name: 'Latency', value: '40 ms (gaming mode)' },
            ],
          },
          {
            label: 'PHYSICAL',
            items: [
              { name: 'Weight', value: '264 g' },
              { name: 'Materials', value: 'Aluminium · Real leather · Memory foam' },
              { name: 'Microphones', value: '6 (4 ANC · 2 voice)' },
              { name: 'Water resistance', value: 'IPX4' },
            ],
          },
        ],
      },
      colors: {
        eyebrow: '/ FOUR FINISHES',
        title: 'Pick the one that disappears into your hand.',
        items: [
          { name: 'Midnight', hex: '#1a1a1d' },
          { name: 'Sand', hex: '#d4c5a8' },
          { name: 'Forest', hex: '#2f3e2f' },
          { name: 'Bone', hex: '#e8e2d4' },
        ],
      },
      box: {
        eyebrow: '/ IN THE BOX',
        title: 'Everything you need. Nothing you don\'t.',
        items: [
          'Forma One headphones',
          'Hard travel case',
          'USB-C charging cable (1.5 m)',
          '3.5mm audio cable (1.2 m)',
          'Airline adapter',
          'Quick start guide',
        ],
      },
      reviews: {
        eyebrow: '/ PRESS',
        items: [
          {
            quote: 'The most refined headphones we\'ve heard this year. Battery life is genuinely the best in class.',
            source: 'WIRED',
            score: '9.2',
          },
          {
            quote: 'Forma sounds like a $1,000 pair of headphones. The fact they\'re $549 is the news here.',
            source: 'The Verge',
            score: '4.5',
          },
          {
            quote: 'Materials are first rate. The leather is real, the aluminium is brushed, and the engineering shows.',
            source: 'Monocle',
            score: '★★★★★',
          },
        ],
      },
      buy: {
        eyebrow: '/ READY?',
        title: 'Hear it for yourself.',
        sub: 'Free shipping. Free returns. Two-year warranty. Try them for 30 days, and if they\'re not for you, send them back.',
        price: '$549',
        cta: 'Add to bag',
      },
      footer: {
        tagline: 'Designed in Copenhagen. Made in Denmark.',
        product: 'Product',
        company: 'Company',
        support: 'Support',
        legal: 'Legal',
        rights: 'All rights reserved.',
      },
    },
    atelier: {
      nav: {
        work: 'Work',
        services: 'Services',
        about: 'Studio',
        contact: 'Contact',
      },
      navStatus: 'Available · Q3 2026',
      hero: {
        eyebrow: '◐ INDEPENDENT DESIGN STUDIO · EST. 2018',
        line1: 'We make',
        line2: 'brands that',
        line3: 'don\'t blend in.',
        sub: 'Atelier is a small, focused studio building digital experiences and brand systems for ambitious teams in tech, fashion, and culture.',
        scroll: 'Scroll to see work',
      },
      marquee1: 'BRANDING · DIGITAL · ART DIRECTION · TYPE · MOTION · ',
      marquee2: 'AVAILABLE FOR Q3 2026 — LET\'S TALK — AVAILABLE FOR Q3 2026 — LET\'S TALK — ',
      about: {
        eyebrow: '/ STUDIO',
        title: 'A small studio with strong opinions.',
        body: 'We don\'t do good-enough. We don\'t do "industry standard". We do work that gets noticed, gets argued about, and gets remembered. Six people. One room. No account managers. The people you meet are the people who do the work.',
      },
      services: {
        eyebrow: '/ WHAT WE DO',
        title: 'Four things, done properly.',
        items: [
          {
            num: '01',
            name: 'Brand identity',
            tags: 'Strategy · Naming · Logo · Type · Guidelines',
            desc: 'Identity systems that work as hard as the team building the company. From naming to typography to launch.',
          },
          {
            num: '02',
            name: 'Digital design',
            tags: 'Web · Product · Mobile · Prototyping',
            desc: 'Websites and product interfaces that feel as good as they look. Designed to ship.',
          },
          {
            num: '03',
            name: 'Art direction',
            tags: 'Campaigns · Editorial · Photography',
            desc: 'Visual direction for campaigns, editorial, and content. We hire the photographers, we set the references, we ship.',
          },
          {
            num: '04',
            name: 'Motion & type',
            tags: '3D · Animation · Custom type',
            desc: 'Custom typefaces, motion systems, and 3D for brands that want to move.',
          },
        ],
      },
      work: {
        eyebrow: '/ SELECTED WORK',
        title: 'Recent work, twenty of forty.',
        items: [
          { name: 'Northwind', tag: 'Brand & Web', year: '2026' },
          { name: 'Lumen Wine Bar', tag: 'Identity & Site', year: '2025' },
          { name: 'Forma Audio', tag: 'E-commerce', year: '2025' },
          { name: 'Halftone Magazine', tag: 'Editorial', year: '2025' },
          { name: 'Fold Studio', tag: 'Identity', year: '2024' },
          { name: 'Parallel Records', tag: 'Art Direction', year: '2024' },
          { name: 'Onset Coffee', tag: 'Brand & Packaging', year: '2024' },
          { name: 'Vault Capital', tag: 'Brand & Web', year: '2023' },
        ],
      },
      process: {
        eyebrow: '/ HOW WE WORK',
        title: 'Four weeks. Four steps. No surprises.',
        items: [
          { num: '01', title: 'Listen', desc: 'A week of conversations. With you, your team, your customers. We come back with a brief.' },
          { num: '02', title: 'Define', desc: 'A week of strategy. Positioning, voice, principles. The boring part that makes the rest possible.' },
          { num: '03', title: 'Make', desc: 'Two weeks of design. We share work in progress, you push back, we iterate together.' },
          { num: '04', title: 'Ship', desc: 'Hand-off, launch, support. We stay around for the launch and the first month after.' },
        ],
      },
      clients: {
        eyebrow: '/ TRUSTED BY',
        title: 'Companies who hired us once and came back.',
      },
      awards: {
        eyebrow: '/ AWARDS & PRESS',
        items: [
          { year: '2025', name: 'Awwwards Site of the Year', source: 'Awwwards' },
          { year: '2025', name: 'Type Directors Club Certificate', source: 'TDC' },
          { year: '2024', name: 'D&AD Wood Pencil — Brand', source: 'D&AD' },
          { year: '2024', name: 'Brand New "Noted" feature', source: 'Brand New' },
          { year: '2023', name: 'Communication Arts Webpick', source: 'Communication Arts' },
          { year: '2023', name: 'CSS Design Awards SOTM', source: 'CSSDA' },
        ],
      },
      contact: {
        eyebrow: '/ NEXT',
        line1: 'Got a project',
        line2: 'worth doing?',
        sub: 'We take on a small number of projects each quarter. If you have a budget, a deadline and a strong opinion — write to us.',
        ctaSecondary: '+1 (646) 555-0119',
      },
      footer: {
        location: 'Brooklyn — Berlin',
        rights: 'All rights reserved.',
      },
    },
    lumen: {
      nav: {
        story: 'Story',
        wine: 'Wine',
        menu: 'Menu',
        events: 'Events',
        visit: 'Visit',
        reserve: 'Reserve',
      },
      hero: {
        eyebrow: 'EST. 2018 · BROOKLYN',
        title: 'Natural wines.\nHonest food.',
        subtitle: 'A small room with a long list. Low-intervention winemakers from the Loire to Etna, served beside seasonal plates from our wood-fired hearth.',
        reserve: 'Reserve a table',
        scroll: 'Scroll',
      },
      intro: {
        eyebrow: 'OUR WAY',
        title: 'Wine made by people, not machines.',
        body: 'Lumen pours wines made the way they\'ve been made for thousands of years — by hand, with native yeasts, without additives or shortcuts. Every bottle on our list comes from a small grower we\'ve met, tasted with, and trusted. The food follows the same rule: short menu, long sourcing, no shortcuts.',
        signature: '— Elena Marchetti, Sommelier',
      },
      philosophy: {
        eyebrow: 'PHILOSOPHY',
        title: 'Three things we care about.',
        items: [
          {
            num: '01',
            title: 'Living wine',
            desc: 'Native yeasts. Zero additives. Minimal sulfur. Wines that change in the glass and tell you where they\'re from.',
          },
          {
            num: '02',
            title: 'Honest food',
            desc: 'Whatever the farmers brought us this week. Cooked simply over wood. Served on plates we bought at flea markets.',
          },
          {
            num: '03',
            title: 'Real people',
            desc: 'No reservations app. Call us. Walk in. We\'ll make space. The room is small, the welcome is large.',
          },
        ],
      },
      wines: {
        eyebrow: 'BY THE GLASS',
        title: 'A small list, deeply considered.',
        subtitle: 'Eight wines pour every week. The list rotates with the seasons and what the producers are sending.',
        categories: [
          {
            name: 'Sparkling & Pet-Nat',
            items: [
              { producer: 'Costadilà', wine: '450 SLM', region: 'Veneto · 2022', glass: '14', bottle: '62' },
              { producer: 'La Garagista', wine: 'Ci Confonde', region: 'Vermont · 2021', glass: '18', bottle: '78' },
            ],
          },
          {
            name: 'White & Orange',
            items: [
              { producer: 'Radikon', wine: 'Sivi', region: 'Friuli · 2019', glass: '22', bottle: '94' },
              { producer: 'Domaine Léon Barral', wine: 'Faugères Blanc', region: 'Languedoc · 2022', glass: '16', bottle: '68' },
              { producer: 'COS', wine: 'Pithos Bianco', region: 'Sicily · 2021', glass: '17', bottle: '72' },
            ],
          },
          {
            name: 'Red',
            items: [
              { producer: 'Frank Cornelissen', wine: 'Susucaru Rosso', region: 'Etna · 2022', glass: '19', bottle: '82' },
              { producer: 'Jean Foillard', wine: 'Morgon Côte du Py', region: 'Beaujolais · 2021', glass: '21', bottle: '88' },
              { producer: 'Le Coste', wine: 'Bianchello', region: 'Lazio · 2020', glass: '24', bottle: '102' },
            ],
          },
        ],
      },
      menu: {
        eyebrow: 'KITCHEN',
        title: 'A short menu. A long supply chain.',
        items: [
          {
            name: 'Burrata',
            desc: 'Puglia burrata, Sungold tomatoes, basil oil, Maldon salt.',
            price: '18',
          },
          {
            name: 'Hand-cut beef tartare',
            desc: 'Aged Wagyu, raw egg yolk, capers, smoked paprika, sourdough.',
            price: '24',
          },
          {
            name: 'Wood-fired branzino',
            desc: 'Whole fish over olive wood, lemon, fennel, salsa verde.',
            price: '38',
          },
          {
            name: 'Cacio e pepe',
            desc: 'Tonnarelli, aged Pecorino Romano, Tellicherry pepper. Just three ingredients, done right.',
            price: '22',
          },
        ],
      },
      pairing: {
        eyebrow: 'SOMMELIER\'S PICK',
        wineLabel: 'Wine of the week',
        wineProducer: 'Frank Cornelissen',
        wineName: 'Susucaru Rosso 2022',
        wineRegion: 'Mount Etna · Sicily',
        wineDesc: 'Light-bodied, electric red from volcanic soils on the slopes of Mount Etna. Drink it slightly chilled with the wood-fired branzino or just on its own with a slice of bread.',
        cta: 'See the full list',
      },
      press: {
        eyebrow: 'PRESS',
        items: [
          {
            quote: 'The most exciting wine room in Brooklyn right now.',
            source: 'The New York Times',
          },
          {
            quote: 'A masterclass in low-intervention everything. The food matters as much as the wine.',
            source: 'Eater NY',
          },
          {
            quote: 'Elena Marchetti might be the best somm in the city, and she pours like she\'s sharing a secret.',
            source: 'Punch',
          },
        ],
      },
      events: {
        eyebrow: 'WHAT\'S ON',
        title: 'Dinners, tastings, winemaker visits.',
        items: [
          {
            date: 'APR 18',
            day: 'Friday',
            title: 'Loire Valley Winemaker Dinner',
            desc: 'Five courses, five Loire wines, the winemaker in the room. 8 seats, $145.',
          },
          {
            date: 'APR 25',
            day: 'Friday',
            title: 'Pet-Nat Tuesday',
            desc: 'Six pet-nats, blind. Find your favorite. Walk-in, $42 per person.',
          },
          {
            date: 'MAY 02',
            day: 'Friday',
            title: 'Etna Vertical Tasting',
            desc: 'Five vintages of Frank Cornelissen Susucaru, side by side. 12 seats, $98.',
          },
        ],
      },
      visit: {
        eyebrow: 'VISIT US',
        title: 'Find us, stay a while.',
        address: '147 Wythe Avenue\nBrooklyn, NY 11211',
        hoursLabel: 'HOURS',
        hours: 'Tuesday — Saturday\n5:00 PM — Late\nClosed Sunday & Monday',
        phoneLabel: 'PHONE',
        phone: '+1 (347) 555-0142',
        emailLabel: 'EMAIL',
        cta: 'Reserve a table',
      },
      footer: {
        tagline: 'A small room with a long list.',
        rights: 'All rights reserved.',
      },
    },
  },
  ru: {
    nav: {
      home: 'главная',
      main: 'привет',
      about: 'обо мне',
      services: 'что я делаю',
      process: 'как я делаю',
      rates: 'цены',
      work: 'работы',
      stack: 'чем я работаю',
      now: 'сейчас',
      bookmarks: 'полезное',
      contact: 'контакт',
    },
    sections: {
      main: 'ТИТУЛ',
      about: 'ПРОФИЛЬ',
      services: 'СОТРУДНИЧЕСТВО',
      process: 'МЕТОД',
      work: 'КЕЙСЫ',
      stack: 'ИНСТРУМЕНТЫ',
      contact: 'КОНТАКТЫ',
    },
    activity: {
      prefix: 'вот мой код',
      link: 'github →',
    },
    bookmarks: {
      title: 'полезное',
      subtitle: 'ссылки, которые сохраняю чтобы не терять в закладках браузера. сайты, либы, тулы, референсы.',
      all: 'все',
      empty: 'по этому тегу пусто — попробуй другой.',
    },
    now: {
      updated: 'обновлено в апреле 2026 · москва',
      intro: 'снимок того, чем я сейчас живу. обновляется раз в пару месяцев.',
      sections: [
        {
          label: 'работаю над',
          items: [
            'строю no-code платформу автоматизации на nuxt 4 с нуля.',
            'bpmn-моделер и viewer на bpmn-js / camunda — кастомные провайдеры, рендереры, diff между версиями диаграмм.',
            'no-code конструктор форм: 20+ типов полей, валидация через zod, версионированные схемы.',
            'drag-and-drop система виджетов для рабочих пространств, rbac с гранулярными правами.',
          ],
        },
        {
          label: 'изучаю',
          items: [
            'python-бэкенд — fastapi, sqlalchemy, alembic, postgres, pydantic. строю rest api, пишу миграции, привыкаю к async.',
            'node.js глубже — за пределами nitro-слоя nuxt: express, свой rest-сервер, cli-инструменты.',
            'иду в сторону fullstack с vue/nuxt + node + fastapi как ежедневной тройкой.',
          ],
        },
        {
          label: 'поглощаю',
          items: [
            'веб-брутализм, post-brutalism, anti-design — то, что ощущается живым.',
            'инди-портфолио и шрифтовые студии — туда, где дизайн ещё ощущается чьим-то почерком.',
            'three.js-сцены, кинетическая типографика, игривые микро-взаимодействия.',
          ],
        },
        {
          label: 'сбоку',
          items: [
            'это портфолио — дизайн-песочница, которую я постоянно переделываю.',
            'ai / llm-инструменты — mcp-серверы, ежедневный воркфлоу, не ради галочки.',
          ],
        },
      ],
    },
    aboutSecondary: 'Мне нравится, когда мутное требование медленно превращается во что-то очевидное. Меньше встреч, больше коротких итераций. Сильные мнения про типы, слабые — про табы или пробелы.',
    aboutSignoff: '— денис, москва',
    viewLive: 'смотреть',
    rates: {
      tag: 'ЦЕНЫ',
      year: '2026',
      sheet: 'SHEET 01 / 01',
      rev: 'REV A · DRAFT',
      title: 'ЦЕНЫ',
      subtitle: 'Три формата сотрудничества. Чёткие вилки. Без скрытых строк.',
      items: [
        {
          num: '01',
          name: 'КОНСУЛЬТАЦИЯ',
          desc: 'Созвоны, код-ревью, технический аудит.',
          note: 'МИНИМУМ 1 ЧАС · УДАЛЁННО',
          price: '6 000 ₽',
          suffix: '/ Ч',
        },
        {
          num: '02',
          name: 'ПРОЕКТ',
          desc: 'Фикс-скоуп с оплатой по вехам.',
          note: 'ПИСЬМЕННАЯ ОЦЕНКА · ПОДПИСАНА ЗАРАНЕЕ',
          price: '500 000 ₽',
          suffix: 'ОТ',
        },
        {
          num: '03',
          name: 'АБОНЕМЕНТ',
          desc: 'Постоянное развитие, месячный банк часов.',
          note: 'ПОДДЕРЖКА ПОСЛЕ ЗАПУСКА · МЕСЯЧНО',
          price: '250 000 ₽',
          suffix: '/ МЕС',
        },
      ],
      note: 'Любой формат начинается с бесплатного 30-минутного брифа.',
      terms: 'РУБ · USD · EUR · СБП, SWIFT или WISE',
    },
    process: {
      label: 'как я делаю',
      title: 'как мы это сделаем',
      subtitle: 'Пять шагов от первого созвона до живого продукта. Просто, предсказуемо, без скрытых штук.',
      stages: [
        {
          name: 'созвон',
          desc: '30 минут на звонке, готовиться не нужно. Рассказываешь что хочешь — я слушаю и задаю правильные вопросы. К концу у тебя появится более чёткая картина задачи, а мы либо договоримся что это стоит делать, либо разойдёмся по-хорошему — без давления.',
          eta: '1 день',
          out: 'согласованный бриф',
        },
        {
          name: 'план',
          desc: 'Разбиваю работу на вехи с примерными сроками и фиксированной ценой где это возможно. Обычный документ: у каждого куска есть форма, оценка и сигнал по которому видно что он закрыт. Никаких «разберёмся по ходу».',
          eta: '2-3 дня',
          out: 'коммерческое предложение',
        },
        {
          name: 'макет',
          desc: 'Wireframes и потоки в Figma. Договариваемся о структуре и экранах до того как появится код. Здесь всплывает 80% неприятных сюрпризов — флоу который казался очевидным, требует ещё трёх экранов. Найти это тут в десять раз дешевле.',
          eta: '1-2 недели',
          out: 'кликабельный прототип',
        },
        {
          name: 'сборка',
          desc: 'Итеративная разработка на dev-окружении, доступ в любой момент. Еженедельные демо, типизированный код с тестами, зелёная CI до самого релиза. Ты видишь как продукт растёт неделя за неделей — никаких «покажем в конце», никаких переписываний за две недели до запуска.',
          eta: '4-12 недель',
          out: 'работающий продукт',
        },
        {
          name: 'релиз',
          desc: 'Деплой на вашу инфру, документация, короткий созвон-передача по тому чем ты будешь пользоваться. Сверху — две недели бесплатных правок: если что-то сломается на третьей неделе, я чиню. Без нового тикета и нового счёта.',
          eta: '1 неделя',
          out: 'живой продукт + доки',
        },
      ],
    },
    name: 'привет,\nя денис',
    role: 'fullstack-инженер, москва',
    experience: '4+ года',
    location: 'москва',
    heroPitch: 'Собираю веб-приложения от первой идеи до того, на что можно нажать. Фронт, бэк, всё между ними. Один инженер — от и до.',
    heroStats: { projects: 'проектов' },
    heroLabels: {
      availableForHire: 'открыт к работе',
      focusVal: 'frontend-first fullstack',
      langVal: 'ru — родной · en — b2',
    },
    metaBars: {
      about: { name: 'обо мне' },
    },
    switchLang: 'en',
    theme: {
      light: 'светлая',
      dark: 'тёмная',
    },
    statement: 'От одного лендинга до сложной платформы — беру целиком. Чистая архитектура, UI, который приятно трогать, и бэкенд, который не будит в три ночи. Один человек, который держит картину в голове.',
    whatIBuild: {
      title: 'что я делаю',
      items: [
        {
          name: 'веб-приложения',
          desc: 'SPA, SSR, админки, дашборды, e-commerce — от MVP до продакшна. Полный цикл: архитектура, UI, API, деплой.',
        },
        {
          name: 'фронтенд',
          desc: 'Vue 3 / Nuxt, TypeScript, компонентные библиотеки, дизайн-системы, анимации, адаптив. Pixel-perfect, быстро, доступно.',
        },
        {
          name: 'бэкенд и api',
          desc: 'Node.js, Python/FastAPI, PostgreSQL, Redis. REST API, авторизация, real-time через WebSocket. Всё, что нужно интерфейсу для работы.',
        },
        {
          name: 'архитектура',
          desc: 'Проект с нуля, CI/CD, качество кода, масштабируемая структура. Строится так, чтобы команда могла поддерживать, а не только автор.',
        },
        {
          name: 'поддержка',
          desc: 'Сопровождение проектов, которые я собрал, или существующих кодовых баз. Баг-фиксинг, оптимизация, мелкие фичи, обновление зависимостей.',
        },
        {
          name: 'ui/ux и дизайн',
          desc: 'Дизайн интерфейсов без дизайнера. Адаптивная вёрстка, дизайн-системы, анимации. От макета в Figma до продакшна.',
        },
      ],
    },
    cta: {
      title: 'давайте поработаем',
      subtitle: 'Нужно приложение, платформа или фронтенд, за который не стыдно? Напишите — отвечу.',
    },
    projects: {
      title: 'проекты',
      items: [
        {
          name: 'корпоративная платформа',
          desc: 'Сложный внутренний инструмент с нуля как единственный фронтенд-архитектор. Визуальные редакторы, конструкторы форм, ролевой доступ, OAuth.',
          stack: 'Nuxt 4 / TypeScript / OAuth 2.0',
        },
        {
          name: 'e-commerce',
          desc: 'Фронтенд для высоконагруженной платформы с миллионами пользователей. Модульная архитектура, внутренняя UI-библиотека, админ-панели.',
          stack: 'Vue 3 / Pinia / SCSS',
        },
        {
          name: 'saas-приложения',
          desc: 'Несколько веб-приложений от и до. Системы авторизации, сложные формы, i18n, адаптивный UI. Быстрая поставка, полная ответственность.',
          stack: 'Vue 3 / TypeScript / REST API',
        },
      ],
    },
    jobs: {
      title: 'где я работал',
      items: [
        {
          period: '2024 — сейчас',
          company: 'главнивц',
          role: 'senior frontend engineer',
          desc: 'Единственный архитектор enterprise no-code платформы автоматизации. Спроектировал всю систему с нуля на Nuxt 4. BPMN-редактор, визуальный конструктор форм, OAuth 2.0 с RBAC. Все технические решения, CI-пайплайны и стандарты качества.',
          metrics: ['0→1 платформа', 'единственный архитектор', 'Nuxt 4'],
        },
        {
          period: '2023 — 2024',
          company: 'азбука вкуса',
          role: 'frontend engineer',
          desc: 'Работал над высоконагруженной e-commerce платформой. Провёл полную миграцию Vue 2→3 на продакшне без даунтайма. Развивал внутреннюю UI-библиотеку, создал админ-панели и конструктор интерфейсов.',
          metrics: ['Vue 2→3', 'без даунтайма', 'миллионы пользователей'],
        },
        {
          period: '2022 — 2023',
          company: 'веб-студия',
          role: 'frontend engineer',
          desc: 'Единолично вывел в прод несколько приложений от и до. Enterprise-авторизация, сложные многошаговые формы, ролевой доступ, полная i18n-поддержка. Быстрая поставка, полная ответственность.',
          metrics: ['от и до', 'соло', 'быстрая поставка'],
        },
      ],
    },
    demos: {
      title: 'demo builds',
      disclaimer: 'концепты для вымышленных брендов — не клиентская работа',
      view: 'смотреть',
      note: 'Показаны три пример-билда — остальные пришлю по запросу.',
      items: [
        {
          name: 'northwind',
          niche: 'b2b saas · аналитика',
          desc: 'Современный минималистичный SaaS-лендинг для AI-аналитического продукта. Dark mode, gradient mesh, анимированные mockup, scroll-triggered анимации.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/northwind',
        },
        {
          name: 'atelier',
          niche: 'creative · дизайн-студия',
          desc: 'Bold creative studio с кастомным курсором, hover-реveals на списке проектов, гигантскими marquees и агрессивной display-типографикой.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/atelier',
        },
        {
          name: 'lumen',
          niche: 'hospitality · винный бар',
          desc: 'Editorial luxury сайт для бара натуральных вин. Serif типографика, тёплая палитра, реальная фотография, sticky scroll сторителлинг.',
          stack: 'Vue 3 / TS / GSAP / SCSS',
          href: '/work/lumen',
        },
      ],
    },
    stack: {
      title: 'чем я работаю',
      subtitle: 'Инструменты, к которым тянусь каждый день. Четыре года, 40+ пакетов, без сюрпризов.',
      groups: [
        {
          label: 'frontend',
          items: [
            { name: 'JavaScript', note: 'первый язык, на нём до сих пор думаю.' },
            { name: 'TypeScript', note: 'без него уже не пишу.' },
            { name: 'Vue',        note: 'четыре года, не надоедает.' },
            { name: 'Nuxt',       note: 'единственная причина делаю fullstack от фронта.' },
            { name: 'Pinia',      note: 'state без boilerplate.' },
            { name: 'SCSS',       note: 'всё ещё самый чистый способ писать стили.' },
            { name: 'Tailwind',   note: 'быстрое прототипирование, чистый результат.' },
            { name: 'Vite',       note: 'теперь любой другой bundler ощущается медленным.' },
          ],
        },
        {
          label: 'backend',
          items: [
            { name: 'Node.js',     note: 'когда он говорит на том же языке что и фронт.' },
            { name: 'Python',      note: 'для тяжёлой логики и всего ai-смежного.' },
            { name: 'FastAPI',     note: 'самый простой способ поднять api.' },
            { name: 'PostgreSQL',  note: 'ни разу не пожалел что выбрал.' },
            { name: 'Redis',       note: 'кэш, очередь, pub/sub — решает слишком много задач.' },
            { name: 'Nginx',       note: 'скучный, надёжный, не помню плохого дня.' },
            { name: 'WebSocket',   note: 'когда «прямо сейчас» действительно важно.' },
            { name: 'REST API',    note: 'дефолт — не лучший, а самый понятный всем.' },
          ],
        },
        {
          label: 'tools',
          items: [
            { name: 'Git',        note: 'ну да.' },
            { name: 'Docker',     note: 'спасибо что убил «у меня работает».' },
            { name: 'Figma',      note: 'тут живу когда нет дизайнера.' },
            { name: 'Vitest',     note: 'быстрый. просто быстрый.' },
            { name: 'ESLint',     note: 'держит меня в рамках.' },
            { name: 'CI/CD',      note: 'зелёные галочки до merge, всегда.' },
            { name: 'Storybook',  note: 'когда компонентам нужно жить без контекста.' },
            { name: 'AI/LLM',     note: 'каждый день, не для галочки.' },
          ],
        },
      ],
    },
    links: 'ссылки',
    footer: {
      copyright: '© {year} дс',
    },
    northwind: {
      nav: {
        features: 'Возможности',
        product: 'Продукт',
        pricing: 'Цены',
        docs: 'Документация',
        signin: 'Войти',
        signup: 'Начать',
      },
      hero: {
        badge: 'Northwind 2.0 — Читать пост о запуске',
        title: 'Продуктовая аналитика, которая наконец-то быстра.',
        titleAccent: 'наконец-то быстра.',
        subtitle: 'Northwind — платформа аналитики для команд, которые катят релизы каждый день. Real-time события, AI-запросы, без дата-инженеров.',
        ctaPrimary: 'Начать бесплатно',
        ctaSecondary: 'Заказать демо',
        noCard: 'Без банковской карты · 50К событий бесплатно',
        usedBy: 'НАМ ДОВЕРЯЮТ 12,000+ КОМАНД ПО ВСЕМУ МИРУ',
      },
      stats: {
        eyebrow: 'ЦИФРЫ',
        title: 'Создан для масштаба.',
        subtitle: 'Northwind обрабатывает миллиарды событий не моргая.',
        items: [
          { value: '12B+', label: 'Событий в день' },
          { value: '<200мс', label: 'Медианная задержка запроса' },
          { value: '99.99%', label: 'Uptime SLA в 2025' },
          { value: '12,000+', label: 'Команд работают с нами' },
        ],
      },
      bento: {
        eyebrow: 'ВОЗМОЖНОСТИ',
        title: 'Полный аналитический стек. В одном месте.',
        subtitle: 'Всё что нужно, чтобы понимать пользователей — без склейки десяти инструментов.',
        cards: {
          live: {
            tag: 'LIVE СОБЫТИЯ',
            title: 'Видите что происходит. Прямо сейчас.',
            desc: 'Каждое действие пользователя в дашборде за 200мс. Без батч-джобов, без задержек.',
          },
          ai: {
            tag: 'AI-ЗАПРОСЫ',
            title: 'Спрашивайте на естественном языке.',
            desc: 'Получайте графики обратно. Без SQL, без ожидания дата-команды. На базе GPT-5, обученного на вашей схеме.',
          },
          funnels: {
            tag: 'ВОРОНКИ',
            title: 'Встроенные воронки и retention',
            desc: 'Когортный анализ, кривые удержания, конверсионные воронки — настройка в два клика.',
          },
          alerts: {
            tag: 'АЛЕРТЫ',
            title: 'Уведомления когда важно',
            desc: 'Slack, email, webhook. Умное определение аномалий, без спама.',
          },
          privacy: {
            tag: 'ПРИВАТНОСТЬ',
            title: 'GDPR и SOC 2 сертификация',
            desc: 'Self-host на своей инфре за 10 минут. EU и US регионы.',
          },
          sdk: {
            tag: 'SDK',
            title: 'Drop-in библиотеки',
            desc: 'JavaScript, Swift, Kotlin, Python, Go. Без конфигурации. Авто-инструментирование.',
          },
        },
      },
      code: {
        eyebrow: 'DEVELOPER FIRST',
        title: 'Три строчки кода. Готово.',
        subtitle: 'Без yaml, без схем, без миграций. Подключите SDK — и через 30 секунд вы трекаете события.',
        tabs: ['JavaScript', 'Python', 'Swift', 'Go'],
      },
      how: {
        eyebrow: 'КАК ЭТО РАБОТАЕТ',
        title: 'От нуля до инсайта за 5 минут.',
        subtitle: 'Без дата-инженеров. Без созвонов на онбординг. Без bullshit\'а.',
        steps: [
          {
            num: '01',
            title: 'Установите SDK',
            desc: 'Подключите наш SDK в приложение. JavaScript, Python, Swift, Kotlin, Go — выберите свой стек.',
          },
          {
            num: '02',
            title: 'Отправляйте события',
            desc: 'Трекайте любое действие пользователя одной строкой. Мы автоматически определяем схемы и типы.',
          },
          {
            num: '03',
            title: 'Получайте инсайты',
            desc: 'Откройте дашборд. Задавайте вопросы на естественном языке. Стройте воронки в два клика.',
          },
        ],
      },
      testimonials: {
        eyebrow: 'ЧТО ГОВОРЯТ КОМАНДЫ',
        title: 'Любим продуктовыми командами по всему миру.',
        items: [
          {
            quote: 'Northwind заменил нам 5 разных инструментов, за которые мы платили. Только AI-запросы экономят нам 20 часов в неделю.',
            name: 'Sarah Chen',
            role: 'Head of Product, Linear',
          },
          {
            quote: 'Я раньше ждал дата-команду по несколько дней чтобы получить дашборд. Теперь просто спрашиваю на английском и сразу получаю графики.',
            name: 'Marcus Werner',
            role: 'PM, Vercel',
          },
          {
            quote: 'SDK — самый чистый API с которым я работал за последние годы. Три строчки и мы трекаем всё.',
            name: 'Priya Sharma',
            role: 'Staff Engineer, Notion',
          },
          {
            quote: 'Мигрировали с Mixpanel за полдня. Скорость запросов реально в 10 раз быстрее — это не маркетинг.',
            name: 'James Okonkwo',
            role: 'CTO, Raycast',
          },
        ],
      },
      pricing: {
        eyebrow: 'ЦЕНЫ',
        title: 'Платите за то, что измеряете.',
        subtitle: 'Без оплаты за пользователей. Без скрытых платежей. Отмена в любой момент.',
        plans: [
          {
            name: 'Free',
            price: '$0',
            period: 'навсегда',
            desc: 'Для пет-проектов и ранних стартапов.',
            features: ['50К событий в месяц', '1 проект', 'Поддержка сообщества', 'Open SDK', '7 дней хранения данных'],
            cta: 'Начать бесплатно',
          },
          {
            name: 'Pro',
            price: '$49',
            period: 'в месяц',
            desc: 'Для команд, которые делают реальные продукты.',
            features: ['5М событий в месяц', 'Без лимита проектов', 'AI-запросы (GPT-5)', 'Slack-алерты', 'Приоритетная поддержка', '1 год хранения'],
            cta: 'Триал на 14 дней',
            highlight: true,
          },
          {
            name: 'Enterprise',
            price: 'По запросу',
            period: 'индивидуально',
            desc: 'Для команд с особыми требованиями.',
            features: ['Без лимита событий', 'SSO / SAML / SCIM', 'On-prem развёртывание', 'SLA и DPA', 'Выделенный CSM', 'Custom retention'],
            cta: 'Связаться с продажами',
          },
        ],
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Вопросы? Ответы.',
        items: [
          {
            q: 'Чем Northwind отличается от Mixpanel или Amplitude?',
            a: 'Три вещи: запросы в 10 раз быстрее (медиана <200мс против 5-10 секунд), AI-запросы на естественном языке вместо громоздких билдеров, и цены, которые не наказывают вас за рост.',
          },
          {
            q: 'Можно ли self-host Northwind?',
            a: 'Да. Мы предоставляем однострочный Docker deploy и полные Kubernetes Helm чарты. Self-host на AWS, GCP, Azure или своей инфре. Доступно на Pro и Enterprise.',
          },
          {
            q: 'Как вы работаете с GDPR и приватностью?',
            a: 'Northwind сертифицирован по GDPR и SOC 2 Type II. EU клиенты могут привязать данные к EU регионам. Полное DPA доступно. Мы никогда не обучаем модели на ваших данных.',
          },
          {
            q: 'Что если я превышу лимит событий тарифа?',
            a: 'Мы никогда молча не дропаем события и не отключаем. Вы получите уведомление на 80% и 100%, переплата — $0.50 за 100К событий. Без сюрпризов.',
          },
          {
            q: 'Есть ли бесплатный триал на Pro?',
            a: 'Да — 14 дней, без банковской карты. Также у вас всегда есть Free тариф навсегда, без ограничения по времени.',
          },
          {
            q: 'Как мигрировать с другого инструмента?',
            a: 'Мы предоставляем импортеры в один клик для Mixpanel, Amplitude, PostHog и Segment. Большинство команд мигрируют за час.',
          },
        ],
      },
      cta: {
        eyebrow: 'НАЧАТЬ',
        title: 'Хватит работать вслепую.',
        subtitle: 'Получите реальные продуктовые инсайты за 5 минут. Бесплатно навсегда до 50К событий в месяц.',
        button: 'Начать бесплатно',
        secondary: 'Связаться с продажами',
      },
      footer: {
        tagline: 'Аналитика для продуктовых команд, а не для дата-команд.',
        product: 'Продукт',
        company: 'Компания',
        resources: 'Ресурсы',
        legal: 'Документы',
        rights: 'Все права защищены.',
      },
      sticky: {
        eyebrow: 'СОЗДАН ДЛЯ ПРОДУКТОВЫХ КОМАНД',
        title: 'Всё чего не хватало в Mixpanel. Без bullshit\'а.',
        subtitle: 'Northwind — это аналитика, которую сделали продуктовые инженеры для себя.',
        scenes: [
          { tag: '01 — REAL-TIME', title: 'События за 200мс.', desc: 'Не 5 секунд. Не "eventually consistent". Real-time значит real-time.' },
          { tag: '02 — AI-ЗАПРОСЫ', title: 'Спрашивайте на естественном языке.', desc: 'Хватит воевать с билдерами графиков. Задайте вопрос — получите ответ с графиками.' },
          { tag: '03 — БЫСТРЫЕ ВОРОНКИ', title: 'Воронки в два клика.', desc: 'Перетащите шаги, задайте фильтры. Готово. Без SQL, без настройки, без ожидания.' },
          { tag: '04 — УМНЫЕ АЛЕРТЫ', title: 'Anomaly detection без спама.', desc: 'AI следит за метриками 24/7 и пингует только когда что-то реально важное.' },
        ],
      },
      compare: {
        eyebrow: 'ПОЧЕМУ NORTHWIND',
        title: 'Сделан иначе. Стоит иначе.',
        subtitle: 'Сравните Northwind с легаси-инструментами аналитики.',
        cols: ['Возможность', 'Northwind', 'Mixpanel', 'Amplitude'],
        rows: [
          { name: 'Real-time события (<200мс)', nw: true, mp: false, am: false },
          { name: 'AI-запросы на естественном языке', nw: true, mp: false, am: false },
          { name: 'Self-host на своей инфре', nw: true, mp: false, am: false },
          { name: 'Open-source SDK', nw: true, mp: true, am: false },
          { name: 'Встроенные воронки и retention', nw: true, mp: true, am: true },
          { name: 'Оплата за пользователей', nw: false, mp: true, am: true },
          { name: 'Vendor lock-in', nw: false, mp: true, am: true },
          { name: 'Прозрачные цены', nw: true, mp: false, am: false },
        ],
      },
      story: {
        eyebrow: 'ИСТОРИЯ КЛИЕНТА',
        quote: 'Мы мигрировали с Mixpanel за полдня. Northwind реально в 10 раз быстрее, а AI-запросы заменили всю работу нашей дата-команды по ad-hoc отчётам.',
        author: 'James Okonkwo',
        role: 'CTO в Raycast',
        metrics: [
          { value: '10×', label: 'Быстрее запросы' },
          { value: '4ч', label: 'На миграцию' },
          { value: '$0', label: 'За пользователя' },
        ],
      },
      usecases: {
        eyebrow: 'ДЛЯ КАЖДОЙ РОЛИ',
        title: 'Одна платформа. Три перспективы.',
        subtitle: 'Northwind говорит на языке продактов, инженеров и фаундеров — одновременно.',
        tabs: [
          {
            label: 'ПРОДАКТЫ',
            title: 'Катите быстрее. Меряйте умнее.',
            desc: 'Трекайте фичи, гоняйте A/B тесты и находите узкие места — не дёргая дата-команду.',
            features: ['Визуальные воронки и когорты', 'Результаты A/B тестов в реальном времени', 'AI-запросы для мгновенных ответов', 'Slack-алерты на ключевые метрики'],
          },
          {
            label: 'ИНЖЕНЕРЫ',
            title: 'SDK, который вам понравится.',
            desc: 'Установка в три строки, типизированные события, авто-определение схем. Self-host если хотите.',
            features: ['Open-source SDK на 6 языках', 'Self-hostable через Docker / K8s', 'Типизированные события с TypeScript', 'Webhook и API на всё'],
          },
          {
            label: 'ФАУНДЕРЫ',
            title: 'Знайте свои метрики наизусть.',
            desc: 'Живые дашборды для главного. Без аналитика. Готов к встрече с инвесторами за 5 минут.',
            features: ['MRR, churn, retention из коробки', 'Шаринг дашбордов для инвесторов', 'Кастомные KPI', 'Бесплатно для ранних стартапов'],
          },
        ],
      },
      newsletter: {
        title: 'Стройте с нами.',
        desc: 'Ежемесячные обновления продукта, инженерные deep-dives и истории клиентов. Без спама.',
        button: 'Подписаться',
      },
      pricingToggle: {
        monthly: 'Помесячно',
        annual: 'Годовая',
        save: '−20%',
      },
    },
    forma: {
      nav: {
        product: 'Продукт',
        story: 'История',
        specs: 'Характеристики',
        support: 'Поддержка',
        cart: 'Корзина',
      },
      hero: {
        eyebrow: 'NEW · FORMA ONE',
        title: 'Звук, сделанный личным.',
        sub: 'Сорок часов автономности. Адаптивное шумоподавление. Кастомные 40-мм бериллиевые драйверы. Спроектировано в Копенгагене.',
        price: '$549',
        priceLabel: 'или 4 × $137.25 через Affirm',
        cta: 'В корзину',
        secondary: 'Сравнить модели',
        shipping: 'Бесплатная доставка · Возврат в течение 30 дней',
      },
      ticker: 'УЖЕ В ПРОДАЖЕ · БЕСПЛАТНАЯ ДОСТАВКА ПО МИРУ · ВОЗВРАТ 30 ДНЕЙ · ГАРАНТИЯ 2 ГОДА · ',
      story: {
        eyebrow: '/ ИСТОРИЯ',
        scenes: [
          {
            tag: '01 / ЗВУК',
            title: '40-мм драйвер из бериллия.',
            desc: 'Бериллий легче и жёстче алюминия — он движется быстрее и останавливается раньше. Результат — звук точный без клиничности, тёплый без мути.',
          },
          {
            tag: '02 / ТИШИНА',
            title: 'Адаптивное шумоподавление.',
            desc: 'Шесть микрофонов сканируют шум вокруг вас 48,000 раз в секунду. Результат: −32 дБ салонного шума на длинном перелёте, −28 дБ грохота метро.',
          },
          {
            tag: '03 / БАТАРЕЯ',
            title: 'Сорок часов на одной зарядке.',
            desc: 'Четырёхчасовое кино, восемь часов созвонов, три часа музыки — и у вас всё ещё 50%. Пять минут зарядки USB-C дают ещё четыре часа.',
          },
          {
            tag: '04 / ПОСАДКА',
            title: 'Memory foam, настоящая кожа.',
            desc: 'Ручной шов из настоящей кожи поверх медленно-восстанавливающегося memory foam. Через десять минут вы забудете, что они на вас. Через десять часов всё ещё будет комфортно.',
          },
        ],
      },
      specs: {
        eyebrow: '/ ХАРАКТЕРИСТИКИ',
        title: 'Сделаны как инструменты. Спецификации того же уровня.',
        groups: [
          {
            label: 'АУДИО',
            items: [
              { name: 'Драйверы', value: '40 мм бериллий' },
              { name: 'Частотный диапазон', value: '4 Гц – 40 кГц' },
              { name: 'Кодеки', value: 'aptX Lossless / LDAC / AAC' },
              { name: 'Режимы звука', value: 'Studio · Spatial · Adaptive' },
            ],
          },
          {
            label: 'БАТАРЕЯ',
            items: [
              { name: 'Воспроизведение', value: '40 ч (ANC выкл) / 28 ч (ANC вкл)' },
              { name: 'Standby', value: '200 часов' },
              { name: 'Быстрая зарядка', value: '5 мин = 4 ч воспроизведения' },
              { name: 'Полная зарядка', value: '90 мин через USB-C' },
            ],
          },
          {
            label: 'СВЯЗЬ',
            items: [
              { name: 'Bluetooth', value: '5.4 / Multipoint (3 устройства)' },
              { name: 'Проводное', value: '3.5 мм jack / USB-C lossless' },
              { name: 'Дальность', value: '15 м прямой видимости' },
              { name: 'Задержка', value: '40 мс (gaming mode)' },
            ],
          },
          {
            label: 'ФИЗИЧЕСКИЕ',
            items: [
              { name: 'Вес', value: '264 г' },
              { name: 'Материалы', value: 'Алюминий · Кожа · Memory foam' },
              { name: 'Микрофоны', value: '6 (4 ANC · 2 голос)' },
              { name: 'Защита', value: 'IPX4' },
            ],
          },
        ],
      },
      colors: {
        eyebrow: '/ ЧЕТЫРЕ ОТДЕЛКИ',
        title: 'Выберите ту, что исчезает в руке.',
        items: [
          { name: 'Midnight', hex: '#1a1a1d' },
          { name: 'Sand', hex: '#d4c5a8' },
          { name: 'Forest', hex: '#2f3e2f' },
          { name: 'Bone', hex: '#e8e2d4' },
        ],
      },
      box: {
        eyebrow: '/ В КОМПЛЕКТЕ',
        title: 'Всё что нужно. И ничего лишнего.',
        items: [
          'Наушники Forma One',
          'Жёсткий travel-кейс',
          'Кабель USB-C для зарядки (1.5 м)',
          'Аудиокабель 3.5 мм (1.2 м)',
          'Авиа-адаптер',
          'Краткое руководство',
        ],
      },
      reviews: {
        eyebrow: '/ ПРЕССА',
        items: [
          {
            quote: 'Самые утончённые наушники, которые мы слышали в этом году. Время автономной работы — лучшее в классе.',
            source: 'WIRED',
            score: '9.2',
          },
          {
            quote: 'Forma звучит как наушники за $1000. То что они стоят $549 — главная новость.',
            source: 'The Verge',
            score: '4.5',
          },
          {
            quote: 'Материалы первоклассные. Кожа настоящая, алюминий браширован, инженерия видна.',
            source: 'Monocle',
            score: '★★★★★',
          },
        ],
      },
      buy: {
        eyebrow: '/ ГОТОВЫ?',
        title: 'Услышьте сами.',
        sub: 'Бесплатная доставка. Бесплатный возврат. Гарантия 2 года. Попробуйте 30 дней — если не подошли, верните.',
        price: '$549',
        cta: 'В корзину',
      },
      footer: {
        tagline: 'Спроектировано в Копенгагене. Сделано в Дании.',
        product: 'Продукт',
        company: 'Компания',
        support: 'Поддержка',
        legal: 'Документы',
        rights: 'Все права защищены.',
      },
    },
    atelier: {
      nav: {
        work: 'Работы',
        services: 'Услуги',
        about: 'Студия',
        contact: 'Контакт',
      },
      navStatus: 'Свободны · Q3 2026',
      hero: {
        eyebrow: '◐ НЕЗАВИСИМАЯ ДИЗАЙН-СТУДИЯ · EST. 2018',
        line1: 'Делаем',
        line2: 'бренды,',
        line3: 'которые видно.',
        sub: 'Atelier — небольшая фокусная студия. Создаём цифровые продукты и брендинг для амбициозных команд из tech, fashion и культуры.',
        scroll: 'Скролл к работам',
      },
      marquee1: 'БРЕНДИНГ · DIGITAL · АРТ-ДИРЕКЦИЯ · ШРИФТ · MOTION · ',
      marquee2: 'СВОБОДНЫ С Q3 2026 — ДАВАЙТЕ ОБСУДИМ — СВОБОДНЫ С Q3 2026 — ДАВАЙТЕ ОБСУДИМ — ',
      about: {
        eyebrow: '/ СТУДИЯ',
        title: 'Маленькая студия с сильным мнением.',
        body: 'Мы не делаем "норм". Мы не делаем "как у всех". Мы делаем работу, которую замечают, о которой спорят, и которую запоминают. Шесть человек. Одна комната. Без аккаунт-менеджеров. С кем встречаетесь — те и работают.',
      },
      services: {
        eyebrow: '/ ЧТО ДЕЛАЕМ',
        title: 'Четыре вещи, сделанные как надо.',
        items: [
          {
            num: '01',
            name: 'Брендинг',
            tags: 'Стратегия · Нейминг · Логотип · Шрифт · Гайдлайны',
            desc: 'Системы идентичности, которые работают так же усердно, как команда, строящая компанию. От нейминга до запуска.',
          },
          {
            num: '02',
            name: 'Цифровой дизайн',
            tags: 'Web · Product · Mobile · Прототипы',
            desc: 'Сайты и продуктовые интерфейсы, которые ощущаются так же хорошо, как выглядят. Спроектированы под ship.',
          },
          {
            num: '03',
            name: 'Арт-дирекция',
            tags: 'Кампании · Editorial · Фотография',
            desc: 'Визуальная дирекция кампаний, editorial и контента. Нанимаем фотографов, задаём референсы, доводим до релиза.',
          },
          {
            num: '04',
            name: 'Motion и шрифт',
            tags: '3D · Анимация · Custom type',
            desc: 'Кастомные шрифты, motion-системы и 3D для брендов, которые хотят двигаться.',
          },
        ],
      },
      work: {
        eyebrow: '/ ИЗБРАННЫЕ РАБОТЫ',
        title: 'Недавние проекты, двадцать из сорока.',
        items: [
          { name: 'Northwind', tag: 'Бренд и сайт', year: '2026' },
          { name: 'Lumen Wine Bar', tag: 'Айдентика и сайт', year: '2025' },
          { name: 'Forma Audio', tag: 'E-commerce', year: '2025' },
          { name: 'Halftone Magazine', tag: 'Editorial', year: '2025' },
          { name: 'Fold Studio', tag: 'Айдентика', year: '2024' },
          { name: 'Parallel Records', tag: 'Арт-дирекция', year: '2024' },
          { name: 'Onset Coffee', tag: 'Бренд и упаковка', year: '2024' },
          { name: 'Vault Capital', tag: 'Бренд и сайт', year: '2023' },
        ],
      },
      process: {
        eyebrow: '/ КАК РАБОТАЕМ',
        title: 'Четыре недели. Четыре шага. Без сюрпризов.',
        items: [
          { num: '01', title: 'Слушаем', desc: 'Неделя разговоров. С вами, командой, клиентами. Возвращаемся с брифом.' },
          { num: '02', title: 'Определяем', desc: 'Неделя стратегии. Позиционирование, голос, принципы. Скучная часть, без которой остального не будет.' },
          { num: '03', title: 'Делаем', desc: 'Две недели дизайна. Делимся работой по ходу, вы возражаете, итерируем вместе.' },
          { num: '04', title: 'Ship', desc: 'Хэндофф, релиз, поддержка. Остаёмся на запуск и первый месяц после.' },
        ],
      },
      clients: {
        eyebrow: '/ ДОВЕРЯЮТ',
        title: 'Компании, которые наняли нас один раз и вернулись.',
      },
      awards: {
        eyebrow: '/ НАГРАДЫ И ПРЕССА',
        items: [
          { year: '2025', name: 'Awwwards Site of the Year', source: 'Awwwards' },
          { year: '2025', name: 'Type Directors Club Certificate', source: 'TDC' },
          { year: '2024', name: 'D&AD Wood Pencil — Brand', source: 'D&AD' },
          { year: '2024', name: 'Brand New "Noted" feature', source: 'Brand New' },
          { year: '2023', name: 'Communication Arts Webpick', source: 'Communication Arts' },
          { year: '2023', name: 'CSS Design Awards SOTM', source: 'CSSDA' },
        ],
      },
      contact: {
        eyebrow: '/ ДАЛЬШЕ',
        line1: 'Есть проект,',
        line2: 'который стоит сделать?',
        sub: 'Мы берём небольшое количество проектов в квартал. Если у вас есть бюджет, дедлайн и сильное мнение — напишите нам.',
        ctaSecondary: '+1 (646) 555-0119',
      },
      footer: {
        location: 'Бруклин — Берлин',
        rights: 'Все права защищены.',
      },
    },
    lumen: {
      nav: {
        story: 'История',
        wine: 'Вина',
        menu: 'Кухня',
        events: 'События',
        visit: 'Адрес',
        reserve: 'Забронировать',
      },
      hero: {
        eyebrow: 'EST. 2018 · BROOKLYN',
        title: 'Натуральные вина.\nЧестная еда.',
        subtitle: 'Маленький зал и длинный лист. Виноделы малой интервенции от Луары до Этны, рядом — сезонные блюда из дровяной печи.',
        reserve: 'Забронировать стол',
        scroll: 'Скролл',
      },
      intro: {
        eyebrow: 'НАШ ПУТЬ',
        title: 'Вино, сделанное людьми, а не машинами.',
        body: 'Lumen наливает вина, сделанные так, как их делали тысячи лет — вручную, на местных дрожжах, без добавок и сокращений. Каждая бутылка из листа — от маленького винодела, с которым мы знакомы лично, пробовали вместе и доверяем. Еда подчиняется тому же правилу: короткое меню, длинная цепочка поставок, никаких компромиссов.',
        signature: '— Елена Маркетти, сомелье',
      },
      philosophy: {
        eyebrow: 'ФИЛОСОФИЯ',
        title: 'Три вещи, которые для нас важны.',
        items: [
          {
            num: '01',
            title: 'Живое вино',
            desc: 'Местные дрожжи. Без добавок. Минимум серы. Вина, которые меняются в бокале и рассказывают, откуда они.',
          },
          {
            num: '02',
            title: 'Честная еда',
            desc: 'То, что фермеры привезли на этой неделе. Готовится просто, на дровах. Подаётся на тарелках с блошиных рынков.',
          },
          {
            num: '03',
            title: 'Настоящие люди',
            desc: 'Никаких приложений для бронирования. Позвоните. Зайдите. Мы найдём вам место. Зал маленький, приём — большой.',
          },
        ],
      },
      wines: {
        eyebrow: 'BY THE GLASS',
        title: 'Маленький лист, глубокое осмысление.',
        subtitle: 'Восемь вин по бокалам каждую неделю. Лист меняется с сезонами и тем, что присылают виноделы.',
        categories: [
          {
            name: 'Игристые и Pet-Nat',
            items: [
              { producer: 'Costadilà', wine: '450 SLM', region: 'Венето · 2022', glass: '14', bottle: '62' },
              { producer: 'La Garagista', wine: 'Ci Confonde', region: 'Вермонт · 2021', glass: '18', bottle: '78' },
            ],
          },
          {
            name: 'Белое и оранжевое',
            items: [
              { producer: 'Radikon', wine: 'Sivi', region: 'Фриули · 2019', glass: '22', bottle: '94' },
              { producer: 'Domaine Léon Barral', wine: 'Faugères Blanc', region: 'Лангедок · 2022', glass: '16', bottle: '68' },
              { producer: 'COS', wine: 'Pithos Bianco', region: 'Сицилия · 2021', glass: '17', bottle: '72' },
            ],
          },
          {
            name: 'Красное',
            items: [
              { producer: 'Frank Cornelissen', wine: 'Susucaru Rosso', region: 'Этна · 2022', glass: '19', bottle: '82' },
              { producer: 'Jean Foillard', wine: 'Morgon Côte du Py', region: 'Божоле · 2021', glass: '21', bottle: '88' },
              { producer: 'Le Coste', wine: 'Bianchello', region: 'Лацио · 2020', glass: '24', bottle: '102' },
            ],
          },
        ],
      },
      menu: {
        eyebrow: 'КУХНЯ',
        title: 'Короткое меню. Длинная цепочка.',
        items: [
          {
            name: 'Буррата',
            desc: 'Буррата из Апулии, томаты Sungold, базиликовое масло, соль Maldon.',
            price: '18',
          },
          {
            name: 'Тартар из говядины',
            desc: 'Выдержанный Wagyu, сырой желток, каперсы, копчёная паприка, сурдо.',
            price: '24',
          },
          {
            name: 'Бранзино из дровяной печи',
            desc: 'Целая рыба над оливковым деревом, лимон, фенхель, сальса верде.',
            price: '38',
          },
          {
            name: 'Cacio e Pepe',
            desc: 'Тоннарелли, выдержанный Pecorino Romano, перец Tellicherry. Три ингредиента, сделано как надо.',
            price: '22',
          },
        ],
      },
      pairing: {
        eyebrow: 'ВЫБОР СОМЕЛЬЕ',
        wineLabel: 'Вино недели',
        wineProducer: 'Frank Cornelissen',
        wineName: 'Susucaru Rosso 2022',
        wineRegion: 'Гора Этна · Сицилия',
        wineDesc: 'Лёгкий, электрический красный с вулканических почв на склонах Этны. Пейте слегка охлаждённым с бранзино или просто с куском хлеба.',
        cta: 'Смотреть весь лист',
      },
      press: {
        eyebrow: 'ПРЕССА',
        items: [
          {
            quote: 'Самый интересный винный зал Бруклина прямо сейчас.',
            source: 'The New York Times',
          },
          {
            quote: 'Мастер-класс минимальной интервенции во всём. Еда здесь важна не меньше вина.',
            source: 'Eater NY',
          },
          {
            quote: 'Елена Маркетти — возможно, лучший сомелье города. Наливает так, будто делится секретом.',
            source: 'Punch',
          },
        ],
      },
      events: {
        eyebrow: 'РАСПИСАНИЕ',
        title: 'Ужины, дегустации, визиты виноделов.',
        items: [
          {
            date: '18 АПР',
            day: 'Пятница',
            title: 'Ужин с виноделом из Луары',
            desc: 'Пять блюд, пять вин Луары, винодел в зале. 8 мест, $145.',
          },
          {
            date: '25 АПР',
            day: 'Пятница',
            title: 'Pet-Nat вечер',
            desc: 'Шесть pet-nat, вслепую. Найдите свой любимый. Без брони, $42 с человека.',
          },
          {
            date: '02 МАЯ',
            day: 'Пятница',
            title: 'Вертикаль Этны',
            desc: 'Пять винтажей Frank Cornelissen Susucaru, бок о бок. 12 мест, $98.',
          },
        ],
      },
      visit: {
        eyebrow: 'НАЙТИ НАС',
        title: 'Зайдите, останьтесь подольше.',
        address: '147 Wythe Avenue\nBrooklyn, NY 11211',
        hoursLabel: 'ЧАСЫ',
        hours: 'Вторник — Суббота\n17:00 — Late\nЗакрыто в воскресенье и понедельник',
        phoneLabel: 'ТЕЛЕФОН',
        phone: '+1 (347) 555-0142',
        emailLabel: 'EMAIL',
        cta: 'Забронировать стол',
      },
      footer: {
        tagline: 'Маленький зал и длинный лист.',
        rights: 'Все права защищены.',
      },
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'ru',
  fallbackLocale: 'en',
  messages,
})
