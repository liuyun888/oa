<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请假类型" prop="type" style="width:80%">
              <el-select v-model="addForm.type" placeholder="请选择">
                <el-option
                  v-for="item in leaveType"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                  style="width:100%"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请假天数" prop="number" style="width:80%">
              <el-input v-model="addForm.number" placeholder="请假天数" maxlength="8"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请假开始时间" prop="startTime" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请假结束时间" prop="endTime" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" style="width:90%">
              <el-input v-model="addForm.remark" placeholder="备注" type="textarea" rows="5" maxlength="255"  clearable></el-input>
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
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { addHrUserLeave } from "@/api/oa/hr/user/hrUserLeave";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserLeave", "visible"],
  watch: {
    hrUserLeave: function(hrUserLeave) {
      this.addForm = hrUserLeave;
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
      //新增界面数据 hr_user_leave
      addForm: {
        id: "",
        userid: "",
        type: "",
        number: "",
        remark: "",
        startTime: "",
        endTime: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      leaveType: []
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    //获取下拉列表数据
    getOption() {
      let params = [{ categoryId: "all", itemCode: "leaveType" }];
      listOption(params).then(res => {
        this.leaveType = res.data.data.leaveType;
      });
    },
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交HrUserLeave hr_user_leave 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            let params = Object.assign({}, this.addForm);
            addHrUserLeave(params)
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
    //在下面添加其它组件 'hr-user-leave-edit':HrUserLeaveEdit
  },
  mounted() {
    this.getOption();
    this.addForm = Object.assign(this.addForm, this.hrUserLeave);
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>
</style>