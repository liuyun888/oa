<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="出发地址｜目的地址｜线路名称 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" v-loading="load.list" icon="el-icon-search" :disabled="load.list==true"
                 v-on:click="searchCarRouteTpls">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus">添加模板</el-button>
      <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"
                 icon="el-icon-delete">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CarRouteTpl car_route_tpl-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="carRouteTpls" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="id" label="主键" min-width="80"></el-table-column>
        <el-table-column prop="fromAddress" label="出发地址" min-width="80"></el-table-column>
        <el-table-column prop="destAddress" label="目的地址" min-width="80"></el-table-column>
        <el-table-column prop="fromAddressGps" label="出发地址定位" min-width="80"></el-table-column>
        <el-table-column prop="destAddressGps" label="目的地址定位" min-width="80"></el-table-column>
        <el-table-column prop="isSignIn" :formatter="formatSign" label="是否打卡" min-width="80"></el-table-column>
        <el-table-column prop="routeName" label="线路名称" min-width="80"></el-table-column>
        <el-table-column prop="distance" label="距离米" min-width="80"></el-table-column>
        <el-table-column prop="hasDetail" :formatter="formatChild" label="是否有子路线"
                         min-width="80"></el-table-column>
        <el-table-column prop="branchId" label="归属机构" min-width="80"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="showChild(scope.row,scope.$index)">子路线</el-button>
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <el-dialog
       append-to-body title="子路线信息" :visible.sync="showDetailFormVisible" width="80%">
          
      <car-routeDetail-tplMng :routeId='routeId' :routeLine='editForm'>
      </car-routeDetail-tplMng>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetailFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDetailFormVisible = false">确 定</el-button>
      </div>
       
      </el-dialog>

      <!--编辑 CarRouteTpl car_route_tpl界面-->
      <el-dialog title="编辑路线模板" :visible.sync="editFormVisible" width="85%" :close-on-click-modal="false">
        <car-route-tpl-edit :car-route-tpl="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                            @submit="afterEditSubmit"></car-route-tpl-edit>
      </el-dialog>

      <!--新增 CarRouteTpl car_route_tpl界面-->
      <el-dialog title="新增路线模板" :visible.sync="addFormVisible" width="85%" :close-on-click-modal="false">
        <car-route-tpl-add :car-route-tpl="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                           @submit="afterAddSubmit"></car-route-tpl-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listCarRouteTpl,
  delCarRouteTpl,
  batchDelCarRouteTpl
} from '@/api/oa/car/carRouteTpl';

import CarRouteDetailTplMng from '../carRouteDetailTpl/CarRouteDetailTplMng'; //把子路线的界面引进来
import CarRouteTplAdd from './CarRouteTplAdd'; //新增界面
import CarRouteTplEdit from './CarRouteTplEdit'; //修改界面
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
      carRouteTpls: [], //查询结果
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

      addFormVisible: false, //新增carRouteTpl界面是否显示
      //新增carRouteTpl界面初始化数据
      addForm: {
        id: '',
        fromAddress: '',
        destAddress: '',
        fromAddressGps: '',
        destAddressGps: '',
        isSignIn: '',
        routeName: '',
        distance: '',
        hasDetail: '',
        branchId: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑carRouteTpl界面初始化数据
      editForm: {
        id: '',
        fromAddress: '',
        destAddress: '',
        fromAddressGps: '',
        destAddressGps: '',
        isSignIn: '',
        routeName: '',
        distance: '',
        hasDetail: '',
        branchId: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      showDetailFormVisible: false,
      routeId: '',
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchCarRouteTpls();
    },
    searchOnEnter() {
      this.searchCarRouteTpls();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getCarRouteTpls();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getCarRouteTpls();
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
      this.getCarRouteTpls();
    },
    searchCarRouteTpls() {
      this.pageInfo.count = true;
      this.getCarRouteTpls();
    },
    //获取列表 CarRouteTpl car_route_tpl
    getCarRouteTpls() {
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
      listCarRouteTpl(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.carRouteTpls = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 CarRouteTpl car_route_tpl
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 CarRouteTpl car_route_tpl
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getCarRouteTpls();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getCarRouteTpls();
    },
    //选择行carRouteTpl
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除carRouteTpl
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delCarRouteTpl(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarRouteTpls();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除carRouteTpl
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelCarRouteTpl(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarRouteTpls();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      //this.showDetailFormVisible = true
      //console.log(row)
      this.$emit('row-click', row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    formatSign: function (row) {
      return row.isSignIn == 1 ? '是' : '否'
    },
    formatChild: function (row) {
      return row.hasDetail == 1 ? '是' : '否'
    },
    showChild(row, index) {
      this.showDetailFormVisible = true
      this.routeId = row.id
      this.editForm = Object.assign({}, row);
      //console.log(this.routeId)
    }
    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'car-route-tpl-add': CarRouteTplAdd,
    'car-route-tpl-edit': CarRouteTplEdit,
    'car-routeDetail-tplMng': CarRouteDetailTplMng,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getCarRouteTpls();
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
