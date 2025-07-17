<template>
  <div class="flex h-screen items-center justify-center bg-white">
    <div class="flex flex-col items-center text-center">
      <img src="/image/logo.png" alt="" class="h-20 w-20" />
      <h2
        class="header-title wow fadeInUp mb-3 text-4xl font-bold text-white"
        data-wow-duration="1.3s"
        data-wow-delay="0.5s"
      ></h2>
      <p class="text wow fadeInUp mb-8 text-white" data-wow-duration="1.3s" data-wow-delay="0.8s"></p>
      <div class="relative h-4 w-80 overflow-hidden rounded-full bg-gray-200">
        <div class="absolute top-0 left-0 h-full w-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500">
          <div
            :style="{ width: `${progress}%` }"
            class="h-full rounded-full bg-cyan-600 transition-all duration-1000 ease-in-out"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
  data() {
    return {
      progress: 0,
      progressInterval: null,
    }
  },
  computed: {
    ...mapGetters('user', ['allowedTenants']),
  },
  mounted() {
    this.startProgress()
  },
  methods: {
    startProgress() {
      this.progressInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 100
        } else {
          clearInterval(this.progressInterval)
          let redirectionPath = '/dashboard/business'
          if (this.isSudoUser) {
            redirectionPath = '/device/list'
          } else if (this.isOpsUser) {
            redirectionPath = '/customer/sites'
          } else if (this.isReadOnlyUser) {
            redirectionPath = `/dashboard/${this.allowedTenants[0]}`
          } else {
            redirectionPath = '/dashboard/business'
          }
          this.$router.push(redirectionPath)
        }
      }, 10)
    },
  },
}
</script>
