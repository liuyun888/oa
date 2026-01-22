<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="车牌号｜车名 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCarOfficeCars"
                 icon="el-icon-search">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus">新增车辆</el-button>
      <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"
                 icon="el-icon-delete">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CarOfficeCar car_office_car-->
      <el-table ref="procdefsTable" :height="tableHeight" :data="carOfficeCars" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column> -->
        <el-table-column prop="carNum" label="车牌号" min-width="120"></el-table-column>
        <el-table-column prop="carName" label="车名" min-width="200"></el-table-column>
        <el-table-column prop="carBrandId" label="汽车品牌编号" min-width="120"></el-table-column>
        <el-table-column prop="carBrandName" label="汽车品牌名称" min-width="120"></el-table-column>
        <el-table-column label="汽车前照片" min-width="120">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <el-image style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carFrontImageUrl"></el-image>
              <el-image style="width: 70px; height: 40px" slot="reference"
                        :src="baseImageUrl + scope.row.carFrontImageUrl"
                        :alt="baseImageUrl + scope.row.carFrontImageUrl">
              </el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="汽车后照片" min-width="120">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <el-image style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carBackImageUrl"></el-image>
              <el-image style="width: 70px; height: 40px" slot="reference"
                        :src="baseImageUrl + scope.row.carBackImageUrl" :alt="baseImageUrl + scope.row.carBackImageUrl">
              </el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="汽车内饰照片" min-width="120">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="" trigger="hover">
              <el-image style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carInnerImageUrl"></el-image>
              <el-image style="width: 70px; height: 40px" slot="reference"
                        :src="baseImageUrl + scope.row.carInnerImageUrl"
                        :alt="baseImageUrl + scope.row.carInnerImageUrl">
              </el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="carType" label="汽车类型" min-width="100">
          <template slot-scope="scope">
            <!-- 0小轿车1商务车2面包车3小货车4大货车 -->
            <el-tag v-if="scope.row.carType=='0'">小轿车</el-tag>
            <el-tag v-if="scope.row.carType=='1'">商务车</el-tag>
            <el-tag v-if="scope.row.carType=='2'">面包车</el-tag>
            <el-tag v-if="scope.row.carType=='3'">小货车</el-tag>
            <el-tag v-if="scope.row.carType=='4'">大货车</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="carStatus" label="汽车状态" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.carStatus=='1'">启用</el-tag>
            <el-tag v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="carDeptName" label="汽车归属部门" show-overflow-tooltip
                         min-width="200"></el-table-column>
        <!-- <el-table-column prop="carBranchId" label="汽车归属机构" min-width="80" ></el-table-column>
				<el-table-column prop="carDeptName" label="汽车归属部门名称" min-width="80" ></el-table-column>
				<el-table-column prop="carBranchName" label="汽车归属机构名称" min-width="80" ></el-table-column> -->
        <el-table-column prop="createTime" label="新增时间" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="carSeating" label="汽车座位数" min-width="80"></el-table-column>
        <el-table-column prop="carLoadWeight" label="汽车载重量(kg)" min-width="100"></el-table-column>
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

      <!--编辑 CarOfficeCar car_office_car界面-->
      <el-dialog title="编辑车辆信息" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <car-office-car-edit :car-office-car="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                             @submit="afterEditSubmit"></car-office-car-edit>
      </el-dialog>

      <!--新增 CarOfficeCar car_office_car界面-->
      <el-dialog title="新增车辆信息" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <car-office-car-add :car-office-car="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                            @submit="afterAddSubmit"></car-office-car-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
// todo 车辆中心-(车辆管理、司机中心)、()页面有数据, 显示完后项目直接停掉了
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listCarOfficeCar,
  delCarOfficeCar,
  batchDelCarOfficeCar
} from '@/api/oa/car/carOfficeCar';
import CarOfficeCarAdd from './CarOfficeCarAdd'; //新增界面
import CarOfficeCarEdit from './CarOfficeCarEdit'; //修改界面
import config from '@/common/config'
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
      carOfficeCars: [], //查询结果
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

      addFormVisible: false, //新增carOfficeCar界面是否显示
      //新增carOfficeCar界面初始化数据
      addForm: {
        id: '',
        carNum: '',
        carName: '',
        carBrandId: '',
        carBrandName: '',
        carFrontImageUrl: '',
        carBackImageUrl: '',
        carInnerImageUrl: '',
        carType: '',
        carStatus: '',
        carDeptid: '',
        carBranchId: '',
        carDeptName: '',
        carBranchName: '',
        createTime: '',
        carSeating: '',
        carLoadWeight: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑carOfficeCar界面初始化数据
      editForm: {
        id: '',
        carNum: '',
        carName: '',
        carBrandId: '',
        carBrandName: '',
        carFrontImageUrl: '',
        carBackImageUrl: '',
        carInnerImageUrl: '',
        carType: '',
        carStatus: '',
        carDeptid: '',
        carBranchId: '',
        carDeptName: '',
        carBranchName: '',
        createTime: '',
        carSeating: '',
        carLoadWeight: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      baseImageUrl: config.getArcFileUploadBasePath() + '/',
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchCarOfficeCars();
    },
    searchOnEnter() {
      this.searchCarOfficeCars();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getCarOfficeCars();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getCarOfficeCars();
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
      this.getCarOfficeCars();
    },
    searchCarOfficeCars() {
      this.pageInfo.count = true;
      this.getCarOfficeCars();
    },
    //获取列表 CarOfficeCar car_office_car
    getCarOfficeCars() {
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
        params.keyWord = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listCarOfficeCar(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.carOfficeCars = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 CarOfficeCar car_office_car
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 CarOfficeCar car_office_car
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getCarOfficeCars();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getCarOfficeCars();
    },
    //选择行carOfficeCar
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除carOfficeCar
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delCarOfficeCar(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarOfficeCars();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除carOfficeCar
    batchDel: function () {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelCarOfficeCar(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getCarOfficeCars();
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
      return cellValue.slice(0, 10)
    }

    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'car-office-car-add': CarOfficeCarAdd,
    'car-office-car-edit': CarOfficeCarEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getCarOfficeCars();
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
