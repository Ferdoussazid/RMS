<template>
  <div
    class="flex w-full flex-col items-center justify-start space-y-2 px-4 py-2.5 pr-6 md:flex-row md:space-y-0 md:space-x-4"
  >
    <div class="grow">
      <span class="text-xs font-semibold capitalize text-slate-700">{{ title }}</span>
    </div>
    <div class="shrink-0">
      <slot v-if="!edit" name="value"></slot>
      <slot v-if="edit" name="editor"></slot>
    </div>

    <div class="flex shrink-0 flex-row items-center space-x-2">
      <button
        v-show="!edit"
        :class="[
          !canEdit
            ? 'cursor-not-allowed border-gray-400 text-gray-400'
            : 'border-indigo-500 text-indigo-500 hover:bg-white hover:text-white',
        ]"
        class="rounded border px-2 py-1 text-sm transition duration-300"
        @click="onEditClick"
      >
        <span><i class="fas fa-pen"></i></span>
      </button>
      <button
        v-show="edit"
        class="rounded border border-green-500 px-2 py-1 text-sm text-green-500 transition duration-300 hover:bg-green-500 hover:text-white"
        @click="onSaveClick"
      >
        <span><i class="fas fa-check"></i></span>
      </button>
      <button
        v-show="edit"
        class="rounded border border-red-500 px-2 py-1 text-sm text-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
        @click="onCancelClick"
      >
        <span><i class="fas fa-times"></i></span>
      </button>
    </div>
  </div>
</template>

<script>
import UserTypeChecker from '~/mixins/UserTypeChecker'
export default {
  mixins: [UserTypeChecker],
  props: {
    title: {
      type: String,
      required: true,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    edit: false,
  }),
  methods: {
    onEditClick() {
      if (!this.canEdit) {
        this.$toast.error("You don't have the neceessary permission to change settings")
        return
      }
      this.edit = true
    },
    onCancelClick() {
      this.edit = false
    },
    onSaveClick() {
      this.$emit('save')
    },
  },
}
</script>

<style lang="scss" scoped></style>
