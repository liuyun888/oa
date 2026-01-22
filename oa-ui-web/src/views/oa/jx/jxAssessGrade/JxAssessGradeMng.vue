<template>
  <section class="page-container border padding">
    <el-row>
      <el-select
        size="small"
        v-model="filters.schemeId"
        placeholder="考核方案"
        clearable
        :disabled="!!(jxAssessSchemeExec && jxAssessSchemeExec.schemeType)"
        @change="onJxSchemeChange"
      >
        <el-option
          :value="scheme.id"
          :label="scheme.name"
          v-for="(scheme, index) in jxAssessSchemes"
          :key="index"
        >
        </el-option>
      </el-select>
      <el-select
        size="small"
        style="width: 100px"
        v-model="filters.status"
        placeholder="状态"
        clearable
      >
        <el-option
          :value="item.id"
          :label="item.name"
          v-for="(item, index) in jxGradeStatus"
          :key="index"
        >
        </el-option>
      </el-select>
      <el-date-picker
        size="small"
        style="width: 100px"
        :disabled="!!(jxAssessSchemeExec && jxAssessSchemeExec.year)"
        v-model="filters.year"
        type="year"
        value-format="yyyy"
        placeholder="选择年"
      >
      </el-date-picker>

      <el-select
        size="small"
        style="width: 100px"
        v-if="filters.schemeType == '0'"
        :disabled="!!(jxAssessSchemeExec && jxAssessSchemeExec.month)"
        v-model="filters.month"
        placeholder="选择月"
      >
        <el-option value="1" label="一月"></el-option>
        <el-option value="2" label="二月"></el-option>
        <el-option value="3" label="三月"></el-option>
        <el-option value="4" label="四月"></el-option>
        <el-option value="5" label="五月"></el-option>
        <el-option value="6" label="六月"></el-option>
        <el-option value="7" label="七月"></el-option>
        <el-option value="8" label="八月"></el-option>
        <el-option value="9" label="九月"></el-option>
        <el-option value="10" label="十月"></el-option>
        <el-option value="11" label="十一月"></el-option>
        <el-option value="12" label="十二月"></el-option>
      </el-select>

      <el-select
        size="small"
        style="width: 100px"
        placeholder="季度"
        clearable
        v-model="filters.quarter"
        v-if="filters.schemeType == '1'"
        :disabled="!!(jxAssessSchemeExec && jxAssessSchemeExec.quarter)"
      >
        <el-option value="1" label="一季度"></el-option>
        <el-option value="2" label="二季度"></el-option>
        <el-option value="3" label="三季度"></el-option>
        <el-option value="4" label="四季度"></el-option>
      </el-select>

      <el-select
        size="small"
        style="width: 100px"
        placeholder="半年度"
        v-model="filters.semiAnnual"
        v-if="filters.schemeType == '2'"
        :disabled="!!(jxAssessSchemeExec && jxAssessSchemeExec.semiAnnual)"
      >
        <el-option value="1" label="上半年度"></el-option>
        <el-option value="2" label="下半年度"></el-option>
      </el-select>
      <el-input
        size="small"
        v-model="filters.deptNames"
        @focus="deptSelectVisible = true"
        style="width: 150px"
        placeholder="请选择部门"
      ></el-input>
      <el-input
        size="small"
        v-model="filters.key"
        style="width: 150px"
        placeholder="姓名/复评/核定" clearable
        @clear="handleClear" @keyup.enter.native="searchOnEnter"
      ></el-input>
      <el-button
        size="small"
        v-loading="load.list"
        :disabled="load.list == true"
        @click="searchJxAssessGrades"
        icon="el-icon-search"
        >查询</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click="showAdd"
        icon="el-icon-plus"
      >
      </el-button>
      <el-dropdown size="small" @command="handleMoreCommand">
        <el-button type="primary" size="small">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="batchSetReUser"
            :disabled="this.sels.length === 0 || load.del == true"
            >批量修改复评人</el-dropdown-item
          >
          <el-dropdown-item
            command="batchSetVouchUser"
            :disabled="this.sels.length === 0 || load.del == true"
            >批量修改核定人</el-dropdown-item
          >
          <el-dropdown-item
            command="batchFinishGrade"
            :disabled="this.sels.length === 0 || load.del == true"
            >批量修改为已完成</el-dropdown-item
          >
          <el-dropdown-item
            command="batchStartGrade"
            :disabled="this.sels.length === 0 || load.del == true"
            >批量开启</el-dropdown-item
          >
          <el-dropdown-item
            command="batchDel"
            icon="el-icon-delete"
            :disabled="this.sels.length === 0 || load.del == true"
            >批量删除</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <el-row class="padding-top">
      <!--列表 JxAssessGrade 考核总分表-->
      <el-table
        ref="jxAssessGradeTable"
        :data="jxAssessGrades"
        :height="maxTableHeight"
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%"
        @cell-click="cellClick"
      >
        <el-table-column
          type="selection"
          width="55"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          sortable
          type="index"
          width="55"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="员工信息" width="55">
          <el-table-column
            prop="assUsername"
            label="姓名"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="assDeptName"
            label="部门"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="reUsername"
            label="复评人"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="vouchName"
            label="核定人"
            min-width="80"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="考核方案" width="55">
          <el-table-column
            prop="name"
            label="名称"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.schemeExecName }}
              <br /><font v-if="scope.row.schemeType == '0'" color="gray">
                月度&nbsp;&nbsp;{{ scope.row.year }}&nbsp;&nbsp;
                {{ scope.row.month }}月
              </font>
              <font v-if="scope.row.schemeType == '1'" color="gray">
                季度&nbsp;&nbsp;{{ scope.row.year }}&nbsp;&nbsp;
                {{ scope.row.quarter }}季
              </font>
              <font v-if="scope.row.schemeType == '2'" color="gray">
                半年&nbsp;&nbsp;{{ scope.row.year }}&nbsp;&nbsp;
                {{ scope.row.semiAnnual == "1" ? "上半年" : "下半年" }}
              </font>
              <font v-if="scope.row.schemeType == '3'" color="gray">
                年度&nbsp;&nbsp;{{ scope.row.year }}年
              </font>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPoints"
            label="总分"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
        </el-table-column>

        <el-table-column label="绩效信息" width="55">
          <el-table-column
            prop="status"
            label="状态"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-for="(item, index) in jxGradeStatus" :key="index">
                <el-tag :type="item.tagType" v-if="scope.row.status == item.id">
                  {{ item.name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="得分" min-width="150" show-overflow-tooltip>
            <el-table-column
              prop="classTypeName"
              label="等级"
              min-width="80"
            ></el-table-column>
            <el-table-column
              prop="selfPoints"
              label="自评"
              min-width="80"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.selfPoints }}
              </template>
            </el-table-column>
            <el-table-column
              prop="rePoints"
              label="复评"
              min-width="80"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.rePoints }}
              </template>
            </el-table-column>
            <el-table-column
              prop="vouchPoints"
              label="核定"
              min-width="80"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.vouchPoints }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot="header">
            <el-button @click="showAdd" icon="el-icon-plus" circle> </el-button>
          </template>
          <template scope="scope">
            <el-button
              type="text"
              @click="openToConfirm(scope.row, scope.$index)"
              v-if="scope.row.status == '0'"
              >开启</el-button
            >
            <el-button
              type="text"
              @click="closeGrade(scope.row, scope.$index)"
              v-if="scope.row.status == '6'"
              >完成</el-button
            >
            <el-button type="text" @click="showEdit(scope.row, scope.$index)"
              >修改</el-button
            >
            <el-button
              type="text"
              @click="handleDel(scope.row, scope.$index)"
              v-if="scope.row.status == '0'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
      ></el-pagination>
    </el-row>
    <el-row>
      <!--编辑 JxAssessGrade 考核总分表界面-->
      <el-drawer
        title="编辑考核总分表"
        :visible.sync="editFormVisible"
        size="100%"
        append-to-body
        :close-on-click-modal="false"
      >
        <jx-assess-grade-edit
          op-type="edit"
          :jx-assess-grade="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible = false"
          @submit="afterEditSubmit"
        ></jx-assess-grade-edit>
      </el-drawer>

      <!--新增 JxAssessGrade 考核总分表界面-->
      <el-drawer
        title="新增考核总分表"
        :visible.sync="addFormVisible"
        size="100%"
        append-to-body
        :close-on-click-modal="false"
      >
        <jx-assess-grade-edit
          op-type="add"
          :jx-assess-scheme-exec="jxAssessSchemeExec"
          :visible="addFormVisible"
          @cancel="addFormVisible = false"
          @submit="afterAddSubmit"
        ></jx-assess-grade-edit>
      </el-drawer>
    </el-row>

    <el-dialog
      append-to-body
      title="选择部门"
      :visible.sync="deptSelectVisible"
      width="60%"
    >
      <dept-tree
        :show-confirm="true"
        show-root
        default-expand-all
        show-checkbox
        multiple
        :expand-on-click-node="false"
        @confirm="onDeptsSelected"
      ></dept-tree>
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
import config from "@/common/config"; //全局公共库
import {
  getDicts,
  initSimpleDicts,
  initComplexDicts,
} from "@/api/mdp/meta/item"; //字典表
import {
  listJxAssessGrade,
  delJxAssessGrade,
  batchDelJxAssessGrade,
  openToConfirm,
  batchSetGrade,
  closeGrade,
} from "@/api/oa/jx/jxAssessGrade";
import { listJxAssessScheme } from "@/api/oa/jx/jxAssessScheme";
import JxAssessGradeEdit from "./JxAssessGradeEdit"; //新增修改界面
import { mapGetters } from "vuex";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

export default {
  name: "JxAssessGradeMng",
  components: {
    JxAssessGradeEdit,
    DeptTree,
	UsersSelect,
  },
  props: [
    "visible",
    "jxAssessSchemeExec",
    "jxAssessScheme",
    "year",
    "assDeptid",
    "queryScene",
  ],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    visible(val) {
      if (val == true) {
        this.initData();
        this.searchJxAssessGrades();
      }
    },
  },
  data() {
    return {
      filters: {
        key: "",
        year: "",
        month: "",
        quarter: "",
        semiAnnual: "",
        annual: "",
        schemeType: "",
        schemeId: "",
        schemeExecId: "",
        status: "",
        queryScene: "",
        assUserid: "",
        assCstatus: "",
        reCstatus: "",
        isSelf: "",
        isReEval: "",
        isVouch: "",
        reUserid: "",
        vouchId: "",
        deptids: [],
        deptNames: "",
      },
      jxAssessGrades: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {}, //下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
      addFormVisible: false, //新增jxAssessGrade界面是否显示
      //新增jxAssessGrade界面初始化数据
      addForm: {
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
      editFormVisible: false, //编辑界面是否显示
      //编辑jxAssessGrade界面初始化数据
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
      maxTableHeight: 300,
      jxAssessSchemes: [],
      deptSelectVisible: false,
      reUserSelectVisible: false,
      vouchUserSelectVisible: false,
    };
  }, //end data
  methods: {
    handleClear() {
      this.searchJxAssessGrades();
    },
    searchOnEnter() {
      this.searchJxAssessGrades();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getJxAssessGrades();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getJxAssessGrades();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = [];
        this.pageInfo.orderDirs = [];
      } else {
        var dir = "asc";
        if (obj.order == "ascending") {
          dir = "asc";
        } else {
          dir = "desc";
        }

        this.pageInfo.orderFields = [util.toLine(obj.prop)];
        this.pageInfo.orderDirs = [dir];
      }
      this.getJxAssessGrades();
    },
    searchJxAssessGrades() {
      this.pageInfo.count = true;
      this.getJxAssessGrades();
    },
    //获取列表 JxAssessGrade 考核总分表
    getJxAssessGrades() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key) {
        params.key = this.filters.key;
      }
      if (this.filters.schemeType == "0") {
        if (this.filters.month) {
          params.month = this.filters.month;
        }
      } else if (this.filters.schemeType == "1") {
        if (this.filters.quarter) {
          params.quarter = this.filters.quarter;
        }
      } else if (this.filters.schemeType == "2") {
        if (this.filters.quarter) {
          params.semiAnnual = this.filters.semiAnnual;
        }
      } else if (this.filters.schemeType == "3") {
        if (this.filters.annual) {
          params.annual = this.filters.annual;
        }
      }
      if (this.filters.schemeId) {
        params.schemeId = this.filters.schemeId;
      }
      if (this.filters.year) {
        params.year = this.filters.year;
      }
      if (this.filters.status) {
        params.status = this.filters.status;
      }
      if (this.filters.schemeExecId) {
        params.schemeExecId = this.filters.schemeExecId;
      }

      if (this.filters.queryScene) {
        params.queryScene = this.filters.queryScene;
      }

      if (this.filters.isSelf) {
        params.isSelf = this.filters.isSelf;
      }

      if (this.filters.isReEval) {
        params.isReEval = this.filters.isReEval;
      }

      if (this.filters.isVouch) {
        params.isVouch = this.filters.isVouch;
      }

      if (this.filters.assCstatus) {
        params.assCstatus = this.filters.assCstatus;
      }

      if (this.filters.reCstatus) {
        params.reCstatus = this.filters.reCstatus;
      }

      if (this.filters.assUserid) {
        params.assUserid = this.filters.assUserid;
      }

      if (this.filters.reUserid) {
        params.reUserid = this.filters.reUserid;
      }

      if (this.filters.vouchId) {
        params.vouchId = this.filters.vouchId;
      }

      if (this.filters.deptids) {
        params.deptids = this.filters.deptids;
      }
      this.load.list = true;
      listJxAssessGrade(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.jxAssessGrades = res.data.data;
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

    //显示编辑界面 JxAssessGrade 考核总分表
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 JxAssessGrade 考核总分表
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getJxAssessGrades();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.searchJxAssessGrades();
    },
    //选择行jxAssessGrade
    selsChange: function (sels) {
      this.sels = sels;
    },
    openToConfirm(row) {
      this.editForm = row;
      openToConfirm({ id: row.id }).then((res) => {
        var tips = res.data.tips;
        this.$message({
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
        this.searchJxAssessGrades();
      });
    },
    //删除jxAssessGrade
    handleDel: function (row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = { id: row.id };
        delJxAssessGrade(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getJxAssessGrades();
            }
            this.$message({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除jxAssessGrade
    batchDel: function () {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelJxAssessGrade(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getJxAssessGrades();
            }
            this.$message({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    cellClick(row, column, cell, event) {
      if (column.label != "操作") {
        this.showEdit(row);
      }
    },
    initData: function () {
      if (this.jxAssessSchemeExec) {
        this.filters.schemeType = this.jxAssessSchemeExec.schemeType;
        this.filters.schemeExecId = this.jxAssessSchemeExec.id;
        this.filters.year = this.jxAssessSchemeExec.year;
        this.filters.month = this.jxAssessSchemeExec.month;
        this.filters.quarter = this.jxAssessSchemeExec.quarter;
        this.filters.semiAnnual = this.jxAssessSchemeExec.semiAnnual;
        this.filters.annual = this.jxAssessSchemeExec.annual;
      }
      if (this.jxAssessScheme) {
        this.filters.schemeType = this.jxAssessScheme.schemeType;
        this.filters.schemeId = this.jxAssessScheme.id;
      }
      if (this.year) {
        this.filters.year = this.year;
      }
      if (this.assDeptid) {
        this.filters.assDeptid = this.assDeptid;
      }
      if (this.queryScene == "MySelfConfirm") {
        this.filters.assUserid = this.userInfo.userid;
        this.filters.assCstatus = "0";
        this.filters.status = "1";
      }

      if (this.queryScene == "MyReConfirm") {
        this.filters.reUserid = this.userInfo.userid;
        this.filters.reCstatus = "0";
        this.filters.status = "2";
      }
      if (this.queryScene == "MySelfEval") {
        this.filters.assUserid = this.userInfo.userid;
        this.filters.isSelf = "0";
        this.filters.status = "3";
      }
      if (this.queryScene == "MyReEval") {
        this.filters.reUserid = this.userInfo.userid;
        this.filters.isReEval = "0";
        this.filters.status = "4";
      }
      if (this.queryScene == "MyVouch") {
        this.filters.vouchId = this.userInfo.userid;
        this.filters.isVouch = "0";
        this.filters.status = "5";
      }
    },

    //获取列表 JxAssessScheme 考核方案
    getJxAssessSchemes() {
      let params = {};
      params.orderBy = "scheme_type asc";
      this.load.list = true;
      listJxAssessScheme(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.jxAssessSchemes = res.data.data;
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
    onJxSchemeChange(val) {
      var scheme = this.jxAssessSchemes.find((i) => i.id == val);
      if (scheme) {
        this.filters.schemeId = scheme.id;
        this.filters.schemeType = scheme.schemeType;
      } else {
        this.filters.schemeId = "";
        this.filters.schemeType = "";
      }
    },
    onDeptsSelected(nodes) {
      if (nodes == null || nodes.length == 0) {
        this.filters.deptids = [];
        this.filters.deptNames = "";
      } else {
        this.filters.deptids = nodes.map((i) => i.deptid);
        this.filters.deptNames = nodes.map((i) => i.deptName).join(",");
      }
      this.deptSelectVisible = false;
      this.searchJxAssessGrades();
    },
    handleMoreCommand(command) {
      if (command == "batchSetReUser") {
        this.reUserSelectVisible = true;
      }else if (command == "batchSetVouchUser") {
        this.vouchUserSelectVisible = true;
      }else if (command == "batchFinishGrade") {
		  var params={
			  command:command,
			  ids:this.sels.map(i=>i.id)
		  }
		  this.batchSetGrade(params)
      }else if (command == "batchStartGrade") {
		  var params={
			  command:command,
			  ids:this.sels.map(i=>i.id)
		  }
      	  this.batchSetGrade(params)
      }else if (command == "batchDel") {
		  var params={
			  command:command,
			  ids:this.sels.map(i=>i.id)
		  }
		   this.batchSetGrade(params);
      }
    },

    onReUserSelected(users) {

		if(users==null || users.length==0){
			this.$message({
              showClose: true,
              message: "请选择一个用户",
              type: "error",
            });
			return;
		}
		if(users.length>1){
			this.$message({
              showClose: true,
              message: "只能选择一个用户",
              type: "error",
            });
			return;
		}
		this.reUserSelectVisible=false;
		var user=users[0]
		var params={
			ids:this.sels.map(i=>i.id),
			reUserid:user.userid,
			reUsername:user.username
		}
		params.command="batchSetReUser";
      	this.batchSetGrade(params)
    },
    onVouchUserSelected(users) {
		if(users==null || users.length==0){
			this.$message({
              showClose: true,
              message: "请选择一个用户",
              type: "error",
            });
			return;
		}
		if(users.length>1){
			this.$message({
              showClose: true,
              message: "只能选择一个用户",
              type: "error",
            });
			return;
		}
		var user=users[0]
		var params={
			ids:this.sels.map(i=>i.id),
			vouchId:user.userid,
			vouchName:user.username
		}
		this.vouchUserSelectVisible=false;
		params.command="batchSetVouchUser";
      	this.batchSetGrade(params)
    },
	batchSetGrade(params){

      this.$confirm("确认批量提交吗?", "提示", {
        type: "warning",
      }).then(() => {
		  this.load.edit=true;
      	batchSetGrade(params).then(res=>{
			  this.load.edit=false;
			var tips = res.data.tips;
            this.$message({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
			this.searchJxAssessGrades();
		})
	  })
	},

	closeGrade(params){

      this.$confirm("确认提交吗?", "提示", {
        type: "warning",
      }).then(() => {
		  this.load.edit=true;
      	closeGrade(params).then(res=>{
			  this.load.edit=false;
			var tips = res.data.tips;
            this.$message({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
			this.searchJxAssessGrades();
		})
	  })
	}
    /**begin 自定义函数请在下面加**/
  }, //end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData();
      this.getJxAssessSchemes();
      this.searchJxAssessGrades();
      if (this.$refs.jxAssessGradeTable) {
        var clientRect =
          this.$refs.jxAssessGradeTable.$el.getBoundingClientRect();
        var subHeight = (70 / 1000) * window.innerHeight;
        this.maxTableHeight =
          window.innerHeight -
          clientRect.y -
          this.$refs.jxAssessGradeTable.$el.offsetTop -
          subHeight;
      }
    });
  },
};
</script>

<style scoped>
</style>
