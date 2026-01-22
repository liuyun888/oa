<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;" placeholder="申请人姓名 模糊查询"
                @keyup.enter.native="searchOnEnter" clearable @clear="handleClear"></el-input>
      <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchSigSeals"
                 icon="el-icon-search">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus">用印申请</el-button>
      <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"
                 icon="el-icon-delete">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 SigSeal sig_seal-->
      <el-table :data="sigSeals" @sort-change="sortChange" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :height="tableHeight"
                ref="procdefsTable">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="id" label="申请单编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sealUsername" label="申请人姓名" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sealDeptName" label="申请部门" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sealPhoneno" label="联系电话" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqTime" label="申请时间" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="用印开始时间" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="用印结束时间" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bizFlowState" label="申请状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.bizFlowState=='0'">未发审</el-tag>
            <el-tag v-else-if="scope.row.bizFlowState=='1'">审核中</el-tag>
            <el-tag v-else-if="scope.row.bizFlowState=='2'">已通过</el-tag>
            <el-tag v-else-if="scope.row.bizFlowState=='3'">未通过</el-tag>
            <el-tag v-else-if="scope.row.bizFlowState=='4'">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sealReason" label="用印原因" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="sendToProcessApprova( scope.row,'sig_seal_approva')">发审</el-button>
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 用印申请 界面-->
      <el-dialog title="编辑用印申请" :visible.sync="editFormVisible" width="55%" :close-on-click-modal="false">
        <sig-seal-edit ref="edit" :sig-seal="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                       @submit="afterEditSubmit"></sig-seal-edit>
      </el-dialog>

      <!--新增 用印申请界面-->
      <el-dialog title="新增sig_seal" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <sig-seal-add :sealId="sealId" :reqTime="reqTime" @submit="afterAddSubmit"></sig-seal-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listSigSeal,
  delSigSeal,
  batchDelSigSeal
} from "@/api/oa/sig/sigSeal";
import {
  listSigSealSignet
} from "@/api/oa/sig/sigSealSignet";
import SigSealAdd from "./SigSealAdd"; //新增界面
import SigSealEdit from "./SigSealEdit"; //修改界面
import {
  mapGetters
} from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: ""
      },
      sigSeals: [], //查询结果
      pageInfo: {
        //分页数据
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

      addFormVisible: false, //新增sigSeal界面是否显示
      //新增sigSeal界面初始化数据
      addForm: {
        id: "",
        sealUserid: "",
        sealUsername: "",
        sealDeptid: "",
        sealDeptName: "",
        sealPhoneno: "",
        reqTime: "",
        startTime: "",
        endTime: "",
        sealBranchId: "",
        sealBranchName: "",
        bizFlowState: "",
        bizProcInstId: "",
        sealStatus: "",
        sealReason: "",
        remark: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑sigSeal界面初始化数据
      editForm: {
        id: "",
        sealUserid: "",
        sealUsername: "",
        sealDeptid: "",
        sealDeptName: "",
        sealPhoneno: "",
        reqTime: "",
        startTime: "",
        endTime: "",
        sealBranchId: "",
        sealBranchName: "",
        bizFlowState: "",
        bizProcInstId: "",
        sealStatus: "",
        sealReason: "",
        remark: "",
        sigSealSignets: []
      },
      /**begin 自定义属性请在下面加 请加备注**/
      sealId: "", //新建用印申请时使用当前时间戳作为id
      reqTime: "", //获取当前时间
      tableHeight: 300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleClear() {
      this.searchSigSeals();
    },
    searchOnEnter() {
      // 当用户按下回车键时触发搜索
      this.searchSigSeals();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getSigSeals();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getSigSeals();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getSigSeals();
    },
    searchSigSeals() {
      this.pageInfo.count = true;
      this.getSigSeals();
    },
    //获取列表 SigSeal sig_seal
    getSigSeals() {
      this.pageInfo.orderFields = ["req_time"]
      this.pageInfo.orderDirs = ["desc"]
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        orderFields: this.pageInfo.orderFields,
        orderDirs: this.pageInfo.orderDirs
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "" && this.filters.key.trim() != "") {
        params.key = this.filters.key;
      }
      this.load.list = true;
      listSigSeal(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.sigSeals = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: "error"
            });
          }
          this.load.list = false;
        })
        .catch(err => (this.load.list = false));
    },

    //显示编辑界面 SigSeal sig_seal
    showEdit: function (row, index) {
      if (row.bizFlowState == '2') {
        this.$message.error("审核通过的数据，不允许修改");
        return;
      }
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 SigSeal sig_seal
    showAdd: function () {
      this.$router.push({
        path: "/oa/sig/sigSeal/SigSealAddApply"
      })
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getSigSeals();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getSigSeals();
    },
    //选择行sigSeal
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除sigSeal
    handleDel: function (row, index) {
      if (row.bizFlowState == '0' || row.bizFlowState == null || row.bizFlowState == '') {

      } else {
        this.$message.error("审核中，不允许删除");
        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delSigSeal(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigSeals();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //批量删除sigSeal
    batchDel: function () {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        batchDelSigSeal(this.sels)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getSigSeals();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    rowClick: function (row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    /* formatStatus: function(row) {
       if (row.bizFlowState == "0") return "未审核";
       if (row.bizFlowState == "1") return "审核中";
       if (row.bizFlowState == "2") return "审核通过";
       if (row.bizFlowState == "3") return "审核不通过";
       if (row.bizFlowState == "4") return "流程终止";
     },*/
    showApprovaInfo: function (row) {
      var msgFields = [];
      if (row.mainTitle != null && row.mainTitle != "") {
        msgFields.push("流程【" + row.mainTitle + "】");
      }

      if (row.taskName != null && row.taskName != "") {
        msgFields.push("当前环节【" + row.taskName + "】");
      }

      if (row.assigneeName != null && row.assigneeName != "") {
        msgFields.push("执行人【" + row.assigneeName + "】");
      }

      if (row.commentMsg != null && row.commentMsg != "") {
        msgFields.push("审批意见【" + row.commentMsg + "】");
      }
      var msg = msgFields.join(",");
      return msg;
    },

    sendToProcessApprova: function (row, bizKey) {
      if (row.bizFlowState == '1') {
        this.$message.error("审核中，不允许重新发起");
        return;
      }
      let extVars = {
        sigSeald: row.id
      }
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl = currDomain + '/' + process.env.CONTEXT + '/' + process.env.VERSION + '/#' + fullPath +
        '?extVars=' + jsonExtVars

      var titleNames = row.sealUsername
      var mainTitle = ''
      var mainContext = ''
      if (bizKey == 'sig_seal_approva') {
        mainTitle = '关于【' + titleNames + "用印申请】的审批"
        mainContext = mainTitle + ',申请原因：' + row.reasonWorkOvertime + ",用印开始时间：" + row.startTime + ",用印结束时间：" + row
          .endTime;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl: config.getOaBasePath() + "/sig/sigSeal/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
          branchId: row.sealBranchId,
          sigSealId: row.id
        },
      }
      let jsonParmas = encodeURIComponent(JSON.stringify(params)); //对方要 decodeURIComponent
      this.$router.push({
        path: '/mdp/workflow/re/procdef/ProcdefListForBizStart',
        query: {
          params: jsonParmas
        }
      });
    },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "sig-seal-add": SigSealAdd,
    "sig-seal-edit": SigSealEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getSigSeals();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
    });
  }
};
</script>

<style scoped>
</style>
