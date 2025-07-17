<template>
  <RectifierEventListItem :event="event" theme="from-red-500 to-red-300" icon="/icon/multimeter2.png"
    :show-site-name="true">
    {{ title }}: {{ duration }}
  </RectifierEventListItem>
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
        let tenant = this.event.tenant
        let label = 'Mains Fail'
        if (tenant) {
          tenant = getTenantLabel(tenant, false)
          label += ` (${tenant})`
        }

        return label
      },
    },
  }
</script>

<style lang="scss" scoped></style>
