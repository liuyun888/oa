<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>人事档案</el-breadcrumb-item>
          <el-breadcrumb-item>员工信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-button
          size="mini"
          v-loading="load.add"
          @click="submitForm('baseInfo')"
          :disabled="load.add==true"
        >保存</el-button>
        <el-button size="mini" @click="close">关闭</el-button>
      </div>
    </div>
    <!-- <div class="userInfo"></div> -->
    <div class="content">
      <div class="content-left">
        <el-steps direction="vertical" space="50px" :active="activeStep">
          <el-step
            v-for="(item, index) in stepsArr"
            :key="index"
            :title="item.title"
            @click.native="jump(index)"
          ></el-step>
        </el-steps>
      </div>
      <div class="content-right" ref="contentRight">
        <el-form ref="baseInfo" :rules="rules" :model="baseInfo" label-width="120px" size="mini">
          <!-- 个人信息 -->
          <el-card class="box-card step-jump">
            <div slot="header" class="clearfix">
              <span class="bor-card-title">个人信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" prop="username" style="width:80%">
                  <el-input v-model="baseInfo.username" maxlength="20" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="曾用名" style="width:80%">
                  <el-input v-model="baseInfo.formerName" maxlength="20" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="身份证号码" style="width:80%">
                  <el-input v-model="baseInfo.idCardNo" maxlength="18" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="	性别" style="width:80%">
                  <el-radio v-model="baseInfo.sex" label="0">男</el-radio>
                  <el-radio v-model="baseInfo.sex" label="1">女</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="出生日期" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.birthdate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄" style="width:80%">
                  <el-input v-model="baseInfo.age" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="民族" style="width:80%">
                  <el-select v-model="baseInfo.nation" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in nation"
                      :key="item.optionName"
                      :label="item.optionName"
                      :value="item.optionValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="政治面貌" style="width:80%">
                  <el-select v-model="baseInfo.politicsStatus" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in politicsStatus"
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
                <el-form-item label="入团日期" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.smokedDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入党日期" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.partyDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最高学历" style="width:80%">
                  <el-select v-model="baseInfo.eduBack" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in eduBackground"
                      :key="item.optionName"
                      :label="item.optionName"
                      :value="item.optionValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最高学位" style="width:80%">
                  <el-select v-model="baseInfo.degree" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in qualification"
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
                <el-form-item label="婚姻情况" style="width:80%">
                  <el-select v-model="baseInfo.maritalStatus" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in maritalStatus"
                      :key="item.optionName"
                      :label="item.optionName"
                      :value="item.optionValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="健康情况" style="width:80%">
                  <el-select
                    v-model="baseInfo.healthyCondition"
                    placeholder="请选择"
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in healCondition"
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
                <el-form-item label="身高(厘米)" style="width:80%">
                  <el-input v-model="baseInfo.stature" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体重(千克)" style="width:80%">
                  <el-input v-model="baseInfo.weight" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="现居地" style="width:80%">
                  <el-input v-model="baseInfo.presentAddress" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="籍贯" style="width:80%">
                  <el-input v-model="baseInfo.nativePlace" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="出生地" style="width:80%">
                  <el-input v-model="baseInfo.birthplace" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户口所在地" style="width:80%">
                  <el-input v-model="baseInfo.regPerResidence" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="户口所在派出所" style="width:80%">
                  <el-input v-model="baseInfo.regPerResidenceLocal" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="到本单位日期" prop="startTime" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="参加工作日期" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.workTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!-- 在职信息 -->
          <el-card class="box-card step-jump">
            <div slot="header" class="clearfix">
              <span class="bor-card-title">在职信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="职责描述" style="width:80%">
                  <el-input v-model="baseInfo.duty" maxlength="20" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作地点" style="width:80%">
                  <el-input v-model="baseInfo.workplace" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="所在部门" style="width:80%">
                  <el-input v-model="baseInfo.deptName" suffix-icon="el-icon-search" @focus="editUserDeptFormVisible = true"></el-input>
                 </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位" style="width:80%">
                  <el-input v-model="baseInfo.postName" suffix-icon="el-icon-search" @focus="editUserDeptFormVisible = true"></el-input>
                 </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="汇报上级" style="width:80%">
                  <el-input v-model="baseInfo.reportName" maxlength="50" clearable suffix-icon="el-icon-search" @focus="userSelectVisible = true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="在职技能" style="width:80%">
                  <el-tag :key="index"  v-for="(skill,index) in skills" closable @close="handleClose(skill,index)">{{skill.skillName}}</el-tag>
                  <el-button type="text" @click="skillSelectVisible = true">选择技能</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!-- 员工状态 -->
          <el-card class="box-card step-jump">
            <div slot="header" class="clearfix">
              <span class="bor-card-title">员工状态</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="员工状态" style="width:80%">
                  <el-select v-model="baseInfo.status" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in staffStatus"
                      :key="item.optionName"
                      :label="item.optionName"
                      :value="item.optionValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人员类别" style="width:80%">
                  <el-select v-model="baseInfo.level" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in perCategory"
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
                <el-form-item label="工作性质" style="width:80%">
                  <el-input v-model="baseInfo.jobNature" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职日期" prop="entryTime" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.entryTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用工期限(年)" style="width:80%">
                  <el-input v-model="baseInfo.jobDeadline" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="转正日期" style="width:80%">
                  <el-date-picker
                    v-model="baseInfo.positiveTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="试用期限(月)" prop="trialDeadline" style="width:80%">
                  <el-input v-model="baseInfo.trialDeadline" maxlength="8" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!-- 联系信息 -->
          <el-card class="box-card step-jump">
            <div slot="header" class="clearfix">
              <span class="bor-card-title">联系信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phoneno" style="width:80%">
                  <el-input v-model="baseInfo.phoneno" maxlength="11" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" style="width:80%">
                  <el-input v-model="baseInfo.email" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="办公地点" style="width:80%">
                  <el-input v-model="baseInfo.officeAddress" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="办公电话" style="width:80%">
                  <el-input v-model="baseInfo.officePhoneno" maxlength="11" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="紧急联系人" style="width:80%">
                  <el-input v-model="baseInfo.emergencyContact" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="紧急联系人电话" style="width:80%">
                  <el-input v-model="baseInfo.emeContactPho" maxlength="11" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="其他联系方式" style="width:80%">
                  <el-input v-model="baseInfo.ortherPhoneno" maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </div>
    </div>
    <!--设置用户部门界面-->
    <el-dialog
      title="设置所在部门及归属岗位"
      :visible.sync="editUserDeptFormVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-dept-edit
        :user="{userid:baseInfo.userid,username:baseInfo.username}"
        :branch="branch"
        :visible="editUserDeptFormVisible"
        @cancel="editUserDeptFormVisible=false"
        @submit="onUserDeptSubmit" 
      ></user-dept-edit>
    </el-dialog>
    <!-- 选择上级 -->
    <el-dialog append-to-body title="选择上级" :visible.sync="userSelectVisible" width="70%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    <el-dialog
      append-to-body
      title="技能条件"
      :visible.sync="skillSelectVisible"
      class="dialog-body"
      width="60%"
    >
      <skill-mng :skillIds="skillIds" :jump="true" @select-confirm="onTagSelected"></skill-mng>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import UserDeptEdit from "@/views/mdp/sys/userDept/UserDeptEdit"; //修改部门和岗位
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import { getUserInfomation,getUserDeptPost } from "@/api/oa/hr/user/sysUser";
import { addHrUserBaseInfo } from "@/api/oa/hr/user/hrUserBaseInfo";
import {
  addHrUserDimission,
  delHrUserDimission,
} from "@/api/oa/hr/user/hrUserDimission";
import skillMng from "@/views/oa/hr/skill/skillMng";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      activeStep: 0,
      scrollTop: 0, // 没用到
      //步骤条
      stepsArr: [
        { title: "个人信息" },
        { title: "在职信息" },
        { title: "员工状态" },
        { title: "联系信息" },
      ],
      userid: "",
      //其他信息
      baseInfo: {
        id: "",
        userid: "",
        deptid: "",
        deptName: "",
        branchId: "",
        branchName: "",
        reportId: "",
        reportName: "",
        duty: "",
        workplace: "",
        account: "",
        post: "",
        status: "试用",
        level: "",
        jobNature: "",
        entryTime: "",
        positiveTime: "",
        jobDeadline: "",
        trialDeadline: "",
        phoneno: "",
        email: "",
        officeAddress: "",
        officePhoneno: "",
        emergencyContact: "",
        emeContactPho: "",
        ortherPhoneno: "",
        username: "",
        formerName: "",
        idCardNo: "",
        sex: "",
        birthdate: "",
        age: "",
        nation: "",
        politicsStatus: "",
        smokedDate: "",
        partyDate: "",
        eduBack: "",
        degree: "",
        maritalStatus: "",
        healthyCondition: "",
        stature: "",
        weight: "",
        presentAddress: "",
        nativePlace: "",
        birthplace: "",
        regPerResidence: "",
        regPerResidenceLocal: "",
        startTime: "",
        workTime: "",
        workingYears: "",
        enterpriseYears: "",
        accessory: "",
        skillIds:[]
      },
      currentPage4: 4,
      nation: [], //民族
      politicsStatus: [], //	政治面貌
      eduBackground: [], // 学历
      qualification: [], //学位
      maritalStatus: [], //婚姻状况
      healCondition: [], //	健康情况
      perCategory: [], //人员类别
      staffStatus: [], //员工状态
      skillSelectVisible: false,
      skillIds: [],
      skills: [],
      editUserDeptFormVisible: false, //设置用户部门和岗位
      load: { list: false, add: false, del: false, add: false }, //查询中...
      user: {
        userid: "",
      },
      branch: {
        id: "",
      },
      userSelectVisible: false,
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "到本单位日期不能为空", trigger: "blur" },
        ],
        entryTime: [
          { required: true, message: "入职日期不能为空", trigger: "blur" },
        ],
        trialDeadline: [
          { required: true, message: "试用期限(月)不能为空", trigger: "blur" },
        ],
        phoneno: [{ required: true, message: "手机不能为空", trigger: "blur" }],
      },
    };
  },
  watch:{
    'baseInfo.idCardNo':{
      handler(oval,nval){
        if(this.baseInfo.idCardNo!=null){
          if(this.baseInfo.idCardNo.length>=14){
            this.baseInfo.birthdate = this.baseInfo.idCardNo.slice(6,10) +'-'+ this.baseInfo.idCardNo.slice(10,12)+'-'+this.baseInfo.idCardNo.slice(12,14)
            var birthdays = new Date(this.baseInfo.birthdate.replace(/-/g, "/"));
            var d = new Date();
            var age =
              d.getFullYear() -
              birthdays.getFullYear() -
              (d.getMonth() < birthdays.getMonth() ||
              (d.getMonth() == birthdays.getMonth() &&
                d.getDate() < birthdays.getDate())
                ? 1
                : 0);
            this.baseInfo.age = age;
            if(this.baseInfo.birthdate.length<11){
              this.baseInfo.birthdate = this.baseInfo.birthdate+' 00:00:00'
            }
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    this.userid = this.$route.query.userid;
    this.user.userid = this.userid;
    this.branch.id = this.userInfo.branchId;
    this.getOption();
    this.getuserInfomation();
    this.$refs.contentRight.addEventListener("scroll", this.onScroll);
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //获取下拉列表数据
    getOption() {
      let params = [
        { categoryId: "all", itemCode: "qualification" },
        { categoryId: "all", itemCode: "nation" },
        { categoryId: "all", itemCode: "politicsStatus" },
        { categoryId: "all", itemCode: "maritalStatus" },
        { categoryId: "all", itemCode: "healCondition" },
        { categoryId: "all", itemCode: "perCategory" },
        { categoryId: "all", itemCode: "eduBackground" },
        { categoryId: "all", itemCode: "staffStatus" },
      ];
      listOption(params).then((res) => {
        this.nation = res.data.data.nation;
        this.qualification = res.data.data.qualification;
        this.politicsStatus = res.data.data.politicsStatus;
        this.maritalStatus = res.data.data.maritalStatus;
        this.healCondition = res.data.data.healCondition;
        this.perCategory = res.data.data.perCategory;
        this.eduBackground = res.data.data.eduBackground;
        this.staffStatus = res.data.data.staffStatus;
      });
    },
    //查询用户的一些信息进行回显
    getuserInfomation() {
      let params = {
        userid: this.userid,
      };
      getUserInfomation(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          let user = res.data.data;
          this.$set(this.baseInfo, "userid", user.userid);
          this.$set(this.baseInfo, "username", user.username);
          this.$set(this.baseInfo, "idCardNo", user.idCardNo);
          this.$set(this.baseInfo, "sex", user.sex);
          this.$set(this.baseInfo, "email", user.email);
          this.$set(this.baseInfo, "phoneno", user.phoneno);
          this.$set(this.baseInfo, "branchId", this.userInfo.branchId);
          this.$set(this.baseInfo, "branchName", this.userInfo.branchName);
          this.$set(this.baseInfo, "displayUserid", user.displayUserid);
          this.$set(this.baseInfo, "reportName", "");
          this.onUserDeptSubmit();
        }
      });
    },
    //选择上级后回调
    onUserSelected(users) {
      this.userInfo.reportId = users[0].userid;
      this.userInfo.reportName = users[0].username;
      this.$set(this.baseInfo, "reportId", users[0].userid);
      this.$set(this.baseInfo, "reportName", users[0].username);
      this.userSelectVisible = false;
    },
    onUserDeptSubmit(){
      var params={
        userid:this.baseInfo.userid,
        branchId:this.baseInfo.branchId
      }
      getUserDeptPost(params).then(res=>{
        var tips = res.data.tips;
        
        this.editUserDeptFormVisible=false
        if(tips.isOk){
          var data=res.data.data;
          if(data){
            this.baseInfo.post=data.postId
            this.baseInfo.postName=data.postName
            this.baseInfo.deptid=data.deptid
            this.baseInfo.deptName=data.deptName
            if(!this.baseInfo.reportId){
              this.baseInfo.reportId=data.manager
              this.baseInfo.reportName=data.managerName
            }
          }
        }
      })
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        debugger;
        if (valid) {
          this.load.add = true;
          this.baseInfo.userid = this.userid;
          this.baseInfo.branchId = this.userInfo.branchId;
          this.baseInfo.branchName = this.userInfo.branchName;
          for(let i = 0 ; i < this.skills.length ; i++){
            this.baseInfo.skillIds.push(this.skills[i].skillId);
          }
          console.log(88,this.baseInfo.birthdate.length);
          addHrUserBaseInfo(this.baseInfo)
            .then((res) => {
              this.load.add = false;
              let tips = res.data.tips;
              if (tips.isOk) {
                if (
                  this.baseInfo.status == "解聘" ||
                  this.baseInfo.status == "离职" ||
                  this.baseInfo.status == "退休"
                ) {
                  this.addDimission();
                }
                this.$router.push({ path: "/oa/hr/user/employeeInfo" });
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error",
                });
              }
            })
            .catch((err) => (this.load.add = false));
        } else {
          this.$message({
            message: "表单数据未完全输入正确，请检查",
            type: "error",
          });
          return false;
        }
      });
    },
    //添加离职信息
    addDimission() {
      let params = {
        userid: this.userid,
      };
      addHrUserDimission(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.$message({
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        }
      });
    },
    //关闭
    close() {
      this.$router.push({ path: "/oa/hr/user/employeeInfo" });
    },
    //当元素滚动条被滚动时运行的脚本
    onScroll() {
      var jump = document.querySelectorAll(".step-jump");
      var distance = this.$refs.contentRight.scrollTop;
      jump.forEach((item, index) => {
        if (distance >= item.offsetTop - jump[0].offsetTop) {
          this.activeStep = index;
        }
      });
    },
    jump(index) {
      this.activeStep = index;
      let jump = document.querySelectorAll(".step-jump");
      let total = jump[index].offsetTop - jump[0].offsetTop;
      let distance = this.$refs.contentRight.scrollTop;
      let step = total / 50;
      if (total > distance) {
        this.smoothDown(distance, total, step);
      } else {
        let newTotal = distance - total;
        this.smoothUp(distance, total, step);
      }
    },
    smoothDown(distance, total, step) {
      if (distance < total) {
        distance += step;
        this.$refs.contentRight.scrollTop = distance;
        setTimeout(this.smoothDown(distance, total, step), 10);
      } else {
        this.$refs.contentRight.scrollTop = total;
      }
    },
    smoothUp(distance, total, step) {
      if (distance > total) {
        distance -= step;
        this.$refs.contentRight.scrollTop = distance;
        setTimeout(this.smoothDown(distance, total, step), 10);
      } else {
        this.$refs.contentRight.scrollTop = total;
      }
    },
    onTagSelected(skills) {
      this.skills = skills;
      this.skillSelectVisible = false;
    },
    //删除 技能
    handleClose(skill, index) {
      this.skills.splice(index, 1);
    },
  },
  components: {
    "attachment-upload": AttachmentUpload,
    "dept-tree": DeptTree,
    "user-dept-edit": UserDeptEdit,
    "users-select": UsersSelect,
    "skill-mng": skillMng,
  },
};
</script>

<style scoped lang="scss">
.container {
  background-color: #f7f7f7;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 100px;
  align-content: center;
  background: white;
}
.userInfo {
  height: 100px;
}
.step-jump {
  margin-bottom: 20px;
}
.content {
  margin: 10px 200px;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  background: white;
  .content-left {
    width: 200px;
  }
  .content-right {
    height: 700px;
    flex: 1;
    overflow: auto;
  }
  .content-right::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .content-right::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    height: 50px;
    outline-offset: -1px;
    outline: 1px solid #fff;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .content-right::-webkit-scrollbar-track {
    background-color: #fff;
  }
}
.bor-card-title {
  display: inline-block;
  font-size: 20px;
  color: #333333;
  font-weight: 700;
}
.box-title {
  margin: 10px 0px;
  .span1 {
    display: inline-block;
    height: 18px;
    width: 3px;
    background: #4285f4;
    margin-right: 10px;
    vertical-align: middle;
    margin-top: -5px;
  }
  .span2 {
  }
  .span3 {
    float: right;
    color: #4285f4;
  }
}
</style>
