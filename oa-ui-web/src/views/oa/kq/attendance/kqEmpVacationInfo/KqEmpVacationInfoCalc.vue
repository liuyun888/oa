<template>
	<section class="page-container border padding">
    <el-row>
      <el-col :span="6">
        <dept-tree show-root multiple default-expand-all show-checkbox :expand-on-click-node="false"
          @check-change="searchKqEmpVacationInfos" ref="deptTree"></dept-tree>
      </el-col>
      <el-col :span="18">
        <el-row class="page-header">
          <el-date-picker v-model="filters.year" type="year" value-format="yyyy" placeholder="选择年份">
          </el-date-picker>
          <el-input v-model="filters.key" style="width: 20%;" placeholder="员工名称或编号 模糊查询"></el-input>
          <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchKqEmpVacationInfos"
            icon="el-icon-search">查询</el-button>
        </el-row>
        <el-row class="page-main padding-top">
          <!--列表 KqEmpVacationInfo kq_emp_vacation_info-->
          <el-table :height="tableHeight" ref="procdefsTable" :data="kqEmpVacationInfos" @sort-change="sortChange"
            highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
            style="width: 100%;">
            <el-table-column sortable type="selection" width="40"></el-table-column>
            <el-table-column sortable type="index" width="40"></el-table-column>
            <el-table-column prop="username" show-overflow-tooltip label="员工名称" min-width="80"></el-table-column>
            <el-table-column prop="deptName" show-overflow-tooltip label="部门" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip label="假期数(小时)" min-width="80">

              <el-table-column prop="initHours" show-overflow-tooltip label="总数" min-width="80"></el-table-column>
              <el-table-column prop="canHours" show-overflow-tooltip label="可用" min-width="80"></el-table-column>
              <el-table-column prop="usedHours" show-overflow-tooltip label="已用" min-width="80"></el-table-column>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="分类统计(小时)" min-width="80">

              <el-table-column show-overflow-tooltip :label="item.name" min-width="80" v-for=" (item,index) in kqVacationTypes" :key="index">
                <el-table-column :prop="'canHours_'+item.id" show-overflow-tooltip label="可用" min-width="80"></el-table-column>
                <el-table-column :prop="'usedHours_'+item.id" show-overflow-tooltip label="已用" min-width="80"></el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

        </el-row>
          </el-col>
        </el-row>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  import config from "@/common/config"; //全局公共库
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询

  import {
    listKqVacationType
  } from "@/api/oa/kq/kqVacationType";
  import {
    empVacationCalc
  } from "@/api/oa/kq/kqEmpVacationInfo";
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
  import {
    mapGetters
  } from "vuex";

  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    data() {
      var date=new Date();
      return {
        filters: {
          key: "",
          year:date.getFullYear()+"",
        },
        kqEmpVacationInfos: [], //查询结果
        pageInfo: {
          //分页数据
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

        tableHeight: 300,
        /**begin 自定义属性请在下面加 请加备注**/
        kqVacationTypes:[],
        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getKqEmpVacationInfos();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getKqEmpVacationInfos();
      },
      // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
      sortChange(obj) {
        var dir = "asc";
        if (obj.order == "ascending") {
          dir = "asc";
        } else {
          dir = "desc";
        }
        if (obj.prop == "xxx") {
          this.pageInfo.orderFields = ["xxx"];
          this.pageInfo.orderDirs = [dir];
        }
        this.getKqEmpVacationInfos();
      },
      searchKqEmpVacationInfos() {
        this.pageInfo.count = true;
        this.getKqEmpVacationInfos();
      },

      //选择行kqEmpVacationInfo
      selsChange: function(sels) {
        this.sels = sels;
      },
      //获取列表 KqEmpVacationInfo kq_emp_vacation_info
      getKqEmpVacationInfos() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
        };
        if (
          this.pageInfo.orderFields != null &&
          this.pageInfo.orderFields.length > 0
        ) {
          let orderBys = [];
          for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
            orderBys.push(
              this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
            );
          }
          params.orderBy = orderBys.join(",");
        }
        if (this.filters.key !== "") {
          params.key = this.filters.key;
        }

        var deptids=this.$refs.deptTree.$refs.deptTree.getCheckedKeys();
        if(deptids.length>0){
          params.deptids=deptids;
        }
        if (this.filters.year !== "") {
          params.year = this.filters.year
        }
        this.load.list = true;
        empVacationCalc(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.kqEmpVacationInfos = res.data.data;
            } else {
              this.$message({
                message: tips.msg,
                type: "error"
              });
            }
            this.load.list = false;
          })
          .catch(err => (this.load.list = false));
      },

      rowClick: function(row, event, column) {
        this.$emit("row-click", row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/

      //查询请假类型
      getKqVacationType() {
        let params = {
          branchId: this.userInfo.branchId
        };
        listKqVacationType(params).then(res => {
          let tips = res.data.tips;
          if (tips.isOk) {
           this.kqVacationTypes = res.data.data;

          }
        });
      },
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      DeptTree,
      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getKqVacationType();
        //this.getKqEmpVacationInfos();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  };
</script>

<style scoped>
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
