<template>
  <div class="flex flex-col">
    <ul class="grow">
      <MenuCategory name="Menu" />
      <MenuItem name="Site List" tag="/customer/sites" icon="fas fa-list" url="/customer/sites" />
      <MenuItem v-if="isSudoUser" name="Device List" tag="/device/list" icon="fas fa-hdd" url="/device/list" />
      <MenuItem name="Service String" tag="/monitor/service-string" icon="fas fa-rss" url="/monitor/service-string" />
      <MenuItem
        name="Device Health"
        tag="/monitor/device-health"
        icon="fas fa-heartbeat"
        url="/monitor/device-health"
      />
      <MenuItem v-if="isSudoUser" name="User List" tag="/user/list" icon="fas fa-users" url="/user/list" />
      <MenuItem name="Device Vendors" tag="/device-vendor/list" icon="fas fa-layer-group" url="/device-vendor/list" />
      <MenuItem
        name="Telegram"
        tag="/telegram"
        icon="fab fa-telegram-plane"
        url="/telegram"
        :in-site-specific-route="false"
      />
      <MenuItem
        v-if="isSudoUser"
        name="Payment List"
        tag="/billing/list"
        icon="fas fa-coins"
        url="/billing/list"
        :in-site-specific-route="false"
      />
    </ul>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
}
</script>

<style lang="scss" scoped></style>
