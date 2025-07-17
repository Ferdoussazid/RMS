<template>
    <div class="fixed left-0 w-full h-full flex justify-center align-middle bg-black bg-opacity-50 z-[1000]"
        :class="viewOpen ? 'top-0' : 'top-[-110%]'">
        <div class="w-[300px] h-[300px]  bg-white gap-2 my-auto">
            <div v-for="item in types" class="p-4 flex gap-3">
                <ToggleSwitch :status="itemStatus(item)" @toggleStatus="toggleStatus(item)" />
                <span class="block text-xs font-semibold text-gray-700 my-auto">{{ formattedName(item) }}</span>
            </div>

            <div class="flex justify-center p-4">
                <button
                    class="px-4 py-2 text-xs font-medium text-white bg-blue-500 shadow hover:bg-blue-600 focus:outline-none rounded overflow-hidden"
                    @click="closeView">
                    Close
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        selectedTypes: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            types: ["mains_fail", "pg_run", "battery_low", "site_down"]
        }
    },
    computed: {
        ...mapGetters('dashboard-legacy', ['viewOpen']),
    },
    methods: {
        closeView() {
            this.$store.dispatch('dashboard-legacy/setViewOpen', false)
        },
        itemStatus(item) {
            return this.selectedTypes.includes(item)
        },
        toggleStatus(type) {
            const types = this.selectedTypes.includes(type) ? this.selectedTypes.filter(item => item !== type) : [...this.selectedTypes, type]
            if (localStorage) {
                localStorage.setItem('rms_selectedTypes', JSON.stringify(types))
            }
            this.$emit('updateTypes', types)
        },
        formattedName(name) {
            return name.split('_').join(' ').toUpperCase()
        }
    }
}
</script>

<style scoped></style>