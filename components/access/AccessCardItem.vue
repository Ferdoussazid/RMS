<template>
  <div class="flex w-full flex-row items-start space-x-2 px-3 py-3">
    <div class="flex flex-col items-center space-y-2">
      <div class="h-8 w-8 shrink-0 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 p-1 shadow-lg">
        <img src="/icon/employee.png" alt="" />
      </div>
      <span
        class="rounded border border-green-500 px-1 text-[0.45rem] font-medium uppercase text-green-500"
        :class="[statusTheme]"
      >
        {{ statusText }}
      </span>
    </div>
    <div class="flex grow flex-col space-y-0.5">
      <span class="text-xs font-semibold text-gray-600">{{ card.name }}</span>
      <span class="text-xs font-normal text-gray-600"><i class="fas fa-phone-alt mr-1"></i> {{ card.phone }}</span>
      <span class="text-xs font-normal text-gray-600"><i class="fas fa-user-tie mr-1"></i> {{ card.designation }}</span>
      <span class="text-xs font-medium text-purple-600"><i class="far fa-id-card"></i> {{ card.card_number }}</span>
      <span class="text-xs font-normal text-gray-500"><i class="far fa-clock mr-1"></i> {{ createdAt }}</span>
    </div>
    <button
      :class="[
        isSystemReadOnlyUser
          ? 'cursor-not-allowed border-gray-400 text-gray-400'
          : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
      ]"
      class="text-2xs shrink-0 rounded border px-1.5 py-0.5 transition duration-300"
      @click="onDeleteClick"
    >
      <i v-if="removing" class="fa fa-circle-notch fa-spin"></i>
      <i v-else class="fa fa-trash"></i>
    </button>
  </div>
</template>

<script>
import { format } from 'date-fns'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    removing: false,
  }),
  computed: {
    createdAt() {
      const time = new Date(this.card.created_at)
      return format(time, 'h:mm aaa, d MMM yyyy')
    },
    statusText() {
      const labels = {
        pending: 'Pending',
        success: 'Added',
        failed: 'Failed',
      }

      return labels[this.card.status] || ''
    },
    statusTheme() {
      const themes = {
        pending: 'border-gray-500 text-gray-500',
        success: 'border-green-500 text-green-500',
        failed: 'border-red-500 text-red-500',
      }

      return themes[this.card.status] || ''
    },
  },
  methods: {
    async onDeleteClick() {
      if (!this.getPermissionStatus('delete this card')) return
      if (confirm('Are you sure ?')) {
        this.removing = true
        try {
          await this.$store.dispatch('access/deleteAccessCard', this.card.access_id)
          this.$toast.success('Card removed successfully')
        } catch (error) {
          this.$toast.error(error.message)
        }
        this.removing = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
