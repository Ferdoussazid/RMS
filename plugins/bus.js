import Vue from 'vue'

export default ({ app }, inject) => {
  /**
   * Global event bus
   */
  inject('bus', new Vue())
}
