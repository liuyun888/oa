<template>
  <section>
    <el-row class="page-container border padding">
      <el-col class="hidden-sm-and-down" :span="!applianceId ? 5 : 0">
        <el-tree
          :data="treeData"
          :highlight-current="true"
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          ref="tree"
        ></el-tree>
      </el-col>
      <el-col :span="!applianceId ? 19 : 24">
        <el-row class="page-header">
          <el-input
            v-model="filters.key"
            style="width: 20%"
            placeholder="用品名称 模糊查询" clearable
            @clear="handleClear" @keyup.enter.native="searchOnEnter"
          ></el-input>
          <el-button
            type="primary"
            v-loading="load.list"
            :disabled="load.list == true"
            v-on:click="searchOmAppliancePurchases"
            icon="el-icon-search"
            >查询</el-button
          >
          <el-button @click="showAdd" icon="el-icon-goods">采购</el-button>
          <!--          <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除</el-button>-->
        </el-row>
        <el-row>
          <!--列表 OmAppliancePurchase om_appliance_purchase-->
          <el-table
            ref="requireTable"
            :height="tableHeight"
            :data="omAppliancePurchases"
            @sort-change="sortChange"
            highlight-current-row
            v-loading="load.list"
            border
            @selection-change="selsChange"
            @row-click="rowClick"
            style="width: 100%"
          >
            <el-table-column
              show-overflow-tooltip
              sortable
              type="selection"
              width="40"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              sortable
              type="index"
              width="40"
            ></el-table-column>
            <!-- <el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
            <el-table-column prop="applianceId" label="用品id" min-width="80" ></el-table-column>-->
            <el-table-column
              show-overflow-tooltip
              prop="applianceName"
              label="用品名称"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="standard"
              label="规格"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="price"
              label="单价"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="num"
              label="采购数量"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="totalPrice"
              label="金额"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="stock"
              label="库存量"
              min-width="80"
            ></el-table-column>
            <!-- <el-table-column prop="userid" label="操作人id" min-width="80" ></el-table-column> -->
            <el-table-column
              show-overflow-tooltip
              prop="username"
              label="操作人"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="createTime"
              label="创建时间"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="备注"
              min-width="80"
            ></el-table-column>
            <!-- <el-table-column prop="supplierId" label="供应商id" min-width="80" ></el-table-column> -->
            <el-table-column
              show-overflow-tooltip
              prop="supplierName"
              label="供应商"
              min-width="80"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="isStorage"
              label="状态"
              min-width="80"
            >
              <template slot-scope="scope">
                <el-link @click="showFlowTaskDetail(scope.row)">
                  <el-tag v-if="scope.row.isStorage == '0'">未发审</el-tag>
                  <el-tag v-if="scope.row.isStorage == '1'">审核中</el-tag>
                  <el-tag v-if="scope.row.isStorage == '2'">待入库</el-tag>
                  <el-tag v-if="scope.row.isStorage == '3'">已入库</el-tag>
                  <el-tag v-if="scope.row.isStorage == '4'">流程取消</el-tag>
                </el-link>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="branchId" label="机构号" min-width="80" ></el-table-column> -->
            <el-table-column
              show-overflow-tooltip
              label="操作"
              width="200"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="showApprova(scope.row, scope.$index)"
                  >发审</el-button
                >
                <el-button
                  type="text"
                  @click="showEdit(scope.row, scope.$index)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  type="text"
                  @click="handleDel(scope.row, scope.$index)"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>

    <!--编辑 OmAppliancePurchase om_appliance_purchase界面-->
    <el-dialog
      title="编辑采购信息"
      :visible.sync="editFormVisible"
      width="60%"
      :close-on-click-modal="false"
      append-to-body
    >
      <om-appliance-purchase-edit
        :om-appliance-purchase="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @submit="afterEditSubmit"
      ></om-appliance-purchase-edit>
    </el-dialog>

    <!--新增 OmAppliancePurchase om_appliance_purchase界面-->
    <el-dialog
      title="采购"
      :visible.sync="addFormVisible"
      width="60%"
      :close-on-click-modal="false"
      append-to-body
    >
      <om-appliance-purchase-add
        :om-appliance-purchase="addForm"
        :visible="addFormVisible"
        @cancel="addFormVisible = false"
        @submit="afterAddSubmit"
      ></om-appliance-purchase-add>
    </el-dialog>

    <el-drawer
      fullscreen
      size="100%"
      title="任务详情"
      :visible.sync="flowTaskDetailVisible"
      :withHeader="false"
      :close-on-click-modal="false"
    >
      <procinst-parames-execution-set
        v-if="tasks.length > 0"
        :taskInfo="tasks[0]"
        :procDefId="tasks[0].procDefId"
        :procInstId="tasks[0].procInstId"
        :visible="flowTaskDetailVisible"
        @cancel="flowTaskDetailVisible = false"
        @submit="afterFlowSubmit"
      >
      </procinst-parames-execution-set>
    </el-drawer>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listOmAppliancePurchase,
  pushStorageOmAppliancePurchase,
  delOmAppliancePurchase,
  batchDelOmAppliancePurchase,
} from "@/api/oa/om/omAppliancePurchase";
import OmAppliancePurchaseAdd from "./OmAppliancePurchaseAdd"; //新增界面
import OmAppliancePurchaseEdit from "./OmAppliancePurchaseEdit"; //修改界面
import { mapGetters } from "vuex";
import { getAllOmAppliance } from "@/api/oa/om/omCategory";
import config from "@/common/config"; //全局公共库treeData
  import ProcinstParamesExecutionSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
  import {
    listAssigneeToAnyTasks
  } from "@/api/mdp/workflow/ru/task";

  import {
    listProcinst
  } from "@/api/mdp/workflow/hi/procinst";

export default {
  props: ["applianceId",'queryScene'],
  computed: {
    ...mapGetters(["userInfo"]),
    menuTop: function () {
      return screen.height;
    },
  },
  data() {
    return {
      filters: {
        key: "",
      	applianceId: "", //用品id
      },
      omAppliancePurchases: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["ltime"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增omAppliancePurchase界面是否显示
      //新增omAppliancePurchase界面初始化数据
      addForm: {
        id: "",
        applianceId: "",
        applianceName: "",
        standard: "",
        price: "",
        num: "",
        totalPrice: "",
        stock: "",
        userid: "",
        username: "",
        createTime: "",
        remark: "",
        supplierId: "",
        supplierName: "",
        branchId: "",
        isStorage: "",
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑omAppliancePurchase界面初始化数据
      editForm: {
        id: "",
        applianceId: "",
        applianceName: "",
        standard: "",
        price: "",
        num: "",
        totalPrice: "",
        stock: "",
        userid: "",
        username: "",
        createTime: "",
        remark: "",
        supplierId: "",
        supplierName: "",
        branchId: "",
        isStorage: "",
      },
      /**begin 自定义属性请在下面加 请加备注**/

      //侧面抽屉
      itemSpan: 20,
      menuSpan: 4,
      //是否展示右侧内容
      isShowNav: true,
      //事项分类的id
      categoryId: "",
      treeData: [
        {
          name: "默认分类",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },

      tableHeight: 300,
        tasks:[],
        flowTaskDetailVisible:false,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleClear() {
      this.searchOmAppliancePurchases();
    },
    searchOnEnter() {
      this.searchOmAppliancePurchases();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getOmAppliancePurchases();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getOmAppliancePurchases();
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
      this.getOmAppliancePurchases();
    },
    searchOmAppliancePurchases() {
      this.pageInfo.count = true;
      this.getOmAppliancePurchases();
    },
    //获取列表 OmAppliancePurchase om_appliance_purchase
    getOmAppliancePurchases() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        categoryId: this.categoryId,
        applianceId: this.filters.applianceId,
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
      if (this.filters.key !== "") {
        params.key = "%" + this.filters.key + "%";
      } else {
        //params.xxx=xxxxx
      }
      if (this.applianceId) {
        params.applianceId = this.applianceId;
      }
      if(this.queryScene=='my'){
        params.userid=this.userInfo.userid
      }
      this.load.list = true;
      listOmAppliancePurchase(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.omAppliancePurchases = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //显示编辑界面 OmAppliancePurchase om_appliance_purchase
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //修改为入库
    /*pushStorage( row,index ){
				row.isStorage = '1'
				//console.log(row)
				this.$confirm('确认提交入库吗？', '提示', {}).then(() => {
					let params = Object.assign({}, row);
					pushStorageOmAppliancePurchase(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( );
				})
			},*/
    //显示新增界面 OmAppliancePurchase om_appliance_purchase
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getOmAppliancePurchases();
      //调用
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行omAppliancePurchase
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除omAppliancePurchase
    handleDel: function (row, index) {
      if (
        row.isStorage == "1" ||
        row.isStorage == "2" ||
        row.isStorage == "3"
      ) {
        this.$message.error("当前状态不允许删除");
        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = { id: row.id };
        delOmAppliancePurchase(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getOmAppliancePurchases();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除omAppliancePurchase
    batchDel: function () {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelOmAppliancePurchase(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getOmAppliancePurchases();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row, event, column) {
      if(event.label!='操作'&& event.type!='selection'&& event.label!='状态'){
        this.showEdit(row)
      }
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    //开启右侧抽屉
    openDrawer() {
      this.isShowNav = !this.isShowNav;
      this.isShowNav ? (this.itemSpan = 20) : (this.itemSpan = 24);
    },
    handleNodeClick(value) {
      this.filters.applianceId = "";
      this.categoryId = "";
      if (value.id != null) {
        this.filters.applianceId = value.id;
        this.$nextTick(() => {
          this.getOmAppliancePurchases();
        });
      } else {
        this.categoryId = value.categoryId;
        this.$nextTick(() => {
          this.getOmAppliancePurchases();
        });
      }
    },
    getAllOmAppliance() {
      if (this.applianceId) {
        return;
      }
      let params = {
        branchId: this.userInfo.branchId,
      };
      getAllOmAppliance(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.treeData = res.data.data;
            //console.log(res.data.data)
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
        })
        .catch((err) => this.getAllOmAppliance());
    },

    showApprova: function (row, index) {
      if (
        row.isStorage == "1" ||
        row.isStorage == "2" ||
        row.isStorage == "3"
      ) {
        this.$message.error("当前状态不允许重新发起流程");
        return;
      }

      this.sendToProcessApprova(row, "om_appliance_purchase_approva");
    },
    sendToProcessApprova: function (row, bizKey) {
      let extVars = { omAppliancePurchaseId: row.id };
      let jsonExtVars = JSON.stringify(extVars);

      var currDomain = window.location.protocol + "//" + window.location.host;
      var fullPath = this.$route.fullPath;
      var bizUrl =
        currDomain +
        "/" +
        process.env.CONTEXT +
        "/" +
        process.env.VERSION +
        "/#" +
        fullPath +
        "?extVars=" +
        jsonExtVars;

      var titleNames = row.username;
      var mainTitle = "";
      var mainContext = "";
      if (bizKey == "om_appliance_purchase_approva") {
        mainTitle =
          "关于【" +
          titleNames +
          "申购办公用品-" +
          row.applianceName +
          "】的审批";
        mainContext =
          mainTitle + ",申购备注：" + row.remark + ",申购数量：" + row.num;
      } else {
        this.$message.error("暂不支持的业务审批");
        return;
      }

      let params = {
        mainContext: mainContext,
        mainTitle: mainTitle,
        bizKey: bizKey,
        bizUrl: bizUrl,
        restUrl:
          config.getOaBasePath() + "/om/omAppliancePurchase/processApprova",
        //restUrl:"http://localhost:7078"+"/om/omAppliancePurchase/processApprova",
        extVars: extVars,
        flowVars: {
          subscribeTaskEvent: "TASK_COMPLETED,TASK_CREATED",
          branchId: row.branchId,
          omAppliancePurchaseId: row.id,
          applianceId: row.applianceId,
          num: row.num,
          omAppliancePurchase: row,
        },
      };
      let jsonParmas = encodeURIComponent(JSON.stringify(params)); //对方要 decodeURIComponent
      this.$router.push({
        path: "/mdp/workflow/re/procdef/ProcdefListForBizStart",
        query: { params: jsonParmas },
      });
    },
    /**end 自定义函数请在上面加**/

    showFlowTaskDetail(row) {
      if (row.bizProcInstId) {
        if (row.bizFlowState == "1") {
          var params = {
            procInstId: row.bizProcInstId,
            assignee: this.userInfo.userId,
            tenantId: this.userInfo.branchId,
          };
          this.load.list = true;
          listAssigneeToAnyTasks(params)
            .then((res) => {
              var tips = res.data.tips;
              if (tips.isOk) {
                var taskList = res.data.data;
                taskList.forEach((i) => {
                  i.taskId = i.id;
                  i.actId = i.taskDefKey;
                  i.taskName = i.name;
                });
                this.tasks = taskList;
                this.flowTaskDetailVisible = true;
              } else {
                this.$message({
                  showClose: true,
                  message: tips.msg,
                  type: "error",
                });
              }
              this.load.list = false;
            })
            .catch(() => {
              this.load.list = false;
            });
        } else {
          var params = {
            procInstId: row.bizProcInstId,
          };
          this.load.list = true;
          listProcinst(params)
            .then((res) => {
              var tips = res.data.tips;
              if (tips.isOk) {
                var taskList = res.data.data;
                this.tasks = taskList;
                this.flowTaskDetailVisible = true;
              } else {
                this.$message({
                  showClose: true,
                  message: tips.msg,
                  type: "error",
                });
              }
              this.load.list = false;
            })
            .catch(() => {
              this.load.list = false;
            });
        }
      } else {
      }
    },
      afterFlowSubmit(){
        this.flowTaskDetailVisible=false;
		this.searchOmAppliancePurchases();
      }
  }, //end methods
  components: {
    "om-appliance-purchase-add": OmAppliancePurchaseAdd,
    "om-appliance-purchase-edit": OmAppliancePurchaseEdit,
	ProcinstParamesExecutionSet,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllOmAppliance();
      this.getOmAppliancePurchases();
      var clientRect = this.$refs.requireTable.$el.getBoundingClientRect();
      var subHeight = (60 / 1000) * window.innerHeight;
      this.tableHeight =
        window.innerHeight -
        clientRect.y -
        this.$refs.requireTable.$el.offsetTop -
        subHeight;
    });
  },
};
</script>

<style scoped>
.itemTable {
  position: relative;
}
.showMenuIcon {
  font-size: 40px;
  /* color: royalblue; */
  position: absolute;
  cursor: pointer;
  left: -15px;
  height: 58px;
  padding: 10px;
  background: url("../../../../assets/image/show-drawer.png") -2px 0px no-repeat;
}
</style>
