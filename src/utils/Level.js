import LEVEL_DATA from "../data/level.json"
import { Music } from "./Music";
import { to_number } from "./utils";
// import Music from "./Music"

const _calculate_diamonds = (stars) => {
    return !stars || stars < 2 ? 0 : parseInt(stars) + 2;
};

const _getDifficultyNumber = (difficulty) => {
    if (difficulty == "Auto") return 1;
    else if (difficulty == "Easy") return 2;
    else if (difficulty == "Normal") return 3;
    else if (difficulty == "Hard") return 4;
    else if (difficulty == "Harder") return 5;
    else if (difficulty == "Insane") return 6;
    else if (difficulty == "Demon") return 7;
    else if (difficulty == "Easy Demon") return 8;
    else if (difficulty == "Middle Demon") return 9;
    else if (difficulty == "Hard Demon") return 10;
    else if (difficulty == "Insane Demon") return 11;
    else if (difficulty == "Extreme Demon") return 12;
    else return 0;
}

const _getLevelQuality = (epic, featured) => {
    if (featured) return 2;
    else if (epic) return 1;
    else return 0;
}

class Level {
    constructor(_level) {
        this.name = _level.name || "-";
        this.id = _level.id || 0;
        this.description = _level.description || "(No description provided)";
        this.author = _level.author || "-";
        this.version = _level.version || 1;
        this.difficulty = _level.difficulty || "NA";
        this.difficulty_number = _getDifficultyNumber(_level.difficulty) || 0;

        this.accountID = _level.accountID || 0;
        this.obj = _level.objects || 0;
        
        this.copy = _level.copy || false;

        this.quality = _getLevelQuality(_level.epic, _level.featured) || 0;
        
        if (_level.large)
            this.large  = _level.large || false;
        else
            this.large = (this.obj > 40000 ? true : false);

        this.rating = _level.rating || false;
        this.demon = _level.demon || false;

        this.download = +_level.downloads || 0;
        this.likes = _level.likes || 0;
        this.length = _level.length || "XL";
        this.orbs = _level.orbs || 0;

        this.stars = _level.stars || 0;
        this.moon = _level.moon || 0;
        if (_level.diamonds >= 0)
            this.diamonds = _level.diamonds;
        else 
            this.diamonds = _calculate_diamonds(_level.stars);
        this.coin = _level.coin || 0;

        this.update_time = _level.update_time || "1970/01/01";
        this.plat = _level.platformer || false;
        this.havePasswd = _level.havePasswd || false;
        this.player2mode = _level.twoPlayer || false;
        
        this.music = new Music([{
            name: _level.songName || "-",
            id: _level.songID || 0,
            author: _level.songAuthor || "-",
            size: to_number(_level.songSize) || 0,
            link: _level.songLink || "-",
        }]);

        this.content = _level;
    }
};

export default Level;