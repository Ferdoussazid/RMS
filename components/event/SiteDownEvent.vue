<template>
  <EventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/charge.png" :show-site-name="showSiteName">
    {{ title }}: {{ duration }}
  </EventListItem>
</template>

<script>
import { SITE_TENANT } from '~/assets/js/Constant'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'
import { getTenantLabel } from '~/assets/js/Helper'
import BaseSiteEvent from '~/mixins/BaseSiteEvent'

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
      let tenant = this.event.tenant || SITE_TENANT.BANGLALINK
      let label = 'Site Down'
      tenant = getTenantLabel(tenant, false)
      label += ` (${tenant})`
      return label
    },
  },
}
</script>

<style lang="scss" scoped></style>
