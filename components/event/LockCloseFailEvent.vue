<template>
  <EventListItem
    :event="event"
    theme="from-red-500 to-red-300"
    icon="/icon/unlocked.png"
    :show-site-name="showSiteName"
  >
    Lock Close Failed
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
}
</script>

<style lang="scss" scoped></style>
