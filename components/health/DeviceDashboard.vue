<template>
  <ContentCard title="Device Dashboard">
    <template #content>
      <div class="grid-col-2 grid w-full gap-3 p-4">
        <AccessCount
          label="Total Devices"
          :count="totalDeviceCount"
          theme="from-blue-500 to-blue-300"
          class="col-span-2"
          :filter="filter.TOTAL_DEVICE"
        />
        <AccessCount
          label="Online Devices"
          :count="onlineDeviceCount"
          theme="from-green-500 to-green-300"
          :filter="filter.ONLINE_DEVICE"
        />
        <AccessCount
          label="Offline Devices"
          :count="offlineDeviceCount"
          theme="from-red-500 to-red-300"
          :filter="filter.OFFLINE_DEVICE"
        />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { SITE_ALARM, SITE_FILTER_TYPE, SITE_PROPERTY } from '~/assets/js/Constant'

export default {
  data: () => ({
    filter: {
      TOTAL_DEVICE: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.COM_IDS, exists: 1 },
      ONLINE_DEVICE: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DEVICE_ONLINE, expected: 1 },
      OFFLINE_DEVICE: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DEVICE_ONLINE, expected: 0 },
    },
  }),
  computed: {
    ...mapGetters('health', ['counts']),
    totalDeviceCount() {
      return _.get(this.counts, 'total', 0)
    },
    onlineDeviceCount() {
      if (this.counts === null) return 0
      return this.counts.normal + this.counts.abnormal
    },
    offlineDeviceCount() {
      if (this.counts === null) return 0
      return this.totalDeviceCount - this.onlineDeviceCount
    },
  },
}
</script>

<style lang="scss" scoped></style>
