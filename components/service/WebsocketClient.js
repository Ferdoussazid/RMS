import { mapGetters } from 'vuex'

const CONNECTION_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}

export default {
  data: () => ({
    event2mutation: {
      RMS_ACCESS_RECORD: ['access/PREPEND_ACCESS_RECORD'],
      RMS_DEVICE_HEALTH_COUNT: ['health/SET_COUNTS'],
      RMS_TICKET_CREATE: ['ticket/UPDATE_TICKET_LIST'],
      RMS_TICKET_UPDATE: ['ticket/UPDATE_TICKET_LIST'],
    },
    event2action: {
      RMS_MAIN_PHASE: ['mains/publishVoltage'],
      RMS_DG_STATUS: ['generator/publishStatus'],
      RMS_PG_STATUS: ['generator/publishStatus'],
      RMS_ACCESS_STATUS: ['access/publishStatus'],
      RMS_BATTERY_TERMINAL_VOLTAGE: ['battery/publishTerminalVoltage'],
      RMS_BATTERY_CURRENT: ['battery/publishCurrent'],
      RMS_BATTERY_BACKUP_LEFT: ['battery/publishBackupTime'],
      RMS_SITE_TEMPERATURE: ['temperature/publishTemperature'],
      RMS_SITE_HUMIDITY: ['temperature/publishHumidity'],
      RMS_SITE_CONFIG_UPDATED: ['site/publishSiteConfigUpdate'],
      RMS_SITE_STATUS_UPDATED: ['site/publishSiteStatusUpdate'],

      // For dashboard updates
      RMS_POWER_DASHBOARD_COUNT: ['dashboard/publishPowerDashboard'],
      RMS_DC_POWER_DASHBOARD_COUNT: ['dashboard/publishDCPowerDashboard'],
      RMS_ALARM_DASHBOARD_COUNT: ['dashboard/publishAlarmDashboard'],
      RMS_ACCESS_DASHBOARD_COUNT: ['dashboard/publishAccessDashboard'],

      RMS_MAINS_AVAILABLE_COUNT: ['dashboard/publishMainsCount'],
      RMS_DG_RUNNING_COUNT: ['dashboard/publishDgCount'],
      RMS_TEMPERATURE_WISE_COUNT: ['dashboard/publishTemperatureCount'],
      RMS_BATTERY_BACKUP_COUNT: ['dashboard/publishBatteryCount'],
      RMS_SITE_EVENT: ['dashboard/publishSiteEvent', 'site/publishSiteEvent'],

      // for rectifirer
      RMS_RECTIFIER_EVENT: ['oem/publishRectifierSiteEvent'],
    },
  }),
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('user', ['rootUserUid']),
  },
  mounted() {
    this.createConnection()

    this.pingTask = setInterval(this.sendPing.bind(this), 10000)
    this.reconnectTask = setInterval(this.reconnectIfRequired.bind(this), 7000)
  },
  beforeDestroy() {
    clearInterval(this.pingTask)
    clearInterval(this.reconnectTask)
  },
  methods: {
    createConnection() {
      this.socket = new WebSocket(process.env.WEBSOCKET_URL)
      this.socket.onopen = this.onOpen.bind(this)
      this.socket.onmessage = this.onMessage.bind(this)
      this.socket.onclose = this.onClose.bind(this)
      this.socket.onerror = this.onError.bind(this)
    },
    onOpen() {
      this.socket.isAlive = true
      this.socket.send(
        JSON.stringify({
          action: 'LOGIN',
          user: this.rootUserUid,
        })
      )
      console.log(`socket connection opened with user: ${this.rootUserUid}`)

      if (this.siteConfig) {
        this.$store.dispatch('user/startSession', this.siteConfig.siteUid)
      }
    },
    onMessage(message) {
      const { event, payload } = JSON.parse(message.data)
      // if (event === 'RMS_SITE_STATUS_UPDATED') {
      //   console.log(`socket message`, event, JSON.stringify(payload))
      // }

      const mutation = this.event2mutation[event]
      if (mutation) {
        if (typeof mutation === 'string') {
          this.$store.commit(mutation, payload)
        } else if (Array.isArray(mutation)) {
          for (const m of mutation) {
            this.$store.commit(m, payload)
          }
        }
      }

      const action = this.event2action[event]
      if (action) {
        if (typeof action === 'string') {
          this.$store.dispatch(action, payload)
        } else if (Array.isArray(action)) {
          for (const a of action) {
            this.$store.dispatch(a, payload)
          }
        }
      }
    },
    onClose(event) {
      this.socket.isAlive = false
      console.log(`socket connection closed`)
    },
    onError(e) {
      this.socket.isAlive = false
    },
    sendPing() {
      if (this.socket.readyState === CONNECTION_STATE.OPEN) {
        this.socket.send(JSON.stringify({ action: 'PING' }))
      }
    },
    reconnectIfRequired() {
      if ([CONNECTION_STATE.CLOSED, CONNECTION_STATE.CLOSING].includes(this.socket.readyState)) {
        this.createConnection()
      }
    },
  },
  render: () => null,
}
