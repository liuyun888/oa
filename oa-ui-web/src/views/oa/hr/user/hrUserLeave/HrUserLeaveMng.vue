<template>
  <section>
    <el-row class="page-container border padding">
      <!--列表 HrUserLeave hr_user_leave-->
      <el-table
        :data="hrUserLeaves"
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%;"
      >
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="type" label="请假类型" min-width="80" ></el-table-column>
        <el-table-column prop="number" label="请假天数" min-width="80" ></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="80" ></el-table-column>
        <el-table-column prop="startTime" label="请假开始时间" min-width="80" ></el-table-column>
        <el-table-column prop="endTime" label="请假结束时间" min-width="80" ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" >
          <template slot-scope="scope">
            <el-button type="primary" @click="showEdit( scope.row,scope.$index)">改</el-button>
            <el-button type="primary" @click="handleDel(scope.row,scope.$index)">删</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10,20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float:right;"
      ></el-pagination>

      <!--编辑 HrUserLeave hr_user_leave界面-->
      <el-dialog
        title="编辑请假明细"
        :visible.sync="editFormVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <hr-user-leave-edit
          :hr-user-leave="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible=false"
          @submit="afterEditSubmit"
        ></hr-user-leave-edit>
      </el-dialog>

      <!--新增 HrUserLeave hr_user_leave界面-->
      <el-dialog
        title="新增请假明细"
        :visible.sync="addFormVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <hr-user-leave-add
          :hr-user-leave="addForm"
          :visible="addFormVisible"
          @cancel="addFormVisible=false"
          @submit="afterAddSubmit"
        ></hr-user-leave-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import {
  listHrUserLeave,
  delHrUserLeave,
  batchDelHrUserLeave
} from "@/api/oa/hr/user/hrUserLeave";
import HrUserLeaveAdd from "./HrUserLeaveAdd"; //新增界面
import HrUserLeaveEdit from "./HrUserLeaveEdit"; //修改界面
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["userid"],
  data() {
    return {
      filters: {
        key: ""
      },
      hrUserLeaves: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增hrUserLeave界面是否显示
      //新增hrUserLeave界面初始化数据
      addForm: {
        id: "",
        userid: "",
        type: "",
        number: "",
        remark: "",
        startTime: "",
        endTime: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑hrUserLeave界面初始化数据
      editForm: {
        id: "",
        userid: "",
        type: "",
        number: "",
        remark: "",
        startTime: "",
        endTime: ""
      }
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getHrUserLeaves();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getHrUserLeaves();
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
      this.getHrUserLeaves();
    },
    searchHrUserLeaves() {
      this.pageInfo.count = true;
      this.getHrUserLeaves();
    },
    //获取列表 HrUserLeave hr_user_leave
    getHrUserLeaves() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        userid: this.userid
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
        //params.xxx=this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listHrUserLeave(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.hrUserLeaves = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(err => (this.load.list = false));
    },

    //显示编辑界面 HrUserLeave hr_user_leave
    showEdit: function(row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 HrUserLeave hr_user_leave
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getHrUserLeaves();
    },
    afterEditSubmit() {
		this.getHrUserLeaves();
      this.editFormVisible = false;
    },
    //选择行hrUserLeave
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除hrUserLeave
    handleDel: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = { id: row.id };
        delHrUserLeave(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getHrUserLeaves();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //批量删除hrUserLeave
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        batchDelHrUserLeave(this.sels)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getHrUserLeaves();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    rowClick: function(row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    }
    /**begin 自定义函数请在下面加**/

    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "hr-user-leave-add": HrUserLeaveAdd,
    "hr-user-leave-edit": HrUserLeaveEdit,
    
    //在下面添加其它组件
  },
  mounted() {
    this.addForm.userid = this.userid;
    this.editForm.userid = this.userid;
    
    this.$nextTick(() => {
      this.getHrUserLeaves();
    });
  }
};
</script>

<style scoped>
.app-container {
  padding: 0px !important;
}
</style>