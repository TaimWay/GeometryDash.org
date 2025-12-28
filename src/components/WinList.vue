<template>
    <div class="windows32 no-select">
        <div class="winbox"></div>
        <div class="bg">
            <div class="title text-apply">{{ title }}</div>
            <div class="content">

            </div>
        </div>
        <span class="pages text-apply">{{ pages.first }} to {{ pages.second }} of {{ pages.all }}</span>
        <img src="/resource/magnify.png" alt="?" class="button spage" @click="_select_page()">
        <img src="/resource/button_refresh.png" alt="?" class="button refresh" @click="_refresh_page()">
        <Popup ref="list_page_search" style="z-index: 9999;" title="Jump to Page">
            <InputBox :min="1" :max="9999" :step="1" placeholder="NaN"></InputBox>
        </Popup>
    </div>
    
</template>

<script setup>
import { defineProps, ref } from 'vue'
import Popup from './popup.vue'
import InputBox from './InputBox.vue'

const list_page_search = ref(null);

const props = defineProps({
    title: {
        type: String,
        default: "Online Level"
    },
    pages: {
        type: Object,
        default: {
            first: 1,
            second: 10,
            all: 100
        }
    }
});

const _select_page = () => {
    list_page_search.value.open();
};

const _refresh_page = () => {
    location.reload();
};
</script>

<style scoped>
.windows32 {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
}
.windows32 .bg {
    border-style: solid;
    border-image: url(/resource/winbox32.png) 20% stretch;
    border-image-slice: 85 77;
    border-image-width: 9.5vh;
    width: 50vw;
    height: 75vh;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
.windows32 .winbox {
    width: 45vw;
    height: 65vh;
    background-color: rgb(173, 115, 76);
    margin: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.windows32 .bg .title {
    text-align: center;
    font-size: 6vh;
    font-family: Pusab;
    font-weight: bold;
    font-weight: bold;
    transform: translateY(1vh);
}

.windows32 .pages {
    font-family: Pusab;
    font-size: 2rem;
    position: fixed;
    right: 10px;
    transform: translateY(10px);
}

.windows32 .spage {
    width: 64px;
    height: 64px;
    position: fixed;
    right: 10px;
    margin-top: 60px;
}

.windows32 .refresh {
    width: 128px;
    height: 138px;
    position: fixed;
    right: 20px;
    bottom: 20px;
}
</style>