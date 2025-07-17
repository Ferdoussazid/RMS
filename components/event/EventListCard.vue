<template>
  <ContentCard :title="title" :is-top-blending="isAtTop">
    <template #action>
      <LoadingSpinner v-if="loading && !hasEvents" class="scale-50" />
    </template>
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[50vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div
            v-if="hasEvents"
            class="flex w-full flex-col items-stretch justify-start gap-2 overflow-y-scroll scrollbar-hide"
          >
            <Component
              :is="e.name"
              v-for="(e, index) in listWithTime"
              v-bind="e.props"
              :key="index"
              :show-site-name="showSiteName"
            />

            <div v-if="!canLoadMore" class="flex w-full justify-center py-4">
              <span class="text-xs font-light italic text-gray-500">No more events available</span>
            </div>

            <button
              v-if="canLoadMore"
              class="my-4 mx-2 flex h-8 items-center justify-center space-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-500 shadow-sm transition duration-300 hover:bg-gray-100"
              @click="$emit('load-more')"
            >
              <CircularSpinner v-show="loading" size="sm" theme="border-indigo-500" />
              <span v-show="!loading"><i class="fas fa-plus"></i></span>
              <span v-show="!loading" class="uppercase">Load More</span>
            </button>
          </div>
          <div v-if="!loading && !hasEvents" class="flex w-full flex-col items-center justify-start py-[15vh]">
            <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
            <span class="text-center text-sm font-normal text-gray-400"> No event found </span>
          </div>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { add, format } from 'date-fns'
import EventPresenter from '~/mixins/EventPresenter'

export default {
  mixins: [EventPresenter],
  props: {
    title: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },

    items: {
      type: Array,
      required: true,
    },

    showSiteName: {
      type: Boolean,
      default: false,
    },
    canLoadMore: {
      type: Boolean,
      default: true,
    },
    isAtTop: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    hasEvents() {
      return this.items.length
    },

    listWithTime() {
      const listWithTime = []
      if (this.items.length === 0) {
        return listWithTime
      }
      let temp = add(new Date(this.items[0].time), { years: 2 })

      const formatStr = 'd-MM-yyyy'
      this.items.forEach((item, index, arr) => {
        if (format(temp, formatStr) !== format(new Date(item.time), formatStr)) {
          temp = new Date(item.time)
          listWithTime.push({
            name: 'TimeSlot',
            props: { time: temp },
          })
        }
        listWithTime.push({
          name: this.findEventComponent(item),
          props: {
            event: item,
          },
        })
      })
      return listWithTime
    },
  },

  methods: {},
}
</script>

<style lang="scss" scoped></style>
