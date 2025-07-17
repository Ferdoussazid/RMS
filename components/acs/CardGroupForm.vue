<template>
  <ContentCard is-flat has-footer title="Card Group Information">
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col space-y-2 bg-slate-100 p-3">
          <FixedLabelInput v-model="name" label="Group Name" />

          <div class="mt-2 px-2">
            <span class="text-xs font-light text-gray-700">Cards</span>
          </div>
          <div class="flex w-full flex-grow flex-col gap-2 overflow-y-scroll scrollbar-hide md:flex-row">
            <div class="flex flex-1 flex-col space-y-2 rounded bg-white shadow-md">
              <span class="p-3 text-xs font-semibold text-gray-700">Added Cards [{{ addedCards.length }}]</span>
              <div class="max-h-full overflow-y-scroll rounded shadow scrollbar-hide">
                <!-- Adjust max-h value as needed -->
                <div v-for="(card, i) in addedCards" :key="card.id" :class="[i % 2 === 0 ? 'bg-slate-100' : 'bg-white']"
                  class="flex flex-row items-center space-x-2 px-2 py-1.5 shadow-sm transition duration-300 hover:bg-slate-200">
                  <div class="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-2">
                    <img src="/icon/card.png" alt="" class="pointer-events-none h-auto w-full" />
                  </div>
                  <div class="flex grow flex-col">
                    <span class="text-xs font-semibold text-gray-700">{{ card.card_number }}</span>
                    <span class="text-xs font-normal text-gray-500">{{ card.name }}</span>
                  </div>
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full transition duration-300 group-hover:bg-gray-200">
                    <button
                      class="text-2xs shrink-0 rounded border border-red-500 px-1.5 py-0.5 text-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
                      @click="removeCard(card.id)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div v-if="isEmpty" class="flex w-full flex-col items-center justify-start py-[15vh]">
                  <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
                  <span class="text-center text-sm font-normal text-gray-400">No Card Added </span>
                </div>
              </div>
            </div>

            <div class="flex flex-1 flex-col rounded bg-white pt-2 shadow-md">
              <div class="flex items-center justify-between px-3 pb-2">
                <span class="flex-1 text-xs font-semibold text-gray-700">Unadded Cards</span>
                <SearchInputField v-model="unaddedCardsSearch" class="flex-1" />
              </div>
              <div class="max-h-full overflow-scroll rounded shadow scrollbar-hide">
                <div v-for="(card, i) in searchedCards" :key="card.id"
                  :class="[i % 2 === 0 ? 'bg-slate-100' : 'bg-white']"
                  class="flex items-center justify-between space-x-2 px-2 py-1.5 hover:bg-slate-200">
                  <div class="flex p-2">
                    <span class="pr-2 text-xs font-semibold text-gray-500">{{ i + 1 }}.</span>
                    <span class="text-xs font-semibold text-gray-700">{{ card.card_number + '-' + card.name }}</span>
                  </div>
                  <div class="pr-2">
                    <button
                      class="flex cursor-pointer items-center gap-1 rounded border-2 border-green-600 bg-white p-1.5 text-xs font-semibold text-green-600 hover:border-green-600 hover:bg-green-600 hover:text-white"
                      @click="addCard(card.id)">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-row items-center justify-between space-x-3 border-t border-slate-200 px-3 py-2">
        <div v-if="isSuperUser || isOpsUser">
          <button v-if="!!groupId" :class="[
            isReadOnlyUser
              ? 'cursor-not-allowed bg-gray-400 text-gray-100'
              : ' bg-red-500 text-white hover:bg-red-600',
          ]" class="rounded px-3 py-1.5 text-xs font-medium shadow transition duration-300" @click="onDeleteClick">
            <i v-if="deleting" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-trash"></i>
            Delete
          </button>
        </div>

        <div class="flex space-x-2">
          <button :class="[
            isReadOnlyUser
              ? 'cursor-not-allowed bg-gray-400 text-gray-100'
              : ' bg-green-500 text-white hover:bg-green-600',
          ]" class="rounded px-3 py-1.5 text-xs font-medium shadow transition duration-300" @click="onSaveClick">
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Save
          </button>

          <button
            class="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow transition duration-300 hover:bg-gray-100"
            @click="$router.push('/access/manage')">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import fuzzysearch from 'fuzzysearch'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    group: {
      type: Object,
      required: false,
      default: () => null,
    },
  },
  data: () => ({
    groupId: 0,
    unaddedCardsSearch: '',
    name: '',
    cardIds: [],
    saving: false,
    deleting: false,
    addedCards: [],
    unaddedCards: [],
    searchedCards: [],
  }),
  computed: {
    ...mapGetters('acs', ['cards']),
    ...mapGetters('user', ['rootUserUid']),
    isEmpty() {
      return !this.addedCards.length
    },
  },
  watch: {
    group: {
      handler(val, old) {
        if (!val) return
        this.groupId = val.id
        this.name = val.name
        if (val.card_ids && val.card_ids.length) {
          this.cardIds = [...val.card_ids]
        }
      },
      immediate: true,
    },

    cardIds: {
      handler(val, old) {
        this.filterCards()
      },
      immediate: true,
    },
    unaddedCardsSearch: {
      handler(val, old) {
        this.handleUnaddedCardsSearch(val)
      },
      immediate: true,
    },
  },
  mounted() {
    this.filterCards()
    this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
  },
  methods: {
    async onSaveClick() {
      if (!this.getPermissionStatus('save')) return
      if (this.saving) return
      try {
        this.validate()
        this.saving = true
        const data = {
          userUid: this.rootUserUid,
          name: this.name,
          cardIds: this.cardIds,
        }
        if (this.groupId) data.groupId = this.groupId

        await this.$store.dispatch('acs/saveCardGroup', data)
        this.$toast.success('Card group saved successfully')

        this.$router.push('/access/manage')
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.saving = false
    },

    validate() {
      if (!this.name) throw new Error('Please type a name for the group')
      if (!this.cardIds.length) throw new Error('Choose at least one card')
      return true
    },

    async onDeleteClick() {
      if (!this.getPermissionStatus('delete')) return
      if (!confirm('Are you sure you want to delete this group ?')) return

      this.deleting = true
      try {
        await this.$store.dispatch('acs/deleteCardGroup', this.groupId)

        this.$toast.success('Card group deleted successfully')
        this.$router.push('/access/manage')
      } catch (error) {
        this.$toast.erro(error.message)
      }
      this.deleting = false
    },
    filterCards() {
      this.addedCards = this.cards.filter(card => this.cardIds.includes(card.id))
      this.unaddedCards = this.cards.filter(card => !this.cardIds.includes(card.id))
    },
    addCard(cardIdToAdd) {
      this.unaddedCards = this.unaddedCards.filter(card => card.id !== cardIdToAdd)
      this.addedCards.unshift(this.cards.find(card => card.id === cardIdToAdd))
      this.cardIds.push(cardIdToAdd)
      this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
    },
    removeCard(cardIdToRemove) {
      if (!confirm(`Are you sure you want to remove this card from "${this.group.name}"?`)) return
      this.addedCards = this.addedCards.filter(card => card.id !== cardIdToRemove)
      this.unaddedCards.unshift(this.cards.find(item => item.id === cardIdToRemove))
      this.cardIds = this.cardIds.filter(item => item !== cardIdToRemove)
      this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
    },

    handleUnaddedCardsSearch(searchQuery) {
      // genericIdMatched = fuzzysearch(this.unaddedCards, val)

      if (searchQuery) {
        this.searchedCards = this.unaddedCards.filter(card => {
          const nameMatch = fuzzysearch(searchQuery, card.name.toLowerCase())

          const cardNumberMatch = fuzzysearch(searchQuery, card.card_number)

          return nameMatch || cardNumberMatch
        })
      } else {
        this.searchedCards = [...this.unaddedCards]
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
