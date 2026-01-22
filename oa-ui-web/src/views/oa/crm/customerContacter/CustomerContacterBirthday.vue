<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="模糊查询"></el-input>
      <el-select clearable v-model="currentMonth" placeholder="请选择月份">
        <el-option v-for="item in monthOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-select clearable v-model="currentDay" placeholder="请选择日期">
        <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true" v-on:click="searchCustomerContacters">
        查询</el-button>

    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CustomerContacter crm_customer_contacter-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="customerContacters" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
        @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <!-- <el-table-column sortable type="selection" width="40"></el-table-column> -->

        <el-table-column prop="customerName" show-overflow-tooltip label="客户名称" min-width="80">
          <template slot-scope="scope">
            <span @click="showDetail(scope.row)" class="contacterName">{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contacterName" show-overflow-tooltip label="联系人" min-width="80">
          <template slot-scope="scope">
            <span @click="showDetail(scope.row)" class="contacterName">{{scope.row.contacterName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="titleName" show-overflow-tooltip label="称呼" min-width="80"></el-table-column>
        <el-table-column prop="phoneOffice" show-overflow-tooltip label="办公室电话" min-width="80"></el-table-column>
        <el-table-column prop="mobilePhone" show-overflow-tooltip label="手机" min-width="80"></el-table-column>
        <el-table-column prop="contacterEmail" show-overflow-tooltip label="邮箱" min-width="80"></el-table-column>
        <el-table-column prop="birthday" show-overflow-tooltip label="生日" min-width="80">
          <template slot-scope="scope">
            <span v-html="scope.row.birthday"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

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

        //月份数组
        monthOptions: [],
        //天份数组
        dayOptions: [],

        //当前月
        currentMonth: '',
        //当前天
        currentDay: '',
        currentYear: '',
        tableHeight: 300,
        monthEnd:'',//月份结束的日子，如28、30、31
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
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
        } else {
          //params.xxx=xxxxx
        }
        this.getMonthEnd();//计算所选月份结束日期
        //日期查询
        if (!this.isNull(this.currentMonth)) {
          let beginDay = this.currentYear + "-" + this.currentMonth + "-01";
          let endDay = this.currentYear + "-" + this.currentMonth + "-" + this.monthEnd;
          params.beginDay = beginDay;
          params.endDay = endDay;
        }

        if (!this.isNull(this.currentMonth) && !this.isNull(this.currentDay)) {
          let beginDay = this.currentYear + "-" + this.currentMonth + "-" + this.currentDay;
          let endDay = this.currentYear + "-" + this.currentMonth + "-" + this.currentDay;
          params.beginDay = beginDay;
          params.endDay = endDay;
        }

        this.load.list = true;
        listCustomerContacter(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.customerContacters = res.data.data;
            this.customerContacters.forEach(c => {
              if (!this.isNull(c.birthday)) {
                c.birthday = c.birthday.substring(5, 10);
                if (c.birthday === util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss").substring(5, 10)) {
                  c.birthday = c.birthday + "<span style='color:red; margin-left:3px;'>(今天)</span>";
                }
              }
            })
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      isNull(data) {
        if (data === null || data === '' || data === undefined) {
          return true;
        }
        return false;
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

      initData() {
        this.monthOptions = [];
        this.dayOptions = [];

        for (let index = 1; index < 13; index++) {
          if (index < 10) {
            index = "0" + index
          } else {
            index = index + ""
          };
          let params = {
            label: index + "月",
            value: index
          }
          this.monthOptions.push(params);
        }

        for (let index = 1; index < 32; index++) {
          if (index < 10) {
            index = "0" + index
          } else {
            index = index + ""
          };
          let params = {
            label: index + "日",
            value: index
          }
          this.dayOptions.push(params);
        }

        //设置当前月份进行查询
        let currentDate = util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.currentMonth = currentDate.substring(5, 7);
        this.currentYear = currentDate.substring(0, 4);
      },
      getMonthEnd(){
        let d = new Date();
        let date = new Date(this.currentYear,this.currentMonth,0);
        this.monthEnd =  date.getDate();
      }

      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {

      //在下面添加其它组件
    },
    mounted() {
      this.initData();
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

</style>

<style>
  .app-container{
    padding: 20px;
    padding-bottom: 0;
  }
</style>
