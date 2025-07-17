<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Update Payment" :with-site-id="false" />
    <div class="mt-2 min-h-[70vh] rounded bg-white p-4 shadow">
      <div class="flex flex-col">
        <div class="my-8 flex w-full flex-col items-center">
          <button
            v-if="!selectedFile"
            class="flex items-center gap-2 rounded bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg transition duration-300 hover:bg-gray-300"
            @click="$refs.file_input.click()"
          >
            <img src="/icon/ms-excel.png" alt="" class="h-6 w-6" />
            Upload Excel
          </button>
          <button v-else class="rounded bg-blue-500 px-4 py-2 text-white" @click="saveData">
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Save
          </button>

          <div
            v-if="selectedFile"
            class="mt-6 flex flex-row items-start justify-between space-x-2 rounded border border-gray-200 px-4 py-2"
          >
            <span class="text-sm font-medium text-blue-500">{{ selectedFile?.name }}</span>
            <span class="rounded bg-gray-200 px-1 py-0.5 text-xs font-semibold text-gray-600">
              {{ formattedFileSize }}
            </span>
            <button class="text-red-500 hover:text-red-700" @click="removeFile">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div v-if="!selectedFile" class="relative mt-16 flex w-11/12 flex-col items-center md:w-4/5">
            <span class="text-base font-semibold italic text-gray-700">Sample File</span>
            <img src="/icon/payment-sample.png" alt="" class="mt-2 h-auto w-full overflow-hidden rounded" />
            <div class="absolute inset-x-0 bottom-0 h-20 w-full bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <div v-if="isSubmitted" class="mt-8 flex w-11/12 justify-end md:w-4/5 lg:w-3/4">
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 border border-green-500 bg-green-100"></div>
              <span class="text-sm">Successfully Updated</span>
            </div>
            <div class="ml-4 flex items-center space-x-2">
              <div class="h-4 w-4 border border-red-500 bg-red-100"></div>
              <span class="text-sm">Invalid Row Data</span>
            </div>
            <div class="ml-4 flex items-center space-x-2">
              <div class="h-4 w-4 border border-yellow-500 bg-yellow-100"></div>
              <span class="text-sm">Already Inserted</span>
            </div>
          </div>

          <div
            v-if="tableData.length"
            class="mt-4 max-h-[50vh] w-11/12 overflow-x-auto border border-gray-300 scrollbar-hide md:w-4/5 lg:w-3/4"
          >
            <table class="relative min-w-full rounded-md px-4">
              <thead>
                <SiteBillingHeader />
              </thead>
              <tbody>
                <SiteBillingRow v-for="(row, index) in tableData" :key="index" :row="row" />
              </tbody>
            </table>
          </div>

          <input ref="file_input" type="file" accept=".xls,.xlsx" class="hidden" @change="onFileSelected" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRowsFromFile, getFileSizeAsText } from '~/assets/js/FileHelper'
export default {
  layout: 'default',
  middleware: ['auth', 'finance'],
  data() {
    return {
      title: 'Installation Dump',
      selectedFile: null,
      tableData: [],
      loading: false,
      isSubmitted: false,
    }
  },
  computed: {
    formattedFileSize() {
      return getFileSizeAsText(this.selectedFile)
    },
  },
  methods: {
    async onFileSelected(event) {
      const input = event.target
      if (input.files && input.files[0]) {
        this.selectedFile = input.files[0]
        try {
          const rows = await fetchRowsFromFile(this.selectedFile)
          this.tableData = rows.map(this.parseData)
        } catch (error) {
          this.tableData = []
        }
      }
    },
    removeFile() {
      this.selectedFile = null
      this.tableData = []
      this.$refs.file_input.value = ''
      this.isSubmitted = false
    },
    async saveData() {
      if (this.loading || !this.validateData(this.tableData)) return
      try {
        this.loading = true
        const response = await this.$axios.post('/user/payment/save', {
          data: this.tableData,
        })
        this.tableData = [...response.data]
        this.isSubmitted = true
      } catch (error) {
        this.$toast.error('Failed to save data')
      } finally {
        this.loading = false
      }
    },
    validateData(rows) {
      if (rows.length > 100) {
        this.$toast.error('Maximum 100 rows are allowed to upload at a time')
        return false
      }

      for (const row of rows) {
        if (!row.site_name || !row.device_id || !row.submission_at || !row.amount || !row.status) {
          this.$toast.error(
            'Please fill all the required fields (Site Name, Device ID, Bill Submission Date, Amount, Status)'
          )
          return false
        }
      }

      return true
    },
    parseData(row) {
      return {
        site_name: row[0],
        device_id: row[1],
        submission_at: row[2],
        payment_at: row[3],
        amount: row[4],
        invoice: row[5],
        po: row[6],
        status: row[7],
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
