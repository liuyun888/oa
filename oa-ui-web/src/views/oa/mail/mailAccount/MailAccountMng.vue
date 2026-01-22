<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="邮箱账号 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" style="margin-right: 13px;" icon="el-icon-search" v-loading="load.list"
                 :disabled="load.list==true" v-on:click="searchMailAccounts">查询
      </el-button>
      <el-button icon="el-icon-plus" style="margin-left: 0;margin-right: 13px;" @click="showAdd">添加帐号</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 MailAccount mail_account-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="mailAccounts" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column> -->
        <el-table-column prop="email" show-overflow-tooltip label="邮箱账号" min-width="80"></el-table-column>
        <el-table-column prop="nickName" show-overflow-tooltip label="昵称" min-width="80"></el-table-column>
        <el-table-column prop="isUseNick" label="是否使用昵称" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUseNick == '0'">否</el-tag>
            <el-tag v-if="scope.row.isUseNick == '1'">是</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="password" label="密码" min-width="80" ></el-table-column> -->
        <el-table-column prop="receiveServerType" show-overflow-tooltip label="收件服务器类型" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.receiveServerType == '0'">POP3</el-tag>
            <el-tag v-if="scope.row.receiveServerType == '1'">IMAP</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiveServer" show-overflow-tooltip label="收件服务器" min-width="80">
        </el-table-column>
        <el-table-column prop="receiveIsSsl" show-overflow-tooltip label="是否使用SSL" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.receiveIsSsl == '1'">是</el-tag>
            <el-tag v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receivePort" show-overflow-tooltip label="端口" min-width="80"></el-table-column>
        <el-table-column prop="sendServer" show-overflow-tooltip label="SMTP服务器" min-width="80"></el-table-column>
        <el-table-column prop="sendIsSsl" label="是否使用SSL" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sendIsSsl == '1'">是</el-tag>
            <el-tag v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sendPort" label="端口" min-width="80"></el-table-column>
        <el-table-column prop="isDefault" label="是否默认" min-width="80"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 MailAccount mail_account界面-->
      <el-dialog title="编辑账号" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <mail-account-edit :mail-account="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                           @submit="afterEditSubmit"></mail-account-edit>
      </el-dialog>

      <!--新增 MailAccount mail_account界面-->
      <el-dialog title="新增账号" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <mail-account-add :mail-account="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                          @submit="afterAddSubmit"></mail-account-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listMailAccount,
  delMailAccount,
  batchDelMailAccount
} from '@/api/oa/mail/mailAccount';
import MailAccountAdd from './MailAccountAdd'; //新增界面
import MailAccountEdit from './MailAccountEdit'; //修改界面
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
      mailAccounts: [], //查询结果
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

      addFormVisible: false, //新增mailAccount界面是否显示
      //新增mailAccount界面初始化数据
      addForm: {
        id: '',
        email: '',
        password: '',
        receiveServerType: '1',
        receiveServer: 'imap.qq.com',
        receiveIsSsl: true,
        receivePort: '993',
        sendServer: 'smtp.qq.com',
        sendIsSsl: true,
        sendPort: '587',
        isDefault: '',
        remark: '',
        nickName: '',
        isUseNick: '',
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑mailAccount界面初始化数据
      editForm: {
        id: '',
        email: '',
        password: '',
        receiveServerType: '',
        receiveServer: '',
        receiveIsSsl: '',
        receivePort: '',
        sendServer: '',
        sendIsSsl: '',
        sendPort: '',
        isDefault: '',
        remark: '',
        nickName: '',
        isUseNick: '',
      },
      tableHeight: 300
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchMailAccounts();
    },
    searchOnEnter() {
      this.searchMailAccounts();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getMailAccounts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getMailAccounts();
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
      this.getMailAccounts();
    },
    searchMailAccounts() {
      this.pageInfo.count = true;
      this.getMailAccounts();
    },
    //获取列表 MailAccount mail_account
    getMailAccounts() {
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
        params.key = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listMailAccount(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.mailAccounts = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    //显示编辑界面 MailAccount mail_account
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 MailAccount mail_account
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getMailAccounts();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getMailAccounts();
    },
    //选择行mailAccount
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除mailAccount
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delMailAccount(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getMailAccounts();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除mailAccount
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        batchDelMailAccount(this.sels).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getMailAccounts();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column); //  @row-click="rowClick"
    }
    /**begin 自定义函数请在下面加**/


    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'mail-account-add': MailAccountAdd,
    'mail-account-edit': MailAccountEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getMailAccounts();
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
