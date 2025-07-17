<template>
  <div class="">
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/landing/Header.vue'
import Footer from '~/components/landing/Footer.vue'

import utils from '~/mixins/utils'

export default {
  components: { Header, Footer },
  mixins: [utils],
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
          href: this.pathto('/landing/css/animate.css'),
        },
        {
          rel: 'stylesheet',
          href: this.pathto('/landing/css/magnific-popup.css'),
        },
        {
          rel: 'stylesheet',
          href: this.pathto('/landing/css/slick.css'),
        },
        {
          rel: 'stylesheet',
          href: this.pathto('/landing/css/LineIcons.2.0.css'),
        },
        {
          rel: 'stylesheet',
          href: this.pathto('/landing/css/tailwind.css'),
        },
      ],
      script: [
        // {
        //   src: 'https://kit.fontawesome.com/dbd62e07f5.js',
        //   crossorigin: 'anonymous',
        // },
        { src: this.pathto('/landing/js/vendor/jquery-3.5.1-min.js') },
        { src: this.pathto('/landing/js/vendor/modernizr-3.7.1.min.js') },
        { src: this.pathto('/landing/js/plugins.js') },
        { src: this.pathto('/landing/js/particles.min.js') },
        { src: this.pathto('/landing/js/slick.min.js') },
        { src: this.pathto('/landing/js/jquery.easing.min.js') },
        { src: this.pathto('/landing/js/scrolling-nav.js') },
        { src: this.pathto('/landing/js/wow.min.js') },
        { src: this.pathto('/landing/js/main.js') },
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
