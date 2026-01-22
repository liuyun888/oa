<template>
  <section>
     <el-row class="page-container border padding">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="印章标识码" prop="signetSn">
          <el-input v-model="addForm.signetSn" placeholder="印章标识码" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="印章设备" prop="deviceId">
          <el-select v-model="addForm.deviceId" placeholder="请选择" style="width:70%">
            <el-option v-for="device in devices" :key="device.id" :label="device.deviceName" :value="device.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="印章类型" prop="signetType">
          <el-radio v-model="addForm.signetType" label="0">公章</el-radio>
          <el-radio v-model="addForm.signetType" label="1">法人代表章</el-radio>
        </el-form-item>
        <el-form-item label="印章简称" prop="signetSimpleName">
          <el-input v-model="addForm.signetSimpleName" placeholder="印章简称" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="印章全称" prop="signetName">
          <el-input v-model="addForm.signetName" placeholder="印章全称" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="章面信息" prop="signetContext">
          <el-input v-model="addForm.signetContext" placeholder="章面信息" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="印章状态" prop="signetStatus">
          <el-radio v-model="addForm.signetStatus" label="0">启用</el-radio>
          <el-radio v-model="addForm.signetStatus" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="印章形态" prop="signetForm">
          <el-radio v-model="addForm.signetForm" label="0">电子印章</el-radio>
          <el-radio v-model="addForm.signetForm" label="1">物理印章</el-radio>
        </el-form-item>
        <el-form-item>
          <el-col>
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交
            </el-button>
            <el-button @click.native="handleCancel">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    addSigSignet
  } from "@/api/oa/sig/sigSignet";
  import {
    mapGetters
  } from "vuex";
  import {
    listSigDevice
  } from "@/api/oa/sig/sigDevice";
  import {
    sn
  } from "@/common/js/sequence"; //id生成器
  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    props: ["sigSignet", "visible"],
    watch: {
      sigSignet: function(sigSignet) {
        this.addForm = sigSignet;
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
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        addFormRules: {
          id: [
            //{ required: true, message: '印章主键不能为空', trigger: 'change' }
          ]
        },
        //新增界面数据 sig_signet
        addForm: {
          id: "",
          signetSn: "",
          deviceId: "",
          signetType: "",
          signetSimpleName: "",
          signetName: "",
          keepRecordId: "",
          signetContext: "",
          signetStatus: "",
          signetBranchId: "",
          signetBranchName: "",
          bizFlowState: "",
          bizProcInstId: "",
          signetForm: ""
        },
        devices: [], //设备集合
        deviceName: "",
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/

        /**end 在上面加自定义属性**/
      }; //end return
    }, //end data
    created() {
      this.getAllDevice();
    },
    methods: {
      // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
      handleCancel: function() {
        this.$refs["addForm"].resetFields();
        this.$emit("cancel");
      },
      //新增提交SigSignet sig_signet 父组件监听@submit="afterAddSubmit"
      addSubmit: function() {
        if (this.addForm.signetSn == "") {
          this.$message.error('印章标识码不能为空');
          return;
        }
        if (this.addForm.deviceId == "") {
          this.$message.error('请选择印章设备');
          return;
        }
        if (this.addForm.signetSimpleName == "") {
          this.$message.error('印章简称不能为空');
          return;
        }
        if (this.addForm.signetName == "") {
          this.$message.error('印章全称不能为空');
          return;
        }
        if (this.addForm.signetContext == "") {
          this.$message.error('章面信息不能为空');
          return;
        }
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addForm.keepRecordId = sn()
              this.load.add = true;
              this.devices.forEach(device => {
                if (device.id == this.addForm.deviceId) {
                  this.addForm.signetBranchId = device.branchId;
                  this.addForm.signetBranchName = device.branchName;
                }
              })
              let params = Object.assign({}, this.addForm);
              console.log(JSON.stringify(params));
              addSigSignet(params)
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
      //查询印章设备
      getAllDevice() {
        listSigDevice().then(res => {
          if (res.data.tips.isOk) {
            this.devices = res.data.data;
          }
        });
      },
      //选中的设备
      selecrAdvice(advice) {
        console.log(JSON.stringify(advice))
        //this.addForm.deviceId = advice.id;
        this.addForm.signetBranchId = advice.branchId;
        this.addForm.signetBranchName = advice.branchName
      },
      /**end 在上面加自定义方法**/
    }, //end method
    components: {
      //在下面添加其它组件 'sig-signet-edit':SigSignetEdit
    },
    mounted() {
      this.addForm = Object.assign(this.addForm, this.sigSignet);
      /**在下面写其它函数***/
    } //end mounted
  };
</script>

<style scoped>
</style>
