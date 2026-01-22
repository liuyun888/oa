<template>
  <section class="page-container border padding">
    <el-row>
      <el-col :span="24">
        <el-input size="small"
                  v-model="filters.cbCenterNames"
                  @focus="cbCenterSelectVisible = true"
                  style="width: 35%"
                  placeholder="请选择成本中心"
        ></el-input>

        <el-input size="small"
                  v-model="filters.useDeptNames"
                  @focus="deptSelectVisible = true"
                  style="width: 35%"
                  placeholder="请选择申请部门"
        ></el-input>
        <el-date-picker size="small"
                        v-model="filters.reqDateScope"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="申请日期"
                        end-placeholder="申请日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00','23:59:59']"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-select size="small" v-model="filters.opType" placeholder="单据类型" clearable>
        <el-option :value="item.id" :label="item.name" :key="index" v-for="(item,index) in opTypes"></el-option>
      </el-select>


      <el-input size="small" v-model="filters.key" style="width: 30%;" placeholder="申请人|编号|标题 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button size="small" v-loading="load.list" :disabled="load.list==true" @click="searchAssetMngs"
                 icon="el-icon-search">查询
      </el-button>
      <el-button size="small" type="primary" @click="showAdd" icon="el-icon-plus">发起申请</el-button>
      <el-button size="small" type="danger" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
    </el-row>
    <el-row class="padding-top">
      <!--列表 AssetMng 资产出租/出借单-->
      <el-table ref="assetMngTable" :data="assetMngs" :height="maxTableHeight" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column prop="id" label="申请单编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqTitle" label="申请标题" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="opType" label="单据类型" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ opTypes.find(i => i.id == scope.row.opType).name }}
          </template>
        </el-table-column>
        <el-table-column prop="reqUsername" label="申请人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqDeptName" label="申请部门" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqDate" label="申请日期" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqReason" label="申请事由" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bizFlowState" label="状态" show-overflow-tooltip>
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

        <el-table-column label="操作" width="180" fixed="right">
          <template slot="header">
            <el-button @click="showAdd" icon="el-icon-plus" circle></el-button>
          </template>
          <template scope="scope">
            <el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                     style="float:right;"></el-pagination>
    </el-row>
    <el-row>
      <!--编辑 AssetMng 资产出租/出借单界面-->
      <el-drawer :withHeader="false" :visible.sync="editFormVisible" size="100%" append-to-body
                 :close-on-click-modal="false">
        <asset-mng-edit :asset-mng="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                        @submit="afterEditSubmit"></asset-mng-edit>
      </el-drawer>

      <!--新增 AssetMng 资产出租/出借单界面-->
      <el-drawer :withHeader="false" :visible.sync="addFormVisible" size="100%" append-to-body
                 :close-on-click-modal="false">
        <asset-mng-add :visible="addFormVisible" @cancel="addFormVisible=false"
                       @submit="afterAddSubmit"></asset-mng-add>
      </el-drawer>
      <el-drawer fullscreen size="100%" title="任务详情" :visible.sync="flowTaskDetailVisible" :withHeader="false"
                 :close-on-click-modal="false">
        <procinst-parames-execution-set v-if="tasks.length>0" :taskInfo="tasks[0]" :procDefId="tasks[0].procDefId"
                                        :procInstId="tasks[0].procInstId"
                                        :visible="flowTaskDetailVisible" @cancel="flowTaskDetailVisible=false"
                                        @submit="afterFlowSubmit">
        </procinst-parames-execution-set>
      </el-drawer>

      <el-dialog
        append-to-body
        title="人员选择"
        width="70%"
        top="5vh"
        :visible.sync="visibleUserSelect"
      >
        <users-select @confirm="onUserSelected" :isSingleUser="true"></users-select>
      </el-dialog>

      <el-dialog
        append-to-body
        title="选择使用部门"
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
        title="选择成本中心"
        :visible.sync="cbCenterSelectVisible"
        width="60%"
      >
        <dept-tree
          :show-confirm="true"
          show-root
          default-expand-all
          show-checkbox
          multiple
          :expand-on-click-node="false"
          @confirm="onCbCenterSelected"
        ></dept-tree>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import {getDicts, initSimpleDicts, initComplexDicts} from '@/api/mdp/meta/item';//字典表
import {listAssetMng, delAssetMng, batchDelAssetMng} from '@/api/oa/erp/ass/assetMng';
import AssetMngEdit from './AssetMngEdit';//新增修改界面
import AssetMngAdd from './AssetMngAdd';//新增修改界面

import {mapGetters} from 'vuex'
import {showFlowTaskDetail} from '@/api/oa/erp/ass/assUtil';
import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载


import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";


export default {
  name: 'assetMngMng',
  components: {
    AssetMngEdit, ProcinstParamesExecutionSet, UsersSelect, DeptTree, AssetMngAdd,
  },
  props: ['visible', 'queryScene'],
  computed: {
    ...mapGetters(['userInfo']),

  },
  watch: {
    visible(val) {
      if (val == true) {
        this.initData();
        this.searchAssetMngs()
      }
    }
  },
  data() {

    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
    return {
      filters: {
        key: '',
        opType: '',
        reqDateScope: [util.formatDate.format(fromStartTime, 'yyyy-MM-dd'), util.formatDate.format(toStartTime, 'yyyy-MM-dd')],
      },
      assetMngs: [],//查询结果
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false},//查询中...
      sels: [],//列表选中数据
      dicts: {
        //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
      },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
      addFormVisible: false,//新增assetMng界面是否显示
      addForm: {
        id: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqTitle: '',
        reqDate: '',
        reqReason: '',
        startDate: '',
        endDate: '',
        totalDay: '',
        opType: '',
        maintTotalFeeAmount: '',
        maintIsConsumables: '',
        dispTotalOrignAmount: '',
        dispTotalScrapSaleAmount: '',
        dispAddAssets: '',
        inDeptId: '',
        inDeptName: '',
        outDeptId: '',
        outDeptName: '',
        inBranchId: '',
        inBranchName: '',
        outBranchId: '',
        outBranchName: '',
        mngStatus: '',
        inventoryTask: '',
        bizProcInstId: '',
        bizKey: '',
        commentMsg: '',
        assignee: '',
        assigneeName: '',
        agree: '',
        flowLastTime: '',
        flowEndTime: '',
        actId: '',
        taskName: '',
        bizFlowState: ''
      },
      opTypes: [
        {id: 'use', name: '申领单'},
        {id: 'return', name: '归还单'},
        {id: 'maint', name: '维修单'},
        {id: 'dispose', name: '处置单'},
        {id: 'change', name: '变更单'},
        {id: 'reallocation', name: '调拨单'},
        {id: 'lease', name: '租借单'},
      ],
      editFormVisible: false,//编辑界面是否显示
      editForm: {
        id: '',
        reqUserid: '',
        reqUsername: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqBranchName: '',
        reqTitle: '',
        reqDate: '',
        reqReason: '',
        startDate: '',
        endDate: '',
        totalDay: '',
        opType: '',
        maintTotalFeeAmount: '',
        maintIsConsumables: '',
        dispTotalOrignAmount: '',
        dispTotalScrapSaleAmount: '',
        dispAddAssets: '',
        inDeptId: '',
        inDeptName: '',
        outDeptId: '',
        outDeptName: '',
        inBranchId: '',
        inBranchName: '',
        outBranchId: '',
        outBranchName: '',
        mngStatus: '',
        inventoryTask: '',
        bizProcInstId: '',
        bizKey: '',
        commentMsg: '',
        assignee: '',
        assigneeName: '',
        agree: '',
        flowLastTime: '',
        flowEndTime: '',
        actId: '',
        taskName: '',
        bizFlowState: ''
      },
      maxTableHeight: 300,
      flowTaskDetailVisible: false,
      tasks: [],
      pickerOptions: util.pickerOptions,
      visibleUserSelect: false,
      deptSelectVisible: false,
      cbCenterSelectVisible: false,
    }
  },//end data
  methods: {
    handleClear() {
      this.searchAssetMngs()
    },
    searchOnEnter() {
      this.searchAssetMngs()
    },
    showFlowTaskDetail(row) {
      showFlowTaskDetail(this, row);
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getAssetMngs();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getAssetMngs();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = [];
        this.pageInfo.orderDirs = [];
      } else {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }

        this.pageInfo.orderFields = [util.toLine(obj.prop)];
        this.pageInfo.orderDirs = [dir];
      }
      this.getAssetMngs();
    },
    searchAssetMngs() {
      this.pageInfo.count = true;
      this.getAssetMngs();
    },
    //获取列表 AssetMng 资产出租/出借单
    getAssetMngs() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      if (this.filters.key !== '') {
        params.key = this.filters.key
      }
      if (this.filters.opType) {
        params.opType = this.filters.opType
      }
      if (this.queryScene === 'my') {
        this.reqUserid = this.userInfo.userid
      }

      this.load.list = true;
      listAssetMng(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.assetMngs = res.data.data;
        } else {
          this.$message({showClose: true, message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 AssetMng 资产出租/出借单
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 AssetMng 资产出租/出借单
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getAssetMngs();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行assetMng
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除assetMng
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delAssetMng(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getAssetMngs();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除assetMng
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelAssetMng(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getAssetMngs();
          }
          this.$message({showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      if (event.label != '操作' && event.type != 'selection' && event.label != '状态') {
        this.showEdit(row)
      }
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    },
    initData: function () {

    },
    afterFlowSubmit() {
      this.searchAssetMngs();
    },

    openUserSelect() {
      this.visibleUserSelect = true;
    },

    //获取用户数据
    onUserSelected(data) {
      this.visibleUserSelect = false;
    },

    onDeptsSelected(nodes) {
      if (nodes == null || nodes.length == 0) {
        this.filters.useDeptids = [];
        this.filters.useDeptNames = "";
      } else {
        this.filters.useDeptids = nodes.map((i) => i.deptid);
        this.filters.useDeptNames = nodes.map((i) => i.deptName).join(",");
      }
      this.deptSelectVisible = false;
      this.searchAssetMngs();
    },
    onCbCenterSelected(nodes) {
      if (nodes == null || nodes.length == 0) {
        this.filters.cbCenterIds = [];
        this.filters.cbCenterNames = "";
      } else {
        this.filters.cbCenterIds = nodes.map((i) => i.deptid);
        this.filters.cbCenterNames = nodes.map((i) => i.deptName).join(",");
      }
      this.cbCenterSelectVisible = false;
      this.searchAssetMngs()
    },
  },//end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
      this.searchAssetMngs();
      var table = document.querySelector('.el-table');
      var top = util.getPositionTop(table)
      this.maxTableHeight = window.innerHeight - top - 60;

    });
  }
}

</script>

<style scoped>
</style>
