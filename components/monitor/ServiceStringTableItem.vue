<template>
  <tr :class="theme" class="hover:bg-gray-100">
    <td class="border-t border-r">
      <div class="flex min-w-[6rem] flex-col items-center justify-center gap-0.5 py-2 text-left">
        <span class="text-[0.7rem] font-medium"> {{ splittedTime.hour }}</span>
        <span class="text-[0.6rem] font-light">{{ splittedTime.day }}</span>
      </div>
    </td>

    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM1 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM2 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM3 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM4 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM5 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM6 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM7 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.DM8 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM1 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM2 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM3 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM4 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM5 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM6 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM7 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM8 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM9 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM10 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM11 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM12 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.AM13 || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.sp || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.gv || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.avl || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.rm || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.crs || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{
        item.payload.card || '-'
      }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ dc1 }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ dc2 }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ addCard }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ delCard }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ curTimes }}</span>
    </td>
    <td class="border-t border-r border-gray-100">
      <span class="flex items-center justify-center py-2 px-1 text-xs font-normal text-gray-900">{{ clrCards }}</span>
    </td>
    <td class="border-t">
      <div class="flex min-w-[7rem] flex-col items-center justify-center gap-0.5 py-2 text-left">
        <span class="text-[0.7rem] font-medium"> {{ splittedTime.hour }}</span>
        <span class="text-[0.6rem] font-light">{{ splittedTime.day }}</span>
      </div>
    </td>
  </tr>
</template>

<script>
import _ from 'lodash'
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
    dc1() {
      return _.get(this.item.response, 'dc1', '-')
    },
    dc2() {
      return _.get(this.item.response, 'dc2', '-')
    },
    addCard() {
      return _.get(this.item.response, 'add_card', '-')
    },
    delCard() {
      return _.get(this.item.response, 'del_card', '-')
    },
    curTimes() {
      return _.get(this.item.response, 'cur_times', '-')
    },
    clrCards() {
      return _.get(this.item.response, 'clr_cards', '-')
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
