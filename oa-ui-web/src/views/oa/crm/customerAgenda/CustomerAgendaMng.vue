<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="模糊查询"></el-input>
      <el-select v-model="currentPage" @change="pageChange">
        <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCustomerAgendas"
        icon="el-icon-search">查询</el-button>
    </el-row>

    <el-row class="page-main padding-top">

      <!--列表 CustomerAgenda crm_customer_agenda-->
      <div v-if="currentPage === '联系情况'">
        <el-table :height="tableHeight" ref="procdefsTable" :data="customerAgendas" @sort-change="sortChange"
          highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
          style="width: 100%;">
          <el-table-column prop="agendaNav" label="内容" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="agendaText" label="标题" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="urgentLevelName" label="紧急程度名称" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="receiveUserName" label="接收人" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="agendaCreateTime" label="联系时间" show-overflow-tooltip min-width="80"></el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
      </div>

      <div v-if="currentPage === '联系计划'">
        <el-table :data="customerAgendas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
          @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
          <el-table-column prop="agendaNav" label="内容" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="agendaText" label="标题" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="urgentLevelName" label="紧急程度名称" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="receiveUserName" label="接收人" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="agendaCreateTime" label="联系时间" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80"></el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
      </div>




      <!--编辑 CustomerAgenda crm_customer_agenda界面-->
      <el-dialog title="编辑crm_customer_agenda" :visible.sync="editFormVisible" width="50%"
        :close-on-click-modal="false">
        <customer-agenda-edit :customer-agenda="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></customer-agenda-edit>
      </el-dialog>

      <!--新增 CustomerAgenda crm_customer_agenda界面-->
      <el-dialog title="新增crm_customer_agenda" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <customer-agenda-add :customer-agenda="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></customer-agenda-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listCustomerAgenda,
    delCustomerAgenda,
    batchDelCustomerAgenda
  } from '@/api/oa/crm/customerAgenda';
  import CustomerAgendaAdd from './CustomerAgendaAdd'; //新增界面
  import CustomerAgendaEdit from './CustomerAgendaEdit'; //修改界面
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
        customerAgendas: [], //查询结果
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

        addFormVisible: false, //新增customerAgenda界面是否显示
        //新增customerAgenda界面初始化数据
        addForm: {
          agendaId: '',
          agendaText: '',
          agendaNav: '',
          customerId: '',
          customerName: '',
          contacterId: '',
          contacterName: '',
          urgentLevel: '',
          urgentLevelName: '',
          beginTime: '',
          endTime: '',
          tipType: '',
          remindImmediately: '',
          remindBeforeStart: '',
          remindBeforeHour: '',
          remindBeforeMinute: '',
          remindEndStart: '',
          remindEndHour: '',
          remindEndMinute: '',
          workPlanType: '',
          agendaCreateId: '',
          agendaCreateName: '',
          agendaCreateImg: '',
          agendaCreateTime: '',
          isPlan: '',
          branchId: '',
          businessId: '',
          receiveUserName: '',
          receiveUserId: '',
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑customerAgenda界面初始化数据
        editForm: {
          agendaId: '',
          agendaText: '',
          agendaNav: '',
          customerId: '',
          customerName: '',
          contacterId: '',
          contacterName: '',
          urgentLevel: '',
          urgentLevelName: '',
          beginTime: '',
          endTime: '',
          tipType: '',
          remindImmediately: '',
          remindBeforeStart: '',
          remindBeforeHour: '',
          remindBeforeMinute: '',
          remindEndStart: '',
          remindEndHour: '',
          remindEndMinute: '',
          workPlanType: '',
          agendaCreateId: '',
          agendaCreateName: '',
          agendaCreateImg: '',
          agendaCreateTime: '',
          isPlan: '',
          branchId: '',
          businessId: '',
          receiveUserName: '',
          receiveUserId: '',
        },
        /**begin 自定义属性请在下面加 请加备注**/
        //页面选项
        pageOptions: [{
          label: '联系情况',
          value: '联系情况'
        }, {
          label: '联系计划',
          value: '联系计划'
        }],
        currentPage: '联系情况',
        //当前查询数据时联系还是计划
        msgOrPlan: '0',
        tableHeight: 300

        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getCustomerAgendas();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getCustomerAgendas();
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
        this.getCustomerAgendas();
      },
      searchCustomerAgendas() {
        this.pageInfo.count = true;
        this.getCustomerAgendas();
      },
      //获取列表 CustomerAgenda crm_customer_agenda
      getCustomerAgendas() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count,
          isPlan: this.msgOrPlan
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
        } else {
          //params.xxx=xxxxx
        }
        this.load.list = true;
        listCustomerAgenda(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.customerAgendas = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 CustomerAgenda crm_customer_agenda
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 CustomerAgenda crm_customer_agenda
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getCustomerAgendas();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },
      //选择行customerAgenda
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除customerAgenda
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            agendaId: row.agendaId
          };
          delCustomerAgenda(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerAgendas();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除customerAgenda
      batchDel: function() {
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelCustomerAgenda(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerAgendas();
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
      pageChange(data) {
        if (data === '联系计划') {
          this.msgOrPlan = '1'
          this.getCustomerAgendas();
        }

        if (data === '联系情况') {
          this.msgOrPlan = '0'
          this.getCustomerAgendas();
        }

      },


      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'customer-agenda-add': CustomerAgendaAdd,
      'customer-agenda-edit': CustomerAgendaEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getCustomerAgendas();
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
