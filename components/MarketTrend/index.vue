<template>
    <VChart
        :option="{
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    status: 'shadow',
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(251, 169, 128, .1)'
                    }
                }
            },
            xAxis: {
                type: 'category',
                axisLine: false,
                axisTick: false,
                data: barChartOption.keyData,
                axisLabel: {
                    color: '#bababa'
                }
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [
                {
                    data: barChartOption.valData,
                    type: 'bar',
                    barWidth: 24,
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0],
                        color ({ dataIndex }) {
                            if (dataIndex === 4) {
                                return '#d8d8d8'
                            }
                            if (dataIndex < 4) {
                                return raiseColor
                            }
                            if (dataIndex > 4) {
                                return fallColor
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter({ dataIndex, data }) {
                            if (dataIndex === 4) {
                                return `{one|${data}}`
                            }
                            if (dataIndex < 4) {
                                return `{two|${data}}`
                            }
                            if (dataIndex > 4) {
                                return `{three|${data}}`
                            }
                        },
                        rich: {
                            one: {
                                color: '#969799'
                            },
                            two: {
                                color: raiseColor
                            },
                            three: {
                                color: fallColor
                            }
                        }
                    },
                }
            ],
            ...option
        }"
        autoresize
        class="w-full"
    />
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

import { useStockMarketStore } from '../../store'

const raiseColor = getComputedStyle(document.documentElement).getPropertyValue('--raise'),
    fallColor = getComputedStyle(document.documentElement).getPropertyValue('--fall')

defineProps({
    option: Object
})

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    LegendComponent,
    TooltipComponent,
])

const { totalMarket } = storeToRefs(useStockMarketStore())

const barChartOption = computed(() => {
    const data = [
        { key: '> 7', value: totalMarket.value.increaseArea.countu7 },
        { key: '7~5', value: totalMarket.value.increaseArea.countu75 },
        { key: '5~3', value: totalMarket.value.increaseArea.countu53 },
        { key: '3~0', value: totalMarket.value.increaseArea.countu30 },
        { key: '0', value: totalMarket.value.increaseArea.count0 },
        { key: '0-3', value: totalMarket.value.increaseArea.countd03 },
        { key: '-3--5', value: totalMarket.value.increaseArea.countd35 },
        { key: '-5--7', value: totalMarket.value.increaseArea.countd57 },
        { key: '< -7', value: totalMarket.value.increaseArea.countd7 },
    ]
    
    return {
        keyData: data.map(e => e.key),
        valData: data.map(e => e.value),
    }
})

defineOptions({ name: 'MarketTrend' })
</script>

<style scoped>

</style>
