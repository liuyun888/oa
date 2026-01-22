<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime" style="width:80%">
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
            <el-form-item label="结束时间" prop="endTime" style="width:80%">
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
          <el-col :span="12">
            <el-form-item label="公司名称" prop="companyName" style="width:80%">
              <el-input v-model="addForm.companyName" placeholder="公司名称" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="duty" style="width:80%">
              <el-input v-model="addForm.duty" placeholder="职位" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工作描述" prop="remark" style="width:90%">
              <el-input type="textarea" rows="5" v-model="addForm.remark" placeholder="工作描述" maxlength="255"  clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="离职原因" prop="dimissionCause" style="width:90%">
              <el-input
                v-model="addForm.dimissionCause"
                placeholder="离职原因"
                type="textarea"
                rows="5"
                maxlength="255"  clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
       <!-- <el-row :gutter="20">
          <el-col :span="24">
            <attachment-upload
              @on-change="onUpload"
              @on-remove="getRemoveMsg"
              :archiveId="addForm.id"
              :branchId="userInfo.branchId"
              :categoryId="categoryId"
              :limit="1"
            ></attachment-upload>
          </el-col>
        </el-row> -->
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
import { addHrUserWorked } from "@/api/oa/hr/user/hrUserWorked";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import {sn} from '@/common/js/sequence'; //id生成器
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserWorked", "visible"],
  watch: {
    hrUserWorked: function(hrUserWorked) {
      this.addForm = hrUserWorked;
    },
    visible: function(visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.setDefalueParams();
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
      //新增界面数据 hr_user_worked
      addForm: {
        id: "",
        userid: "",
        companyName: "",
        remark: "",
        startTime: "",
        endTime: "",
        dimissionCause: "",
        duty: ""
      },
      categoryId:"resume"
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
    //新增提交HrUserWorked hr_user_worked 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            let params = Object.assign({}, this.addForm);
            addHrUserWorked(params)
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
    },
    //上传文件之后回调
    onUpload(file, fileList) {
      console.log(file);
    },
    getRemoveMsg(file, fileList) {
      console.log(file);
    },
    setDefalueParams(){
      this.addForm.id = sn()
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/

    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'hr-user-worked-edit':HrUserWorkedEdit
    "attachment-upload": AttachmentUpload,
  },
  mounted() {
    this.addForm = Object.assign(this.addForm, this.hrUserWorked);
    this.setDefalueParams();
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>
</style>