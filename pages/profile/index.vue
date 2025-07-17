<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Account" :in-tenant-specific-page="false"></AppToolbar>
    <div class="mt-2 flex flex-col items-stretch justify-around rounded bg-white p-5 shadow-md md:flex-row">
      <div class="flex w-10/12 flex-col space-y-4 md:w-1/3">
        <h2 class="text-lg font-semibold text-slate-700">Edit Profile Information</h2>
        <FixedLabelInput v-model="profile.name" label="Full Name" />
        <FixedLabelInput v-model="profile.designation" label="Designation" />
        <FixedLabelInput v-model="profile.phone" label="Phone Number" />
        <FixedLabelInput v-model="profile.email" label="Email Address" />
        <FixedLabelInput v-model="profile.job_location" label="Job Location" />
        <button
          class="rounded bg-green-600 px-3 py-3 text-xs font-medium text-white shadow-md transition duration-300 hover:bg-green-500"
          @click="onProfileSaveClick"
        >
          <i v-if="loading.profile" class="fas fa-circle-notch fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          Save
        </button>
      </div>
      <div class="flex w-10/12 flex-col space-y-4 md:w-1/3">
        <h2 class="text-lg font-semibold text-slate-700">Change Password</h2>
        <FixedLabelInput v-model="password.old_password" input-type="password" label="Current Password" />
        <FixedLabelInput v-model="password.new_password" input-type="password" label="New Password" />
        <FixedLabelInput v-model="password.confirmation" input-type="password" label="Confirm password" />
        <button
          class="rounded bg-blue-600 px-3 py-3 text-xs font-medium text-white shadow-md transition duration-300 hover:bg-blue-500"
          @click="onPasswordChangeClick"
        >
          <i v-if="loading.password" class="fas fa-circle-notch fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          Change
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'setup'],
  data: () => ({
    profile: {
      user_uid: '',
      name: '',
      phone: '',
      email: '',
      designation: '',
      job_location: '',
    },
    password: {
      user_uid: '',
      old_password: '',
      new_password: '',
      confirmation: '',
    },
    loading: {
      profile: false,
      password: false,
    },
  }),
  mounted() {
    this.profile.user_uid = this.$auth.user.uid
    this.profile.name = this.$auth.user.name
    this.profile.phone = this.$auth.user.phone
    this.profile.email = this._.get(this.$auth.user.meta, 'email', undefined)
    this.profile.designation = this._.get(this.$auth.user.meta, 'designation', undefined)
    this.profile.job_location = this._.get(this.$auth.user.meta, 'job_location', undefined)

    this.password.user_uid = this.$auth.user.uid
  },
  methods: {
    async onProfileSaveClick() {
      if (this.loading.profile) return

      this.loading.profile = true
      try {
        await this.$store.dispatch('user/updateProfile', this.profile)
        this.$toast.success('Profile updated')
        await this.$auth.fetchUser()
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading.profile = false
    },
    async onPasswordChangeClick() {
      if (this.loading.password) return

      if (this.password.new_password !== this.password.confirmation) {
        this.$toast.error('Password does not match, please check again')
        return
      }

      this.loading.password = true
      try {
        await this.$store.dispatch('user/changePassword', this.password)
        this.$toast.success('Password changed')
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading.password = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
