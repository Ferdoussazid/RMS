<template>
  <EventListItem
    :event="event"
    theme="from-yellow-500 to-yellow-300"
    icon="/icon/water.png"
    :show-site-name="showSiteName"
  >
    Water Detected
  </EventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'

export default {
  mixins: [BaseSiteEvent],
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped></style>
