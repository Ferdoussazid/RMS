<template>
  <div class="w-full p-4">
    <div v-if="loading" class="flex items-center justify-center py-[15vh]">
      <CircularSpinner size="lg" />
    </div>
    <div v-if="!loading && events.length" class="flex h-full w-full flex-col justify-start space-y-2">
      <Component :is="findEventComponent(e)" v-for="(e, i) in events" :key="i" :event="e" />
    </div>
    <div
      v-if="!loading && !events.length"
      class="flex w-full flex-col items-center justify-start overflow-scroll py-[15vh]"
    >
      <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
      <span class="text-center text-sm font-normal text-gray-400"> No event found </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import EventPresenter from '~/mixins/EventPresenter'

export default {
  mixins: [EventPresenter],
  computed: {
    ...mapGetters('access', ['events']),
    ...mapGetters('access', {
      loading: 'eventsLoading',
    }),
  },
}
</script>

<style lang="scss" scoped></style>
