<template>
  <ContentCard :title="title" class="col-span-12 md:col-span-6 lg:col-span-3">
    <template #content>
      <div class="flex min-h-[35vh] flex-1 flex-col items-center justify-center">
        <div class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 p-3 shadow-lg">
          <img :src="pathto('/icon/clock2.svg')" alt="" class="" />
        </div>

        <p class="mt-4 text-sm font-bold text-gray-700">
          <span class="text-orange-500">{{ durationLabel }}</span>
        </p>
        <span class="text-xs font-normal text-gray-600">Total run hour</span>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { format } from 'date-fns'
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  props: {
    tag: {
      type: String,
      required: true,
      validate: val => ['dg', 'pg'].includes(val),
    },
    runHour: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title() {
      const name = this.tag === 'dg' ? 'DG' : 'PG'
      return `${name} Runtime of ${this.dateLabel}`
    },
    dateLabel() {
      if (this.runHour.zoom === 'month') {
        return format(this.runHour.date, 'MMMM yyyy')
      }
      return format(this.runHour.date, 'd MMMM, yyyy')
    },
    durationLabel() {
      return this.$utils.toTimeDuration(this.runHour.duration, {
        longForm: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
