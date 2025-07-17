<template>
  <EventListItem
    :event="event"
    theme="from-red-500 to-red-300"
    icon="/icon/low-battery.png"
    :show-site-name="showSiteName"
  >
    {{ title }}: {{ duration }}
  </EventListItem>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'
import { SITE_TENANT } from '~/assets/js/Constant'
import { getCompanySpecificEventLabel, getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [BaseSiteEvent],
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['companyName']),
    duration() {
      return getEventDurationFormatted(this.event)
    },
    title() {
      let tenant = this.event.tenant || SITE_TENANT.BANGLALINK
      let label = getCompanySpecificEventLabel(this.companyName, this.event.name) || 'DC Low Voltage'
      tenant = getTenantLabel(tenant, false)
      label += ` (${tenant})`
      return label
    },
  },
}
</script>

<style lang="scss" scoped></style>
