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
            <el-form-item label="合同名称" prop="contractName" style="width:80%">
              <el-input v-model="editForm.contractName" placeholder="合同名称" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型" style="width:80%">
              <el-select v-model="editForm.contractType" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in contractType"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同状态" style="width:80%">
              <el-select v-model="editForm.contractStatus" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in contractStatus"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同开始时间" prop="startTime" style="width:80%">
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同到期时间" prop="endTime" style="width:80%">
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
          <el-col :span="12">
            <el-form-item label="合同办理时间" prop="processsingTime" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.processsingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item style="width:80%">
                <el-checkbox style="float: right;" @change="updataTime" v-model="timeCheck">合同开始、办理时间同步</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签订标识" prop="identification" style="width:80%">
              <el-radio v-model="editForm.identification" label="0">首次签订</el-radio>
              <el-radio v-model="editForm.identification" label="1">续签</el-radio>
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
        <el-row :gutter="20">
          <el-col :span="24">
            <attachment-upload
              @uploadSuccess="uploadSuccess"
              @on-remove="getRemoveMsg"
              :archiveId="editForm.id"
              :branchId="userInfo.branchId"
              :categoryId="categoryId"
              :limit="10"
            ></attachment-upload>
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
import {
  editHrUserContract,
  delHrUserAccessory
} from "@/api/oa/hr/user/hrUserContract";
import {
  addHrUserAccessory,
  delHrUserAccessoryByWhere
} from "@/api/oa/hr/user/hrUserAccessory";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserContract", "visible"],
  watch: {
    hrUserContract: function(hrUserContract) {
      this.editForm = hrUserContract;
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
      syncTime:false,
      timeCheck:false,
      //编辑界面数据  HrUserContract hr_user_contract
      editForm: {
        id: "",
        userid: "",
        contractName: "",
        startTime: "",
        endTime: "",
        contractType: "",
        contractStatus: "",
        identification: "",
        remark: "",
        processsingTime: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      contractType: [], //合同类型
      contractStatus: [], //合同状态
      categoryId: "contract",
      accessory: {
        id: "",
        name: "",
        type: "",
        relevanceId: "",
        accessory: "",
        userid: ""
      }
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  watch: {
    'editForm.startTime':{
      handler(oval,nval){
        if(this.syncTime){
          this.editForm.processsingTime = this.editForm.startTime
        }
      }
    },
    'editForm.processsingTime':{
      handler(oval,nval){
        if(this.syncTime){
          this.editForm.startTime = this.editForm.processsingTime
        }
      }
    },
    immediate: true,
    deep:true
  },
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交HrUserContract hr_user_contract父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      console.log(this.accessory);
      this.$refs.editForm.validate(valid => {

        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editHrUserContract(params)
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
      let params = [
        { categoryId: "all", itemCode: "contractType" },
        { categoryId: "all", itemCode: "contractStatus" }
      ];
      listOption(params).then(res => {
        this.contractType = res.data.data.contractType;
        this.contractStatus = res.data.data.contractStatus;
      });
    },
    //删除文件后回调
    getRemoveMsg(file, fileList) {
      this.delAccessoryt();
    },
    //上传成功后回调
    uploadSuccess(file) {
      this.accessory.name = file.name;
      this.accessory.type = "0";
      this.accessory.accessory = file.url;
      this.accessory.userid = this.editForm.userid;
      this.saveAccessoryt();
    },
    //保存上传的合同信息
    saveAccessoryt() {
      let params = Object.assign({}, this.accessory);
      params.relevanceId = this.editForm.id;
      addHrUserAccessory(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    },
    updataTime(val){
      this.syncTime = !this.syncTime;
      if(this.timeCheck){
        this.editForm.processsingTime = this.editForm.startTime
      }
    },
    //删除上传的合同信息
    delAccessoryt(){
      let params = {
        relevanceId:this.editForm.id,
        type : "0"
      }
      delHrUserAccessoryByWhere(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'hr-user-contract-edit':HrUserContractEdit
    "attachment-upload": AttachmentUpload
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.hrUserContract);
    this.getOption();
  }
};
</script>

<style scoped>
</style>
