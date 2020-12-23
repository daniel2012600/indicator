<template>
    <el-card shadow="never" class="box-card tool-bar" :body-style="bodyStyle">
        <el-form :inline="true" :size="size">
            <el-row class="tool-bar__row" type="flex">
                <el-form-item>
                    <slot name="left"></slot>
                </el-form-item>
                <el-form-item>
                    <slot name="right"></slot>
                </el-form-item>
            </el-row>
        </el-form>
    </el-card>
</template>

<script>
    module.exports = {
        props:{
            bodyStyle: {
                type: Object,
                default: function () {
                    return { padding: '14px' };
                }
            },
            size: {
                type: String,
                default: "medium"
            }
        },
        data: function() {
            return {
            }
        }
    }
</script>
