<template>
  <EventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/burglar.png" :show-site-name="showSiteName">
    Security breach Alart !
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
