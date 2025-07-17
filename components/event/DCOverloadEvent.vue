<template>
  <EventListItem
    :event="event"
    theme="from-yellow-500 to-yellow-300"
    icon="/icon/energy.png"
    :show-site-name="showSiteName"
  >
    {{ title }}: {{ duration }}
  </EventListItem>
</template>

<script>
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'
import { SITE_TENANT } from '~/assets/js/Constant'
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
      let tenant = this.event.tenant || SITE_TENANT.BANGLALINK
      let label = 'DC Overload'
      tenant = getTenantLabel(tenant, false)
      label += ` (${tenant})`
      return label
    },
  },
}
</script>

<style lang="scss" scoped></style>
