<template>
    <ul class="card-percentage">
        <li class="card-percentage__item" v-for="item in data">
            <el-card shadow="never" class="box-card" :body-style="{padding: '25px 25px 35px'}">
                <div class="card-percentage__header">
                    <h3 class="card-percentage__title">{{ item.name }}</h3>
                    <h3 class="card-percentage__rate">{{ item.rate | % }}</h3>
                </div>
                <div class="card-percentage__content">
                    <span class="card-percentage__value">{{ item.value | k }}</span>
                    <span class="card-percentage__unit">次</span>
                </div>
                <el-progress :percentage="item.rate" :show-text="false"></el-progress>
            </el-card>
        </li>
    </ul>
</template>

<script>
    module.exports = {
        props:{
            data: {
                type: Array
            },
        },
        data: function() {
            return {

            }
        }
    }
</script>
