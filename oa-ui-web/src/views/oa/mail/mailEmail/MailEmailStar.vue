<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-select v-model="checkWho" @change="onChange" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="草稿箱" value="0"></el-option>
        <el-option label="发件箱" value="1"></el-option>
        <el-option label="收件箱" value="2"></el-option>
      </el-select>
      <el-input v-model="filters.key" style="width: 270px;" placeholder="主题 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 13px;" v-loading="load.list"
        :disabled="load.list==true" v-on:click="searchMailEmails">查询</el-button>
      <!-- <el-button type="primary" v-loading="load.receive" :disabled="load.receive==true" @click="checkReceiveMail">收取邮件</el-button> -->
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
		<el-row class="page-main padding-top">
      <!-- <el-row>
        <el-radio-group v-model="checkWho" @change="onChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="0">草稿箱</el-radio-button>
          <el-radio-button label="1">发件箱</el-radio-button>
          <el-radio-button label="2">收件箱</el-radio-button>
        </el-radio-group>
      </el-row> -->
      <!--列表 MailEmail mail_email-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="mailEmails" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
        style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="subject" show-overflow-tooltip label="主题" min-width="80"></el-table-column>
        <el-table-column prop="username" show-overflow-tooltip label="发件人" min-width="80"></el-table-column>
        <el-table-column prop="addressee" show-overflow-tooltip label="收件人" min-width="80"></el-table-column>
        <el-table-column prop="cc" show-overflow-tooltip label="抄送人" min-width="80"></el-table-column>
        <!-- <el-table-column prop="bcc" label="密送人" min-width="80" ></el-table-column> -->
        <el-table-column prop="sendTime" show-overflow-tooltip label="时间" min-width="80"></el-table-column>
        <el-table-column prop="isStar" label="星标" min-width="80">
          <template slot-scope="scope">
            <i v-if="scope.row.isStar == '1' || scope.row.meStar == '1'" @click.stop="setStar(scope.row)"
              style="color:#ffcc33;font-size:22px;" class="el-icon-star-on"></i>
            <i v-else style="font-size:22px;" @click.stop="setStar(scope.row)" class="el-icon-star-on"></i>
          </template>
        </el-table-column>
        <el-table-column prop="isRead" label="是否已读" min-width="80">
          <template slot-scope="scope">
            <el-tag type='info' v-if="scope.row.isRead == '1'">是</el-tag>
            <el-tag type='info' v-else>否</el-tag>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" width="80" fixed="right" >
					<template slot-scope="scope">
						<el-button type="danger" @click.stop="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column> -->

      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <el-dialog title="收信" width="50%" :visible.sync="receiveVisible" :close-on-click-modal="false">
        <el-table :data="receiveEmailData" style="width: 100%">
          <el-table-column prop="email" label="" min-width="120"></el-table-column>
          <el-table-column prop="newEmailNum" label="" min-width="120">
            <template slot-scope="scope">
              共 {{" "+scope.row.newEmailNum + " "}} 件未读邮件(可能不太准确)
            </template>
          </el-table-column>
          <el-table-column label="" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" @click="receiveMail(scope.row.email)">收取邮件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <div class="emailInfo">
        <el-drawer title="邮件详情" :visible.sync="emailInfoVisible" direction="rtl" size="50%">
          <div>
            <el-row>
              <el-col :span="4">发件人</el-col>
              <el-col :span="20">{{emailInfo.username}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">时间</el-col>
              <el-col :span="20">{{emailInfo.sendTime}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">收件人</el-col>
              <el-col :span="20">{{emailInfo.addressee}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">抄送人</el-col>
              <el-col :span="20">{{emailInfo.cc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">接收状态</el-col>
              <el-col v-if="emailInfo.status == '1'" :span="20">接收成功</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">主题</el-col>
              <el-col :span="20">{{emailInfo.subject}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">附件</el-col>
              <el-col :span="20"></el-col>
            </el-row>
            <el-row>
              <el-col :span="4">正文</el-col>
              <el-col :span="20">
                <div v-html="emailInfo.content"></div>
              </el-col>
            </el-row>
          </div>
        </el-drawer>
      </div>
      <!--编辑 MailEmail mail_email界面-->
      <el-dialog title="编辑邮件" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <mail-email-edit :mail-email="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></mail-email-edit>
      </el-dialog>

      <!--新增 MailEmail mail_email界面-->
      <el-dialog title="新增邮件" :visible.sync="addFormVisible" width="60%" :close-on-click-modal="false">
        <mail-email-add :mail-email="addForm" :is-outer="isOuter" :visible="addFormVisible"
          @cancel="addFormVisible=false" @submit="afterAddSubmit"></mail-email-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listMailEmail,
    delMailEmail,
    batchDelMailEmail,
    receiveMailEmail,
    setStarMailEmail
  } from '@/api/oa/mail/mailEmail';
  import {
    checkNewEmail
  } from '@/api/oa/mail/mailAccount';
  import MailEmailAdd from './MailEmailAdd'; //新增界面
  import MailEmailEdit from './MailEmailEdit'; //修改界面
  import {
    mapGetters
  } from 'vuex'
  import {
    sn
  } from "@/common/js/sequence"; //id生成器
  import {
    setStarMailEmailAddressee
  } from '@/api/oa/mail/mailEmailAddressee';

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
        mailEmails: [], //查询结果
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
          add: false,
          receive: false
        }, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

        addFormVisible: false, //新增mailEmail界面是否显示
        //新增mailEmail界面初始化数据
        addForm: {
          id: '',
          subject: '',
          content: '',
          userId: '',
          username: '',
          sendEmail: '',
          sendTime: '',
          isStar: '',
          isRead: '',
          status: '',
          addresseeList: [],
          ccList: [],
          bccList: [],
          appendixList: [],
        },
        editFormVisible: false, //编辑界面是否显示
        //编辑mailEmail界面初始化数据
        editForm: {
          id: '',
          subject: '',
          content: '',
          userId: '',
          username: '',
          sendEmail: '',
          sendTime: '',
          isStar: '',
          isRead: '',
          status: ''
        },
        /**begin 自定义属性请在下面加 请加备注**/
        isOuter: '1',
        receiveVisible: false,
        receiveEmailData: [{
          email: '1039416911@qq.com',
          newEmailNum: 200
        }],
        emailInfoVisible: false,
        emailInfo: {
          id: '',
          subject: '',
          content: '',
          userId: '',
          username: '',
          sendEmail: '',
          sendTime: '',
          isStar: '',
          isRead: '',
          status: '',
          branchId: '',
          addressee: '',
          cc: '',
          bcc: '',
          addresseeList: [],
          ccList: [],
          bccList: [],
          appendixList: [],
        },
        checkWho: '',
        type: '',
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      handleClear() {
        this.searchMailEmails();
      },
      searchOnEnter() {
        this.searchMailEmails();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getMailEmails();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getMailEmails();
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
        this.getMailEmails();
      },
      searchMailEmails() {
        this.pageInfo.count = true;
        this.getMailEmails();
      },
      //获取列表 MailEmail mail_email
      getMailEmails() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count,
          isAllStar: '1',
          isOuter: '0',
          currentAddressee: this.userInfo.userid,
          senderUserId: this.userInfo.userid,
          type: this.type
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
        listMailEmail(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.mailEmails = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },
      receiveMail(value) {
        let params = {
          sendEmail: value
        };
        this.load.receive = true;
        receiveMailEmail(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.$message({
              message: tips.msg,
              type: 'success'
            });
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.receive = false;
        }).catch(err => this.load.receive = false);
      },
      //显示编辑界面 MailEmail mail_email
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 MailEmail mail_email
      showAdd: function(value) {
        this.isOuter = value
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.addForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getMailEmails();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },
      //选择行mailEmail
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除mailEmail
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delMailEmail(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getMailEmails();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      //批量删除mailEmail
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelMailEmail(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getMailEmails();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch(err => this.load.del = false);
        });
      },
      rowClick: function(row, event, column) {
        // this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        this.emailInfo = Object.assign(this.emailInfo, row);
        this.emailInfoVisible = true;
      },
      /**begin 自定义函数请在下面加**/

      //检出公司账号新的邮件数
      checkReceiveMail() {
        let params = {
          branchId: this.userInfo.branchId
        };
        this.load.receive = true;
        checkNewEmail(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.receiveEmailData = res.data.data;
            this.receiveVisible = true
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.receive = false;
        }).catch(err => this.load.receive = false);
      },
      setStar: function(row) {
        //console.log(row.type == '0');
        if (row.meStar != '' && row.meStar == '1') {
          console.log("meStarmeStarmeStarmeStar")
          this.setStarAddessee(row);
        } else {
          console.log("isStarisStarisStarisStarisStar")
          let params = Object.assign({}, row);
          row.isStar == '1' ? params.isStar = '0' : params.isStar = '1'
          setStarMailEmail(params).then((res) => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.getMailEmails();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });
          }).catch();
        }
      },

      setStarAddessee(row) {
        // let params = Object.assign({}, row);
        let params = {}
        params.id = row.meId
        params.emailId = row.id
        params.userId = this.userInfo.userid
        row.meStar == '1' ? params.isStar = '0' : params.isStar = '1'
        setStarMailEmailAddressee(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getMailEmails();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch();
      },

      //选择是密送还是抄送
      onChange(value) {
        this.type = value
        this.getMailEmails();
      },
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'mail-email-add': MailEmailAdd,
      'mail-email-edit': MailEmailEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getMailEmails();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style scoped>
  .emailInfo .el-row {
    margin-left: 20px;
  }

  .emailInfo .el-col {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
  }
</style>

<style>
  .emailInfo .el-drawer__body {
    overflow: scroll;
  }

  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
