<template>
    <div class="search-winbox">
        <div class="search-box">
            <input type="text" placeholder="Enter a level, user, or ID" class="text-apply" @click="clearInputbox"
                ref="_input_box">
            <img src="/resource/button_search_level.png" alt="?" class="button">
            <img src="/resource/button_search_user.png" alt="?" class="button">
            <img src="/resource/button_search_delete.png" alt="?" class="button">
        </div>
        <div class="search-index __search_inside_box">
            <h1 class="text-apply">Search Index</h1>
            <div class="search-index-box search-w32box">
                <div class="search-index-item button">
                    <span class="text-apply">Downloads</span>
                    <img src="/resource/download.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Likes</span>
                    <img src="/resource/like.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Sent</span>
                    <img src="/resource/mod.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Trending</span>
                    <img src="/resource/trending.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Recent</span>
                    <img src="/resource/recent.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Magic</span>
                    <img src="/resource/magic.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Awarded</span>
                    <img src="/resource/star.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Followed</span>
                    <img src="/resource/follow_on.png">
                </div>
                <div class="search-index-item button">
                    <span class="text-apply">Friends</span>
                    <img src="/resource/download.png">
                </div>
            </div>
        </div>
        <div class="search-filter __search_inside_box">
            <h1 class="text-apply">Search Filters</h1>
            <div class="search-w32box _face" ref="__face_list">
                <div class="_face-i button" @click="_selection_face(0)" :active="_selec_face_id.includes(0)">
                    <img src="/resource/face/unrated.png" alt="?">
                    <span class="text-apply">NA</span>
                </div>
                <div class="_face-i button" @click="_selection_face(1)" :active="_selec_face_id.includes(1)">
                    <img src="/resource/face/auto.png" alt="?">
                    <span class="text-apply">Auto</span>
                </div>
                <div class="_face-i button" @click="_selection_face(2)" :active="_selec_face_id.includes(2)">
                    <img src="/resource/face/easy.png" alt="?">
                    <span class="text-apply">Easy</span>
                </div>
                <div class="_face-i button" @click="_selection_face(3)" :active="_selec_face_id.includes(3)">
                    <img src="/resource/face/normal.png" alt="?">
                    <span class="text-apply">Normal</span>
                </div>
                <div class="_face-i button" @click="_selection_face(4)" :active="_selec_face_id.includes(4)">
                    <img src="/resource/face/hard.png" alt="?">
                    <span class="text-apply">Hard</span>
                </div>
                <div class="_face-i button" @click="_selection_face(5)" :active="_selec_face_id.includes(5)">
                    <img src="/resource/face/harder.png" alt="?">
                    <span class="text-apply">Harder</span>
                </div>
                <div class="_face-i button" @click="_selection_face(6)" :active="_selec_face_id.includes(6)">
                    <img src="/resource/face/insane.png" alt="?">
                    <span class="text-apply">Insane</span>
                </div>
                <div class="_face-i button" @click="_selection_face(7)" :active="_selec_face_id.includes(7)">
                    <!-- <img class="demon_plus button" src="/resource/b    utton_plus.png" alt="?" :active="_selec_face_id.includes(7)"> -->
                    <img src="/resource/face/demon.png" alt="?">
                    <span class="text-apply">Demon</span>
                </div>
            </div>
            <div class="search-w32box _timer">
                <img src="/resource/time.png" alt="?">
                <span class="text-apply selected button" :active="_selec_timer_id.includes(0)" @click="_selection_timer(0)">Tiny</span>
                <span class="text-apply selected button" :active="_selec_timer_id.includes(1)" @click="_selection_timer(1)">Short</span>
                <span class="text-apply selected button" :active="_selec_timer_id.includes(2)" @click="_selection_timer(2)">Medium</span>
                <span class="text-apply selected button" :active="_selec_timer_id.includes(3)" @click="_selection_timer(3)">Long</span>
                <span class="text-apply selected button" :active="_selec_timer_id.includes(4)" @click="_selection_timer(4)">XL</span>
                <span class="text-apply selected button" :active="_selec_timer_id.includes(5)" @click="_selection_timer(5)">Plat.</span>
                <img src="/resource/star.png" alt="?" class="selected button" :active="_selec_star"  @click="_selection_star">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const _input_box = ref('');
let _selec_face_id = ref([]);
let _selec_timer_id = ref([]);
let _selec_star = ref(false);

const clearInputbox = () => {
    _input_box.value = "";
}

const _selection_face = (id) => {
    const currentSelection = _selec_face_id.value;
    const singleSelectOptions = [0, 1, 7];
    if (singleSelectOptions.includes(id)) {
        if (currentSelection.includes(id))
            _selec_face_id.value = [];
        else
            _selec_face_id.value = [id];
    } else {
        if (currentSelection.includes(id))
            _selec_face_id.value = currentSelection.filter(item => item !== id);
        else {
            const filteredSelection = currentSelection.filter(item => !singleSelectOptions.includes(item));
            _selec_face_id.value = [...filteredSelection, id];
        }
    }
}

const _selection_timer = (id) => {
    const currentSelection = _selec_timer_id.value;
    
    if (currentSelection.includes(id))
        _selec_timer_id.value = currentSelection.filter(item => item !== id);
    else
        _selec_timer_id.value = [...currentSelection, id];
}

const _selection_star = () => {
    _selec_star.value = !_selec_star.value;
}

</script>

<style scoped>
.search-winbox {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    padding: 10px;
    background-image: linear-gradient(#0065FD, #002E73);
}

.search-winbox .search-box {
    width: 50%;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    margin: auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 15px;
}

.search-winbox .search-box input {
    flex: 1;
    height: 80%;
    border: none;
    border-radius: 15px;
    outline: none;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 2rem;
    font-family: Pusab, Arial;
    color: white;
    padding: 0 20px;
}

.search-winbox .search-box img {
    height: 60px;
}

.__search_inside_box h1 {
    text-align: center;
    font-family: Pusab, Arial;
    font-size: 3rem;

}

.__search_inside_box .search-w32box {
    background-color: rgba(0, 0, 0, 0.3);

    width: 50%;
    margin: auto;
    height: 100%;
    border-radius: 15px;
    padding: 20px;
}

.search-winbox .search-index h1 {
    margin-top: 40px;
    line-height: 30px;
}

.search-winbox .search-index .search-index-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    column-gap: 5%;
    row-gap: 10px;
}

.search-winbox .search-index .search-index-box .search-index-item {
    background-image: url('/resource/button_bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    column-gap: 1.5%;
    justify-content: center;
    gap: 10px;
    padding: 0 10px;
    height: 60px;
    width: 200px;
}

.search-winbox .search-index .search-index-box .search-index-item span {
    font-family: Pusab, Arial;
    font-size: 1.5rem;
}

.search-winbox .search-index .search-index-box .search-index-item img {
    height: 30px;
}

.search-winbox .search-filter ._face {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    column-gap: 5%;
    row-gap: 10px;
}

.search-winbox .search-filter ._face ._face-i {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    filter: brightness(50%);
}

.search-winbox .search-filter ._face ._face-i[active=true] {
    filter: brightness(100%);
}

.search-winbox .search-filter ._face ._face-i img {
    height: 60px;
}

.search-winbox .search-filter ._face ._face-i span {
    font-family: Pusab, Arial;
    font-size: 1.5rem;
}

.search-winbox .search-filter ._face .face-i .demon_plus {
    height: 20px;
    position: absolute;
    display: none;
}

.search-winbox .search-filter ._face .face-i .demon_plus[active=true] {
    display: block;
}

.search-winbox .search-filter ._timer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.search-winbox .search-filter ._timer img {
    height: 60px;
}

.search-winbox .search-filter ._timer span {
    font-family: Pusab, Arial;
    font-size: 2.5rem;
    margin-left: 10px;
    margin-right: 10px;
}

.search-winbox .search-filter ._timer .selected {
    filter: brightness(50%);
}

.search-winbox .search-filter ._timer .selected[active=true] {
    filter: brightness(100%);
}

</style>