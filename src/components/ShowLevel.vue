<template>
    <div class="level-box" :style=_show_bg(level.id)>
        <div class="level">
            <div class="title title-text text-apply">{{ level.name }}</div>
            <div class="user">
                <div class="name gold-text text-apply">
                    By {{ level.author }}
                </div>
                <div class="tag">
                    <img v-if=_return(level.copy) src="/resource/copied.png" alt="?">
                    <img v-if=_return(level.large) src="/resource/large.png" alt="?"></img>
                </div>
            </div>
            <div class="info">
                <div class="left">
                    <img :src="_GetDifficultiesResourcePath_(level.difficulty_number, level.quality)" alt="?"
                        class="text-apply difficulties-face">
                    <span class="diff text-apply">{{ level.difficulty }}</span>
                    <span class="star text-apply">{{ level.stars }} <img class="i2" src="/resource/star.png"
                            alt="?"></span>
                </div>
                <img src="/resource/play.png" alt="?" class="play button">
                <div class="right">
                    <div class="text-apply"> <img src="/resource/download.png" alt="?"> {{ level.download }}</div>
                    <div class="text-apply"> <img :src=_decide_show_likes(level.likes) alt="?"> {{ level.likes }}</div>
                    <div class="text-apply"> <img src="/resource/time.png" alt="?"> {{ level.length }}</div>
                    <div class="text-apply" v-if=_check_orbs(level.orbs)> <img src="/resource/orbs.png" alt="?"> {{
                        level.orbs
                    }}</div>
                </div>
            </div>
            <div class="spilt"></div>
            <div class="music">
                <span class="name text-apply">{{ _getMusicNames(level.music) }}</span>
                <span class="author text-apply gold-text">{{ _getMusicAuthor(level.music) }} <img src="/resource/more.png" alt="?"
                        @click="_open_music_info_win32" class="button"> </span>
                <div class="statistics text-apply">
                    {{ _getStatisticsContent(level.music) }}
                </div>
                <img src="/resource/small_info.png" alt="?" class="button info"
                    v-if="_show_info(level.music.getMusicNumber(), level.music.getSfxNumber())">
                <img src="/resource/button_play_music.png" alt="?" class="button play-music">
            </div>
            <div class="funct">
                <img src="/resource/button_refresh.png" alt="?" class="f-refresh button" @click="_refresh">
                <img src="/resource/info.png" alt="?" class="f-info button" @click="_open_info_win32">
                <img src="/resource/leaderboard.png" alt="?" class="f-leaderboard button" @click="Unfinished">
                <img src="/resource/button_give_a_like.png" alt="?" class="f-givealike button" @click="Unfinished">
                <img :src="_decide_show_rate(level.rating, level.demon)" alt="?" class="f-rate button"
                    @click="Unfinished">
            </div>
            <!-- <Audio :playList=audioList :stayWay="true" v-model:currentIndex="currentAudioIndex">
            </Audio> -->
        </div>
        <!-- <div class="level-info">
            <div class="info-box">
                <div class="funct">
                    <img src="/resource/back.png" alt="?" class="button">
                </div>
                <div class="main">
                    <div class="title title-text text-apply">{{ level.name }}</div>
                    <div class="user">
                        <div class="name gold-text text-apply">
                            By {{ level.author }}
                        </div>
                    </div>
                    <div class="description">
                        {{ level.description }}
                    </div>
                </div>
            </div>
        </div> -->
        <Windows32 ref="levelinfo_win32">
            <div class="w32">
                <div class="title title-text text-apply">{{ level.name }}</div>
                <div class="user">
                    <div class="name gold-text text-apply">
                        By {{ level.author }}
                    </div>
                </div>
                <img src="/resource/small_info.png" alt="?" class="button info" @click="_open_info_all_win32">
                <div class="description">
                    {{ level.description }}
                </div>
                <div class="sta-clas">
                    Version: {{ level.version }} ID: <span class="button" @click="copyTextToClipboard(level.id)"> {{
                        level.id }} </span>
                </div>

                <Windows32 ref="levelinfo_all_win32">
                    <div class="w33">
                        <!-- Slot for custom content -->
                        <slot>
                            <!-- Default content if no slot provided -->
                            <h2 class="window-title">All Level Information</h2>
                            <div class="window-body">
                                <p>Name: {{ level.name }}</p>
                                <p>ID: {{ level.id }}</p>
                                <p>Author: {{ level.author }}</p>
                                <p>Description: {{ level.description }}</p>
                                <p>Version: {{ level.version }}</p>
                                <p>Downloads: {{ level.download }}</p>
                                <p>Likes: {{ level.likes }}</p>
                                <p>Length: {{ level.length }}</p>
                                <p v-if=_check_orbs(level.orbs)>Orbs: {{ level.orbs }}</p>
                                <p>Difficulty: {{ level.difficulty }} ({{ level.difficulty_number }})</p>
                                <p>Stars: {{ level.stars }}</p>
                                <p>Quality: {{ level.quality }}</p>
                            </div>
                        </slot>
                    </div>
                </Windows32>

            </div>
        </Windows32>
        <Windows32 ref="muscinfo_win32">
            <div class="w34">
                <h1 class="text-apply">{{ level.music.getAllMusic()[0].name }}</h1>
                <div class="gold-text">By {{ level.music.getAllMusic()[0].author }}</div>
                <button @click="_jumpMusicURL(level.music.getAllMusic()[0].id)" class="button text-apply">Download Soundtrack</button>
                <div class="cls">SongID: {{ level.music.getAllMusic()[0].id }}</div>
            </div>
        </Windows32>
    </div>
</template>

<script>
export default {
    name: "ShowLevel",
    props: {
        level: {
            type: Level,
            required: true
        }
    }
}
</script>

<script setup>
import Level from '../utils/Level';
import Windows32 from './Game_Windows.vue';
import { _GetDifficultiesResourcePath, copyTextToClipboard, Unfinished } from '../utils/utils';

import { ref } from 'vue'

const levelinfo_win32 = ref(null);
const muscinfo_win32 = ref(null);
const levelinfo_all_win32 = ref(null);

const _show_bg = (id) => {
    return `background-image: url('https://levelthumbs.prevter.me/thumbnail/${id}')`
};

const _decide_show_likes = (likes) => {
    return (likes >= 0 ? "/resource/like.png" : "/resource/dislike.png");
};

const _decide_show_rate = (_rate, _demon) => {
    if (_demon) {
        if (_rate) return "/resource/button_rate2.png"
        return "/resource/button_rate.png"
    }
    if (_rate) return "/resource/button_star2.png";
    return "/resource/button_star.png"
}

const _check_orbs = (orbs) => {
    return (orbs != 0);
}

const _return = (_) => {
    return _;
}

const _getMusicNames = (music) => {
    let _mu = music.getAllMusic();
    if (!_mu) return "Unknown";
    if (_mu.length == 1) return _mu[0].name;
    else {
        return `${_mu[0].name}(and ${_mu.length - 1} other items)`;
    }
}

const _getMusicAuthor = (music) => {
    let _mu = music.getAllMusic();
    if (!_mu) return "Unknown";
    if (_mu.length == 1) return `By ${_mu[0].author}`;
    else {
        return `By ${_mu[0].author} and ${_mu.length - 1} other authors`;
    }
}

const _getStatisticsContent = (music) => {
    if (music.getMusicNumber() == 1 && music.getSfxNumber() == 0)
        return `SongID: ${music.getAllMusic()[0].id} Size: ${music.getSize()} MB`;
    return `Songs: ${music.getMusicNumber()} SFX: ${music.getSfxNumber()} Size: ${music.getSize()} MB`
}

const _show_info = (a, b) => {
    return (a > 1 || b > 1);
}

const _GetDifficultiesResourcePath_ = (a, b) => {
    let _path = _GetDifficultiesResourcePath({ difficulty: a, quality: b });
    return _path;
}

const _refresh = () => {
    location.reload();
}

const _open_info_win32 = () => {
    levelinfo_win32.value.open();
};

const _open_music_info_win32 = () => {
    muscinfo_win32.value.open();
};

const _open_info_all_win32 = () => {
    levelinfo_all_win32.value.open();
};

const _jumpMusicURL = (id) => {
    let website = `https://www.newgrounds.com/audio/listen/${id}`;
    window.open(website, '_blank');
}

</script>

<style scoped>
.level-box {
    background-size: cover;
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
}

.level {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    font-family: Pusab, Arial;
}

.level .title {
    font-size: 4rem;
    color: white;
}

.level .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.level .user .name {
    font-size: 2.5rem;
}

.level .user .tag img {
    margin-left: 10px;
    width: 24px;
    height: 24px;
}

.level .info {
    display: flex;
    margin-top: 50px;
}

.level .info .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
}

.level .info .left .difficulties-face {
    width: 100px;
    height: 100px;
}

.level .info .left .diff {
    font-size: 2rem;
}

.level .info .left .star {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    gap: 10px;
    font-size: 1.5rem;
}

.level .info .left .i2 {
    width: 24px;
}

.level .info .play {
    margin-left: 50px;
    margin-right: 50px;
    width: 256px;
    height: 256px;
}

.level .info .right {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    gap: 10px;
}

.level .info .right div {
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
}

.level .info .right img {
    width: 48px;
    height: 48px;
}

.level .spilt {
    height: 5px;
    width: 50%;
    background-color: #3333332d;
    margin-top: 50px;
    border-radius: 5px;
}

.level .music {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
}

.level .music .name {
    font-size: 2.4rem;
}

.level .music .author {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 2rem;
}

.level .music img {
    height: 40px;
}

.level .music .info {
    position: fixed;
    margin-bottom: 120px;
    margin-left: 800px;
}

.level .music .statistics {
    font-size: 1.5rem;
}

.level .music .play-music {
    position: fixed;
    margin-left: 800px;
    margin-top: 100px;

    width: 96px;
    height: 96px;
}

.level .funct {
    position: fixed;
    right: 10px;

    display: flex;
    flex-direction: column;
}

.level .funct img {
    width: 100px;
    height: 100px;
}
</style>

<style scoped>
.app-container {
    padding: 20px;
    min-height: 100vh;
}

.demo-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.demo-controls button {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.demo-controls label {
    display: flex;
    align-items: center;
    gap: 5px;
}
</style>

<style scoped>
.w32 {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 95%;
}

.w32 .title {
    font-size: 3.5rem;
    margin-top: 20px;
}

.w32 .user {
    margin-top: 10px;
}

.w32 .user .name {
    font-size: 2.8rem;
}

.w32 .info {
    position: absolute;
    right: 11%;
    width: 64px;
}

.w32 .description {
    background-color: rgb(0, 0, 0, 0.5);
    color: white;
    padding: 30px 35px;
    border-radius: 15px;
    width: 50%;
    margin-top: 20px;
    text-align: center;
    font-size: 1.5rem;
}

.w32 .sta-clas {
    color: white;
    font-size: 1.5rem;
    margin-top: auto;
}
</style>

<style scoped>
.w33 {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.w33 .window-title {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 10px;
}

.w33 .window-body {
    flex: 1;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.w33 .window-body p {
    margin: 0;
    font-size: 1.8rem;
    text-align: center;
}
</style>

<style scoped>
.w34 {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 95%;
    justify-content: center;
}
.w34 .text-apply {
    font-size: 5rem;
    color: white;
    margin-bottom: 20px;
}
.w34 .gold-text {
    font-size: 3rem;
}
.w34 button {
    margin-top: 30px;
    padding: 10px 20px;
    font-size: 2rem;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    /* background-image: url('/resource/button_bg1.png'); */
    background: none;
    font-family: Pusab, Arial;
    outline: none;
    font-size: 3rem !important;
    margin-top: auto;
}
.w34 .cls {
    font-size: 2rem;
    color: white;
    margin-top: auto;
}
</style>
