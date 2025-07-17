import SiteMarker from '~/mixins/SiteMarker'

export default {
  mixins: [SiteMarker],
  props: {
    origin: {
      type: Object,
      required: true,
    },
    scale: {
      type: Number,
      default: 1.0,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    currentPosition: null,
    currentAngle: 0,
    targetAngle: 0,
    rotationTask: null,
    imageSrc: '',
  }),
  computed: {
    hasClickListener() {
      return this.$listeners && this.$listeners.click
    },
    hasDragListener() {
      return this.$listeners && this.$listeners.drag
    },
    hasDragendListener() {
      return this.$listeners && this.$listeners.dragend
    },
  },
  mounted() {
    this.initMarker(this.origin)
  },
  beforeDestroy() {
    this.marker.setMap(null)
  },
  methods: {
    getId() {
      return this.origin.uid
    },
    redraw() {
      this.marker.setMap(null)
      this.initMarker(this.origin)
    },
    initMarker(data) {
      this.marker = this.createMarker(data)
      this.info = new window.google.maps.InfoWindow({ content: this.origin.name })
      this.marker.addListener('click', this.showPopup.bind(this))

      if (this.hasClickListener) {
        this.marker.addListener('click', this.onClick.bind(this))
      }
      if (this.hasDragListener) {
        this.marker.addListener('drag', this.onDrag.bind(this))
      }
      if (this.hasDragendListener) {
        this.marker.addListener('dragend', this.onDragend.bind(this))
      }
    },
    createMarker(origin) {
      this.currentPosition = this.$gis.toLatLng(origin)
      this.targetAngle = origin.angle || 0

      const options = {
        position: this.currentPosition,
        map: this.$parent.getMap(),
        icon: this.getMarkerIcon(origin),
      }

      if (this.draggable === true) {
        options.draggable = true
      }

      return new window.google.maps.Marker(options)
    },
    showPopup() {
      this.info.open(this.$parent.getMap(), this.marker)
    },
    getCurrentLocation() {
      return this.currentPosition
    },
    getMarkerIcon(origin) {
      const iconData = this.getMarkerIconData(origin.status)
      const originalWidth = iconData.width
      const originalHeight = iconData.height

      const scaledWidth = Math.floor(originalWidth * iconData.scale)
      const scaledHeight = Math.floor(originalHeight * iconData.scale)

      const uniqueMarkerIcon = `${iconData.src}#${this.$vnode.key}`
      this.imageSrc = uniqueMarkerIcon
      return {
        url: uniqueMarkerIcon,
        scaledSize: new window.google.maps.Size(scaledWidth, scaledHeight),
        anchor: new window.google.maps.Point(scaledWidth / 2, scaledHeight / 2),
      }
    },
    onClick(event) {
      this.$emit('click', this.origin, event.latLng)
    },
    onDrag(event) {
      this.$emit('drag', this.origin, event.latLng)
    },
    onDragend(event) {
      this.$emit('dragend', this.origin, event.latLng)
    },
  },
  render: () => null,
}
