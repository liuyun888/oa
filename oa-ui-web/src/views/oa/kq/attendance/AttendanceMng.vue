<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-button @click="showCalendar=true" icon="el-icon-back"></el-button>
      <el-date-picker v-model="targetMonth" type="month" placeholder="选择月">
      </el-date-picker>
      <el-button @click.native="userSelectVisible=true" icon="el-icon-plus">个人</el-button>
      <el-button @click.native="groupSelectVisible=true" icon="el-icon-plus">考勤组</el-button>
      <el-button @click.native="showCalendar=true" icon="el-icon-date">日历</el-button>
      <el-button @click.native="showCalendar=false" icon="el-icon-tickets">列表</el-button>
      <el-button @click.native="isAttendanceExport=true" icon="el-icon-download">导出列表</el-button>
      <el-button type="primary" @click="getAttendance" icon="el-icon-search" v-loading="load.add"
                 :disabled="load.add==true">查询
      </el-button>

    </el-row>
    <el-row class="page-main padding-top" v-show="!showCalendar">

      <el-table :data="pageCalendar" border style="width: 100%">
        <el-table-column prop="day" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="userName" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="userid" label="工号" width="150">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template slot-scope="cope">
            <el-tag :type="cope.row.status == '1' ? 'success' : 'danger'">
              {{ cope.row.status == '1' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="classes" label="班次">
        </el-table-column>
      </el-table>
      <el-pagination style="float: right;margin-bottom: 40px;" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" :current-page="calendar.pageNum"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="calendar.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="calendarList.length">
      </el-pagination>
    </el-row>


    <el-dialog title="导出考勤列表" :visible.sync="isAttendanceExport" width="40%" center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAttendanceExport = false">取 消</el-button>
        <el-button type="primary" @click="getAttendanceExport">确 定</el-button>
      </span>
    </el-dialog>
    <el-row v-show="showCalendar" class="page-main padding-top">
      <el-col :span="6" class="hidden-md-and-down padding">
        <dept-tree style="height: 480;" show-checkbox show-root multiple="true" default-expand-all
                   check-on-click-node="true"
                   :expand-on-click-node="false" @check-change="handleLeftDeptNodeClick"
                   @branch-row-click="branchRowClick" ref="deptTree">
        </dept-tree>
      </el-col>
      <el-col :span="18" class="page-main padding-top">
        <el-calendar v-loading="listLoading" v-model="targetMonth">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" scope="{date, data}">
            <div :class="data.isSelected ? 'is-selected' : ''">
              <div></div>
              <div>{{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : '' }}</div>
              <div v-for="(item,index) in showAttendanceCalendar(data)" :key="index">
                <el-tag effect="dark" style="margin-bottom:10px" size="mini" v-if="item.num != 0"
                        :type="item.status == '1' ? 'success' : 'danger'"
                        @click.stop="clickTag(item.status,data.day,item.userids)">
                  {{ item.status == '1' ? '正常' : '异常' }}{{ item.num }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-col>

      <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
        <users-select :select-userids="filters.assignee?[filters.assignee.userid]:[]" @confirm="onUserSelected">
        </users-select>
      </el-dialog>
      <el-dialog append-to-body title="选择考勤组" :visible.sync="groupSelectVisible" width="60%">
        <group-select @selectGroup="getGroup"></group-select>
      </el-dialog>
      <el-dialog title="考勤明细" :visible.sync="attDialogTableVisible" width="60%">
        <el-table :data="attData">
          <el-table-column property="userName" label="姓名" min-width="150"></el-table-column>
          <el-table-column property="status" label="状态" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.status == "1" ? "正常" : "异常" }}
            </template>
          </el-table-column>
          <el-table-column property="classes" label="班次" min-width="300"></el-table-column>
        </el-table>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库

//import Sticky from "@/components/Sticky"; // 粘性header组件

import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue"; //下拉框数据查询
import {
  mapGetters
} from "vuex";
import {
  listAttendanceMonth
} from "@/api/oa/kq/attendance";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import GroupSelect from "./GroupSelect";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {
    "dept-tree": DeptTree,
    UsersSelect,
    GroupSelect
  },
  data() {
    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
    return {
      filters: {
        key: "",
        otherParames: {},
        allBtn: false,
        procCategory: "",
        categoryId: "", //流程归档分类编号
        categoryTreeNodes: [],
        tags: [],
        startTimeRanger: [
          util.formatDate.format(fromStartTime, "yyyy-MM-dd"),
          util.formatDate.format(toStartTime, "yyyy-MM-dd")
        ],
        planFinishTimeRanger: [],
        endTimeRanger: [],
        assignee: null,
        group: null
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
          }
        ]
      },
      pageInfo: {
        // 分页数据
        total: 0, // 服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 20, // 每页数据
        pageNum: 1, // 当前页码、从1开始计算
        orderFields: ["create_time_"], // 排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], // 升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        count: true
      },
      calendarList: [],
      pageCalendar: [],
      calendar: {
        pageSize: 10,
        pageNum: 1,
      },
      targetMonth: new Date(),
      listLoading: false, // 查询中...
      showCalendar: true,
      attendances: [],
      timeList: [],
      attendanceNormalCount: "",
      attendanceLateCount: "",
      attendanceSeriousLateCount: "",
      absenteeismCount: "",
      leaveEarlyCount: "",
      attendanceMissedCount: "",
      calendarArr: [],
      username: "",
      allGroup: [],
      groupid: null,
      deptid: null,
      value: "",
      userSelectVisible: false,
      groupSelectVisible: false,
      deptids: [], //部门ID,
      load: {
        list: false,
        edit: false,
        del: false,
        add: false
      }, //查询中...
      attDialogTableVisible: false, //考勤明细
      attData: [],
      isAttendanceExport: false
    };
  }, // end data
  // 切换月份
  watch: {
    targetMonth(val, olVal) {
      this.getAttendance();
    },
  },
  mounted: function () {
    this.getAttendance();
  },
  methods: {
    getAttendance: function () {
      let params = {
        month: util.formatDate.format(this.targetMonth, "yyyy-MM")
      };
      if (this.filters.assignee != null) {
        params.userid = this.filters.assignee.userid;
      }

      // todo length报错， 必须要等页面中的ref子组件加载完毕，才可以获取到值
      // var deptids=this.$refs.deptTree.$refs.deptTree.getCheckedKeys(); // 旧代码

      var deptids
      this.$nextTick(() => {
        // 这里的代码会在下一个DOM更新周期执行
        deptids = this.$refs.deptTree.$refs.deptTree.getCheckedKeys();
      });

      if (deptids && deptids.length > 0) {
        params.deptids = deptids;
      }
      if (this.filters.group != null) {
        params.groupId = this.filters.group.id;
      }
      if (
          this.filters.assignee == null &&
          this.filters.group == null &&
          this.deptids == null
      ) {
        params.userid = this.userInfo.userid;
      }
      this.load.add = true;
      listAttendanceMonth(params).then(res => {
        this.load.add = false;
        if (res.data.tips.isOk) {
          // todo res.data可能是[]
          // this.attendances = res.data.monthRecord  // old
          this.attendances = res.data.monthRecord ? res.data.monthRecord : [];
          var that = this;
          var arrs = [];
          var arr = [];
          if (this.attendances.length !== 0) {
            this.attendances.forEach(function (item, index) {
              item.workTime = item.workTime.substr(0, 10);
              arr.push(item.workTime)
            })
          }
          var hash = [];
          for (var i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i]);
            }
          }
          for (var i = 0; i < hash.length; i++) {
            arrs = arrs.concat(this.showAttendanceList(hash[i]))
          }
          ;
          that.calendarList = [];
          arrs.forEach(function (item1, i) {
            that.showTag(item1.status, item1.day, item1.userids)
          })
          that.pageCalendar = that.calendarList.slice(0, this.calendar.pageSize);
        } else {
          this.$message({
            message: res.data.tips.msg,
            type: "error"
          });
        }
        this.listLoading = false;
      });
    },
    showAttendanceCalendar(data) {
      let day = data.day;
      let arr = [];
      let userids = [];
      for (let i = 0; i < this.attendances.length; i++) {
        if (this.attendances[i].workTime.split(" ")[0] == day) {
          arr.push(this.attendances[i]);
          if (userids.indexOf(this.attendances[i].userid) == -1) {
            userids.push(this.attendances[i].userid);
          }
        }
      }
      let normalAttNum = 0;
      let errorAttNum = 0;
      let normalUserids = [];
      let errorUserids = [];
      for (let i = 0; i < userids.length; i++) {
        let boo = true;
        for (let j = 0; j < arr.length; j++) {
          if (userids[i] == arr[j].userid) {
            if (arr[j].ontimeState != "0") {
              boo = false;
            }
          }
        }
        if (boo) {
          normalAttNum++;
          normalUserids.push(userids[i]);

        } else {
          errorAttNum++;
          errorUserids.push(userids[i]);
        }
      }
      let nums = [{
        status: "1",
        num: normalAttNum,
        userids: normalUserids
      }, {
        status: "0",
        num: errorAttNum,
        userids: errorUserids
      }];
      return nums;
    },

    showAttendanceList(data) {
      let day = data;
      let arr = [];
      let userids = [];
      for (let i = 0; i < this.attendances.length; i++) {
        if (this.attendances[i].workTime.split(" ")[0] == day) {
          arr.push(this.attendances[i]);
          if (userids.indexOf(this.attendances[i].userid) == -1) {
            userids.push(this.attendances[i].userid);
          }
        }
      }
      let normalAttNum = 0;
      let errorAttNum = 0;
      let normalUserids = [];
      let errorUserids = [];
      for (let i = 0; i < userids.length; i++) {
        let boo = true;
        for (let j = 0; j < arr.length; j++) {
          if (userids[i] == arr[j].userid) {
            if (arr[j].ontimeState != "0") {
              boo = false;
            }
          }
        }
        if (boo) {
          normalAttNum++;
          normalUserids.push(userids[i]);

        } else {
          errorAttNum++;
          errorUserids.push(userids[i]);
        }
      }
      let nums = [{
        status: "1",
        num: normalAttNum,
        day: data,
        userids: normalUserids
      }, {
        status: "0",
        num: errorAttNum,
        day: data,
        userids: errorUserids
      }];
      return nums;
    },
    getAttendanceExport() {
      let data = this.calendarList
      this.deriveExcel(data)
    },
    deriveExcel(resData) {
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "日期",
          "姓名",
          "工号",
          "状态",
          "排班",
        ];
        const filterVal = [
          "day",
          "userName",
          "userid",
          "chstatus",
          "classes",
        ];
        const list = resData;
        const data = this.formatJson(filterVal, list);
        var filename = util.formatDate.format(this.targetMonth, "yyyy-MM") + "考勤列表";
        if (this.filters.group) {
          filename = this.filters.group.groupName + '-' + filename
        }
        if (this.filters.assignee) {
          filename = this.filters.assignee.username + '-' + filename
        }
        // if (this.filters.assignee||this.filters.group) {
        //   filename = this.filters.groupgroupName + '-' + this.filters.assignee.username + "考勤列表";
        // }
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
    handleLeftDeptNodeClick(data, node, comp) {
      this.getAttendance();
    },
    branchRowClick: function (row, event, column) {
    },
    onUserSelected: function (users) {
      this.userSelectVisible = false;
      this.filters.assignee = users[0];
      this.getAttendance();
    },
    handleFiltersTagClose: function (tag, paramsName) {
      if (paramsName == "key") {
        this.filters.key = null;
      } else if (paramsName == "categoryTreeNodes") {
        this.filters.categoryTreeNodes = this.filters.categoryTreeNodes.filter(
            i => i.id != tag.id
        );
        this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id, false, false);
      } else if (paramsName == "procCategory") {
        this.filters.procCategory = null;
      } else if (paramsName == "tags") {
        this.filters.tags = this.filters.tags.filter(i => i.tagId != tag.tagId);
      } else if (paramsName == "assignee") {
        this.filters.assignee = null;
      } else if (paramsName == "deptTreeNodes") {
        this.filters.deptTreeNodes = this.filters.deptTreeNodes.filter(
            i => i.deptid != tag.deptid
        );
        this.deptids = this.deptids.filter(i => i != tag.deptid);
      } else if (paramsName == "group") {
        this.filters.group = null;
      }
      this.getAttendance();
    },
    //获取选择的考勤组
    getGroup(group) {
      this.filters.group = group[0];
      this.groupSelectVisible = false;
      this.getAttendance();
    },
    //点击标签
    clickTag(status, day, userids) {
      this.attDialogTableVisible = true;
      this.attData = [];
      for (let i = 0; i < userids.length; i++) {
        let att = {
          userName: "",
          status: status,
          classes: "",
        }
        for (let j = 0; j < this.attendances.length; j++) {
          if (userids[i] == this.attendances[j].userid && this.attendances[j].workTime.split(" ")[0] == day) {
            att.userName = this.attendances[j].userName;
            att.classes += this.attendances[j].scheduleTime + " —— " + this.getAttendanceStatus(this.attendances[j]
                .ontimeState) + "         "
          }
        }
        this.attData.push(att);
      }
    },
    showTag(status, day, userids) {
      this.addData = [];
      for (let i = 0; i < userids.length; i++) {
        let att = {
          userName: "",
          status: status,
          classes: "",
          chstatus: ""
        }
        for (let j = 0; j < this.attendances.length; j++) {
          if (userids[i] == this.attendances[j].userid && this.attendances[j].workTime.split(" ")[0] == day) {
            att.userName = this.attendances[j].userName;
            att.userid = this.attendances[j].userid;
            att.day = day;
            if (status == "1") {
              att.chstatus = "正常"
            } else if (status == "0") {
              att.chstatus = "异常"
            }
            att.classes += this.attendances[j].scheduleTime + " —— " + this.getAttendanceStatus(this.attendances[j]
                .ontimeState) + "， "
          }
        }
        var attData1 = []
        attData1.push(att);
        this.addData = attData1
        this.calendarList = this.calendarList.concat(this.addData);
      }
    },
    handleSizeChange(val) {
      this.calendar.pageSize = val;
      this.calendar.pageNum = 1;
      this.pageCalendar = this.calendarList.slice(0, this.calendar.pageSize)
    },
    handleCurrentChange(val) {
      this.calendar.pageNum = val
      this.pageCalendar = this.calendarList.slice((this.calendar.pageNum - 1) * this.calendar.pageSize, this.calendar
          .pageNum * this.calendar.pageSize)
    },
    getAttendanceStatus(ontimeState) {
      if (ontimeState == "0") {
        return "正常";
      }
      if (ontimeState == "1") {
        return "迟到";
      }
      if (ontimeState == "2") {
        return "严重迟到";
      }
      if (ontimeState == "3") {
        return "旷工";
      }
      if (ontimeState == "4") {
        return "早退";
      }
      if (ontimeState == "5") {
        return "缺卡";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// .filters-show {
//   margin-left: 20px;
//   margin-top: 10px;
//   margin-bottom: 0px;
// }

.filters-label {
  font-size: 14px;
  color: black;
  font-weight: bold;
}

.dialog-body {
  padding: 0px 0px;
}

.more-filter-item {
  margin: 20px 20px;
}

.more-filter-item .el-col {
  margin: 2px 2px;
}

.more-filter-item button {
  margin: 2px 2px;
}

.calendar-cell-data {
  flex: 1;
  display: inline-block;
  align-items: left;
  justify-content: space-between;
  font-size: 14px;
  color: #4386c6;

  i，span {
    margin-left: 0px;
    font-size: 18px;
    font-weight: 600;
  }
}

.el-ic {
  display: none;

  i,
  span {
    padding: 0 0px;
    font-size: 18px;
    font-weight: 600;
  }
}

.calendar-cell-data:hover .el-ic {
  color: #428bca !important;
  display: inline-block;
  margin-left: 20px;
}

.calendar-cell-datat:hover {
  font-weight: bold;
}
</style>
