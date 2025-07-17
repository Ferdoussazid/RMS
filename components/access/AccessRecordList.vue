<template>
  <ContentCard title="Access Log">
    <template #content>
      <div class="w-flex w-full max-h-[360px] overflow-scroll divide-y divide-slate-200">
        <AccessRecordItem v-for="(item, i) in items" :key="i" :record="item" />
      </div>
    </template>
  </ContentCard>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
