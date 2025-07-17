<template>
  <EventListItem
    :event="event"
    theme="from-green-500 to-green-300"
    icon="/icon/door-lock9.svg"
    :show-site-name="showSiteName"
  >
    Lock Closed
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
