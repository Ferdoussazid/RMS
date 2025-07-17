<template>
  <div
    class="group flex cursor-pointer flex-row items-center space-x-2 rounded bg-white px-2 py-1.5 shadow-sm transition duration-300"
    @click="onClick">
    <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-1.5">
      <img src="/icon/telegram.png" alt="" class="w-full h-auto" />
    </div>
    <div class="flex flex-row items-center gap-1 grow">
      <!-- Group Name -->
      <span class="text-sm font-medium text-gray-700">{{ group.name }}</span>


      <span :class="{
        'bg-green-200 text-gray-500': group.status === 'ACTIVE',
        'bg-red-200 text-gray-500': group.status !== 'ACTIVE'
      }" class="text-[10px] font-medium px-1.5 py-0.25 rounded-full">
        {{ group.status }}
      </span>

    </div>
    <div
      class="flex items-center justify-center w-6 h-6 transition duration-300 rounded-full text-gray-500 group-hover:bg-gray-200">

      <span class="text-xs">

        <i class="fas fa-chevron-right"></i>
      </span>
    </div>
  </div>
</template>

<script>
  import UserTypeChecker from '~/mixins/UserTypeChecker'

  export default {
    mixins: [UserTypeChecker],
    props: {
      group: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      canDrag: true,
    }),
    computed: {

    },
    mounted() {
      if (this.isReadOnlyUser) this.canDrag = false
    },
    methods: {
      onClick() {
        this.$router.push({ path: '/telegram/group/save', query: { chatId: this.group.chat_id } })
      },

    },
  }
</script>

<style lang="scss" scoped></style>
