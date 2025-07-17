<template>
  <tr class="hover:bg-teal-100">
    <td class="">
      <span class="flex items-center justify-center p-2 text-sm font-normal text-gray-900"> {{ serial }}</span>
    </td>
    <td class="">
      <span class="flex items-center p-2 text-sm font-normal text-gray-900"> {{ user.name }}</span>
    </td>
    <td class="">
      <span class="flex items-center p-2 text-sm font-semibold text-gray-900"> {{ user.phone }}</span>
    </td>
    <td class="">
      <!-- <span class="flex items-center p-2 text-sm font-normal text-gray-900">
        {{ getCompanyLogoOf(user.company_id) }}</span
      > -->
      <div>
        <img :src="getCompanyLogoOf(user.company_id)" class="h-8 w-8" />
      </div>
    </td>
    <td class="">
      <span class="flex items-center p-2 text-sm font-normal text-gray-900"> {{ getUserTypeLabelOf(user) }}</span>
    </td>
    <td class="">
      <div class="w-max">
        <div
          :class="getStatusTheme(user.status)"
          class="grid select-none items-center whitespace-nowrap rounded-md py-1 px-2 font-sans text-xs font-bold uppercase"
        >
          <span class="">{{ user.status }}</span>
        </div>
      </div>
    </td>

    <!-- <td class="">
      <div class="flex items-center space-x-1 p-2 text-sm font-normal text-gray-900">
        <div v-for="(tenant, j) in getUserTenants(user.tenants)" :key="j" class="">
          <img :src="getTenantIcon(tenant)" class="h-4 w-4" />
        </div>
      </div>
    </td> -->
    <td class="">
      <span class="flex items-center p-2 text-sm font-normal text-gray-900">
        {{ getCreationTime(user.created_at) }}</span
      >
    </td>
    <td class="">
      <div class="flex items-center gap-2 p-2 text-sm font-normal text-gray-900">
        <div
          class="cursor-pointer rounded bg-gradient-to-tr from-blue-500 to-blue-400 p-2 text-xs font-normal text-white shadow hover:from-blue-600 hover:to-blue-500"
          @click="$emit('edit', user)"
        >
          <span class=" "><i class="fas fa-edit"></i></span>
          <span class=" ">Edit</span>
        </div>
        <div
          class="cursor-pointer rounded bg-gradient-to-tr from-red-500 to-red-400 p-2 text-xs font-normal text-white shadow hover:from-red-600 hover:to-red-500"
          @click="$emit('delete', user)"
        >
          <span class=" "><i class="fas fa-trash-alt"></i></span>
          <span class=" ">Delete</span>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { format } from 'date-fns'
import { SITE_TENANT } from '~/assets/js/Constant'
import { getCompanyById, getCompanyLabel, getCompanyLogo, getTenantLogo, getUserTypeLabel } from '~/assets/js/Helper'
export default {
  props: {
    serial: {
      type: Number,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getUserTypeLabelOf(user) {
      return getUserTypeLabel(user)
    },

    getCompanyName(id) {
      const companyName = getCompanyById(id)
      return getCompanyLabel(companyName)
    },

    getCompanyLogoOf(id) {
      const companyName = getCompanyById(id)
      return getCompanyLogo(companyName)
    },

    getUserTenants(tenants) {
      if (tenants && tenants.length) {
        return tenants
      }
      return [SITE_TENANT.BANGLALINK, SITE_TENANT.GRAMEENPHONE, SITE_TENANT.ROBI]
    },

    getTenantIcon(tenant) {
      return getTenantLogo(tenant)
    },

    getCreationTime(time) {
      let creationTime = time || ''
      if (creationTime) {
        creationTime = format(new Date(creationTime), 'h:mm aaa, d MMM yyyy')
      }
      return creationTime
    },

    getStatusTheme(status) {
      if (status === 'active') {
        return 'bg-green-500/20 text-green-600'
      } else if (status === 'inactive') {
        return 'bg-purple-500/20 text-purple-600'
      } else {
        return 'bg-orange-500/20 text-orange-600'
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
