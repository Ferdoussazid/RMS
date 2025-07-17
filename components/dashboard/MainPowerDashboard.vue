<template>
  <ApexChart ref="chart" type="donut" width="500px" height="350px" :options="chartOptions" :series="chartSeries" />
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '~/mixins/utils'
import { SITE_FILTER_TYPE, SITE_ALARM, SITE_TENANT } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getColorOfPieLabel, getCompanySpecificAlarmLabel, getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [utils, UserTypeChecker],
  data: () => ({
    loading: true,
    loaded: false,
  }),
  computed: {
    ...mapGetters('dashboard', ['power']),
    ...mapGetters('dashboard', ['frequency', 'selectedTenant']),
    ...mapGetters('site', ['siteCount', 'sites']),
    ...mapGetters('user', ['rootUserUid', 'allowedTenants', 'companyName']),
    filteredTenantList() {
      if (this.selectedTenant) {
        return this.allowedTenants.filter(tenant => tenant === this.selectedTenant)
      }
      return this.allowedTenants
    },
    filter() {
      const mainsUnavailableFilters = []
      const mainsAvailableFilter = {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.AC_LINE_FAIL,
        expected: 1,
      }
      const dgStatusFilter = {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DG_ON,
        expected: 0,
      }
      const pgStatusFilter = {
        type: SITE_FILTER_TYPE.ALARM,
        id: SITE_ALARM.DG_ON,
        expected: 0,
      }

      if (this.filteredTenantList.length === 1) {
        mainsAvailableFilter.tenant = this.filteredTenantList[0]
        // dgStatusFilter.tenant = this.filteredTenantList[0]
        // pgStatusFilter.tenant = this.filteredTenantList[0]
      }

      for (const tenant of this.filteredTenantList) {
        mainsUnavailableFilters.push({
          type: SITE_FILTER_TYPE.ALARM,
          id: SITE_ALARM.AC_LINE_FAIL,
          tenant,
          expected: 0,
        })
      }
      return [...mainsUnavailableFilters, mainsAvailableFilter, dgStatusFilter, pgStatusFilter]
    },
    chartLabels() {
      const labels = []
      let label = getCompanySpecificAlarmLabel(this.companyName, SITE_ALARM.AC_LINE_FAIL)
      if (!label) {
        label = 'AC Line Fail'
      }
      for (const tenant of this.filteredTenantList) {
        labels.push(`${label} (${getTenantLabel(tenant)})`)
      }
      labels.push('Mains Available')
      if (!this.isReadOnlyUser) {
        labels.push('DG On')
        labels.push('PG ON')
      }
      return labels

    
    },
    chartColors() {
      const colors = []
      for (const tenant of this.filteredTenantList) {
        const alarmWithTenant = this.getAlarmWithTenant(SITE_ALARM.AC_LINE_FAIL, tenant)
        const alarmColor = getColorOfPieLabel(alarmWithTenant)
        colors.push(alarmColor)
      }
      const mainsAvailableColor = getColorOfPieLabel('mains_available')
      colors.push(mainsAvailableColor)
      if (!this.isReadOnlyUser) {
        const pgOnColor = getColorOfPieLabel('pg_on')
        const dgOnColor = getColorOfPieLabel('dg_on')
        colors.push(dgOnColor)
        colors.push(pgOnColor)
      }
      return colors
    },

    chartSeries() {
      const series = []
      for (const tenant of this.filteredTenantList) {
        const mainsOff = this.getAlarmWithTenant('ac_line_fail', tenant)
        series.push(this._.get(this.frequency, mainsOff, 0))
      }
      series.push(this.mainsAvailableCount || 0)
      if (!this.isReadOnlyUser) {
        series.push(this.dgCount)
        series.push(this.pgCount)
      }
      return series
    },
    mainsAvailableCount() {
      if (this.filteredTenantList.length === 1) {
        const mainsOff = this.getAlarmWithTenant('ac_line_fail', this.filteredTenantList[0])
        const filteredSites = this.sites.filter(site => site.tenants.includes(this.filteredTenantList[0]))
        const mainsOffCount = this._.get(this.frequency, mainsOff, 0)
        return filteredSites.length - mainsOffCount
      } else {
        const mainsUnavailableSites = this.sites.filter(site => {
          const alarms = site.alarms.find(
            alarm =>
              alarm.id === SITE_ALARM.AC_LINE_FAIL &&
              this.allowedTenants.includes(alarm.tenant || SITE_TENANT.BANGLALINK) &&
              alarm.isAvailable === true &&
              alarm.isNormal === false
          )
          return !!alarms
        })
        return this.siteCount.total - mainsUnavailableSites.length
      }
    },
    pgCount() {
      return this._.get(this.frequency, SITE_ALARM.PG_ON, 0)
      // let alarmCount = 0
      // for (const tenant of this.filteredTenantList) {
      //   const alarmName = this.getAlarmWithTenant(SITE_ALARM.PG_ON, tenant)
      //   alarmCount += this._.get(this.frequency, alarmName, 0)
      // }
      // return alarmCount
    },
    dgCount() {
      return this._.get(this.frequency, SITE_ALARM.DG_ON, 0)
      // let alarmCount = 0
      // for (const tenant of this.filteredTenantList) {
      //   const alarmName = this.getAlarmWithTenant(SITE_ALARM.DG_ON, tenant)
      //   alarmCount += this._.get(this.frequency, alarmName, 0)
      // }
      // return alarmCount
    },
    chartOptions() {
      return {
        chart: {
          id: 'main-power-dashboard',
          type: 'donut',
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const filter = this.filter[config.dataPointIndex]
              this.$router.push(this.siteListUrl(filter, '/site/availability'))
            },
          },
        },
        legend: {
          fontSize: '13px',
          offsetX: 0,
          offsetY: 0,
          height: '100%',
          width: 200,
          position: 'right',
          labels: {
            useSeriesColors: true,
          },
          formatter(seriesName, opts) {
            return [seriesName, '(', opts.w.globals.series[opts.seriesIndex], ')']
          },
        },
        responsive: [
          {
            breakpoint: 2160,
            options: {
              chart: {
                width: '100%',
                height: '250px',
              },
              legend: {
                offsetX: 0,
                offsetY: 0,
                height: '100%',
                width: 200,
                position: 'right',
                horizontalAlign: 'center',
              },
            },
          },
          {
            breakpoint: 1440,
            options: {
              chart: {
                width: '100%',
                height: '350px',
              },
              legend: {
                offsetX: 0,
                offsetY: 0,
                height: '100%',
                width: '100%',
                horizontalAlign: 'center',
                position: 'bottom',
              },
            },
          },
          {
            breakpoint: 1280,
            options: {
              chart: {
                width: '100%',
                height: '350px',
              },
              legend: {
                offsetX: 0,
                offsetY: 0,
                height: '100%',
                width: '100%',
                horizontalAlign: 'center',
                position: 'bottom',
              },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                width: '100%',
                height: '350px',
              },
              legend: {
                offsetX: 0,
                offsetY: -20,
                height: '100%',
                width: '100%',
                horizontalAlign: 'center',
                position: 'bottom',
              },
            },
          },
        ],
        labels: this.chartLabels,
        colors: this.chartColors,
        plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            customScale: 0.8,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 500,
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 1000,
                },
              },
            },
          },
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            colors: ['#000', '#000', '#000', '#000'],
          },
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45,
          },
          enabled: true,
          formatter(val, { seriesIndex, dataPointIndex, w }) {
            return w.config.series[seriesIndex]
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (siteCount, { series, seriesIndex, dataPointIndex, w }) => {
              return siteCount + ' Sites'
            },
          },
        },
      }
    },
  },
  methods: {
    getAlarmWithTenant(alarmId, tenantName) {
      return alarmId + '_' + tenantName
    },
  },
}
</script>

<style lang="scss" scoped></style>
