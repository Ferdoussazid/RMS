export default {
  methods: {
    pathto(path) {
      return path
      // const prefix = process.env.NODE_ENV !== 'production' ? '' : '/rms-flex'
      // return prefix + path
    },

    siteListUrl(filter = {}, basePath) {
      let path = basePath
      const query = Object.entries(filter)
        .map(([key, val]) => `${key}=${val}`)
        .join('&')
      if (query.length) {
        path += '?' + query
      }
      return path
    },
  },
}
