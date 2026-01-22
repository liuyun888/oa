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
            <el-form-item label="培训名称" prop="trainName" style="width:80%">
              <el-input v-model="editForm.trainName" placeholder="培训名称" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训单位" prop="trainUnit" style="width:80%">
              <el-input v-model="editForm.trainUnit" placeholder="培训单位" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startTime" style="width:80%">
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
            <el-form-item label="结束日期" prop="endTime" style="width:80%">
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
            <el-form-item label="备注" prop="remark" style="width:90%">
              <el-input v-model="editForm.remark" rows="5" type="textarea" placeholder="描述" maxlength="255"  clearable></el-input>
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
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { editHrUserTrain } from "@/api/oa/hr/user/hrUserTrain";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserTrain", "visible"],
  watch: {
    hrUserTrain: function(hrUserTrain) {
      this.editForm = hrUserTrain;
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
      //编辑界面数据  HrUserTrain hr_user_train
      editForm: {
        id: "",
        userid: "",
        trainName: "",
        remark: "",
        startTime: "",
        endTime: "",
        trainUnit: ""
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
    //编辑提交HrUserTrain hr_user_train父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editHrUserTrain(params)
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
    //在下面添加其它组件 'hr-user-train-edit':HrUserTrainEdit
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.hrUserTrain);
  }
};
</script>

<style scoped>
</style>