<template>
  <section>
     <el-row class="page-container border padding">
      <el-form
        :model="editForm"
        label-width="120px"
        :rules="editFormRules"
        ref="editForm"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请假类型" prop="type" style="width:80%">
              <el-select v-model="editForm.type" placeholder="请选择">
                <el-option
                  v-for="item in leaveType"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请假天数" prop="number" style="width:80%">
              <el-input v-model="editForm.number" placeholder="请假天数" maxlength="8"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请假开始时间" prop="startTime" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.startTime"
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
                v-model="editForm.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark"  style="width:90%">
              <el-input v-model="editForm.remark" placeholder="备注" type="textarea" rows="5" maxlength="255"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { editHrUserLeave } from "@/api/oa/hr/user/hrUserLeave";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserLeave", "visible"],
  watch: {
    hrUserLeave: function(hrUserLeave) {
      this.editForm = hrUserLeave;
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
      //编辑界面数据  HrUserLeave hr_user_leave
      editForm: {
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
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交HrUserLeave hr_user_leave父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editHrUserLeave(params)
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
    //在下面添加其它组件 'hr-user-leave-edit':HrUserLeaveEdit
  },
  mounted() {
    this.getOption();
    this.editForm = Object.assign(this.editForm, this.hrUserLeave);
  }
};
</script>

<style scoped>
</style>