<template>
    <div class="flex justify-center items-center mx-auto pb-5 bg-gray-100 min-h-screen nature-background">
        <div class="w-full max-w-4xl bg-opacity-90 h-max p-6 mt-8 bg-white rounded-lg shadow-lg overflow-y-auto">
            <div class="flex flex-col items-center justify-start h-full">
                <photo-taker></photo-taker>
                <h1 class="text-2xl font-bold mb-4">Upload an image</h1>

                <label for="fileInput" class="mb-4">
                    <div
                        class="border-4 border-dashed border-gray-400 hover:border-gray-700 rounded-lg p-8 text-center cursor-pointer ">
                        <div class="text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                class="w-12 h-12 mx-auto mb-4">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <p>Click to select a file</p>
                        </div>
                    </div>
                    <input id="fileInput" type="file" @change="uploadImage" accept=".jpg" class="hidden">
                </label>

                <div>
                    <img :src="uploadedImageUrl" v-if="uploadedImageUrl" alt="Uploaded Image"
                        class="mt-4 rounded-lg shadow-lg">
                </div>

                <div v-if="responseText" class="mt-4">
                    <div class="bg-gray-200 p-4 rounded">
                        <p class="text-lg font-semibold">Class: {{ plantDisease.class }}</p>
                        <p class="mt-2">Confidence:
                            <span class="bg-gray-300 px-2 py-1 rounded">
                                {{ plantDisease.confidence }}%
                            </span>
                        </p>
                    </div>
                </div>
                <br>
                <button @click="addSensor" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Connect to available sensors
                </button>
            </div>

            <div v-if="showLineChart">
                <LineChart></LineChart>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import PhotoTaker from './PhotoTaker.vue';
import { Line } from 'vue-chartjs';
import LineChart from './LineChart.vue'


export default {
    extends: Line,

    components: {
        PhotoTaker,
        LineChart,
    },

    data() {
        return {
            apiData: null,

            file: null,
            uploadedImageUrl: '',
            responseText: '',
            plantDisease: {},
            sensorsData: null,
            showLineChart: false,
        };
    },


    methods: {

        uploadImage(event) {
            this.file = event.target.files[0];

            if (!this.file) {
                alert('Please select a file.');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.file);

            axios.post('http://192.168.128.62:8000/predict', formData)
                .then(response => {
                    this.uploadedImageUrl = URL.createObjectURL(this.file);
                    this.responseText = JSON.stringify(response.data);

                    this.plantDisease = {
                        class: response.data.class,
                        confidence: parseFloat(response.data.confidence).toFixed(2) * 100,
                    }
                })
                .catch(error => console.log('Error:', error));
        },

        addSensor() {
            axios.post('http://192.168.128.101:5000/add-sensor')
                .then(response => {
                    console.log(response.data);
                    this.showLineChart = true;
                })
                .catch(error => console.log('Error:', error));
        }

    }
};
</script>

<style>
.nature-background {
    background-image: url('../assets/nature-bg2.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>