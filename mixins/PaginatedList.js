export default {
  data() {
    return {
      showPagination: false,
      currentPage: 1,
      perPage: 25,
      pageCount: 0,
    }
  },
  methods: {
    getSerial(index) {
      return index + 1 + this.perPage * (this.currentPage - 1)
    },

    showPaginate(val) {
      if (val.total <= this.perPage) {
        this.showPagination = false
      } else {
        this.showPagination = true
      }
    },
  },
}
