<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-date-picker v-model="filters.month" type="month" value-format="yyyy-MM" placeholder="选择月">
      </el-date-picker>
      <el-input v-model="filters.key" style="width: 20%;" placeholder="员工名称 模糊查询"></el-input>
      <el-button icon="el-icon-search" type="primary" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchKqWorkOvertimeInfos">查询</el-button>
    </el-row>
		<el-row class="page-main padding-top">
      <!--列表 KqWorkOvertimeInfo kq_work_overtime_info-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="kqWorkOvertimeInfos" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="username" show-overflow-tooltip label="员工名称" min-width="80"></el-table-column>
        <el-table-column prop="title" show-overflow-tooltip label="标题" min-width="80"></el-table-column>
        <el-table-column prop="workOvertimeType" show-overflow-tooltip label="加班类型" min-width="80">
          <template
            scope="scope">{{scope.row.workOvertimeType == '0' ? '工作日加班':(scope.row.workOvertimeType == '1' ? '双休日加班' : '法定假日加班') }}</template>
        </el-table-column>
        <el-table-column prop="beginTime" show-overflow-tooltip label="开始时间" min-width="80"></el-table-column>
        <el-table-column prop="endTime" show-overflow-tooltip label="结束时间" min-width="80"></el-table-column>
        <el-table-column prop="workOvertimeHours" label="加班小时数" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reasonWorkOvertime" label="加班原因" min-width="80"></el-table-column>
        <el-table-column prop="deptName" show-overflow-tooltip label="部门名称" min-width="80"></el-table-column>
        <el-table-column prop="applyTime" show-overflow-tooltip label="申请时间" min-width="80"></el-table-column>
        <el-table-column prop="bizFlowState" label="审批状态" min-width="80">
          <template slot-scope="scope">
            <el-tooltip :content="showApprovaInfo(scope.row)" placement="bottom" effect="light">
              <el-tag v-if="scope.row.bizFlowState=='0'">未发审</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='1'">审核中</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='2'">已通过</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='3'">未通过</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='4'">已取消</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
            <el-dropdown @command="handleCommand" :hide-on-click="false">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-success" :command="{type:'sendToProcessApprova',row:scope.row}">发审
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 KqWorkOvertimeInfo kq_work_overtime_info界面-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" width="80%" :close-on-click-modal="false">
        <kq-work-overtime-info-edit :kq-work-overtime-info="editForm" :visible="editFormVisible"
          @cancel="editFormVisible=false" @submit="afterEditSubmit"></kq-work-overtime-info-edit>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  import config from "@/common/config"; //全局公共库
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listKqWorkOvertimeInfo,
    delKqWorkOvertimeInfo,
    batchDelKqWorkOvertimeInfo
  } from "@/api/oa/kq/kqWorkOvertimeInfo";
  import KqWorkOvertimeInfoAdd from "./KqWorkOvertimeInfoAdd"; //新增界面
  import KqWorkOvertimeInfoEdit from "./KqWorkOvertimeInfoEdit"; //修改界面
  import {
    mapGetters
  } from "vuex";

  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    data() {
      return {
        filters: {
          key: "",
          month: "",
        },
        kqWorkOvertimeInfos: [], //查询结果
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
        editFormVisible: false, //编辑界面是否显示
        //编辑kqWorkOvertimeInfo界面初始化数据
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
          bizFlowState: ""
        },
        tableHeight: 300
        /**begin 自定义属性请在下面加 请加备注**/

        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getKqWorkOvertimeInfos();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getKqWorkOvertimeInfos();
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
        this.getKqWorkOvertimeInfos();
      },
      searchKqWorkOvertimeInfos() {
        this.pageInfo.count = true;
        this.getKqWorkOvertimeInfos();
      },
      //获取列表 KqWorkOvertimeInfo kq_work_overtime_info
      getKqWorkOvertimeInfos() {
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
          params.key = this.filters.key
        }
        if (this.filters.month !== "") {
          params.month = this.filters.month
        }
        this.load.list = true;
        listKqWorkOvertimeInfo(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.kqWorkOvertimeInfos = res.data.data;
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
      //显示编辑界面 KqWorkOvertimeInfo kq_work_overtime_info
      showEdit: function(row, index) {
        if (row.bizFlowState == '2') {
          this.$message.error("审核通过的数据，不允许修改");
          return;
        }
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },

      afterEditSubmit() {
        this.editFormVisible = false;
        this.getKqWorkOvertimeInfos();
      },
      //选择行kqWorkOvertimeInfo
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除kqWorkOvertimeInfo
      handleDel: function(row, index) {
        if (row.bizFlowState == '0' || row.bizFlowState == null || row.bizFlowState == '') {

        } else {
          this.$message.error("审核中，不允许删除");
          return;
        }
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delKqWorkOvertimeInfo(params)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getKqWorkOvertimeInfos();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      //批量删除kqWorkOvertimeInfo
      batchDel: function() {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          batchDelKqWorkOvertimeInfo(this.sels)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getKqWorkOvertimeInfos();
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
          workOvertimeId: row.id
        }
        let jsonExtVars = JSON.stringify(extVars);

        var currDomain = window.location.protocol + "//" + window.location.host;
        var fullPath = this.$route.fullPath;
        var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath +
          '?extVars=' + jsonExtVars

        var titleNames = row.username
        var mainTitle = ''
        var mainContext = ''
        if (bizKey == 'work_overtime_info_approva') {
          mainTitle = '关于【' + titleNames + "加班" + row.workOvertimeHours + "小时】的审批"
          mainContext = mainTitle + ',加班原因：' + row.reasonWorkOvertime + ",开始日期：" + row.beginTime + ",结束日期：" + row
            .endTime;
        } else {
          this.$message.error("暂不支持的业务审批");
          return;
        }

        let params = {
          mainContext: mainContext,
          mainTitle: mainTitle,
          bizKey: bizKey,
          bizUrl: bizUrl,
          restUrl: config.getOaBasePath() + "/kq/kqWorkOvertimeInfo/processApprova",
          extVars: extVars,
          flowVars: {
            subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
            branchId: row.branchId,
            workOvertimeId: row.id
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
          this.sendToProcessApprova(command.row, 'work_overtime_info_approva');
        }
      }
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      "kq-work-overtime-info-add": KqWorkOvertimeInfoAdd,
      "kq-work-overtime-info-edit": KqWorkOvertimeInfoEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getKqWorkOvertimeInfos();
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
