<template>
  <section class="rc">
    <!-- <el-row :className="'sub-navbar'" style="background:#f9f9f9;">
			<el-row style="text-align:center;">
				<el-link :underline="false" style="float:left;padding-left:20px;font-size:16px;">所有日程</el-link>
				<el-col style="float:right;width:220px;">
					<el-button type="primary" @click="monthAdd(new Date())">新建日程</el-button>
					<el-button type="primary">导入日程</el-button>
				</el-col>
			</el-row>
		</el-row> -->
    <el-row class="page-container border padding">
      <div class="rc-bar">
        <el-radio-group v-model="radioDate" size="mini">
          <el-radio-button label="日"></el-radio-button>
          <el-radio-button label="周"></el-radio-button>
          <el-radio-button label="月"></el-radio-button>
        </el-radio-group>
        <el-button-group v-show="radioDate == '周'" style="float:right;">
          <el-button size="mini" @click="changeDay(-7,'week')">上一周</el-button>
          <el-button size="mini" @click="weekList.curr_day = new Date()">本周</el-button>
          <el-button size="mini" @click="changeDay(7,'week')">下一周</el-button>
        </el-button-group>
        <el-button-group v-show="radioDate == '日'" style="float:right;">
          <el-button size="mini" @click="changeDay(-1,'day')">上一天</el-button>
          <el-button size="mini" @click="dayList.curr_day = new Date()">今天</el-button>
          <el-button size="mini" @click="changeDay(1,'day')">下一天</el-button>
        </el-button-group>
      </div>
      <!-- <el-col :span="6" style="overflow-x: auto; height: 845px;">
				<dept-tree
					style="height: 480px;"
					show-root
					multiple="true"
					default-expand-all
					check-on-click-node="true"
					:expand-on-click-node="false"
					@node-click="handleLeftDeptNodeClick"
					@branch-row-click="branchRowClick"
				></dept-tree>
			</el-col> -->
      <el-col v-if="radioDate == '月'">
        <el-calendar :first-day-of-week=7 v-loading="listLoading">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <table></table>
          <template slot="dateCell" scope="{date, data}">
            <div style="height:100%;" @click.self="monthAdd(data.day)">
              <!--:class="data.isSelected ? 'is-selected' : ''">在html中 父元素的父元素class是current -->
              <div id="date">{{data.day.split('-')[2]}}</div>
              <div v-if="ishaveDate(data.day)">
                <div v-for="(item,i) in gethaveDate(data.day,true)" :key="i">
                  <div v-if="typeof(item.id) != 'undefined'" @click.stop="showShow(item)" :title="Alt(item)"
                    class="haveDate_Style" :style="setwd(item)">
                    {{getDateMark(item,false)}}
                    <span style="float:right;" v-if="item.show == 3">▶</span>
                  </div>
                  <div v-else style="width:100%;background:transparent;" class="haveDate_Style"
                    @click.stop="monthAdd(data.day)"></div>
                </div>
                <el-popover placement="top" style="display:block;min-width: 100%">
                  <div v-for="(item,i) in gethaveDate(data.day,false)" :key="i">
                    <div v-if="typeof(item.id) != 'undefined'" :id="item.id" @click.stop="showShow(item)"
                      :title="Alt(item)" class="haveDate_Style" :style="setwd(item)">
                      {{getDateMark(item,true)}}
                    </div>
                  </div>
                  <el-button slot="reference" v-show="getMarkNum(data.day) > 0"
                    style="width: 100%;padding: 0;display:block;text-align: center;text-decoration:underline;color:blue;"
                    type="text">另外{{getMarkNum(data.day)}}个</el-button>
                </el-popover>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-col>
      <el-col v-else-if="radioDate == '周'">
        <el-table :span-method="objectSpanMethod" :data="allday" border style="width:100%;">
          <el-table-column prop="time" width="80"></el-table-column>
          <el-table-column header-align="center" v-for="i in weekList.curr_weeks" :key="i.week" :label="i.week">
            <template slot-scope="scope">
              <div style="height:100%;padding-bottom:10px;" @click.self="weekAdd(scope,i.date)">
                <div v-if="scope.row.time == '全天' && week_have(scope,i.date,1)">
                  <div v-for="(item,j) in getWeekData(scope,i.date,1)" :key="j">
                    <div v-if="typeof(item.id) != 'undefined'" @click.stop="showShow(item)" :title="Alt(item)"
                      class="haveDate_Style" :style="setwd(item)">
                      {{getDateMark(item,false)}}
                      <span style="float:right;" v-if="item.show == 3">▶</span>
                    </div>
                    <div v-else style="width:100%;background:transparent;" class="haveDate_Style"
                      @click.stop="weekAdd(scope,i.date)"></div>
                  </div>
                </div>
                <div v-if="week_have(scope,i.date,0)">
                  <div v-for="(item,j) in getWeekData(scope,i.date,0)" :key="j">
                    <div @click.stop="showShow(item)" :title="Alt(item)" :style="styleWeek(item,scope,i.date,j)"
                      class="haveDate_Style">
                      {{getDateMark(item,false)}}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-else-if="radioDate == '日'">
        <el-table :span-method="objectSpanMethod" :data="allday" border style="width:100%;">
          <el-table-column prop="time" width="80"></el-table-column>
          <el-table-column header-align="center" :label="getDateWeek(dayList.curr_day)">
            <template slot-scope="scope">
              <div style="height:100%;padding-bottom:10px;" @click.self="weekAdd(scope,dayList.curr_day)">
                <div v-if="scope.row.time == '全天' && week_have(scope,dayList.curr_day,1)">
                  <div v-for="(item,j) in getWeekData(scope,dayList.curr_day,1)" :key="j">
                    <div v-if="typeof(item.id) != 'undefined'" @click.stop="showShow(item)" :title="Alt(item)"
                      class="haveDate_Style" :style="setwd(item)">
                      {{getDateMark(item,false)}}
                      <span style="float:right;" v-if="item.show != 4">▶</span>
                    </div>
                  </div>
                </div>
                <div v-if="week_have(scope,dayList.curr_day,0)">
                  <div v-for="(item,j) in getWeekData(scope,dayList.curr_day,0)" :key="j">
                    <div @click.stop="showShow(item)" :title="Alt(item)"
                      :style="styleWeek(item,scope,dayList.curr_day,j)" class="haveDate_Style">
                      {{getDateMark(item,false)}}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!--编辑 RcSchedule rc_schedule界面-->
      <el-dialog title="编辑日程" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-edit :rc-schedule="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
          @submit="afterEditSubmit"></rc-schedule-edit>
      </el-dialog>
      <!--新增 RcSchedule rc_schedule界面-->
      <el-dialog title="新增日程" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-add :rc-schedule="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
          @submit="afterAddSubmit"></rc-schedule-add>
      </el-dialog>
      <el-dialog title="查看日程" :visible.sync="showFormVisible" width="50%" :close-on-click-modal="false">
        <rc-schedule-show :rc-schedule="showForm" :visible="showFormVisible" @edit="showEdit"
          @cancel="showFormVisible=false" @submit="aftershowSubmit"></rc-schedule-show>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue"; //下拉框数据查询
  import {
    listRcSchedule,
    delRcSchedule,
    batchDelRcSchedule
  } from '@/api/oa/rc/rcSchedule';
  import RcScheduleAdd from '../rcSchedule/RcScheduleAdd'; //新增日程界面
  import RcScheduleEdit from '../rcSchedule/RcScheduleEdit'; //修改日程界面
  import RcScheduleShow from '../rcSchedule/RcScheduleShow'; //显示日程界面
  import {
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      week_currday() {
        return this.weekList.curr_day;
      },
    },
    watch: {
      //当前显示的周
      week_currday(val) {
        let s = new Date(val).getTime() - (new Date(val).getDay() * 24 * 3600 * 1000);
        const l = this.weekList.curr_weeks.length
        for (let i = 0; i < l; i++) {
          this.weekList.curr_weeks.shift();
        }
        for (let i = 0; i < 7; i++) {
          let d = new Date(s + i * 24 * 3600 * 1000);
          this.weekList.curr_weeks.push({
            date: d,
            week: this.getDateWeek(d),
          });
        }
      },
      radioDate(val) {
        if (val == "周") {
          this.weekList.curr_day = new Date();
          this.setWeekData();
        }
        if (val == "日") {
          this.weekList.curr_day = new Date();
          this.setWeekData();
        }
      },
    },
    data() {
      return {
        filters: {
          key: ''
        },
        rcSchedules: [], //查询结果
        pageInfo: { //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          count: false, //是否需要重新计算总记录数
          pageNum: 1, //当前页码、从1开始计算
          orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        },
        load: {
          list: false,
          edit: false,
          del: false,
          add: false,
          show: false
        }, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

        addFormVisible: false, //新增rcSchedule界面是否显示
        //新增rcSchedule界面初始化数据
        addForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: false,
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑rcSchedule界面初始化数据
        editForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: '',
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },

        showFormVisible: false, //显示界面是否显示
        //显示rcSchedule界面初始化数据
        showForm: {
          id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType: '',
          remindNowtime: '',
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          remindBeforestart_flag: false,
          remindBeforeend_flag: false,
          remind_flag: false,
        },
        /**begin 自定义属性请在下面加 请加备注**/
        listLoading: false,
        showAllVisible: false,
        radioDate: "月",
        allDates: new Map(),
        allday: [],
        weekDates: {
          all: new Map(),
          day: new Map(),
        },
        weekList: {
          curr_day: new Date(),
          curr_weeks: [],
        },
        dayDates: new Map(),
        dayList: {
          curr_day: new Date(),
          today: new Date(),
        },
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      //根据参数返回字符串
      // return X月X日(周X)今天
      getDateWeek(d) {
        const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const t = this.dayList.today;
        let str = d.getMonth() + 1 + "月" + d.getDate() + "日" + "(" + weeks[d.getDay()] + ")";
        if (d.getFullYear() == t.getFullYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate()) {
          str += "今天";
        }
        return str;
      },

      //根据参数，调整当前周
      //os为X天
      changeDay(os, type) {
        if (type == "week") {
          const d = this.weekList.curr_day;
          this.weekList.curr_day = new Date(d.getTime() + os * 24 * 60 * 60 * 1000);
        } else {
          const d = this.dayList.curr_day;
          this.dayList.curr_day = new Date(d.getTime() + os * 24 * 60 * 60 * 1000);
        }

      },
      //周表格合并
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex === 0) {
          return [1, 1];
        }
        if (columnIndex === 0) {
          if (rowIndex % 2 === 1) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },

      setWeekData() {
        let all = new Map();
        let day = new Map();
        for (let [yk, y] of this.allDates.entries())
          for (let [mk, m] of y.entries()) {
            for (let [dk, d] of m.entries()) {
              for (let r in d) {
                let rc = JSON.parse(JSON.stringify(d[r]));
                const len = this.getLen(rc.startTime, rc.endTime);
                if (len == 1) {
                  let rctime = new Date(rc.startTime);
                  rc.hour = (rctime.getHours() * 3600 + rctime.getMinutes() * 60 + rctime.getSeconds()) / 1800;
                  if (typeof(day.get(yk)) != "undefined") {
                    let yd = day.get(yk);
                    if (typeof(yd.get(mk)) != "undefined") {
                      let md = yd.get(mk);
                      if (typeof(md.get(dk)) != "undefined") {
                        md.get(dk).push(rc);
                      } else {
                        md.set(dk, new Array(rc));
                      }
                    } else {
                      yd.set(mk, new Map([
                        [dk, new Array(rc)]
                      ]));
                    }
                  } else {
                    day.set(yk,
                      new Map([
                        [mk, new Map([
                          [dk, new Array(rc)]
                        ])]
                      ])
                    );
                  }
                } else if (len > 1) {
                  if (typeof(all.get(yk)) != "undefined") {
                    let yd = all.get(yk);
                    if (typeof(yd.get(mk)) != "undefined") {
                      let md = yd.get(mk);
                      if (typeof(md.get(dk)) != "undefined") {
                        md.get(dk).push(rc);
                      } else {
                        md.set(dk, new Array(rc));
                      }
                    } else {
                      yd.set(mk, new Map([
                        [dk, new Array(rc)]
                      ]));
                    }
                  } else {
                    all.set(yk,
                      new Map([
                        [mk, new Map([
                          [dk, new Array(rc)]
                        ])]
                      ])
                    );
                  }
                }
              }
            }
          }
        this.weekDates.all = this.setSpace(this.setIndex(all));
        this.weekDates.day = day;
      },

      changeWeek(os) {
        const d = this.weekList.curr_day;
        this.weekList.curr_day = new Date(d.getTime() + os * 24 * 60 * 60 * 1000);
      },

      getWeekData(scope, i, long) {
        const d = new Date(i);
        if (long > 0) {
          let hd = this.weekDates.all.get(d.getFullYear()).get(d.getMonth() + 1).get(d.getDate());
          return hd;
        } else {
          let hd = this.weekDates.day.get(d.getFullYear()).get(d.getMonth() + 1).get(d.getDate());
          let i = [];
          let t = scope.row.time.split(":");
          for (let r in hd) {
            let idx = Math.floor(hd[r].hour + 1);
            if (scope.$index == idx) {
              i.push(hd[r]);
            }
          }
          return i;
        }
      },

      weekAdd(scope, i) {
        let t = scope.row.time.split(":");
        let s = new Date(i);
        if (scope.row.time == "全天") {
          this.monthAdd(s);
        } else {
          s.setHours(t[0]);
          s.setMinutes(t[1]);
          s.setSeconds(0);
          let e = new Date(s.getTime() + 30 * 60 * 1000);
          this.addForm.startTime = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + s.getHours() +
            ":" + s.getMinutes() + ":" + s.getSeconds();
          this.addForm.endTime = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + " " + e.getHours() +
            ":" + e.getMinutes() + ":" + e.getSeconds();
          this.showAdd();
        }
      },

      //本周本时间段是否存在
      //long为1则全天
      week_have(scope, i, long) {
        let s = new Date(i);
        let y = s.getFullYear();
        let m = s.getMonth() + 1;
        let d = s.getDate();
        if (long > 0) {
          let rc = this.weekDates.all;
          if (rc.get(y) && rc.get(y).get(m) && rc.get(y).get(m).get(d)) {
            return true;
          }
          return false;
        } else {
          let t = scope.row.time.split(":");
          s.setHours(parseInt(t[0]));
          s.setMinutes(parseInt(t[1]));
          s.setSeconds(0);
          let rc = this.weekDates.day;
          if (rc.get(y) && rc.get(y).get(m) && rc.get(y).get(m).get(d)) {
            let data = rc.get(y).get(m).get(d);
            for (let r in d) {
              let start = new Date(data[r].startTime);
              const a = start.getHours() * 60 + start.getMinutes();
              const b = parseInt(t[0]) * 60 + parseInt(t[1]);
              if (a - b >= 0 && a - b < 30) {
                return true;
              }
            }
          }
          return false;
        }
      },

      styleWeek(rc, scope, i, j) {
        let style = {};
        const len = 100 / (this.getWeekData(scope, i).length);
        const end = new Date(rc.endTime);
        const start = new Date(rc.startTime);
        style.width = len + "%";
        style.padding = "1px";
        style.margin = "0";
        style.height = (end - start) / (1000 * 60 * 30) * 24 + "px";
        style.background = rc.bg;
        style.position = "absolute";
        style.top = ((start.getMinutes()) % 30 / 30) * 100 + "%";
        style.left = len * j + "%";
        style["z-index"] = "1";
        return style;
      },

      monthAdd(time) {
        let s = new Date(time);
        s.setHours(0);
        s.setMinutes(0);
        s.setSeconds(0);
        s.setMilliseconds(0);
        let e = new Date(s.getTime() + 24 * 1000 * 3600 - 1000);
        this.addForm.startTime = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + s.getHours() +
          ":" + s.getMinutes() + ":" + s.getSeconds();
        this.addForm.endTime = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + " " + e.getHours() +
          ":" + e.getMinutes() + ":" + e.getSeconds();
        this.showAdd();
      },

      //div的title提示
      Alt(rc) {
        const st = new Date(rc.startTime);
        const et = new Date(rc.endTime);
        const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return "时间：" + (st.getMonth() + 1) + "月" + st.getDate() + "日" + "（" + weeks[st.getDay()] + "）" +
          (st.getHours() < 10 ? "0" + st.getHours() : st.getHours()) + ":" +
          (st.getMinutes() < 10 ? "0" + st.getMinutes() : st.getMinutes()) + " - " +
          (et.getMonth() + 1) + "月" + et.getDate() + "日" + "（" + weeks[et.getDay()] + "）" +
          (et.getHours() < 10 ? "0" + et.getHours() : et.getHours()) + ":" +
          (et.getMinutes() < 10 ? "0" + et.getMinutes() : et.getMinutes()) + "\n事件：" +
          rc.title;
      },

      isDefined(c) {
        return (typeof(c) != "undefined");
      },

      //当前月份的当天是否有日程
      ishaveDate(day) {
        const date = day.split('-');
        const y = parseInt(date[0]);
        const m = parseInt(date[1]);
        const d = parseInt(date[2]);
        if (this.allDates.get(y) && this.allDates.get(y).get(m) && this.allDates.get(y).get(m).get(d)) {
          return true;
        } else {
          return false;
        }
      },
      //获取当天日程
      gethaveDate(day, isall) {
        const d = day.split('-');
        const year = parseInt(d[0]);
        const month = parseInt(d[1]);
        const date = parseInt(d[2]);
        let hd = this.allDates.get(year).get(month).get(date);
        if (hd.length > 4 && isall) {
          hd = hd.slice(0, 4);
        }
        return hd;
      },
      //日程条内容
      getDateMark(rc, islist) {
        const d = new Date(rc.startTime);
        const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        const w = d.getDay();
        const len = new Date(rc.endTime).getDate() - new Date(rc.startTime).getDate() + 1;
        if (rc.show == 1 || islist) {
          //第一天
          return h + ":" + m + " " + rc.title;
        } else if (rc.show == 2) {
          //周日
          return "◀ " + rc.title;
        } else {
          if (this.radioDate == "日") {
            return "◀ " + rc.title;
          }
          return "";
        }
      },
      getMarkNum(day) {
        const d = day.split('-');
        return this.allDates.get(parseInt(d[0])).get(parseInt(d[1])).get(parseInt(d[2])).length - 4;
      },

      handleLeftDeptNodeClick(data, node, comp) {
        console.log(JSON.stringify(data));
        let dept = {
          deptid: data.deptid,
          deptName: data.deptName
        };
        this.filters.deptTreeNodes = this.filters.deptTreeNodes.filter(
          i => i.deptid != data.deptid
        );
        this.deptids = this.deptids.filter(i => i != data.deptid);
        this.filters.deptTreeNodes.push(dept);
        this.deptids.push(data.deptid);
      },
      branchRowClick: function(row, event, column) {},

      // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
      sortChange(obj) {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }
        if (obj.prop == 'xxx') {
          this.pageInfo.orderFields = ['xxx'];
          this.pageInfo.orderDirs = [dir];
        }
        this.getRcSchedules();
      },
      searchRcSchedules() {
        this.pageInfo.count = true;
        this.getRcSchedules();
      },
      //获取列表 RcSchedule rc_schedule
      getRcSchedules() {
        let params = {};
        this.load.list = true;
        params.status = "0";
        listRcSchedule(params).then((res) => {
          var tips = res.statusText == "OK";
          if (tips) {
            this.rcSchedules = res.data.data;
            //设置月
            let dates = new Map();
            for (let i in this.rcSchedules) {
              let rc = this.rcSchedules[i];
              let len = this.getLen(rc.startTime, rc.endTime);
              rc.bg = "rgb(" + Math.round(Math.random() * 155 + 50) + "," + Math.round(Math.random() * 155 + 50) +
                "," + Math.round(Math.random() * 155 + 50) + ")";
              for (let j = 0; j < len; j++) {
                let r = JSON.parse(JSON.stringify(rc));
                let s = new Date(r.startTime);
                s.setDate(s.getDate() + j);
                let year = s.getFullYear(); //n
                let month = s.getMonth() + 1;
                let date = s.getDate();
                //日程第一天
                if (j == 0) r.show = 1;
                //跨天周日
                else if ((new Date(rc.startTime).getDay() + j) % 7 == 0) r.show = 2;
                //跨天周六
                else if ((new Date(rc.startTime).getDay() + j) % 7 == 6 && j != len - 1) r.show = 3;
                //跨天最后一天
                else if (len > 1 && j == len - 1) r.show = 4;

                if (typeof(dates.get(year)) != "undefined") {
                  let ydates = dates.get(year);
                  if (typeof(ydates.get(month)) != "undefined") {
                    let m = ydates.get(month);
                    if (typeof(m.get(date)) != "undefined") {
                      m.get(date).push(r);
                    } else {
                      m.set(date, new Array(r));
                    }
                  } else {
                    ydates.set(month,
                      new Map([
                        [date, new Array(r)]
                      ])
                    );
                  }
                } else {
                  dates.set(year,
                    new Map([
                      [month, new Map([
                        [date, new Array(r)]
                      ])]
                    ])
                  );
                }
                // 对每天的日程根据时间进行排序
                dates.get(year).get(month).get(date).sort(function(a, b) {
                  const at = new Date(a.startTime);
                  const bt = new Date(b.startTime);
                  const as = at.getHours() * 3600 + at.getMinutes() * 60 + at.getSeconds();
                  const bs = bt.getHours() * 3600 + bt.getMinutes() * 60 + bt.getSeconds();
                  return bs > as ? -1 : 1;
                });
                // 排序结束
              }
            }
            //设置日程索引值
            this.allDates = this.setSpace(this.setIndex(dates));
            this.setWeekData();
            //月份设置完成
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.load.list = false;
        }).catch(err => this.load.list = false);
      },
      setIndex(dates) {
        for (let i in this.rcSchedules) {
          let rc = this.rcSchedules[i];
          let len = this.getLen(rc.startTime, rc.endTime);
          for (let j = 0, idx = -1; j < len; j++) {
            let s = new Date(rc.startTime);
            s.setDate(s.getDate() + j);
            let year = s.getFullYear();
            let month = s.getMonth() + 1;
            let date = s.getDate();
            let data = dates.get(year).get(month).get(date);
            if (typeof(dates.get(year).get(month).get(date)) == "undefined") {
              break;
            }
            const index = data.findIndex(obj => obj.id == rc.id);
            if (index == -1) {
              break;
            }
            if (len > 1) {
              if (j == 0) {
                if (index != 0) {
                  if (data[index - 1].idx == -1 || typeof(data[index - 1].idx) == "undefined") {
                    idx = index;
                  } else {
                    idx = data[index - 1].idx + 1;
                  }
                } else {
                  idx = index;
                }
              } else if ((s.getDay()) % 7 == 0) {
                idx = data.findIndex(obj => obj.id == rc.id);
              }
            }
            data[index].idx = idx;
          }
        }
        return dates;
      },
      setSpace(dates) {
        for (let y of dates.values()) {
          for (let m of y.values()) {
            for (let d of m.values()) {
              let max_idx = 0;
              for (let r in d) {
                let len = this.getLen(d[r].startTime, d[r].endTime);
                if (len == 1) {
                  for (let i = 0; i < d.length; i++) {
                    if (d.findIndex(obj => obj.idx == i) == -1) {
                      d[r].idx = i;
                      break;
                    }
                  }
                }
                max_idx = max_idx > d[r].idx ? max_idx : d[r].idx;
              }
              d.sort(function(a, b) {
                return a.idx < b.idx ? -1 : 1;
              });
              if (max_idx > (d.length - 1)) {
                let len = d.length;
                for (let i = 0; i < len; i++) {
                  if (d.findIndex(obj => obj.idx == i) == -1) {
                    d.splice(i, 0, "");
                    len++;
                  }
                }
              }
            }
          }
        }
        return dates;
      },

      //显示编辑界面 RcSchedule rc_schedule
      showEdit: function() {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, this.showForm);
      },
      //显示新增界面 RcSchedule rc_schedule
      showAdd: function(time) {
        this.addFormVisible = true;
        this.addForm.rcType = "工作安排";
        this.addForm.urgent = "重要";
        this.addForm.receiveUsername = this.userInfo.username;
        this.addForm.receiveUserid = this.userInfo.userid;
        this.addForm = Object.assign({}, this.addForm);
      },
      showShow: function(rc) {
        this.showFormVisible = true;
        this.showForm = Object.assign({}, rc);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getRcSchedules();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.showFormVisible = false;
        this.getRcSchedules();
      },
      aftershowSubmit() {
        this.showFormVisible = false;
        this.getRcSchedules();
      },
      /**begin 自定义函数请在下面加**/
      //日程条的css
      setwd(rc) {
        let style = {
          width: "100%"
        };
        if (typeof(rc) == "string") {
          style.background = "transparent";
        } else {
          style.background = rc.bg;
        }
        return style;
      },
      getLen(start, end) {
        const s = new Date(start);
        const sy = s.getFullYear();
        const sm = s.getMonth();
        const sd = s.getDate();
        const e = new Date(end);
        const ey = e.getFullYear();
        const em = e.getMonth();
        const ed = e.getDate();
        let len = (new Date(ey, em, ed) - new Date(sy, sm, sd)) / (24 * 3600 * 1000) + 1;
        return len;
      },
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'rc-schedule-add': RcScheduleAdd,
      'rc-schedule-edit': RcScheduleEdit,
      'rc-schedule-show': RcScheduleShow,

      'dept-tree': DeptTree,
      //在下面添加其它组件
    },
    mounted() {
      this.allday.push({
        time: "全天"
      });
      for (let i = 0; i < 24; i++) {
        this.allday.push({
          time: (i < 10 ? "0" + i : i) + ":00"
        }, {
          time: (i < 10 ? "0" + i : i) + ":30"
        });
      }
      this.$nextTick(() => {
        this.getRcSchedules();
      });
    },
  }
</script>

<style>
  .rc .sub-navbar {
    background: #f9f9f9;
  }

  .rc .is-selected {
    background-color: transparent !important;
  }

  .rc-bar {
    height: 50px;
    border: 1px solid #EBEEF5;
    padding: 11px;
  }

  .rc .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
  }

  .rc .el-table__row td {
    height: 24px;
    padding: 0;
  }

  .rc .el-table__row td:not(:first-child) {
    vertical-align: top;
  }

  .rc .el-table__row td .cell {
    padding: 0 !important;
  }

  .rc .el-table__row td[rowspan="2"] .cell {
    text-align: center;
  }

  .rc .el-calendar-table {
    height: 845px;
  }

  .rc .el-calendar__body {
    padding: 0 !important;
  }

  .rc .el-table__body tr:first-child td:first-child {
    text-align: center;
  }

  .rc .el-calendar-table thead th:first-child {
    border-left: 1px solid #EBEEF5;
  }

  .rc .el-calendar-table thead th {
    border-right: 1px solid #EBEEF5;
  }

  .rc .el-calendar-table__row {
    height: 16.667%;
  }

  .rc .el-calendar-day {
    padding: 0 !important;
    height: 100% !important;
    /* min-height: 130px; */
  }

  .rc .is-today {
    background: #ffb;
    color: #000 !important;
  }

  .haveDate_Style {
    padding: 0 2px;
    margin: 2px 0;
    background: skyblue;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    color: #fff;
    height: 16px;
    line-height: 16px;
  }

  .rc .el-dialog__body {
    padding-top: 0 !important;
    padding-bottom: 20px !important;
  }

  .rc .btn-bar .el-form-item__content {
    margin-left: 0 !important;
    text-align: center;
  }

  .rc input[type="number"] {
    padding-left: 5px;
    padding-right: 0;
    width: 48px;
  }
</style>
