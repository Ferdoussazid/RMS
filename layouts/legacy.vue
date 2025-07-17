<template>
    <div class="app-container flex min-h-screen min-w-full flex-row-reverse bg-cover bg-fixed">
        <WebsocketClient />
        <div class="flex w-full flex-col items-stretch gap-y-2 p-4">
            <div class="flex flex-col w-full min-h-screen">
                <AppToolbar title="Dashboard" :with-site-id="false">
                    <template #action>
                        <NLink to="/dashboard/business"
                            class="flex flex-row items-center space-x-2 rounded bg-blue-500 px-4 py-1.5 text-xs font-medium text-white transition duration-300 hover:bg-blue-600">
                            <i class="fas fa-chart-line"></i>
                            <span>Smart Dashboard</span>
                        </NLink>
                    </template>
                </AppToolbar>
                <CountSummaryBar />
                <div class="flex flex-col w-full gap-2 lg:flex-row">
                    <div class="flex flex-col w-full bg-white rounded min-h-[70vh]">
                        <div class="flex flex-col pr-6 lg:flex-row md:justify-between md:pr-10">
                            <div class="flex flex-row items-center px-2 pt-2 mt-2 tabs shrink-0">
                                <a class="font-medium tab-lifted tab"
                                    :class="[allRmsStationActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('all-rms-station')">
                                    <i class="mr-2 fas fa-broadcast-tower"></i> All RMS Station
                                </a>
                                <a class="font-medium tab-lifted tab"
                                    :class="[alarmActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('alarm')">
                                    <i class="mr-2 fas fa-bell"></i> Alarm
                                </a>
                                <a class="font-medium tab-lifted tab"
                                    :class="[dcEnergyMeterActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('dc-energy-meter')">
                                    <i class="mr-2 fas fa-bolt"></i> DC Energy Meter
                                </a>

                                <a class="font-medium tab-lifted tab"
                                    :class="[climateActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('climate')">
                                    <i class="mr-2 fas fa-temperature-low"></i> Climate
                                </a>

                                <a class="font-medium tab-lifted tab"
                                    :class="[rectifierActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('rectifier')">
                                    <i class="mr-2 fas fa-microchip"></i> Rectifier
                                </a>
                                <a class="font-medium tab-lifted tab"
                                    :class="[batteryActive ? 'tab-active text-gray-800' : 'text-gray-600']"
                                    @click="onTabClick('battery')">
                                    <i class="mr-2 fas fa-battery-three-quarters"></i> Battery
                                </a>
                            </div>

                            <div class="flex justify-end mt-4 shrink-0" v-if="isTenantVisible">
                                <button class="bg-blue-500 px-4 py-2 text-xs font-semibold text-white mr-2"
                                    v-if="allRmsStationActive" @click="viewOpenHandeler()"><i class="fas fa-cog"></i>
                                    View
                                    Settings</button>
                                <select v-model="tenant"
                                    class="cursor-pointer rounded border border-blue-200 bg-blue-50 py-1.5 pl-4 pr-8 text-xs font-semibold capitalize text-gray-600 shadow-sm">
                                    <option value="">All Tenant</option>
                                    <option v-for="(t, i) in allowedTenants" :key="i" :value="t">{{
                                        getLabelOfTenant(t)}}</option>
                                </select>
                            </div>
                        </div>
                        <nuxt />
                    </div>
                </div>
            </div>
        </div>

        <div id="sidemenu"
            class="fixed inset-y-0 left-0 isolate z-[1000] min-h-screen w-full -translate-x-full rounded-none bg-white/80 shadow-md backdrop-blur-sm backdrop-filter transition duration-300 ease-in-out md:flex md:w-3/12 md:flex-col md:rounded-r-2xl lg:w-2/12">
            <div class="flex h-full w-full flex-col items-stretch">
                <div
                    class="relative mt-5 flex h-16 w-full cursor-pointer flex-row items-center justify-start space-x-1 py-4 px-4 md:py-0">
                    <div class="flex justify-center gap-4">
                        <img class="h-10 w-auto shrink-0" :src="logo" title="Radar RMS" />
                    </div>

                    <button class="absolute right-6 top-1/2 -translate-y-1/2 transform text-gray-500"
                        @click="controlDrawerMenu('close')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-current" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <AppMenu />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import utils from '~/mixins/utils'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { LEGACY_PAGES, SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';
export default {
    middleware: ['auth', 'user'],
    mixins: [utils, UserTypeChecker],
    data() {
        return {
            siteSpecificRoutes: [
                '/site',
                '/alarm',
                '/oem/data',
                '/access',
                '/mains',
                '/battery',
                '/generator',
                '/temperature',
                '/report',
                '/settings',
            ],
            loading: true,
            intervalId: null,
            loadingExport: false,
            tenant: '',
            showExport: false,
        }
    },
    head() {
        return {
            link: [
                {
                    rel: 'apple-touch-icon',
                    href: this.pathto('/favicon/apple-touch-icon.png'),
                },
                { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: true,
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap',
                },
                {
                    rel: 'stylesheet',
                    href: this.pathto('/fontawesome5/css/all.css'),
                },
            ],
        }
    },
    computed: {
        ...mapGetters(['token', 'jwtToken']),
        ...mapGetters('site', ['sites']),
        ...mapGetters('user', ['rootUserUid', 'tokenExpired', 'allowedTenants']),
        ...mapGetters('dashboard-legacy', ['selectedTab', 'selectedTenant', 'fetchingDashboard']),
        ...mapGetters('dashboard', ['fetchingDashboard']),
        logo() {
            return this.$auth.user?.logo || '/image/hsl-logo.png'
        },
        isTenantVisible() {
            return this.selectedTab !== LEGACY_PAGES.CLIMATE
        },
        isVisitingSiteSpecificRoute() {
            return this.siteSpecificRoutes.includes(this.$route.path)
        },
        allRmsStationActive() {
            return this.selectedTab === LEGACY_PAGES.ALL_RMS_STATION
        },
        alarmActive() {
            return this.selectedTab === LEGACY_PAGES.ALARM
        },
        dcEnergyMeterActive() {
            return this.selectedTab === LEGACY_PAGES.DC_ENERGY_METER
        },
        climateActive() {
            return this.selectedTab === LEGACY_PAGES.CLIMATE
        },
        rectifierActive() {
            return this.selectedTab === LEGACY_PAGES.RECTIFIER
        },
        batteryActive() {
            return this.selectedTab === LEGACY_PAGES.BATTERY
        },

        showTabContent() {
            return this.selectedTab
        },
        showExtraOptions() {
            return !this.isReadOnlyUser
        },
    },
    watch: {
        tenant(val, old) {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TENANT', val)
            this.$store.commit('dashboard/SET_SELECTED_TENANT', val)
        },
    },

    mounted() {
        this.menu = document.querySelector('#sidemenu')
        this.$bus.$on('drawer', this.controlDrawerMenu.bind(this))

        this.setupSites()
        if (!this.selectedTab) {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TAB', LEGACY_PAGES.ALL_RMS_STATION)
        }
        if (this.isFTB && !this.isReadOnlyUser) {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TENANT', SITE_TENANT.BANGLALINK)
        }
        this.tenant = this.selectedTenant
        this.countDashboardAlarms()

        const path = this.$route.fullPath
        const match = path.match(/\/dashboard\/legacy\/([^?\/]+)/);
        if (match) {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TAB', match[1].trim())

        } else {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TAB', LEGACY_PAGES.ALL_RMS_STATION)
        }

        if (!this.canAccessLegacyDashboard) {
            this.$router.push('/dashboard')
        }
    },
    methods: {
        getLabelOfTenant(tenant) {
            return getTenantLabel(tenant, false)
        },
        controlDrawerMenu(action) {
            const targetClass = '-translate-x-full'
            if (action === 'open') {
                this.menu.classList.remove(targetClass)
            } else if (action === 'close') {
                this.menu.classList.add(targetClass)
            }
        },
        viewOpenHandeler() {
            this.$store.dispatch('dashboard-legacy/setViewOpen', true)
        },
        async setupSites() {
            try {
                if (this.sites.length === 0 && !this.tokenExpired) {
                    await this.$store.dispatch('site/setupSites')
                }
            } catch (error) {
                // console.log(error)
            }
        },
        countDashboardAlarms() {
            // this.intervalId = setInterval(() => {
            //     if (this.sites.length) {
            //         this.$store.dispatch('dashboard-legacy/updateAlarmDashboard')
            //     }
            // }, 2000)
        },

        onTabClick(tab) {
            this.$store.commit('dashboard-legacy/SET_SELECTED_TAB', tab)
            if (tab === 'all-rms-station') { this.$router.push(`/dashboard/legacy/`) }

            else {
                this.$router.push(`/dashboard/legacy/${tab}`)
            }
        },

    },

    destroyed() {
        clearInterval(this.intervalId)
    },
}
</script>

<style lang="scss" scoped></style>