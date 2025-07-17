<template>
  <ApexChart ref="chart" type="donut" width="100%" height="250px" :options="chartOptions" :series="chartSeries" />
</template>

<script>
import { mapGetters } from 'vuex'
import { SITE_FILTER_TYPE, SITE_ALARM, COMPANY } from '~/assets/js/Constant'
import { getColorOfPieLabel, getTenantLabel } from '~/assets/js/Helper'
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
  computed: {
    ...mapGetters('dashboard', ['frequency', 'selectedTenant']),
    ...mapGetters('user', ['allowedTenants', 'companyName']),

    outageAlarms() {
      const dcLowLabel = this.companyName === COMPANY.SUMMIT_TOWERS_LTD ? 'Battery Low' : 'DC Low'
      return [
        { id: SITE_ALARM.DC_LOW_VOLTAGE, name: dcLowLabel },
        { id: SITE_ALARM.SITE_DOWN, name: 'Site Down' },
      ]
    },
    filteredTenantList() {
      if (this.selectedTenant) {
        return this.allowedTenants.filter(tenant => tenant === this.selectedTenant)
      }
      return this.allowedTenants
    },
    filter() {
      const filterArray = []
      for (const alarm of this.outageAlarms) {
        for (const tenant of this.filteredTenantList) {
          filterArray.push({
            type: SITE_FILTER_TYPE.ALARM,
            id: alarm.id,
            tenant,
            expected: 0,
          })
        }
      }
      return filterArray
    },
    chartLabels() {
      const labels = []
      for (const alarm of this.outageAlarms) {
        for (const tenant of this.filteredTenantList) {
          labels.push(`${alarm.name} (${getTenantLabel(tenant)})`)
        }
      }
      return labels
    },

    chartColors() {
      const colors = []
      for (const alarm of this.outageAlarms) {
        for (const tenant of this.filteredTenantList) {
          const alarmWithTenant = this.getAlarmWithTenant(alarm.id, tenant)
          const color = getColorOfPieLabel(alarmWithTenant)
          colors.push(color)
        }
      }
      return colors
    },
    chartSeries() {
      const series = []
      for (const alarm of this.outageAlarms) {
        for (const tenant of this.filteredTenantList) {
          const alarmWithTenant = this.getAlarmWithTenant(alarm.id, tenant)
          const alarmCount = this._.get(this.frequency, alarmWithTenant, 0)
          series.push(alarmCount)
        }
      }
      return series
    },
    chartOptions() {
      return {
        chart: {
          id: 'mains-outage-dashboard',
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
            colors: ['#000', '#000', '#000'],
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
              const plurality = siteCount > 1 ? 's' : ''
              return `${siteCount} Site${plurality}`
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
