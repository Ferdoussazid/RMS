export default ({ app }, inject) => {
  /**
   * Global event bus
   */
  inject('utils', {
    toTimeDuration: (seconds, { longForm = false, onlyHours = false } = {}) => {
      const minutes = Math.floor(+seconds / 60)
      let label = ''

      const hourUnit = longForm ? ' Hours' : 'hr'
      const minuteUnit = longForm ? ' Minutes' : 'm'

      const hour = Math.floor(minutes / 60)
      if (hour > 0) {
        label += `${hour}${hourUnit} `
        if (onlyHours) return label
      }

      const min = minutes % 60
      if (min > 0 || !label) {
        label += `${min}${minuteUnit}`
      }

      return label
    },
  })
}
