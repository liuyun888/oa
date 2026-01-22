<template>
	<section class="page-container border padding">
		<el-row class="page-header">
      <el-select v-model="pageInfo.status" clearable placeholder="请选择员工状态" style="margin-right: 13px;">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="filters.key" style="width: 270px;margin-right: 13px;" placeholder="请输入姓名或工号" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter">
        <el-button slot="append" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchSysUsers">查询
        </el-button>
      </el-input>
      <el-button type="" icon="el-icon-plus" v-on:click="userSelectVisible = true">新建档案</el-button>
      <el-button type="" icon="el-icon-upload2" v-on:click="excelVisible = true">批量导入</el-button>
      <el-button type="" icon="el-icon-download" v-on:click="deriveExcelVisible = true">导出花名册</el-button>
    </el-row>
		<el-row class="page-main padding-top">
      <!--列表 SysUser sys_user-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="baseInfo" @sort-change="sortChange"
        highlight-current-row v-loading="load.list" border style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="username" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="account" label="系统账号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="userid" label="工号" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="entryTime" label="到本单位日期" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="deptName" label="所在部门" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="status" label="员工状态" min-width="80"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="edit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button type="danger" @click="handleDel( scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
    </el-row>
    <!-- 选择用户 -->
    <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    <!-- 导入excel -->
    <excel-import :upload-data="{}" :upload-api="uploadApi" :header="header" result-type="html"
      :show.sync="excelVisible" :download-function="downloadTemplate" :validator="validator"
      @upload-success="importSuccess"></excel-import>
    <!-- 导出花名册 -->
    <el-dialog title="导出花名册" :visible.sync="deriveExcelVisible" width="40%" center>
      <div>
        <el-radio v-model="deriveType" label="0">导出所有人员</el-radio>
        <el-radio v-model="deriveType" label="1">按部门导出</el-radio>
        <el-button type="text" v-show="deriveType == 1" @click="deptSelectVisible = true">请选择部门</el-button>
        <el-tag v-text="'已选择:'+deptName" v-show="deriveType == 1"></el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deriveExcelVisible = false">取 消</el-button>
        <el-button type="primary" @click="getBaseInfoByDeriveType">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree show-root default-expand-all show-checkbox :expand-on-click-node="false"
        @node-click="handleLeftDeptNodeClick"></dept-tree>
    </el-dialog>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  import {
    listOption
  } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
  import config from "@/common/config"; //全局公共库import
  import {
    listHrUserBaseInfo,
    getUserInfo,
    getBaseInfoByDeriveType,
    delHrUserBaseInfo
  } from "@/api/oa/hr/user/hrUserBaseInfo";
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
  import excelImport from "./excelLoad";
  import {
    listArchiveAttachment
  } from "@/api/mdp/arc/archiveAttachment";
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
  import {
    mapGetters
  } from "vuex";

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
        statusOptions: [{
          value: '解聘',
          label: '解聘'
        }, {
          value: '离职',
          label: '离职'
        }, {
          value: '退休',
          label: '退休'
        }],
        baseInfo: [], //查询结果
        pageInfo: {
          //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 10, //每页数据
          count: false, //是否需要重新计算总记录数
          pageNum: 1, //当前页码、从1开始计算
          orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
          status: "", //员工状态
        },
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

        addFormVisible: false, //新增sysUser界面是否显示
        userSelectVisible: false,
        userid: "",
        uploadApi: config.getExcelUploadBasePath() +
          "/oa/hr/user/hrUserBaseInfo/addBaseInfoByExcel",
        /**begin 自定义属性请在下面加 请加备注**/
        bulkImportVisible: false,
        excelVisible: false,
        deptSelectVisible: false,
        header: [
          "组织架构编号",
          "系统账号",
          "工号",
          "姓名",
          "员工状态",
          "出生日期",
          "身份证号码",
          "参加工作日期",
          "到本单位日期",
          "试用到期时间",
          "用工期限(年)",
          "人员类别",
          "曾用名",
          "民族",
          "政治面貌",
          "入团日期",
          "入党日期",
          "最高学历",
          "最高学位",
          "婚姻情况",
          "健康情况",
          "身高(厘米)",
          "体重(千克)",
          "现居地",
          "籍贯",
          "出生地",
          "户口所在地",
          "户口所在派出所",
          "办公地点",
          "办公电话",
          "紧急联系人",
          "紧急联系人电话",
          "其他联系方式",
          "工作性质",
          "工作地点",
          "入职日期",
          "试用期限(月)"
        ],
        deriveExcelVisible: false,
        showClose: false,
        deptid: "",
        deptName: "",
        deriveType: "0", //导出花名册类型，0 -导出所有，1-按部门导出
        tableHeight: 300
        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      handleClear() {
        this.searchSysUsers();
      },
      searchOnEnter() {
        this.searchSysUsers();
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getUserBaseInfo();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getUserBaseInfo();
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
        this.getUserBaseInfo();
      },
      searchSysUsers() {
        this.pageInfo.count = true;
        this.getUserBaseInfo();
      },
      //获取已经创建的员工档案
      getUserBaseInfo() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          branckId: this.userInfo.branchId,
          count: this.pageInfo.count,
          status: this.pageInfo.status,
          empStatus: 1 //为零则查询在职
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
        getUserInfo(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.baseInfo = res.data.data;
              console.log(res);
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
      //选择员工后回调
      onUserSelected: function(users) {
        this.userid = users[0].userid;
        this.userSelectVisible = false;
        let params = {
          userid: this.userid
        };
        listHrUserBaseInfo(params).then(res => {
          let tips = res.data.tips;
          if (tips.isOk) {
            let list = res.data.data;
            if (list.length > 0) {
              this.$message({
                message: "该员工档案信息已经创建",
                type: "error"
              });
            } else {
              this.$router.push({
                path: "/oa/hr/user/addUserInfo",
                query: {
                  userid: this.userid
                }
              });
            }
          }
        });
      },
      //跳转到编辑页面
      edit(row) {
        this.$router.push({
          path: "/oa/hr/user/editUserBaseInfo",
          query: {
            userid: row.userid
          }
        });
      },

      /**begin 自定义函数请在下面加**/
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
        if (row.姓名 == "" || typeof row.姓名 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【姓名】 不能为空 </span></br>`;
        }
        if (row.员工状态 == "" || typeof row.员工状态 == "undefined") {
          return `<span class="c-red pdl10">第${i +
          1}行，【员工状态】 不能为空 </span></br>`;
        } else {
          let empStatus = [
            "解聘",
            "离职",
            "退休"
          ];
          if (empStatus.indexOf(row.员工状态) == -1) {
            return `<span class="c-red pdl10">第${i +
            1}行，【员工状态】 输入的值不正确，员工状态可选值：【解聘;离职;退休】 </span></br>`;
          }
        }
        if (!REGULAR.DATA.test(row.出生日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【出生日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.参加工作日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【参加工作日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.到本单位日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【到本单位日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.试用到期时间)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【试用到期时间】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.入团日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【入团日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.入党日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【入党日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        if (!REGULAR.DATA.test(row.入职日期)) {
          return `<span class="c-red pdl10">第${i +
          1}行，【入职日期】 时间格式不正确，时间格式应该为 【yyyy-MM-dd】</span></br>`;
        }
        console.log(row);
        return true;
      },
      importSuccess() {
        alert("EXCEL导入数据成功成功！");
        this.initVisible = false;
      },
      //下载模板
      downloadTemplate() {
        listArchiveAttachment({
          archiveId: "baseInfoExcel"
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

      //根据导出类型查询员工信息列表 0 -导出所有 1-按部门导出
      getBaseInfoByDeriveType() {
        let params = {
          empStatus: 1 //为1则查询不在职
        };
        if (this.deriveType == "1") {
          params.deptid = this.deptid;
        }
        getBaseInfoByDeriveType(params).then(res => {
          let tips = res.data.tips;
          if (tips.isOk) {
            let data = res.data.data;
            console.log(data);
            this.deriveExcel(data);
          }
        });
      },
      deriveExcel(resData) {

        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "姓名",
            "所在部门",
            "性别",
            "年龄",
            "出生日期",
            "工号",
            "身份证号码",
            "手机",
            "邮箱",
            "办公地点",
            "办公电话",
            "紧急联系人",
            "紧急联系人电话",
            "其他联系方式"
          ];
          const filterVal = [
            "username",
            "deptName",
            "sex",
            "age",
            "birthdate",
            "userid",
            "idCardNo",
            "phoneno",
            "email",
            "officeAddress",
            "officePhoneno",
            "emergencyContact",
            "emeContactPho",
            "ortherPhoneno"
          ];
          const list = resData;
          const data = this.formatJson(filterVal, list);
          var filename = "员工花名册";
          if (this.formDefSelected) {
            filename = this.formDefSelected.formName ?
              this.formDefSelected.formName :
              this.formDefSelected.id + "员工花名册";
          }
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: "xlsx"
          });
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v =>
          filterVal.map(j => {
            if (j === "timestamp") {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
        );
      },
      //选择部门后回调
      handleLeftDeptNodeClick(data, node, comp) {
        this.deptid = data.deptid;
        this.deptName = data.deptName;
        this.deptSelectVisible = false;
      },
      handleDel: function(row, index) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
          delHrUserBaseInfo(params)
            .then(res => {
              this.load.del = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.count = true;
                this.getUserBaseInfo();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.del = false));
        });
      },
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      "users-select": UsersSelect,
      "excel-import": excelImport,
      "dept-tree": DeptTree,


      //在下面添加其它组件
    },
    mounted() {
      this.$nextTick(() => {
        this.getUserBaseInfo();
        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  };
</script>

<style scoped>
  .bulk-impor-btn {
    margin-left: 20px;
    margin-right: 20px;
  }

  .bulk-import {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
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
