<template>
  <EventListItem
    :event="event"
    theme="from-blue-500 to-blue-300"
    icon="/icon/generator.svg"
    :show-site-name="showSiteName"
  >
    {{ title }}
  </EventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'
import { getTenantLabel } from '~/assets/js/Helper'

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
      let label = 'DG Running'
      let tenant = this.event.tenant
      if (tenant) {
        tenant = getTenantLabel(tenant, false)
        label += ` (${tenant})`
      }
      return label + ': ' + this.duration
    },
  },
}
</script>

<style lang="scss" scoped></style>
