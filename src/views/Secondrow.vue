<script setup lang="ts">

import { reactive, onMounted, ref, onBeforeUnmount } from 'vue';
import request from '@/utils/requests';
import { getCurrentDate, lastMonthFrom, lastMonthTo, faultDurationConvertToHours, isMacroFaule } from '@/utils/timeSolving';
import type { ResponseResult, LineEquipmentFormulaResultDtoMiddle, RawReasonDto } from '@/types';

let oeeData: number[] = [];
let queryLastFrom: string = lastMonthFrom();
let queryLastTo: string = lastMonthTo();
//定时刷新定时器
let oeeIntervalId: any | null = null;
let summaryIntervalId: any | null = null;
//刷新页面指示器
let loadingOee = ref<boolean>(true);
let loadingMachineStopSummary = ref<boolean>(true);

let fetchOee = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/OEE/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;


    try {
        const oeeResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);

        // console.log('oeeResults', oeeResults);
        oeeResults.result.forEach((el: LineEquipmentFormulaResultDtoMiddle) => {

            oeeData.push(Number(el.result[0].value.displayValue.toFixed(2)));

        });
        // console.log('oeedata', oeeData);
        //获取数据之后让数据显示在图表上，隐藏loading界面
        optionOee.series[0].data = oeeData;

        loadingOee.value = false;


    } catch (error) {
        console.error('请求失败:', error);
    }

}

let sortedCategories: string[] = [];
let sortedValues: number[] = [];
let percentageValues: number[] = [];
let fetchMachineStopSummary = async () => {
    let machineStopReasonCode: number[] = [301, 410, 503, 903, 203, 411, 901, 108, 403, 602, 902, 904, 401];
    let machineStopSummaryCategories: string[] = ['301', '410', '503', '903', '203', '411', '901', '108', '403', '602', '902', '904', '401'];

    //并发发送请求
    try {

        let results = await request.get<any, ResponseResult<RawReasonDto>>(`/equipments/1001/reasons/history?from=${queryLastFrom}&to=${queryLastTo}&detailed=false&timezone=local&categorygroup=Sidel`);
        let machineStopSummaryValue: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (results.success == true) {
            //遍历results里的每一个result数据，当 result.reason.code等于machineStopReasonCode中的某个值时，将result.interval.duration累加起来，将最后的结果生成一个数组，作为machineStopSummaryValue
            results.result.forEach(item => {

                if (isMacroFaule(item.interval.duration, 15)) {

                    switch (item.reason.code) {
                        case machineStopReasonCode[0]:
                            machineStopSummaryValue[0] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[1]:
                            machineStopSummaryValue[1] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[2]:
                            machineStopSummaryValue[2] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[3]:
                            machineStopSummaryValue[3] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[4]:
                            machineStopSummaryValue[4] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[5]:
                            machineStopSummaryValue[5] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[6]:
                            machineStopSummaryValue[6] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[7]:
                            machineStopSummaryValue[7] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[8]:
                            machineStopSummaryValue[8] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[9]:
                            machineStopSummaryValue[9] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[10]:
                            machineStopSummaryValue[10] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        case machineStopReasonCode[11]:
                            machineStopSummaryValue[11] += Number(faultDurationConvertToHours(item.interval.duration));
                            break;
                        default:
                            break;
                    }
                    if (item.category.code == 'Failures') {
                        machineStopSummaryValue[12] += Number(faultDurationConvertToHours(item.interval.duration));
                    }
                }
            })
            // console.log('machineStopSummaryValue', machineStopSummaryValue);
            // 合并两个数组为一个数组，其中每个元素是一个包含两个值的对象
            let objCategoryValue = machineStopSummaryCategories.map((category, index) => ({
                category,
                value: machineStopSummaryValue[index]
            }));
            // console.log('objCategoryValue', objCategoryValue);
            // 根据 value 对 combinedArray 进行降序排序
            objCategoryValue.sort((a, b) => b.value - a.value);

            // 分离排序后的数组，得到新的两个子数组
            sortedCategories = objCategoryValue.map(item => item.category);
            sortedValues = objCategoryValue.map(item => item.value);

            // 计算 sortedValues 数组的总和
            let totalSum = sortedValues.reduce((sum, value) => sum + value, 0);

            // 生成新的数组 percentageValues 

            let cumulativeSum = 0;

            for (let i = 0; i < sortedValues.length; i++) {
                cumulativeSum += sortedValues[i];
                percentageValues.push((cumulativeSum / totalSum) * 100);
            }

            // console.log('percentageValues', percentageValues); // 输出转换后的百分比数组

            optionMachineStopSummary.xAxis.data = sortedCategories;
            optionMachineStopSummary.series[0].data = sortedValues;
            optionMachineStopSummary.series[1].data = percentageValues;

            // console.log('sortedCategories', sortedCategories); // 输出排序后的 machineStopSummaryCategories
            // console.log('sortedValues', sortedValues); // 输出排序后的 machineStopSummaryValue
            //获取数据之后让数据显示在图表上，隐藏loading界面
            loadingMachineStopSummary.value = false;
        } else {
            alert('数据读取超时，请刷新重试');
        }

    } catch (error) {
        console.error('请求失败:', error);
    }
}
let optionMachineStopSummary = reactive({
    title: {
        text: 'Machine Stop Summary',
        style: {
            fill: '#fff',
            fontSize: 30
        },

    },
    legend: {
        data: ['duration', '%'],
        textStyle: {
            fill: '#fff'
        },
        bottom: 10
    },
    xAxis: {
        data: [
            'Failures', 'Production Stops', 'Set Up', 'Unplanned Stops', 'Speed Losses', 'Undefined'
        ],
        axisLabel: {
            style: {
                rotate: 0,
                fill: '#fff',
                textAlign: 'center',
                textBaseline: 'top'
            }
        },
        axisTick: {
            show: false
        }
    },
    yAxis: [
        {
            name: 'duration',
            nameTextStyle: {
                fill: '#fff',
                fontSize: 10
            },
            data: 'value',
            min: 0,
            max: 500,
            interval: 100,
            splitLine: {
                style: {
                    lineDash: [3, 3]
                }
            },
            axisLabel: {
                formatter: '{value} h',
                style: {
                    fill: '#fff'
                }
            },
            axisTick: {
                show: false
            }
        },
        {
            name: '%',
            nameTextStyle: {
                fill: '#fff',
                fontSize: 10
            },
            data: 'value',
            position: 'right',
            min: 0,
            max: 100,
            interval: 20,
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: '{value} %',
                style: {
                    fill: '#fff'
                }
            },
            axisTick: {
                show: false
            }
        }
    ],
    series: [
        {
            name: 'duration',
            data: [
                132.5, 119, 64.2, 54.6, 4.5, 1.3
            ],
            type: 'bar',
            gradient: {
                color: ['#37a2da', '#67e0e3']
            },
            animationCurve: 'easeOutBounce'
        },
        {
            name: '%',
            data: [
                35.2, 66.87, 83.94, 98.46, 99.65, 100
            ],
            type: 'line',
            yAxisIndex: 1,
            animationCurve: 'easeOutBounce'
        }
    ]
})
let optionOee = reactive({
    title: {
        text: 'OEE',
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
        axisLabel: {
            style: {
                fill: '#fff'
            }
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        name: '%',
        nameTextStyle: {
            fill: '#fff'
        },
        axisLabel: {
            style: {
                fill: '#fff'
            },
            formatter: '{value} %'
        },
        data: 'value',
        min: 0,
        max: 100
    },

    series: [
        {
            data: [82.4, 80.3, 79, 78.3, 77.3, 70.7, 32.8, 31.6, 29.7, 0, 0, 0],
            // data: [],
            type: 'bar'
        }
    ]
})

onMounted(async () => {
    fetchOee();
    fetchMachineStopSummary();
    summaryIntervalId = setInterval(() => {
        loadingMachineStopSummary.value = true;
        sortedCategories = [];
        sortedValues = [];
        percentageValues = [];

        fetchMachineStopSummary();

        optionMachineStopSummary.xAxis.data = sortedCategories;
        optionMachineStopSummary.series[0].data = sortedValues;
        optionMachineStopSummary.series[1].data = percentageValues;
        optionMachineStopSummary = { ...optionMachineStopSummary };
    }, 3400000);

    oeeIntervalId = setInterval(() => {
        loadingOee.value = true;
        oeeData = [];
        fetchOee();
        optionOee.series[0].data = oeeData;
        optionOee = { ...optionOee };
    }, 3400000);



})
onBeforeUnmount(() => {
    clearInterval(oeeIntervalId);
    clearInterval(summaryIntervalId);
})


</script>
<template>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 350px;">
            <dv-loading v-if="loadingMachineStopSummary">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionMachineStopSummary" style="width:100%;height:350px;" />
            </div>
        </dv-border-box12>
    </div>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 350px;">
            <dv-loading v-if="loadingOee">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionOee" style="width:100%;height:350px;" />
            </div>
        </dv-border-box12>

    </div>
</template>
<style scoped></style>