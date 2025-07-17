<template>
  <div
    v-if="showModal"
    class="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition duration-300 ease-in-out"
  >
    <div class="flex w-11/12 flex-col rounded bg-white md:w-1/2 lg:w-1/3">
      <div
        class="flex shrink-0 flex-row items-center justify-between overflow-hidden rounded-t border-b border-gray-200 bg-pink-700 px-4 py-2"
      >
        <div class="flex items-center gap-2 text-sm font-semibold text-white">
          <i class="fas fa-id-card"></i>
          Delete Card
        </div>
        <button class="p-0.5 text-base font-medium text-white" @click="onCancel">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div v-if="!cardDetails" class="flex flex-col items-stretch justify-center gap-2 px-4 pt-4 pb-8">
        <FixedLabelInput v-model="cardNumber" label="Card Number" placeholder="e.g. 0000000000" />

        <button
          class="flex w-full cursor-pointer items-center justify-center gap-1 rounded bg-pink-700 px-3 py-1.5 text-sm font-semibold text-white shadow-lg hover:bg-pink-900"
          @click="loadCardDetails"
        >
          <i v-if="!loadingDetails" class="fas fa-arrow-right"></i>
          <i v-else class="fas fa-arrow-right"></i>
          Proceed
        </button>
      </div>

      <div v-else class="grid grid-cols-12 gap-2 p-6">
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Card Number</span
          ><span class="text-base font-semibold">{{ cardDetails.card_number || 'N/A' }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Cardholder Name</span
          ><span class="text-base font-semibold">{{ cardDetails.name || 'N/A' }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Phone</span
          ><span class="text-base font-semibold">{{ cardDetails.phone || 'N/A' }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Designation</span
          ><span class="text-base font-semibold">{{ cardDetails.designation || 'N/A' }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Created At</span>
          <span class="text-base font-semibold">{{ getFormattedDate(cardDetails.created_at) }}</span>
        </div>
      </div>

      <div v-if="cardDetails" class="flex flex-col items-stretch justify-center gap-2 p-6">
        <span class="text-sm font-bold text-red-700"> ARE YOU SURE YOU WANT TO DELETE THIS CARD PERMANENTLY? </span>
        <button
          class="flex w-full cursor-pointer items-center justify-center gap-1 rounded bg-pink-700 px-3 py-1.5 text-sm font-semibold text-white shadow-lg hover:bg-pink-900"
          @click="onCardDelete"
        >
          <i v-if="!deleting" class="fas fa-trash"></i>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
          YES
        </button>

        <button
          class="flex w-full cursor-pointer items-center justify-center gap-1 rounded bg-slate-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-700"
          @click="onCancel"
        >
          <i class="fas fa-times"></i>
          NO
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      loadingDetails: false,
      deleting: false,
      cardNumber: null,
      cardDetails: null,
    }
  },
  computed: {
    ...mapGetters('user', ['rootUserUid']),
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    onCancel() {
      this.showModal = false
      this.cardNumber = null
      this.cardDetails = null
    },
    async loadCardDetails() {
      this.loadingDetails = true
      try {
        if (!this.cardNumber) {
          throw new Error('Please enter a card number')
        }
        const res = await this.$axios.$get('/door/access/card-info', {
          params: { user_uid: this.rootUserUid, card_number: this.cardNumber },
        })
        if (res) {
          this.cardDetails = { ...res }
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message
        this.$toast.error(errorMessage)
      }
      this.loadingDetails = false
    },
    async onCardDelete() {
      this.deleting = true
      try {
        const res = await this.$store.dispatch('access/deleteCardFromSystem', this.cardDetails.card_number)
        this.onCancel()
        this.$toast.success(`Card successfully deleted from ${res.count} ${res.count > 1 ? 'sites' : 'site'}`)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.deleting = false
    },
    getFormattedDate(date) {
      return format(new Date(date), 'h:mm a, d MMM yy')
    },
  },
}
</script>
