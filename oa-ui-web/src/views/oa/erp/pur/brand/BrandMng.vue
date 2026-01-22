<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="品牌名称｜首字母 模糊查询" clearable
                @clear="handleClear"
                @keyup.enter.native="searchOnEnter"></el-input>
      <el-button icon="el-icon-search" type="primary" v-loading="load.list" :disabled="load.list==true"
                 v-on:click="searchBrands">查询
      </el-button>
      <el-button icon="el-icon-plus" @click="showAdd">新增品牌</el-button>
      <el-button icon="el-icon-delete" type="danger" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 Brand pur_brand-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="brands" @sort-change="sortChange" highlight-current-row
                v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
        <el-table-column sortable type="selection" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column sortable type="index" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌名称" min-width="60" show-overflow-tooltip></el-table-column>
        <el-table-column prop="firstLetter" label="首字母" min-width="50" show-overflow-tooltip></el-table-column>
        <el-table-column prop="personUser" label="责任人" min-width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="personPhone" label="联系电话" min-width="50" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandDate" label="入驻时间" min-width="50" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandStatus" label="品牌状态" min-width="45" show-overflow-tooltip></el-table-column>
        <el-table-column prop="factoryStatus" label="是否为品牌制作商" min-width="50" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.factoryStatus == '0' ? '否' : '是' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isPrefit" label="是否盈余" min-width="45" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.isPrefit == '0' ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brandAddress" label="品牌供应商地址" min-width="50"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="logo" label="品牌logo" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title=""
              trigger="hover">
              <img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.logo"/>
              <img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.logo"
                   :alt="baseImageUrl + scope.row.logo">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="bigPic" label="专区大图" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title=""
              trigger="hover">
              <img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.bigPic"/>
              <img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.bigPic"
                   :alt="baseImageUrl + scope.row.bigPic">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="brandStory" label="品牌故事" min-width="70" how-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" @click="showEdit( scope.row,scope.$index)"></el-button>
            <el-button icon="el-icon-delete" type="danger" @click="handleDel(scope.row,scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                     style="float:right;"></el-pagination>

      <!--编辑 Brand pur_brand界面-->
      <el-dialog title="编辑品牌" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <brand-edit :brand="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                    @submit="afterEditSubmit"></brand-edit>
      </el-dialog>

      <!--新增 Brand pur_brand界面-->
      <el-dialog title="新增品牌" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <brand-add :brand="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                   @submit="afterAddSubmit"></brand-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {listBrand, delBrand, batchDelBrand} from '@/api/oa/erp/pur/brand';
import BrandAdd from './BrandAdd';//新增界面
import BrandEdit from './BrandEdit';//修改界面
import {mapGetters} from 'vuex';
import config from '@/common/config'

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
      tableHeight: 300,
      brands: [],//查询结果
      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count: false,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: {list: false, edit: false, del: false, add: false},//查询中...
      sels: [],//列表选中数据
      options: {},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false,//新增brand界面是否显示
      //新增brand界面初始化数据
      addForm: {
        id: '', brandName: '', firstLetter: '', factoryStatus: '', logo: '', bigPic: '', brandStory: ''
      },

      editFormVisible: false,//编辑界面是否显示
      //编辑brand界面初始化数据
      editForm: {
        id: '', brandName: '', firstLetter: '', factoryStatus: '', logo: '', bigPic: '', brandStory: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      baseImageUrl: config.getArcFileUploadBasePath() + '/',
      /**end 自定义属性请在上面加 请加备注**/
    }
  },//end data
  methods: {
    handleClear() {
      this.searchBrands();
    },
    searchOnEnter() {
      this.searchBrands();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getBrands();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getBrands();
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
      this.getBrands();
    },
    searchBrands() {
      this.pageInfo.count = true;
      this.getBrands();
    },
    //获取列表 Brand pur_brand
    getBrands() {
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
        // params.brandName = '%' + this.filters.key + '%';
        params.key = this.filters.key;
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listBrand(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.brands = res.data.data;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 Brand pur_brand
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Brand pur_brand
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getBrands();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getBrands();
    },
    //选择行brand
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除brand
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delBrand(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getBrands();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除brand
    batchDel: function () {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelBrand(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getBrands();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column);//  @row-click="rowClick"
    }
    /**begin 自定义函数请在下面加**/


    /**end 自定义函数请在上面加**/

  },//end methods
  components: {
    'brand-add': BrandAdd,
    'brand-edit': BrandEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getBrands();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
}

</script>

<style scoped>

</style>
