<template>
    <div
        class="hidden bg-slate-200 pr-4 text-xs font-semibold leading-tight text-gray-600 md:grid md:grid-cols-12 md:items-center">
        <div class="col-span-2 place-items-center px-4 py-2 text-left">
            <span>Status</span>
        </div>
        <div class="col-span-2 place-items-center px-4 py-2 text-center">
            <span>Total</span>
        </div>
        <div class="col-span-2 place-items-center px-4 py-2 text-center" v-if="!isSComm">
            <span>Banglalink</span>
        </div>
        <div class="col-span-2 place-items-center px-4 py-2 text-center" v-if="!isSComm">
            <span>Robi</span>
        </div>
        <div class="col-span-2 place-items-center px-4 py-2 text-center" v-if="!isSComm">
            <span>Grameenphone</span>
        </div>
        <div class="col-span-2 place-items-center px-4 py-2 text-center" v-if="!isSComm">
            <span>Teletalk</span>
        </div>
        <div class="col-span-4 place-items-center px-4 py-2 text-center" v-if="isSComm">
            <span>Rectifier 1</span>
        </div>
        <div class="col-span-4 place-items-center px-4 py-2 text-center" v-if="isSComm">
            <span>Rectifier 2</span>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { COMPANY } from '~/assets/js/Constant';

export default {
    computed: {
        ...mapGetters('user', ['companyName']),
        isSComm() {
            return this.companyName === COMPANY.SUMMIT_COM
        },
    }
}
</script>