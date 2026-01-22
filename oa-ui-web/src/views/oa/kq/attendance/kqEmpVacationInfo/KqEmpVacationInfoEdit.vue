<template>
  <section>
    <el-row class="page-container border padding"> 
      <div class="content">
        <!--编辑界面 KqEmpVacationInfo kq_emp_vacation_info-->
        <el-form ref="editForm" :model="editForm" label-width="120px" size="mini" :rules="rules">
          <el-row :gutter="20">
            <div class="info">
              <span>|&nbsp;&nbsp;基本信息</span>
            </div>
          </el-row>
          <el-row :gutter="20"> 
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="editForm.username" :disabled="editForm.bizFlowState=='1'||editForm.bizFlowState=='2'"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="部门">
                <el-input v-model="editForm.deptName" suffix-icon="el-icon-search" @focus="deptSelectVisible = true" :disabled="editForm.bizFlowState=='1'||editForm.bizFlowState=='2'"></el-input> 
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="紧急程度">
                <el-radio v-model="editForm.emergencyDegree" label="0">正常</el-radio>
                <el-radio v-model="editForm.emergencyDegree" label="1">重要</el-radio>
                <el-radio v-model="editForm.emergencyDegree" label="2">紧急</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <div class="info">
              <span>|&nbsp;&nbsp;请假信息</span>
            </div>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="请假类型" prop="vacationId">
                <el-select v-model="editForm.vacationId" placeholder="请选择" @change="onVacationIdChange" :disabled="editForm.bizFlowState=='1'||editForm.bizFlowState=='2'">
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
              <el-form-item label="总时长">
                <el-input-number v-model="editForm.vacationHours" :step="0.5" :min="0" :disabled="editForm.bizFlowState=='1'||editForm.bizFlowState=='2'"></el-input-number>小时
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起始日期" prop="beginDate">
                <el-date-picker :disabled="editForm.bizFlowState=='1'||editForm.bizFlowState=='2'"
                  v-model="editForm.beginDate"
                  align="right"
                  type="datetime"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss" 
                ></el-date-picker>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="editForm.endDate"
                  align="right"
                  type="datetime"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss" 
                ></el-date-picker>
              </el-form-item>
            </el-col> 
            <el-col :span="24">
              <el-form-item label="请假原因">
                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="editForm.reason"></el-input>
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
            <el-form-item style="text-align: center;">
              <el-button
                type="primary"
                @click="editSubmit"
                :disabled="load.edit==true"
                v-loading="load.edit"
              >修改</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-row>
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
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { editKqEmpVacationInfo } from "@/api/oa/kq/kqEmpVacationInfo";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import { listKqVacationType } from "@/api/oa/kq/kqVacationType";
import { listKqVacationTypeUser } from "@/api/oa/kq/kqVacationTypeUser";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["kqEmpVacationInfo", "visible"],
  watch: {
    kqEmpVacationInfo: function(kqEmpVacationInfo) {
      this.editForm = Object.assign({},kqEmpVacationInfo); 
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
          //{ required: true, message: 'ID不能为空', trigger: 'change' }
        ]
      },
      //编辑界面数据  KqEmpVacationInfo kq_emp_vacation_info
      editForm: {
        id: "",
        userid: "",
        username: "",
        deptid: "",
        deptName: "",
        vacationId: "",
        beginDate: "",
        endDate: "",
        reason: "",
        branchId: "",
        beginTime: "",
        endTime: "",
        emergencyDegree: "",
        dutyDescription: "",
        vacationHours: "",
        vacationType: "",
        vacationName: "",
        title: "",
        accessory: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        username: [
          { required: true, message: "姓名不能为空", trigger: "change" }
        ],
        vacationId: [
          { required: true, message: "请假类型不能为空", trigger: "change" }
        ],
        beginDate: [
          { required: true, message: "起始日期不能为空", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "结束日期不能为空", trigger: "change" }
        ],
      },
      kqVacationTypes: [],
      deptSelectVisible: false,
      leaveInfo: "",
      remainingHoliday: ""
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$refs["editForm"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交KqEmpVacationInfo kq_emp_vacation_info父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) { 
          if(this.kqEmpVacationInfo.vacationHours!=this.editForm.vacationHours){ 
            if(this.kqEmpVacationInfo.bizFlowState=='1'||this.kqEmpVacationInfo.bizFlowState=='2'){
              this.$message({
                  message: "审批中及审批通过都不允许修改请假时长",
                  type:   "error"
                });
                return;
            }    
          }
          if(this.kqEmpVacationInfo.beginDate!=this.editForm.beginDate){ 
            if(this.kqEmpVacationInfo.bizFlowState=='1'||this.kqEmpVacationInfo.bizFlowState=='2'){
              this.$message({
                  message: "审批中及审批通过都不允许修改请假开始时间",
                  type:   "error"
                });
                return;
            }    
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            editKqEmpVacationInfo(params)
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
      this.$refs["editForm"].resetFields();
      this.leaveInfo = "";
      this.$emit("cancel");
    },
    onVacationIdChange(val){
      var type=this.kqVacationTypes.find(i=>i.id==val)
      this.editForm.vacationType=type.vacationType
      this.editForm.vacationName=type.name

    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'kq-emp-vacation-info-edit':KqEmpVacationInfoEdit
    "attachment-upload": AttachmentUpload,
    "dept-tree": DeptTree
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.kqEmpVacationInfo);
    this.getKqVacationType();
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