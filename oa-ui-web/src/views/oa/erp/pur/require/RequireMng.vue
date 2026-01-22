<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-date-picker
        v-model="filters.reqDateScope" class="hidden-md-and-down"
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
      <el-input v-model="filters.key" style="width: 270px;" placeholder="标题｜编号｜申请人 模糊查询" clearable @clear="handleClear" @keyup.enter.native="searchOnEnter">
      </el-input>
      <el-button type="primary" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchPurRequires">查询
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
              v-model="filters.reqDateScope"
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
            <el-button size="mini" type="primary" v-on:click="searchPurRequires" icon="el-icon-search">查询</el-button>
          </el-col>

          <el-col :span="24">
            <el-divider content-position="left">其它操作</el-divider>
            <el-button size="mini" @click="showAdd">发起申请</el-button>
            <el-button size="mini" v-loading="load.del" @click="batchDel"
                       :disabled="this.sels.length===0 || load.del==true">批量删除
            </el-button>
            <el-button size="mini" @click="exportData">导出</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
      </el-popover>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 PurRequire pur_require-->
      <el-table @cell-click="cellClick" :height="tableHeight" ref="procdefsTable" :data="purRequires"
                @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column sortable type="index" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqTitle" label="标题" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="id" label="申请单编号" min-width="80" show-overflow-tooltip></el-table-column>

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
        <el-table-column prop="reqUsername" label="申请人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqDate" label="申请日期" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqType" label="申购方式" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.reqType === '0' ? '新购' : '内部调拨' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isPlan" label="是否计划内" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.isPlan === '0' ? '否' : '是' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" @click="showEdit( scope.row,scope.$index)"></el-button>
            <el-button icon="el-icon-delete" type="danger" @click="handleDel(scope.row,scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                     style="float:right;"></el-pagination>

      <!--编辑 PurRequire pur_require界面-->
      <el-dialog title="编辑申购单" center :fullscreen="true" :visible.sync="editFormVisible" width="50%"
                 :close-on-click-modal="false" append-to-body>
        <require-edit op-type="edit" :pur-require="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                      @submit="afterEditSubmit"></require-edit>
      </el-dialog>

      <!--新增 PurRequire pur_require界面-->
      <el-dialog title="新增申购单" center :fullscreen="true" :visible.sync="addFormVisible" @close="addFromClose"
                 :close-on-click-modal="false" append-to-body>
        <require-add ref="requireAdd" op-type="add" :pur-require="addForm" :visible="addFormVisible"
                     @cancel="addFormVisible=false" @submit="afterAddSubmit"></require-add>
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

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {listRequire, delRequire, batchDelRequire} from '@/api/oa/erp/pur/require';
import RequireAdd from './RequireAdd';//新增界面
import RequireEdit from './RequireAdd';//修改界面
import RequireDetail from './RequireAdd'; //详情页面
import {mapGetters} from 'vuex';
import config from "@/common/config"; //全局公共库
import {showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';
import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载


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
        reqDateScope: [util.formatDate.format(fromStartTime, 'yyyy-MM-dd HH:mm:ss'), util.formatDate.format(toStartTime, 'yyyy-MM-dd HH:mm:ss')],
      },
      pickerOptions: util.pickerOptions,
      tableHeight: 300,
      purRequires: [],//查询结果
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: ['req_date'],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false},//查询中...
      sels: [],//列表选中数据
      options: {},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false,//新增purRequire界面是否显示
      //新增purRequire界面初始化数据
      addForm: {
        reqTitle: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqDate: new Date(),
        reqReason: '',
        purchaseInquiryRemark: '',
        reqType: "0",
        isPlan: "1",
        reqStatus: '',
      },
      editFormVisible: false,//编辑界面是否显示
      //编辑purRequire界面初始化数据
      editForm: {
        id: '',
        reqTitle: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqDate: '',
        isPlan: '',
        reqReason: '',
        reqType: '',
        purchaseInquiryRemark: '',
        reqStatus: '',
      },
      /**begin 自定义属性请在下面加 请加备注**/
      detailFormVisible: false, //明细界面是否显示
      detailForm: {
        reqTitle: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqDate: new Date(),
        reqReason: '',
        purchaseInquiryRemark: '',
        reqType: "0",
        isPlan: "1",
        reqStatus: '',
      },
      /**end 自定义属性请在上面加 请加备注**/

      flowTaskDetailVisible: false,
      tasks: [],
    }
  },//end data
  methods: {
    handleClear() {
      this.searchPurRequires();
    },
    searchOnEnter() {
      this.searchPurRequires();
    },
    showFlowTaskDetail(row) {
      showFlowTaskDetail(this, row);
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getPurRequires();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getPurRequires();
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
      this.getPurRequires();
    },
    searchPurRequires() {
      this.pageInfo.count = true;
      this.getPurRequires();
    },
    //获取列表 PurRequire pur_require
    getPurRequires() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        reqBranchId: this.userInfo.branchId
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
        // params.reqTitle='%'+this.filters.key+'%';
        params.key = this.filters.key;
      } else {
        //params.xxx=xxxxx
      }
      if (this.filters.reqDateScope != null && this.filters.reqDateScope.length == 2) {
        params.reqDateStart = this.filters.reqDateScope[0]
        params.reqDateEnd = this.filters.reqDateScope[1]
      }

      this.load.list = true;
      listRequire(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.purRequires = res.data.data;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 PurRequire pur_require
    showEdit: function (row, index) {
      this.editForm = Object.assign({}, row);
      this.editFormVisible = true;
    },

    //显示新增界面 PurRequire pur_require
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit(value1, isFlow) {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getPurRequires();
      if (isFlow) {
        this.sendToProcessApprova(value1, "asset_require_process_approva");
      }

    },
    afterEditSubmit(value1, isFlow) {
      this.editFormVisible = false;
      this.getPurRequires();
      if (isFlow) {
        this.sendToProcessApprova(value1, "asset_require_process_approva");
      }

    },
    //选择行purRequire
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除purRequire
    handleDel: function (row, index) {
      if (row.reqStatus === 'submit' || row.reqStatus === 'permit') {
        this.$message({message: "该单已发布，不能删除", type: 'error'});
        return;
      }
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delRequire(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getPurRequires();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除purRequire
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
        batchDelRequire(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getPurRequires();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },

    /**begin 自定义函数请在下面加**/
    cellClick: function (row, column, cell, event) {
      if (column.label == '操作' || column.label == '审核状态') return;
      this.editFormVisible = true;
      this.editForm = row
    },

    addFromClose() {
      this.$refs.requireAdd.handleCancel();
    },

    //批量删除验证
    validateIsCanBatchDelete(data) {
      let flag = true;
      data.forEach(d => {
        if (d.reqStatus === 'submit' || d.reqStatus === 'permit') {
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
        s.reqType = s.reqType === '0' ? '新购' : '内部调拨';
        s.isPlan = s.isPlan === '0' ? '否' : '是';
        if (s.reqStatus === 'hold') {
          s.reqStatus = '未发审';
        } else if (s.reqStatus === 'submit') {
          s.reqStatus = '审核中';
        } else if (s.reqStatus === 'permit') {
          s.reqStatus = '已通过';
        } else if (s.reqStatus === 'cancel') {
          s.reqStatus = '已取消';
        } else if (s.reqStatus === 'reject') {
          s.reqStatus = '未通过';
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
          "申购方式",
          "是否计划内",
          "文档状态"
        ];
        const filterVal = [
          "reqTitle",
          "id",
          "reqUsername",
          "reqDate",
          "reqType",
          "isPlan",
          "reqStatus"
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

    sendToProcessApprova: function (row, bizKey) {
      let extVars = {purRequireId: row.purRequire.id}
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath + '?extVars=' + jsonExtVars

      var titleNames = row.purRequire.reqUsername
      var mainTitle = ''
      var mainContext = ''
      if (bizKey == 'asset_require_process_approva') {
        mainTitle = '关于【' + titleNames + "申购资产】的审批"
        mainContext = mainTitle + ',申请物品：' + row.purRequire.reqTitle + ",申请原因：" + row.purRequire.reqReason;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl: config.getOaBasePath() + "/erp/pur/require/processApprova",
        //restUrl:"http://localhost:7078"+"/erp/pur/require/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
          branchId: row.purRequire.reqBranchId,
          purRequireId: row.purRequire.id,
        },
      }
      let jsonParmas = encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
      this.$router.push({path: '/mdp/workflow/re/procdef/ProcdefListForBizStart', query: {params: jsonParmas}});
    },

    /**end 自定义函数请在上面加**/



    afterFlowSubmit() {
      this.searchPurRequires();
    },


  },//end methods
  components: {
    'require-add': RequireAdd,
    'require-edit': RequireEdit,
    'require-detail': RequireDetail,

    ProcinstParamesExecutionSet,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getPurRequires();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
    //设置默认参数
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
