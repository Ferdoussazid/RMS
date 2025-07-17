<template>
    <div class="relative">
        <input ref="search" v-model="query" type="text"
            class="w-full rounded border border-blue-200 bg-blue-50 px-8 text-xs font-normal text-gray-600 placeholder-gray-500 shadow-sm"
            :placeholder="hint" :class="h_full ? 'h-100' : 'py-1.5'" />
        <svg xmlns="http://www.w3.org/2000/svg"
            class="v-center absolute left-0 ml-2 h-5 w-5 stroke-current text-gray-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <svg v-show="queryNotEmpty" xmlns="http://www.w3.org/2000/svg"
            class="v-center absolute right-0 mr-2 h-5 w-5 cursor-pointer stroke-current text-gray-600" width="24"
            height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
            stroke-linejoin="round" @click="clearQuery">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </div>
</template>

<script>
export default {
    props: {
        focused: {
            type: Boolean,
            default: false,
        },
        hint: {
            type: String,
            default: 'Search Here',
        },
        selectedItem: {
            type: String,
            default: '',
        },
        "h_full": {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data: () => ({
        query: '',
    }),
    computed: {
        queryNotEmpty() {
            return this.query.trim().length > 0
        },
    },
    watch: {
        query(val, old) {
            this.$emit('input', val)
        },
        focused(val, old) {
            if (val) {
                this.$refs.search.focus()
            }
        },
        selectedItem(val, old) {
            this.query = val
        },
    },
    mounted() {
        this.query = this.selectedItem
    },
    methods: {
        clearQuery() {
            this.query = ''
            this.$emit('clear', this.query)
        },
    },
}
</script>

<style lang="scss" scoped></style>