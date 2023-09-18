<template>
    <div class="w-full">
        <div v-for="(sensorName, index) in sensorNames" :key="index">
            <br>
            <!-- <h2>{{ sensorName }}</h2> -->
            <CanvasJSChart :options="getChartOptions(sensorName)" :style="styleOptions" />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            extractedData: {},
            sensorNames: [],
            charts: {},
            styleOptions: {
                height: "360px"
            }
        };
    },
    mounted() {
        this.fetchSensorData();
    },
    methods: {
        fetchSensorData() {
            axios
                .get('http://192.168.128.101:5000/sensor-data')
                .then(response => {
                    this.extractedData = response.data;
                    this.processSensorData();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        processSensorData() {
            this.sensorNames = Object.keys(this.extractedData);
            this.sensorNames.forEach(sensorName => {
                const data = this.extractedData[sensorName];
                const chartOptions = this.createChartOptions(sensorName, data);
                this.charts[sensorName] = chartOptions;
            });
        },
        createChartOptions(sensorName, data) {
            return {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                    text: sensorName
                },
                axisY: {
                    title: "Sensor Values",
                    labelFormatter: (e) => {
                        var suffixes = ["", "K", "M", "B"];
                        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
                        if (order > suffixes.length - 1)
                            order = suffixes.length - 1;
                        var suffix = suffixes[order];
                        return (e.value / Math.pow(1000, order)) + suffix;
                    }
                },
                data: [{
                    type: "line",
                    xValueFormatString: "HH:mm",
                    dataPoints: data.map(item => ({
                        x: new Date(item.timestamp),
                        y: item.value
                    }))
                }]
            };
        },
        getChartOptions(sensorName) {
            return this.charts[sensorName] || {};
        }
    }
};
</script>
  