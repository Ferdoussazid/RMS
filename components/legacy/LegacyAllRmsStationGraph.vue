<template>
    <div class="" v-if="loading === true">
    </div>
    <div class="col-span-12 flex w-full flex-col rounded bg-slate-100 shadow-md md:col-span-6" v-else>

        <div class="flex flex-col md:flex-row  items-center justify-between md:px-4 px-2 pb-3">
            <div class="flex flex-row items-center md:justify-start justify-center pt-2 flex-nowrap min-w-[100px]">
                <h3 class="text-sm font-semibold capitalize text-gray-600">{{ getPageName }}</h3>
            </div>
            <div class="flex gap-2 align-middle flex-wrap">
                <div class="flex shrink-0 justify-end pt-2">
                    <select v-model="selectedType"
                        class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
                        <option v-for="(t, i) in typeFilters" :key="i" :value="t.value">{{ t.label }}</option>
                    </select>
                </div>
                <div class="relative flex max-w-[160px] shrink-0 justify-end pt-2" v-if="selectedType === 'rms'">
                    <div class="absolute left-0 top-0 z-50 mt-12 flex max-h-[300px] w-full items-center overflow-x-hidden overflow-y-scroll rounded border bg-white"
                        :class="rmsText == '' || selectedRMS ? 'hidden' : searchResults.length > 5 ? 'min-h-20' : ''">
                        <div v-if="searchResults.length > 0" class="w-full"
                            :class="searchResults.length > 5 ? 'h-[200px]' : 'h-[100%]'">
                            <div v-for="r in searchResults" :key="r.uid" @click="selectRMS(r)"
                                class="flex cursor-pointer items-center justify-between border-b border-gray-200 p-2 hover:bg-gray-100">
                                <span class="text-xs font-semibold text-gray-700">{{ r.name }}</span>
                            </div>
                        </div>
                        <!-- <div v-else class="flex items-center justify-center px-2 py-4">
                            <span class="text-xs font-semibold text-gray-500">No RMS Found</span>
                        </div> -->
                    </div>
                    <LegacySearchInputField v-model="rmsText" :selectedItem="(selectedRMS && selectedRMS.name) || ''"
                        @clear="clearRmsSearch" />
                </div>
                <div class="relative flex max-w-[160px] shrink-0 justify-end pt-2" v-if="selectedType === 'cluster'">
                    <select v-model="cluster"
                        class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2">
                        <option value="">{{ clusterSelectLabel }}</option>
                        <option v-for="(c, i) in clusterList" :key="i" :value="c">{{ c }}</option>
                    </select>
                </div>
                <div class="relative flex max-w-[160px] shrink-0 justify-end pt-2" v-if="selectedType === 'area'">
                    <select v-model="area"
                        class="col-span-6 cursor-pointer rounded border border-slate-200 bg-white py-1.5 pl-4 pr-8 text-xs font-medium text-gray-600 shadow-sm md:col-span-2">
                        <option value="">Select Zone</option>
                        <option v-for="(c, i) in areaList" :key="i" :value="c">{{ c }}</option>
                    </select>
                </div>
                <div class="flex shrink-0 justify-end pt-2">
                    <select v-model="selectedView"
                        class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
                        <option v-for="(t, i) in viewFilters" :key="i" :value="t.value">{{ t.label }}</option>
                    </select>
                </div>
                <div class="flex shrink-0 justify-end pt-2">
                    <select v-model="selectedDuration"
                        class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
                        <option v-for="(t, i) in durationOptions" :key="i" :value="t.value">{{ t.label }}</option>
                    </select>
                </div>
            </div>
        </div>
        <ApexChart ref="chart" width="100%" :height="400" type="bar" :options="chartOptions" :series="chartData" />
    </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { mapGetters } from 'vuex'
import { ALL_RMS_STATION_GRAPH_COLOR } from '~/assets/js/LegacyHelper';

export default {
    mixins: [UserTypeChecker],
    middleware: ['auth', 'setup', 'user'],
    props: {
        type: {
            type: 'mains_fail' | 'site_down' | 'battery_low' | 'pg_run',
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        }
    },
    data: () => ({
        data: null,
        selectedRMS: null,
        selectedClusterSites: null,
        selectedZoneSites: null,
        series: [],
        selectedDuration: 30,
        selectedView: 'count',
        selectedType: 'rms',
        rmsText: '',
        cluster: '',
        area: '',
        durationOptions: [
            { id: 1, value: 30, label: 'Last 30 Days' },
            { id: 2, value: 15, label: 'Last 15 Days' },
            { id: 3, value: 7, label: 'Last 7 Days' },
        ],
        typeFilters: [
            {
                id: 1,
                value: 'rms',
                label: 'RMS',
            },
            {
                id: 2,
                value: 'cluster',
                label: 'Cluster',
            },
            {
                id: 3,
                value: 'area',
                label: 'Zone',
            },
        ],
        viewFilters: [
            {
                id: 1,
                value: 'count',
                label: 'Number of Site',
            },
            {
                id: 2,
                value: 'percent',
                label: 'Percentage',
            },
        ],
        searchResults: [],
        areaList: [],
        clusterList: [],
        windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    }),
    computed: {
        ...mapGetters('user', ['rootUserUid']),
        ...mapGetters('site', ['siteCount', 'sites']),
        ...mapGetters('dashboard-legacy', ['selectedTab', 'selectedTenant', 'fetchingDashboard']),
        getPageName() {
            if (this.type === 'mains_fail') {
                return 'Mains Fail'
            } else if (this.type === 'site_down') {
                return 'Site Down'
            } else if (this.type === 'battery_low') {
                return 'Battery Low'
            } else if (this.type === 'pg_run') {
                return 'PG Run'
            }

            return ''
        },
        clusterSelectLabel() {
            return 'Select Cluster'
        },
        chartOptions() {
            return {
                chart: {
                    stacked: true,
                    toolbar: {
                        show: true,
                        export: {
                            csv: {
                                filename: `${this.type}-history-of last ${this.selectedDuration} days`,
                                headerCategory: 'Date',
                            },
                        },
                    },
                    zoom: {
                        enabled: true,
                    },
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 1000,
                        },
                    },
                    events: {
                        dataPointSelection: (event, chartContext, config) => {
                            console.log('CLICKED BAR')
                        },
                    },
                },
                colors: [ALL_RMS_STATION_GRAPH_COLOR[this.type]],
                legend: {
                    position: 'top',
                },
                xaxis: {
                    type: 'categories',
                    tickPlacement: 'on', // To enable zoom controls
                    categories: this.series.map(v => v.time),
                    tickAmount: this.windowWidth < 1000 ? 2 : 4,
                    labels: {
                        rotate: this.windowWidth < 1000 ? -45 : 0,
                    },
                },
                yaxis: {
                    max: this.selectedView === 'percent' ? 100 : undefined,
                    title: {
                        text: this.selectedView === 'count' ? 'Number of Site' : 'Percentage (%)',
                    },
                },

                plotOptions: {
                    bar: {
                        horizontal: false,
                        borderRadius: 4,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                fill: {
                    opacity: 1,
                },
            }
        },
        chartData() {
            let name = ""
            if (this.type === 'mains_fail') {
                name = 'Mains Fail'
            } else if (this.type === 'site_down') {
                name = 'Site Down'
            } else if (this.type === 'battery_low') {
                name = 'Battery Low'
            } else if (this.type === 'pg_run') {
                name = 'PG Run'
            }

            let data = []
            if (this.selectedType === 'rms') {
                data = this.series.map(item =>
                    this.selectedView === 'count' && this.selectedRMS
                        ? item.site_uids.includes(this.selectedRMS.uid)
                            ? 1
                            : 0
                        : this.selectedView === 'percent' && this.selectedRMS
                            ? item.site_uids.includes(this.selectedRMS.uid)
                                ? 100
                                : 0
                            : this.selectedView === 'count'
                                ? item.count
                                : item.percent
                )
            } else if (this.selectedType === 'cluster' && this.cluster) {
                const siteList = this.sites.filter(site => site.place.cluster === this.cluster).map(site => site.uid)

                let total = this.sites.length

                data = this.series.map(item => {
                    const count = item.site_uids.filter(site => siteList.includes(site)).length
                    const percent = Math.round((count / total) * 100)
                    return this.selectedView === 'count' ? count : percent
                })
            } else if (this.selectedType === 'area' && this.area) {
                const siteList = this.sites.filter(site => site.place.zone === this.area).map(site => site.uid)

                let total = this.sites.length

                data = this.series.map(item => {
                    const count = item.site_uids.filter(site => siteList.includes(site)).length
                    const percent = Math.round((count / total) * 100)
                    return this.selectedView === 'count' ? count : percent
                })
            } else {
                data = this.series.map(item => (this.selectedView === 'count' ? item.count : item.percent))
            }
            return [
                {
                    name: `${name}`,
                    data: data,
                },
            ]
        },
    },
    watch: {
        async selectedDuration() {
            await this.fetchData()
        },
        async selectedTenant() {
            await this.fetchData()
        },
        rmsText(searchText) {
            if (!this.sites) return []
            this.searchResults = this.sites.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()))
        },
        sites(val, old) {
            this.setAreaList()
            this.setClusterList()
        },
        selectedType(val, old) {
            this.area = ''
            this.cluster = ''
            this.selectedRMS = null
            this.searchResults = []
        },

    },
    async mounted() {
        await this.fetchData()
        window.addEventListener("resize", this.updateWindowWidth);
        this.setAreaList()
        this.setClusterList()
    },
    methods: {
        updateWindowWidth() {
            this.windowWidth = window.innerWidth;
        },
        setAreaList() {
            const items = this.sites.map(s => this._.get(s, 'place.zone', '')).filter(a => !!a)
            this.areaList = this._.uniq(items)
        },
        setClusterList() {
            const items = this.sites.map(s => this._.get(s, 'place.cluster', '')).filter(c => !!c)
            this.clusterList = this._.uniq(items)
        },
        async fetchData() {
            try {
                const from_time = new Date()
                from_time.setDate(from_time.getDate() - this.selectedDuration)

                const params = {
                    user_uid: this.rootUserUid,
                    event_name: this.type,
                    until_time: new Date().toISOString(),
                    from_time: from_time.toISOString(),
                    tenant: this.selectedTenant !== '' ? this.selectedTenant : null,
                }
                const res = await this.$axios.$get('/user/network/legacy-trend', { params })
                this.series = res.map(v => ({
                    time: v.time,
                    site_uids: v.site_uids,
                    count: v.site_uids.length,
                    percent: this.siteCount.total ? Math.round((v.site_uids.length / this.siteCount.total) * 100) : 0,
                }))
                // this.shouldRefresh++
                this.$emit('stopLoader',)
            } catch (error) {
                console.log(error)
                this.$emit('stopLoader',)
            }
        },
        selectRMS(rms) {
            this.selectedRMS = rms
            this.rmsText = rms.name
        },
        clearRmsSearch() {
            this.selectedRMS = null
            this.rmsText = ''
        },
    },
}
</script>

<style scoped></style>
