<!--
    以圖示表達狀態
    type     {String}  決定icon類型，分為   "activity"  活躍度 (0:未購會員/ 0:流失會員/ 1:沉睡會員/ 2:瞌睡會員/ 3:主力會員/ 4:新會員)
                                          "member"     會員等級
                                          "level"     等級(無/低/中/高)，"無"表示目前沒有資料
    title    {String}  主標題
    value    {String}  主要數值
    status   {String}  狀態表示等級(活躍度/0-4) (會員等級/0-x) (等級/無、低、中、高)
    desc     {String}  下方註解/描述
-->
<template>
    <div class="image-status">
        <h3 v-if="type !== 'level'" class="image-status__title">{{ title }}</h3>
        <div class="image-status__value">{{ value }}</div>
        <div class="image-status__status">
            <i v-if="type !== 'level'" class="image-status__icon" :class="statusIcon()"></i>
            <span v-else class="image-status__status-text" :class="statusIcon()">{{ status }}</span>
        </div>
        <div v-if="type !== 'level'" class="image-status__desc">{{ desc }}</div>
    </div>
</template>

<script>
module.exports = {
    props: {
        type: {
            type: String,
            default: 'activity'
        },
        title: {
            type: String,
        },
        value: {
            type: String,
        },
        status: {
            type: String,
            default: '0'
        },
        desc: {
            type: String,
        },
    },
    data: function () {
        return {}
    },
    methods: {
        statusIcon() {
            let icon;
            switch (this.type) {
                // NESL活躍度
                case 'activity':
                    icon = "icon-nesl-" + this.status;
                    break;
                // NESL會員等級
                case 'member':
                    if (this.status < 2) {
                        icon = "icon-level-" + this.status;
                    } else {
                        icon = "icon-level-2";
                    }
                // NESL會員等級
                case 'level':
                    switch (this.status) {
                        case "無":
                            icon = 'image-status__status-text--empty';
                            break;
                        case "低":
                            icon = 'image-status__status-text--low';
                            break;
                        case "中":
                            icon = 'image-status__status-text--medium';
                            break;
                        case "高":
                            icon = 'image-status__status-text--high';
                    }
            }
            return icon;
        }
    }
}
</script>
