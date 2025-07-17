<template>
  <EventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/chip.png" :show-site-name="showSiteName">
    {{ title }}: {{ duration }}
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
    title() {
      let tenant = this.event.tenant
      let label = 'Device Offline'
      tenant = getTenantLabel(tenant, false)
      if (tenant) {
        label += ` (${tenant})`
      }
      return label
    },
    duration() {
      return getEventDurationFormatted(this.event)
    },
  },
}
</script>

<style lang="scss" scoped></style>
