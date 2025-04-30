<script lang="ts" setup>
import { getCurrentDate } from '@/utils/timeSolving';
import { onBeforeUnmount, onMounted, ref } from 'vue';

let updateIntervalId: any | null = null;
let year =ref<number>(0);
let month=ref<number>(0);
let day=ref<number>(0);

const updateDate = () => {
    [year.value, month.value, day.value] = getCurrentDate();
   
}

onMounted(() => {
    updateDate();
    updateIntervalId = setInterval(updateDate, 60000);

})
onBeforeUnmount(() => {
    clearInterval(updateIntervalId);
})
</script>

<template>
    <div small-bg style="flex: 0 1 30%">

        <dv-decoration-10 style="width:100%;height:5px;" />
        <div style="width: 100%; height: 45px;" class="module-box">
            <div style="flex: 0 1 30%">
                <img src="@/assets/imgs/Sidel_White_logo.png" alt="SidelLogo" style="height:100%; object-fit: cover;">
            </div>
            <div style="flex: 0 1 70% ; display: flex; align-items:end; justify-content: center;color:white">
                <span style="font-size: 30px; ">{{ year }}/{{ month }}/{{ day }}</span>
            </div>
        </div>


    </div>
    <div style="flex:0 1 40%">
        <div class="d-flex">
            <dv-decoration8 style="width:100%;height:50px; flex: 1;" />

            <div text-2xl pt10 class="index-title" style="font-size: 50px;color:white">
                HP TPM Dashboard
            </div>

            <dv-decoration8 :reverse="true" style="width:100%;height:50px; flex: 1;" />

        </div>

    </div>

    <div small-bg style="flex:0 1 30%">
        <dv-decoration-10 style="width:100%;height:5px;" />
        <div style="width: 100%; height: 45px; text-align: right;">
            <img src="@/assets/imgs/icon_evo_on.svg" alt="SidelLogo" style="height:100%; object-fit: cover;">
        </div>
    </div>
</template>
<style scoped></style>