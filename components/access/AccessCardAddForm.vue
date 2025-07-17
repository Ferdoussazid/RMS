<template>
  <ContentCard title="Add New Card">
    <template #action>
      <LoadingSpinner v-if="loading" class="scale-50" />
      <button
        v-if="!loading"
        class="rounded px-3 py-1 text-xs font-medium transition duration-300"
        :class="[
          isSystemReadOnlyUser
            ? 'cursor-not-allowed bg-gray-400 text-gray-100'
            : ' bg-green-600 text-white hover:bg-green-500',
        ]"
        @click="onSaveClick"
      >
        <i class="fas fa-check"></i>
        Save
      </button>
    </template>
    <template #content>
      <div class="flex w-full flex-col space-y-3 px-4 py-4">
        <FixedLabelInput v-model="form.name" label="Employee Name" />
        <FixedLabelInput v-model="form.phone" label="Phone Number" />
        <FixedLabelInput v-model="form.designation" label="Designation" />
        <FixedLabelInput v-model="form.card_number" label="Card Number" placeholder="Ex: 0001234567" />
        <DateTimePickerField label="Start Time" :placeholder="startTime" @click="onDatePickerClick('start')" />
        <DateTimePickerField label="End Time" :placeholder="endTime" @click="onDatePickerClick('end')" />

        <DateTimePickerModal ref="picker" @submit="onDatePicked" />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { format } from 'date-fns'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    loading: false,
    form: {
      name: '',
      phone: '',
      designation: '',
      card_number: '',
      start_time: null,
      end_time: null,
    },
    whichTime: '',
  }),
  computed: {
    startTime() {
      if (!this.form.start_time) return 'Click to choose date/time'
      return format(this.form.start_time, 'h:m a, d MMM Y')
    },
    endTime() {
      if (!this.form.end_time) return 'Click to choose date/time'
      return format(this.form.end_time, 'h:m a, d MMM Y')
    },
  },
  methods: {
    async onSaveClick() {
      if (!this.getPermissionStatus('add cards')) return
      this.loading = true
      try {
        await this.$store.dispatch('access/addAccessCard', this.form)
        this.resetForm()
        this.$toast.success('Card added succesfully')
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
      this.loading = false
    },
    resetForm() {
      this.form.name = ''
      this.form.phone = ''
      this.form.designation = ''
      this.form.card_number = ''
      this.form.start_time = null
      this.form.end_time = null
    },
    // target = 'start' / 'end'
    onDatePickerClick(target) {
      this.whichTime = target
      this.$refs.picker.show()
    },
    onDatePicked(date) {
      this.$refs.picker.dismiss()
      if (this.whichTime === 'start') {
        this.form.start_time = date
      } else {
        this.form.end_time = date
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
