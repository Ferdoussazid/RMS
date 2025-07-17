<template>
    <div class="flex w-full flex-col">
        <AppToolbar :title="getGroupName()" :with-site-id="false" />
        <div class="mt-2 flex w-full flex-col items-stretch justify-evenly gap-2 md:flex-row" v-if="telegramFocusGroup">
            <!-- ALARM SWITHCES WITH LABEL -->
            <ContentCard is-flat has-footer title="Telegram Group Alarm Settings"><template #content>
                    <div class="grid grid-cols-12 gap-5 p-4">
                        <div class="col-span-12 rounded border bg-slate-100 p-4 md:col-span-6"
                            :class="!canAccessAcs ? 'xl:col-span-6' : 'xl:col-span-4'">
                            <span class="text-md mb-4 font-bold text-gray-700">Environment</span>
                            <hr class="my-3" />
                            <div class="grid grid-cols-1 gap-2">
                                <div v-for="(alarm, i) in getFilteredAlarms('ENV')" :key="i"
                                    class="col-span-1 flex gap-2 py-2 align-middle">
                                    <ToggleSwitch :status="alarm.checked" @toggleStatus="toggleStatus(alarm)" />
                                    <span class="text-sm font-medium text-gray-700">{{ alarm.label }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-12 rounded border bg-slate-100 p-4 md:col-span-6"
                            :class="!canAccessAcs ? 'xl:col-span-6' : 'xl:col-span-4'">
                            <span class="text-md mb-4 font-bold text-gray-700">Power</span>
                            <hr class="my-3" />
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div v-for="(alarm, i) in getFilteredAlarms('POWER')" :key="i"
                                    class="col-span-1 flex gap-2 py-2 align-middle">
                                    <ToggleSwitch :status="alarm.checked" @toggleStatus="toggleStatus(alarm)" />
                                    <span class="text-sm font-medium text-gray-700">{{ alarm.label }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-12 rounded border bg-slate-100 p-4 md:col-span-6 xl:col-span-4"
                            v-if="canAccessAcs">
                            <span class="text-md mb-4 font-bold text-gray-700">Access Control</span>
                            <hr class="my-3" />
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div v-for="(alarm, i) in getFilteredAlarms('ACS')" :key="i"
                                    class="col-span-1 flex gap-2 py-2 align-middle">
                                    <ToggleSwitch :status="alarm.checked" @toggleStatus="toggleStatus(alarm)" />
                                    <span class="text-sm font-medium text-gray-700">{{ alarm.label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div
                        class="flex flex-row items-center justify-center space-x-3 border-t border-slate-200 px-3 py-2">
                        <div class="flex space-x-6">
                            <button
                                class="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow transition duration-300 hover:bg-gray-100"
                                @click="goBack">
                                <i class="fas fa-arrow-left"></i>
                                Back
                            </button>
                            <button
                                class="z-50 rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition duration-300 hover:bg-green-600"
                                @click="submitHandeler">
                                <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
                                <i v-else class="fas fa-check"></i>
                                Save
                            </button>
                        </div>
                    </div>
                </template>
            </ContentCard>
        </div>
        <div v-else class="mt-5 flex h-[40vh] flex-col items-center justify-center space-y-6 rounded border bg-white">
            <LoadingSpinner />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    ACS_EVENTS,
    getSiteEventKeyName,
    getSiteEventValueName,
    TELEGRAM_ENVIRONMENT_ALARMS,
    TelegramAlarmNames,
} from '~/assets/js/TelegramConstant'
import UserTypeChecker from '~/mixins/UserTypeChecker';

export default {
    middleware: ['auth', 'setup'],
    mixins: [UserTypeChecker],
    asyncData({ query }) {
        const { chatId = '' } = query
        return { chat_id: chatId }
    },
    data: () => ({
        alarms: TelegramAlarmNames.map(alarm => ({
            label: alarm,
            checked: true,
            key: getSiteEventKeyName(alarm),
            type: TELEGRAM_ENVIRONMENT_ALARMS.find(a => a === getSiteEventKeyName(alarm))
                ? 'ENV'
                : ACS_EVENTS.find(a => a === getSiteEventKeyName(alarm))
                    ? 'ACS'
                    : 'POWER',
        })),
        saving: false,
    }),
    computed: {
        ...mapGetters('telegram', ['telegramFocusGroup']),
        getGroupPermissions() {
            return this.telegramFocusGroup && this.telegramFocusGroup.permitAlarms
                ? this.telegramFocusGroup.permitAlarms.map(alarm => ({
                    label: getSiteEventLabel(alarm.name),
                    checked: alarm.status === 'ACTIVE',
                    key: alarm.name,
                    type: TELEGRAM_ENVIRONMENT_ALARMS.find(a => a === alarm.name)
                        ? 'ENV'
                        : ACS_EVENTS.find(a => a === alarm.name)
                            ? 'ACS'
                            : 'POWER',
                }))
                : []
        },
    },
    async mounted() {
        if (this.chat_id) {
            await this.focusedGroup()
        }
    },
    watch: {
        telegramFocusGroup(newValue) {
            if (newValue && newValue.permitAlarms) {
                this.alarms = newValue.permitAlarms.map(alarm => ({
                    label: getSiteEventValueName(alarm.name),
                    checked: alarm.status === 'ACTIVE',
                    key: alarm.name,
                    type: TELEGRAM_ENVIRONMENT_ALARMS.find(a => a === alarm.name)
                        ? 'ENV'
                        : ACS_EVENTS.find(a => a === alarm.name)
                            ? 'ACS'
                            : 'POWER',
                }))
            }
        },
    },
    methods: {
        getFilteredAlarms(type) {
            return this.alarms.filter(alarm => alarm.type === type)
        },
        async focusedGroup() {
            try {
                this.$store.commit('telegram/SET_LOADING', true)
                await this.$store.dispatch('telegram/getTelegramFocusGroup', this.chat_id)
            } catch (error) {
                this.$router.push('/telegram')
                this.$toast.error(error)
            }
        },
        getGroupName() {
            return this.telegramFocusGroup ? this.telegramFocusGroup.name : 'Loading...'
        },

        toggleStatus(alarm) {
            this.alarms.find(a => a.key === alarm.key).checked = !alarm.checked
        },
        async submitHandeler() {
            if (this.saving) return
            if (!this.focusedGroup) this.$toast.error('Please select a group first!')
            try {
                this.saving = true

                const data = {
                    chat_id: this.chat_id,
                    name: this.getGroupName(),
                    permit_alarms: this.alarms.map(alarm => ({
                        name: alarm.key,
                        status: alarm.checked ? 'ACTIVE' : 'INACTIVE',
                    }))
                }

                await this.$store.dispatch('telegram/updateTelegramGroup', data)
                this.$router.go(-1)

                this.$toast.success('Telegram alarms updated successfully')


            } catch (error) {
                this.$toast.error(error.message)
            }
            this.saving = false
        },
        goBack() {
            this.$router.go(-1)
        },
    },
}
</script>
