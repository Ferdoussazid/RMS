<template>
  <div class="app-container flex min-h-screen min-w-full flex-row-reverse bg-cover bg-fixed">
    <WebsocketClient />

    <div class="flex w-full flex-col items-stretch gap-y-2 p-4">
      <nuxt />
    </div>

    <div
      id="sidemenu"
      class="fixed inset-y-0 left-0 isolate z-[1000] min-h-screen w-full -translate-x-full rounded-none bg-white/80 shadow-md backdrop-blur-sm backdrop-filter transition duration-300 ease-in-out md:flex md:w-3/12 md:flex-col md:rounded-r-2xl lg:w-2/12"
    >
      <div class="flex h-full w-full flex-col items-stretch">
        <div
          class="relative mt-5 flex h-16 w-full cursor-pointer flex-row items-center justify-start space-x-1 py-4 px-4 md:py-0"
        >
          <div class="flex justify-center gap-4">
            <img class="h-10 w-auto shrink-0" :src="logo" title="Radar RMS" />
          </div>

          <button
            class="absolute right-6 top-1/2 -translate-y-1/2 transform text-gray-500"
            @click="controlDrawerMenu('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <AppMenu />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  data() {
    return {
      siteSpecificRoutes: [
        '/site',
        '/alarm',
        '/oem/data',
        '/access',
        '/mains',
        '/battery',
        '/generator',
        '/temperature',
        '/report',
        '/settings',
      ],
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'apple-touch-icon',
          href: this.pathto('/favicon/apple-touch-icon.png'),
        },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: true,
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap',
        },
        {
          rel: 'stylesheet',
          href: this.pathto('/fontawesome5/css/all.css'),
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['token', 'jwtToken']),
    ...mapGetters('site', ['sites']),
    logo() {
      return this.$auth.user?.logo || '/image/hsl-logo.png'
    },
    isVisitingSiteSpecificRoute() {
      return this.siteSpecificRoutes.includes(this.$route.path)
    },
  },

  mounted() {
    this.menu = document.querySelector('#sidemenu')
    this.$bus.$on('drawer', this.controlDrawerMenu.bind(this))
    this.$store.dispatch('device-vendor/fetchDeviceVendors')
  },
  methods: {
    controlDrawerMenu(action) {
      const targetClass = '-translate-x-full'
      if (action === 'open') {
        this.menu.classList.remove(targetClass)
      } else if (action === 'close') {
        this.menu.classList.add(targetClass)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
