export default ({ app }, inject) => {
  /**
   * Convert [lng, lat] or {lat, lng} to a google.maps.LatLng object
   */
  inject('gis', {
    toLatLng(val) {
      // return new window.google.maps.LatLng(23.817494, 90.371763)
      if (Array.isArray(val)) {
        return new window.google.maps.LatLng(val[1], val[0])
      }

      if ('lat' in val || 'lng' in val) {
        return new window.google.maps.LatLng(val.lat, val.lng)
      }

      const location = val.location
      if ('lat' in location || 'lng' in location) {
        return new window.google.maps.LatLng(location.lat, location.lng)
      }

      const coordinates = val.location.coordinates
      if (Array.isArray(coordinates)) {
        return new window.google.maps.LatLng(coordinates[1], coordinates[0])
      }

      return new window.google.maps.LatLng(23.817494, 90.371763)
      // throw new Error('data is not castable to google.maps.LatLng')
    },
  })
}
