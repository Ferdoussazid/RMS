<template>
  <div class="flex flex-row items-center space-x-6">
    <div class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg"
      :class="[theme.color]">
      <img :src="theme.icon" alt="" class="" />
    </div>
    <div class="flex flex-col">
      <span v-if="duration > -1" class="text-xs font-bold text-gray-700"> {{ formattedDuration }} </span>
      <span v-else class="text-xs font-bold text-gray-700"> -- hours: -- minutes</span>
      <span class="text-xs font-normal text-gray-700">{{ label }}</span>
    </div>
  </div>
</template>

<script>
import { SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper';

export default {
  props: {
    type: {
      type: String,
      validate: val => ['max', 'left'].includes(val),
      required: true,
    },
    tenant: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  computed: {
    label() {
      const labels = {
        max: 'Battery Backup',
        left: 'Remaining Backup',
      }
      return labels[this.type] + ` (${(this.validTenant)})`
    },
    validTenant() {
      return this._.capitalize(this.getLabelOfTenant(this.tenant || SITE_TENANT.BANGLALINK))
    },
    formattedDuration() {
      return this.$utils.toTimeDuration(this.duration, { longForm: true })
    },
    theme() {
      const themes = {
        max: {
          color: 'from-yellow-500 to-yellow-300',
          icon: '/icon/full-battery.png',
        },
        left: {
          color: 'from-orange-500 to-orange-300',
          icon: '/icon/half-battery.png',
        },
      }
      return themes[this.type]
    },
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
  },
}
</script>

<style lang="scss" scoped></style>
