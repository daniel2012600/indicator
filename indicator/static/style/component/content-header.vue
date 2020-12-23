<template>
    <div class="content__header" :class="{ 'content__header--fixed': isFixed}">
        <h2 class="wrap__title">
            <span>{{title}}</span>
            <el-tooltip  class="item" placement="right" effect="dark" slot="toolbar"  v-if="tooltip">
                <div slot="content">{{tooltip}}<br>{{tooltip_second_line}}</div>
                <span class="info-tooltip material-icons">info</span>
            </el-tooltip>
        </h2>
        <slot name="toolbar"></slot>
    </div>
</template>

<script>
    module.exports = {
        props:["title", "type", "tooltip", "tooltip_second_line"],
        data: function() {
            return {
                isFixed: false,
                parentPaddingTop: 0,
                headerOuterHeight: 0
            }
        },
        created() {
            window.addEventListener('scroll', this.handleScroll, true);
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll);
        },
        mounted() {
            let parentStyle = getComputedStyle(this.$el.parentNode);
            let elStyle = getComputedStyle(this.$el);
            let headerMarginTop = elStyle.marginTop;
            let headerMarginBottom = elStyle.marginBottom;
            let headerHeight = this.$el.offsetHeight;
            this.parentPaddingTop = parseInt(parentStyle.paddingTop);
            this.headerOuterHeight =  parseInt(headerMarginTop) + parseInt(headerMarginBottom) + parseInt(headerHeight)
        },
        methods: {
            handleScroll: _.debounce(function(){
                if (this.type !== 'sticky') return false;
                let scrollTop = document.querySelector(".md-app-scroller").scrollTop;
                this.isFixed = scrollTop > this.headerOuterHeight;
                this.$el.parentNode.style.paddingTop = scrollTop > this.headerOuterHeight ? this.parentPaddingTop + this.headerOuterHeight + 'px' : '';
            }, 50)
        }
    }
</script>
