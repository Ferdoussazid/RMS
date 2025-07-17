<template>
  <RectifierEventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/charge.png" :show-site-name="true">
    {{ title }}: {{ duration }}
  </RectifierEventListItem>
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
      title() {
        return "SITE DOWN"

      },
    },
  }
</script>

<style lang="scss" scoped></style>
