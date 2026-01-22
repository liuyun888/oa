<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="名称 模糊查询" @keyup.enter.native="searchOnEnter" clearable @clear="handleClear"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchSigSignets">查询</el-button>
      <el-button icon="el-icon-plus" @click="showAdd">添加印章</el-button>
      <el-button type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 SigSignet sig_signet-->
      <el-table ref="procdefsTable" :data="sigSignets" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
        @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :height="tableHeight">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="id" label="印章主键" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signetSn" label="印章标识码" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signetType" :formatter="formatSignetType" label="印章类型公章" show-overflow-tooltip min-width="80">
        </el-table-column>
        <el-table-column prop="signetSimpleName" label="印章简称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="signetName" label="印章全称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="keepRecordId" label="备案编号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="signetContext" label="章面信息" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="signetStatus" :formatter="formatSignetStatus"  label="印章状态" min-width="80">
        </el-table-column>
        <el-table-column prop="signetForm" :formatter="formatSignetForm"  label="印章形态" min-width="80"></el-table-column>
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

      <!--编辑 SigSignet sig_signet界面-->
      <el-dialog title="编辑印章" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <sig-signet-edit :sig-signet="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></sig-signet-edit>
      </el-dialog>

      <!--新增 SigSignet sig_signet界面-->
      <el-dialog title="新增印章" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <sig-signet-add :sig-signet="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></sig-signet-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listSigSignet,
    delSigSignet,
    batchDelSigSignet
  } from '@/api/oa/sig/sigSignet';
  import SigSignetAdd from './SigSignetAdd'; //新增界面
  import SigSignetEdit from './SigSignetEdit'; //修改界面
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
        sigSignets: [], //查询结果
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

        addFormVisible: false, //新增sigSignet界面是否显示
        //新增sigSignet界面初始化数据
        addForm: {
          id: '',
          signetSn: '',
          deviceId: '',
          signetType: '',
          signetSimpleName: '',
          signetName: '',
          keepRecordId: '',
          signetContext: '',
          signetStatus: '',
          signetBranchId: '',
          signetBranchName: '',
          bizFlowState: '',
          bizProcInstId: '',
          signetForm: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑sigSignet界面初始化数据
        editForm: {
          id: '',
          signetSn: '',
          deviceId: '',
          signetType: '',
          signetSimpleName: '',
          signetName: '',
          keepRecordId: '',
          signetContext: '',
          signetStatus: '',
          signetBranchId: '',
          signetBranchName: '',
          bizFlowState: '',
          bizProcInstId: '',
          signetForm: ''
        },
        /**begin 自定义属性请在下面加 请加备注**/
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleClear() {
        this.searchSigSignets();
      },
      searchOnEnter() {
        // 当用户按下回车键时触发搜索
        this.searchSigSignets();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getSigSignets();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getSigSignets();
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
        this.getSigSignets();
      },
      searchSigSignets() {
        this.pageInfo.count = true;
        this.getSigSignets();
      },
      //获取列表 SigSignet sig_signet
      getSigSignets() {
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
          params.key = this.filters.key;
        }
        this.load.list = true;
        listSigSignet(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            console.log(JSON.stringify(res.data.data))
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.sigSignets = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 SigSignet sig_signet
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 SigSignet sig_signet
      showAdd: function() {
        this.addFormVisible = true;
        this.addForm.signetType = "0"
        this.addForm.signetStatus = "0"
        this.addForm.signetForm = "0"
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getSigSignets();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getSigSignets();
      },
      //选择行sigSignet
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除sigSignet
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delSigSignet(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigSignets();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除sigSignet
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelSigSignet(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigSignets();
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
      formatSignetType: function(row) {
        let type = row.signetType;
        if (type == 0) return "公章"
        if (type == 1) return "法人代表章"
      },
      formatSignetStatus: function(row) {
        let type = row.signetStatus;
        if (type == 0) return "启用"
        if (type == 1) return "停用"
      },
      formatSignetForm: function(row) {
        let type = row.signetForm;
        if (type == 0) return "电子印章"
        if (type == 1) return "物理印章"
      }
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'sig-signet-add': SigSignetAdd,
      'sig-signet-edit': SigSignetEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getSigSignets();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      })
    }
  }
</script>

<style scoped>

</style>
