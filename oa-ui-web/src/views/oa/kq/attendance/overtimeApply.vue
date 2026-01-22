<template>
  <div class="container">
    <div class="header">加班申请单</div>
    <div class="content">
      <el-form ref="addForm" :model="addForm" label-width="120px" size="mini" :rules="rules">
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
        </el-row>
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;加班信息</span>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="加班类型" prop="workOvertimeType">
              <el-select v-model="addForm.workOvertimeType" placeholder="请选择">
                <el-option
                  v-for="item in overtimeType"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加班开始时间" prop="beginTime">
              <el-date-picker
                v-model="addForm.beginTime"
                align="right"
                type="datetime"
                default-time="09:00:00"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="加班结束时间" prop="endTime">
              <el-date-picker
                v-model="addForm.endTime"
                align="right"
                type="datetime"
                default-time="19:00:00"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加班时数" prop="workOvertimeHours">
              <el-input-number
                :min="0"
                label="加班时数"
                maxlength="8"
                clearable
                v-model="addForm.workOvertimeHours"
              ></el-input-number>小时
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加班事由" prop="reasonWorkOvertime">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="addForm.reasonWorkOvertime"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row>
            <attachment-upload
              :limit="1"
              style="margin-top:20px"
              @on-change="onUpload"
              @on-remove="getRemoveMsg"
              :archiveId="addForm.id"
              :branchId="addForm.branchId"
            ></attachment-upload>
          </el-row>
          <div style="text-align: center;padding: 20px;">
            <el-button
              type="primary"
              @click="addSubmit"
              :disabled="load.add==true"
              v-loading="load.add"
            >提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree
        show-root
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        @node-click="handleLeftDeptNodeClick"
      ></dept-tree>
    </el-dialog>
  </div>
</template>
<script>
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { addKqWorkOvertimeInfo } from "@/api/oa/kq/kqWorkOvertimeInfo";
import { listKqVacationTypeUser } from "@/api/oa/kq/kqVacationTypeUser";
import { sn } from "@/common/js/sequence"; //id生成器
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { mapGetters } from "vuex";
import config from '@/common/config';
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["userid", "username", "visible"],
  watch: {
    visible: function(visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.addForm.id = sn();
        this.addForm.userid = this.userid;
        this.addForm.branchId = this.userInfo.branchId;
        this.addForm.username = this.username;
      }
    },
    "addForm.beginTime":function(){
      if(this.addForm.endTime!==""){
        var dateBegin = new Date(this.addForm.beginTime);
        var dateEnd = new Date(this.addForm.endTime);
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();
        var hours = Math.floor(dateDiff / (3600 * 1000));
        this.addForm.workOvertimeHours = hours
      }
    },
    "addForm.endTime":function(){
      if(this.addForm.beginTime!==""){
        var dateBegin = new Date(this.addForm.beginTime);
        var dateEnd = new Date(this.addForm.endTime);
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();
        var hours = Math.floor(dateDiff / (3600 * 1000));
        this.addForm.workOvertimeHours = hours
      }
    },
  },
  data() {
    return {
      addForm: {
        id: "",
        userid: "",
        username: "",
        workOvertimeType: "",
        beginTime: "",
        endTime: "",
        workOvertimeHours: "",
        reasonWorkOvertime: "",
        branchId: "",
        deptid: "",
        deptName: "",
        applyTime: "",
        accessory: "",
        bizProcInstId: "",
        bizFlowState: "",
        title: ""
      },
      vacation: [],
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "change" }
        ],
        workOvertimeType: [
          { required: true, message: "加班类型不能为空", trigger: "change" }
        ],
        beginTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "change" }
        ],
        reasonWorkOvertime:[
          { required: true, message: "加班原因不能为空", trigger: "change" }
        ],
        workOvertimeHours:[
          { required: true, message: "加班时长不能为空", trigger: "change" }
        ],
        deptName:[
          { required: true, message: "部门不能为空", trigger: "change" }
        ]
      },
      deptSelectVisible: false,
      overtimeType: []
    };
  },
  methods: {
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
    addSubmit: function() {
      let date1 = this.addForm.beginTime
      let date2 = this.addForm.endTime
      if (date1 > date2) {
        this.$message.error("开始日期不能早于结束日期");
        return;
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.add = true;
            this.addForm.bizFlowState = "0";
            let params = Object.assign({}, this.addForm);
            addKqWorkOvertimeInfo(params)
              .then(res => {
                this.load.add = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.sendToProcessApprova(res.data.data,"work_overtime_info_approva");
                  this.$refs["addForm"].resetFields();
                  this.$emit("submit"); //  @submit="afterAddSubmit"
                  this.$emit("cancel");
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
    //获取下拉列表数据
    getOption() {
      let params = [{ categoryId: "all", itemCode: "overtimeType" }];
      listOption(params).then(res => {
        // todo 直接赋值会出错 res.data可能等于[], res.data.data不存在
        // this.overtimeType = res.data.data.overtimeType;
        this.overtimeType = res.data && res.data.data && res.data.data.overtimeType ? res.data.data.overtimeType : this.overtimeType;
      });
    },
    cancel() {
      this.$refs["addForm"].resetFields();
      this.$emit("cancel");
    },

    sendToProcessApprova:function(row,bizKey){
      if(row.bizFlowState=='1'){
        this.$message.error("审核中，不允许重新发起");
        return;
      }
      let extVars={workOvertimeId:row.id}
      let jsonExtVars=JSON.stringify(extVars);

      var currDomain=window.location.protocol+"//"+window.location.host;
      var fullPath=this.$route.fullPath;
      var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars
      var titleNames=row.username
      var mainTitle=''
      var mainContext=''
      if(bizKey=='work_overtime_info_approva'){
        mainTitle='关于【'+titleNames+"加班"+row.workOvertimeHours+"小时】的审批"
        mainContext=mainTitle+',加班原因：'+row.reasonWorkOvertime+",开始日期："+row.beginTime+",结束日期："+row.endTime;
      }else{
        this.$message.error("暂不支持的业务审批");
        return;
      }
      let params={
          mainContext:mainContext,
          mainTitle:mainTitle,
          bizKey:bizKey,
          bizUrl:bizUrl,
          restUrl:config.getOaBasePath()+"/kq/kqWorkOvertimeInfo/processApprova",
          extVars:extVars,
          flowVars:{
            subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
            branchId:row.branchId,
            workOvertimeId:row.id
          },
      }
      let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
      this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}});
    }
  },
  mounted() {
    this.addForm.id = sn();
    this.addForm.userid = this.userid;
    this.addForm.branchId = this.userInfo.branchId;
    this.addForm.username = this.username;
    if(!this.userid){
      this.addForm.userid = this.userInfo.userid;
      this.addForm.username = this.userInfo.username;
      this.addForm.deptid=this.userInfo.deptid
      this.addForm.deptName=this.userInfo.deptName
    }
    this.getOption();
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
