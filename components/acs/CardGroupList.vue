<template>
  <ContentCard has-footer title="Card Groups">
    <template #action>
      <LoadingSpinner v-if="loading" class="scale-50" />
    </template>
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div
            v-if="!isEmpty"
            class="flex w-full flex-col items-stretch justify-start space-y-2 overflow-y-scroll px-2 scrollbar-hide"
          >
            <div class="px-2">
              <span class="text-xs font-light text-gray-700">Groups</span>
            </div>
            <CardGroupItem v-for="g in cardGroups" :key="g.id" :group="g" />
            <div v-if="!cardGroups.length" class="flex justify-center py-2">
              <span class="text-xs font-normal text-gray-500">No Group Available</span>
            </div>

            <!-- <div class="mt-2 px-2">
              <span class="text-xs font-light text-gray-700">Cards</span>
            </div>
            <SingleCardItem v-for="s in cards" :key="s.uid" :card="s" />
            <div v-if="!cards.length" class="flex justify-center py-2">
              <span class="text-xs font-normal text-gray-500">No Card Available</span>
            </div> -->
          </div>
          <div v-if="!loading && isEmpty" class="flex w-full flex-col items-center justify-start py-[15vh]">
            <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
            <span class="text-center text-sm font-normal text-gray-400"> No group found </span>
          </div>
        </div>

        <AccessCardAddModal ref="add_card" @dismiss="onModalDismissed" />
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row items-center justify-between border-t border-slate-200 px-3 py-2">
        <div class="flex flex-row items-center space-x-1">
          <span class="text-2xs font-normal text-gray-500">
            <strong>{{ cardGroups.length }}</strong> Groups
          </span>
          <span class="text-[0.35rem] text-gray-300"><i class="fas fa-circle"></i></span>
          <!-- <span class="text-2xs font-normal text-gray-500">
            <strong>{{ cards.length }}</strong> Cards
          </span> -->
        </div>
        <div v-if="!isReadOnlyUser" class="flex items-center gap-2">
          <!-- <button
            class="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-blue-600"
            @click="onAddCardClick"
          >
            <i class="fas fa-plus"></i>
            Add Card
          </button> -->
          <button
            class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-red-600"
            @click="$refs.delete.show()"
          >
            <i class="fas fa-trash"></i>
            Delete Card
          </button>
          <nuxt-link
            to="/access/card-group/save"
            class="rounded bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-sky-600"
          >
            <i class="fas fa-plus"></i>
            Card Group
          </nuxt-link>
        </div>
        <CardDeletionForm ref="delete" />
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    onGoingAPICount: 0,
  }),
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('acs', ['cardGroups', 'cards']),
    isEmpty() {
      return !this.cardGroups.length && !this.cards.length
    },
    loading() {
      return this.onGoingAPICount > 0
    },
  },
  mounted() {
    this.fetchCards()
    this.fetchGroups()
  },
  methods: {
    async fetchCards() {
      this.onGoingAPICount++
      try {
        await this.$store.dispatch('acs/getCardList', this.rootUserUid)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.onGoingAPICount--
    },

    async fetchGroups() {
      this.onGoingAPICount++
      try {
        await this.$store.dispatch('acs/getCardGroups', this.rootUserUid)
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.onGoingAPICount--
    },

    onAddCardClick() {
      this.$refs.add_card.show()
    },

    onModalDismissed(cardAdded) {
      if (cardAdded) {
        this.fetchCards()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
