<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-drawer title="图片预览" size="50%" :visible.sync="showPreviewImage" :with-header="false" append-to-body>
        <div style="width:100%;max-height:800px;overflow:auto;">
          <el-image :fit="'contain'" :src="previewImgUrl"></el-image>
        </div>
      </el-drawer>
      <!-- <el-button type="primary" @click="showAdd">+hr_user_accessory</el-button> -->
      <el-date-picker v-model="filters.startTimeRanger" class="hidden-sm-and-down" type="daterange" align="right"
                      unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="到期时间"
                      value-format="yyyy-MM-dd"
                      :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
      </el-date-picker>
      <el-select v-model="type" clearable placeholder="请选择合同类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="filters.key" style="width: 270px;margin-right: 13px;" placeholder="请输入姓名或工号" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter">
        <el-button slot="append" icon="el-icon-search" :disabled="load.list==true" v-on:click="searchHrUserAccessorys">
          查找
        </el-button>
      </el-input>
      <el-button icon="el-icon-delete" type="danger" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <!--列表 HrUserAccessory hr_user_accessory-->
      <el-table :height="tableHeight" ref="procdefsTable" :data="hrUserAccessorys" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
        <el-table-column sortable type="selection" width="40"></el-table-column>

        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="username" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="userid" label="工号" show-overflow-tooltip min-width="80"></el-table-column>

        <el-table-column prop="name" label="附件名称" show-overflow-tooltip min-width="80">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="80">
          <template
            scope="scope">
            {{ scope.row.type == '0' ? '合同' : (scope.row.type == '1' ? '简历' : (scope.row.type == '2' ? '资格证书' : '其他')) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button style="float: left;" @click="download(scope.row)" icon="el-icon-download"></el-button>
            <el-button style="float: left;" type='primary' @click="previewFile(scope.row)" icon="el-icon-view">
            </el-button>
            <el-button style="float: left;" type="danger" @click="handleDel(scope.row,scope.$index)"
                       icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                     :current-page="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>

      <!--编辑 HrUserAccessory hr_user_accessory界面-->
      <el-dialog title="编辑hr_user_accessory" :visible.sync="editFormVisible" width="50%"
                 :close-on-click-modal="false">
        <hr-user-accessory-edit :hr-user-accessory="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                                @submit="afterEditSubmit"></hr-user-accessory-edit>
      </el-dialog>

      <!--新增 HrUserAccessory hr_user_accessory界面-->
      <el-dialog title="新增hr_user_accessory" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <hr-user-accessory-add :hr-user-accessory="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                               @submit="afterAddSubmit"></hr-user-accessory-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listHrUserAccessory,
  delHrUserAccessory,
  batchDelHrUserAccessory
} from "@/api/oa/hr/user/hrUserAccessory";
import {
  listArchiveAttachment
} from "@/api/mdp/arc/archiveAttachment";
import config from "@/common/config"; //全局公共库import
import HrUserAccessoryAdd from "./HrUserAccessoryAdd"; //新增界面
import HrUserAccessoryEdit from "./HrUserAccessoryEdit"; //修改界面
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
        key: "",
        startTimeRanger: [
          // util.formatDate.format(fromStartTime, "yyyy-MM-dd"),
          // util.formatDate.format(toStartTime, "yyyy-MM-dd")
        ],
        fromStartTime: '',
        toStartTime: '',
      },
      previewImgUrl: '',
      showPreviewImage: false,
      hrUserAccessorys: [], //查询结果
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

      addFormVisible: false, //新增hrUserAccessory界面是否显示
      //新增hrUserAccessory界面初始化数据
      addForm: {
        id: "",
        name: "",
        type: "",
        accessory: "",
        userid: "",
        uploadTime: ""
      },
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
      editFormVisible: false, //编辑界面是否显示
      //编辑hrUserAccessory界面初始化数据
      editForm: {
        id: "",
        name: "",
        type: "",
        accessory: "",
        userid: "",
        uploadTime: ""
      },
      /**begin 自定义属性请在下面加 请加备注**/
      options: [{
        value: "0",
        label: "合同"
      },
        {
          value: "1",
          label: "简历"
        },
        {
          value: "2",
          label: "资格证书"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      type: "",
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  watch: {
    "filters.startTimeRanger": function () {
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
      this.searchHrUserAccessorys();
    },
    searchOnEnter() {
      this.searchHrUserAccessorys();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getHrUserAccessorys();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getHrUserAccessorys();
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
      this.getHrUserAccessorys();
    },
    searchHrUserAccessorys() {
      this.pageInfo.count = true;
      this.getHrUserAccessorys();
    },
    //获取列表 HrUserAccessory hr_user_accessory
    getHrUserAccessorys() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        type: this.type,
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
      listHrUserAccessory(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.hrUserAccessorys = res.data.data;
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

    //显示编辑界面 HrUserAccessory hr_user_accessory
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 HrUserAccessory hr_user_accessory
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getHrUserAccessorys();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行hrUserAccessory
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除hrUserAccessory
    handleDel: function (row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id
        };
        delHrUserAccessory(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getHrUserAccessorys();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //批量删除hrUserAccessory
    batchDel: function () {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        batchDelHrUserAccessory(this.sels)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getHrUserAccessorys();
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
    previewFile(row) {
      let fileurl = config.getArcFileUploadBasePath() + "/" + row.accessory;
      if (!/.(bmp|jpg|jpeg|png|gif|webp)$/.test(row.accessory)) {
        this.$message({
          message: '该文件格式暂不支持预览',
          type: 'warning'
        });
      } else {
        this.showPreviewImage = !this.showPreviewImage
        this.previewImgUrl = fileurl;
      }
      console.log(2, fileurl);
    },
    /**begin 自定义函数请在下面加**/
    //下载附件
    download(row) {
      let fileurl = config.getArcFileUploadBasePath() + "/" + row.accessory;
      this.downloadFile(fileurl, row.name);
    },

    //执行下载文件
    downloadFile(url, filename) {
      let a = document.createElement("a"); // 创建a标签
      let e = document.createEvent("MouseEvents"); // 创建鼠标事件对象
      e.initEvent("click", false, false); // 初始化事件对象
      a.href = url; // 设置下载地址
      a.download = filename; // 设置下载文件名
      a.dispatchEvent(e);
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "hr-user-accessory-add": HrUserAccessoryAdd,
    "hr-user-accessory-edit": HrUserAccessoryEdit,

    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.getHrUserAccessorys();
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
</style>
