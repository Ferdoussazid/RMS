<template>
  <div>
    <input id="card-add-modal" ref="mtrigger" type="checkbox" class="modal-toggle hidden" />
    <label ref="backdrop" for="card-add-modal" class="modal w-full">
      <label class="modal-box relative flex w-11/12 max-w-5xl flex-col md:w-1/4 lg:w-1/3" for="">
        <span class="text-lg font-semibold text-gray-700">Add New Access Card</span>
        <div class="w-full flex flex-col items-stretch mt-4 justify-center space-y-4">
          <FixedLabelInput v-model="form.name" label="Employee Name" />
          <FixedLabelInput v-model="form.phone" label="Phone Number" />
          <FixedLabelInput v-model="form.designation" label="Designation" />
          <FixedLabelInput v-model="form.card_number" label="Card Number" placeholder="Ex: 0001234567" />
        </div>
        <div class="border-t border-slate-200 mt-4 pt-4 px-4 flex flex-row space-x-4 justify-end items-center">
          <button
            class="
              bg-white
              rounded
              transition
              duration-300
              hover:bg-slate-200
              text-sm
              px-4
              py-1.5
              flex
              items-center
              space-x-2
            "
            @click="dismiss"
          >
            <i class="fas fa-times"></i>
            <span>Cancel</span>
          </button>
          <button
            class="
              bg-green-500
              rounded
              transition
              duration-300
              hover:bg-green-600
              text-sm
              px-4
              py-1.5
              flex
              items-center
              space-x-2
              text-white
            "
            @click="submit"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            <span>Save</span>
          </button>
        </div>
      </label>
    </label>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {},
  data: () => ({
    loading: false,
    form: {
      name: '',
      phone: '',
      user_uid: 0,
      designation: '',
      card_number: '',
    },
  }),
  computed: {
    ...mapGetters('user', ['rootUserUid']),
  },
  mounted() {
    this.form.user_uid = this.rootUserUid
  },
  methods: {
    show() {
      this.$refs.mtrigger.click()
    },
    dismiss(cardAdded = false) {
      this.resetForm()
      this.$refs.backdrop.click()
      this.$emit('dismiss', cardAdded)
    },

    resetForm() {
      this.form.name = ''
      this.form.phone = ''
      this.form.designation = ''
      this.form.card_number = ''
    },

    async submit() {
      if (this.loading) return
      this.loading = true
      try {
        this.validate()
        await this.$store.dispatch('acs/saveAccessCard', this.form)
        this.$toast.success('Card added succesfully')
        this.dismiss(true)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading = false
    },

    validate() {
      if (!this.form.name) throw new Error('Please write employee name')
      if (!this.form.phone) throw new Error('Please write employee phone')
      if (!this.form.designation) throw new Error('Please write employee designation')
      if (!this.form.card_number) throw new Error('Please write employee card number')

      return true
    },
  },
}
</script>

<style lang="scss" scoped></style>
