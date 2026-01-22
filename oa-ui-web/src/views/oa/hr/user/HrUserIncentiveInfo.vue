<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-input v-model="filters.key" style="width: 270px;margin-right: 13px;" placeholder="请输入姓名" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter">
        <el-button slot="append" icon="el-icon-search" :disabled="load.list==true"
          v-on:click="searchHrUserIncentiveInfos">查找</el-button>
      </el-input>
      <el-button v-on:click="excelVisible = true" icon="el-icon-upload2">批量导入</el-button>
      <el-button icon="el-icon-delete" type="danger" v-loading="load.del" @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
    </el-row>
		<el-row class="page-main padding-top">
      <!--列表 HrUserIncentiveInfo hr_user_incentive_info-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="hrUserIncentiveInfos" @sort-change="sortChange" highlight-current-row v-loading="load.list"
        border @selection-change="selsChange" style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="userid" label="用户编号" min-width="80" v-if="false"></el-table-column>
        <el-table-column prop="username" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="certificateName" label="奖惩名称" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
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
    <!--编辑 HrUserIncentiveInfo hr_user_incentive_info界面-->
    <el-dialog title="编辑奖惩信息" :visible.sync="editFormVisible" width="60%" :close-on-click-modal="false">
      <hr-user-incentive-info-edit :hr-user-incentive-info="editForm" :visible="editFormVisible"
        @cancel="editFormVisible=false" @submit="afterEditSubmit"></hr-user-incentive-info-edit>
    </el-dialog>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listHrUserIncentiveInfo,
    delHrUserIncentiveInfo,
    batchDelHrUserIncentiveInfo
  } from "@/api/oa/hr/user/hrUserIncentiveInfo";
  import {
    mapGetters
  } from "vuex";
  import config from "@/common/config"; //全局公共库import
  import {
    listArchiveAttachment
  } from "@/api/mdp/arc/archiveAttachment";
  import HrUserIncentiveInfoEdit from "@/views/oa/hr/user/hrUserIncentiveInfo/HrUserIncentiveInfoEdit"; //修改界面
  import excelImport from "./excelLoad";
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
          key: ""
        },
        hrUserIncentiveInfos: [], //查询结果
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

        /**begin 自定义属性请在下面加 请加备注**/
        excelVisible: false,
        uploadApi: config.getExcelUploadBasePath() +
          "/oa/hr/user/hrUserIncentiveInfo/addIncentiveInfoByExcel",
        header: [
          "组织架构编号",
          "系统账号",
          "工号",
          "奖惩名称",
          "奖惩日期",
          "备注"
        ],

        deriveExcelVisible: false,
        editFormVisible: false, //编辑界面是否显示
        //编辑hrUserIncentiveInfo界面初始化数据
        editForm: {
          id: "",
          userid: "",
          certificateName: "",
          time: "",
          remark: "",
          type: ""
        },
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      handleClear() {
        this.searchHrUserIncentiveInfos();
      },
      searchOnEnter() {
        this.searchHrUserIncentiveInfos();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getHrUserIncentiveInfos();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getHrUserIncentiveInfos();
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
        this.getHrUserIncentiveInfos();
      },
      searchHrUserIncentiveInfos() {
        this.pageInfo.count = true;
        this.getHrUserIncentiveInfos();
      },
      //获取列表 HrUserIncentiveInfo hr_user_incentive_info
      getHrUserIncentiveInfos() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
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
        listHrUserIncentiveInfo(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.hrUserIncentiveInfos = res.data.data;
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

      //选择行hrUserIncentiveInfo
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除hrUserIncentiveInfo
      handleDel: function(row, index) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delHrUserIncentiveInfo(params)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getHrUserIncentiveInfos();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      //批量删除hrUserIncentiveInfo
      batchDel: function() {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          batchDelHrUserIncentiveInfo(this.sels)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getHrUserIncentiveInfos();
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
        if (row.奖惩名称 == "" || typeof row.奖惩名称 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【奖惩名称】 不能为空 </span></br>`;
        }

        if (!this.isNull(row.奖惩日期) && !REGULAR.DATA.test(row.奖惩日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【奖惩日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
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
          archiveId: "incentiveInfoExcel"
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
      //显示编辑界面 HrUserIncentiveInfo hr_user_incentive_info
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getHrUserIncentiveInfos();
      }
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      "excel-import": excelImport,
      "hr-user-incentive-info-edit": HrUserIncentiveInfoEdit,

      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getHrUserIncentiveInfos();
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
