<template>
    <div class="flex flex-col items-center">
        <button @click="fetchResult" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Fetch Image
        </button>
        <div v-if="image" class="mt-8">
            <img :src="image" alt="Fetched Image" class="mt-4 rounded-lg shadow-lg">
            <div class="bg-gray-200 p-4 rounded-lg mt-4">
                <p class="text-lg font-semibold text-gray-800">Class: {{ plantDisease.class }}</p>
                <p class="mt-2 text-gray-600">Confidence:
                    <span class="bg-gray-300 px-2 py-1 rounded-md text-gray-800">
                        {{ plantDisease.confidence }}%
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            image: null,
            customHeaderData: {},
            plantDisease: {},
            responseHeaders: {},
        };
    },
    methods: {
        fetchImage() {
            axios.get('http://192.168.128.101:5000/photo', { responseType: 'arraybuffer' })
                .then(response => {
                    const contentType = response.headers['content-type'];
                    if (contentType === 'image/png') {
                        const imageBlob = new Blob([response.data], { type: contentType });
                        this.image = URL.createObjectURL(imageBlob);
                    } else {
                        console.error('Received content type is not image/png.');
                    }
                })

                .catch(error => {
                    console.error('Error fetching image:', error);
                });
        },


        fetchResult() {
            axios.get('http://192.168.128.101:5000/result')
                .then(response => {
                    this.plantDisease = {
                        class: response.data.class,
                        confidence: parseFloat(response.data.confidence).toFixed(2) * 100,
                    }
                    this.fetchImage();
                })
                .catch(error => console.log('Error:', error));
        }

    }
};
</script>
