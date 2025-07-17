<template>
  <tr class="sticky right-0 -top-1 h-10 bg-gray-200">
    <!-- <th class="px-4 py-2 text-left border border-gray-300">SL</th> -->
    <th class="border border-gray-300 px-4 py-2 text-left">Site Name</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Device ID</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Bill Submission Date</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Amount</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Status</th>
    <th class="border border-gray-300 px-4 py-2 text-left">Invoice</th>
    <th class="border border-gray-300 px-4 py-2 text-left">PO Number</th>
    <th v-if="isExtended" class="border border-gray-300 px-4 py-2 text-left">Issued By</th>
  </tr>
</template>

<script>
export default {
  props: {
    isExtended: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
