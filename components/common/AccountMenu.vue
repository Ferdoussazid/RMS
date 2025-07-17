<template>
  <ToolbarMenu>
    <img
      :src="pathto('/image/avatar.png')"
      class="w-7 h-7 object-contain object-center rounded-full"
      alt="John Doe"
    />
    <template #dropdown>
      <DropDownMenuItem action="/profile" icon="fas fa-user" label="Profile" />
      <DropDownMenuItem action="/billing" icon="far fa-credit-card" label="Billing" />
      <DropDownMenuItem action="/settings" icon="fas fa-cog" label="Settings" />
      <hr class="bg-gray-100 my-1" />
      <DropDownMenuItem action="logout" icon="fas fa-power-off" label="Logout" />
    </template>
  </ToolbarMenu>
</template>

<script>
import utils from '~/mixins/utils'

import ToolbarMenu from '~/components/common/ToolbarMenu.vue'
import DropDownMenuItem from '~/components/common/DropDownMenuItem.vue'

export default {
  components: {
    ToolbarMenu,
    DropDownMenuItem,
  },
  mixins: [utils],
}
</script>

<style lang="scss" scoped>
</style>