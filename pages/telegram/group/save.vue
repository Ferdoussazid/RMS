<template>
  <div class="flex flex-col w-full">
    <AppToolbar title="Telegram Group" :with-site-id="false" />
    <div class="flex flex-col items-stretch w-full gap-2 mt-2 justify-evenly md:flex-row">
      <TelegramGroupForm :group="telegramFocusGroup" @refetchGroup="refetchGroup" class="w-full lg:w-2/3" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth', 'setup'],
  asyncData({ query }) {
    const { chatId = '' } = query
    return { chat_id: chatId }
  },
  data: () => ({}),
  computed: {
    ...mapGetters('telegram', ['telegramFocusGroup']),
  },
  async mounted() {
    if (this.chat_id) {
      await this.focusedGroup()
    }

  },
  methods: {
    async focusedGroup() {
      try {
        this.$store.commit('telegram/SET_LOADING', true)
        await this.$store.dispatch('telegram/getTelegramFocusGroup', this.chat_id)
      } catch (error) {
        this.$router.push('/telegram')
        this.$toast.error(error)
      }

    },

    async refetchGroup() {
      try {
        this.$store.commit('telegram/SET_LOADING', true)
        await this.$store.dispatch('telegram/getTelegramFocusGroup', this.chat_id)
      } catch (error) {
        this.$router.push('/telegram')
        this.$toast.error(error)
      }
    }
  },
}
</script>
