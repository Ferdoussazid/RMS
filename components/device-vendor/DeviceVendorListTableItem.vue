<template>
  <div class="flex flex-wrap items-center justify-start px-2">
    <div class="flex w-1/12 justify-center pt-2 pb-4 text-left text-xs font-semibold md:w-1/12">{{ serial }}</div>
    <div class="w-11/12 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">{{ name }}</div>
    <div class="w-1/2 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">
      <div class="flex items-start gap-1">
        <div class="flex w-32 flex-col items-start rounded py-1">
          <div class="flex items-start gap-1">
            <span class="text-sm font-semibold leading-tight text-slate-700">{{ phone }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 pt-2 pb-4 text-left text-xs font-semibold md:w-3/12">
      <div class="flex items-start gap-1">
        <div class="flex w-32 flex-col items-start rounded py-1">
          <div class="flex items-start gap-1">
            <span class="text-sm font-semibold leading-tight text-slate-700">{{ address }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="relative flex w-full items-start justify-center gap-2 pt-3 pb-4 text-left text-xs font-semibold md:w-2/12"
    >
      <div class="inline-flex cursor-pointer flex-col gap-0.5">
        <div class="relative">
          <div class="flex items-center justify-center gap-1 divide-x rounded bg-blue-700 shadow">
            <NLink
              class="flex items-center justify-center gap-1 p-2 text-xs font-semibold text-white"
              :to="{ path: '/device-vendor/edit', query: { uid: uid } }"
            >
              <i class="fas fa-cog"></i> <span> Edit</span>
            </NLink>
          </div>
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
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: '-',
    },
    phone: {
      type: String,
      required: true,
    },
    uid: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
