<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-date-picker
        v-model="filters.purDateScope" class="hidden-md-and-down"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="创建日期"
        end-placeholder="创建日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00','23:59:59']"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-input v-model="filters.key" style="width: 270px;" placeholder="标题｜编号｜申请人 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchOrders">查询
      </el-button>

      <el-button icon="el-icon-plus" @click="showAdd">发起申请</el-button>
      <el-button icon="el-icon-download" class="hidden-md-and-down" @click="exportData">导出</el-button>
      <el-button icon="el-icon-delete" type="danger" class="hidden-sm-and-down" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
      <el-popover title="更多查询条件" placement="top-start" width="400" trigger="click">
        <el-row class="more-filter-item">
          <el-col :span="24">
            <font class="more-label-font">
              时间范围
            </font>
            <el-date-picker
              v-model="filters.reqDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="创建日期"
              end-placeholder="创建日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00','23:59:59']"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>

          <el-col :span="24" style="margin-top: 11px;">
            <el-button type="primary" v-on:click="searchOrders" icon="el-icon-search">查询</el-button>
          </el-col>

          <el-col :span="24">
            <el-divider content-position="left">其它操作</el-divider>
            <el-button @click="showAdd">发起申请</el-button>
            <el-button v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">
              批量删除
            </el-button>
            <el-button @click="exportData">导出</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
      </el-popover>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 Order pur_order-->
      <el-table :height="tableHeight" ref="procdefsTable" @cell-click="cellClick" :data="orders"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column sortable type="index" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="purTitle" label="标题" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="id" label="申请单编号" min-width="60" show-overflow-tooltip></el-table-column>

        <el-table-column prop="bizFlowState" label="审核状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link @click="showFlowTaskDetail(scope.row)">
              <el-tag v-if="scope.row.bizFlowState == '0'||!scope.row.bizFlowState">未发审</el-tag>
              <el-tag v-if="scope.row.bizFlowState == '1'">审核中</el-tag>
              <el-tag v-if="scope.row.bizFlowState == '2'">已通过</el-tag>
              <el-tag v-if="scope.row.bizFlowState == '5'">待领取</el-tag>
              <el-tag v-if="scope.row.bizFlowState == '4'">已取消</el-tag>
              <el-tag v-if="scope.row.bizFlowState == '3'">未通过</el-tag>
              {{ scope.row.assigneeName }}&nbsp;&nbsp;{{ scope.row.commentMsg }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="purUsername" label="申请人" min-width="50" show-overflow-tooltip></el-table-column>
        <el-table-column prop="purDeptName" label="申请人部门" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="purDate" label="申请时间" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalStockNum" label="采购总数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalStockAmount" label="采购总金额" min-width="80"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalReachNum" label="已入库数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalReachAmount" label="已入库总金额" min-width="80"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderStatus" label="入库状态" min-width="50" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatus == '0'">未发审</el-tag>
            <el-tag v-if="scope.row.orderStatus == '1'">审核中</el-tag>
            <el-tag v-if="scope.row.orderStatus == '2'">待入库</el-tag>
            <el-tag v-if="scope.row.orderStatus == '3'">已完成</el-tag>
            <el-tag v-if="scope.row.orderStatus == '4'">流程取消</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="showStockInAdd( scope.row)">入库申请</el-button>
            <el-button type="text" @click="showStockInList( scope.row)">入库单查询</el-button>
            <el-button :disabled="scope.row.bizFlowState=='1' || scope.row.bizFlowState=='2'  " type="text"
                       @click="sendApprova( scope.row,'erp_order_add_approva')">发审
            </el-button>
            <el-button type="text" @click="showEdit( scope.row,scope.$index)">编辑</el-button>
            <el-button :disabled="scope.row.bizFlowState=='1' || scope.row.bizFlowState=='2'  " type="text"
                       @click="handleDel(scope.row,scope.$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                     style="float:right;"></el-pagination>

      <!--编辑 Order pur_order界面-->
      <el-dialog title="编辑采购单" center :fullscreen="true" :visible.sync="editFormVisible"
                 :close-on-click-modal="false" append-to-body>
        <order-edit :order="editForm" op-type="edit" :visible="editFormVisible" @cancel="editFormVisible=false"
                    @submit="afterEditSubmit"></order-edit>
      </el-dialog>

      <!--新增 Order pur_order界面-->
      <el-dialog title="新增采购单" center :fullscreen="true" :visible.sync="addFormVisible"
                 :close-on-click-modal="false" append-to-body>
        <order-add :order="addForm" op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false"
                   @submit="afterAddSubmit"></order-add>
      </el-dialog>
      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
                 append-to-body
                 :close-on-click-modal="false">
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId"
                                        :procInstId="tasks[0].procInstId"
                                        :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false"
                                        @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>
      <el-dialog title="新增入库单" center :fullscreen="true" :visible.sync="stockInAddVisible"
                 :close-on-click-modal="false" append-to-body>
        <stock-in-edit ref="stockInAdd" op-type="add" :pur-order-id="editForm.id" :stock-in="{}"
                       :visible="stockInAddVisible" @cancel="stockInAddVisible=false"
                       @submit="afterAddSubmit"></stock-in-edit>
      </el-dialog>
      <el-dialog title="入库单列表" center :fullscreen="true" :visible.sync="stockInListVisible"
                 :close-on-click-modal="false" append-to-body>
        <stock-in-mng ref="stockInList" op-type="add" :pur-order-id="editForm.id" :stock-in="{}"
                      :visible="stockInListVisible" @cancel="stockInListVisible=false"
                      @submit="afterAddSubmit"></stock-in-mng>
      </el-dialog>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {listOrder, delOrder, batchDelOrder} from '@/api/oa/erp/pur/order';
import OrderAdd from './OrderAdd';//新增界面
import OrderEdit from './OrderAdd';//修改界面
import {mapGetters} from 'vuex';
import config from "@/common/config"; //全局公共库
import {showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';
import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
import StockInMng from '../stockIn/StockInMng.vue';
import StockInEdit from '../stockIn/StockInEdit.vue';

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
    return {
      filters: {
        key: '',
        purDateScope: [util.formatDate.format(fromStartTime, 'yyyy-MM-dd 00:00:00'), util.formatDate.format(toStartTime, 'yyyy-MM-dd 23:59:59')],
      },
      pickerOptions: util.pickerOptions,
      tableHeight: 300,
      orders: [],//查询结果
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: ['pur_date'],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false},//查询中...
      sels: [],//列表选中数据
      options: {},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false,//新增order界面是否显示
      //新增order界面初始化数据
      addForm: {
        id: '',
        purTitle: '',
        purUserid: '',
        purUsername: '',
        purDeptid: '',
        purDeptName: '',
        purBranchId: '',
        purBranchName: '',
        purDate: '',
        purItems: '',
        orderStatus: ''
      },

      editFormVisible: false,//编辑界面是否显示
      //编辑order界面初始化数据
      editForm: {
        id: '',
        purTitle: '',
        purUserid: '',
        purUsername: '',
        purDeptid: '',
        purDeptName: '',
        purBranchId: '',
        purBranchName: '',
        purDate: '',
        purItems: '',
        orderStatus: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      detailForm: {
        id: '',
        purTitle: '',
        purUserid: '',
        purUsername: '',
        purDeptid: '',
        purDeptName: '',
        purBranchId: '',
        purBranchName: '',
        purDate: '',
        purItems: '',
        orderStatus: ''
      },
      detailFormVisible: false, //明细界面是否显示

      flowTaskDetailVisible: false,
      tasks: [],
      stockInAddVisible: false,
      stockInListVisible: false,
      /**end 自定义属性请在上面加 请加备注**/
    }
  },//end data
  methods: {
    handleClear() {
      this.searchOrders();
    },
    searchOnEnter() {
      this.searchOrders();
    },
    showFlowTaskDetail(row) {
      showFlowTaskDetail(this, row);
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getOrders();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getOrders();
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
      this.getOrders();
    },
    searchOrders() {
      this.pageInfo.count = true;
      this.getOrders();
    },
    //获取列表 Order pur_order
    getOrders() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        purBranchId: this.userInfo.branchId
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
        // params.purTitle='%'+this.filters.key+'%';
        params.key = this.filters.key;
      } else {
        //params.xxx=xxxxx
      }

      if (this.filters.purDateScope != null && this.filters.purDateScope.length == 2) {
        params.purDateStart = this.filters.purDateScope[0]
        params.purDateEnd = this.filters.purDateScope[1]
      }

      this.load.list = true;
      listOrder(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.orders = res.data.data;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 Order pur_order
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Order pur_order
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    showStockInAdd(row) {
      this.stockInAddVisible = true;
      this.editForm = Object.assign({}, row);
    },
    showStockInList(row) {
      this.stockInListVisible = true;
      this.editForm = Object.assign({}, row);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getOrders();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getOrders();
    },
    //选择行order
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除order
    handleDel: function (row, index) {
      if (row.orderStatus === '1' || row.orderStatus === '2' || row.orderStatus === '3') {
        this.$message({message: "该状态不允许删除", type: 'error'});
        return;
      }
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delOrder(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOrders();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除order
    batchDel: function () {
      let validate = this.validateIsCanBatchDelete(this.sels);
      if (!validate) {
        this.$message({message: "选择的数据中存在已发布的数据，不能删除", type: 'error'});
        return;
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelOrder(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOrders();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    gotoDetail(row) {
      this.showEdit(row)
    },
    /**end 自定义函数请在上面加**/
    cellClick: function (row, column, cell, event) {
      if (column.label == '操作' || column.label == '审核状态') return;
      this.showEdit(row)
    },

    //批量删除验证
    validateIsCanBatchDelete(data) {
      let flag = true;
      data.forEach(d => {
        if (d.orderStatus === '1' || d.orderStatus === '2' || d.orderStatus === '3') {
          flag = false;
          return;
        }
      })
      return flag;
    },


    /**导出数据 */
    exportData() {
      if (this.sels.length < 1) {
        this.$message.error("必须先选择一条数据");
        return;
      }

      this.sels.forEach(s => {
        if (s.orderStatus == '0') {
          s.orderStatus = '未发审';
        } else if (s.orderStatus == '1') {
          s.orderStatus = '审核中';
        } else if (s.orderStatus == '2') {
          s.orderStatus = '待入库';
        } else if (s.orderStatus == '3') {
          s.orderStatus = '已完成';
        } else {
          s.orderStatus = '流程取消';
        }
      })

      this.deriveExcel(this.sels);
    },

    //资产卡片导出
    deriveExcel(resData) {
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "标题",
          "申请单编号",
          "申请人",
          "申请日期",
          "文档状态"
        ];
        const filterVal = [
          "purTitle",
          "id",
          "purUsername",
          "purDate",
          "orderStatus"
        ];
        const list = resData;
        const data = this.formatJson(filterVal, list);
        var filename = "列表数据导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "列表数据导出";
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    sendApprova: function (row, bizKey) {
      if (row.orderStatus === '1' || row.orderStatus === '2' || row.orderStatus === '3') {
        this.$message({message: "该单已提交审核，不能再次提交", type: 'error'});
        return;
      }
      let extVars = {purOrderId: row.id}
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath + '?extVars=' + jsonExtVars

      var titleNames = row.purUsername
      var mainTitle = ''
      var mainContext = ''
      if (bizKey == 'erp_order_add_approva') {
        mainTitle = '关于【' + titleNames + "申购资产" + row.purTitle + "】的审批"
        mainContext = mainTitle + ',采购事项：' + row.purItems + ",申请时间：" + row.purDate + ",申请部门：" + row.purDeptName;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl: config.getOaBasePath() + "/oa/erp/pur/order/processApprova",
        //restUrl:"http://localhost:7078"+"/oa/erp/pur/order/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
          purOrderId: row.id,
          branchId: row.purBranchId,
        },
      }
      let jsonParmas = encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
      this.$router.push({path: '/mdp/workflow/re/procdef/ProcdefListForBizStart', query: {params: jsonParmas}});
    },


    afterFlowSubmit() {
      this.searchOrders()
    },


  },//end methods
  components: {
    'order-add': OrderAdd,
    'order-edit': OrderEdit,
    ProcinstParamesExecutionSet,
    StockInMng,
    StockInEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getOrders();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
}

</script>

<style scoped>

.filters-show {
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 0px;
}

.filters-label {
  font-size: 14px;
  color: black;
  font-weight: bold;
}

</style>
