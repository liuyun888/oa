<template>
  <section>
    <el-row class="page-container border padding">
      <el-col class="hidden-sm-and-down" :span="!applianceId ? 5 : 0">
        <el-tree
            :data="treeData"
            :highlight-current="true"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree"
        ></el-tree>
      </el-col>
      <el-col :span="!applianceId ? 19 : 24">
        <el-row class="page-header">
          <el-input
              v-model="filters.key"
              style="width: 20%"
              placeholder="用品名称 模糊查询" clearable
              @clear="handleClear" @keyup.enter.native="searchOnEnter"
          ></el-input>
          <el-button
              type="primary"
              v-loading="load.list"
              :disabled="load.list == true"
              v-on:click="searchOmApplianceRequires"
              icon="el-icon-search"
          >查询
          </el-button
          >
          <!--            <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除</el-button>-->
          <el-select
              class="hidden-md-and-down"
              v-model="status"
              placeholder="请选择状态"
              style="margin-right: 20px"
              @change="onChangStatus"
          >
            <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
              class="hidden-md-and-down"
              @click="deriveExcel(omApplianceRequires)"
              icon="el-icon-download"
          >导出
          </el-button
          >
        </el-row>
        <el-row>
          <el-table
              ref="requireTable"
              :height="tableHeight"
              :data="omApplianceRequires"
              @sort-change="sortChange"
              highlight-current-row
              v-loading="load.list"
              border
              @selection-change="selsChange"
              @row-click="rowClick"
              style="width: 100%"
          >
            <el-table-column
                show-overflow-tooltip
                sortable
                type="selection"
                width="40"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                sortable
                type="index"
                width="40"
            ></el-table-column>
            <!-- <el-table-column prop="id" label="申请单号" min-width="80" ></el-table-column> -->
            <el-table-column
                show-overflow-tooltip
                prop="applianceName"
                label="用品名称"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="standard"
                label="规格"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="num"
                label="使用数量"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="stock"
                label="当前库存"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="remark"
                label="说明"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="username"
                label="申请人"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="deptName"
                label="部门"
                min-width="80"
            ></el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="useType"
                label="使用类型"
                min-width="80"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.useType == '0'">个人使用</span>
                <span v-else>部门使用</span>
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="receiveType"
                label="领取方式"
                min-width="80"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.receiveType == '0'">自取</span>
                <span v-else-if="scope.row.receiveType == '1'">快递</span>
                <span v-else-if="scope.row.receiveType == '2'">他人代领</span>
                <span v-else>仓库配送</span>
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="useTime"
                label="领用日期"
                min-width="80"
            ></el-table-column>
            <!-- <el-table-column prop="createTime" label="申请时间" min-width="80" ></el-table-column> -->
            <el-table-column
                show-overflow-tooltip
                prop="status"
                label="状态"
                min-width="80"
            >
              <template slot-scope="scope">
                <el-link @click="showFlowTaskDetail(scope.row)">
                  <span v-if="scope.row.status == '0'">未审批</span>
                  <span v-else-if="scope.row.status == '1'">审批中</span>
                  <span v-else-if="scope.row.status == '2'">待领取</span>
                  <span v-else-if="scope.row.status == '3'">已领取</span>
                  <span v-else-if="scope.row.status == '4'">未通过</span>
                  <span v-else-if="scope.row.status == '5'">流程取消</span>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                label="操作"
                width="200"
                fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                    type="text"
                    @click="showApprova(scope.row, scope.$index)"
                >发审
                </el-button
                >
                <el-button
                    type="text"
                    @click="showEdit(scope.row, scope.$index)"
                    icon="el-icon-edit"
                ></el-button>
                <el-button
                    type="text"
                    @click="handleDel(scope.row, scope.$index)"
                    icon="el-icon-delete"
                ></el-button>
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
      </el-col>
    </el-row>
    <!--编辑 OmApplianceRequire om_appliance_require界面-->
    <el-dialog
        title="编辑申请"
        :visible.sync="editFormVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
    >
      <om-appliance-require-edit
          :om-appliance-require="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible = false"
          @submit="afterEditSubmit"
      ></om-appliance-require-edit>
    </el-dialog>
    <!--新增 OmApplianceRequire om_appliance_require界面-->
    <el-dialog
        title="使用申请"
        :visible.sync="addFormVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
    >
      <om-appliance-require-add
          :om-appliance-require="addForm"
          :visible="addFormVisible"
          @cancel="addFormVisible = false"
          @submit="afterAddSubmit"
      ></om-appliance-require-add>
    </el-dialog>

    <el-drawer
        fullscreen
        size="100%"
        title="任务详情"
        :visible.sync="flowTaskDetailVisible"
        :withHeader="false"
        :close-on-click-modal="false"
    >
      <procinst-parames-execution-set
          v-if="tasks.length > 0"
          :taskInfo="tasks[0]"
          :procDefId="tasks[0].procDefId"
          :procInstId="tasks[0].procInstId"
          :visible="flowTaskDetailVisible"
          @cancel="flowTaskDetailVisible = false"
          @submit="afterFlowSubmit"
      >
      </procinst-parames-execution-set>
    </el-drawer>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listOmApplianceRequire,
  delOmApplianceRequire,
  batchDelOmApplianceRequire,
} from "@/api/oa/om/omApplianceRequire";
import OmApplianceRequireAdd from "./OmApplianceRequireAdd"; //新增界面
import OmApplianceRequireEdit from "./OmApplianceRequireEdit"; //修改界面
import {getAllOmAppliance} from "@/api/oa/om/omCategory";
import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
import {
  listAssigneeToAnyTasks
} from "@/api/mdp/workflow/ru/task";

import {
  listProcinst
} from "@/api/mdp/workflow/hi/procinst";

import {mapGetters} from "vuex";

export default {
  props: ["applianceId", 'queryScene'],
  computed: {
    ...mapGetters(["userInfo"]),
    menuTop: function () {
      return screen.height;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      filters: {
        key: "",
        applianceId: "", //用品id
      },
      omApplianceRequires: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["ltime"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false}, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增omApplianceRequire界面是否显示
      //新增omApplianceRequire界面初始化数据
      addForm: {
        id: "",
        applianceId: "",
        applianceName: "",
        standard: "",
        num: "",
        stock: "",
        remark: "",
        useType: "0",
        receiveType: "0",
        useTime: new Date().getTime(),
        createTime: "",
        status: "",
        branchId: "",
        receiveName: "",
        userid: "",
        username: "",
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑omApplianceRequire界面初始化数据
      editForm: {
        id: "",
        applianceId: "",
        applianceName: "",
        standard: "",
        num: "",
        stock: "",
        remark: "",
        useType: "",
        receiveType: "",
        useTime: "",
        createTime: "",
        status: "",
        branchId: "",
        receiveName: "",
        userid: "",
        username: "",
      },
      /**begin 自定义属性请在下面加 请加备注**/

      //侧面抽屉
      itemSpan: 20,
      menuSpan: 4,
      //是否展示右侧内容
      isShowNav: true,
      //事项分类的id
      categoryId: "",
      treeData: [
        {
          name: "默认分类",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },

      filterText: "", //用品搜索框


      status: "", //要查询的状态
      tableHeight: 300,
      selectOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "未审批",
        },
        {
          value: "1",
          label: "审批中",
        },
        {
          value: "2",
          label: "待领取",
        },
        {
          value: "3",
          label: "已领取",
        },
        {
          value: "4",
          label: "未通过",
        },
        {
          value: "5",
          label: "流程取消",
        },
      ],
      tasks: [],
      flowTaskDetailVisible: false,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleClear() {
      this.searchOmApplianceRequires();
    },
    searchOnEnter() {
      this.searchOmApplianceRequires();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getOmApplianceRequires();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getOmApplianceRequires();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getOmApplianceRequires();
    },
    searchOmApplianceRequires() {
      this.pageInfo.count = true;
      this.getOmApplianceRequires();
    },
    //获取列表 OmApplianceRequire om_appliance_require
    getOmApplianceRequires() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        branchId: this.userInfo.branchId,
        applianceId: this.filters.applianceId,
        categoryId: this.categoryId,
        status: this.status,
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
      if (this.filters.key !== "") {
        params.key = this.filters.key;
      } else {
        //params.xxx=xxxxx
      }

      if (this.applianceId) {
        params.applianceId = this.applianceId;
      }
      if (this.queryScene == 'my') {
        params.userid = this.userInfo.userid
      }
      this.load.list = true;
      listOmApplianceRequire(params)
          .then((res) => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.omApplianceRequires = res.data.data;
            } else {
              this.$message({message: tips.msg, type: "error"});
            }
            this.load.list = false;
          })
          .catch((err) => (this.load.list = false));
    },

    //显示编辑界面 OmApplianceRequire om_appliance_require
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 OmApplianceRequire om_appliance_require
    showAdd: function () {
      this.addForm.useType = "0";
      this.addForm.receiveType = "0";
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit(val) {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getOmApplianceRequires();
      this.sendToProcessApprova(val, "om_appliance_require_approva");
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行omApplianceRequire
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除omApplianceRequire
    handleDel: function (row, index) {
      if (row.status == "1" || row.status == "2" || row.status == "3") {
        this.$message.error("当前状态不允许删除");
        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delOmApplianceRequire(params)
            .then((res) => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getOmApplianceRequires();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error",
              });
            })
            .catch((err) => (this.load.del = false));
      });
    },
    //批量删除omApplianceRequire
    batchDel: function () {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelOmApplianceRequire(this.sels)
            .then((res) => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getOmApplianceRequires();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error",
              });
            })
            .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row, event, column) {
      if (event.label != '操作' && event.type != 'selection' && event.label != '状态') {
        this.showEdit(row)
      }
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/

    //开启右侧抽屉
    openDrawer() {
      this.isShowNav = !this.isShowNav;
      this.isShowNav ? (this.itemSpan = 20) : (this.itemSpan = 24);
    },
    handleNodeClick(value) {
      this.filters.applianceId = "";
      //console.log(value.id != null)
      if (value.id != null) {
        this.filters.applianceId = value.id;
        this.$nextTick(() => {
          this.getOmApplianceRequires();
        });
      }
    },
    getAllOmAppliance() {
      if (this.applianceId) {
        return;
      }
      let params = {
        branchId: this.userInfo.branchId,
      };
      getAllOmAppliance(params)
          .then((res) => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.treeData = res.data.data;
              //console.log(res.data.data)
            } else {
              this.$message({message: tips.msg, type: "error"});
            }
          })
          .catch((err) => this.getAllOmAppliance());
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    onChangStatus(value) {
      //console.log(value)
      this.getOmApplianceRequires();
    },

    //导出
    deriveExcel(resData) {
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "字号",
          "用品名称",
          "规格",
          "使用数量",
          "当前库存",
          "说明",
          "使用类型",
          "领取方式",
          "领用日期",
          "状态",
        ];
        const filterVal = [
          "id",
          "applianceName",
          "standard",
          "num",
          "stock",
          "remark",
          "useType",
          "receiveType",
          "useTime",
          "status",
        ];
        const list = resData;
        const data = this.formatJson(filterVal, list);
        var filename = "用品申请记录表";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
              ? this.formDefSelected.formName
              : this.formDefSelected.id + "用品申请记录表";
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx",
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
          filterVal.map((j) => {
            if (j === "timestamp") {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
      );
    },
    showApprova: function (row, index) {
      if (row.status == "1" || row.status == "2" || row.status == "3") {
        this.$message.error("当前状态不允许重新发起流程");
        return;
      }

      this.sendToProcessApprova(row, "om_appliance_require_approva");
    },
    sendToProcessApprova: function (row, bizKey) {
      let extVars = {omApplianceRequireId: row.id};
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl =
          currDomain +
          "/" +
          process.env.CONTEXT +
          "/" +
          process.env.VERSION +
          "/#" +
          fullPath +
          "?extVars=" +
          jsonExtVars;

      var titleNames = row.username;
      var mainTitle = "";
      var mainContext = "";
      if (bizKey == "om_appliance_require_approva") {

        mainTitle = '关于【' + row.username + '申领办公用品' + row.applianceName + row.num + (row.unit ? row.unit : '') + '】的申请';
        mainContext = '申请人：' + row.username + ',' + '用品名称：' + row.applianceName + ',规格：' + row.stanrd + ',申领数量：' + row.num + ',当前库存：' + row.stock
            + '<br>申领说明：' + row.remark;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl:
            config.getOaBasePath() + "/om/omApplianceRequire/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: "TASK_COMPLETED,TASK_CREATED",
          branchId: row.branchId,
          omApplianceRequireId: row.id,
          num: row.num,
          applianceId: row.applianceId,
        },
      };
      let jsonParmas = encodeURIComponent(JSON.stringify(params)); //对方要 decodeURIComponent
      this.$router.push({
        path: "/mdp/workflow/re/procdef/ProcdefListForBizStart",
        query: {params: jsonParmas},
      });
    },

    /**end 自定义函数请在上面加**/

    showFlowTaskDetail(row) {
      if (row.bizProcInstId) {
        if (row.bizFlowState == "1") {
          var params = {
            procInstId: row.bizProcInstId,
            assignee: this.userInfo.userId,
            tenantId: this.userInfo.branchId,
          };
          this.load.list = true;
          listAssigneeToAnyTasks(params)
              .then((res) => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  var taskList = res.data.data;
                  taskList.forEach((i) => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                  this.flowTaskDetailVisible = true;
                } else {
                  this.$message({
                    showClose: true,
                    message: tips.msg,
                    type: "error",
                  });
                }
                this.load.list = false;
              })
              .catch(() => {
                this.load.list = false;
              });
        } else {
          var params = {
            procInstId: row.bizProcInstId,
          };
          this.load.list = true;
          listProcinst(params)
              .then((res) => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  var taskList = res.data.data;
                  this.tasks = taskList;
                  this.flowTaskDetailVisible = true;
                } else {
                  this.$message({
                    showClose: true,
                    message: tips.msg,
                    type: "error",
                  });
                }
                this.load.list = false;
              })
              .catch(() => {
                this.load.list = false;
              });
        }
      } else {
      }
    },
    afterFlowSubmit() {
      this.flowTaskDetailVisible = false;
      this.searchOmApplianceRequires();
    }
  }, //end methods
  components: {
    "om-appliance-require-add": OmApplianceRequireAdd,
    "om-appliance-require-edit": OmApplianceRequireEdit,
    ProcinstParamesExecutionSet,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllOmAppliance();
      this.getOmApplianceRequires();
      var clientRect = this.$refs.requireTable.$el.getBoundingClientRect();
      var subHeight = (60 / 1000) * window.innerHeight;
      this.tableHeight =
          window.innerHeight -
          clientRect.y -
          this.$refs.requireTable.$el.offsetTop -
          subHeight;
    });
  },
};
</script>

<style scoped>
.itemTable {
  position: relative;
}

.showMenuIcon {
  font-size: 40px;
  /* color: royalblue; */
  position: absolute;
  cursor: pointer;
  left: -15px;
  height: 58px;
  padding: 10px;
  background: url("../../../../assets/image/show-drawer.png") -2px 0px no-repeat;
}
</style>
