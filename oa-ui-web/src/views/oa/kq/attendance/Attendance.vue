<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <el-col :xs="22" :sm="22" :md="23" :lg="23" :xl="23">
        <el-date-picker v-model="month" type="month" placeholder="选择月"></el-date-picker>
        <el-button type="primary" @click="getUserAttendance" v-loading="load.add" :disabled="load.add==true"
                   icon="el-icon-search" style="margin-right: 13px;">查询
        </el-button>
        <el-button style="margin-left: 0;margin-right: 13px;" icon="el-icon-check" @click="userSelectVisible = true">
          {{ username ? username : '选择员工' }}
        </el-button>
        <el-button style="margin-left: 0;margin-right: 13px;" @click.native="switchList(1)" icon="el-icon-pie-chart">
          统计
        </el-button>
        <el-button style="margin-left: 0;margin-right: 13px;" @click.native="switchList(2)" icon="el-icon-date">日历
        </el-button>
      </el-col>
    </el-row>
    <div class="page-main padding-top">
      <div class="statistics" v-show="isActive">
        <!-- <el-tag style="margin-bottom:10px" v-text="'已选择:' + username "></el-tag> -->
        <el-row :gutter="20">
          <el-col :span="8" class="col">
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>出勤统计</span>
              </div>
              <div>
                <div id="myChart" :style="{width: '400px', height: '300px'}"></div>
              </div>
              <el-tag v-text="actualAttendance + '实际出勤'"></el-tag>
              <el-tag type="success" v-text="shouldAttendance + '应出勤'"></el-tag>
              <el-tag type="danger" v-text="noAttendance + '未出勤'"></el-tag>
            </el-card>
          </el-col>
          <el-col :span="16" class="col">
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>异常考勤汇总</span>
              </div>
              <el-row style="margin-bottom:18px">
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-date"></i>
                    </div>
                    <div class="info">
                      <div class="value" v-text="outState" @click="attendancedetailByOutState('1')"></div>
                      <div class="title">外勤(天)</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(141, 107, 243);">
                      <i class="el-icon-table-lamp"></i>
                    </div>
                    <div class="info">
                      <div class="value" v-text="kqWorkOvertimeInfos.length" @click="kqWorkOvertimeInfoVisible = true">
                      </div>
                      <div class="title">加班</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-tag v-text="beLate + '迟到'" @click="attendancedetailByStatus('1')"></el-tag>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-tag type="success" v-text="seriousLate + '严重迟到'"
                        @click="attendancedetailByStatus('2')"></el-tag>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-tag type="info" v-text="absenteeism + '旷工'" @click="attendancedetailByStatus('3')"></el-tag>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-tag type="warning" v-text="leaveEarly + '早退'" @click="attendancedetailByStatus('4')"></el-tag>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-tag type="danger" v-text="lackOfCard + '缺卡'" @click="attendancedetailByStatus('5')"></el-tag>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-row :gutter="20">
            <el-col :span="8" class="col" v-for="(item,index) in kqVacationTypeUsers" :key="index">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span v-text="item.vacationType"></span>
                </div>
                <el-row :gutter="20" class="card-font">
                  <el-col :span="20">今年可请（小时）</el-col>
                  <el-col :span="4" v-text="item.totalDays"></el-col>
                  <el-col :span="20">已请（小时）</el-col>
                  <el-col :span="4" v-text="item.remainingHoliday"></el-col>
                  <el-col :span="20">当前可请（小时）</el-col>
                  <el-col :span="4" v-text="item.totalDays - item.remainingHoliday"></el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <div class="calendar" v-show="!isActive">
        <div class="calendar-header">
          <el-tag style="margin-bottom:10px" v-text="'已选择:' + username "></el-tag>
          <div class="cal-header-boxs">
            <div :class="{'cal-header-box':true,'click' :flag == 'all'}" @click="selectAttendanceType('all')">
              <div class="box-icon">
                <img src="../../../../assets/image/all.png" height="15px"/>
              </div>
              <div class="box-info">全部</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '0'}" @click=" selectAttendanceType('0')">
              <div class="box-icon">
                <img src="../../../../assets/image/normal.png" height="15px"/>
              </div>
              <div class="box-info">正常</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '1'}" @click="selectAttendanceType('1')">
              <div class="box-icon">
                <img src="../../../../assets/image/belate.png" height="15px"/>
              </div>
              <div class="box-info">迟到</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '2'}" @click="selectAttendanceType('2')">
              <div class="box-icon">
                <img src="../../../../assets/image/seriouslate.png" height="15px"/>
              </div>
              <div class="box-info">严重迟到</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '3'}" @click="selectAttendanceType('3')">
              <div class="box-icon">
                <img src="../../../../assets/image/miner.png" height="15px"/>
              </div>
              <div class="box-info">旷工</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '4'}" @click="selectAttendanceType('4')">
              <div class="box-icon">
                <img src="../../../../assets/image/leaveearly.png" height="15px"/>
              </div>
              <div class="box-info">早退</div>
            </div>
            <div :class="{'cal-header-box':true,'click' :flag == '5'}" @click="selectAttendanceType('5')">
              <div class="box-icon">
                <img src="../../../../assets/image/leakagesign.png" height="15px"/>
              </div>
              <div class="box-info">缺卡</div>
            </div>
          </div>
        </div>
        <el-calendar v-model="calendarDate">
          <template slot="dateCell" slot-scope="{date, data}">
            <div>{{ date.getDate() }} {{ data.isSelected ? '✔️' : '' }}</div>
            <div class="calendar-box">
              <div v-for=" (i,index)  in showCalendarDataTips(date,data)" :key="index">
                <img v-if="i.attendanceNormalCount>0" src="../../../../assets/image/normal.png" height="15px"/>
                <img v-if="i.attendanceLateCount>0" src="../../../../assets/image/belate.png" height="15px"/>
                <img v-if="i.attendanceSeriousLateCount>0" src="../../../../assets/image/seriouslate.png"
                     height="15px"/>
                <img v-if="i.absenteeismCount>0" src="../../../../assets/image/miner.png" height="15px"/>
                <img v-if="i.leaveEarlyCount>0" src="../../../../assets/image/leaveearly.png" height="15px"/>
                <img v-if="i.attendanceMissedCount>0" src="../../../../assets/image/leakagesign.png" height="15px"/>
              </div>

            </div>
          </template>
        </el-calendar>
      </div>
    </div>
    <!-- 选择用户 -->
    <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    <!-- 请假申请 -->
    <el-dialog append-to-body title="请假申请" :visible.sync="leaveApplyVisible" width="80%" top="3vh">
      <leave-apply @submit="afterAddSubmit" :userid="userid" :username="username" @cancel="leaveApplyVisible = false">
      </leave-apply>
    </el-dialog>
    <!-- 加班申请 -->
    <el-dialog append-to-body title="加班申请" :visible.sync="overtimeApplyVisible" width="80%" top="3vh">
      <overtime-apply @submit="afterAddSubmit" :userid="userid" :username="username" :visible="overtimeApplyVisible"
                      @cancel="overtimeApplyVisible = false"></overtime-apply>
    </el-dialog>
    <!-- 考勤明细 -->
    <el-dialog append-to-body title="考勤明细" :visible.sync="attendancedetailVisible" width="90%">
      <el-table :data="attendancedetails" highlight-current-row border style="width: 100%;" v-loading="load.list">
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="userid" label="编号" min-width="80"></el-table-column>
        <el-table-column prop="ontimeState" label="考勤状态" min-width="80">
          <template slot-scope="scope">{{ attendanceStatus(scope.row.ontimeState) }}</template>
        </el-table-column>
        <el-table-column prop="workTime" label="打卡时间" min-width="80"></el-table-column>
      </el-table>
      <div style="overflow: auto;">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                       :current-page="pageInfo.pageNum"
                       :page-size="pageInfo.pageSize" :total="pageInfo.total"
                       style="float:right;margin:20px 0px;"></el-pagination>
      </div>
    </el-dialog>
    <!-- 加班 -->
    <el-dialog append-to-body title="加班明细" :visible.sync="kqWorkOvertimeInfoVisible" width="90%">
      <el-table :data="kqWorkOvertimeInfos" highlight-current-row border>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column prop="username" label="员工名称" min-width="80"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="80"></el-table-column>
        <el-table-column prop="workOvertimeType" label="加班类型" min-width="80">
          <template
              scope="scope">{{
              scope.row.workOvertimeType == '0' ? '工作日加班' : (scope.row.workOvertimeType == '1' ? '双休日加班' : '法定假日加班')
            }}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" min-width="80"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="80"></el-table-column>
        <el-table-column prop="workOvertimeHours" label="加班小时数" min-width="80"></el-table-column>
        <el-table-column prop="reasonWorkOvertime" label="加班原因" min-width="80"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" min-width="80"></el-table-column>
        <el-table-column prop="applyTime" label="申请时间" min-width="80"></el-table-column>
        <el-table-column prop="bizFlowState" label="当前流程状态" min-width="80">
          <template
              scope="scope">
            {{ scope.row.bizFlowState == '0' ? '未审核' : (scope.row.bizFlowState == '1' ? '审核中' : (scope.row.bizFlowState == '2' ? '已审核' : '审核不通过')) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
import leaveApply from "@/views/oa/kq/attendance/leaveApply";
import overtimeApply from "@/views/oa/kq/attendance/overtimeApply";
import {
  listKqWorkOvertimeInfo
} from "@/api/oa/kq/kqWorkOvertimeInfo";
import {
  listKqVacationTypeUser
} from "@/api/oa/kq/kqVacationTypeUser";
import {
  listKqYearDateAll
} from "@/api/oa/kq/kqYearDateAll";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      activeName: "first",
      isActive: true,
      calendarDate: new Date(),
      value: "",
      userid: "",
      username: "",
      userSelectVisible: false,
      attendanceList: [],
      month: new Date(),
      actualAttendance: 0, //实际出勤
      shouldAttendance: 0, //应出勤
      noAttendance: 0, // 未出勤
      outState: 0, //外勤
      beLate: 0, //迟到
      seriousLate: 0, //严重迟到
      absenteeism: 0, //旷工
      leaveEarly: 0, //早退
      lackOfCard: 0, //缺卡
      leaveApplyVisible: false,
      overtimeApplyVisible: false,
      attendancedetailVisible: false,
      kqWorkOvertimeInfoVisible: false,
      attendancedetails: [], //考勤明细
      kqWorkOvertimeInfos: [],
      kqVacationTypeUsers: [],
      attendanceListByType: [], //根据类型存储的考勤信息
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      status: "", //考勤状态
      outStateStatus: "", //外勤
      flag: "all",
      load: {
        list: false,
        edit: false,
        del: false,
        add: false
      }, //查询中...
      kqYearDateAlls: [],
    };
  },
  mounted() {
    this.userid = this.userInfo.userid;
    this.username = this.userInfo.username;
    this.getUserAttendance();
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.attendancedetail();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.attendancedetail();
    },
    switchList(type) {
      if (type == 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
        this.flag = "all";
        this.selectAttendanceType("all");
      }
    },
    //获取员工考勤信息
    getUserAttendance() {
      if (this.month == null) {
        this.month = new Date();
      }
      let params = {};
      let monthDate = util.formatDate.format(this.month, "yyyy-MM");
      params.userid = this.userid;
      params.month = monthDate;
      this.load.add = true;
      listAttendanceMonth(params).then((res) => {
        this.load.add = false;
        let tips = res.data.tips;
        if (tips.isOk) {
          // todo 页面崩溃
          // this.attendanceList = res.data.monthRecord;
          this.attendanceList = res.data && res.data.monthRecord ? res.data.monthRecord : [];
          console.log(123, this.attendanceList);
          this.getKqYearDateAll(); //获取数据库记录的假日
          this.getKqWorkOvertimeInfos(monthDate); //查询加班信息
          this.getKqVacationTypeUsers(); //获取员工假期信息
          this.selectAttendanceType(this.flag); //根据类型查询考勤
        }
      });
    },

    afterAddSubmit() {
      this.leaveApplyVisible = false;
      this.overtimeApplyVisible = false;
      this;
    },

    //查询加班信息
    getKqWorkOvertimeInfos(month) {
      let params = {
        userid: this.userid,
        month: month,
        bizFlowState: 2,
      };
      listKqWorkOvertimeInfo(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.kqWorkOvertimeInfos = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: "error"
          });
        }
      });
    },

    //考勤数据分类
    attendanceClassify() {
      this.outState = 0;
      this.beLate = 0;
      this.seriousLate = 0;
      this.absenteeism = 0;
      this.leaveEarly = 0;
      this.lackOfCard = 0;
      let dayStrs = [];
      let dayArr = [];
      for (let i = 0; i < this.attendanceList.length; i++) {
        //外勤
        if (this.attendanceList[i].outState == "1") {
          this.outState += 1;
        }
        //迟到
        if (this.attendanceList[i].ontimeState == "1") {
          this.beLate += 1;
        }
        //严重迟到
        if (this.attendanceList[i].ontimeState == "2") {
          this.seriousLate += 1;
        }
        //旷工
        if (this.attendanceList[i].ontimeState == "3") {
          this.absenteeism += 1;
        }
        //早退
        if (this.attendanceList[i].ontimeState == "4") {
          this.leaveEarly += 1;
        } //缺卡
        if (this.attendanceList[i].ontimeState == "5") {
          this.lackOfCard += 1;
        }
        if (dayArr.indexOf(this.attendanceList[i].workTime.split(" ")[0]) == -1) {
          dayArr.push(this.attendanceList[i].workTime.split(" ")[0]);
        }
      }
      console.log(123, dayArr);
      this.actualAttendance = dayArr.length;
      this.noAttendance = this.shouldAttendance - this.actualAttendance;
      this.drawLine();
    },
    //选择申请人后回调
    onUserSelected(users) {
      this.userid = users[0].userid;
      this.username = users[0].username;
      this.userSelectVisible = false;
    },
    //获取员工假期信息
    getKqVacationTypeUsers() {
      let params = {
        userid: this.userid,
        year: new Date().getFullYear(),
        branchId: this.userInfo.branchId,
      };
      listKqVacationTypeUser(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.kqVacationTypeUsers = res.data.data;
        }
      });
    },
    //考勤明细
    attendancedetail() {
      if (this.month == null) {
        this.month = new Date();
      }
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
      };
      let monthDate = util.formatDate(this.month, "yyyy-MM");
      params.userid = this.userid;
      if (this.status != "") {
        params.ontimeState = this.status;
      }
      if (this.outStateStatus != "") {
        params.outState = this.outStateStatus;
      }
      params.month = monthDate;
      this.load.list = true;
      listAttendanceMonth(params)
          .then((res) => {
            this.load.list = false;
            let tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.attendancedetails = res.data.monthRecord;
            }
          })
          .catch((err) => {
            this.load.list = false;
          });
    },
    attendanceStatus(status) {
      if (status == "0") {
        return "正常";
      }
      if (status == "1") {
        return "迟到";
      }
      if (status == "2") {
        return "严重迟到";
      }
      if (status == "3") {
        return "旷工";
      }
      if (status == "4") {
        return "早退";
      }
      if (status == "5") {
        return "缺卡";
      }
    },
    //根据不同的考勤状态调用不同的类型
    attendancedetailByStatus(status) {
      this.status = status;
      this.outStateStatus = "";
      this.attendancedetailVisible = true;
      this.attendancedetail();
    },
    //根据外勤查找考勤
    attendancedetailByOutState(outStateStatus) {
      this.status = "";
      this.outStateStatus = outStateStatus;
      this.attendancedetail();
      this.attendancedetailVisible = true;
    },

    // 饼状图
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["未出勤", "实际出勤"],
        },
        series: [{
          name: "出勤统计",
          type: "pie",
          radius: ["50%", "70%"],
          data: [{
            value: this.noAttendance,
            name: "未出勤"
          },
            {
              value: this.actualAttendance,
              name: "实际出勤"
            },
          ],
        },],
      };

      // 绘制图表
      myChart.setOption(option);
    },
    //根据类型查询考勤
    selectAttendanceType(type) {
      this.flag = type;
      let params = {};
      let monthDate = util.formatDate.format(this.month, "yyyy-MM");
      params.month = monthDate;
      params.userid = this.userid;
      if (type != "all") {
        params.ontimeState = type;
      }
      listAttendanceMonth(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          // todo length报错，可能不是一个可以 .length 的对象
          // this.attendanceListByType = res.data.monthRecord; // 旧代码
          this.attendanceListByType = res.data && res.data.monthRecord ? res.data.monthRecord : [];
        }
      });
    },
    //显示考勤信息
    showCalendarDataTips: function (date, data) {
      var datas = this.attendanceListByType;
      var datas2 = datas;
      var attendanceNormal = [];
      var attendanceSeriousLate = [];
      var attendanceLate = [];
      var absenteeism = [];
      var leaveEarly = [];
      var attendanceMissed = [];
      var tags = [];
      var now = new Date();
      var dateStr = util.formatDate.format(now, "yyyy-MM-dd");
      if (dateStr == data.day) {
        data.isSelected = true;
      }
      for (var i = 0; i < datas2.length; i++) {
        var attendance = datas2[i];
        if (attendance.workTime.indexOf(data.day) >= 0) {
          if (attendance.ontimeState == 0) {
            attendance.calStatus = "打卡正常";

            attendanceNormal.push(attendance);
          } else if (attendance.ontimeState == 1) {
            attendance.calStatus = "迟到";
            attendanceLate.push(attendance);
          } else if (attendance.ontimeState == 2) {
            attendance.calStatus = "严重迟到";
            attendanceSeriousLate.push(attendance);
          } else if (attendance.ontimeState == 3) {
            attendance.calStatus = "旷工";
            absenteeism.push(attendance);
          } else if (attendance.ontimeState == 4) {
            attendance.calStatus = "早退";
            leaveEarly.push(attendance);
          } else if (attendance.ontimeState == 5) {
            attendance.calStatus = "缺勤";
            attendanceMissed.push(attendance);
          }
        }
      }
      var allAttendances = attendanceNormal
          .concat(attendanceLate)
          .concat(attendanceSeriousLate)
          .concat(absenteeism)
          .concat(leaveEarly)
          .concat(attendanceMissed);
      allAttendances.forEach((i) => {
        var tagIds = i.userid ? i.userid.split(",") : [];
        var tagWorkAddress = i.workAddress ? i.workAddress.split(",") : [];
        var tagWorkTime = i.workTime ? i.workTime.split(",") : [];
        var tagUsername = i.userName;
        tagIds.forEach((tagId, index) => {
          var tag = tags.find((t) => t.tagId == tagId);
          if (tag) {
            tag.count = tag.count + 1;
          } else {
            tag = {
              tagId: tagId,
              tagWorkAddress: tagWorkAddress[index],
              tagWorkTime: tagWorkTime[index],
              tagUsername: tagUsername,
              calStatus: i.calStatus,
              count: 1,
            };
            tags.push(tag);
          }
        });
      });
      var msg = {
        attendanceNormal: attendanceNormal,
        attendanceNormalCount: attendanceNormal.length,
        attendanceLate: attendanceLate,
        attendanceLateCount: attendanceLate.length,
        attendanceSeriousLate: attendanceSeriousLate,
        attendanceSeriousLateCount: attendanceSeriousLate.length,
        absenteeism: absenteeism,
        absenteeismCount: absenteeism.length,
        leaveEarly: leaveEarly,
        leaveEarlyCount: leaveEarly.length,
        attendanceMissed: attendanceMissed,
        attendanceMissedCount: attendanceMissed.length,
        allAttendances: allAttendances,
        tags: tags,
      };
      return [msg];
    },

    //获取数据库记录的假日
    getKqYearDateAll() {
      let month = this.month.getMonth() + 1;
      let params = {
        repYear: this.month.getFullYear(),
        month: month,
      };
      listKqYearDateAll(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.kqYearDateAlls = res.data.data;
          this.getWorkDays();
        }
      });
    },
    //获取当前月的工作日
    getWorkDays() {
      let dayNum = new Date(
          this.month.getFullYear(),
          this.month.getMonth() + 1, 0).getDate();
      let year = this.month.getFullYear();
      let month = "";
      if (this.month.getMonth() + 1 < 10) {
        month = "0" + (this.month.getMonth() + 1);
      } else {
        month = this.month.getMonth() + 1;
      }
      let num = 0;
      for (let i = 1; i <= dayNum; i++) {
        let str = year + "-" + month + "-";
        if (i < 10) {
          str += "0" + i;
        } else {
          str += i;
        }
        let boo = this.isWorkDay(str);
        if (boo) {
          num++;
        }
      }
      this.shouldAttendance = num;
      this.attendanceClassify(); //考勤分类
    },
    //是否为工作日
    isWorkDay(date) {
      let data = [];
      let boo = true;
      let day = new Date(date).getDay();
      if (day == 6 || day == 0) {
        boo = false;
      } else {
        boo = true;
      }
      for (let i = 0; i < this.kqYearDateAlls.length; i++) {
        let startTime = new Date(this.kqYearDateAlls[i].startTime).getTime();
        let endTime = new Date(this.kqYearDateAlls[i].endTime).getTime();
        let dayTime = new Date(date).getTime();
        if (startTime <= dayTime && endTime >= dayTime) {
          if (this.kqYearDateAlls[i].dbStatus == "0") {
            boo = true;
            break;
          } else {
            boo = false;
            break;
          }
        }
      }

      return boo;
    },
  },
  components: {
    "users-select": UsersSelect,
    "leave-apply": leaveApply,
    "overtime-apply": overtimeApply,

  }
};
</script>

<style scoped lang="scss">
.container {
  margin: 10px;
}

.header {
  display: flex;
  justify-content: flex-start;
  padding: 10px;

  span {
    padding-right: 15px;
  }
}

.col {
  margin-bottom: 20px;
}

.icon {
  color: #fff;
  height: 50px;
  width: 50px;
  border-radius: 25px;
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  display: inline-block;
  margin-right: 10px;
}

.item {
  display: flex;
  justify-content: flex-start;
}

.card-font {
  color: #000000;
  font-size: 12px;

  .el-col {
    margin-bottom: 20px;
  }
}

.calendar-header {
  display: flex;
  justify-content: space-between;

  .cal-header-boxs {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .cal-header-box {
      padding: 5px;
      height: 45px;
      margin-left: 10px;
    }

    .box-icon {
      text-align: center;
    }

    .box-info {
      text-align: center;
      font-size: 12px;
      color: #000000;
    }
  }
}

.el-tag:hover {
  cursor: pointer;
}

.value {
  cursor: pointer;
}

.reference {
  margin-top: 10px;
  font-size: 12px;
}

.click {
  background: #e9f7ff;
}

.calendar-box {
  display: flex;
  justify-content: flex-start;
}
</style>

<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
