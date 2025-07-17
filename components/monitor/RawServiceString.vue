<template>
  <div :class="theme" class="flex border-b border-slate-200">
    <div class="flex min-w-[7rem] flex-col items-center justify-center gap-0.5 border-r py-2 text-left">
      <span class="text-[0.7rem] font-medium"> {{ splittedTime.hour }}</span>
      <span class="text-[0.6rem] font-light">{{ splittedTime.day }}</span>
    </div>
    <div class="flex flex-wrap px-2 py-3">
      <span class="flex text-xs font-normal">
        {{ serviceString }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },

  computed: {
    serviceString() {
      const payload = this.item.payload || {}
      const response = this.item.response || {}
      const payloadValues = Object.entries(payload).map(([key, payloadValue]) => ({ [key]: payloadValue }))
      const responseValues = Object.entries(response).map(([key, responseValue]) => ({
        [key]: responseValue,
      }))
      const serviceStringValues = payloadValues.concat(responseValues)
      const serviceString = serviceStringValues
        .map(serviceStringValue =>
          Object.entries(serviceStringValue)
            .map(([key, value]) => `${key}=${value}`)
            .join(', ')
        )
        .join(', ')
      return serviceString
    },
    splittedTime() {
      const time = new Date(this.item.created_at).toLocaleTimeString([], { hour12: false })
      const date = new Date(this.item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return { hour: time, day: date }
    },
  },
}
</script>

<style lang="scss" scoped></style>
