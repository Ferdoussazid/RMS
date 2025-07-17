<template>
  <ContentCard title="Site Access Status" is-top-blending>
    <template #content>
      <div class="flex flex-row">
        <AccessPinStatus v-show="doorPin" name="Door" :is-closed="isDoorClosed" icon="/icon/door-lock8.svg" />
        <AccessPinStatus v-show="lockPin" name="Lock" :is-closed="isLockClosed" icon="/icon/door-lock7.svg" />
      </div>

      <DoorUnlockButton v-if="canUnlock" class="mb-16 mt-8 self-center" />
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'

import utils from '~/mixins/utils'

export default {
  components: {},
  mixins: [utils],
  props: {
    canUnlock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sitesWithReversePins: [92224, 42230],
    }
  },
  computed: {
    ...mapGetters('access', ['doorPin', 'lockPin']),
    isDoorClosed() {
      // Summit Sites with Site Uids- 92224, 42230:  Door closes on 0
      if (this.doorPin)
        return this.sitesWithReversePins.includes(this.doorPin.site_uid)
          ? this.doorPin.status === 0
          : this.doorPin.status === 1
      else return false
    },
    isLockClosed() {
      // Summit Sites with Site Uids- 92224, 42230:  Lock closes on 0
      if (this.lockPin)
        return this.sitesWithReversePins.includes(this.lockPin.site_uid)
          ? this.lockPin.status === 0
          : this.lockPin.status === 1
      else return false
    },
  },
}
</script>

<style lang="scss" scoped></style>
