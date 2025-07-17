<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Dashboard" :with-site-id="false" />
    <div class="mt-2 grid grid-cols-12 gap-2">
      <PowerAnalytics />
      <BatteryAnalytics />
      <TemperatureAnalytics />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup'],
  computed: {
    ...mapGetters('dashboard', ['counts']),
    ...mapGetters('user', ['rootUserUid']),
  },
  mounted() {
    this.$store.dispatch('dashboard/getStatusCounts', this.rootUserUid)
  },
  methods: {
    async exportExcel(type) {
      try {
        const fileNames = {
          mains: 'Mains availability of sites',
          dg: 'DG running sites',
          temperature: 'Site temperature',
          battery: 'Site battery backup',
        }
        const options = {
          type,
          file_name: fileNames[type],
          user_uid: this.rootUserUid,
        }
        await this.$store.dispatch('dashboard/excelExport', options)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
  },
}
</script>
