import { truncateToDecimals } from "./utils";

const NEWGROUNDS = 0;
const NCS = 1;
const YOUTUBE = 2;

class MusicObject {
    constructor(music_info) {
        this.name = music_info.name || "-";
        this.id = music_info.id || 0;
        this.author = music_info.author || "-";
        this.size = music_info.size || 0.00;
        this.from = music_info.byNewgrounds || NEWGROUNDS;
        this.sfx = music_info.sfx || false;
        this.url = music_info.link || "";
    }
}

class Music {
    constructor(musicData = []) {
        this.musicData = musicData.map(item => new MusicObject(item));
    }

    getSize() {
        return truncateToDecimals(this.musicData.reduce((total, music) => total + (music.size || 0), 0), 3);
    }

    getMusicNumber() {
        return this.musicData.filter(music => !music.sfx).length;
    }

    getSfxNumber() {
        return this.musicData.filter(music => music.sfx).length;
    }

    getAllMusic() {
        return this.musicData.filter(music => !music.sfx);
    }

    getAllSfx() {
        return this.musicData.filter(music => music.sfx);
    }

    getMusicById(id) {
        return this.musicData.find(music => music.id === id);
    }

    getMusicByName(name) {
        return this.musicData.find(music => music.name === name);
    }
}

export { NEWGROUNDS, NCS, YOUTUBE, MusicObject, Music };
