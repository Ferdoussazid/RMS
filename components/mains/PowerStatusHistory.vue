<template>
  <div class="col-span-3 flex w-full flex-col rounded bg-white pb-4 shadow-md">
    <div class="px-4 py-3">
      <h3 class="text-sm font-semibold text-gray-600">Mains Power History</h3>
    </div>

    <ul class="list-none">
      <li v-for="i in 5" :key="i" class="flex flex-row items-center space-x-2 px-4 py-2">
        <img :src="pathto('/icon/energy.svg')" alt="" class="h-6 w-6 flex-shrink-0" />
        <div class="flex flex-grow flex-col">
          <p class="text-xs font-semibold text-gray-600">
            Mains power was
            <span :class="{ 'text-green-500': i % 2, 'text-red-500': !(i % 2) }">
              {{ i % 2 ? 'ON' : 'OFF' }}
            </span>
          </p>
          <span class="text-xs font-light text-gray-600"> 4:55 PM, 12 Oct 2021 </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
}
</script>

<style lang="scss" scoped></style>
