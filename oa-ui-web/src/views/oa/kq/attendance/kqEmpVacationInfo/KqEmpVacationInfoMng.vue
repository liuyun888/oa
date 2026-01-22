<template>
	<section class="page-container border padding">
        <el-row class="page-header">
          <el-input
            size="small"
            v-model="filters.deptNames"
            @focus="deptSelectVisible = true"
            style="width: 150px"
            placeholder="请选择部门"
          ></el-input>
          <el-date-picker v-model="filters.month" type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker>
          <el-input v-model="filters.key" style="width: 20%;" placeholder="员工名称模糊查询"></el-input>
          <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchKqEmpVacationInfos"
            icon="el-icon-search">查询</el-button>
        </el-row>
        <el-row class="page-main padding-top">
          <!--列表 KqEmpVacationInfo kq_emp_vacation_info-->
          <el-table :height="tableHeight" ref="procdefsTable" :data="kqEmpVacationInfos" @sort-change="sortChange"
            highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
            style="width: 100%;">
            <el-table-column sortable label="选择" type="selection" width="40"></el-table-column>
            <el-table-column sortable type="index" width="40"></el-table-column>
            <el-table-column prop="username" show-overflow-tooltip label="员工名称" min-width="80"></el-table-column>
            <el-table-column prop="deptName" show-overflow-tooltip label="部门" min-width="80"></el-table-column>
            <el-table-column prop="vacationName" show-overflow-tooltip label="请假类别" min-width="80"></el-table-column>
            <el-table-column prop="vacationHours" label="总时长" min-width="80"></el-table-column>
            <el-table-column prop="beginDate" show-overflow-tooltip label="开始日期" min-width="80"></el-table-column>
            <el-table-column prop="endDate" show-overflow-tooltip label="结束日期" min-width="80"></el-table-column>
            <el-table-column prop="reason" show-overflow-tooltip label="请假事由" min-width="80"></el-table-column>
            <el-table-column prop="bizFlowState" label="审批状态" min-width="80">
              <template slot-scope="scope">
                <!--当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除-->
                <el-link @click="showFlowTaskDetail(scope.row)">
                <el-tag v-if="scope.row.bizFlowState=='0'" type="primary">初始</el-tag>
                <el-tag v-else-if="scope.row.bizFlowState=='1'" type="primary">审批中</el-tag>
                <el-tag v-else-if="scope.row.bizFlowState=='2'" type="success">已通过</el-tag>
                <el-tag v-else-if="scope.row.bizFlowState=='3'" type="danger">已拒绝</el-tag>
                <el-tag v-else-if="scope.row.bizFlowState=='4'" type="danger">已取消</el-tag>
                {{scope.row.assigneeName}}&nbsp;&nbsp;{{scope.row.commentMsg}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="emergencyDegree" label="紧急程度" min-width="80">
              <template
                scope="scope">{{scope.row.emergencyDegree == '0'? '正常' : (scope.row.emergencyDegree == '1'? '重要' : '紧急') }}</template>
            </el-table-column>
            <el-table-column label="操作" width="260" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" @click="handleDel(scope.row,scope.$index)" icon="el-icon-edit" :disabled="scope.row.bizFlowState=='1'||scope.row.bizFlowState=='2'">发审</el-button>
                <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" :disabled="scope.row.bizFlowState=='1'||scope.row.bizFlowState=='2'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

        </el-row>
      <!--编辑 KqEmpVacationInfo kq_emp_vacation_info界面-->
      <el-dialog title="编辑 员工请假申请单" :visible.sync="editFormVisible" width="80%" :close-on-click-modal="false" top="1vh">
        <kq-emp-vacation-info-edit ref="child" :kq-emp-vacation-info="editForm" :visible="editFormVisible"
          @cancel="editFormVisible=false" @submit="afterEditSubmit"></kq-emp-vacation-info-edit>
      </el-dialog>

      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
        :close-on-click-modal="false">
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId" :procInstId="tasks[0].procInstId"
          :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false" @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>


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
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  import config from "@/common/config"; //全局公共库
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listKqEmpVacationInfo,
    delKqEmpVacationInfo,
    batchDelKqEmpVacationInfo
  } from "@/api/oa/kq/kqEmpVacationInfo";
  import KqEmpVacationInfoEdit from "./KqEmpVacationInfoEdit"; //修改界面
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
  import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

  import {
    listAssigneeToAnyTasks
  } from "@/api/mdp/workflow/ru/task";

  import {
    listProcinst
  } from "@/api/mdp/workflow/hi/procinst";

  import {
    mapGetters
  } from "vuex";

  export default {
    props:['queryScene'],
    computed: {
      ...mapGetters(["userInfo"])
    },
    data() {
      return {
        filters: {
          key: "",
          month: "",
          deptNames:'',
          deptids:'',
        },
        kqEmpVacationInfos: [], //查询结果
        pageInfo: {
          //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 10, //每页数据
          count: false, //是否需要重新计算总记录数
          pageNum: 1, //当前页码、从1开始计算
          orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        },
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

        addFormVisible: false, //新增kqEmpVacationInfo界面是否显示
        //新增kqEmpVacationInfo界面初始化数据
        editFormVisible: false, //编辑界面是否显示
        //编辑kqEmpVacationInfo界面初始化数据
        editForm: {
          id: "",
          userid: "",
          username: "",
          deptid: "",
          deptName: "",
          vacationId: "",
          vacationType: "",
          beginDate: "",
          endDate: "",
          reason: "",
          branchId: "",
          beginTime: "",
          endTime: "",
          emergencyDegree: "",
          dutyDescription: "",
          number: "",
          title: "",
          accessory: ""
        },
        tableHeight: 300,
        flowTaskDetailVisible:false,
        tasks:[],
        deptSelectVisible:false,
        /**begin 自定义属性请在下面加 请加备注**/

        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getKqEmpVacationInfos();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getKqEmpVacationInfos();
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
        this.getKqEmpVacationInfos();
      },
      searchKqEmpVacationInfos() {
        this.pageInfo.count = true;
        this.getKqEmpVacationInfos();
      },
      //获取列表 KqEmpVacationInfo kq_emp_vacation_info
      getKqEmpVacationInfos() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
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
        }

        var deptids=this.filters.deptids;
        if(deptids.length>0){
          params.deptids=deptids;
        }
        if (this.filters.month !== "") {
          params.month = this.filters.month
        }
        if(this.queryScene=='my'){
          params.userid=this.userInfo.userid
        }
        this.load.list = true;
        listKqEmpVacationInfo(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.kqEmpVacationInfos = res.data.data;
            } else {
              this.$message({
                message: tips.msg,
                type: "error"
              });
            }
            this.load.list = false;
          })
          .catch(err => (this.load.list = false));
      },

      //显示编辑界面 KqEmpVacationInfo kq_emp_vacation_info
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getKqEmpVacationInfos();
      },
      //选择行kqEmpVacationInfo
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除kqEmpVacationInfo
      handleDel: function(row, index) {
        if (row.bizFlowState == '0' || !row.bizFlowState || row.bizFlowState == '3'||row.bizFlowState == '4') {

        } else {
          this.$message.error("审核中或者审核通过的数据，不允许删除");
          return;
        }
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delKqEmpVacationInfo(params)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getKqEmpVacationInfos();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      //批量删除kqEmpVacationInfo
      batchDel: function() {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          batchDelKqEmpVacationInfo(this.sels)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getKqEmpVacationInfos();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      rowClick: function(row, event, column) {
        if(event.property!='bizFlowState'&&event.label!='操作'&&event.type!='selection'){
           this.showEdit(row)
        }
        this.$emit("row-click", row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/

      showApprovaInfo: function(row) {
        var msgFields = [];
        if (row.mainTitle != null && row.mainTitle != "") {
          msgFields.push("流程【" + row.mainTitle + "】");
        }

        if (row.taskName != null && row.taskName != "") {
          msgFields.push("当前环节【" + row.taskName + "】");
        }

        if (row.assigneeName != null && row.assigneeName != "") {
          msgFields.push("执行人【" + row.assigneeName + "】");
        }

        if (row.commentMsg != null && row.commentMsg != "") {
          msgFields.push("审批意见【" + row.commentMsg + "】");
        }
        var msg = msgFields.join(",");
        return msg;
      },

      sendToProcessApprova: function(row, bizKey) {
        if (row.bizFlowState == '1') {
          this.$message.error("审核中，不允许重新发起");
          return;
        }
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
          mainTitle = '关于【' + titleNames + "请假" + row.number + "小时】的审批"
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
      handleCommand(command) {
        if (command.type == 'sendToProcessApprova') {
          this.sendToProcessApprova(command.row, 'employee_vacation_info_approva');
        }
      },
      showFlowTaskDetail(row){
        if(row.bizProcInstId){
          if(row.bizFlowState=='1'){
            var params={
              procInstId:row.bizProcInstId,
              assignee:this.userInfo.userId,
              tenantId:this.userInfo.branchId,
            }
            this.load.list=true;
            listAssigneeToAnyTasks(params)
                .then(res => {
                  var tips = res.data.tips;
                  if (tips.isOk) {
                    var taskList = res.data.data;
                    taskList.forEach(i => {
                      i.taskId = i.id;
                      i.actId = i.taskDefKey;
                      i.taskName = i.name;
                    });
                    this.tasks = taskList;
                    this.flowTaskDetailVisible=true;
                  } else {
                    this.$message({showClose: true,
                      message: tips.msg,
                      type: "error"
                    });
                  }
                  this.load.list = false;
                })
                .catch(() => {
                  this.load.list = false;
                });
          }else{
            var params={
              procInstId:row.bizProcInstId,
            }
            this.load.list=true;
            listProcinst(params)
                .then(res => {
                  var tips = res.data.tips;
                  if (tips.isOk) {
                    var taskList = res.data.data;
                    this.tasks = taskList;
                    this.flowTaskDetailVisible=true;
                  } else {
                    this.$message({showClose: true,
                      message: tips.msg,
                      type: "error"
                    });
                  }
                  this.load.list = false;
                })
                .catch(() => {
                  this.load.list = false;
                });

          }

        }else{

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
        this.searchKqEmpVacationInfos();
      },
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      "kq-emp-vacation-info-edit": KqEmpVacationInfoEdit,
      DeptTree,ProcinstParamesExecutionSet,
      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getKqEmpVacationInfos();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  };
</script>

<style scoped>
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
