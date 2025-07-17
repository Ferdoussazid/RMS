<template>
  <div
    class="w-full cursor-pointer duration-300"
    :class="{
      'bg-white': !notification.seen,
      'bg-gray-100': notification.seen,
    }"
    @click="onClick"
  >
    <div class="flex flex-row items-start space-x-3 px-4 py-2.5">
      <img
        :src="pathto('/icon/bell.png')"
        class="w-8 h-8 p-1 rounded-full flex-shrink-0 bg-gray-100"
        alt="Notification"
      />
      <div class="flex flex-col flex-grow">
        <div class="flex flex-row items-center space-x-3">
          <span class="text-gray-700 font-semibold text-xs">
            {{ notification.title }}
          </span>
          <span class="text-gray-600 font-light text-xs">
            {{ timeDistance }}
          </span>
        </div>
        <p class="text-gray-700 font-normal text-xs">
          {{ notification.content }}
        </p>
      </div>
      <button
        class="
          flex-shrink-0
          text-[0.65rem]
          font-thin
          bg-blue-500
          hover:bg-blue-600
          duration-300
          rounded-sm
          px-2.5
          py-1
          text-white
          shadow-lg
        "
        @click="onClick"
      >
        <i class="fas fa-arrow-right fa-sm"></i> View
      </button>
    </div>
  </div>
</template>

<script>
import { formatDistanceToNow } from 'date-fns'
import utils from '~/mixins/utils'

export default {
  components: {},
  mixins: [utils],
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    timeDistance() {
      return formatDistanceToNow(new Date(this.notification.timestamp))
    },
  },
  methods: {
    onClick() {
      switch (this.notification.type) {
        case 'delivery':
          this.$router.push(
            `/delivery/${this.notification.meta.deliveryId}/details`
          )
          break

        default:
          break
      }

      this.$store.dispatch('notification/markSeen', this.notification.id)
    },
  },
}
</script>

<style lang="scss" scoped></style>
