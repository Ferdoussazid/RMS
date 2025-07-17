<template>
  <div
    class="panel relative w-11/12 rounded-lg bg-white px-8 py-12 shadow-lg shadow-slate-500/10 md:w-1/2 md:px-12 lg:w-1/3">
    <div v-if="isLoggingIn"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white opacity-60">
      <CircularSpinner size="lg" theme="border-cyan-600" />
    </div>
    <div class="panel-body">
      <div v-if="!isVerifyingOTP" class="flex w-full flex-col items-center">
        <img class="h-20 w-auto" src="/icon.png" alt="Radar RMS" />
        <span class="text-lg font-semibold text-gray-800">Reset Password</span>
      </div>
      <div v-if="!isVerifyingOTP" class="mt-12 flex flex-col items-stretch space-y-5">
        <div class="flex w-full flex-col items-start space-y-1">
          <span class="text-sm font-medium text-gray-600">Phone Number</span>
          <input ref="phoneInput" v-model="phone"
            class="w-full rounded border-b border-gray-200 bg-slate-50 px-4 py-2 text-sm text-gray-800" type="text"
            placeholder="Type here" @keydown.enter="sendOTPForVerification" />
        </div>


        <div class="w-full py-6">
          <button type="submit"
            class="w-full rounded bg-blue-500 py-2.5 text-sm font-semibold uppercase text-white transition duration-300 hover:bg-blue-600"
            @click="sendOTPForVerification">
            <span v-if="loading">
              <i class="fas fa-circle-notch fa-spin"></i>
            </span>
            <span v-if="!loading">Reset Password</span>
          </button>
        </div>
      </div>
      <div v-if="isVerifyingOTP" class="mt-3 flex flex-col items-stretch space-y-5">
        <OTPVerificationPasswordReset :phone="phone" @verified="onOTPVerified" @resend="sendOTPForVerification" />
      </div>
    </div>
  </div>
</template>

<script>
import OTPVerificationPasswordReset from '~/components/common/OTPVerificationPasswordReset.vue';

export default {
  layout: 'auth',
  data: () => ({
    phone: '',
    password: '',
    loading: false,
    isVerifyingOTP: false,
    isLoggingIn: false,
  }),
  fetch({ redirect, store }) {
    if (store.state.auth.loggedIn) {
      redirect('/welcome')
    }
  },

  computed: {},
  methods: {
    processError(error) {
      const status = error.response.status
      if (status === 422) {
        const data = error.response.data
        this.$toast.error(data.phone || data.password || data.message)
      } else {
        const message = error.response.data.message || 'Something wrong, Try again'
        this.$toast.error(message)
      }
    },

    async sendOTPForVerification() {
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        const data = {
          phone: this.phone,
        }
        const res = await this.$axios.$post('/user/auth/otp', data)
        this.isVerifyingOTP = true
      } catch (error) {
        this.processError(error)
      }
      this.loading = false
    },
  },
}
</script>
