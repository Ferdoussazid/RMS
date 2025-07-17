<template>
  <ContentCard title="Power">
    <template #content>
      <div class="grid w-full grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="col-span-1">
          <MainPowerDashboard />
        </div>
        <div class="col-span-1 border-0 border-gray-200 md:border-l">
          <MainOutageDashboard />
        </div>
        <div class="col-span-1 border-0 border-gray-200 md:border-l">
          <DCPowerDashboard />
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
export default {
  data: () => ({}),
}
</script>

<style lang="scss" scoped></style>
