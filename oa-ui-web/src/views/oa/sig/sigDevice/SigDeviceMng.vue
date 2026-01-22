<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="设备名称 模糊查询" clearable @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchSigDevices">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus">添加设备</el-button>
      <el-button type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 SigDevice sig_device-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="sigDevices" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="id" label="印章设备编号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="deptName" label="归属部门" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="branchName" label="归属机构名称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="brandName" label="品牌名称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="startTime" label="启用时间" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="status" :formatter="formatStatus" label="状态" min-width="80"></el-table-column>
        <el-table-column prop="address" label="保管地址" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="addressGps" label="地址定位" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="deviceType" :formatter="formatDeviceType" show-overflow-tooltip label="设备类型" min-width="80"></el-table-column>
        <el-table-column prop="admUsername" label="管理员姓名" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 SigDevice sig_device界面-->
      <el-dialog title="编辑设备" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <sig-device-edit :sig-device="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></sig-device-edit>
      </el-dialog>

      <!--新增 SigDevice sig_device界面-->
      <el-dialog title="新增设备" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <sig-device-add :sig-device="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></sig-device-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listSigDevice,
    delSigDevice,
    batchDelSigDevice
  } from '@/api/oa/sig/sigDevice';
  import SigDeviceAdd from './SigDeviceAdd'; //新增界面
  import SigDeviceEdit from './SigDeviceEdit'; //修改界面
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
        sigDevices: [], //查询结果
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

        addFormVisible: false, //新增sigDevice界面是否显示
        //新增sigDevice界面初始化数据
        addForm: {
          id: '',
          deviceName: '',
          branchId: '',
          deptid: '',
          deptName: '',
          branchName: '',
          deviceSn: '',
          brandId: '',
          brandName: '',
          startTime: '',
          endTime: '',
          status: '',
          address: '',
          addressGps: '',
          deviceType: '',
          bizFlowState: '',
          bizProcInstId: '',
          admUserid: '',
          admUsername: '',
          admDeptid: '',
          admDeptName: '',
          admBranchId: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑sigDevice界面初始化数据
        editForm: {
          id: '',
          deviceName: '',
          branchId: '',
          deptid: '',
          deptName: '',
          branchName: '',
          deviceSn: '',
          brandId: '',
          brandName: '',
          startTime: '',
          endTime: '',
          status: '',
          address: '',
          addressGps: '',
          deviceType: '',
          bizFlowState: '',
          bizProcInstId: '',
          admUserid: '',
          admUsername: '',
          admDeptid: '',
          admDeptName: '',
          admBranchId: ''
        },
        /**begin 自定义属性请在下面加 请加备注**/
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleClear() {
        this.searchSigDevices();
      },
      searchOnEnter() {
        // 当用户按下回车键时触发搜索
        this.searchSigDevices();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getSigDevices();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getSigDevices();
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
        this.getSigDevices();
      },
      searchSigDevices() {
        this.pageInfo.count = true;
        this.getSigDevices();
      },
      //获取列表 SigDevice sig_device
      getSigDevices() {
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
        }
        this.load.list = true;
        listSigDevice(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.sigDevices = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 SigDevice sig_device
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 SigDevice sig_device
      showAdd: function() {
        this.addFormVisible = true;
        this.addForm.status = "0";
        this.addForm.deviceType = "0"
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getSigDevices();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getSigDevices();
      },
      //选择行sigDevice
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除sigDevice
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delSigDevice(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigDevices();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除sigDevice
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelSigDevice(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigDevices();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      rowClick: function(row, event, column) {
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/
      formatStatus: function(row) {
        return row.status == 1 ? '是' : '否'
      },
      formatDeviceType: function(row) {
        let type = row.deviceType;
        if (type == 0) return "便携机"
        if (type == 1) return "台式机"
        if (type == 2) return "普通印章"
      }

      /**end 自定义函数请在上面加**/


    }, //end methods
    components: {
      'sig-device-add': SigDeviceAdd,
      'sig-device-edit': SigDeviceEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getSigDevices();
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
    padding-bottom: 0px;
  }
</style>
