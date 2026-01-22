<template>
  <section class="page-container border padding">
    <el-row class="page-header">
      <!-- <el-radio-group v-model="selectDay" @change="showTime" size="medium">
				<el-radio-button label="0">日</el-radio-button>
				<el-radio-button label="1">周</el-radio-button>
				<el-radio-button label="2">月</el-radio-button>
			</el-radio-group> -->
      <el-input v-model="filters.key" style="width: 270px;" placeholder="会议名称 模糊查询" clearable
                @clear="handleClear" @keyup.enter.native="searchOnEnter"></el-input>
      <el-button type="primary" style="margin-right: 13px;" icon="el-icon-search" v-loading="load.list"
                 :disabled="load.list==true"
                 v-on:click="searchMeetMeetings">查询
      </el-button>
      <el-button @click="showAdd" icon="el-icon-plus" style="margin-left: 0;margin-right: 13px;">添加会议</el-button>
      <el-button type="danger" style="margin-left: 0;" v-loading="load.del" @click="batchDel"
                 :disabled="this.sels.length===0 || load.del==true"
                 icon="el-icon-delete">批量删除
      </el-button>
    </el-row>
    <el-row class="page-main padding-top">
      <el-row>
        <!-- <el-date-picker v-if="selectDay == '0'"
					v-model="dateTime"
					type="date"
					placeholder="选择日期">
				</el-date-picker> -->
        <!-- <el-date-picker v-if="selectDay == '1'"
					v-model="dateWeek"
					type="week"
					format="yyyy 第 WW 周"
					placeholder="选择周">
				</el-date-picker> -->
        <!-- <el-date-picker v-if="selectDay == '2'"
					v-model="dateMonth"
					type="month"
					placeholder="选择月">
				</el-date-picker> -->
      </el-row>
      <el-row class="showMeeting">
        <!-- :cell-style="set_cell_style"
					{{scope.row['A' + value.getDate()].length}}
					prop="meetings[key + 1].roomMeetings"
				-->
        <!-- <el-table
					border
					:data="meetingsData"
					style="width: 100%">
						<el-table-column
							prop="roomName"
							label="会议室名称"
							min-width="100">
						</el-table-column>
						<el-table-column v-for="(value,index) in timeArr" :key="index"
							:prop="'A' + index"
							:label="getShowHead(value)"
							min-width="50">
							<template slot-scope="scope">
								<div style="width:100%;margin:0;padding:0;height:50px;"  @click="cellClick(timeArr[index],scope.row)">
									<el-popover
										placement="top-start"
										title=""
										width="300"
										trigger="hover">
										<el-row  class="meeting-row" v-for="(item,index) in scope.row['A' + index]" :key="index">
											<el-row>
												<el-col :span="8">会议状态</el-col>
												<el-col :span="16">
													<el-tag v-if="item.status == 0" type="primary">待审批</el-tag>
													<el-tag v-if="item.status == 1" type="primary">审批中</el-tag>
													<el-tag v-if="item.status == 2" type="primary">已批准</el-tag>
													<el-tag v-if="item.status == 3" type="damager">已拒绝</el-tag>
													<el-tag v-if="item.status == 4" type="primary">已开始</el-tag>
													<el-tag v-if="item.status == 5" type="damager">已结束</el-tag>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="8">会议主题</el-col>
												<el-col :span="16"><el-tag>{{item.name}}</el-tag></el-col>
											</el-row>
											<el-row>
												<el-col :span="8">申请人</el-col>
												<el-col :span="16"><el-tag>{{item.requireUsername}}</el-tag></el-col>
											</el-row>
											<el-row>
												<el-col :span="8">开始时间</el-col>
												<el-col :span="16"><el-tag>{{item.startTime}}</el-tag></el-col>
											</el-row>
											<el-row>
												<el-col :span="8">结束</el-col>
												<el-col :span="16"><el-tag>{{item.endTime}}</el-tag></el-col>
											</el-row>
											<br/>
										</el-row>
										<a class="meeting_a" slot="reference" v-if="scope.row['A' + index] != null && scope.row['A' + index].length > 1">{{scope.row['A' + index].length}}</a>
										<a class="meeting_a" slot="reference" v-else-if="scope.row['A' + index] != null"></a>
									</el-popover>
								</div>
							</template>
						</el-table-column>
				</el-table> -->
      </el-row>
      <el-row>
        <!--列表 MeetMeeting meet_meeting-->
        <el-table :height="tableHeight" ref="procdefsTable" :data="meetMeetings" @sort-change="sortChange"
                  highlight-current-row v-loading="load.list" border @selection-change="selsChange"
                  @row-click="rowClick"
                  style="width: 100%;">
          <el-table-column sortable type="selection" width="40"></el-table-column>
          <el-table-column sortable type="index" width="40"></el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="会议名称" min-width="80"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="申请时间" min-width="80"></el-table-column>
          <el-table-column prop="customRoomName" show-overflow-tooltip label="自定义会议室"
                           min-width="80"></el-table-column>
          <el-table-column prop="categoryName" show-overflow-tooltip label="会议分类" min-width="80"></el-table-column>
          <el-table-column prop="roomName" show-overflow-tooltip label="会议室名称" min-width="80"></el-table-column>
          <el-table-column prop="startTime" show-overflow-tooltip label="开始时间" min-width="80"></el-table-column>
          <el-table-column prop="endTime" show-overflow-tooltip label="结束时间" min-width="80"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 0" type="primary">待审批</el-tag>
              <el-tag v-if="scope.row.status == 1" type="primary">审批中</el-tag>
              <el-tag v-if="scope.row.status == 2" type="primary">已批准</el-tag>
              <el-tag v-if="scope.row.status == 3" type="damager">已拒绝</el-tag>
              <el-tag v-if="scope.row.status == 4" type="primary">已开始</el-tag>
              <el-tag v-if="scope.row.status == 5" type="damager">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
              <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]"
                       :current-page="pageInfo.pageNum"
                       :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
      </el-row>

      <!--编辑 MeetMeeting meet_meeting界面-->
      <el-dialog title="编辑申请" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
        <meet-meeting-edit :meet-meeting="editForm" :visible="editFormVisible" @cancel="editFormVisible=false"
                           @submit="afterEditSubmit"></meet-meeting-edit>
      </el-dialog>

      <!--新增 MeetMeeting meet_meeting界面-->
      <el-dialog title="新建申请" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
        <meet-meeting-add :meet-meeting="addForm" :visible="addFormVisible" @cancel="addFormVisible=false"
                          @submit="afterAddSubmit"></meet-meeting-add>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util'; //全局公共库
import dateUtil from '@/common/js/dateUtil'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import {
  getMeetMeetingsByTime,
  listMeetMeeting,
  delMeetMeeting,
  batchDelMeetMeeting
} from '@/api/oa/meet/meetMeeting';
import MeetMeetingAdd from './MeetMeetingRequire'; //新增界面
import MeetMeetingEdit from './MeetMeetingEdit'; //修改界面
import {
  mapGetters
} from 'vuex'

import {
  listMeetBoardroom
} from '@/api/oa/meet/meetBoardroom';

export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
  },
  watch: {
    'dateTime': function () {
      this.getMeetMeetingsByTime()
    },
    'dateWeek': function (dateWeek) {
      this.dateWeek = dateWeek
      //console.log(this.dateWeek.getTime())
      this.getMeetMeetingsByTime()
    },
    'dateMonth': function (dateMonth) {
      //console.log(dateMonth)
      this.getMeetMeetingsByTime()
    }
  },
  data() {
    return {
      filters: {
        key: ''
      },
      meetMeetings: [], //查询结果
      pageInfo: { //分页数据
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

      addFormVisible: false, //新增meetMeeting界面是否显示
      //新增meetMeeting界面初始化数据
      addForm: {
        id: '',
        name: '',
        categoryId: '',
        categoryName: '',
        requireUserid: '',
        requireUsername: '',
        roomId: '',
        roomName: '',
        customRoomName: '',
        startTime: '',
        endTime: '',
        reminders: '',
        remindersImmediate: '',
        remindersBeforeStart: '',
        remindersBeforeEnd: '',
        otherAttender: '',
        attenderNum: '',
        customerNum: '',
        isUsingReturn: '',
        isUsingSingin: '',
        singinMode: '',
        singinUserid: '',
        singinUsername: '',
        singinWifi: '',
        branchId: '',
        deptId: '',
        deptName: '',
        requireRemark: '',
        startRemark: '',
        createTime: '',
        status: '',
        approveSuggestion: ''
      },
      editFormVisible: false, //编辑界面是否显示
      //编辑meetMeeting界面初始化数据
      editForm: {
        id: '',
        name: '',
        categoryId: '',
        categoryName: '',
        requireUserid: '',
        requireUsername: '',
        roomId: '',
        roomName: '',
        customRoomName: '',
        startTime: '',
        endTime: '',
        reminders: '',
        remindersImmediate: '',
        remindersBeforeStart: '',
        remindersBeforeEnd: '',
        otherAttender: '',
        attenderNum: '',
        customerNum: '',
        isUsingReturn: '',
        isUsingSingin: '',
        singinMode: '',
        singinUserid: '',
        singinUsername: '',
        singinWifi: '',
        branchId: '',
        deptId: '',
        deptName: '',
        requireRemark: '',
        startRemark: '',
        createTime: '',
        status: '',
        approveSuggestion: ''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      selectDay: '0',
      timeArr: [],
      meets: [],
      meetingsData: [],
      meetBoardrooms: [],
      meetingsDataRooms: [],
      tempMeetingsData: [{
        roomName: "广州总部",
        A1: [1, 2],
        A2: [1, 2, 3, 4],
      }],
      dateTime: new Date(),
      dateWeek: '',
      dateMonth: '',
      tableHeight: 300
      /**end 自定义属性请在上面加 请加备注**/
    }
  }, //end data
  methods: {
    handleClear() {
      this.searchMeetMeetings();
    },
    searchOnEnter() {
      this.searchMeetMeetings();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getMeetMeetings();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getMeetMeetings();
    },
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
      this.getMeetMeetings();
    },
    searchMeetMeetings() {
      this.pageInfo.count = true;
      this.getMeetMeetings();
    },
    //获取列表 MeetMeeting meet_meeting
    getMeetMeetings() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        branchId: this.userInfo.branchId,
        orderBy: "exec_calc_date desc",
        requireUserid: this.userInfo.userid,
      };
      // if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
      // 	let orderBys=[];
      // 	for(var i=0;i<this.pageInfo.orderFields.length;i++){
      // 		orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
      // 	}
      // 	params.orderBy= orderBys.join(",")
      // }
      if (this.filters.key !== "") {
        params.key = this.filters.key
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      listMeetMeeting(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.data.total;
          this.pageInfo.count = false;
          this.meetMeetings = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
        this.load.list = false;
      }).catch(err => this.load.list = false);
    },

    // getMeetMeetingsByTime() {
    // 	let params = {
    // 		branchId : this.userInfo.branchId,
    // 		startTime: null,
    // 		endTime: null,
    // 	};
    // 	if( this.selectDay == '0' ){
    // 		this.getHours()
    // 		let date = new Date(this.dateTime);
    // 		params.startTime = new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime()
    // 		params.endTime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59).getTime()
    // 	}else if( this.selectDay == '1' ){
    // 		this.getWeeks()
    // 		params.startTime = new Date(this.timeArr[0].getFullYear(),this.timeArr[0].getMonth(),this.timeArr[0].getDate()).getTime()
    // 		params.endTime = new Date(this.timeArr[6].getFullYear(),this.timeArr[6].getMonth(),this.timeArr[6].getDate(),23,59,59).getTime()
    // 	}else{
    // 		this.getDays()
    // 		params.startTime = new Date(this.timeArr[0].getFullYear(),this.timeArr[0].getMonth(),this.timeArr[0].getDate()).getTime()
    // 		params.endTime = new Date(this.timeArr[this.timeArr.length -  1].getFullYear(),this.timeArr[this.timeArr.length -  1].getMonth(),this.timeArr[this.timeArr.length -  1].getDate(),23,59,59).getTime()
    // 	}
    // 	getMeetMeetingsByTime(params).then((res) => {
    // 		var tips=res.data.tips;
    // 		this.meets = []
    // 		if(tips.isOk){
    // 			this.meets = res.data.data;
    // 			this.meetingsData = JSON.parse(JSON.stringify(this.meetingsDataRooms));
    // 			this.filterMeetings()
    // 		}else{
    // 			this.$message({ message: tips.msg, type: 'error' });
    // 		}
    // 	}).catch((err) => { this.getMeetMeetingsByTime() });
    // },
    filterMeetings() {
      if (this.meets != null && this.meets.length) {
        if (this.meetingsData != null && this.meets.length > 0) {
          // this.meets.forEach((meeting)=>{
          // 	this.meetingsData.forEach((item)=>{
          // 		console.log(item)
          // 		let arr = []
          // 		if(item.roomId = meeting.roomId){
          // 			arr.push(meeting)
          // 		}
          // 	})
          // })
          for (let l = 0; l < this.meetingsData.length; l++) {

            for (let index = 0; index < this.meets.length; index++) {
              const element = this.meets[index];

              if (this.meetingsData[l].roomId == element.roomId) {

                let startTime = new Date(element.startTime)
                let endTime = new Date(element.endTime)
                if (this.selectDay == '0') {
                  let startDay = startTime.getDate()
                  let endDay = endTime.getDate()


                  let start = startTime.getHours()
                  let end = endTime.getHours()
                  if (startDay == endDay) {
                    for (let index = start; index <= end; index++) {
                      if (this.meetingsData[l]['A' + index] != null && this.meetingsData['A' + start] != '') {
                        this.meetingsData[l]['A' + index].push(element)
                      } else {
                        this.meetingsData[l]['A' + index] = []
                        this.meetingsData[l]['A' + index].push(element)
                      }
                    }
                  } else {
                    for (let index = start; index <= 23; index++) {
                      if (this.meetingsData[l]['A' + index] != null && this.meetingsData['A' + start] != '') {
                        this.meetingsData[l]['A' + index].push(element)
                      } else {
                        this.meetingsData[l]['A' + index] = []
                        this.meetingsData[l]['A' + index].push(element)
                      }
                    }
                  }

                } else if (this.selectDay == '1') {
                  let start = startTime.getDay()
                  let end = endTime.getDay()
                  for (let index = start; index <= end; index++) {
                    if (this.meetingsData[l]['A' + index] != null && this.meetingsData['A' + start] != '') {
                      this.meetingsData[l]['A' + index].push(element)
                    } else {
                      this.meetingsData[l]['A' + index] = []
                      this.meetingsData[l]['A' + index].push(element)
                    }
                  }
                } else {
                  let start = startTime.getDate() - 1
                  let end = endTime.getDate() - 1
                  for (let index = start; index <= end; index++) {
                    if (this.meetingsData[l]['A' + index] != null && this.meetingsData['A' + start] != '') {
                      this.meetingsData[l]['A' + index].push(element)
                    } else {
                      this.meetingsData[l]['A' + index] = []
                      this.meetingsData[l]['A' + index].push(element)
                    }
                  }
                }
              }
            }
          }
          // console.log("meetingsData------------------------")
          // console.log(this.meetingsData)
        }
      }
    },
    //显示编辑界面 MeetMeeting meet_meeting
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 MeetMeeting meet_meeting
    showAdd: function () {
      this.addFormVisible = true;
      this.addForm = Object.assign({}, this.addForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getMeetMeetings();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getMeetMeetings();
    },
    //选择行meetMeeting
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除meetMeeting
    handleDel: function (row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        let params = {
          id: row.id,
          requireUserid: this.userInfo.userid,
        }
        console.log(params)
        delMeetMeeting(params).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getMeetMeetings();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    //批量删除meetMeeting
    batchDel: function () {

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.del = true;
        var delArr = []
        this.sels.forEach((item) => {
          const i = {
            id: item.id,
            requireUserid: item.requireUserid
          }
          delArr.push(i)
        })

        console.log(delArr)

        // aa:[]

        batchDelMeetMeeting(delArr).then((res) => {
          this.load.del = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.count = true;
            this.getMeetMeetings();
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.del = false);
      });
    },
    rowClick: function (row, event, column) {
      this.$emit('row-click', row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    cellClick(value, row) {
      // console.log(value.getHours())
      // console.log(value.getTime())
      // console.log(row)
      this.addForm.roomId = row.roomId
      this.addForm.roomName = row.roomName
      if (this.selectDay == '0') {
        let startDate = new Date(value.getFullYear(), value.getMonth() - 1, value.getDate(), value.getHours(), 0, 0)
        let endDate = new Date(value.getFullYear(), value.getMonth() - 1, value.getDate(), value.getHours(), 59, 59)
        this.addForm.startTime = startDate.getTime()
        this.addForm.endTime = endDate.getTime()
        this.showAdd()
      } else {
        let startDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0)
        let endDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59)
        this.addForm.startTime = startDate.getTime()
        this.addForm.endTime = endDate.getTime()
        this.showAdd()
      }
    },
    getDays() {
      let date;
      if (this.dateMonth != '' && this.dateMonth != null) {
        date = new Date(this.dateMonth.getTime());
      } else {
        date = new Date();
      }
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let lastDay = new Date(year, month, 0).getDate();
      let num = 0;
      this.timeArr = []

      for (let i = 1; i <= lastDay; i++) {
        let dateStr = year + "-" + (month < 10 ? "0" + month : month);
        if (i < 10) {
          dateStr += "-0" + i;
        } else {
          dateStr += "-" + i;
        }
        this.timeArr.push(new Date(dateStr))
      }
      //console.log(this.timeArr)
    },
    getWeeks() {
      let date;
      if (this.dateWeek != '' && this.dateWeek != null) {
        date = new Date(this.dateWeek.getTime());
      } else {
        date = new Date();
      }

      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let today = date.getDay()
      let num = 0;
      this.timeArr = []
      for (let i = 0; i <= today; i++) {
        let newDate = new Date().setTime(date.getTime() - (3600 * 1000 * 24 * (today - i)))
        this.timeArr.push(new Date(newDate))
      }
      for (let i = today + 1; i <= 6; i++) {
        let newDate = new Date().setTime(date.getTime() + (3600 * 1000 * 24 * (i - today)))
        this.timeArr.push(new Date(newDate))
      }
      //console.log(this.timeArr)
    },
    getHours() {
      let date;
      if (this.dateTime != '' && this.dateTime != null) {
        date = new Date(this.dateTime.getTime());
      } else {
        date = new Date();
      }
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let today = date.getDate()
      let num = 0;
      this.timeArr = []

      for (let i = 0; i <= 23; i++) {
        let dateStr = year + "-" + (month < 10 ? "0" + month : month);
        if (today < 10) {
          dateStr += "-0" + i;
        } else {
          dateStr += "-" + i;
        }
        this.timeArr.push(new Date(year, month, today, i))
      }
      //console.log(this.timeArr)
    },
    getShowHead(value) {
      switch (this.selectDay) {
        case '0':
          return value.getHours() + ''
          break;
        case '1':
          if (value.getDay() == '') {
            return '周日' + '(' + dateUtil.formatDate(value) + ')'
          } else if (value.getDay() == '6') {
            return '周六' + '(' + dateUtil.formatDate(value) + ')'
          } else {
            return '周' + value.getDay() + '(' + dateUtil.formatDate(value) + ')'
          }
          break;
        case '2':
          return value.getDate() + ''
          break;
        default:
          break;
      }
    },
    showTime(value) {
      switch (value) {
        case '0':
          this.getHours()
          this.getMeetMeetingsByTime();
          break;
        case '1':
          this.getMeetMeetingsByTime();
          break;
        case '2':
          this.getDays()
          this.getMeetMeetingsByTime();
          break;
        default:
          break;
      }
    },
    set_cell_style({
                     row,
                     column,
                     rowIndex,
                     columnIndex
                   }) {
      // console.log(row)
      // console.log(column)
      // console.log(rowIndex)
      // console.log(columnIndex)

      // 阻断不为0
      if (column.label === '阻断') {
        let value = 0
        // smell.BLOCKER
        let prop = column.property.split('.')
        if (prop.length === 2) {
          value = row[prop[0]][prop[1]]
        } else {
          value = row[prop[0]]
        }
        return value !== 0 ? 'color:red' : ''
      } else if (column.label === 'UT通过率') {
        let cell_value = row[column.property]
        if (cell_value !== '100.0' && cell_value !== 0) {
          return 'color:red'
        }
        return ''
      } else {
        return ''
      }
    },
    //获取列表 MeetBoardroom meet_boardroom
    getMeetBoardrooms() {
      let params = {
        branchId: this.userInfo.branchId
      };
      this.meetingsDataRooms = []
      listMeetBoardroom(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.meetBoardrooms = res.data.data;

          if (this.meetBoardrooms != null && this.meetBoardrooms.length > 0) {
            this.meetBoardrooms.forEach((meetBoardroom) => {
              const meetBoardroomNew = {
                roomId: meetBoardroom.id,
                roomName: meetBoardroom.name,
              }
              this.meetingsDataRooms.push(meetBoardroomNew)
            })
          }

        } else {
          this.$message({
            message: tips.msg,
            type: 'error'
          });
        }
      }).catch();
    },
    showCellMeetings(value) {

    }

    /**end 自定义函数请在上面加**/

  }, //end methods
  components: {
    'meet-meeting-add': MeetMeetingAdd,
    'meet-meeting-edit': MeetMeetingEdit,

    //在下面添加其它组件
  },
  created() {
    this.getHours()
    this.getMeetBoardrooms();
  },
  mounted() {
    this.$nextTick(() => {
      this.getMeetMeetings();
      var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
      var subHeight = 60 / 1000 * window.innerHeight;
      this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      // this.getMeetMeetingsByTime();
    });
  }
}
</script>

<style>
.showMeeting .el-table--border td {
  margin: 0 !important;
  padding: 0 !important;
}

.showMeeting .el-table__body .cell {
  margin: 0 !important;
  padding: 0 !important;
}

.meeting_a {
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 14px;
  line-height: 50px;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  display: inline-block;
  padding: 0;
  font-size: 12px;
  color: #409EFF;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

.meeting-row .el-row {
  height: 35px;
  line-height: 35px;
}
</style>

<style>
.app-container {
  padding: 20px;
  padding-bottom: 0;
}
</style>
