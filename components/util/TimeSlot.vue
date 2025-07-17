<template>
  <div class="flex justify-center">
    <div
      class="bgclr m-1 select-none rounded border border-gray-200 px-4 py-0.5 text-[.65rem] font-normal text-slate-900 shadow-sm"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>
>

<script>
import { format, isToday, isYesterday } from 'date-fns'
export default {
  props: {
    time: {
      type: Date,
      required: true,
    },
  },

  computed: {
    formattedTime() {
      if (isToday(this.time)) {
        return `Today`
      } else if (isYesterday(this.time)) {
        return `Yesterday`
      } else {
        return format(this.time, 'd MMM yyyy')
      }
    },
  },
}
</script>

<style>
.bgclr {
  background-color: #fcf1d9;
}
</style>
