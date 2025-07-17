<template>
  <EventListItem :event="event" theme="from-yellow-500 to-yellow-300" icon="/icon/plane.png"
    :show-site-name="showSiteName">
    Aviation Light Fail: {{ duration }}
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
