<template>
  <section class="page-container padding">
    <el-row
      class="page-header padding-left"
      v-if="!jxAssessSchemeExec || !jxAssessSchemeExec.id"
    >
      <el-input
        size="small"
        style="width: 250px"
        v-model="editForm.schemeName"
        @focus="schemeExecVisible = true"
        suffix-icon="el-icon-search"
        placeholder="请选择执行方案"
        v-if="currOpType == 'add'"
      ></el-input>
      <el-input
        size="small"
        style="width: 250px"
        v-model="editForm.assUsername"
        @focus="userSelectVisible = true"
        suffix-icon="el-icon-search"
        placeholder="请选择员工"
        v-if="currOpType == 'add'"
      ></el-input>
    </el-row>
    <el-row class="page-header padding-left" v-else>
      <el-input
        size="small"
        style="width: 250px"
        v-model="editForm.assUsername"
        @focus="userSelectVisible = true"
        suffix-icon="el-icon-search"
        placeholder="请选择员工"
        v-if="currOpType == 'add'"
      ></el-input>
    </el-row>
    <el-row class="page-main padding">
      <!--编辑界面 JxAssessGrade 考核总分表-->
      <el-table
        stripe
        border
        :data="contents"
        style="width: 99%"
        show-summary
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="seqNum"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="categoryName"
          label="指标分类"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="指标名称"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="weight" label="分数">
          <template slot-scope="scope">
            {{ genWeightPoints(scope.row.weight, editForm.totalPoints) }}分
          </template>
        </el-table-column>
        <el-table-column
          min-width="240"
          prop="remark"
          label="指标说明"
        ></el-table-column>
        <el-table-column prop="selfDesc" label="个性化说明" min-width="180">
          <template slot-scope="scope">
            <el-input
              v-if="
                editForm.reCstatus != '1' &&
                (editForm.reUserid == userInfo.userid ||
                  editForm.assUserid == userInfo.userid)
              "
              type="textarea"
              rows="2"
              size="small"
              v-model="scope.row.selfDesc"
              placeholder
            ></el-input>
            <div v-else>{{ scope.row.selfDesc }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="weight" label="满分"></el-table-column> -->
        <el-table-column prop="selfPoints" label="自评分" width="100">
          <template slot="header">
            自评&nbsp;<el-button
              size="mini"
              type="text"
              @click="copyTemplatePoints"
              >复制模板</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-input
              size="small"
              min="0"
              :max="genWeightPoints(scope.row.weight, editForm.totalPoints)"
              @change="onSelfPointsChange(scope.row, $event)"
              @input="onSelfPointsChange(scope.row, $event)"
              v-model="scope.row.selfPoints"
              type="number"
              :disabled="
                editForm.isSelf == '1' ||
                editForm.reCstatus != '1' ||
                editForm.assUserid != userInfo.userid
              "
            ></el-input>
            <!-- oninput="value=value.replace(/[^0-9.]/g,'')" -->
          </template>
        </el-table-column>
        <el-table-column prop="rePoints" label="复评分" width="100">
          <template slot="header">
            复评&nbsp;<el-button size="mini" type="text" @click="copySelfPoints"
              >复制自评</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-input
              size="small"
              min="0"
              :max="genWeightPoints(scope.row.weight, editForm.totalPoints)"
              @change="onRePointsChange(scope.row, $event)"
              @input="onRePointsChange(scope.row, $event)"
              v-model="scope.row.rePoints"
              type="number"
              :disabled="
                editForm.isReEval == '1' ||
                editForm.isSelf != '1' ||
                editForm.reUserid != userInfo.userid
              "
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="vouchPoints" label="核定分" width="100">
          <template slot="header">
            核定&nbsp;<el-button size="mini" type="text" @click="copyRePoints"
              >复制复评</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-input
              size="small"
              min="0"
              :max="genWeightPoints(scope.row.weight, editForm.totalPoints)"
              @change="onVouchPointsChange(scope.row, $event)"
              @input="onVouchPointsChange(scope.row, $event)"
              type="number"
              v-model="scope.row.vouchPoints"
              :disabled="
                editForm.isVouch == '1' ||
                editForm.isReEval != '1' ||
                editForm.isSelf != '1' ||
                editForm.vouchId != userInfo.userid
              "
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="page-main padding">
      <el-form
        :model="editForm"
        size="small"
        label-position="top"
        :rules="editFormRules"
        ref="editFormRef"
      >
        <el-form-item label="基本信息" prop="id">
          <el-row>
            <el-steps
              :space="200"
              :active="status"
              process-status="wait"
              finish-status="success"
            >
              <el-step
                :title="item.name"
                v-for="(item, index) in jxGradeStatus"
                :key="index"
              ></el-step>
            </el-steps>
          </el-row>
          <el-row>
            员工:{{ editForm.assUsername }} &nbsp;|&nbsp;{{
              editForm.schemeExecName
            }}&nbsp;
            <font v-if="editForm.schemeType == '0'" color="blue">
              月度&nbsp;&nbsp;{{ editForm.year }}&nbsp;&nbsp;
              {{ editForm.month }}月
            </font>
            <font v-if="editForm.schemeType == '1'" color="blue">
              季度&nbsp;&nbsp;{{ editForm.year }}&nbsp;&nbsp;
              {{ editForm.quarter }}季
            </font>
            <font v-if="editForm.schemeType == '2'" color="green">
              半年&nbsp;&nbsp;{{ editForm.year }}&nbsp;&nbsp;
              {{ editForm.semiAnnual == "1" ? "上半年" : "下半年" }}
            </font>
            <font v-if="editForm.schemeType == '3'" color="red">
              年度&nbsp;&nbsp;{{ editForm.year }}年
            </font>
            &nbsp;|&nbsp;

            <font v-for="(item, index) in jxGradeStatus" :key="index">
              <el-tag :type="item.tagType" v-if="editForm.status == item.id">
                {{ item.name }}
              </el-tag>
            </font>
            | &nbsp;复评人:<font color="blue">{{
              editForm.reUsername ? editForm.reUsername : "未指定"
            }}</font>
            <el-button @click="reUserSelectVisible = true" size="small"
              >设置</el-button
            >&nbsp;| &nbsp;核定人:<font color="blue">{{
              editForm.vouchName ? editForm.vouchName : "未指定"
            }}</font
            >&nbsp;<el-button
              @click="vouchUserSelectVisible = true"
              size="small"
              >设置</el-button
            >
          </el-row>
        </el-form-item>
        <el-form-item label="自我评价" prop="id">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="editForm.selfRemark"
            :disabled="
              editForm.isSelf == '1' ||
              editForm.reCstatus != '1' ||
              editForm.assUserid != userInfo.userid
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="复核评价" prop="id">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="editForm.reRemark"
            :disabled="
              editForm.isReEval == '1' ||
              editForm.isSelf != '1' ||
              editForm.reUserid != userInfo.userid
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="核定评价" prop="id">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="editForm.vouchRemark"
            :disabled="
              editForm.isVouch == '1' ||
              editForm.isReEval != '1' ||
              editForm.isSelf != '1' ||
              editForm.vouchId != userInfo.userid
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="accessory">
          <attachment-upload
            @on-change="onChange"
            @on-remove="getRemoveMsg"
            :archiveId="editForm.id ? editForm.id : '221221343432423'"
            :branchId="userInfo.branchId"
          ></attachment-upload>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row class="page-bottom bottom-fixed">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button
        v-loading="load.edit"
        type="primary"
        @click.native="saveSubmit('save')"
        :disabled="load.edit == true"
        >暂存</el-button
      >

      <el-button
        v-if="editForm.status == '1'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('selfConfirm')"
        v-loading="load.save"
        >完成员工确认</el-button
      >
      <el-button
        v-if="editForm.status == '2'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('reConfirm')"
        v-loading="load.save"
        >完成主管确认</el-button
      >
      <el-button
        v-if="editForm.status == '2'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('rejectReConfirm')"
        v-loading="load.save"
        >请员工重新确认</el-button
      >
      <el-button
        v-if="editForm.status == '3'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('selfEvalConfirm')"
        v-loading="load.save"
        >完成自评</el-button
      >
      <el-button
        v-if="editForm.status == '4'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('reEvalConfirm')"
        v-loading="load.save"
        >完成复评</el-button
      >
      <el-button
        v-if="editForm.status == '5'"
        type="primary"
        style="margin-left: 15px"
        @click="finishSubmitBtnClick('vouchEvalConfirm')"
        v-loading="load.save"
        >完成核定</el-button
      >
    </el-row>
    <el-dialog
      append-to-body
      title="用户选择"
      :visible.sync="userSelectVisible"
      width="80%"
    >
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>

    <el-dialog
      append-to-body
      title="执行方案选择"
      :visible.sync="schemeExecVisible"
      width="80%"
    >
      <jx-assess-scheme-exec-mng
        :is-select="true"
        @row-click="onSchemeExecSelected"
      ></jx-assess-scheme-exec-mng>
    </el-dialog>

    <el-dialog
      append-to-body
      title="复评人选择"
      :visible.sync="reUserSelectVisible"
      width="80%"
    >
      <users-select @confirm="onReUserSelected"></users-select>
    </el-dialog>

    <el-dialog
      append-to-body
      title="核定人选择"
      :visible.sync="vouchUserSelectVisible"
      width="80%"
    >
      <users-select @confirm="onVouchUserSelected"></users-select>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import {
  getDicts,
  initSimpleDicts,
  initComplexDicts,
} from "@/api/mdp/meta/item"; //字典表
import {
  addJxAssessGrade,
  editJxAssessGrade,
  saveAssessInfo,
  getJxAssessGradeDetail,
  deptAssessmentOf,
} from "@/api/oa/jx/jxAssessGrade";
import { mapGetters } from "vuex";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import JxAssessSchemeExecMng from "@/views/oa/jx/jxAssessSchemeExec/JxAssessSchemeExecMng";
import { getJxAssessTemplate } from "@/api/oa/jx/jxAssessTemplate";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

export default {
  components: {
    //JxAssessGradeEdit,
    AttachmentUpload,
    UsersSelect,
    JxAssessSchemeExecMng,
  },
  computed: {
    ...mapGetters(["userInfo"]),
    status(){
      return parseInt(this.editForm.status);
    }
  },
  props: ["jxAssessGrade", "visible", "opType", "jxAssessSchemeExec"],

  watch: {
    jxAssessGrade: function (jxAssessGrade) {
      if (jxAssessGrade) {
        this.editForm = jxAssessGrade;
      }
    },
    visible: function (visible) {
      if (visible == true) {
        //从新打开页面时某些数据需要重新加载，可以在这里添加
        this.initData();
      }
    },
  },
  data() {
    return {
      currOpType: "add", //add/edit
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      dicts: {}, //下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
      editFormRules: {
        id: [
          //{ required: true, message: 'id不能为空', trigger: 'change' }
        ],
      },

      //编辑界面数据  JxAssessGrade 考核总分表
      editForm: {
        id: "",
        branchId: "",
        totalPoints: "",
        evaluate: "",
        accessory: "",
        assUserid: "",
        year: "",
        month: "",
        quarter: "",
        semiAnnual: "",
        annual: "",
        schemeType: "",
        selfPoints: "",
        selRemark: "",
        vouchPoints: "",
        vouchRemark: "",
        isSelf: "",
        isReEval: "",
        isVouch: "",
        templateId: "",
        status: "",
        assDeptid: "",
        assDeptName: "",
        assUsername: "",
        finalPoints: "",
        classType: "",
        vouchId: "",
        vouchName: "",
        reUserid: "",
        reUsername: "",
        reTime: "",
        vouchTime: "",
        selfTime: "",
        schemeExecId: "",
        classTypeName: "",
        reRemark: "",
        schemeId: "",
        rePoints: "",
        assCstatus: "",
        assCtime: "",
        reCstatus: "",
        vouchCstatus: "",
        vouchCtime: "",
        reCtime: "",
        schemeExecName: "",
      },
      editFormBak: {
        id: "",
        branchId: "",
        totalPoints: "",
        evaluate: "",
        accessory: "",
        assUserid: "",
        year: "",
        month: "",
        quarter: "",
        semiAnnual: "",
        annual: "",
        schemeType: "",
        selfPoints: "",
        selRemark: "",
        vouchPoints: "",
        vouchRemark: "",
        isSelf: "",
        isReEval: "",
        isVouch: "",
        templateId: "",
        status: "",
        assDeptid: "",
        assDeptName: "",
        assUsername: "",
        finalPoints: "",
        classType: "",
        vouchId: "",
        vouchName: "",
        reUserid: "",
        reUsername: "",
        reTime: "",
        vouchTime: "",
        selfTime: "",
        schemeExecId: "",
        classTypeName: "",
        reRemark: "",
        schemeId: "",
        rePoints: "",
        assCstatus: "",
        assCtime: "",
        reCstatus: "",
        vouchCstatus: "",
        vouchCtime: "",
        reCtime: "",
        schemeExecName: "",
      },
      contents: [],

      jxAssessTemplates: [],
      jxAssessTemplate: null,
      userSelectVisible: false,
      schemeExecVisible: false,
      reUserSelectVisible: false,
      vouchUserSelectVisible: false,
      jxGradeStatus: [
        { id: "0", name: "初始", tagType: "info" },
        { id: "1", name: "待签约", tagType: "primary" },
        { id: "2", name: "待主管确认", tagType: "primary" },
        { id: "3", name: "待自评", tagType: "warning" },
        { id: "4", name: "待复评", tagType: "warning" },
        { id: "5", name: "待核定", tagType: "warning" },
        { id: "6", name: "待奖励", tagType: "danger" },
        { id: "7", name: "已完成", tagType: "info" },
      ],
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
    }; //end return
  }, //end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function () {
      this.$refs["editFormRef"].resetFields();
      this.$emit("cancel");
    },
    //编辑提交JxAssessGrade 考核总分表父组件监听@submit="afterEditSubmit"
    saveSubmit: function (action) {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          if (!this.editForm.assUserid) {
            this.$message({
              showClose: true,
              message: "请选择员工",
              type: "error",
            });
            return;
          }
          if (!this.editForm.templateId) {
            this.$message({
              showClose: true,
              message: "请选择模板",
              type: "error",
            });
            return;
          }
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.editForm);
            params.action = action;
            params.contents = this.contents;
            if (this.currOpType == "edit") {
              saveAssessInfo(params)
                .then((res) => {
                  this.load.edit = false;
                  var tips = res.data.tips;
                  if (tips.isOk) {
                    this.$emit("submit"); //  @submit="afterEditSubmit"
                  }
                  this.$message({
                    showClose: true,
                    message: tips.msg,
                    type: tips.isOk ? "success" : "error",
                  });
                })
                .catch((err) => (this.load.edit = false));
            } else {
              saveAssessInfo(params)
                .then((res) => {
                  this.load.edit = false;
                  var tips = res.data.tips;
                  if (tips.isOk) {
                    this.editForm = res.data.data;
                    this.currOpType = "edit";
                    this.$emit("submit"); //  @submit="afterAddSubmit"
                  }
                  this.$message({
                    showClose: true,
                    message: tips.msg,
                    type: tips.isOk ? "success" : "error",
                  });
                })
                .catch((err) => (this.load.edit = false));
            }
          });
        }
      });
    },
    initData: function () {
      this.currOpType = this.opType;
      if (this.jxAssessGrade) {
        this.editForm = Object.assign({}, this.jxAssessGrade);
      }

      if (this.opType == "edit") {
        getJxAssessGradeDetail({ id: this.editForm.id }).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.editForm = res.data.data;
            this.contents = res.data.contents;
          }
        });
      } else {
        this.$refs["editFormRef"].resetFields();
        this.contents = [];
        this.editForm = { ...this.editFormBak };
        if (this.jxAssessSchemeExec) {
          this.editForm.templateId = this.jxAssessSchemeExec.templateId;
          this.editForm.schemeExecId = this.jxAssessSchemeExec.id;
          this.editForm.schemeExecName = this.jxAssessSchemeExec.name;
          this.editForm.schemeId = this.jxAssessSchemeExec.schemeId;
          this.editForm.semiAnnual = this.jxAssessSchemeExec.semiAnnual;
          this.editForm.year = this.jxAssessSchemeExec.year;
          this.editForm.month = this.jxAssessSchemeExec.month;
          this.editForm.quarter = this.jxAssessSchemeExec.quarter;
          this.editForm.annual = this.jxAssessSchemeExec.annual;
          this.editForm.schemeType = this.jxAssessSchemeExec.schemeType;
          this.editForm.templateId = this.jxAssessSchemeExec.templateId;
          this.editForm.templateName = this.jxAssessSchemeExec.templateName;
          this.editForm.totalPoints = this.jxAssessSchemeExec.totalPoints;
          this.getJxAssessTemplate();
        }
      }
    },
    onSelfPointsChange(row, val) {
      let integer = /^(-|\+)?\d+$/; //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points = parseInt(val);
        var max = this.genWeightPoints(row.weight, this.editForm.totalPoints);
        if (points > max) {
          row.selfPoints = max;
        } else {
          this.$nextTick(() => {
            row.selfPoints = points;
          });
        }
      }
      this.calcPoints();
    },
    onRePointsChange(row, val) {
      let integer = /^(-|\+)?\d+$/; //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points = parseInt(val);
        var max = this.genWeightPoints(row.weight, this.editForm.totalPoints);
        if (points > max) {
          row.rePoints = max;
        } else {
          this.$nextTick(() => {
            row.rePoints = points;
          });
        }
      }
      this.calcPoints();
    },
    onVouchPointsChange(row, val) {
      let integer = /^(-|\+)?\d+$/; //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points = parseInt(val);
        var max = this.genWeightPoints(row.weight, this.editForm.totalPoints);
        if (points > max) {
          row.vouchPoints = max;
        } else {
          this.$nextTick(() => {
            row.vouchPoints = points;
          });
        }
      }
      this.calcPoints();
    },
    calcPoints() {
      var newVal = this.contents;
      var rePoints = 0;
      var selfPoints = 0;
      var vouchPoints = 0;
      newVal.forEach((i) => {
        rePoints = rePoints + (i.rePoints ? parseInt(i.rePoints) : 0);
        selfPoints = selfPoints + (i.selfPoints ? parseInt(i.selfPoints) : 0);
        vouchPoints =
          vouchPoints + (i.vouchPoints ? parseInt(i.vouchPoints) : 0);
      });

      this.editForm.rePoints = rePoints;
      this.editForm.selfPoints = selfPoints;
      this.editForm.vouchPoints = vouchPoints;
    },

    //删除文件后回调
    getRemoveMsg(file, fileList) {},
    //上传成功后回调
    onChange(file, fileList) {
      this.editForm.accessory = "";
      for (let i = 0; i < fileList.length; i++) {
        if (i >= 1) {
          this.editForm.accessor += ",";
        }
        this.editForm.accessory += fileList[i].cdnUrl;
      }
    },
    //获取列表 JxAssessContent 考核模板内容表
    getJxAssessTemplate() {
      let params = {
        id: this.editForm.templateId,
        branchId: this.userInfo.branchId,
      };

      this.load.list = true;
      getJxAssessTemplate(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            var contents = res.data.data.accessContents;
            contents.forEach((i) => {
              i.selfPoints = "";
              i.vouchPoints = "";
              i.rePoints = "";
              i.contentId = i.id;
              i.selfDesc = "";
            });
            this.contents = contents;
            this.editForm.totalPoints = res.data.data.totalPoints;
          } else {
            this.$message({
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //选择被考核人后回调
    onUserSelected(users) {
      if (users && users.length > 0) {
        this.editForm.assUserid = users[0].userid;
        this.editForm.assUsername = users[0].username;
        this.userSelectVisible = false;
      } else {
        this.editForm.assUserid = "";
        this.editForm.assUsername = "";
        this.userSelectVisible = false;
      }
    },
    onReUserSelected(users) {
      if (users && users.length > 0) {
        this.editForm.reUserid = users[0].userid;
        this.editForm.reUsername = users[0].username;
        this.reUserSelectVisible = false;
      } else {
        this.editForm.reUserid = "";
        this.editForm.reUsername = "";
        this.reUserSelectVisible = false;
      }
    },
    onVouchUserSelected(users) {
      if (users && users.length > 0) {
        this.editForm.vouchId = users[0].userid;
        this.editForm.vouchName = users[0].username;
        this.vouchUserSelectVisible = false;
      } else {
        this.editForm.vouchId = "";
        this.editForm.vouchName = "";
        this.vouchUserSelectVisible = false;
      }
    },
    onSchemeExecSelected(jxAssessSchemeExec) {
      this.editForm.schemeType = jxAssessSchemeExec.schemeType;
      this.editForm.schemeId = jxAssessSchemeExec.schemeId;
      this.editForm.schemeExecId = jxAssessSchemeExec.id;
      this.editForm.schemeExecName = jxAssessSchemeExec.name;
      this.editForm.year = jxAssessSchemeExec.year;
      this.editForm.month = jxAssessSchemeExec.month;
      this.editForm.quarter = jxAssessSchemeExec.quarter;
      this.editForm.semiAnnual = jxAssessSchemeExec.semiAnnual;
      this.editForm.annual = jxAssessSchemeExec.annual;
      this.editForm.schemeName = jxAssessSchemeExec.name;
      this.editForm.templateId = jxAssessSchemeExec.templateId;
      this.editForm.templateName = jxAssessSchemeExec.templateName;
      this.schemeExecVisible = false;
      this.contents = [];
      this.getJxAssessTemplate();
    },
    genWeightPoints(weight, totalPoints) {
      return parseInt((weight * totalPoints) / 100);
    },
    finishSubmitBtnClick(action) {
      this.saveSubmit(action);
    },
    copyTemplatePoints() {
      if (this.editForm.status != "3") {
        this.$message({
          showClose: true,
          message: "当前不是待自评状态，不允许更改自评数据",
          type: "error",
        });
        return;
      }
      if (this.editForm.assUserid != this.userInfo.userid) {
        this.$message({
          showClose: true,
          message: "您不是该绩效考核人，不允许更改自评数据",
          type: "error",
        });
        return;
      }
      this.contents.forEach((i) => {
        i.selfPoints = this.genWeightPoints(
          i.weight,
          this.editForm.totalPoints
        );
      });
      this.calcPoints();
    },
    copySelfPoints() {
      if (this.editForm.status != "4") {
        this.$message({
          showClose: true,
          message: "当前不是待复评状态，不允许更改复评数据",
          type: "error",
        });
        return;
      }
      if (this.editForm.reUserid != this.userInfo.userid) {
        this.$message({
          showClose: true,
          message: "您不是该绩效复评人，不允许更改复评数据",
          type: "error",
        });
        return;
      }
      this.contents.forEach((i) => {
        i.rePoints = i.selfPoints;
      });
      this.calcPoints();
    },
    copyRePoints() {
      if (this.editForm.status != "5") {
        this.$message({
          showClose: true,
          message: "当前不是待核定状态，不允许更改核定数据",
          type: "error",
        });
        return;
      }
      if (this.editForm.vouchId != this.userInfo.userid) {
        this.$message({
          showClose: true,
          message: "您不是该绩效核定人，不允许更改核定数据",
          type: "error",
        });
        return;
      }
      this.contents.forEach((i) => {
        i.vouchPoints = i.rePoints;
      });
      this.calcPoints();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        debugger;
        if (this.contents.length == rowIndex + 1) {
          return;
        }
        var nextRow = this.contents[rowIndex + 1];
        if (!row.startIndex && row.startIndex !== 0) {
          nextRow.startIndex = rowIndex;

          var next = Object.assign({}, nextRow);
          var i = rowIndex + 1;
          while (next.categoryName == row.categoryName) {
            i = i + 1;
            next = this.contents[i];
          }
          nextRow.rowspan = i - rowIndex;
          return {
            rowspan: nextRow.rowspan,
            colspan: 1,
          };
        } else {
          if (rowIndex < row.startIndex + row.rowspan) {
            if (rowIndex < row.startIndex + row.rowspan - 1) {
              nextRow.startIndex = row.startIndex;
              nextRow.rowspan = row.rowspan;
            }
            return {
              rowspan: 0,
              colspan: 1,
            };
          }
        }
      }
    },
    /**begin 在下面加自定义方法**/
  }, //end method
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData();
    });
  },
};
</script>

<style scoped>
</style>
