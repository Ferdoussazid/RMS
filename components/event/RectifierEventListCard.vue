<template>
  <ContentCard :title="title" :is-top-blending="isAtTop">
    <template #action>
      <LoadingSpinner v-if="loading && !hasEvents" class="scale-50" />
    </template>
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[50vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div v-if="hasEvents"
            class="flex flex-col items-stretch justify-start w-full gap-2 overflow-y-scroll scrollbar-hide">
            <Component :is="e.name" v-for="(e, index) in listWithTime" v-bind="e.props" :key="index"
              :show-site-name="showSiteName" />

            <div v-if="!canLoadMore" class="flex justify-center w-full py-4">
              <span class="text-xs italic font-light text-gray-500">No more events available</span>
            </div>

            <button v-if="canLoadMore"
              class="flex items-center justify-center h-8 px-4 py-2 mx-2 my-4 space-x-2 text-xs font-semibold text-indigo-500 transition duration-300 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"
              @click="$emit('load-more')">
              <CircularSpinner v-show="loading" size="sm" theme="border-indigo-500" />
              <span v-show="!loading"><i class="fas fa-plus"></i></span>
              <span v-show="!loading" class="uppercase">Load More</span>
            </button>
          </div>
          <div v-if="!loading && !hasEvents" class="flex w-full flex-col items-center justify-start py-[15vh]">
            <img src="/icon/nothing.png" alt="" class="w-16 h-auto" />
            <span class="text-sm font-normal text-center text-gray-400"> No event found </span>
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
            name: this.findRectifierEventComponent(item),
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
