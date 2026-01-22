<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-date-picker v-model="filters.startTimeRanger" class="hidden-sm-and-down" type="daterange" align="right"
        unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="到期时间" value-format="yyyy-MM-dd"
        :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
      </el-date-picker>
      <el-input v-model="filters.key" style="width: 270px;margin-right: 13px;" placeholder="请输入姓名" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter">
        <el-button slot="append" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchHrUserWorkeds">查找
        </el-button>
      </el-input>
      <el-button icon="el-icon-upload2" type="" v-on:click="excelVisible = true">批量导入</el-button>
      <el-button type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
		<el-row class="page-main padding-top">
      <!--列表 HrUserWorked hr_user_worked-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="hrUserWorkeds" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border @selection-change="selsChange" style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="userid" label="用户编号" min-width="80" v-if="false"></el-table-column>
        <el-table-column prop="username" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="companyName" label="公司" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="duty" label="职位" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="remark" label="工作描述" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="dimissionCause" label="离职原因" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit(scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
    </el-row>
    <!-- 导入excel -->
    <excel-import :upload-data="{}" :upload-api="uploadApi" :header="header" result-type="html"
      :show.sync="excelVisible" :download-function="downloadTemplate" :validator="validator"
      @upload-success="importSuccess"></excel-import>
    <!--编辑 HrUserWorked hr_user_worked界面-->
    <el-dialog title="编辑工作经历" :visible.sync="editFormVisible" width="60%" :close-on-click-modal="false">
      <hr-user-worked-edit :hr-user-worked="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
        @submit="afterEditSubmit"></hr-user-worked-edit>
    </el-dialog>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  import config from "@/common/config"; //全局公共库import
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listHrUserWorked,
    delHrUserWorked,
    batchDelHrUserWorked
  } from "@/api/oa/hr/user/hrUserWorked";
  import excelImport from "./excelLoad";
  import {
    mapGetters
  } from "vuex";
  import {
    listArchiveAttachment
  } from "@/api/mdp/arc/archiveAttachment";
  import HrUserWorkedEdit from "@/views/oa/hr/user/hrUserWorked/HrUserWorkedEdit";
  const REGULAR = {
    EXCEL: /(.*)\.(xls|xlsx|XLS|XLSX)$/,
    DATA: /^(\d{4})(-)(\d{2})(-)(\d{2})$/
  };
  export default {
    computed: {
      ...mapGetters(["userInfo"])
    },
    data() {
      return {
        filters: {
          key: "",
          startTimeRanger: [
            // util.formatDate(fromStartTime, "yyyy-MM-dd"),
            // util.formatDate(toStartTime, "yyyy-MM-dd")
          ],
          fromStartTime: '',
          toStartTime: '',
        },
        hrUserWorkeds: [], //查询结果
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
        tableHeight: 300,
        /**begin 自定义属性请在下面加 请加备注**/
        excelVisible: false,
        uploadApi: config.getExcelUploadBasePath() +
          "/oa/hr/user/hrUserWorked/addWorkedByExcel",
        header: [
          "组织架构编号",
          "系统账号",
          "工号",
          "公司",
          "职位",
          "开始日期",
          "结束日期",
          "工作描述",
          "离职原因"
        ],
        pickerOptions: {
          shortcuts: [{
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近两周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 3);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近四周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 4);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近六个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        deriveExcelVisible: false,
        //编辑hrUserWorked界面初始化数据
        editForm: {
          id: "",
          userid: "",
          companyName: "",
          remark: "",
          startTime: "",
          endTime: "",
          dimissionCause: "",
          duty: ""
        },
        editFormVisible: false //编辑界面是否显示
        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    watch: {
      "filters.startTimeRanger": function() {
        console.log(123);
        if (this.filters.startTimeRanger == [] || this.filters.startTimeRanger == null) {
          this.filters.fromStartTime = ""
          this.filters.toStartTime = ""
        } else {
          this.filters.fromStartTime = this.filters.startTimeRanger[0];
          this.filters.toStartTime = this.filters.startTimeRanger[1];
        }
      }
    },
    methods: {
      handleClear() {
        this.searchHrUserWorkeds();
      },
      searchOnEnter() {
        this.searchHrUserWorkeds();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getHrUserWorkeds();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getHrUserWorkeds();
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
        this.getHrUserWorkeds();
      },
      searchHrUserWorkeds() {
        this.pageInfo.count = true;
        this.getHrUserWorkeds();
      },
      //获取列表 HrUserWorked hr_user_worked
      getHrUserWorkeds() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count,
          fromStartTime: this.filters.fromStartTime,
          toStartTime: this.filters.toStartTime,
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
          params.key = this.filters.key;
        }
        this.load.list = true;
        listHrUserWorked(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.hrUserWorkeds = res.data.data;
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
      //选择行hrUserWorked
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除hrUserWorked
      handleDel: function(row, index) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delHrUserWorked(params)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getHrUserWorkeds();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      //批量删除hrUserWorked
      batchDel: function() {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          batchDelHrUserWorked(this.sels)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getHrUserWorkeds();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      rowClick: function(row) {
        this.$router.push({
          path: "/oa/hr/user/editUserBaseInfo",
          query: {
            userid: row.userid
          }
        });
      },
      /**begin 自定义函数请在下面加**/
      isNull(data) {
        if (data === null || data === "" || data === undefined) {
          return true;
        }
        return false;
      },
      validator(row, arr, i) {
        if (row.组织架构编号 == "" || typeof row.组织架构编号 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行【组织架构编号】 不能为空 </span></br>`;
        }
        if (row.系统账号 == "" || typeof row.系统账号 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【系统账号】 不能为空 </span></br>`;
        }
        if (row.工号 == "" || typeof row.工号 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【工号】 不能为空 </span></br>`;
        }
        if (row.公司 == "" || typeof row.公司 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【公司】 不能为空 </span></br>`;
        }
        if (row.职位 == "" || typeof row.职位 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【职位】 不能为空 </span></br>`;
        }

        if (!this.isNull(row.开始日期) && !REGULAR.DATA.test(row.开始日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【开始日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!this.isNull(row.结束日期) && !REGULAR.DATA.test(row.结束日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【开结束日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        return true;
      },
      importSuccess() {
        alert("EXCEL导入数据成功成功！");
        this.initVisible = false;
      },
      //下载模板
      downloadTemplate() {
        listArchiveAttachment({
          archiveId: "workedExcel"
        }).then(res => {
          let fileurl =
            config.getArcFileUploadBasePath() + "/" + res.data.data[0].url;

          console.log(fileurl);

          this.downloadFile(fileurl, res.data.data[0].name);
        });
      },

      //执行下载文件
      downloadFile(url, filename) {
        console.log(filename);
        let a = document.createElement("a"); // 创建a标签
        let e = document.createEvent("MouseEvents"); // 创建鼠标事件对象
        e.initEvent("click", false, false); // 初始化事件对象
        a.href = url; // 设置下载地址
        a.download = "员工信息导入模板"; // 设置下载文件名
        a.dispatchEvent(e);
      },
      //显示编辑界面 HrUserWorked hr_user_worked
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getHrUserWorkeds();
      }
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      "excel-import": excelImport,

      "hr-user-worked-edit": HrUserWorkedEdit
      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getHrUserWorkeds();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  };
</script>

<style scoped>
</style>

<style>
  .app-container {
    padding: 20px;
    padding-left: 20px;
    padding-bottom: 0px;
  }

  button,
  html [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
    margin-right: 13px;
  }

  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
