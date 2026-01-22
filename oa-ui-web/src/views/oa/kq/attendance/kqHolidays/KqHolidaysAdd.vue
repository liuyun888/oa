<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="年号" prop="year">
          <el-date-picker
            v-model="addForm.year"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-date-picker v-model="addForm.month" type="month" placeholder="选择月" value-format="MM"
            format="MM"></el-date-picker>
        </el-form-item>

        <el-form-item label="节假日名称" prop="name">
          <el-input v-model="addForm.name" placeholder="节假日名称"></el-input>
        </el-form-item>
        <el-form-item label="放假天数" prop="number">
          <el-input-number v-model="addForm.number" :min="1" :max="10" label="放假天数"></el-input-number>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.beginDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.endDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" :offset="8">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button
              v-loading="load.add"
              type="primary"
              @click.native="addSubmit"
              :disabled="load.add==true"
            >提交</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { addKqHolidays } from "@/api/oa/kq/kqHolidays";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["kqHolidays", "visible"],
  watch: {
    kqHolidays: function(kqHolidays) {
      this.addForm = kqHolidays;
    },
    visible: function(visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    }
  },
  data() {
    return {
      options: {}, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      addFormRules: {
        id: [
          //{ required: true, message: 'id不能为空', trigger: 'change' }
        ]
      },
      //新增界面数据 kq_holidays
      addForm: {
        beginDate: "",
        year: "",
        branchId: "",
        number: "",
        id: "",
        name: "",
        endDate: "",
        month:''
      }
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/

      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交KqHolidays kq_holidays 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            this.addForm.branchId = this.userInfo.branchId;
            let params = Object.assign({}, this.addForm);

            addKqHolidays(params)
              .then(res => {
                this.load.add = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs["addForm"].resetFields();
                  this.$emit("submit"); //  @submit="afterAddSubmit"
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error"
                });
              })
              .catch(err => (this.load.add = false));
          });
        }
      });
    }
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/

    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'kq-holidays-edit':KqHolidaysEdit
  },
  mounted() {
    this.addForm = Object.assign(this.addForm, this.kqHolidays);
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>
</style>