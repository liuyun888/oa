<template>
  <section>
    <el-row class="page-container border padding">
      <div class="header">加班申请单</div>
      <!--编辑界面 KqWorkOvertimeInfo kq_work_overtime_info-->
      <el-form
        :model="editForm"
        label-width="120px"
        :rules="editFormRules"
        ref="editForm"
        size="mini"
      >
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;基本信息</span>
          </div>
        </el-row>
        <el-row :gutter="20"> 
          <el-col :span="12">
            <el-form-item label="申请人" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="部门" prop="deptName">
               <el-input v-model="editForm.deptName" suffix-icon="el-icon-search" @focus="deptSelectVisible = true"></el-input> 
            </el-form-item>
          </el-col>  
          <el-col :span="12">
            <el-form-item label="申请日期" prop="applyTime">
              <el-date-picker
                v-model="editForm.applyTime"
                align="right"
                type="date"
                placeholder="申请日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <div class="info">
            <span>|&nbsp;&nbsp;加班信息</span>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加班类型" prop="workOvertimeType">
              <el-select v-model="editForm.workOvertimeType" placeholder="请选择">
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
            <el-form-item label="加班时数" prop="workOvertimeHours">
              <el-input-number
                :min="0"
                label="加班时数"
                maxlength="8"
                clearable
                v-model="editForm.workOvertimeHours"
              ></el-input-number>小时
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="加班开始时间" prop="beginTime">
              <el-date-picker
                v-model="editForm.beginTime"
                align="right"
                type="datetime"
                placeholder="选择日期"
                default-time="9:00:00"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="加班结束时间" prop="endTime">
              <el-date-picker
                v-model="editForm.endTime"
                align="right"
                type="datetime"
                default-time="19:00:00"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="加班事由">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="editForm.reasonWorkOvertime"
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
              :archiveId="editForm.id"
              :branchId="editForm.branchId"
            ></attachment-upload>
          </el-row>
          <el-form-item style="text-align: center;">
            <el-button
              type="primary"
              @click="editSubmit"
              :disabled="load.edit==true"
              v-loading="load.edit"
            >提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { editKqWorkOvertimeInfo } from "@/api/oa/kq/kqWorkOvertimeInfo";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件

import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["kqWorkOvertimeInfo", "visible"],
  watch: {
    kqWorkOvertimeInfo: function(kqWorkOvertimeInfo) {
      this.editForm = kqWorkOvertimeInfo;
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
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
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
        applyTime: [
          { required: true, message: "申请时间不能为空", trigger: "change" }
        ]
      },
      //编辑界面数据  KqWorkOvertimeInfo kq_work_overtime_info
      editForm: {
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
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      overtimeType: [],
      deptSelectVisible: false
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    //上传文件回调
    onUpload(file, fileList) {
      this.editForm.accessory = file.url;
    },
    //删除文件时回调
    getRemoveMsg(file, fileList) {
      this.editForm.accessory = "";
    },
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交KqWorkOvertimeInfo kq_work_overtime_info父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      let date1 = this.editForm.beginTime;
      let date2 = this.editForm.endTime;
      if (date1 > date2) {
        this.$message.error("开始日期不能早于结束日期");
        return;
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editKqWorkOvertimeInfo(params)
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
      let params = [{ categoryId: "all", itemCode: "overtimeType" }];
      listOption(params).then(res => {
        this.overtimeType = res.data.data.overtimeType;
        console.log(this.overtimeType);
      });
    },
    //上传文件回调
    onUpload(file, fileList) {
      this.editForm.accessory = file.url;
    },
    //删除文件时回调
    getRemoveMsg(file, fileList) {
      this.editForm.accessory = "";
    },
    handleLeftDeptNodeClick(data, node, comp) {
      this.editForm.deptid = data.deptid;
      this.editForm.deptName = data.deptName;
      this.deptSelectVisible = false;
    },
    cancel() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'kq-work-overtime-info-edit':KqWorkOvertimeInfoEdit
    "attachment-upload": AttachmentUpload,
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.kqWorkOvertimeInfo);
    this.getOption();
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
