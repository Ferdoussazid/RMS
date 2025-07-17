<template>
  <thead>
    <tr class="sticky top-0 bg-gray-100 py-2 text-center">
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">Time</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM1</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM2</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM3</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM4</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM5</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM6</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM7</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">DM8</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM1</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM2</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM3</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM4</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM5</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM6</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM7</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM8</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM9</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM10</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM11</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM12</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">AM13</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">sp</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">gv</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">vl</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">rm</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">crs</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">card</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">dc1</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">dc2</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">add_card</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">del_card</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">cur_time</span>
      </th>
      <th class="top-0 w-16 border-b border-r border-gray-200 py-2 px-1 text-center">
        <span class="text-xs font-semibold text-gray-700">clr_cards</span>
      </th>
      <th class="5-1 top-0 w-16 border-b border-gray-200 py-2 text-center">
        <span class="text-xs font-semibold text-gray-700">Time</span>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
