<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 20%;" placeholder="申请人｜事由 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
                 v-on:click="searchCarRequires">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus">申请用车</el-button>
      <el-button type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <el-table :height="tableHeight" ref="procdefsTable" :data="carRequires" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="reqStartTime" label="申请用车开始时间" show-overflow-tooltip :formatter="dateFormat"
                         width="110"></el-table-column>
        <el-table-column prop="reqEndTime" label="申请用车结束时间" show-overflow-tooltip :formatter="dateFormat"
                         width="110"></el-table-column>
        <el-table-column prop="id" label="申请编号" width="100"></el-table-column>
        <!-- <el-table-column prop="reqDeptid" label="申请部门编号" min-width="80" ></el-table-column> -->
        <el-table-column prop="reqDeptName" label="申请部门" show-overflow-tooltip min-width="120"></el-table-column>
        <!-- <el-table-column prop="reqBranchId" label="申请机构号" min-width="80" ></el-table-column> -->
        <!-- <el-table-column prop="reqUserid" label="申请人编号" min-width="80" ></el-table-column> -->
        <el-table-column prop="reqUsername" label="申请人姓名" min-width="120"></el-table-column>
        <el-table-column prop="reqPhoneno" label="申请人电话" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="reqReason" label="申请事由" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="reqTime" label="申请时间" show-overflow-tooltip :formatter="dateFormat"
                         min-width="110"></el-table-column>
        <el-table-column prop="reqStatus" label="申请状态" min-width="80"></el-table-column>
        <el-table-column prop="bizFlowState" label="审批状态" min-width="80"></el-table-column>
        <el-table-column prop="bizProcInstId" label="流程实例编号" show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column prop="destAddress" label="目的地地址" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="destGps" label="目的地定位" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="reqTitle" label="申请标题" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="hasRoute" label="是否规划路线" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hasRoute=='1'">是</el-tag>
            <el-tag v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reqBranchName" label="机构名称" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 CarRequire car_require界面-->
      <el-dialog title="修改申请" :visible.sync="editFormVisible" width="85%" :close-on-click-modal="false">
        <car-require-edit :car-require="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                          @submit="afterEditSubmit"></car-require-edit>
      </el-dialog>

      <!--新增 CarRequire car_require界面-->
      <el-dialog title="申请用车" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <car-require-add :car-require="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                         @submit="afterAddSubmit"></car-require-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listCarRequire,
  delCarRequire,
  batchDelCarRequire
} from '@/api/oa/car/carRequire';
import CarRequireAdd from './CarRequireAdd'; //新增界面
import CarRequireEdit from './CarRequireEdit'; //修改界面
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      filters: {
        key: ''
      },
      carRequires: [], //查询结果
      pageInfo: { //分页数据
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

      addFormVisible: false, //新增carRequire界面是否显示
      //新增carRequire界面初始化数据
      addForm: {
        reqStartTime: '',
        reqEndTime: '',
        id: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqUserid: '',
        reqUsername: '',
        reqPhoneno: '',
        reqReason: '',
        reqTime: '',
        reqStatus: '',
        bizFlowState: '',
        bizProcInstId: '',
        destAddress: '',
        destGps: '',
        reqTitle: '',
        hasRoute: '',
        reqBranchName: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑carRequire界面初始化数据
      editForm: {
        reqStartTime: '',
        reqEndTime: '',
        id: '',
        reqDeptid: '',
        reqDeptName: '',
        reqBranchId: '',
        reqUserid: '',
        reqUsername: '',
        reqPhoneno: '',
        reqReason: '',
        reqTime: '',
        reqStatus: '',
        bizFlowState: '',
        bizProcInstId: '',
        destAddress: '',
        destGps: '',
        reqTitle: '',
        hasRoute: '',
        reqBranchName: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchCarRequires();
    },
    searchOnEnter() {
      this.searchCarRequires();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getCarRequires();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getCarRequires();
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
      this.getCarRequires();
    },
    searchCarRequires() {
      this.pageInfo.count = true;
      this.getCarRequires();
    },
    //获取列表 CarRequire car_require
    getCarRequires() {
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
      if (this.filters.key !== "") {
        params.key = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listCarRequire(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.carRequires = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 CarRequire car_require
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 CarRequire car_require
    showAdd: function () {
      //this.addFormVisible = true;
      this.$router.push({
        path: '/oa/car/carRequire/CarRequire'
      })
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getCarRequires();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getCarRequires();
    },
    //选择行carRequire
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除carRequire
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delCarRequire(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarRequires();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除carRequire
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelCarRequire(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarRequires();
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
    dateFormat(row, column, cellValue) {
      //console.log(cellValue + "ssssssss")
      if (cellValue != null && cellValue != '')
        return cellValue.slice(0, 10)
      else
        return ''
    }

    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'car-require-add': CarRequireAdd,
    'car-require-edit': CarRequireEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getCarRequires();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
}
</script>

<style scoped>

</style>

<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
