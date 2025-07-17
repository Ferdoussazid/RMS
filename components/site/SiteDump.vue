<template>
  <div class="flex w-full items-center">
    <button
      class="group relative flex h-16 w-16 items-center transition duration-300 md:h-8 md:w-8"
      @click="exportSites"
    >
      <i v-if="loadingExport" class="fas fa-circle-notch fa-spin"></i>
      <img v-else src="/icon/ms-excel.png" alt="" />
      <div
        class="tooltip absolute left-[20%] bottom-0 z-[999] mb-1 -translate-x-1/2 translate-y-10 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div class="tooltip-arrow"></div>
        <span class="tooltip-text">Export Sites</span>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const downloadFile = require('js-file-download')

export default {
  data() {
    return {
      loadingExport: false,
    }
  },
  computed: {
    ...mapGetters('user', ['rootUserUid']),
  },
  methods: {
    async exportSites() {
      if (this.loadingExport) return
      this.loadingExport = true
      try {
        const res = await this.$axios.get('/user/site/export', {
          params: {
            user_uid: this.rootUserUid,
          },
          responseType: 'arraybuffer',
        })
        downloadFile(res.data, 'All Sites Export.xlsx')
      } catch (error) {
        this.$toast.error('Failed to export sites')
      } finally {
        this.loadingExport = false
      }
    },
  },
}
</script>

<style scoped></style>
