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
            <el-form-item label="奖惩名称" prop="certificateName" style="width:80%">
              <el-input v-model="editForm.certificateName" placeholder="奖惩名称" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖惩日期" prop="time" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="奖惩类型" style="width:80%">
              <el-select v-model="editForm.type" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in repuType"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                  style="width:100%"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" style="width:90%">
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
import { editHrUserIncentiveInfo } from "@/api/oa/hr/user/hrUserIncentiveInfo";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserIncentiveInfo", "visible"],
  watch: {
    hrUserIncentiveInfo: function(hrUserIncentiveInfo) {
      this.editForm = hrUserIncentiveInfo;
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
      //编辑界面数据  HrUserIncentiveInfo hr_user_incentive_info
      editForm: {
        id: "",
        userid: "",
        certificateName: "",
        time: "",
        remark: "",
        type: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      repuType: [] //奖惩类型
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交HrUserIncentiveInfo hr_user_incentive_info父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editHrUserIncentiveInfo(params)
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
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    //获取下拉列表数据
    getOption() {
      let params = [{ categoryId: "all", itemCode: "repuType" }];
      listOption(params).then(res => {
        this.repuType = res.data.data.repuType;
      });
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'hr-user-incentive-info-edit':HrUserIncentiveInfoEdit
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.hrUserIncentiveInfo);
    this.getOption();
  }
};
</script>

<style scoped>
</style>