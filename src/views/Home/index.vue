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
                    difficulty. These levels range from Easy (easy) to Insane (insane), with some even being Demon
                    (demon) levels.
                </span>
            </div>
            <div class="news page">
                    <News :news-data="newsJsonData" title="Geometry News" :last-updated="lastUpdateTime"
                        @action-triggered="handleNewsAction"></News>
            </div>
        </main>
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
}
</style>

<script setup>
import { ref } from 'vue'
import Gallery from '../../components/Gallery.vue'
import News from '../../components/News.vue'

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

<script>
import GeometryDashNews from '../../components/News.vue'

export default {
    components: {
        GeometryDashNews
    },
    data() {
        return {
            lastUpdateTime: new Date('2025-11-30'),
            newsJsonData: {
                sections: [
                    {
                        id: 1,
                        title: "Major Update and Release",
                        icon: "🚀",
                        priority: "high",
                        columns: 3,
                        items: [
                            {
                                id: 1,
                                type: "update",
                                tag: "update",
                                title: "Game Update 2.207",
                                date: "Published on: November 16, 2025",
                                content: "RobTop Games has released the latest game update version 2.207, bringing new features and improvements to the game.",
                                highlights: ["New Feature", "Performance Optimization"]
                            },
                            {
                                id: 2,
                                type: "artist",
                                tag: "artist",
                                title: "New Official Artist: TOKYO MACHINE + CHOMPO",
                                date: "Published on: November 29, 2025",
                                content: "The 11th official artist has been revealed, with music from TOKYO MACHINE + CHOMPO to be added to the official tracklist.",
                                highlights: ["New music", "Tracklist expansion"]
                            },
                            {
                                id: 3,
                                type: "awards",
                                tag: "awards",
                                title: "Geometry Dash 2024 Award Winners",
                                date: "Published on: November 16, 2025",
                                content: "The winners of the 2024 Geometry Dash awards have been announced, celebrating the best creators and content in the community."
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: "Official Competitions and Events",
                        icon: "🏆",
                        priority: "medium",
                        columns: 2,
                        items: [
                            {
                                id: 4,
                                type: "contest",
                                tag: "contest",
                                title: "Geometry Dash Random Challenge",
                                date: "Published on: November 22, 2025",
                                content: "A new official competition has been announced, challenging creators to design levels for random challenges."
                            },
                            {
                                id: 5,
                                type: "contest",
                                tag: "contest",
                                title: "Space Challenge Winner",
                                date: "Published on: November 16, 2025",
                                content: "The winner of the Space Challenge has been announced, showcasing the best space-themed community level.",
                            }
                        ]
                    },
                    {
                        id: 3,
                        title: "Community Hotspots",
                        icon: "💬",
                        priority: "normal",
                        columns: 2,
                        items: [
                            {
                                id: 6,
                                type: "trending",
                                tag: "trending",
                                title: "AI-Generated Fake Game Videos",
                                content: "The community is discussing the rise of realistic but fake Geometry Dash game videos created using AI-generated content.",
                                highlights: ["AI Generated", "Fake Content"]
                            },
                            {
                                id: 7,
                                type: "viral",
                                tag: "viral",
                                title: "Extremely High Difficulty Platform Level",
                                content: "A new community-made platform level has gained attention due to its extremely high difficulty, with some claiming it might take 27 years to complete.",
                                highlights: ["Extremely High Difficulty", "27 Years to Complete"]
                            }
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        handleNewsAction(action) {
            console.log('新闻操作触发:', action);
            // 处理自定义操作
        }
    }
}
</script>