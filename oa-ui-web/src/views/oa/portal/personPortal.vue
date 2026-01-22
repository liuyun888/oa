<template>
  <div class="personContainer">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="left">
          <div class="item">
            <img src="../../../assets/image/portal_page.png" />
          </div>
          <!-- 流程中心 -->
          <div class="process-center">
            <div class="process-center-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>流程中心</span>
            </div>
            <div class="process-center-content">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="我发起的" name="IStarted"></el-tab-pane>
                <el-tab-pane label="我参与的" name="IParticipateIn"></el-tab-pane>
                <el-tab-pane label="我主办的" name="MyHost"></el-tab-pane>
                <el-tab-pane label="我监控的" name="MyMonitor"></el-tab-pane>
              </el-tabs>
              <el-table
                :data="executions"
                style="width: 100%;font-size:12px"
                :show-header="showHeader"
                v-loading="load.list"
              >
                <el-table-column sortable prop="mainTitle" label="流程【任务】(点击详情)" min-width="300"></el-table-column>
                <el-table-column
                  sortable
                  prop="startTime"
                  label="发起时间"
                  width="150"

                ></el-table-column>
              </el-table>
            </div>
          </div>

          <div class="left-footer">
            <el-row :gutter="10">
              <!-- 新闻动态 -->
              <el-col :span="12">
                <div class="news">
                  <div class="news-header">
                    <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                    <span>新闻动态</span>
                  </div>
                  <div class="news-content">
                    <el-row :gutter="10" style="margin-bottom:10px" v-for="(news,index) in listNews" :key="index">
                      <el-col :span="11">
                        <div class="grid-content bg-purple">
                          <el-carousel trigger="click" height="120px">
                            <el-carousel-item v-for="item in dataList1" :key="item">
                              <img
                                :src="item"
                                alt
                                width="100%"
                                height="100%"
                              />
                            </el-carousel-item>
                          </el-carousel>
                        </div>
                      </el-col>
                      <el-col :span="13">
                        <div class="grid-content bg-purple news-font" v-text="news.archiveTitle">
                          <!-- 移动办公亲体验——维森移动OA大会走进肇庆&日照
                          近日，维森OA办公系统2018移动办公体验会在肇庆和日照相继召开 -->
                        </div>
                      </el-col>
                    </el-row>

                  </div>
                </div>
              </el-col>
              <!-- 重要通知 -->
              <el-col :span="12">
                <div class="inform">
                  <div class="inform-header">
                    <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
                    <span>重要通知</span>
                  </div>
                  <div class="inform-content">
                    <ul>
                      <li v-for="(notification,index) in listNotification" :key="index">
                        <span v-text="notification.archiveTitle"></span>
                        <span v-text="notification.createDate"></span>
                      </li>
                      <!-- <li>
                        <span>tgttt</span>
                        <span>2020-07-07</span>
                      </li>
                      <li>
                        <span>手动蝶阀</span>
                        <span>2020-07-07</span>
                      </li>
                      <li>
                        <span>测试</span>
                        <span>2020-07-07</span>
                      </li>
                      <li>
                        <span>多大的</span>
                        <span>2020-07-07</span>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <!-- 日程 -->
          <div class="schedule">
            <div class="schedule-header">
              <span>年份:</span>
              <el-date-picker
                v-model="calendar"
                type="year"
                placeholder="选择年"
                size="mini"
                style="width:30%;margin-left:10px;margin-right:10px;"
              ></el-date-picker>
              <span>月份:</span>
              <el-date-picker
                v-model="calendar"
                type="month"
                placeholder="选择月"
                size="mini"
                style="width:30%;margin-left:10px;margin-right:10px;"
                format="M"
              ></el-date-picker>
            </div>
            <div class="schedule-content">
              <el-calendar v-model="calendar">
                <template slot="dateCell" slot-scope="{date, data}">
                  <div style="calendarTemplate" @click="clickDay(data)">
                    <div :class="isHaveData(date,data) ? 'is_day' : ''">{{ date.getDate()}}</div>
                  </div>
                </template>
              </el-calendar>
            </div>
            <div class="schedule-footer">
              <div class="dataEvent" v-for="item in list" :key="item.id">
                <div class="dataEvent1"></div>
                <div class="dataEvent2" v-text="getStr(item.startTime)" @click="showSchedule(item)"></div>
                <div class="dataEvent3" v-text="item.title"></div>
              </div>
            </div>
            <div class="schedule-icon" style="margin-bottom:10px">
              <span @click="addSchedule">
                <i class="el-icon-circle-plus-outline" style="font-size:30px"></i>
              </span>
            </div>
          </div>

          <!-- 常用工具 -->
          <div class="common-tools">
            <div class="common-tools-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>常用工具</span>
            </div>
            <div class="common-tools-content">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="box" @click="gotolink('/mdp/workflow/ru/task/TaskListAssigneeToMe')">
                    <img
                      src="../../../assets/image/portal-icon1.png"
                      alt="任务中心"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">任务中心</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div
                    class="box"
                    @click="gotolink('/mdp/workflow/ru/execution/ExecutionListMyMonitors')"
                  >
                    <img
                      src="../../../assets/image/portal-icon2.png"
                      alt="流程中心"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">流程中心</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/erp/pur/require/RequireMng')">
                    <img
                      src="../../../assets/image/portal-icon7.png"
                      alt="资产申请"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">资产申请</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/car/carRequire/CarRequire')">
                    <img
                      src="../../../assets/image/portal-icon4.png"
                      alt="用车申请"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">用车申请</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/crm/customer/CustomerIndex')">
                    <img
                      src="../../../assets/image/portal-icon5.png"
                      alt="客户首页"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">客户首页</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/rc/rcScheduleMy/RcScheduleMyMng')">
                    <img
                      src="../../../assets/image/portal-icon6.png"
                      alt="我的日程"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">我的日程</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/jx/MyAssessment')">
                    <img
                      src="../../../assets/image/portal-icon3.png"
                      alt="我的考核"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">我的考核</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="box" @click="gotolink('/oa/xm/xmProject/XmProjectMng')">
                    <img
                      src="../../../assets/image/portal-icon8.png"
                      alt="我的项目"
                      width="40px"
                      height="40px"
                    />
                    <div class="box-font">我的项目</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 预警提醒 -->
          <div class="remind">
            <div class="remind-header">
              <span class="el-icon-s-claim" style="margin-right:10px;margin-left:10px"></span>
              <span>预警提醒</span>
            </div>
            <div class="remind-content">
              <ul>
                <li class="remind-content-li">
                  <div class="li-box1">
                    <i class="el-icon-edit"></i>
                  </div>
                  <div class="li-box2">
                    <div style="font-weight: bold">微博</div>
                    <div class="li-box2-font">您有3个消息提醒</div>
                  </div>
                </li>
                <li class="remind-content-li">
                  <div class="li-box1">
                    <i class="el-icon-shopping-bag-1"></i>
                  </div>
                  <div class="li-box2">
                    <div style="font-weight: bold">客户</div>
                    <div class="li-box2-font">您有5个客户未联系</div>
                  </div>
                </li>
                <li class="remind-content-li">
                  <div class="li-box1">
                    <i class="el-icon-notebook-1"></i>
                  </div>
                  <div class="li-box2">
                    <div style="font-weight: bold">人脉</div>
                    <div class="li-box2-font">您有3个人脉未添加</div>
                  </div>
                </li>
                <li class="remind-content-li">
                  <div class="li-box1">
                    <i class="el-icon-orange"></i>
                  </div>
                  <div class="li-box2">
                    <div style="font-weight: bold">商机</div>
                    <div class="li-box2-font">您有2个商机未跟进</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--新增 RcSchedule rc_schedule界面-->
    <el-dialog
      title="新增日程"
      :visible.sync="addScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-add
        :rc-schedule="addScheduleForm"
        :visible="addScheduleVisible"
        @cancel="addScheduleVisible=false"
        @submit="afterAddSubmit"
      ></rc-schedule-add>
    </el-dialog>
    <!-- 查看日程 -->
    <el-dialog
      title="查看日程"
      :visible.sync="showScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-show
        :rc-schedule="showScheduleForm"
        :visible="showScheduleVisible"
        @cancel="showScheduleVisible=false"
        @edit="showEdit"
        @submit="aftershowSubmit"
      ></rc-schedule-show>
    </el-dialog>
    <!--编辑 RcSchedule rc_schedule界面-->
    <el-dialog
      title="编辑日程"
      :visible.sync="editScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-edit
        :rc-schedule="editScheduleForm"
        :visible="editScheduleVisible"
        @cancel="editScheduleVisible=false"
        @submit="afterEditSubmit"
      ></rc-schedule-edit>
    </el-dialog>
  </div>
</template>
<script>
import RcScheduleAdd from "@/views/oa/rc/rcSchedule/RcScheduleAdd"; //新增日程界面
import RcScheduleShow from "@/views/oa/rc/rcSchedule/RcScheduleShow"; //显示日程界面
import RcScheduleEdit from "@/views/oa/rc/rcSchedule/RcScheduleEdit"; //修改日程界面
import { listRcScheduleByMonth, listRcSchedule } from "@/api/oa/rc/rcSchedule";
import { listExecution } from "@/api/mdp/workflow/ru/execution";
import { listArchive } from "@/api/mdp/arc/archive";
import { mapGetters } from "vuex";
import util from "@/common/js/util"; // 全局公共库
const fromStartTime = new Date();
const toStartTime = new Date();
fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      dataList1: [
        require("../../../assets/image/daily_work2.png"),
        require("../../../assets/image/daily_work1.jpg"),
        require("../../../assets/image/daily_work4.png"),
        require("../../../assets/image/daily_work3.jpg"),
      ],
      dataList2: [
        require("../../../assets/image/daily_work1.jpg"),
        require("../../../assets/image/daily_work2.png"),
        require("../../../assets/image/daily_work3.jpg"),
        require("../../../assets/image/daily_work4.png")
      ],
      activeName: "IStarted",
      showHeader: false,
      value: "",
      calendar: new Date(),
      year: "",
      addScheduleForm: {},
      listSchedule: [],
      list: [],
      listNews:[],
      listNotification:[],
      addScheduleVisible: false,
      showScheduleVisible: false,
      editScheduleVisible: false,
      //addScheduleForm: {},与391重复
      showScheduleForm: {},
      editScheduleForm: {},
      day: "",
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["start_time_"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        count: true,
      },
      executions: [],
      startUserId: "", //我发起的
      partake: "", //我参与的
      sponsors: "", //我主办的
      monitors: "", //我监控的
      fromStartTime: "",
      toStartTime: "",
      load: {
        list: false,
      },
    };
  },
  watch: {
    calendar(newVal, oldVal) {
      let newMonth = util.formatDate(newVal, "yyyy-MM");
      let oldMonth = util.formatDate(oldVal, "yyyy-MM");
      if (newMonth != oldMonth) {
        this.getRcScheduleByMonth();
      }
    },
  },
  methods: {
    afterAddSubmit() {
      this.addScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    //根据月份获取获取日程
    getRcScheduleByMonth() {
      let params = {
        receiveUserid: this.userInfo.userid,
        branchId: this.userInfo.branchId,
        month: util.formatDate(this.calendar, "yyyy-MM"),
      };
      listRcScheduleByMonth(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.listSchedule = res.data.data;
          if (this.day != "") {
            this.clickDay(this.day);
          }
        }
      });
    },
    isHaveData(date, data) {
      for (let i = 0; i < this.listSchedule.length; i++) {
        let startStr = this.listSchedule[i].startTime.split(/\s+/)[0];
        let endStr = this.listSchedule[i].endTime.split(/\s+/)[0];
        let day = new Date(data.day).getTime();
        let startTime = new Date(startStr).getTime();
        let endTime = new Date(endStr).getTime();
        if (startTime <= day && day <= endTime) {
          return true;
        }
      }
      return false;
    },
    //点击日历
    clickDay(data) {
      this.list = [];
      for (let i = 0; i < this.listSchedule.length; i++) {
        let startStr = this.listSchedule[i].startTime.split(/\s+/)[0];
        let endStr = this.listSchedule[i].endTime.split(/\s+/)[0];
        let day = new Date(data.day).getTime();
        let startTime = new Date(startStr).getTime();
        let endTime = new Date(endStr).getTime();
        if (startTime <= day && day <= endTime) {
          this.list.push(this.listSchedule[i]);
        }
      }
      this.day = data;
    },
    //获取日程是上午开始还是下午开始
    getStr(date) {
      let times = date.split(/\s+/)[1].split(":");
      let hours = new Date(date).getHours();
      if (hours < 12) {
        return times[0] + ":" + times[1] + " " + "AM";
      } else {
        return times[0] + ":" + times[1] + " " + "PM";
      }
    },
    //显示日程
    showSchedule(item) {
      this.showScheduleForm = item;
      this.showScheduleVisible = true;
    },
    //显示编辑界面 RcSchedule rc_schedule
    showEdit: function () {
      this.editScheduleVisible = true;
      this.editScheduleForm = Object.assign({}, this.showScheduleForm);
    },
    afterEditSubmit() {
      this.editScheduleVisible = false;
      this.showScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    aftershowSubmit() {
      this.getRcScheduleByMonth();
      this.showScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    //新增日程
    addSchedule() {
      let s = new Date();
      s.setHours(0);
      s.setMinutes(0);
      s.setSeconds(0);
      s.setMilliseconds(0);
      let e = new Date(s.getTime() + 24 * 1000 * 3600 - 1000);
      this.addScheduleForm.receiveUserid = this.userInfo.userid;
      this.addScheduleForm.receiveUsername = this.userInfo.username;
      this.addScheduleForm.startTime =
        s.getFullYear() +
        "-" +
        (s.getMonth() + 1) +
        "-" +
        s.getDate() +
        " " +
        s.getHours() +
        ":" +
        s.getMinutes() +
        ":" +
        s.getSeconds();
      this.addScheduleForm.endTime =
        e.getFullYear() +
        "-" +
        (e.getMonth() + 1) +
        "-" +
        e.getDate() +
        " " +
        e.getHours() +
        ":" +
        e.getMinutes() +
        ":" +
        e.getSeconds();
      this.addScheduleVisible = true;
    },
    //路由跳转
    gotolink(link) {
      this.$router.replace(link);
    },
    //获取我发起的流程
    getExecutionListMyMonitors() {
      this.load.list = true;
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        fromStartTime:
          util.formatDate(fromStartTime, "yyyy-MM-dd") + " 00:00:00",
        toStartTime:
          util.formatDate(toStartTime, "yyyy-MM-dd") + " 23:59:59",
      };
      params.tenantId = this.userInfo.branchId;
      if (this.startUserId != "") {
        params.startUserId = this.startUserId;
      }
      if (this.partake != "") {
        params.partake = this.partake;
      }
      if (this.sponsors != "") {
        params.sponsors = this.sponsors;
      }
      if (this.monitors != "") {
        params.monitors = this.monitors;
      }
      listExecution(params)
        .then((res) => {
          this.load.list = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.executions = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
        })
        .catch(() => {
          this.load.list = false;
        });
    },
    handleClick(data) {
      //我发起的
      if (data.name == "IStarted") {
        this.startUserId = this.userInfo.userid;
        this.partake = "";
        this.sponsors = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我参与的
      if (data.name == "IParticipateIn") {
        this.partake = this.userInfo.userid;
        this.startUserId = "";
        this.sponsors = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我主办的
      if (data.name == "MyHost") {
        this.sponsors = "%" + this.userInfo.userid + "%";
        this.startUserId = "";
        this.partake = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我监控的
      if (data.name == "MyMonitor") {
        this.monitors = "%" + this.userInfo.userid + "%";
        this.startUserId = "";
        this.partake = "";
        this.sponsors = "";
        this.getExecutionListMyMonitors();
      }
    },
    //获取新闻
    getNews(){
      let orderBys = [];
      //降序
      orderBys.push("create_date" + " " + "desc");
      let params = {
        branchId:this.userInfo.branchId,
        status:"1", //发布
        archiveType:"0", //新闻
        pageSize: 2,
        pageNum: 1,
        orderBy: orderBys.join(","),
      }
      listArchive(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          this.listNews = res.data.data;
          //this.listNews.dataList =this.dataList1//可参考dailyOfficeWork.vue
          //this.listNews[1].dataList = this.dataList2
        }
      })
    },
    //重要通知
    getNotification(){
      let orderBys = [];
      //降序
      orderBys.push("create_date" + " " + "desc");
      let params = {
        branchId:this.userInfo.branchId,
        status:"1", //发布
        archiveType:"2", //通知
        pageSize: 5,
        pageNum: 1,
        orderBy: orderBys.join(","),
      }
      listArchive(params).then(res => {
        let tips = res.data.tips;
        if(tips.isOk){
          this.listNotification = res.data.data;
          console.log(this.listNotification);
        }
      })
    }
  },
  mounted() {
    this.getRcScheduleByMonth();
    this.startUserId = this.userInfo.userid;
    this.getExecutionListMyMonitors();
    this.getNews();
    this.getNotification();
  },
  components: {
    "rc-schedule-add": RcScheduleAdd,
    "rc-schedule-show": RcScheduleShow,
    "rc-schedule-edit": RcScheduleEdit,
  },
};
</script>
<style lang="scss" scoped>
* {
  list-style: none;
  color: #606266;
  font-size: 14px;
}

.personContainer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 15px;
  .left {
    .item {
      height: 200px;
      width: 100%;
      background: white;
      padding: 5px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .process-center {
      margin-top: 10px;
      background: white;
      .process-center-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .process-center-content {
        min-height: 350px;
        padding: 10px;
        font-size: 12px !important;
      }
    }
    .left-footer {
      margin-top: 10px;
      .news {
        background: white;
        .news-header {
          height: 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          align-content: center;
          border-bottom: 1px solid rgb(243, 243, 243);
        }
        .news-content {
          min-height: 280px;
          padding: 10px;
          .news-font {
            font-size: 12px;
            color: #606266;
            height: 120px;
            line-height: 24px;
          }
        }
      }
      .inform {
        background: white;
        .inform-header {
          height: 40px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          align-content: center;
          border-bottom: 1px solid rgb(243, 243, 243);
        }
        .inform-content {
          min-height: 280px;
          padding: 10px;
          ul {
            padding: 0px;
            margin: 0px;
          }
          li {
            padding: 0px 10px;
            list-style: none;
            display: flex;
            justify-content: space-between;
            color: #606266;

            height: 25px;
            line-height: 25px;
            span {
              font-size: 12px;
            }
          }
          li:hover {
            background: #2db7f5;
            color: #fff;
          }
          li:hover span {
            background: #2db7f5;
            color: #fff;
          }
        }
      }
    }
  }
  .right {
    .schedule {
      background: white;
      .schedule-header {
        padding-right: 10px;
        display: flex;
        justify-content: flex-end;
        align-content: center;
        align-items: center;
        border-bottom: 1px solid rgb(243, 243, 243);
        height: 40px;
      }
      .schedule-footer {
        max-height: 120px;
        overflow: auto;
        .dataEvent {
          height: 34px;
          line-height: 34px;
          padding: 5px;
          .dataEvent1 {
            line-height: 34px;
            width: 2px;
            height: 34px;
            float: left;
            background: #8997a5;
          }
          .dataEvent2 {
            line-height: 34px;
            width: 80px;
            height: 34px;
            float: left;
            margin-left: 5px;
            background: #f5f5f5;
            padding: 0px 5px;
          }
          .dataEvent3 {
            line-height: 34px;
            height: 34px;
            float: left;
            margin-left: 5px;
          }
        }
      }

      .schedule-footer::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #d1d1d1;
        -webkit-transition: background-color 0.3s ease-in-out;
        transition: background-color 0.3s ease-in-out;
      }
      .schedule-footer::-webkit-scrollbar-thumb {
        background-color: #d1d1d1;
        height: 50px;
        outline-offset: -1px;
        outline: 1px solid #fff;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        border-right: 1px solid #fff;
        border-left: 1px solid #fff;
        -webkit-transition: background-color 0.3s ease-in-out;
        transition: background-color 0.3s ease-in-out;
      }
      .schedule-footer::-webkit-scrollbar-track {
        background-color: #fff;
      }
      .schedule-icon {
        height: 34px;
        line-height: 34px;
        text-align: center;
        margin: 10px 0px;
      }
    }
    .common-tools {
      margin-top: 10px;
      background: white;
      .common-tools-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .common-tools-content {
        padding: 5px;
        .box {
          height: 80px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          font-size: 14px;
          color: #606266;
          .box-font {
            height: 24px;
            font-size: 12px;
            line-height: 24px;
          }
          .box-font:hover {
            color: white;
            cursor: pointer;
            font-size: 12px;
          }
        }
        .box:hover {
          background-color: rgba(99, 110, 114, 0.2);
        }
      }
    }
    .remind {
      background: white;
      margin-top: 10px;
      .remind-header {
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid rgb(243, 243, 243);
      }
      .remind-content {
        ul {
          padding: 0px;
          margin: 0px;
        }
        li {
          padding: 0px;
          margin: 0px;
        }
        .remind-content-li {
          font-size: 14px;
          color: #606266;
          display: flex;
          justify-content: flex-start;
          padding: 15px;
          align-items: center;
          align-content: center;
          border-bottom: 1px dashed #ddd;
          .li-box1 {
            margin-right: 20px;
          }
          .li-box2 {
            div {
              height: 20px;
              line-height: 20px;
              font-size: 12px;
            }
          }
          .li-box2 {
            .li-box2-font:hover {
              color: #74b9ff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style lang="scss">
.personContainer {
  .news-content {
    min-height: 350px;
    padding: 10px;
    .el-carousel__button {
      width: 10px !important;
    }
  }
  .schedule-content {
    font-size: 14px !important;
    color: #606266 !important;
    .calendarTemplate {
      height: 100%;
      width: 100%;
    }
    .el-calendar-day {
      height: 50px;
      padding: 0px;
      text-align: center;
      line-height: 50px;
    }
    .el-calendar-table tr td:first-child {
      border-left: 0px;
    }
    .el-calendar-table tr:first-child td {
      border-top: 0px;
    }
    .el-calendar-table td {
      border-bottom: 0px;
      border-right: 0px;
    }
    .is_day {
      background: #2196f3;
      color: white;
    }
  }
}
</style>
