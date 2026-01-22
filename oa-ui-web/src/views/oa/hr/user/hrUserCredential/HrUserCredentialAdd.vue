<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="证书名称" prop="certificateName" style="width:80%">
              <el-input
                v-model="addForm.certificateName"
                placeholder="证书名称"
                maxlength="50"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁发日期" prop="startTime" style="width:80%">
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="失效日期" prop="endTime" style="width:80%">
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
          <el-col :span="12">
            <el-form-item label="颁发单位" prop="issueUnit" style="width:80%">
              <el-input v-model="addForm.issueUnit" placeholder="颁发单位" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <attachment-upload
              @uploadSuccess="uploadSuccess"
              @on-remove="getRemoveMsg"
              :archiveId="addForm.id"
              :branchId="userInfo.branchId"
              :categoryId="categoryId"
              :limit="1"
            ></attachment-upload>
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
import { addHrUserCredential } from "@/api/oa/hr/user/hrUserCredential";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { sn } from "@/common/js/sequence"; //id生成器
import {
  addHrUserAccessory,
  delHrUserAccessoryByWhere
} from "@/api/oa/hr/user/hrUserAccessory";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserCredential", "visible"],
  watch: {
    hrUserCredential: function(hrUserCredential) {
      this.addForm = hrUserCredential;
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
      //新增界面数据 hr_user_credential
      addForm: {
        id: "",
        userid: "",
        certificateName: "",
        startTime: "",
        endTime: "",
        issueUnit: ""
      },
      categoryId: "credential",
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      //附件
      accessory: {
        id: "",
        name: "",
        type: "",
        accessory: "",
        userid: "",
        relevanceId:""
      }
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交HrUserCredential hr_user_credential 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            let params = Object.assign({}, this.addForm);
            addHrUserCredential(params)
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
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/

    setDefalueParams() {
      this.addForm.id = sn();
    },
    //上传附件成功回调
    uploadSuccess(file) {
      this.accessory.name = file.name;
      this.accessory.type = "2";
      this.accessory.accessory = file.url;
      this.accessory.userid = this.addForm.userid;
      this.accessory.relevanceId = this.addForm.id;
      this.saveAccessoryt();
    },
    getRemoveMsg(file, fileList) {
      let params = {
        userid: this.editForm.userid,
        type: "2"
      };
      delHrUserAccessoryByWhere(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    },
    //保存上传的附件
    saveAccessoryt() {
      let params = Object.assign({}, this.accessory);
      addHrUserAccessory(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'hr-user-credential-edit':HrUserCredentialEdit
    "attachment-upload": AttachmentUpload
  },
  mounted() {
    this.addForm = Object.assign(this.addForm, this.hrUserCredential);
    this.setDefalueParams();
    /**在下面写其它函数***/
  } //end mounted
};
</script>

<style scoped>
</style>