export default {
  methods: {
    getMarkerIconData(status) {
      const defaults = {
        height: 116,
        width: 116,
        scale: 0.3,
      }
      switch (status) {
        case 'red':
          return {
            src: 'https://rms-flex.s3.ap-southeast-1.amazonaws.com/icon/tower_red.png',
            ...defaults,
          }
        case 'orange':
          return {
            src: 'https://rms-flex.s3.ap-southeast-1.amazonaws.com/icon/tower_orange.png',
            ...defaults,
          }
        case 'yellow':
          return {
            src: 'https://rms-flex.s3.ap-southeast-1.amazonaws.com/icon/tower_yellow.png',
            ...defaults,
          }

        default:
          return {
            src: 'https://rms-flex.s3.ap-southeast-1.amazonaws.com/icon/tower_green.png',
            ...defaults,
          }
      }
    },
  },
}
