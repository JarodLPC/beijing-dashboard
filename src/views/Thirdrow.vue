<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import request from "@/utils/requests";
import { getCurrentDate } from '@/utils/timeSolving';
import type { ResponseResult, LineEquipmentFormulaResultDtoMiddle } from '@/types'
import Echarts from '@/components/Echarts.vue';

let Mock = false;
let respMttrs: number[] = [];
let respMtbfs: number[] = [];

let loadingMttr = ref<boolean>(true);
let loadingMtbf = ref<boolean>(true);
//设置刷新时间ID
let mttrIntervalId: any | null = null;
// let mtbfIntervalId: NodeJS.Timeout | null = null;
let mtbfIntervalId: any | null = null;

let fetchMttrData = async () => {
    // 获取当前年份
    let yearNow = getCurrentDate()[0];
    let dateTimeFrom = yearNow + '0101000000000';
    let dateTimeTo = yearNow + 1 + '0101000000000';
    //准备url
    let url = `/equipments/1001/formulasSplitBy/EITsidel/MTTRMacro/month_1?from=${dateTimeFrom}&to=${dateTimeTo}&timezone=local`;

    //发送请求获取MTTR数据
    try {

        if(!Mock){
            const mttrResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
            mttrResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
                respMttrs.push(Number((item.result[0].value.displayValue / 60).toFixed(2)));
            });

            optionLineMttr.series[0].data = respMttrs;
        }else{
            for(let i = 0; i < 12; i++ ){
                respMttrs.push(Number((Math.random() * 100).toFixed(2)));
            }
            optionLineMttr.series[0].data = respMttrs;
        }
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
        if(!Mock){
            const mtbfResults = await request.get<any, ResponseResult<LineEquipmentFormulaResultDtoMiddle>>(url);
            mtbfResults.result.forEach((item: LineEquipmentFormulaResultDtoMiddle) => {
                respMtbfs.push(Number((item.result[0].value.displayValue / 60).toFixed(2)));
            });

            optionLineMtbf.series[0].data = respMtbfs;

        }else{
            for(let i = 0; i < 12; i++){
                respMtbfs.push(Number((Math.random() * 100).toFixed(2)));
            }
            
            optionLineMtbf.series[0].data = respMtbfs;  
        }
        
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

        optionLineMttr = { ...optionLineMttr };
    }, 3500000);
    mtbfIntervalId = setInterval(() => {

        loadingMtbf.value = true;
        respMtbfs = [];

        fetchMtbfData();

        optionLineMtbf.series[0].data = respMtbfs;

        optionLineMtbf = { ...optionLineMtbf };

    }, 3600000);

})
onBeforeUnmount(() => {
    clearInterval(mttrIntervalId);
    clearInterval(mtbfIntervalId);
})
const baseGrid = {
    top: 60,
    bottom: 30,
    left: 60,
    right: 60
}

const baseTitle = {
    left: 'center',
    top: 10,
    textStyle: {
        color: '#d3d3d3',
        fontSize: 30
    }
}
let optionLineMttr = reactive({
    title: {
        text: 'MTTR',
        left: 'center',
        top: 10,
        textStyle: {
            color: '#d3d3d3',
            fontSize: 30
        }
    },
    grid:{
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
    },
    tooltip: {},
    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            color: '#d3d3d3'
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            color: '#d3d3d3'
        }
    },
    yAxis: {
        name: 'Minute',
        nameTextStyle: {
            color: '#d3d3d3'
        },
        type: 'value',
        min: 0,
        axisLabel: {
            color: '#d3d3d3'
        }
    },
    series: [
        {
            data: respMttrs,
            type: 'line',
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(251, 114, 147, 0.6)' },
                        { offset: 1, color: 'rgba(251, 114, 147, 0)' }
                    ]
                }
            }
        }
    ]
});
let optionLineMtbf = reactive({
    title: {
        text: 'MTBF',
        left: 'center',
        top: 10,
        textStyle: {
            color: '#d3d3d3',
            fontSize: 30
        }
    },
    grid: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
    },
    tooltip: {},
    xAxis: {
        name: getCurrentDate()[0].toString(),
        nameTextStyle: {
            color: '#d3d3d3'
        },
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: {
            color: '#d3d3d3'
        }
    },
    yAxis: {
        name: 'Minute',
        nameTextStyle: {
            color: '#d3d3d3'
        },
        type: 'value',
        min: 0,
        axisLabel: {
            color: '#d3d3d3'
        }
    },
    series: [
        {
            data: [15780, 316, 4248, 2508, 10218, 1926, 30960, 10284, 10290, 0, 0, 0],
            type: 'line',
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(251, 114, 147, 0.6)' },
                        { offset: 1, color: 'rgba(251, 114, 147, 0)' }
                    ]
                }
            }

        }
    ]
});
</script>
<template>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 300px;">
            <dv-loading v-if="loadingMttr">Loading...</dv-loading>
            <div dv-bg v-else style="width:100%;height: 100%;">
                <Echarts :option="optionLineMttr" style="width:100%;height:300px;" />
            </div>

        </dv-border-box12>
    </div>
    <div style="flex: 0 1 50%">
        <dv-border-box12 style="width: 100%; height: 300px;">
            <dv-loading v-if="loadingMtbf">Loading...</dv-loading>
            <div dv-bg v-else style="width:100%;height: 100%;">
                <Echarts :option="optionLineMtbf" style="width:100%;height:300px;" />
            </div>
        </dv-border-box12>

    </div>
</template>
<style scoped></style>