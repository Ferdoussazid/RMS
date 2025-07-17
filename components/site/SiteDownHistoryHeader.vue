<template>
  <div
    class="hidden h-[65px] divide-x-2 divide-gray-300 overflow-y-scroll bg-slate-200 text-xs font-semibold text-gray-600 md:grid md:grid-cols-12 md:items-center"
  >
    <div class="col-span-2 flex h-full items-center px-4 py-2 text-left">
      <span>Site Name</span>
    </div>
    <div class="col-span-1 flex h-full items-center justify-center px-4 py-2 text-left"><span>Tenant</span></div>
    <div class="col-span-9 grid grid-cols-7 place-items-center divide-x-2 divide-gray-300">
      <div class="col-span-2 grid w-full grid-cols-12 divide-y-2 divide-slate-300 text-center">
        <div class="col-span-12 w-full px-1 py-1.5"><span>AC Fail</span></div>
        <div class="col-span-12 grid w-full grid-cols-2 divide-x-2 divide-slate-300">
          <div class="col-span-1 px-1 py-1.5 text-center"><span>Start</span></div>
          <div class="col-span-1 px-1 py-1.5 text-center"><span>End</span></div>
        </div>
      </div>
      <div class="col-span-2 grid w-full grid-cols-12 divide-y-2 divide-slate-300 text-center">
        <div class="col-span-12 w-full px-1 py-1.5"><span>DC Low</span></div>
        <div class="col-span-12 grid w-full grid-cols-2 divide-x-2 divide-slate-300">
          <div class="col-span-1 px-1 py-1.5 text-center"><span>Start</span></div>
          <div class="col-span-1 px-1 py-1.5 text-center"><span>End</span></div>
        </div>
      </div>
      <div class="col-span-2 grid w-full grid-cols-12 divide-y-2 divide-slate-300 text-center">
        <div class="col-span-12 w-full px-1 py-1.5"><span>Site Down</span></div>
        <div class="col-span-12 grid w-full grid-cols-2 divide-x-2 divide-slate-300">
          <div class="col-span-1 px-1 py-1.5 text-center"><span>Start</span></div>
          <div class="col-span-1 px-1 py-1.5 text-center"><span>End</span></div>
        </div>
      </div>
      <div class="col-span-1 flex h-full w-full grid-cols-12 items-center justify-center text-center">
        <div class="w-full px-1 py-2"><span>Battery Backup</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
