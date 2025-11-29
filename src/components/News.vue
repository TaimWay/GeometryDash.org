<template>
    <div class="gd-news-component" :class="{ compact }">
        <div class="news-header" v-if="showHeader">
            <h2 class="news-title">{{ title }}</h2>
            <div class="title-underline"></div>
            <p class="last-updated" v-if="lastUpdated">Last updated: {{ formatDate(lastUpdated) }}</p>
        </div>

        <div class="news-container">
            <div v-for="section in newsData.sections" :key="section.id" class="news-section"
                :class="`priority-${section.priority}`">
                <h3 class="section-title">
                    <span class="section-icon">{{ section.icon }}</span>
                    {{ section.title }}
                </h3>
                <div class="news-grid" :class="`columns-${section.columns || 3}`">
                    <div v-for="item in section.items" :key="item.id" class="news-card" :class="item.type">
                        <div class="news-tag" :class="item.tag">{{ getTagText(item.tag) }}</div>
                        <h4 class="news-item-title">{{ item.title }}</h4>
                        <div class="news-date" v-if="item.date">{{ item.date }}</div>
                        <p class="news-content">{{ item.content }}</p>
                        <div class="news-highlights" v-if="item.highlights && item.highlights.length">
                            <span v-for="(highlight, idx) in item.highlights" :key="idx" class="highlight">{{ highlight
                                }}</span>
                        </div>
                        <div class="news-actions" v-if="item.actions && item.actions.length">
                            <button v-for="(action, idx) in item.actions" :key="idx" class="action-btn"
                                :class="action.type" @click="handleAction(action)">
                                {{ action.text }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GeometryDashNews',
    props: {
        newsData: {
            type: Object,
            required: true,
            default: () => ({})
        },
        title: {
            type: String,
            default: 'Geometry Dash 新闻'
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        lastUpdated: {
            type: [String, Date],
            default: null
        },
        compact: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tagTexts: {
                'update': 'Update',
                'artist': 'Artist',
                'awards': 'Awards',
                'contest': 'Contest',
                'event': 'Event',
                'trending': 'Trending',
                'viral': 'Viral',
                'community': 'Community'
            }
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        },
        getTagText(tag) {
            return this.tagTexts[tag] || tag;
        },
        handleAction(action) {
            if (action.url) {
                window.open(action.url, '_blank');
            }
            this.$emit('action-triggered', action);
        }
    },
    emits: ['action-triggered']
}
</script>

<style scoped>
.gd-news-component {
    width: 100%;
    color: var(--text-primary);
}

.news-header {
    text-align: center;
    margin-bottom: 30px;
}

.news-title {
    color: var(--text-primary);
    font-size: 2rem;
    margin-bottom: 10px;
}

.title-underline {
    width: 100px;
    height: 4px;
    background: var(--theme-primary);
    margin: 0 auto 15px;
    border-radius: 2px;
}

.last-updated {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.news-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.news-section {
    background: var(--ui-glasscard-bg);
    border: 1px solid var(--ui-glasscard-border);
    border-radius: 10px;
    padding: 25px;
    box-shadow: var(--ui-glasscard-shadow);
    transition: box-shadow 0.3s ease;
    border-left: 4px solid var(--theme-primary);
}

.news-section:hover {
    box-shadow: var(--ui-glasscard-shadow-hover);
}

.news-section.priority-high {
    border-left-color: var(--theme-primary);
}

.news-section.priority-medium {
    border-left-color: var(--theme-glow);
}

.section-title {
    color: var(--text-primary);
    font-size: 1.5rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-icon {
    font-size: 1.3rem;
}

.news-grid {
    display: grid;
    gap: 20px;
}

.news-grid.columns-1 {
    grid-template-columns: 1fr;
}

.news-grid.columns-2 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.news-grid.columns-3 {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.news-grid.columns-4 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.news-card {
    background: var(--header-bg);
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--header-border);
    box-shadow: var(--ui-glasscard-shadow);
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--ui-glasscard-shadow-hover);
    border-color: var(--theme-glow);
}

.news-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    margin-bottom: 12px;
    text-transform: uppercase;
    color: white;
    background: var(--theme-primary);
}

.news-tag.update {
    background: var(--theme-primary);
    filter: brightness(0.9);
}

.news-tag.artist {
    background: var(--theme-glow);
}

.news-tag.awards {
    background: var(--theme-primary);
    filter: hue-rotate(30deg);
}

.news-tag.contest {
    background: var(--theme-primary);
    filter: hue-rotate(60deg) brightness(1.2);
}

.news-tag.event {
    background: var(--theme-primary);
    filter: hue-rotate(120deg) brightness(1.1);
}

.news-tag.trending {
    background: var(--theme-primary);
    filter: hue-rotate(180deg);
}

.news-tag.viral {
    background: var(--theme-primary);
    filter: hue-rotate(240deg);
}

.news-tag.community {
    background: var(--theme-primary);
    filter: hue-rotate(300deg) brightness(1.1);
}

.news-item-title {
    color: var(--text-primary);
    font-size: 1.2rem;
    margin-bottom: 8px;
    line-height: 1.4;
}

.news-date {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-bottom: 12px;
}

.news-content {
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 15px;
}

.news-highlights {
    margin-bottom: 15px;
}

.highlight {
    display: inline-block;
    background: rgba(255, 0, 0, 0.1);
    color: var(--theme-primary);
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 5px;
    font-size: 0.85rem;
    font-weight: bold;
    border: 1px solid rgba(255, 0, 0, 0.2);
}

.news-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--theme-primary);
    color: white;
}

.action-btn:hover {
    background: var(--theme-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
}

.action-btn.secondary {
    background: transparent;
    color: var(--theme-primary);
    border: 1px solid var(--theme-primary);
}

.action-btn.secondary:hover {
    background: rgba(255, 0, 0, 0.1);
}

.gd-news-component.compact .news-section {
    padding: 15px;
}

.gd-news-component.compact .news-card {
    padding: 15px;
}

.gd-news-component.compact .news-grid {
    gap: 15px;
}

.gd-news-component.compact .section-title {
    font-size: 1.3rem;
    margin-bottom: 15px;
}

@media (max-width: 768px) {

    .news-grid.columns-2,
    .news-grid.columns-3,
    .news-grid.columns-4 {
        grid-template-columns: 1fr;
    }

    .news-section {
        padding: 20px 15px;
    }

    .news-title {
        font-size: 1.7rem;
    }

    .section-title {
        font-size: 1.3rem;
    }
}
</style>