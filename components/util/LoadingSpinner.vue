<template>
  <div class="lds-ellipsis">
    <div :class="theme"></div>
    <div :class="theme"></div>
    <div :class="theme"></div>
    <div :class="theme"></div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'bg-indigo-500',
    },
  },
}
</script>

<style lang="css" scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 62px;
  height: 13px;
}
.lds-ellipsis div {
  position: absolute;
  top: 0;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 0px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 0px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 24px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 48px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
