<template>
  <EventListItem
    class="relative"
    :event="event"
    theme="from-blue-500 to-blue-300"
    icon="/icon/door-lock7.svg"
    :show-site-name="showSiteName"
  >
    <div class="flex flex-col">
      <span>Door Open: {{ duration }}</span>
      <span class="font-normal text-gray-500">{{ senderName }}</span>
      <span class="font-light text-gray-500">{{ senderPhone }}</span>
    </div>

    <template #extra>
      <div v-if="isExpanded" class="grid grid-cols-12 gap-2 p-2 transition duration-300 ease-in-out">
        <div class="col-span-6 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Name</span
          ><span class="text-xs font-medium text-gray-600">{{ name }}</span>
        </div>
        <div class="col-span-6 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Phone</span
          ><span class="text-xs font-medium text-gray-600">{{ phone }}</span>
        </div>
        <div class="col-span-6 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Designation</span
          ><span class="text-xs font-medium text-gray-600">{{ designation }}</span>
        </div>
        <div class="col-span-6 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Organization</span
          ><span class="text-xs font-medium text-gray-600">{{ organization }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Purpose</span
          ><span class="text-xs font-medium text-gray-600">{{ purpose }}</span>
        </div>
      </div>
    </template>

    <template #meta>
      <div class="flex items-center gap-1">
        <div v-if="canShowDetails" class="flex cursor-pointer justify-center">
          <span
            v-if="!isExpanded"
            class="flex w-full items-center justify-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-teal-600"
            @click="isExpanded = true"
          >
            <i class="fas fa-expand-arrows-alt pr-px"></i>More
          </span>
          <span
            v-if="isExpanded"
            class="flex w-full items-center justify-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-teal-600"
            @click="isExpanded = false"
          >
            <i class="fas fa-compress-arrows-alt pr-px"></i>Less
          </span>
        </div>

        <span
          v-if="initiator"
          class="w-full rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium"
          :class="initiator.theme"
        >
          <i :class="initiator.icon"></i> {{ initiator.label }}
        </span>
      </div>
    </template>
  </EventListItem>
</template>

<script>
import { get } from 'lodash'
import BaseSiteEvent from '~/mixins/BaseSiteEvent'
import { getEventDurationFormatted } from '~/assets/js/EventStyle'

export default {
  mixins: [BaseSiteEvent],
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  computed: {
    duration() {
      return getEventDurationFormatted(this.event)
    },
    senderName() {
      const senderName = get(this.event, 'meta.name', '')
      return senderName
    },
    senderPhone() {
      const senderPhone = get(this.event, 'meta.phone', '')
      return senderPhone
    },
    canShowDetails() {
      const via = get(this.event, 'meta.via', '')
      return via === 'server'
    },
    name() {
      const name = get(this.event, 'meta.unlock_attempt.name', '')
      return this.checkEmptyField(name)
    },
    phone() {
      const phone = get(this.event, 'meta.unlock_attempt.phone', '')
      return this.checkEmptyField(phone)
    },
    designation() {
      const designation = get(this.event, 'meta.unlock_attempt.designation', '')
      return this.checkEmptyField(designation)
    },
    organization() {
      const organization = get(this.event, 'meta.unlock_attempt.organization', '')
      return this.checkEmptyField(organization)
    },
    purpose() {
      const purpose = get(this.event, 'meta.unlock_attempt.purpose', '')
      return this.checkEmptyField(purpose)
    },
    initiator() {
      const via = get(this.event, 'meta.via', '')
      switch (via) {
        case 'server':
          return { theme: 'text-blue-500', icon: 'fas fa-server', label: 'Server' }
        case 'card':
          return { theme: 'text-purple-500', icon: 'fas fa-id-card', label: 'Card' }
        case 'app':
          return { theme: 'text-sky-500', icon: 'fas fa-mobile-alt', label: 'Mobile App' }
        default:
          return null
      }
    },
  },
  methods: {
    checkEmptyField(text) {
      if (!text) {
        return 'N/A'
      } else {
        return text
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
