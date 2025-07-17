<template>
  <div
    class="h-[300px] w-[250px] overflow-hidden rounded-lg border border-slate-100 bg-white shadow-md hover:bg-slate-50 hover:shadow-xl"
  >
    <div class="flex flex-col items-center justify-center gap-4 p-6">
      <img class="h-28 w-32 object-contain" :src="companyLogo" alt="Company logo" />
      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <span class="text-sm font-semibold leading-tight text-gray-800">{{ company.name }}</span>
          <span class="text-xs font-normal text-gray-700"
            ><span class="text-sm font-semibold">{{ company.id }}</span> sites</span
          >
        </div>
        <div>
          <button class="cursor-pointer rounded bg-blue-500 hover:bg-blue-700">
            <NLink
              class="flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white"
              to="/customer/sites"
            >
              <span>More</span>
              <i class="fas fa-arrow-right"></i>
            </NLink>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  computed: {
    companyLogo() {
      return this.company.logo || '/image/logo.png'
    },
  },
}
</script>
