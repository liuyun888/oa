<template>
  <section class="rcs page-container">
    <el-row class="page-header">
      <el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
      </el-date-picker>
      <el-input v-model="filters.key" style="width: 270px;" placeholder="模糊查询"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 13px;" v-loading="load.list"
        :disabled="load.list==true" v-on:click="searchRcSchedules">查询
      </el-button>
      <el-button icon="el-icon-plus" @click="showAdd" style="margin-right: 13px;margin-left: 0;">新增日程</el-button>
      <el-button icon="el-icon-check" v-loading="load.del" @click="batchComplete"
        :disabled="this.sels.length===0 || load.del==true" style="margin-left: 0;">批量完成</el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 RcSchedule rc_schedule-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="rcSchedules" @sort-change="sortChange"
        v-loading="load.list" @selection-change="selsChange" @row-click="showShow" style="width: 100%;" border>
        <el-table-column type="selection" :selectable="canselect" min-width="50" width="50"></el-table-column>
        <el-table-column sortable prop="title" show-overflow-tooltip label="日程标题" min-width="80" width="300">
        </el-table-column>
        <el-table-column sortable prop="rcType" show-overflow-tooltip label="日程类型" min-width="80"></el-table-column>
        <el-table-column sortable prop="urgent" show-overflow-tooltip label="紧急程度" min-width="80"></el-table-column>
        <el-table-column class="createname" sortable prop="createUsername" label="日程创建人" min-width="80">
        </el-table-column>
        <el-table-column sortable prop="status" label="日程状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="primary">未完成</el-tag>
            <el-tag v-if="scope.row.status == 1" type="primary">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="startTime" show-overflow-tooltip label="日程开始时间" min-width="150">
        </el-table-column>
        <el-table-column sortable prop="endTime" show-overflow-tooltip label="日程结束时间" min-width="150"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="delSchedule(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 RcSchedule rc_schedule界面-->
      <el-dialog title="编辑日程" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-edit :rc-schedule="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></rc-schedule-edit>
      </el-dialog>

      <!--新增 RcSchedule rc_schedule界面-->
      <el-dialog title="新增日程" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-add :rc-schedule="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></rc-schedule-add>
      </el-dialog>

      <!-- <el-dialog title="查看日程" :visible.sync="showFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-show :rc-schedule="showForm" :visible="showFormVisible" @edit="showShow"
          @cancel="showFormVisible=false" @submit="aftershowSubmit"></rc-schedule-show>
      </el-dialog> -->
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listRcSchedule,
    delRcSchedule,
    batchCompleteRcSchedule
  } from '@/api/oa/rc/rcSchedule';
  import RcScheduleAdd from '../rcSchedule/RcScheduleAdd'; //新增日程界面
  import RcScheduleEdit from './RcScheduleEdit'; //修改界面
  import RcScheduleShow from './RcScheduleShow';
  import {
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      // date(value){
      //   this.date = value
      // }
    },
    data() {
      return {
        filters: {
          key: ''
        },
        rcSchedules: [], //查询结果
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
        addFormVisible: false, //新增rcSchedule界面是否显示
        editFormVisible: false, //编辑界面是否显示
        //新增rcSchedule界面初始化数据
        addForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: false,
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },
        //编辑rcSchedule界面初始化数据
        editForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: '',
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },

        showFormVisible: false, //显示界面是否显示
        //显示rcSchedule界面初始化数据
        showForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: '',
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },
        listLoading: false,
        rcmoreVisible: false,
        date: util.getDate(),
        /**begin 自定义属性请在下面加 请加备注**/
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      canselect(row, index) {
        return row.status == "0";
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getRcSchedules();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getRcSchedules();
      },
      // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
      sortChange(obj) {
        console.log("sss");
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
        this.rcSchedules.sort(function(a, b) {
          if (a > b) {
            return -1;
          } else {
            return 1;
          }
        });
      },
      searchRcSchedules() {
        this.pageInfo.count = true;
        this.getRcSchedules();
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getRcSchedules();
      },
      //获取列表 RcSchedule rc_schedule
      getRcSchedules() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count,
          createUserid: this.pageInfo.userid,
          orderBy: "exec_calc_date desc",
          status: 0
        };
        if (this.date) {
          params.execDate = this.date
        }
        // if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        //   let orderBys = [];
        //   for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
        //     orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        //   }
        //   params.orderBy = orderBys.join(",")
        // }
        if (this.filters.key !== "") {
          // params.title = '%'+this.filters.key+'%';
          // console.log(params.title);
          //params.xxx=this.filters.key
        } else {
          //params.xxx=xxxxx
        }
        this.load.list = true;
        listRcSchedule(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            console.log(res.data.data)
            this.rcSchedules = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },



      //显示新增界面 RcSchedule rc_schedule
      showAdd: function(time) {
        this.addForm.rcType = "工作安排";
        this.addForm.urgent = "重要";
        this.addForm.receiveUsername = this.userInfo.username;
        this.addForm.receiveUserid = this.userInfo.userid;
        this.addForm = Object.assign({}, this.addForm);
        this.addFormVisible = true;
      },

      showEdit: function(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);

      },
      showShow: function(row) {
        this.showFormVisible = true;
        this.showForm = Object.assign({}, row);
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getRcSchedules();
      },

      aftershowSubmit() {
        this.showFormVisible = false;
        this.getRcSchedules();
      },
      //选择行rcSchedule
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除rcSchedule
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delRcSchedule(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getRcSchedules();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量修改rcSchedule
      batchComplete: function() {
        this.$confirm('确认要完成吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          this.sels.forEach((item) => {
            item.execStatus = "1"
            item.status = "1"
          })
          batchCompleteRcSchedule(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getRcSchedules();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //删除
      delSchedule(row, index) {
        this.$confirm('确认删除吗？', "提示", {}).then(() => {
          this.load.del = true;
          let params = Object.assign({}, row);
          delRcSchedule(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              // this.$refs['showForm'].resetFields;
              this.getRcSchedules();
              this.pageInfo.count = true;
              this.$emit('submit'); //  @submit="afterShowSubmit"
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      /**begin 自定义函数请在下面加**/


      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'rc-schedule-edit': RcScheduleEdit,
      'rc-schedule-show': RcScheduleShow,
      'rc-schedule-add': RcScheduleAdd,
      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getRcSchedules();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style>
  .rcs .el-dialog__body {
    padding-top: 0 !important;
    padding-bottom: 20px !important;
  }

  .rcs .el-table th>.cell:nth-child(1) {
    padding-left: 14px;
    padding-right: 14px;
  }

  .rcs input[type="number"] {
    padding-left: 5px;
    padding-right: 0;
    width: 48px;
  }
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
