<template>
  <div class="container">
    <div class="header">员工请假申请</div>
    <div class="content">
      <el-form ref="addForm" :model="addForm" label-width="150px" size="mini" :rules="rules">
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;基本信息</span>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="部门" prop="deptName">
               <el-input v-model="addForm.deptName" suffix-icon="el-icon-search" @focus="deptSelectVisible = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度">
              <el-radio v-model="addForm.emergencyDegree" label="0">正常</el-radio>
              <el-radio v-model="addForm.emergencyDegree" label="1">重要</el-radio>
              <el-radio v-model="addForm.emergencyDegree" label="2">紧急</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;请假信息</span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="请假类型" prop="vacationId">
                <el-select v-model="addForm.vacationId" placeholder="请选择" @change="onVacationIdChange">
                  <el-option
                    v-for="item in kqVacationTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="总时长" prop="vacationHours">
              <el-input-number v-model="addForm.vacationHours" :min="0" :step="0.5"></el-input-number>小时
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="beginDate">
            <el-date-picker
              v-model="addForm.beginDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="8:30:00">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
            <el-date-picker
              v-model="addForm.endDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="18:00:00">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请假原因" prop="reason">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="addForm.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row>
            <attachment-upload :limit="1" style="margin-top:20px" @on-change="onUpload" @on-remove="getRemoveMsg"
              :archiveId="addForm.id" :branchId="addForm.branchId"></attachment-upload>
          </el-row>
          <el-row :gutter="20" style="margin-top:20px">
            <div class="info">
              <span>|&nbsp;&nbsp;请假说明</span>
            </div>
          </el-row>
          <el-row style="margin-bottom:20px">
            <span class="explain">
              员工因临时或突发情况无法到岗，未能提前请病假或事假的，则应用电话通知直接上级批准后，短信通知人事行政部，说明请假事由，并在上班后第一时间补办请假手续，如在2个工作日内未提交请假流程，超过2个工作日补流程无效，均视为旷工，扣除当日双倍工资。混合假期不得连续超过15天，两次请长假之间的间隔期不得低于一个月
              <br />1、年假：工作满一年以上每年可享受带薪年假，当年的年假使用期至次年10月31日止；未经用人单位批准，员工不得自行休假。
              <br />2、事假：按照平均工作日扣发薪资（包含工资及各类补贴福利）；单次事假原则上不应超过3天。
              <br />3、病假：两天及以上病假必须持工作地二级甲等以上医院相关病假证明单或就医记录证明，否则无法享受病假工资；单次病假超过5天，应当持有工作所在地三级甲等医院提供的病假证明单。
              <br />4、婚假：婚假为十天自然日，包含国家规定3天及增加的7天，增加的婚假7天遇法定节假日可顺延，最多不得超过13天，请婚假必须持结婚证明，结婚证必须在泛微工作期间领取，且婚假必须在一年内使用完毕，不得分次休假，国家或地方政府有其他规定的按照当地要求执行；
              <br />5、产假及哺乳假：按国家及地方法律法规执行，包含休息日与法定节假日，生育假遇法定节假日可顺延；
              <br />6、陪产假：泛微正式男性员工在工作期间配偶生育的，可凭子女出生证明，享受十个自然日陪产假。
              <br />7、丧假：直系亲属：配偶、子女、父母可享受三天，岳父母、祖父母、外祖父母可享受一天
              <br />
            </span>
          </el-row>
          <div style="text-align: center; padding: 20px;">
            <el-button type="primary" @click="addSubmit" :disabled="load.add==true" v-loading="load.add">提交</el-button>
          </div>

        </el-row>
      </el-form>
    </div>
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree show-root default-expand-all show-checkbox :expand-on-click-node="false"
        @node-click="handleLeftDeptNodeClick"></dept-tree>
    </el-dialog>
  </div>
</template>
<script>
  import util from "@/common/js/util"; //全局公共库
  import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
  import {
    addKqEmpVacationInfo
  } from "@/api/oa/kq/kqEmpVacationInfo";
  import {
    listKqVacationType
  } from "@/api/oa/kq/kqVacationType";
  import {
    listKqVacationTypeUser
  } from "@/api/oa/kq/kqVacationTypeUser";
  import {
    sn
  } from "@/common/js/sequence"; //id生成器
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
  import {
    mapGetters
  } from "vuex";
  import config from '@/common/config'
  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    props: ["userid", "username"],
    watch:{
      'addForm.beginDate':function(){
        if(this.addForm.endDate){
          var diffHours=util.timeDifference(this.addForm.beginDate,this.addForm.endDate)/60
          this.addForm.number=diffHours;
        }
      },
      'addForm.endDate':function(){
        if(this.addForm.beginDate){
          var diffHours=util.timeDifference(this.addForm.beginDate,this.addForm.endDate)/60
          this.addForm.number=diffHours;
        }
      }
    },
    data() {
      return {
        addForm: {
          id: "",
          userid: "",
          username: "",
          deptid: "",
          deptName: "",
          vacationId: "",
          vacationType: "",
          vacationName: "",
          beginDate: util.formatDate.format(new Date(),'yyyy-MM-dd')+' 08:30:00',
          endDate: util.formatDate.format(new Date(),'yyyy-MM-dd')+' 18:30:00',
          reason: "",
          branchId: "",
          beginTime: '',
          endTime: '',
          emergencyDegree: "0",
          dutyDescription: "",
          vacationHours: 8,
          title: "",
          accessory: ""
        },
        kqVacationTypes: [],
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        rules: {
          username: [{
            required: true,
            message: "姓名不能为空",
            trigger: "change"
          }],
          vacationId: [{
            required: true,
            message: "请假类型不能为空",
            trigger: "change"
          }],
          beginDate: [{
            required: true,
            message: "起始日期不能为空",
            trigger: "change"
          }],
          endDate: [{
            required: true,
            message: "结束日期不能为空",
            trigger: "change"
          }],

          vacationHours: [{
            required: true,
            message: "请假时长不能为空",
            trigger: "change"
          }],
          reason:[
            {
              required: true,
              message: "请假原因不能为空",
              trigger: "change"
            }
          ]
        },
        deptSelectVisible: false,
        perHoliday: {},
        remainingHoliday: "",
        leaveInfo: "",
      };
    },
    methods: {
      addSubmit: function() {
        let date1 = new Date(this.addForm.beginDate);
        let date2 = new Date(this.addForm.endDate);
        if (date1 > date2) {
          this.$message.error("开始日期不能早于结束日期");
          return;
        }
        this.$refs.addForm.validate(valid => {
          if (valid) {
            // if (this.remainingHoliday == 0) {
            //   this.$message({
            //     message: "当前假期余额为0，无法发起请假申请！",
            //     type: "error"
            //   });
            //   return;
            // }
            // if (this.addForm.number > this.remainingHoliday) {
            //   this.$message({
            //     message: "本次所请假期大于可请时长，请修改请假时间！",
            //     type: "error"
            //   });
            //   return;
            // }
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.load.add = true;
              let params = Object.assign({}, this.addForm);
              addKqEmpVacationInfo(params)
                .then(res => {
                  this.load.add = false;
                  var tips = res.data.tips;
                  if (tips.isOk) {
                    this.$refs["addForm"].resetFields();
                    this.leaveInfo = "";
                    this.$emit("submit"); //  @submit="afterAddSubmit"
                    this.sendToProcessApprova(res.data.data, "employee_vacation_info_approva");
                  }
                  this.$message({
                    message: tips.msg,
                    type: tips.isOk ? "success" : "error"
                  });
                })
                .catch(err => (this.load.add = false));
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      //上传文件回调
      onUpload(file, fileList) {
        this.addForm.accessory = file.url;
      },
      //删除文件时回调
      getRemoveMsg(file, fileList) {
        this.addForm.accessory = "";
      },
      handleLeftDeptNodeClick(data, node, comp) {
        this.addForm.deptid = data.deptid;
        this.addForm.deptName = data.deptName;
        this.deptSelectVisible = false;
      },
      //查询请假类型
      getKqVacationType() {
        let params = {
          branchId: this.userInfo.branchId
        };
        listKqVacationType(params).then(res => {
          let tips = res.data.tips;
          if (tips.isOk) {
            let data = res.data.data;
            this.kqVacationTypes=data;
          }
        });
      },
      //取消
      cancel() {
        this.$refs["addForm"].resetFields();
        this.leaveInfo = "";
        this.$emit("cancel");
      },
      sendToProcessApprova: function(row, bizKey) {
        let extVars = {
          empVacationId: row.id
        }
        let jsonExtVars = JSON.stringify(extVars);

        var currDomain = window.location.protocol + "//" + window.location.host;
        var fullPath = this.$route.fullPath;
        var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath +
          '?extVars=' + jsonExtVars

        var titleNames = row.username
        var mainTitle = ''
        var mainContext = ''
        if (bizKey == 'employee_vacation_info_approva') {
          mainTitle = '关于【' + titleNames + "请假" + row.vacationHours + "小时】的审批"
          mainContext = mainTitle + ',请假原因：' + row.reason + ",开始日期：" + row.beginDate + ",结束日期：" + row.endDate;
        } else {
          this.$message.error("暂不支持的业务审批");
          return;
        }

        let params = {
          mainContext: mainContext,
          mainTitle: mainTitle,
          bizKey: bizKey,
          bizUrl: bizUrl,
          restUrl: config.getOaBasePath() + "/kq/kqEmpVacationInfo/processApprova",
          extVars: extVars,
          flowVars: {
            subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
            branchId: row.branchId,
            empVacationId: row.id,
            leaveHours:parseFloat(row.vacationHours),
          },
        }
        let jsonParmas = encodeURIComponent(JSON.stringify(params)); //对方要 decodeURIComponent
        this.$router.push({
          path: '/mdp/workflow/re/procdef/ProcdefListForBizStart',
          query: {
            params: jsonParmas
          }
        });
      },

      onVacationIdChange(val){
        var type=this.kqVacationTypes.find(i=>i.id==val)
        this.addForm.vacationType=type.vacationType
        this.addForm.vacationName=type.name

      }
    },
    mounted() {
      this.addForm.id = sn();
      this.addForm.branchId = this.userInfo.branchId;
      this.addForm.username = this.username;
      if(!this.userid){
        this.addForm.userid = this.userInfo.userid;
        this.addForm.username = this.userInfo.username;
        this.addForm.deptid=this.userInfo.deptid
        this.addForm.deptName=this.userInfo.deptName
      }
      this.getKqVacationType();
    },
    components: {
      "attachment-upload": AttachmentUpload,
      "dept-tree": DeptTree
    }
  };
</script>
<style scoped>
  .header {
    color: #374d58;
    font-size: 18pt;
    font-family: Microsoft YaHei;
    text-align: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #dadcde;
    padding: 20px;
  }

  .content {
    padding: 20px;
  }

  .info {
    height: 40px;
    background: #f6f6f6 !important;
    vertical-align: middle;
    word-break: break-all;
    word-wrap: break-word;
    word-break: break-word;
    text-align: left;
    padding-left: 4px;
    line-height: 40px;
    margin-bottom: 20px;
  }

  .explain {
    color: black;
    font-size: 9pt;
    font-family: Microsoft YaHei;
  }
</style>
