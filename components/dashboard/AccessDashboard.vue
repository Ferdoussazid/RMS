<template>
  <ContentCard title="Access Dashboard">
    <template #content>
      <div class="grid-col-2 grid w-full gap-3 p-4">
        <AccessCount
          label="Total Doors"
          :count="access.total_door"
          theme="from-blue-500 to-blue-300"
          class="col-span-2"
          :filter="filter.TOTAL_DOOR"
        />
        <AccessCount
          label="Door Open"
          :count="access.door_open"
          theme="from-red-500 to-red-300"
          :filter="filter.DOOR_OPEN"
        />
        <AccessCount
          label="Lock Open"
          :count="access.lock_open"
          theme="from-orange-500 to-orange-300"
          :filter="filter.LOCK_OPEN"
        />
        <AccessCount
          label="Lock Close Fail"
          :count="access.lock_close_fail"
          theme="from-purple-500 to-purple-300"
          :filter="filter.LOCK_CLOSE_FAIL"
        />
        <AccessCount
          label="Lock Open Fail"
          :count="access.lock_open_fail"
          theme="from-fuchsia-500 to-fuchsia-300"
          :filter="filter.LOCK_OPEN_FAIL"
        />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_ALARM, SITE_FILTER_TYPE, SITE_PROPERTY } from '~/assets/js/Constant'

export default {
  data: () => ({
    filter: {
      TOTAL_DOOR: { type: SITE_FILTER_TYPE.PROPERTY, id: SITE_PROPERTY.DOOR_STATUS, exists: 1 },
      DOOR_OPEN: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.DOOR_STATUS, expected: 0 },
      LOCK_OPEN: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_STATUS, expected: 0 },
      LOCK_CLOSE_FAIL: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_CLOSE_FAIL, expected: 0 },
      LOCK_OPEN_FAIL: { type: SITE_FILTER_TYPE.ALARM, id: SITE_ALARM.LOCK_OPEN_FAIL, expected: 0 },
    },
  }),
  computed: {
    ...mapGetters('dashboard', ['access']),
  },
}
</script>

<style lang="scss" scoped></style>
