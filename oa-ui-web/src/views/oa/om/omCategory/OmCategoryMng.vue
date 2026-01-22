<template>
  <section>
    <el-row class="page-container border padding">
      <el-row class="page-header">
        <el-input v-model="filters.key" style="width: 20%;" placeholder="名称 模糊查询" clearable
                  @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
        <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOmCategorys"
                   icon="el-icon-search">查询
        </el-button>
        <el-button @click="showAdd">+ 添加用品分类</el-button>
        <el-button type="danger" v-loading="load.del" @click="batchDel"
                   :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除
        </el-button>
      </el-row>
      <el-row>
        <!--列表 OmCategory om_category-->
        <el-table ref="requireTable" :height="tableHeight" :data="omCategorys" @sort-change="sortChange"
                  highlight-current-row v-loading="load.list" border @selection-change="selsChange"
                  @row-click="rowClick" style="width: 100%;">
          <el-table-column show-overflow-tooltip sortable type="selection" width="40"></el-table-column>
          <el-table-column show-overflow-tooltip sortable type="index" width="40"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="名称" min-width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status  == '1'">启用</el-tag>
              <el-tag v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="备注说明" min-width="80"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button @click="showEdit( scope.row,scope.$index)">改</el-button>
              <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                       :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"
                       style="float:right;"></el-pagination>
      </el-row>
    </el-row>

    <!--编辑 OmCategory om_category界面-->
    <el-dialog title="编辑用品分类" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
      <om-category-edit :om-category="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                        @submit="afterEditSubmit"></om-category-edit>
    </el-dialog>

    <!--新增 OmCategory om_category界面-->
    <el-dialog title="新增用品分类" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
      <om-category-add :om-category="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                       @submit="afterAddSubmit"></om-category-add>
    </el-dialog>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {listOmCategory, delOmCategory, batchDelOmCategory} from '@/api/oa/om/omCategory';
import OmCategoryAdd from './OmCategoryAdd';//新增界面
import OmCategoryEdit from './OmCategoryEdit';//修改界面
import {mapGetters} from 'vuex'

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
      omCategorys: [],//查询结果
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

      addFormVisible: false,//新增omCategory界面是否显示
      //新增omCategory界面初始化数据
      addForm: {
        id: '', name: '', status: '', branchId: '', remark: ''
      },

      editFormVisible: false,//编辑界面是否显示
      //编辑omCategory界面初始化数据
      editForm: {
        id: '', name: '', status: '', branchId: '', remark: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      tableHeight: 300,
      /**end 自定义属性请在上面加 请加备注**/
    }
  },//end data
  methods: {
    handleClear() {
      this.searchOmCategorys();
    },
    searchOnEnter() {
      this.searchOmCategorys();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getOmCategorys();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getOmCategorys();
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
      this.getOmCategorys();
    },
    searchOmCategorys() {
      this.pageInfo.count = true;
      this.getOmCategorys();
    },
    //获取列表 OmCategory om_category
    getOmCategorys() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        branchId: this.userInfo.branchId
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }
      if (this.filters.key !== "") {
        params.key = '%' + this.filters.key + '%'
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listOmCategory(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.omCategorys = res.data.data;
        } else {
          this.$message({message: tips.msg, type: 'error'});
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 OmCategory om_category
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 OmCategory om_category
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getOmCategorys();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行omCategory
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除omCategory
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {id: row.id};
        delOmCategory(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOmCategorys();
          }
          this.$message({message: tips.msg, type: tips.isOk ? 'success' : 'error'});
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除omCategory
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelOmCategory(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getOmCategorys();
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
    'om-category-add': OmCategoryAdd,
    'om-category-edit': OmCategoryEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getOmCategorys();
      var clientRect = this.$refs.requireTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.requireTable.$el.offsetTop - subHeight;
    });
  }
}

</script>

<style scoped>

</style>
