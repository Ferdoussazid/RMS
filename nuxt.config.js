export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Radar RMS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },

  env: {
    NODE_ENV: process.env.NODE_ENV,
    TIME_ZONE: process.env.TIME_ZONE,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    MAP_KEY: process.env.MAP_KEY,
    SANDBOX_SITE_ID: '615c4032772c1c001c698d48',
  },

  loading: {
    color: '#3f51b5',
    height: '0px',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/css/app.css',
    '~assets/css/tailwind.css',
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
  ],

  // static: {
  //   prefix: true,
  // },

  // router: {
  //   base: '/rms-flex/',
  // },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/icons',
    '@/plugins/utils',
    '@/plugins/lodash',
    { src: '@/plugins/bus', mode: 'client' },
    { src: '@/plugins/tooltip', mode: 'client' },
    { src: '@/plugins/gis', mode: 'client' },
    { src: '@/plugins/calendar', mode: 'client' },
    { src: '@/plugins/apexchart', mode: 'client' },
    { src: '@/plugins/daterange', mode: 'client' },
    { src: '@/plugins/element-ui', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    '@nuxt/postcss8',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // '@nuxtjs/onesignal',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseUrl: '/api'
    baseUrl: process.env.API_URL,
    // proxyHeaders: false,
    // credentials: false,
    // proxy: true,
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/welcome',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          maxAge: 5 * 60 * 60, // 5 hours
          global: true,
          type: 'Bearer',
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 24 * 60 * 60, // 24 hours
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: `${process.env.API_URL}/user/auth/login`, method: 'post' },
          refresh: { url: `${process.env.API_URL}/user/auth/refresh`, method: 'post' },
          user: { url: `${process.env.API_URL}/user/auth/user`, method: 'get' },
          logout: { url: `${process.env.API_URL}/user/auth/logout`, method: 'post' },
        },
        autoLogout: false,
      },
    },
  },

  oneSignal: {
    filesPath: '', // set to your path if you put worker files into a subdir, for example '/_push_/onesignal/'
    workerFile: 'OneSignalSDKWorker.js',
    updaterFile: 'OneSignalSDKUpdaterWorker.js',
    swParams: {
      // scope: '/_push_/onesignal/' // set to an empty string ('') if you want OneSignal to be your main worker
      scope: '', // set to an empty string ('') if you want OneSignal to be your main worker
    },
    init: {
      appId: 'f0c58946-34dd-498a-9046-25c5350db503',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true,
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  toast: {
    position: 'top-center',
    duration: 3000,
    register: [
      // Register custom toasts
    ],
  },

  serverMiddleware: [
    // API middleware
    '~/api/app.js',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },

    // loaders: {
    //   vue: {
    //     prettify: true,
    //   },
    // },
  },
}
