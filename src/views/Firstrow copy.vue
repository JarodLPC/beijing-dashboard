<template>
    <div style="flex: 0 1 30%">
        <dv-border-box12 style="width: 100%; height: 300px;">
            <dv-loading v-if="loadingLabor">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionLabor" style="width:100%;height:300px;" />
            </div>
        </dv-border-box12>
    </div>
    <div style="flex: 0 1 20%">
        <dv-border-box12 style="width: 100%; height: 300px;">
            <div
                style="width: 100%; height:300px; display: flex; flex-direction : column; justify-content:space-around;">
                <div style="font-size: 30px; flex:0 1 20%; font-weight: bold; text-align: center;">
                    Occurence TPM Failures
                </div>
                <dv-loading v-if="loadingOcc">Loading...</dv-loading>
                <div v-else style="font-size: 60px;flex:0 1 50%; text-align: center;display: flex;">
                    <div style="flex: 0 1 50%; height:100px ">
                        <div style="font-size: 20px; padding: 10px;">Last Month</div>
                        <div style="font-size: 50px; padding: 10px;">{{ occLastMonthData }}</div>
                    </div>
                    <div style="flex: 0 1 50%">
                        <div style="font-size: 20px;padding: 10px;">YTD</div>
                        <div style="font-size: 50px;padding: 10px;">{{ occYtdData }}</div>
                    </div>
                </div>
            </div>
        </dv-border-box12>
    </div>
    <div style="flex: 0 1 20%">
        <dv-border-box12 :reverse="true" style="width: 100%; height: 300px; ">
            <div
                style="width: 100%; height:300px; display: flex; flex-direction : column; justify-content:space-around;">
                <div style="font-size: 30px; font-weight: bold;  text-align: center;">
                    Duration TPM Failures
                </div>
                <dv-loading v-if="loadingDur">Loading...</dv-loading>
                <div v-else style="font-size: 60px;flex:0 1 50%; text-align: center;display: flex;">
                    <div style="flex: 0 1 50%; height:100px ">
                        <div style="font-size: 20px; padding: 10px;">Last Month (h)</div>
                        <div style="font-size: 50px; padding: 10px;">{{ durLastMonthData }} </div>
                    </div>
                    <div style="flex: 0 1 50%">
                        <div style="font-size: 20px;padding: 10px;">YTD (h)</div>
                        <div style="font-size: 50px;padding: 10px;">{{ durYtdData }} </div>
                    </div>
                </div>
            </div>
        </dv-border-box12>
    </div>
    <div style="flex: 0 1 30%">
        <dv-border-box12 style="width: 100%; height: 300px;">
            <dv-loading v-if="loadingUtilization">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionUtilization" style="width:100%;height:300px;" />
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import request from "@/utils/requests";
import { getCurrentDate, lastMonthFrom, lastMonthTo,ytdFrom, ytdTo, faultDurationConvertToHours, isMacroFaule } from '@/utils/timeSolving';
import type { ResponseResult, LineEquipmentFormulaResultDtoMiddle, LineEquipmentFormulaResultDto } from '@/types';

// Refs for data and intervals
const loadingLabor = ref<boolean>(false);
const loadingUtilization = ref<boolean>(false);
const loadingOcc = ref<boolean>(false);
const loadingDur = ref<boolean>(false);

const respLabors = ref<number[]>([]);
const respUtilizations = ref<number[]>([]);

const occLastMonthData = ref<number>(0);
const occYtdData = ref<number>(0);
const durLastMonthData = ref<number>(0);
const durYtdData = ref<number>(0);

const queryLastFrom = lastMonthFrom();
const queryLastTo = lastMonthTo();
const queryYtdFrom = ytdFrom();
const queryYtdTo = ytdTo();

// Option refs
const optionLabor = ref({
    title: {
        text: 'Labor Efficiency',
        style: {
            fill: '#fff',
            fontSize: 30
        }
    },
    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            fill: '#fff'
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            style: {
                fill: '#fff'
            }
        }
    },
    yAxis: {
        name: '%',
        nameTextStyle: {
            fill: '#fff'
        },
        data: 'value',
        min: 0,
        max: 100,
        axisLabel: {
            style: {
                fill: '#fff'
            },
            formatter: '{value} %'
        }
    },
    series: [
        {
            data: [86.8, 80.3, 80.3, 80.4, 77.1, 81.7, 57.5, 68.0, 68.3, 0, 0, 0],
            type: 'line',
            lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 0.6)', 'rgba(251, 114, 147, 0)']
            }
        }
    ]
});

const optionUtilization = ref({
    title: {
        text: 'Utilization',
        style: {
            fill: '#fff',
            fontSize: 30
        }
    },
    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            fill: '#fff'
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            style: {
                fill: '#fff'
            }
        }
    },
    yAxis: {
        name: '%',
        nameTextStyle: {
            fill: '#fff'
        },
        data: 'value',
        min: 0,
        max: 100,
        axisLabel: {
            style: {
                fill: '#fff'
            },
            formatter: '{value} %'
        }
    },
    series: [
        {
            data: [52.3, 25.1, 47.4, 45.3, 37.6, 41.1, 32, 36.4, 34.1, 0, 0, 0],
            type: 'line',
            lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 0.6)', 'rgba(251, 114, 147, 0)']
            }
        }
    ]
});

// Fetch functions
async function fetchLaborData() {
    //loadingLabor.value = true;
    try {
        const url = `/equipments/1001/formulasSplitBy/EITsidel/LaborProductivity/month_1?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`;
        //const res = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        //respLabors.value = res.result.map(item => Number(item.result[0].value.displayValue));
        const newData = [86.8, 80.3, 80.3, 80.4, 77.1, 81.7, 57.5, 68.0, 68.3, 0, 0, 0];
        // 使用 Vue 的 set 方法确保响应式更新
        // 这里使用 Vue 的响应式更新数据的方式
        // 如果 optionLabor 是一个响应式对象，可以使用 this.$set 来更新数组内容
        // 但在 setup 中，我们可以使用 Vue 3 的 reactive 来确保响应式
        // optionLabor.series[0].data = newData;
        // optionLabor.setOption
        // 直接生成新的 option 对象，而不是修改现有对象
        optionLabor.value = {
            ...optionLabor.value,
            series: [{
                ...optionLabor.value.series[0],
                data: newData
            }]
        };

        // 使用 nextTick 确保 DOM 更新后再操作图表实例
        // await nextTick();

        // // 获取图表实例并更新配置
        // if (laborChartRef.value) {
        //     const chartInstance = laborChartRef.value.getChart();
        //     if (chartInstance && typeof chartInstance.setOption === 'function') {
        //         chartInstance.setOption(optionLabor.value);
        //     }
        // }
    } catch (err) {
        console.error('Labor fetch error:', err);
    } finally {
        //loadingLabor.value = true;
    }
}

async function fetchUtilizationData() {
    loadingUtilization.value = true;
    try {
        const url = `/equipments/1001/formulasSplitBy/EITsidel/Utilization/month_1?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`;
        //const res = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        //respUtilizations.value = res.result.map(item => Number(item.result[0].value.displayValue));
        const newData = [52.3, 25.1, 47.4, 45.3, 37.6, 41.1, 32, 36.4, 34.1, 0, 0, 0];
        const option = optionUtilization.value;
        option.series[0].data = newData;
        optionUtilization.value = option;
    } catch (err) {
        console.error('Utilization fetch error:', err);
    } finally {
        loadingUtilization.value = false;
    }
}

async function fetchFailuresTimeCount() {
    loadingOcc.value = true;
    loadingDur.value = true;

    const requestArr = [
        request.get(`/equipments/1001/formulas/EITsidel/FailuresCountMacro?from=${queryLastFrom}&to=${queryLastTo}&timezone=local`),
        request.get(`/equipments/1001/formulas/EITsidel/FailuresCountMacro?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`),
        request.get(`/equipments/1001/formulas/EITsidel/FailuresMacro?from=${queryLastFrom}&to=${queryLastTo}&timezone=local`),
        request.get(`/equipments/1001/formulas/EITsidel/FailuresMacro?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`)
    ];

    try {
        const results = await Promise.allSettled(requestArr);
        const resultsMap = results.map(r => r.status === 'fulfilled' ? Number(r.value.result[0].value.displayValue) : -1);

        occLastMonthData.value = resultsMap[0];
        occYtdData.value = resultsMap[1];
        durLastMonthData.value = resultsMap[2];
        durYtdData.value = resultsMap[3];
    } catch (err) {
        console.error('Failed to fetch failure time count:', err);
    } finally {
        loadingOcc.value = false;
        loadingDur.value = false;
    }
}

// Timers
let laborIntervalId: number | null = null;
let utilizationIntervalId: number | null = null;
let occIntervalId: number | null = null;

function clearAllIntervals() {
    if (laborIntervalId) clearInterval(laborIntervalId);
    if (utilizationIntervalId) clearInterval(utilizationIntervalId);
    if (occIntervalId) clearInterval(occIntervalId);
}

onMounted(async () => {
    clearAllIntervals();

    // 直接调用函数获取数据，而不是使用定时器
    await fetchLaborData();
    //await fetchUtilizationData();
    //await fetchFailuresTimeCount();
});

onBeforeUnmount(() => {
    clearAllIntervals();
});
</script>

<style scoped></style>