<template>
    <div>
        <Gallery :source-data="galleryData" :play-speed="4000" :auto-play="true" :show-indicators="true"
            :show-controls="true" :loop="true" height="500px" :show-title="true" :show-description="true"
            image-fit="cover" info-position="bottom" indicator-position="inside-bottom" control-position="inside"
            :show-play-button="true" :show-counter="true" :show-thumbnails="false" :progress-indicators="false"
            transition-effect="slide" :draggable="true" :pause-on-hover="true" :image-download="true"
            :enable-context-menu="true" :enable-zoom="true" :resume-after-interaction="true"
            @slide-change="onSlideChange" @image-load="onImageLoad" @image-error="onImageError"
            @play-state-change="onPlayStateChange" @context-menu-toggle="onContextMenuToggle"
            @zoom-toggle="onZoomToggle" v-model:show-indicators="localShowIndicators"
            v-model:show-controls="localShowControls" v-model:show-thumbnails="localShowThumbnails"
            v-model:show-counter="localShowCounter" v-model:show-title="localShowTitle"
            v-model:show-description="localShowDescription">
        </Gallery>

        <main>
            <div class="introduction page">
                <h1>Geometry Dash</h1>
                <div class="title-underline"></div>
                <br>
                <div class="text-box">
                    <span>Geometry Dash is a rhythm-based platforming video game developed by Robert Topala (Robert Topala,
                        known as RobTop in the game) and published by RobTop Games. The game was released on August 13,
                        2013, for iOS and Android platforms, then on June 12 of the following year for Windows Phone, and
                        subsequently on December 22 for the Steam platform. It can be played on computers (Windows, macOS)
                        and mobile devices (based on/natively on Android systems, iOS).
                    </span>
                    <span>In the game, players need to control a geometric icon to dodge obstacles in an automatically
                        scrolling level—just a tap on the screen/mouse makes the icon jump. The game also features a
                        platform jumping mode, where players can use the left, right, and up keys to control the geometric
                        icon to walk and jump around the map.
                    </span>
                    <span>
                        The game includes 26 main levels (24 auto-scrolling levels and 4 platform jumping levels). While
                        players don't need to complete one level to unlock the next, each level gradually increases in
                        difficulty. These levels range from Easy to Insane, with some even being Demon levels.
                    </span>
                </div>
            </div>
        </main>

        <footer>
            <span>© 2026 Geometry Dash.org All rights reserved.</span>
            <a href="/about" class="link">About Geometry Dash.org</a>
        </footer>
    </div>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

main .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    min-width: 80vw;
}

main .title-text {
    color: var(--text-primary);
}

main .title-underline {
    width: 100px;
    height: 4px;
    background: var(--theme-primary);
    margin: 0 auto;
    border-radius: 2px;
}

main .introduction span {
    margin-top: 20px;
    color: var(--text-secondary);
    max-width: 1200px;
}

footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-top: 1px solid var(--header-border);
    margin-top: 2rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

footer a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

footer a:hover {
    color: var(--theme-hover);
    text-shadow: 0 0 10px var(--theme-glow);
}
</style>

<script setup>
import { ref } from 'vue'
import Gallery from '../../components/Gallery.vue'

// Gallery data
const galleryData = [
    {
        id: 1,
        imgSrc: '/resource/image/geometrydash.jpg',
        altText: 'Geometry Dash Wallpaper',
        title: 'Geometry Dash',
        description: 'A video game developed by RobTop.'
    },
    {
        id: 2,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/99384559',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 3,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/116285414',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 4,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/58246921',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 5,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/116284799',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 6,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/116285255',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 7,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/106517747',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    },
    {
        id: 8,
        imgSrc: 'https://levelthumbs.prevter.me/thumbnail/97493518',
        altText: 'Geometry Dash',
        title: 'Geometry Dash',
        description: 'A greate game of RobTop Games.'
    }
]
</script>