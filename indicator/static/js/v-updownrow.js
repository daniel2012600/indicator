/*************************************
- 元件名:
     v-updownrow
- 描述:
       
- html:
- 屬性:

- 事件：
- 依賴:
       vue element
- 作者:
       Rolence
- 展示:
       
- 使用範例:

- 日期:
       2018-08-05 17:05
- 特別注意：
       需引入同名css
*************************************/
Vue.component("v-updownrow", {
    delimiters: ['[[', ']]'],
    style: `
       
       `,
    template1: `
<el-card  shadow="never">
      <el-row>
      <el-col :span="4" class="text-center">
       <slot name="left">
       </slot>
      </el-col>
      <el-col :span="2" class="text-center">[[middle]]</el-col>
      <el-col :span="18" class="text-center">
          <slot name="up"></slot>
          <slot syle="color:#909399" name="middle"></slot>
          <slot name="down"></slot>
      </el-col>
      </el-row>
</el-card>
       `,
       template2: `
<el-card shadow="never">
       <el-row>
              <el-col :span="24" class="text-center">
                     <slot name="left">
                     </slot>
              </el-col>
      </e-row>
       <el-row class="mt-2"> 
             
      </e-row>
</el-card>
       `,
       template: `
<el-card shadow="never">
      <el-row>
        <el-col :span="24" class="text-center">
                     <slot name="left">
                     </slot>
              </el-col>
      </el-row>
      <el-row class="mt-4">
        <el-col :span="11" class="text-center">
                     <slot name="up"></slot>
              </el-col>
              <el-col :span="2" class="text-center">
                     <slot syle="color:#909399" name="middle"></slot>
              </el-col>
              <el-col :span="11" class="text-center">
                     <slot name="down"></slot>
              </el-col>
      </el-row>
</el-card>
       `,
    props: ["middle"],
    data() {
        return {};
    },

    watch: {

    },
    methods: {

    },
    mounted: function () {
        
    }
});