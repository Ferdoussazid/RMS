<template>
  <div class="flex h-full max-h-full w-full flex-col overflow-x-scroll rounded-md border border-slate-200">
    <table class="w-auto">
      <thead class="">
        <tr class="bg-gray-100">
          <th v-for="(col, i) in columns" :key="i" class="py-3 text-xs font-semibold text-gray-800">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="overflow-y-scroll">
        <tr v-for="(row, i) in rows" :key="i">
          <td v-for="(col, j) in columns" :key="j" class="border-b border-gray-100 py-2.5 text-center text-[0.7rem] font-medium text-gray-900">
            {{ getValue(i, j) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getValue(rowIndex, columnIndex) {
      return get(this.rows[rowIndex], this.columns[columnIndex].prop, 'N/A')
    },
  },
}
</script>

<style lang="scss" scoped></style>
