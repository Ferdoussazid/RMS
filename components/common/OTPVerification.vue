<template>
  <div ref="container" class="mx-auto my-2 w-4/5">
    <div v-if="isVerified" class="flex flex-col items-center gap-4">
      <img src="/icon/checkmark.png" alt="verified" class="h-auto w-28" />
      <p class="text-center text-2xl font-semibold tracking-wider text-emerald-500">OTP Verified!</p>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <div class="mb-4 flex flex-col items-center">
        <img src="/icon/passcode.png" class="mb-4 h-auto w-20" alt="" />
        <p class="text-center text-xl font-semibold text-gray-700">Verify OTP</p>
        <p v-if="!isExpired" class="text-sm font-medium text-stone-500">{{ formattedTimeRemaining }}</p>

        <div v-else class="mt-2 flex flex-col items-center gap-1 text-sm font-medium leading-none text-stone-500">
          <p class="text-red-500">Time Expired!</p>
          <span class="cursor-pointer font-semibold text-sky-600 hover:text-sky-500" @click="resendOTP">
            Click here to resend OTP</span>
        </div>
      </div>
      <div class="flex gap-4">
        <input v-for="(digitInput, index) in otpLength" :key="index" ref="otpInput" v-model="otpArray[index]"
          type="number" step="1" maxlength="1" :disabled="isVerified || isExpired || isVerifyingOTP"
          class="font-inherit flex w-8 appearance-none justify-center rounded-lg border border-sky-500 p-2 text-center text-xl font-bold leading-tight tracking-widest text-current outline-none disabled:cursor-not-allowed disabled:border-none disabled:bg-gray-200 disabled:text-gray-600 disabled:opacity-50"
          :class="{ bounce: otpArray[index] }" @keydown="handleEnter(index, $event)" @input="handleInput(index, $event)"
          @paste="handlePaste(index, $event)" />
      </div>
      <!-- <span>The current OTP is: {{ otpArray.join('') }}</span> -->
      <div v-if="errorMessage" class="mt-2 flex flex-col items-center leading-none">
        <p class="text-red-500">
          {{ errorMessage }}
        </p>
        <span class="cursor-pointer font-semibold text-sky-600 hover:text-sky-500" @click="resendOTP">
          Click here to resend OTP</span>
      </div>
      <div v-if="isVerifyingOTP" class="mt-2 flex flex-col items-center gap-1">
        <LoadingSpinner />
        <span>Verifying OTP...</span>
      </div>
    </div>
  </div>
</template>

<script>
import platform from 'platform'
import uuid4 from 'uuid4'
export default {
  props: {
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isVerified: false,
      isExpired: false,
      timeRemaining: 120,
      otpArray: Array(this.otpLength).fill(''),
      error: '',
      joinedValue: '',
      otpLength: 6,
      errorMessage: '',
      isVerifyingOTP: false,
    }
  },
  computed: {
    formattedTimeRemaining() {
      const minutes = Math.floor(this.timeRemaining / 60)
      const seconds = this.timeRemaining % 60
      return `Remaining time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
  },
  mounted() {
    this.$refs.otpInput[0].focus()
    this.startTimer()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    startTimer() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--
        } else {
          this.isExpired = true
          this.resetOTPFields()
          clearInterval(this.timer)
        }
      }, 1000)
    },
    async verifyOTP() {
      if (this.isVerifyingOTP) {
        return
      }
      this.errorMessage = ''
      this.isVerifyingOTP = true
      try {
        const id = localStorage.getItem('device_id')
        if (!id) {
          this.setDeviceID()
        }
        await this.$store.dispatch('user/verifyOTP', {
          phone: this.phone,
          password: this.password,
          otp: this.joinedValue,
          deviceId: localStorage.getItem('device_id'),
          platform: platform.description,
        })
        this.$toast.success('OTP Verified')
        this.isVerified = true
        this.$emit('verified')
      } catch (error) {
        this.resetOTPFields()
        this.errorMessage = error.response.data.message
        this.$toast.error(this.errorMessage)
      }
      this.isVerifyingOTP = false
    },

    setDeviceID() {
      const id = uuid4()
      localStorage.setItem('device_id', id)
    },

    resendOTP() {
      this.isExpired = false
      this.resetOTPFields()
      this.startTimer()
      this.timeRemaining = 120
      this.$emit('resend')
    },
    resetOTPFields() {
      this.otpArray = Array(this.otpLength).fill('')
      this.isVerified = false
      this.errorMessage = ''
      this.isVerifyingOTP = false
      this.$refs.otpInput[0].focus()
    },
    handleEnter(index, event) {
      const keypressed = event.keyCode || event.which
      const isNumberKey = (keypressed >= 48 && keypressed <= 57) || (keypressed >= 96 && keypressed <= 105)
      const isControlKey = keypressed === 8 || keypressed === 46 || event.ctrlKey
      if (!isNumberKey && !isControlKey) {
        event.preventDefault()
      }
      if (keypressed === 8 || keypressed === 46) {
        event.preventDefault()
        if (!this.otpArray[index] && index > 0) {
          this.otpArray[index - 1] = ''
          this.$refs.otpInput[index - 1].value = ''
          this.$refs.otpInput[Math.max(0, index - 1)].focus()
        } else {
          this.otpArray[index] = ''
          this.$refs.otpInput[index].value = ''
        }
      }
    },
    handleInput(index, event) {
      if (index < this.otpLength - 1) {
        this.$refs.otpInput[index + 1].focus()
      }
      if (index === this.otpLength - 1) {
        this.$refs.otpInput[index].blur()
      }

      if (event.inputType === 'insertFromPaste') {
        this.handlePasteEvent(index)
      }
      this.joinedValue = this.otpArray.join('')
      if (this.joinedValue.length === this.otpLength) {
        this.verifyOTP()
      }
    },
    handlePaste(index, event) {
      this.handlePasteEvent(index)
      this.$emit('paste', event)
    },
    handlePasteEvent(index) {
      navigator.clipboard.readText().then(pastedText => {
        const shavedText = pastedText.replace(/[^0-9]/g, '')
        for (let i = 0; i < shavedText.length && index + i < this.otpLength; i++) {
          this.otpArray[index + i] = shavedText.charAt(i)
          if (index + i + 1 < this.otpLength) {
            this.$refs.otpInput[index + i + 1].dispatchEvent(new Event('input'))
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.bounce {
  animation: pulse 0.3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>
