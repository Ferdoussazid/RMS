<template>
  <ContentCard :title="title" is-top-blending>
    <template #content>
      <div class="flex min-h-[40vh] flex-1 flex-col items-center justify-center">
        <PowerBulb :has-power="!!pin.status" />

        <p class="mt-4 text-xs font-bold text-gray-700">
          {{ generatorName }} is
          <span :class="[pin.status ? 'text-green-500' : 'text-red-500']">
            {{ pin.status ? 'ON' : 'OFF' }}
          </span>
        </p>
      </div>
    </template>
  </ContentCard>
</template>

<script>
export default {
  props: {
    pin: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    generatorName() {
      return this.pin.type === 'dg_status' ? 'DG' : 'PG'
    },
  },
}
</script>

<style lang="scss" scoped></style>
