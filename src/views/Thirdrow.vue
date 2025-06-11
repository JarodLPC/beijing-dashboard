<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import request from "@/utils/requests";
import { getCurrentDate } from '@/utils/timeSolving';
import type { ResponseResult, LineEquipmentFormulaResultDtoMiddle } from '@/types'
let respMttrs: number[] = [];
let respMtbfs: number[] = [];

let loadingMttr = ref<boolean>(true);
let loadingMtbf = ref<boolean>(true);
//设置刷新时间ID
let mttrIntervalId: any | null = null;
// let mtbfIntervalId: NodeJS.Timeout | null = null;
let mtbfIntervalId: any | null = null;
let optionLineMttr = reactive({
    title: {
        text: 'MTTR',
        style: {
            fill: '#fff',
            fontSize: 40
        }
    },

    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            fill: '#fff',
            fontSize: 20
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            style: {
                fill: '#fff',
                fontSize: 20
            }
        }
    },
    yAxis: {
        name: 'Minute',
        nameTextStyle: {
            fill: '#fff',
            fontSize:20
        },
        data: 'value',
        min: 0,
        axisLabel: {
            style: {
                fill: '#fff',
                fontSize: 20
            }
        }
    },
    series: [
        {
            data: respMttrs,
            type: 'line',
            lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 0.6)', 'rgba(251, 114, 147, 0)']
            }
        }
    ]
})
let optionLineMtbf = reactive({
    title: {
        text: 'MTBF',
        style: {
            fill: '#fff',
            fontSize: 40
        }
    },

    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            fill: '#fff',
            fontSize: 20

        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            style: {
                fill: '#fff',
                fontSize: 20
            }
        }
    },
    yAxis: {
        name: 'Minute',
        nameTextStyle: {
            fill: '#fff',
            fontSize: 20
        },
        data: 'value',
        min: 0,
        axisLabel: {
            style: {
                fill: '#fff',
                fontSize: 20
            }
        }
    },
    series: [
        {
            data: [15780, 316, 4248, 2508, 10218, 1926, 30960, 10284, 10290, 0, 0, 0],

            type: 'line',
            lineArea: {
                show: true,
                gradient: ['rgba(251, 114, 147, 0.6)', 'rgba(251, 114, 147, 0)']
            }
        }
    ]
})
let fetchMttrData = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/MTTRMacro/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;

    //发送请求获取MTTR数据
    try {

        const mttrResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        mttrResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
            respMttrs.push(Number((item.result[0].value.displayValue / 60).toFixed(2)));
        });

        optionLineMttr.series[0].data = respMttrs;
        loadingMttr.value = false;
        // console.log('respMttrs', respMttrs);


    } catch (error) {
        console.error('请求失败:', error);
    }
}
let fetchMtbfData = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/MTBFMacro/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;

    //发送请求获取MTTR数据
    try {

        const mtbfResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
        mtbfResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
            respMtbfs.push(Number((item.result[0].value.displayValue / 60).toFixed(2)));
        });

        optionLineMtbf.series[0].data = respMtbfs;
        loadingMtbf.value = false;
        // console.log('respMtbfs', respMtbfs);
    } catch (error) {
        console.error('请求失败:', error);
    }
}
onMounted(async () => {
    fetchMttrData();
    fetchMtbfData();
    mttrIntervalId = setInterval(() => {

        loadingMttr.value = true;

        respMttrs = [];

        fetchMttrData();

        optionLineMttr.series[0].data = respMttrs;

        // optionLineMttr = { ...optionLineMttr };
    }, 45 * 60 * 1000);
    mtbfIntervalId = setInterval(() => {

        loadingMtbf.value = true;
        respMtbfs = [];

        fetchMtbfData();

        optionLineMtbf.series[0].data = respMtbfs;

        // optionLineMtbf = { ...optionLineMtbf };

    }, 55 * 60 * 1000);

})
onBeforeUnmount(() => {
    clearInterval(mttrIntervalId);
    clearInterval(mtbfIntervalId);
})


</script>
<template>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 30vh; padding-top : 2vh;">
            <dv-loading v-if="loadingMttr">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionLineMttr" style="width:100%;height: 28vh;" />
            </div>

        </dv-border-box12>
    </div>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 30vh; padding-top : 2vh;">
            <dv-loading v-if="loadingMtbf">Loading...</dv-loading>
            <div dv-bg v-else>
                <dv-charts :option="optionLineMtbf" style="width:100%;height: 28vh;" />
            </div>
        </dv-border-box12>

    </div>
</template>
<style scoped></style>