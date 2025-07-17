const apiKey = process.env.MAP_KEY

export default {
  props: {
    slim: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    scripts: [
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`,
      `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js`,
      `https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/vendor/markerAnimate.js`,
      `https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/SlidingMarker.min.js`,
    ],
    loadCount: 0,
  }),
  computed: {
    availableScripts() {
      if (this.slim) {
        return [this.scripts[0]]
      }
      return this.scripts
    },
  },
  mounted() {
    if (!process.server) {
      if (typeof google === 'undefined') {
        for (const src of this.availableScripts) {
          const script = document.createElement('script')
          script.onload = this.onScriptLoaded.bind(this)
          script.type = 'text/javascript'
          script.src = src
          script.async = false
          document.head.appendChild(script)
        }
      } else {
        this.$emit('loaded')
      }
    }
  },
  methods: {
    onScriptLoaded() {
      this.loadCount += 1
      if (this.loadCount === this.scripts.length) {
        this.$emit('loaded')
      }
    },
  },
  render: () => null,
}
