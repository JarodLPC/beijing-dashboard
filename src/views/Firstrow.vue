<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import request from "@/utils/requests";
import { getCurrentDate, lastMonthFrom, lastMonthTo, ytdFrom, ytdTo } from '@/utils/timeSolving';
import type { ResponseResult, LineEquipmentFormulaResultDtoMiddle, LineEquipmentFormulaResultDto } from '@/types'

let occYtdData: number = 0;
let occLastMonthData: number = 0;
let durYtdData: number = 0;
let durLastMonthData: number = 0;
let queryLastFrom: string = lastMonthFrom();
let queryLastTo: string = lastMonthTo();
let queryYtdFrom: string = ytdFrom();
let queryYtdTo: string = ytdTo();
//设置刷新时间ID

let occIntervalId: any | null = null;
let loadingOcc = ref<boolean>(true);
let loadingDur = ref<boolean>(true);

let optionLabor = reactive({
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
            formatter: '{value} %',
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
})
let optionUtilization = reactive({
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
})
let fetchFailuresTimeCount = async () => {
    let requestArr = [];
    // console.log(queryYtdTo, '??????????????')
    requestArr.push(request.get<any, ResponseResult<LineEquipmentFormulaResultDto>>(`/equipments/1001/formulas/EITsidel/FailuresCountMacro?from=${queryLastFrom}&to=${queryLastTo}&timezone=local`));
    requestArr.push(request.get<any, ResponseResult<LineEquipmentFormulaResultDto>>(`/equipments/1001/formulas/EITsidel/FailuresCountMacro?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`));
    requestArr.push(request.get<any, ResponseResult<LineEquipmentFormulaResultDto>>(`/equipments/1001/formulas/EITsidel/FailuresMacro?from=${queryLastFrom}&to=${queryLastTo}&timezone=local`));
    requestArr.push(request.get<any, ResponseResult<LineEquipmentFormulaResultDto>>(`/equipments/1001/formulas/EITsidel/FailuresMacro?from=${queryYtdFrom}&to=${queryYtdTo}&timezone=local`));

    //并发发送请求
    try {

        let results = await Promise.allSettled(requestArr);

        let resultsMap = results.map(result => {
            if (result.status === 'fulfilled') {
                return Number(result.value.result[0].value.displayValue.toFixed(0));

            }
            else {
                return -1;
            }

        });
        occLastMonthData = resultsMap[0];
        occYtdData = resultsMap[1];
        durLastMonthData = resultsMap[2];
        durYtdData = resultsMap[3];


        //获取数据之后让数据显示在图表上，隐藏loading界面
        loadingOcc.value = false;
        loadingDur.value = false;
        // console.log('------------------------');
        // console.log('results:', results);
        // console.log('occYtdData:', occYtdData);
        // console.log('occLastMonthData:', occLastMonthData);
        // console.log('durLastMonthData:', durLastMonthData);
        // console.log('durYtdData:', durYtdData);
        // console.log('------------------------');

    } catch (error) {
        console.error('请求失败:', error);
    }


}

let respLabors: number[] = [];
let respUtilizations: number[] = [];

let loadingLabor = ref<boolean>(true);
let loadingUtilization = ref<boolean>(true);
//设置刷新时间ID
let laborIntervalId: any | null = null;
let utilizationIntervalId: any | null = null;
let fetchLaborData = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/LaborProductivity/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;

    //发送请求获取MTTR数据
    try {

        const laborResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        laborResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
            respLabors.push(Number(item.result[0].value.displayValue));
        });

        optionLabor.series[0].data = respLabors;
        loadingLabor.value = false;
        // console.log('respLabors', respLabors)

    } catch (error) {
        console.error('请求失败:', error);
    }

}

let fetchUtilizationData = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/Utilization/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;

    //发送请求获取MTTR数据
    try {

        const UtilizationResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        UtilizationResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
            respUtilizations.push(Number(item.result[0].value.displayValue));
        });

        optionUtilization.series[0].data = respUtilizations;
        loadingUtilization.value = false;
        // console.log('respUtilizations', respUtilizations);
    } catch (error) {
        console.error('请求失败:', error);
    }

}

onMounted(async () => {
    fetchLaborData();
    fetchUtilizationData();
    fetchFailuresTimeCount();
    laborIntervalId = setInterval(() => {

        loadingLabor.value = true;

        respLabors = [];

        fetchLaborData();

        optionLabor.series[0].data = respLabors;

        optionLabor = { ...optionLabor };
    }, 40 * 60 * 1000);
    utilizationIntervalId = setInterval(() => {

        loadingUtilization.value = true;
        respUtilizations = [];

        fetchUtilizationData();

        optionUtilization.series[0].data = respUtilizations;

        optionUtilization = { ...optionUtilization };

    }, 50 * 60 * 1000);
    occIntervalId = setInterval(() => {
        loadingOcc.value = true;
        loadingDur.value = true;
        fetchFailuresTimeCount();

    }, 30 * 60 * 1000);
})
onBeforeUnmount(() => {
    clearInterval(occIntervalId);

    clearInterval(utilizationIntervalId);
    clearInterval(laborIntervalId);
})
</script>
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
                <!-- <div style="font-size: 60px;text-align: center;">{{ temp }}</div> -->
                <dv-loading v-if="loadingOcc">Loading...</dv-loading>
                <div v-else style="font-size: 60px;flex:0 1 50%; text-align: center;display: flex;">
                    <div style="flex: 0 1 50%; height:100px ">
                        <div style="font-size: 20px; padding: 10px;">Last Month</div>
                        <!-- <dv-decoration-9 :dur=20 style="width:100%;height:175px;font-size: 40px;">{{ occData[1] }}</dv-decoration-9> -->
                        <div style="font-size: 50px; padding: 10px;">{{ occLastMonthData }}</div>
                    </div>
                    <div style="flex: 0 1 50%">
                        <div style="font-size: 20px;padding: 10px;">YTD</div>
                        <!-- <dv-decoration-9 :dur=20 style="width:100%;height:175px;font-size: 40px;">{{ occData[0] }}</dv-decoration-9> -->
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
                        <!-- <dv-decoration-9 :dur=20 style="width:100%;height:175px;font-size: 40px;">{{ durData[1] }}</dv-decoration-9> -->
                        <div style="font-size: 50px; padding: 10px;">{{ durLastMonthData }} </div>
                    </div>
                    <div style="flex: 0 1 50%">
                        <div style="font-size: 20px;padding: 10px;">YTD (h)</div>
                        <!-- <dv-decoration-9 :dur=20 style="width:100%;height:175px;font-size: 40px;">{{ durData[0] }}</dv-decoration-9> -->
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
<style scoped></style>