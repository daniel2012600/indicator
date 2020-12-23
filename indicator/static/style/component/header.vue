<template>
    <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
            <!-- 選單按鈕 -->
            <md-button class="md-icon-button" @click="updateValue(!menuVisible)">
                <md-icon>menu</md-icon>
            </md-button>
            <!-- 標題 -->
            <span class="md-title">
                            <a href="#">
                                <img class="logo-s" src="style/images/logo_cdp.svg" alt="EagleeyeCDP">
                            </a>
                        </span>
        </div>
        <div class="md-toolbar-section-end">
            <!-- 會員下拉選單 -->
            <el-popover
                    popper-class="md-toolbar-user-menu"
                    :visible-arrow="false"
                    placement="bottom"
                    width="220">
                <div class="user-menu">
                    <div class="user-menu__content">
                        <p class="text__row">
                            <span class="text__col text__col--title">帳號：</span>
                            <span class="text__col">Mars@reddoor.com.tw</span>
                        </p>
                        <p class="text__row">
                            <span class="text-col text__col--title">企業：</span>
                            <span class="text-col">Beutii</span>
                        </p>
                    </div>
                    <md-button class="md-raised md-primary user-menu__button">登出</md-button>
                </div>
                <!-- 會員下拉選單按鈕 -->
                <md-button class="md-icon-button" slot="reference">
                    <md-icon>person</md-icon>
                </md-button>
            </el-popover>
        </div>
    </div>
</template>

<script>
    module.exports = {
        props: ["visible"],
        data: function() {
            return {
                menuVisible: this.visible
            }
        },
        methods: {
            updateValue: function (value) {
                this.menuVisible = !this.menuVisible
                this.$emit('menutoggle', value);
            }
        },
        watch: {
            visible: function(newVal) {
                this.menuVisible = newVal;
            }
        }
    }
</script>
