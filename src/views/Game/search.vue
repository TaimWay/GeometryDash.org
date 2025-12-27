<template>
    <div class="search-winbox no-select">
        <div class="search-box">
            <input type="text" placeholder="Enter a level, user, or ID" class="text-apply"
                v-model="_input_box" ref="inputRef">
            <img src="/resource/button_search_level.png" alt="?" class="button" @click="searchLevel">
            <img src="/resource/button_search_user.png" alt="?" class="button" @click="searchUser">
            <img src="/resource/button_search_delete.png" alt="?" class="button" @click="clearInputbox">
        </div>
        <div class="search-index __search_inside_box">
            <h1 class="text-apply">Search Index</h1>
            <div class="search-index-box search-w32box">
                <div class="search-index-item button" @click="searchDownloads">
                    <span class="text-apply">Downloads</span>
                    <img src="/resource/download.png">
                </div>
                <div class="search-index-item button" @click="searchLikes">
                    <span class="text-apply">Likes</span>
                    <img src="/resource/like.png">
                </div>
                <div class="search-index-item button" @click="searchSent">
                    <span class="text-apply">Sent</span>
                    <img src="/resource/mod.png">
                </div>
                <div class="search-index-item button" @click="searchTrending">
                    <span class="text-apply">Trending</span>
                    <img src="/resource/trending.png">
                </div>
                <div class="search-index-item button" @click="searchRecent">
                    <span class="text-apply">Recent</span>
                    <img src="/resource/recent.png">
                </div>
                <div class="search-index-item button" @click="searchMagic">
                    <span class="text-apply">Magic</span>
                    <img src="/resource/magic.png">
                </div>
                <div class="search-index-item button" @click="searchAwarded">
                    <span class="text-apply">Awarded</span>
                    <img src="/resource/star.png">
                </div>
                <div class="search-index-item button" @click="searchFollowed">
                    <span class="text-apply">Followed</span>
                    <img src="/resource/follow_on.png">
                </div>
                <div class="search-index-item button" @click="searchFriends">
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
                    <img :src="_get_demon_face_res()" alt="?">
                    <span class="text-apply">Demon</span>
                </div>
                <img class="demon_plus button" src="/resource/button_plus.png" alt="?" :active="_selec_face_id.includes(7)" @click="_selec_demon">
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
        <popup ref="demon_select" title="Demon Selection" :buttonList="[{text: 'Cancel', event: 'cancel'}, {text: 'Select', event: 'confirm'}]" @confirm="handleDemonConfirm" @cancel="handleDemonCancel">
            <div class="faces">
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 0 }" @click="_temp_selec_demons = 0">
                    <img src="/resource/face/demon.png" alt="?">
                    <span class="text-apply">Demon</span>
                </div>
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 1 }" @click="_temp_selec_demons = 1">
                    <img src="/resource/face/demon-easy.png" alt="?">
                    <span class="text-apply">Easy Demon</span>
                </div>
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 2 }" @click="_temp_selec_demons = 2">
                    <img src="/resource/face/demon-medium.png" alt="?">
                    <span class="text-apply">Medium Demon</span>
                </div>
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 3 }" @click="_temp_selec_demons = 3">
                    <img src="/resource/face/demon-hard.png" alt="?">
                    <span class="text-apply">Hard Demon</span>
                </div>
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 4 }" @click="_temp_selec_demons = 4">
                    <img src="/resource/face/demon-insane.png" alt="?">
                    <span class="text-apply">Insane Demon</span>
                </div>
                <div class="faces-item button" :class="{ 'selected': _temp_selec_demons === 5 }" @click="_temp_selec_demons = 5">
                    <img src="/resource/face/demon-extreme.png" alt="?">
                    <span class="text-apply">Extreme Demon</span>
                </div>
            </div>
        </popup>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Popup from '/src/components/popup.vue';

const demon_select = ref(null);

const _input_box = ref('');
let _selec_face_id = ref([]);
let _selec_timer_id = ref([]);
let _selec_star = ref(false);
let _selec_demons = ref(0);
let _temp_selec_demons = ref(0); // Temporary selection for popup

// Search state
let _search_type = ref('level'); // 'level' or 'user'
let _search_index = ref(''); // search index name

// Get demon face resource based on selection
const _get_demon_face_res = () => {
    const demonFaces = [
        '/resource/face/demon.png',           // 0: Demon
        '/resource/face/demon-easy.png',      // 1: Easy Demon
        '/resource/face/demon-medium.png',    // 2: Medium Demon
        '/resource/face/demon-hard.png',      // 3: Hard Demon
        '/resource/face/demon-insane.png',    // 4: Insane Demon
        '/resource/face/demon-extreme.png'    // 5: Extreme Demon
    ];
    return demonFaces[_selec_demons.value] || demonFaces[0];
}

const handleDemonConfirm = () => {
    // Apply the temporary selection only when Select is clicked
    _selec_demons.value = _temp_selec_demons.value;
    console.log('Demon selected:', _selec_demons.value);
    // Update the main face selection to demon (id 7)
    _selec_face_id.value = [7];
}

const handleDemonCancel = () => {
    // Reset temporary selection on cancel
    _temp_selec_demons.value = _selec_demons.value;
    console.log('Demon selection cancelled');
}

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

const _selec_demon = () => {
    // Set temporary selection to current selection when opening popup
    _temp_selec_demons.value = _selec_demons.value;
    demon_select.value.open();
}

// Search functions
const performSearch = (index = null) => {
    if (index) _search_index.value = index;
    
    // Build URL parameters for level search
    // Format: /online-list?mode=search-level&index=downloads&filters=0,1,2,3,4,5,6,7&timer=0,1,2,3,4,5&star=true
    const filters = _selec_face_id.value.join(',');
    const timer = _selec_timer_id.value.join(',');
    const star = _selec_star.value.toString();
    
    let urlParams = `/online-list?mode=search-level&index=${index || 'none'}&filters=${filters}&timer=${timer}&star=${star}&page=1`;
    
    // Add content parameter if search box has content
    if (_input_box.value.trim()) {
        urlParams += `&content=${encodeURIComponent(_input_box.value)}`;
    }
    
    console.log("Redirecting to:", urlParams);
    // Redirect to the search results page
    window.location.href = urlParams;
}

const performUser = () => {
    // Build URL parameters for user search
    // Format: /online-list?mode=search-user&content=TaimWay
    const urlParams = `/online-list?mode=search-user&content=${encodeURIComponent(_input_box.value)}`;
    
    console.log("Redirecting to:", urlParams);
    // Redirect to the search results page
    window.location.href = urlParams;
}

// Search button handlers
const searchLevel = () => {
    performSearch('none');
}

const searchUser = () => {
    performUser();
}

// Search index handlers
const searchDownloads = () => performSearch('downloads');
const searchLikes = () => performSearch('likes');
const searchSent = () => performSearch('sent');
const searchTrending = () => performSearch('trending');
const searchRecent = () => performSearch('recent');
const searchMagic = () => performSearch('magic');
const searchAwarded = () => performSearch('awarded');
const searchFollowed = () => performSearch('followed');
const searchFriends = () => performSearch('friends');

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

.search-winbox .search-filter ._face .demon_plus {
    display: none;
    height: 50px;
    position: fixed;
    margin-left: 60%;
}

.search-winbox .search-filter ._face .demon_plus[active=true] {
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

.faces {
    display: flex;
    gap: 50px;
}

.faces .faces-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: brightness(50%);
}

.faces .faces-item.selected {
    filter: brightness(100%);
    transform: scale(1.1);
    transition: all 0.2s ease;
}

.faces .faces-item[active=true] {
    filter: brightness(100%);
}

.faces .faces-item img {
    width: 120px;
}

.selected-demon-face {
    height: 60px;
    margin-left: 10px;
}

</style>