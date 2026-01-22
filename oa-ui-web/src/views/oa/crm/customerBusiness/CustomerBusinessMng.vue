<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="模糊查询"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchCustomerBusinesss">查询</el-button>
      <el-button @click="showAdd" icon="el-icon-plus">添加</el-button>
      <!-- <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  -->
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 CustomerBusiness crm_customer_business-->
      <el-col class="leftTable" :span="leftSpan">
        <el-table :height="tableHeight" ref="leftTable" :data="customerBusinesss" @sort-change="sortChange" highlight-current-row
          v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
          <el-table-column sortable type="selection" width="40"></el-table-column>
          <el-table-column prop="businessName" show-overflow-tooltip label="商机名称" min-width="80">
            <template slot-scope="scope">
              <span @click="showEdit(scope.row)" class="businessName">{{scope.row.businessName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="managerUserName" show-overflow-tooltip label="客户经理" min-width="80"></el-table-column>

          <el-table-column prop="isAttention" label="关注">
            <template slot-scope="scope">
              <i @click="setAttention(scope.row)"
                :class="scope.row.businessIsAttention === '1' ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
        <div v-show="isShowRightMenu" :style="{'top': menuTop}" class="rightMenu" @click="openRightDrawer">
        </div>
      </el-col>

      <!-- 右边的按钮 -->
      <el-col v-if="isShowRightNav" class="rightNav" :span="rightSpan">
        <right-drawer-components :businessId="currentBusinessId" :businessName="currentBusinessName"
          :isShowAll="isShowAll" :visible="isShowRightNav" :customerName="currentCustomerName"
          :customerManagerUserName="currentCustomerManagerUserName" :customerId="currentCustomerId">
        </right-drawer-components>
      </el-col>

      <!--编辑 CustomerBusiness crm_customer_business界面-->
      <el-dialog :fullscreen="true" title="编辑商机" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <customer-business-edit :customer-business="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></customer-business-edit>
      </el-dialog>

      <!--新增 CustomerBusiness crm_customer_business界面-->
      <el-dialog :fullscreen="true" title="新增商机" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <customer-business-add :customer-business="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></customer-business-add>
      </el-dialog>

    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listCustomerBusiness,
    delCustomerBusiness,
    batchDelCustomerBusiness,
    isAttention
  } from '@/api/oa/crm/customerBusiness';
  import CustomerBusinessAdd from './CustomerBusinessAdd'; //新增界面
  import CustomerBusinessEdit from './CustomerBusinessEdit'; //修改界面
  import {
    mapGetters
  } from 'vuex'
  import RightDrawerComponents from '../components/RightDrawerComponents';

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
        customerBusinesss: [], //查询结果
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

        addFormVisible: false, //新增customerBusiness界面是否显示
        //新增customerBusiness界面初始化数据
        addForm: {
          businessId: '',
          businessName: '',
          businessType: '',
          expectDate: '',
          customerId: '',
          customerName: '',
          expectEarnings: '',
          managerUserId: '',
          managerUserName: '',
          possibility: '',
          scheduleId: '',
          successKeyCause: '',
          faulitKeyCause: '',
          intermediaryOrganId: '',
          intermediaryOrganName: '',
          archiveStatus: '',
          businessStatus: '1',
          businessCreateId: '',
          businessCreateName: '',
          businessCreateTime: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑customerBusiness界面初始化数据
        editForm: {
          businessId: '',
          businessName: '',
          businessType: '',
          expectDate: '',
          customerId: '',
          customerName: '',
          expectEarnings: '',
          managerUserId: '',
          managerUserName: '',
          possibility: '',
          scheduleId: '',
          successKeyCause: '',
          faulitKeyCause: '',
          intermediaryOrganId: '',
          intermediaryOrganName: '',
          archiveStatus: '',
          businessStatus: '',
          businessCreateId: '',
          businessCreateName: '',
          businessCreateTime: ''
        },

        /**begin 自定义属性请在下面加 请加备注**/
        //侧面抽屉
        leftSpan: 24,
        rightSpan: 9,
        //是否展示右侧内容
        isShowRightNav: false,
        //是否展示右侧显示的按钮
        isShowRightMenu: false,
        menuTop: "0px",
        isShowAll: 'medium',
        currentBusinessId: '',
        currentBusinessName: '',
        currentCustomerId: '',
        currentCustomerName: '',
        currentCustomerManagerUserName: '',
        tableHeight: 300

        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getCustomerBusinesss();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getCustomerBusinesss();
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
        this.getCustomerBusinesss();
      },
      searchCustomerBusinesss() {
        this.pageInfo.count = true;
        this.getCustomerBusinesss();
      },
      //获取列表 CustomerBusiness crm_customer_business
      getCustomerBusinesss() {
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
        this.load.list = true;
        listCustomerBusiness(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.customerBusinesss = res.data.data;
            if (this.customerBusinesss.length > 1) {
              this.currentBusinessId = this.customerBusinesss[0].businessId;
              this.currentBusinessName = this.customerBusinesss[0].businessName;
              this.currentCustomerId = this.customerBusinesss[0].customerId;
              this.currentCustomerName = this.customerBusinesss[0].customerName;
              this.currentCustomerManagerUserName = this.customerBusinesss[0].managerUserName;
            }
            this.showMenu();
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 CustomerBusiness crm_customer_business
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },

      //显示新增界面 CustomerBusiness crm_customer_business
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getCustomerBusinesss();
      },
      afterEditSubmit() {
        this.getCustomerBusinesss();
        this.editFormVisible = false;
      },
      //选择行customerBusiness
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除customerBusiness
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            businessId: row.businessId
          };
          delCustomerBusiness(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerBusinesss();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除customerBusiness
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelCustomerBusiness(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCustomerBusinesss();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      rowClick: function(row, event, column) {
        this.currentCustomerId = row.customerId;
        this.currentCustomerName = row.customerName;
        this.currentCustomerManagerUserName = row.managerUserName;
        this.currentBusinessId = row.businessId;
        this.currentBusinessName = row.businessName;
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },

      /**begin 自定义函数请在下面加**/
      //设置关注
      setAttention(row) {

        let params = {
          businessId: row.businessId,
          businessIsAttention: row.businessIsAttention === '0' ? '1' : '0'
        }

        isAttention(params).then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            row.businessIsAttention = row.businessIsAttention === '0' ? '1' : '0';
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
        })

      },

      //开启右侧抽屉
      openRightDrawer() {
        this.isShowRightNav = !this.isShowRightNav;
        this.isShowRightNav ? this.leftSpan = 15 : this.leftSpan = 24;
      },

      //展示右侧按钮
      showMenu() {
        this.$nextTick(() => {
          this.isShowRightMenu = true;
          this.menuTop = (this.$refs.leftTable.$el.clientHeight / 2 - 10) + "px";
        })
      },



      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'customer-business-add': CustomerBusinessAdd,
      'customer-business-edit': CustomerBusinessEdit,

      'right-drawer-components': RightDrawerComponents,
      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getCustomerBusinesss();
        var clientRect = this.$refs.leftTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.leftTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style scoped>
  .el-icon-star-off,
  .el-icon-star-on {
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
  }

  .el-icon-star-off {
    color: rgb(233, 233, 233);
  }

  .el-icon-star-on {
    color: rgb(245, 166, 35);
  }

  .leftTable {
    position: relative;
  }

  .rightMenu {
    font-size: 40px;
    color: royalblue;
    position: absolute;
    cursor: pointer;
    z-index: 2;
    right: 0px;
    height: 58px;
    padding: 10px;
    background: url('../customer/img/show-hover.png') -2px 0px no-repeat;
  }

  .businessName:hover {
    cursor: pointer;
    text-decoration: underline;
    color: royalblue;
  }
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
