<template>
  <EventListItem
    :event="event"
    theme="from-red-500 to-red-300"
    icon="/icon/thermometer5.png"
    :show-site-name="showSiteName"
  >
    Above {{ event.meta.threshold }}&deg;C: {{ duration }}
  </EventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'

export default {
  mixins: [BaseSiteEvent],
  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  computed: {
    duration() {
      return getEventDurationFormatted(this.event)
    },
  },
}
</script>

<style lang="scss" scoped></style>
