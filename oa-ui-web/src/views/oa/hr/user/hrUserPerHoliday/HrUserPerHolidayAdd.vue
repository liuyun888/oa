<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年份" prop="year" style="width:60%">
              <el-date-picker v-model="addForm.year" type="year" placeholder="选择年" style="width:100%" maxlength="8"  clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余带薪年假" prop="annualLeave">
              <el-input-number v-model="addForm.annualLeave"  :min="num"  label="剩余带薪年假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余调休假期" prop="paidLeave">
              <el-input-number v-model="addForm.paidLeave"  :min="num"  label="剩余调休假期" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余带薪病假" prop="paidSickLeave">
              <el-input-number v-model="addForm.paidSickLeave"  :min="num"  label="剩余带薪病假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余调休假" prop="leaveInLieu">
              <el-input-number v-model="addForm.leaveInLieu"  :min="num"  label="剩余调休假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余婚假" prop="marriageLeave">
              <el-input-number v-model="addForm.marriageLeave" :min="num"  label="剩余婚假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余年假" prop="annualVacation">
              <el-input-number v-model="addForm.annualVacation"  :min="num"  label="剩余年假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余病假" prop="sickLeave">
              <el-input-number v-model="addForm.sickLeave"  :min="num"  label="剩余病假" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="剩余总天数" prop="totalDays" >
              <el-input-number v-model="addForm.totalDays"  :min="num"  :disabled="true" label="剩余总天数" maxlength="8"  clearable></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

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
import { addHrUserPerHoliday } from "@/api/oa/hr/user/hrUserPerHoliday";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserPerHoliday", "visible"],
  watch: {
    hrUserPerHoliday: function(hrUserPerHoliday) {
      this.addForm = hrUserPerHoliday;
    },
    visible: function(visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    },
    "addForm.annualLeave"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.paidLeave"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.paidSickLeave"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.leaveInLieu"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.marriageLeave"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.annualVacation"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
      }
    },
    "addForm.sickLeave"() {
      this.addForm.totalDays = 0;

      if (this.addForm.annualLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualLeave);
      }
      if (this.addForm.paidLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidLeave);
      }
      if (this.addForm.paidSickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.paidSickLeave);
      }
      if (this.addForm.leaveInLieu != "") {
        this.addForm.totalDays += parseInt(this.addForm.leaveInLieu);
      }
      if (this.addForm.marriageLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.marriageLeave);
      }
      if (this.addForm.annualVacation != "") {
        this.addForm.totalDays += parseInt(this.addForm.annualVacation);
      }
      if (this.addForm.sickLeave != "") {
        this.addForm.totalDays += parseInt(this.addForm.sickLeave);
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
      //新增界面数据 hr_user_per_holiday
      addForm: {
        id: "",
        userid: "",
        year: "",
        annualLeave: "",
        paidLeave: "",
        paidSickLeave: "",
        leaveInLieu: "",
        marriageLeave: "",
        annualVacation: "",
        sickLeave: "",
        totalDays: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      num:0
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交HrUserPerHoliday hr_user_per_holiday 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            let params = Object.assign({}, this.addForm);
            addHrUserPerHoliday(params)
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
    //在下面添加其它组件 'hr-user-per-holiday-edit':HrUserPerHolidayEdit
  },

  mounted() {
    this.addForm = Object.assign(this.addForm, this.hrUserPerHoliday);
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>
</style>