<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName" style="width:80%">
              <el-input v-model="addForm.contractName" placeholder="合同名称" maxlength="50"  clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型" style="width:80%">
              <el-select v-model="addForm.contractType" placeholder="请选择" style="width:100%">
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
              <el-select v-model="addForm.contractStatus" placeholder="请选择" style="width:100%">
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
            <el-form-item label="合同到期时间" prop="endTime" style="width:80%">
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
            <el-form-item label="合同办理时间" prop="processsingTime" style="width:80%">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.processsingTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签订标识" prop="identification" style="width:80%">
              <el-radio v-model="addForm.identification" label="0">首次签订</el-radio>
              <el-radio v-model="addForm.identification" label="1">续签</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" style="width:90%">
              <el-input v-model="addForm.remark" rows="5" placeholder="备注" type="textarea" maxlength="255"  clearable></el-input>
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
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { addHrUserContract } from "@/api/oa/hr/user/hrUserContract";
import {
  addHrUserAccessory,
  delHrUserAccessoryByWhere
} from "@/api/oa/hr/user/hrUserAccessory";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { mapGetters } from "vuex";

import { sn } from "@/common/js/sequence"; //id生成器
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["hrUserContract", "visible"],
  watch: {
    hrUserContract: function(hrUserContract) {
      this.addForm = hrUserContract;
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
      //新增界面数据 hr_user_contract
      addForm: {
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
      accessory: {
        id: "",
        name: "",
        type: "",
        accessory: "",
        userid: "",
        relevanceId:""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      contractType: [], //合同类型
      contractStatus: [], //合同状态
      branchId: "",
      categoryId: "contract"
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },
    //新增提交HrUserContract hr_user_contract 父组件监听@submit="afterAddSubmit"
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            let params = Object.assign({}, this.addForm);
            addHrUserContract(params)
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
    setDefalueParams() {
      this.addForm.id = sn();
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
      this.accessory.userid = this.addForm.userid;
      this.saveAccessoryt();
    },
    //保存上传的合同信息
    saveAccessoryt() {
      let params = Object.assign({}, this.accessory);
      params.relevanceId = this.addForm.id;
      addHrUserAccessory(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    },
    //删除上传的合同信息
    delAccessoryt(){
      let params = {
        relevanceId:this.addForm.id,
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
    this.addForm = Object.assign(this.addForm, this.hrUserContract);
    this.addForm.id = sn();
    /**在下面写其它函数***/
    this.getOption();
    this.setDefalueParams();
  } //end mounted
};
</script>

<style scoped>
</style>