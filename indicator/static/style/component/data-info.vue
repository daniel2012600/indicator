<template>
    <div class="data-info">
        <el-row class="data-info__row" type="flex">
            <el-col>
                <slot name="left"></slot>
            </el-col>
            <el-col>
                <slot name="right"></slot>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    module.exports = {
        data: function() {
            return {
            }
        }
    }
</script>
