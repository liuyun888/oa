<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="姓名｜电话｜微信号 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCarDrivers"
        icon="el-icon-search">查询</el-button>
      <el-button @click="showAdd" icon="el-icon-plus">添加司机</el-button>
      <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"
        icon="el-icon-delete">批量删除</el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CarDriver car_driver-->
      <el-table ref="procdefsTable" :height="tableHeight" :data="carDrivers" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="driverId" label="司机编号" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="driverUserid" label="汽车司机" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="driverUsername" label="司机姓名" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="driverPhoneno" label="司机电话" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="driverWeixin" label="微信号" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="driverEmel" label="邮件" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="driverCardNum" label="驾驶证号码" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="driverCardImageUrl" label="驾驶证照片"  min-width="140">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <el-image style="width: 400px; height: auto" :src="baseImageUrl + scope.row.driverCardImageUrl">
              </el-image>
              <el-image style="width: 70px; height: 40px" slot="reference"
                :src="baseImageUrl + scope.row.driverCardImageUrl" :alt="baseImageUrl + scope.row.driverCardImageUrl">
              </el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="driverStatus" label="驾驶证状态" min-width="80"></el-table-column>
        <el-table-column prop="driverCardStartTime" label="驾驶证开始领证日期" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="driverAge" label="驾驶年龄" min-width="80"></el-table-column>
        <el-table-column prop="driverSex" label="司机性别" min-width="80"></el-table-column>
        <el-table-column prop="driverActYear" label="司机实际驾龄" min-width="80"></el-table-column>
        <el-table-column prop="createTime" label="增加时间" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="driverCardType" label="驾驶证类型" min-width="80"></el-table-column>
        <!-- <el-table-column prop="driverBranchId" label="司机归属机构" min-width="80" ></el-table-column> -->
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 CarDriver car_driver界面-->
      <el-dialog title="编辑司机信息" :visible.sync="editFormVisible" width="60%" :close-on-click-modal="false">
        <car-driver-edit :car-driver="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></car-driver-edit>
      </el-dialog>

      <!--新增 CarDriver car_driver界面-->
      <el-dialog title="新增司机" :visible.sync="addFormVisible" width="60%" :close-on-click-modal="false">
        <car-driver-add :car-driver="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></car-driver-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listCarDriver,
    delCarDriver,
    batchDelCarDriver
  } from '@/api/oa/car/carDriver';
  import CarDriverAdd from './CarDriverAdd'; //新增界面
  import CarDriverEdit from './CarDriverEdit'; //修改界面
  import {
    mapGetters
  } from 'vuex'
  import config from '@/common/config'

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
        carDrivers: [], //查询结果
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

        addFormVisible: false, //新增carDriver界面是否显示
        //新增carDriver界面初始化数据
        addForm: {
          driverId: '',
          driverUserid: '',
          driverUsername: '',
          driverPhoneno: '',
          driverWeixin: '',
          driverEmel: '',
          driverCardNum: '',
          driverCardImageUrl: '',
          driverStatus: '',
          driverCardStartTime: '',
          driverAge: '',
          driverSex: '',
          driverActYear: '',
          createTime: '',
          driverCardType: '',
          driverBranchId: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑carDriver界面初始化数据
        editForm: {
          driverId: '',
          driverUserid: '',
          driverUsername: '',
          driverPhoneno: '',
          driverWeixin: '',
          driverEmel: '',
          driverCardNum: '',
          driverCardImageUrl: '',
          driverStatus: '',
          driverCardStartTime: '',
          driverAge: '',
          driverSex: '',
          driverActYear: '',
          createTime: '',
          driverCardType: '',
          driverBranchId: ''
        },
        /**begin 自定义属性请在下面加 请加备注**/
        baseImageUrl: config.getArcFileUploadBasePath() + '/',
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleClear() {
        this.searchCarDrivers();
      },
      searchOnEnter() {
        this.searchCarDrivers();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getCarDrivers();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getCarDrivers();
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
        this.getCarDrivers();
      },
      searchCarDrivers() {
        this.pageInfo.count = true;
        this.getCarDrivers();
      },
      //获取列表 CarDriver car_driver
      getCarDrivers() {
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
        listCarDriver(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.carDrivers = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 CarDriver car_driver
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 CarDriver car_driver
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getCarDrivers();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getCarDrivers();
      },
      //选择行carDriver
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除carDriver
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            driverId: row.driverId
          };
          delCarDriver(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCarDrivers();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除carDriver
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelCarDriver(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCarDrivers();
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
      dateFormat(row, column, cellValue) {
        return cellValue.slice(0, 10)
      }

      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'car-driver-add': CarDriverAdd,
      'car-driver-edit': CarDriverEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getCarDrivers();
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
