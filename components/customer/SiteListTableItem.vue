<template>
  <div class="flex flex-wrap items-center justify-start px-2">
    <div class="flex w-1/12 justify-center pt-2 pb-4 text-left text-xs font-semibold md:w-1/12">{{ serial }}</div>
    <div class="w-11/12 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">{{ site.name }}</div>
    <div class="w-1/2 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">
      <div v-if="devices.length > 0" class="flex items-start gap-1">
        <div :class="getTheme(devices[0].last_pulse)" class="py-1 text-xs font-light">
          <i class="fas fa-circle"></i>
        </div>
        <div class="flex w-32 flex-col items-start rounded py-1">
          <div class="flex items-start gap-1">
            <span class="text-sm font-semibold leading-tight text-slate-700">{{ devices[0].com_id }}</span>
          </div>
          <span class="text-xs font-medium leading-tight text-slate-700">{{ devices[0].phone }}</span>
          <span class="text-xs font-light leading-tight text-slate-700"> {{ devices[0].time_ago }} ago </span>
        </div>
      </div>
    </div>
    <div class="w-1/2 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">
      <div v-if="devices.length > 1" class="flex items-start gap-1">
        <div :class="getTheme(devices[1].last_pulse)" class="py-1 text-xs font-light">
          <i class="fas fa-circle"></i>
        </div>
        <div class="flex w-32 flex-col items-start rounded py-1">
          <div class="flex items-start gap-1">
            <span class="text-sm font-semibold leading-tight text-slate-700">{{ devices[1].com_id }}</span>
          </div>
          <span class="text-xs font-medium leading-tight text-slate-700">{{ devices[1].phone }}</span>
          <span class="text-xs font-light leading-tight text-slate-700"> {{ devices[1].time_ago }} ago </span>
        </div>
      </div>
    </div>
    <div class="relative flex w-1/2 items-start justify-center pt-3 pb-4 text-left text-xs font-semibold md:w-2/12">
      <div class="inline-flex cursor-pointer flex-col gap-0.5">
        <div class="relative">
          <div class="flex items-center justify-center gap-1 divide-x rounded bg-emerald-700 shadow">
            <NLink
              class="flex items-center justify-center gap-1 p-2 text-xs font-semibold text-white"
              :to="{ path: '/customer/site/configure', query: { siteUid: site.uid } }"
            >
              <i class="fas fa-cog"></i> <span> Configure</span>
            </NLink>
            <div v-if="!showEdit" class="px-1.5 text-base font-semibold text-white" @click="showEdit = true">
              <i class="fas fa-caret-down"></i>
            </div>
            <div v-if="showEdit" class="px-1.5 text-base font-semibold text-white" @click="showEdit = false">
              <i class="fas fa-caret-up"></i>
            </div>
          </div>
          <NLink
            v-if="showEdit"
            class="absolute left-0 w-full rounded-b border border-slate-200 bg-gray-100 py-1 text-xs font-semibold text-gray-800 shadow"
            :to="{ path: '/customer/site/edit', query: { siteUid: site.uid } }"
          >
            <div class="flex items-center justify-center gap-1 py-0.5">
              <i class="fas fa-pencil-alt"></i> <span>Edit Site Info</span>
            </div>
          </NLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serial: {
      type: Number,
      required: true,
    },
    site: {
      type: Object,
      required: true,
    },
    devices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showEdit: false,
    }
  },
  methods: {
    getTheme(pulseTime) {
      const time = new Date(pulseTime)
      const difference = new Date().getTime() - time.getTime()

      const fiveMinutes = 5 * 60 * 1000
      const oneHour = 60 * 60 * 1000
      const fourHour = 4 * oneHour
      if (difference > fourHour) return 'text-red-500'
      if (difference > fiveMinutes) return 'text-orange-500'
      return 'text-green-500'
    },
  },
}
</script>

<style lang="scss" scoped></style>
