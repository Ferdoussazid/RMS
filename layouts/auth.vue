<template>
  <div
    class="min-w-screen flex min-h-screen flex-col items-center justify-start bg-blue-600 pt-16 md:justify-center md:pt-0">
    <nuxt />
    <footer class="mt-6 flex flex-col items-center text-sm text-white">
      <p>Hyper Systems Ltd.</p>
      <p>© {{ currentYear }}. All RIGHT RESERVED.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
  head() {
    return {
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui',
        },
        { name: 'description', content: 'Radar RMS' },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          href: '/favicon/apple-touch-icon.png',
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
          href: '/fontawesome5/css/all.css',
        },
      ],
      script: [],
    }
  },
}
</script>
