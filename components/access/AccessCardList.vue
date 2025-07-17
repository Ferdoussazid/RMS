<template>
  <ContentCard title="Issued Cards">
    <template #action>
      <LoadingSpinner v-if="deleting" class="scale-50" />
      <button
        v-if="!deleting"
        :class="[
          isSystemReadOnlyUser
            ? 'cursor-not-allowed bg-gray-400 text-gray-100'
            : ' bg-red-600 text-white hover:bg-red-500',
        ]"
        class="rounded px-3 py-1 text-xs font-medium transition duration-300"
        @click="onClearClick"
      >
        <i class="fas fa-trash-alt"></i>
        Delete All
      </button>
    </template>
    <template #content>
      <div class="w-flex max-h-[360px] w-full divide-y divide-slate-200 overflow-scroll">
        <AccessCardItem v-for="(item, i) in items" :key="i" :card="item" />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    deleting: false,
  }),
  methods: {
    async onClearClick() {
      if (!this.getPermissionStatus('delete cards')) return
      if (confirm('Are you sure ?')) {
        this.deleting = true
        try {
          await this.$store.dispatch('access/clearAccessCardList')
          this.$toast.success('All cards removed')
        } catch (error) {
          this.$toast.error(error.message)
        }
        this.deleting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
