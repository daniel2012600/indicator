<template>
    <md-list :md-expand-single="false">
        <md-list-item href="01.mainframe__index.html">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">總覽</span>
        </md-list-item>

        <md-list-item href="#">
            <md-icon>store</md-icon>
            <span class="md-list-item-text">區域門店總覽</span>
        </md-list-item>

        <md-list-item href="03.0.mainframe_member_list.html">
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">會員列表</span>
        </md-list-item>

        <!-- 預設展開範例 -->
        <md-list-item md-expand :md-expanded="true">
            <md-icon>local_offer</md-icon>
            <span class="md-list-item-text">標籤</span>
            <md-list slot="md-expand">
                <md-list-item href="04.0.mainframe_product_list.html#" class="md-inset">商品列表</md-list-item>
                <md-list-item href="04.1.mainframe_tag_list.html" class="md-inset">標籤列表</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>supervisor_account</md-icon>
            <span class="md-list-item-text">受眾</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">智慧名單</md-list-item>
                <md-list-item href="#" class="md-inset">自訂受眾</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>sms</md-icon>
            <span class="md-list-item-text">行銷管理</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">SMS簡訊行銷</md-list-item>
                <md-list-item href="#" class="md-inset">Email行銷成效報表</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>device_hub</md-icon>
            <span class="md-list-item-text">行銷自動化</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">行銷自動化列表</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>insert_chart</md-icon>
            <span class="md-list-item-text">報表</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">報表總覽</md-list-item>
                <md-list-item class="md-inset md-inset-title">業績</md-list-item>
                <md-list-item href="#" class="md-inset">業績結構圖</md-list-item>
                <md-list-item href="#" class="md-inset">總銷售額走勢</md-list-item>
                <md-list-item href="#" class="md-inset">長期銷售走勢</md-list-item>
                <md-list-item href="#" class="md-inset">熱門時段銷售佔比</md-list-item>
                <md-list-item href="#" class="md-inset">每小時銷售分析</md-list-item>
                <md-list-item href="#" class="md-inset">年度銷售報表</md-list-item>
                <md-list-item href="#" class="md-inset">付費類型走勢</md-list-item>
                <md-list-item class="md-inset md-inset-title">會員</md-list-item>
                <md-list-item href="#" class="md-inset">會員數走勢</md-list-item>
                <md-list-item href="#" class="md-inset">NESL會員走勢</md-list-item>
                <md-list-item href="#" class="md-inset">NESL會員變化走勢</md-list-item>
                <md-list-item href="#" class="md-inset">RFM會員人數分布圖</md-list-item>
                <md-list-item href="#" class="md-inset">自訂RFM會員人數分布圖</md-list-item>
                <md-list-item href="#" class="md-inset">簡易會員終生價值(LTV)分布圖</md-list-item>
                <md-list-item href="#" class="md-inset">各通路會員消費走勢</md-list-item>
                <md-list-item class="md-inset md-inset-title">商品</md-list-item>
                <md-list-item href="#" class="md-inset">熱門50商品</md-list-item>
                <md-list-item href="#" class="md-inset">關鍵商品銷售瀑布圖</md-list-item>
                <md-list-item href="#" class="md-inset">熱銷商品會員消費走勢</md-list-item>
                <md-list-item class="md-inset md-inset-title">回購</md-list-item>
                <md-list-item href="#" class="md-inset">回購佔比走勢</md-list-item>
                <md-list-item href="#" class="md-inset">回構間隔(天)佔比</md-list-item>
                <md-list-item href="#" class="md-inset">首購人數/回購人數佔比</md-list-item>
                <md-list-item class="md-inset md-inset-title">BI</md-list-item>
                <md-list-item href="#" class="md-inset">整體表現</md-list-item>
                <md-list-item href="#" class="md-inset">品類整體表現</md-list-item>
                <md-list-item href="#" class="md-inset">會員表現</md-list-item>
                <md-list-item href="#" class="md-inset">會員細分</md-list-item>
                <md-list-item href="#" class="md-inset">會員品類表現</md-list-item>
                <md-list-item href="#" class="md-inset">會員點數總表</md-list-item>
                <md-list-item href="#" class="md-inset">會員儲值金總表</md-list-item>
                <md-list-item href="#" class="md-inset">活動名單</md-list-item>
                <md-list-item href="#" class="md-inset">活動成效</md-list-item>
                <md-list-item href="#" class="md-inset">活種設定</md-list-item>
                <md-list-item href="#" class="md-inset">門店交易數、消費會員數分布地圖</md-list-item>
                <md-list-item href="#" class="md-inset">地區滲透</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>dvr</md-icon>
            <span class="md-list-item-text">監控報表</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">受眾人數走勢</md-list-item>
                <md-list-item href="#" class="md-inset">人群交易追蹤</md-list-item>
                <md-list-item href="#" class="md-inset">人群回購追蹤</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">設定</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">帳號列表</md-list-item>
                <md-list-item href="#" class="md-inset">帳號登入紀錄</md-list-item>
            </md-list>
        </md-list-item>

        <md-list-item md-expand>
            <md-icon>settings_backup_restore</md-icon>
            <span class="md-list-item-text">初始化參數</span>
            <md-list slot="md-expand">
                <md-list-item href="#" class="md-inset">清空瀏覽器報表快取</md-list-item>
            </md-list>
        </md-list-item>
    </md-list>
</template>

<script>
    module.exports = {
        data: function() {
            return {
            }
        }
    }
</script>
