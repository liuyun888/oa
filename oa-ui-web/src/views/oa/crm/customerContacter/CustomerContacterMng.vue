<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="姓名 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchCustomerContacters">查询</el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CustomerContacter crm_customer_contacter-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="customerContacters" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="contacterName" show-overflow-tooltip label="姓名" min-width="80">
          <template slot-scope="scope">
            <span @click="showDetail(scope.row)" class="contacterName">{{scope.row.contacterName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="titleName" show-overflow-tooltip label="称呼" min-width="80"></el-table-column>
        <el-table-column prop="jobTitle" show-overflow-tooltip label="工作头衔" min-width="80"></el-table-column>
        <el-table-column prop="customerName" show-overflow-tooltip label="客户" min-width="80"></el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>


      <!--新增 CustomerContacter crm_customer_contacter界面-->
      <div class="detailDialog">
        <el-dialog :fullscreen="true" :visible.sync="detailFormVisible" :close-on-click-modal="false">
          <customer-contacter-detail :contacter="detailForm" :visible="detailFormVisible" @cancel="dialogCancel"
            @delSubmit="afterDelSubmit"></customer-contacter-detail>
        </el-dialog>
      </div>

    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listCustomerContacter,
    delCustomerContacter,
    batchDelCustomerContacter
  } from '@/api/oa/crm/customerContacter';
  import CustomerContacterAdd from './CustomerContacterAdd'; //新增界面
  import CustomerContacterEdit from './CustomerContacterEdit'; //修改界面
  import CustomerContacterDetail from './CustomerContacterDetail'; //明细界面
  import {
    mapGetters
  } from 'vuex';


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
        customerContacters: [], //查询结果
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
        detailFormVisible: false,
        detailForm: {
          contacterId: '',
          contacterName: '',
          customerId: '',
          customerName: '',
          title: '',
          titleName: '',
          anotherName: '',
          firstName: '',
          jobTitle: '',
          projectRole: '',
          attitude: '',
          attention: '',
          contacterEmail: '',
          phoneOffice: '',
          phoneHome: '',
          mobilePhone: '',
          contacterFax: '',
          imcode: '',
          birthday: '',
          birthdayNotifydays: '',
          contacterLanguage: '',
          isMain: '',
          isPerson: '',
          remark: '',
          remarkDoc: '',
          parentId: '',
          branchId: ''
        },
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleClear() {
        this.searchCustomerContacters();
      },
      searchOnEnter() {
        this.searchCustomerContacters();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getCustomerContacters();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getCustomerContacters();
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
        this.getCustomerContacters();
      },
      searchCustomerContacters() {
        this.pageInfo.count = true;
        this.getCustomerContacters();
      },
      //获取列表 CustomerContacter crm_customer_contacter
      getCustomerContacters() {
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
          //params.xxx=this.filters.key
          params.key = this.filters.key
        } else {
          //params.xxx=xxxxx
        }
        this.load.list = true;
        listCustomerContacter(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.customerContacters = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      showDetail: function(row, index) {
        this.detailFormVisible = true;
        this.detailForm = Object.assign({}, row);
      },

      afterDetailSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getCustomerContacters();
      },

      //选择行customerContacter
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除customerContacter
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            contacterId: row.contacterId
          };
          delCustomerContacter(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerContacters();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除customerContacter
      batchDel: function() {
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelCustomerContacter(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerContacters();
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
      afterDelSubmit() {
        this.detailFormVisible = false;
        this.getCustomerContacters();
      },

      dialogCancel() {
        this.detailFormVisible = false;
        this.getCustomerContacters();
      },

      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'customer-contacter-add': CustomerContacterAdd,
      'customer-contacter-edit': CustomerContacterEdit,
      'customer-contacter-detail': CustomerContacterDetail,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getCustomerContacters();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style scoped>
  .contacterName:hover {
    cursor: pointer;
    text-decoration: underline;
    color: royalblue;
  }
</style>


<style>
  .detailDialog .el-dialog__header {
    padding: 0;
    margin: 0;
    height: 0px;
  }

  .detailDialog .el-dialog__body {
    padding: 0;
    margin: 0;
  }
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
