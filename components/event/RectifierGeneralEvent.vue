<template>
  <RectifierEventListItem :event="event" :theme="iconbg" icon="/icon/warning.png" :show-site-name="true">
    {{ title }}: {{ duration }}
  </RectifierEventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted, getRectifierEventColor } from '~/assets/js/EventStyle'
import { getLabelOfRectifierAlarm } from '~/assets/js/RectifierHelper'
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
      let tenant = this.event.tenant
      let label = getLabelOfRectifierAlarm(this.event.name)
      if (tenant) {
        tenant = getTenantLabel(tenant, false)
        label += ` (${tenant})`
      }

      return label
    },
    iconbg() {
      const eventColour = getRectifierEventColor(this.event.name)
      const bg = eventColour.split('-')[2] || 'yellow'
      return `from-${bg}-500 to-${bg}-300`
    },
  },
}
</script>

<style lang="scss" scoped></style>
