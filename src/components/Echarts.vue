<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
    option: any
    style?: Record<string, string | number>
}>()

const chartDom = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
    if (!chartDom.value) return
    chartInstance = echarts.init(chartDom.value)
    chartInstance.setOption(props.option)
}
// const initChart = () => {
//     if (!chartDom.value) return

//     const tryInit = () => {
//         if (chartDom.value!.offsetWidth === 0 || chartDom.value!.offsetHeight === 0) {
//             setTimeout(tryInit, 50)
//             return
//         }

//         chartInstance = echarts.init(chartDom.value!)
//         chartInstance.setOption(props.option)
//     }

//     tryInit()
// }

const resizeHandler = () => {
    if (chartInstance) {
        chartInstance.resize()
    }
}

onMounted(() => {
    initChart()
    window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
})

watch(
    () => props.option,
    (newOption) => {
        if (chartInstance) {
            chartInstance.setOption(newOption, true)
        }
    },
    { deep: true }
)

defineExpose({ getChart: () => chartInstance })
</script>

<template>
    <div ref="chartDom" style="width: 100%; height: 100%"></div>
</template>