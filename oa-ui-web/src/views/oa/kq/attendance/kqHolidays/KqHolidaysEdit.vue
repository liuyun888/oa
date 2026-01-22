<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="年号" prop="year">
          <el-date-picker v-model="editForm.year" type="year" placeholder="选择年"></el-date-picker>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-date-picker
            v-model="editForm.month"
            type="month"
            placeholder="选择月"
            value-format="MM"
            format="MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="节假日名称" prop="name">
          <el-input v-model="editForm.name" placeholder="节假日名称"></el-input>
        </el-form-item>
        <el-form-item label="放假天数" prop="number">
          <el-input-number v-model="editForm.number" :min="1" :max="10" label="放假天数"></el-input-number>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.beginDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.endDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" :offset="8">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button
              v-loading="load.edit"
              type="primary"
              @click.native="editSubmit"
              :disabled="load.edit==true"
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
import { editKqHolidays } from "@/api/oa/kq/kqHolidays";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["kqHolidays", "visible"],
  watch: {
    kqHolidays: function(kqHolidays) {
      this.editForm = kqHolidays;
    },
    visible: function(visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    }
  },
  data() {
    return {
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      editFormRules: {
        id: [
          //{ required: true, message: 'id不能为空', trigger: 'change' }
        ]
      },
      //编辑界面数据  KqHolidays kq_holidays
      editForm: {
        beginDate: "",
        year: "",
        branchId: "",
        number: "",
        id: "",
        name: "",
		endDate: "",
		month:""
      }
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/

      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交KqHolidays kq_holidays父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editKqHolidays(params)
              .then(res => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs["editForm"].resetFields();
                  this.$emit("submit"); //  @submit="afterEditSubmit"
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error"
                });
              })
              .catch(err => (this.load.edit = false));
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
    this.editForm = Object.assign(this.editForm, this.kqHolidays);
  }
};
</script>

<style scoped>
</style>