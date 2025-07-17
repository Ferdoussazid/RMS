<template>
  <EventListItem :event="event" theme="from-yellow-500 to-yellow-300" icon="/icon/warning.png" :show-site-name="true">
    {{ title }}: {{ duration }}
  </EventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventColor, getEventDurationFormatted } from '~/assets/js/EventStyle'
import { getSiteEventLabel, getTenantLabel } from '~/assets/js/Helper'

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
      let tenant = this.event.tenant
      let label = getSiteEventLabel(this.event.name)
      if (tenant) {
        tenant = getTenantLabel(tenant, false)
        label += ` (${tenant})`
      }

      return label
    },
    iconbg() {
      const eventColour = getEventColor(this.event.name)
      const bg = eventColour.split('-')[2] || 'yellow'
      return `from-${bg}-500 to-${bg}-300`
    },
  },
}
</script>

<style lang="scss" scoped></style>
