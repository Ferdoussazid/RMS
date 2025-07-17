<template>
  <div class="flex items-center space-x-4">
    <div
      class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg shrink-0"
      :class="gradient[state]"
    >
      <img src="/icon/battery6.svg" alt="" />
    </div>
    <div class="flex flex-col">
      <div class="flex w-full items-baseline justify-start">
        <span class="font-sans text-2xl font-extrabold leading-none" :class="textColor[state]">
          {{ count }}
        </span>
        <small class="ml-1 text-sm font-light text-gray-600">site{{ count > 1 ? 's' : '' }}</small>
      </div>
      <span class="text-xs font-semibold text-gray-500">
        {{ caption[state] }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
      validate: val => ['full', 'good', 'ok', 'bad'].includes(val),
    },
  },
  data: () => ({
    gradient: {
      full: 'from-green-500 to-green-300',
      good: 'from-teal-500 to-teal-300',
      ok: 'from-yellow-500 to-yellow-300',
      bad: 'from-orange-500 to-orange-300',
    },
    textColor: {
      full: 'text-green-500',
      good: 'text-teal-500',
      ok: 'text-yellow-500',
      bad: 'text-orange-500',
    },
    caption: {
      full: 'More than 4 hours backup',
      good: 'Around 2 to 4 hours backup',
      ok: 'Around 1 to 2 hours backup',
      bad: 'Less than 1 hour backup',
    },
  }),
  computed: {},
}
</script>

<style lang="scss" scoped></style>
