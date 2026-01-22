<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
      <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCarRequires">查询
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CarRequire car_require-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="carRequires" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="reqStartTime" label="申请用车开始时间" show-overflow-tooltip :formatter="dateFormat" width="110"></el-table-column>
        <el-table-column prop="reqEndTime" label="申请用车结束时间" show-overflow-tooltip :formatter="dateFormat" width="110"></el-table-column>
        <el-table-column prop="id" label="申请编号" show-overflow-tooltip width="100"></el-table-column>
        <!-- <el-table-column prop="reqDeptid" label="申请部门编号" min-width="80" ></el-table-column> -->
        <el-table-column prop="reqDeptName" label="申请部门" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="reqBranchName" label="机构名称" show-overflow-tooltip  min-width="100"></el-table-column>
        <!-- <el-table-column prop="reqBranchId" label="申请机构号" min-width="80" ></el-table-column> -->
        <!-- <el-table-column prop="reqUserid" label="申请人编号" min-width="80" ></el-table-column> -->
        <el-table-column prop="reqUsername" label="申请人姓名" min-width="120"></el-table-column>
        <el-table-column prop="reqPhoneno" label="申请人电话" min-width="120"></el-table-column>
        <el-table-column prop="reqReason" label="申请事由" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="reqTime" label="申请时间" show-overflow-tooltip :formatter="dateFormat" min-width="110"></el-table-column>
        <el-table-column prop="reqStatus" label="申请状态" min-width="80"></el-table-column>
        <el-table-column prop="bizFlowState" label="审批状态" min-width="80"></el-table-column>
        <el-table-column prop="bizProcInstId" label="流程实例编号" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="destAddress" label="目的地地址" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="destGps" label="目的地定位" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="reqTitle" label="申请标题" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="hasRoute" label="是否规划路线" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hasDetail=='1'">是</el-tag>
            <el-tag v-else>否</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
    </el-row>
    <el-row>
      <el-col>
        <el-button v-loading="load.confirm" @click="handleConfirm"
          :disabled="this.sels.length===0 || load.confirm==true" type="primary">提交</el-button>
        <el-button @click.native="handleCancel">取消</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  import {
    listCarRequire
  } from '@/api/oa/car/carRequire';
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

        /**begin 自定义属性请在下面加 请加备注**/
        tableHeight: 150
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
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
        let params = {};
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

      //选择行carRequire
      selsChange: function(sels) {
        this.sels = sels;
      },
      rowClick: function(row, event, column) {
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/
      dateFormat(row, column, cellValue) {
        //console.log(cellValue + "ssssssss")
        if (cellValue != null && cellValue != '')
          return cellValue.slice(0, 10)
        else
          return ''
      },
      handleCancel: function() {
        this.$emit('cancel');
      },
      //确定
      handleConfirm: function() {
        if (this.sels.length < 1) {
          this.$message({
            message: "请选择一个申请车辆请求",
            type: 'error'
          });
          return;
        }
        // if(this.sels.length!=1){
        // 	this.$message({ message: "最多只能选择一个申请车辆请求", type: 'error' });
        // 	return;
        // }
        this.$emit("getSelectRequireVal", this.sels);
      },
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {

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
    padding-left: 0;
  }
</style>
