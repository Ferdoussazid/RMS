<template>
  <EventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/card-reader.png"
    :show-site-name="showSiteName">
    Card Reader Fault: {{ duration }}
  </EventListItem>
</template>

<script>
import { getEventDurationFormatted } from '~/assets/js/EventStyle';
import BaseSiteEvent from '~/mixins/BaseSiteEvent';

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
