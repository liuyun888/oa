<template>
	<section class="page-container border padding">
		<el-row class="page-header"> 
			<el-input v-model="filters.key" style="width: 270px;" placeholder="名称"></el-input>
			<el-input v-model="filters.cpGszch" style="width: 270px;" placeholder="纳税人识别码"></el-input>
      <el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
        v-on:click="searchCounterpartys" style="margin-right: 13px;">查询</el-button>
      <el-button icon="el-icon-plus" @click="showAdd" style="margin-left: 0;margin-right: 13px;">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
		<el-row class="page-main padding-top"> 
      <!--列表 Counterparty ht_counterparty-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="counterpartys" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="cpName" show-overflow-tooltip label="相对方名称" min-width="120">
          <template slot-scope="scope">
            <span @click="showDetail(scope.row)" class="custimerName">{{scope.row.cpName}}</span>
          </template>
        </el-table-column> 
        <el-table-column
            prop="cpGszch"
            label="纳税人识别码">
        </el-table-column>
        <el-table-column prop="cpFddb" show-overflow-tooltip label="法定代表" min-width="80"></el-table-column>
        <el-table-column prop="cpTypeName" show-overflow-tooltip label="相对方类型" min-width="80"></el-table-column>
        <el-table-column prop="cpIndustryName" show-overflow-tooltip label="相对放行业" min-width="80"></el-table-column>
        <el-table-column prop="cpRegionName" show-overflow-tooltip label="所在区域" min-width="80"></el-table-column>
        <el-table-column prop="cpLevel" show-overflow-tooltip label="相对放级别" min-width="80"></el-table-column>
        <el-table-column prop="cpFzr" show-overflow-tooltip label="负责人" min-width="80"></el-table-column>
        <el-table-column prop="cpStatus" label="状态" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.cpStatus === '1' ? '认证' : scope.row.cpStatus === '2' ? '非认证' : ''}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column> -->
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 Counterparty ht_counterparty界面-->
      <el-dialog title="编辑向对方" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <counterparty-edit :counterparty="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></counterparty-edit>
      </el-dialog>

      <el-dialog title="" :visible.sync="detailFormVisible" :fullscreen="true" :close-on-click-modal="false">
        <counterparty-detail :counterparty="detailForm" :visible="detailFormVisible" @cancel="detailFormVisible=false"
          @submit="afterDetailSubmit"></counterparty-detail>
      </el-dialog>



      <!--新增 Counterparty ht_counterparty界面-->
      <el-dialog title="新增相对方" :visible.sync="addFormVisible" :fullscreen="true" :close-on-click-modal="false">
        <counterparty-add :counterparty="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></counterparty-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listCounterparty,
    delCounterparty,
    batchDelCounterparty
  } from '@/api/oa/ht/counterparty';
  import CounterpartyAdd from './CounterpartyAdd'; //新增界面
  import CounterpartyEdit from './CounterpartyEdit'; //修改界面
  import CounterpartyDetail from './CounterpartyDetail'; //修改界面
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
          key: '',
          cpGszch:'',
        },
        counterpartys: [], //查询结果
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

        addFormVisible: false, //新增counterparty界面是否显示
        //新增counterparty界面初始化数据
        addForm: {
          cpId: '',
          cpSn: '',
          cpName: '',
          cpShort: '',
          cpLevel: '',
          cpType: '',
          cpTypeName: '',
          cpStatus: '',
          cpIndustry: '',
          cpIndustryName: '',
          cpAddress: '',
          cpRegion: '',
          cpRegionName: '',
          cpWebsite: '',
          cpDesc: '',
          cpFddb: '',
          cpZcxx: '',
          cpGszch: '',
          cpZczb: '',
          cpZcsj: '',
          cpDwzt: '',
          cpDwztName: '',
          cpPhone: '',
          cpEmail: '',
          cpFax: '',
          cpProvince: '',
          cpProvinceCode: '',
          cpCity: '',
          cpCityCode: '',
          cpDistrict: '',
          cpDistrictCode: '',
          cpFzr: '',
          cpFzrPhone: '',
          cpClearWay: '',
          cpClearWayName: '',
          cpOpenBank: '',
          cpCurrency: '',
          cpBankAccount: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑counterparty界面初始化数据
        editForm: {
          cpId: '',
          cpSn: '',
          cpName: '',
          cpShort: '',
          cpLevel: '',
          cpType: '',
          cpTypeName: '',
          cpStatus: '',
          cpIndustry: '',
          cpIndustryName: '',
          cpAddress: '',
          cpRegion: '',
          cpRegionName: '',
          cpWebsite: '',
          cpDesc: '',
          cpFddb: '',
          cpZcxx: '',
          cpGszch: '',
          cpZczb: '',
          cpZcsj: '',
          cpDwzt: '',
          cpDwztName: '',
          cpPhone: '',
          cpEmail: '',
          cpFax: '',
          cpProvince: '',
          cpProvinceCode: '',
          cpCity: '',
          cpCityCode: '',
          cpDistrict: '',
          cpDistrictCode: '',
          cpFzr: '',
          cpFzrPhone: '',
          cpClearWay: '',
          cpClearWayName: '',
          cpOpenBank: '',
          cpCurrency: '',
          cpBankAccount: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },

        /**begin 自定义属性请在下面加 请加备注**/
        detailFormVisible: false,
        detailForm: {
          cpId: '',
          cpSn: '',
          cpName: '',
          cpShort: '',
          cpLevel: '',
          cpType: '',
          cpTypeName: '',
          cpStatus: '',
          cpIndustry: '',
          cpIndustryName: '',
          cpAddress: '',
          cpRegion: '',
          cpRegionName: '',
          cpWebsite: '',
          cpDesc: '',
          cpFddb: '',
          cpZcxx: '',
          cpGszch: '',
          cpZczb: '',
          cpZcsj: '',
          cpDwzt: '',
          cpDwztName: '',
          cpPhone: '',
          cpEmail: '',
          cpFax: '',
          cpProvince: '',
          cpProvinceCode: '',
          cpCity: '',
          cpCityCode: '',
          cpDistrict: '',
          cpDistrictCode: '',
          cpFzr: '',
          cpFzrPhone: '',
          cpClearWay: '',
          cpClearWayName: '',
          cpOpenBank: '',
          cpCurrency: '',
          cpBankAccount: '',
          branchId: '',
          createTime: '',
          createUserId: '',
          createUserName: ''
        },
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getCounterpartys();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getCounterpartys();
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
        this.getCounterpartys();
      },
      searchCounterpartys() {
        this.pageInfo.count = true;
        this.getCounterpartys();
      },
      //获取列表 Counterparty ht_counterparty
      getCounterpartys() {
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
          params.key=this.filters.key
        }
        
				if(this.filters.cpGszch){
					params.cpGszch=this.filters.cpGszch
				}
        this.load.list = true;
        listCounterparty(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.counterpartys = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },

      //显示编辑界面 Counterparty ht_counterparty
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },

      showDetail: function(row, index) {
        this.detailFormVisible = true;
        this.detailForm = Object.assign({}, row);
      },

      //显示新增界面 Counterparty ht_counterparty
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },

      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getCounterpartys();
      },

      afterEditSubmit() {
        this.editFormVisible = false;
      },

      afterDetailSubmit() {
        this.detailFormVisible = false;
      },

      //选择行counterparty
      selsChange: function(sels) {
        this.sels = sels;
      },

      //删除counterparty
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            cpId: row.cpId
          };
          delCounterparty(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCounterpartys();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除counterparty
      batchDel: function() {
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelCounterparty(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getCounterpartys();
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
      }
      /**begin 自定义函数请在下面加**/

      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'counterparty-add': CounterpartyAdd,
      'counterparty-edit': CounterpartyEdit,
      'counterparty-detail': CounterpartyDetail,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getCounterpartys();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style scoped>
  .custimerName:hover {
    text-decoration: underline;
    color: royalblue;
    cursor: pointer !important;
  }
</style>

<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
