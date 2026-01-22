<template>
  <section class="page-container border padding">
    <el-row v-if="contractCard === undefined " class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="合同名称 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 13px;" v-loading="load.list"
                 :disabled="load.list==true" v-on:click="searchContractReceives">查询
      </el-button>
      <el-button icon="el-icon-plus" style="margin-left: 0;margin-right: 13px;" @click="showAdd">新建</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 ContractReceive ht_contract_receive-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="contractReceives" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>

        <el-table-column prop="htName" label="合同名称" min-width="120">

          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{ scope.row.htName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="conditionType" label="款项" min-width="150">
          <template slot-scope="scope">
             <span class="detail" @click="gotoDetail(scope.row)">
               <el-tag
                   v-if="scope.row.conditionStatus=='0'||scope.row.conditionStatus==''||scope.row.conditionStatus==null"
                   type="primary">{{ getConditionStatusName(scope.row) }}</el-tag>
               <el-tag v-else-if="scope.row.conditionStatus=='1'"
                       type="warning">{{ getConditionStatusName(scope.row) }}</el-tag>
               <el-tag v-else-if="scope.row.conditionStatus=='2'"
                       type="success">{{ getConditionStatusName(scope.row) }}</el-tag>
               <el-tag v-else type="info">{{ getConditionStatusName(scope.row) }}</el-tag>
               &nbsp;&nbsp;<font color="#F00">{{ getConditionTypeName(scope.row) }}</font>
               <br>{{ scope.row.conditionTiaoJian }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="office" label="付款单位" min-width="80">
          <template slot-scope="scope">
            <span class="detail" @click="gotoDetail(scope.row)">{{ scope.row.office }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="conditionAmount" label="应收金额" min-width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.conditionAmount }}
          </template>
        </el-table-column>

        <el-table-column prop="amount" show-overflow-tooltip label="到款金额" min-width="80">
          <template slot-scope="scope">
            ￥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveDate" show-overflow-tooltip label="到款日期" min-width="80"></el-table-column>
        <el-table-column prop="title" label="审批状态" min-width="80">
          <template slot-scope="scope">
            <!--当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除-->
            <el-link @click="showFlowTaskDetail(scope.row)">
              <el-tag v-if="scope.row.bizFlowState=='0'" type="primary">初始</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='1'" type="primary">审批中</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='2'" type="success">已通过</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='3'" type="danger">已拒绝</el-tag>
              <el-tag v-else-if="scope.row.bizFlowState=='4'" type="danger">已取消</el-tag>
              {{ scope.row.assigneeName }}&nbsp;&nbsp;{{ scope.row.commentMsg }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 ContractReceive ht_contract_receive界面-->
      <el-dialog custom-class="tempDialog" append-to-body :visible.sync="editFormVisible" :fullscreen="true"
                 :close-on-click-modal="false">
        <contract-receive-edit :contract-receive="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                               @submit="afterEditSubmit"></contract-receive-edit>
      </el-dialog>

      <!--新增 ContractReceive ht_contract_receive界面-->
      <el-dialog custom-class="tempDialog" append-to-body :visible.sync="addFormVisible" :fullscreen="true"
                 :close-on-click-modal="false">
        <contract-receive-add :contract-receive="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                              @submit="afterAddSubmit"></contract-receive-add>
      </el-dialog>
      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
                 :close-on-click-modal="false" append-to-body>
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId"
                                        :procInstId="tasks[0].procInstId"
                                        :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false"
                                        @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listContractReceive,
  delContractReceive,
  batchDelContractReceive
} from '@/api/oa/ht/contractReceive';
import ContractReceiveAdd from './ContractReceiveAdd'; //新增界面
import ContractReceiveEdit from './ContractReceiveEdit'; //修改界面
import {
  mapGetters
} from 'vuex'
import {getDicts, initSimpleDicts, initComplexDicts} from '@/api/mdp/meta/item';//字典表

import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载

import {
  listAssigneeToAnyTasks
} from "@/api/mdp/workflow/ru/task";

import {
  listProcinst
} from "@/api/mdp/workflow/hi/procinst";

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  props: ['contractCard'],
  data() {
    return {
      filters: {
        key: ''
      },
      contractReceives: [], //查询结果
      pageInfo: { //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ['create_time'], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc'] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },

      load: {
        list: false,
        edit: false,
        del: false,
        add: false
      }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      addFormVisible: false, //新增contractReceive界面是否显示
      //新增contractReceive界面初始化数据
      addForm: {
        id: '',
        htId: '',
        htName: '',
        htSn: '',
        conditionId: '',
        conditionTiaoJian: '',
        amount: '',
        receiveDate: '',
        bank: '',
        bankAccount: '',
        office: '',
        receiveType: '',
        receiveAmount: '',
        matchStatus: '',
        createUserId: '',
        createUserName: '',
        createTime: '',
        branchId: ''
      },
      editFormVisible: false, //编辑界面是否显示
      //编辑contractReceive界面初始化数据
      editForm: {
        id: '',
        htId: '',
        htName: '',
        htSn: '',
        conditionId: '',
        conditionTiaoJian: '',
        amount: '',
        receiveDate: '',
        bank: '',
        bankAccount: '',
        office: '',
        receiveType: '',
        receiveAmount: '',
        matchStatus: '',
        createUserId: '',
        createUserName: '',
        createTime: '',
        branchId: ''
      },
      tableHeight: 300,
      dicts: {
        amountType: [],
      },
      tasks: [],
      flowTaskDetailVisible: false,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchContractReceives();
    },
    searchOnEnter() {
      this.searchContractReceives();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getContractReceives();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getContractReceives();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = 'asc';
      if (obj.order == 'ascending') {
        dir = 'asc'
      } else {
        dir = 'desc';
      }
      if (obj.prop == 'xxx') {
        this.pageInfo.orderFields = ['xxx'];
        this.pageInfo.orderDirs = [dir];
      }
      this.getContractReceives();
    },
    searchContractReceives() {
      this.pageInfo.count = true;
      this.getContractReceives();
    },
    //获取列表 ContractReceive ht_contract_receive
    getContractReceives() {
      let htId = util.isNull(this.contractCard) ? null : this.contractCard.htId;
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        htId: htId
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      if (this.filters.key !== "") {
        //params.xxx=this.filters.key
        params.key = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listContractReceive(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.contractReceives = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 ContractReceive ht_contract_receive
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 ContractReceive ht_contract_receive
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
      if (!util.isNull(this.contractCard)) {
        this.addForm.htId = this.contractCard.htId;
        this.addForm.htName = this.contractCard.htName;
        this.addForm.htSn = this.contractCard.htSn;
      }
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getContractReceives();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行contractReceive
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除contractReceive
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delContractReceive(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractReceives();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除contractReceive
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelContractReceive(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getContractReceives();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    gotoDetail(data) {
      this.showEdit(data);
    },
    getConditionTypeName(row) {
      var amountType = this.dicts.amountType.find(i => i.id == row.conditionType);
      if (amountType) {
        return amountType.name
      } else {
        return row.conditionType
      }
    },
    getConditionStatusName(row) {
      if (row.dct == '1') {
        if (row.conditionStatus == '0') {
          return "初始"
        } else if (row.conditionStatus == '1') {
          return "待收款"
        } else {
          return "已收款"
        }
      } else {
        if (row.conditionStatus == '0') {
          return "初始"
        } else if (row.conditionStatus == '1') {
          return "待付款"
        } else {
          return "已付款"
        }
      }
    },
    showFlowTaskDetail(row) {
      if (row.bizProcInstId) {
        if (row.bizFlowState == '1') {
          var params = {
            procInstId: row.bizProcInstId,
            assignee: this.userInfo.userId,
            tenantId: this.userInfo.branchId,
          }
          this.load.list = true;
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
                  this.flowTaskDetailVisible = true;
                } else {
                  this.$message({
                    showClose: true,
                    message: tips.msg,
                    type: "error"
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
          }
          this.load.list = true;
          listProcinst(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  var taskList = res.data.data;
                  this.tasks = taskList;
                  this.flowTaskDetailVisible = true;
                } else {
                  this.$message({
                    showClose: true,
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

      } else {

      }

    },
    afterFlowSubmit() {
      this.flowTaskDetailVisible = false;
      this.searchContractReceives();
    }

    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'contract-receive-add': ContractReceiveAdd,
    'contract-receive-edit': ContractReceiveEdit,
    ProcinstParamesExecutionSet,

    //在下面添加其它组件
  },

  created() {

    initSimpleDicts('all', ['amountType']).then(res => this.dicts = res.data.data);
    this.$nextTick(() => {
      this.getContractReceives();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
}
</script>

<style scoped>
.detail:hover {
  text-decoration: underline;
  color: royalblue;
  cursor: pointer !important;
}
</style>


<style>
.tempDialog .el-dialog {
  width: 100%;
  height: 100%;
  -webkit-box-shadow: none !important;
  margin-top: 0 !important;
  position: relative;
  margin: 0 auto 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.tempDialog .el-dialog__header {
  padding: 0;
  margin: 0;
  height: 0px;
}

.tempDialog .el-dialog__body {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>


<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
