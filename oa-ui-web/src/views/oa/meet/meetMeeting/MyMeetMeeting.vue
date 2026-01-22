<template>
	<section>
    <el-row class="page-container border padding">
      <el-row class="page-header">
        <!-- <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> -->
        <el-select v-model="status" placeholder="请选择" @change="selectStatus">
          <el-option v-for="(item,index) in op" :value="item.status" :label="item.name"></el-option>
        </el-select>
        <el-date-picker v-model="targetMonth" type="month" placeholder="选择月">
        </el-date-picker>
        <!--      <el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="changeDate">
              </el-date-picker>-->
        <el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchMeetMeetings"
                   icon="el-icon-search" style="margin-right: 13px;">查询
        </el-button>
        <el-button icon="el-icon-plus" @click="showAdd" style="margin-left: 0px;">添加会议</el-button>
        <!-- <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  -->
        <el-button icon="el-icon-date" @click="showCalendarPage">日历/列表</el-button>
      </el-row>
      <el-row class="page-main padding-top" v-show="showCalendar==false">
        <!--列表 MeetMeeting meet_meeting-->
        <el-table ref="procdefsTable" :height="tableHeight" :data="meetMeetings" @sort-change="sortChange"
                  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                  style="width: 100%;">
          <el-table-column sortable type="selection" width="40"></el-table-column>
          <el-table-column sortable type="index" width="40"></el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="会议名称" min-width="80">
            <template slot-scope="scope">
              <el-link type="primary" @click="showAttend(scope.row)">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="customRoomName" show-overflow-tooltip label="自定义会议室" min-width="80"></el-table-column>
          <el-table-column prop="categoryName" show-overflow-tooltip label="会议分类" min-width="80"></el-table-column>
          <el-table-column prop="roomName" show-overflow-tooltip label="会议室名称" min-width="80"></el-table-column>
          <el-table-column prop="execExecDate" show-overflow-tooltip label="会议日期" min-width="60"></el-table-column>
          <el-table-column prop="startTime" show-overflow-tooltip label="开始时间" min-width="45"></el-table-column>
          <el-table-column prop="endTime" show-overflow-tooltip label="结束时间" min-width="45"></el-table-column>
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
          <el-table-column label="参加状态" min-width="60">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.attenderStatus == '0'" type="primary">初始</el-tag>
              <el-tag v-if="scope.row.attenderStatus == '1'" type="danger">参加</el-tag>
              <el-tag v-if="scope.row.attenderStatus == '2'" type="info">不参加</el-tag>
            </template>
          </el-table-column>
           <el-table-column label="会议纪要" min-width="80">
						<template slot-scope="scope">
							<el-button icon="el-icon-edit-outline" @click="showRecord( scope.row,scope.$index)" ></el-button>
						</template>
					</el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
                       :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
      </el-row>
      <el-row class="page-main padding-top" v-show="showCalendar==true">
        <el-calendar v-loading="listLoading" v-model="targetMonth">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" scope="{date, data}">
            <div :class="data.isSelected ? 'is-selected' : ''">
              <div></div>
              <div>{{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : ''}}</div>
              <div v-for="(item,index) in showMyMeetingCalendar(data)" :key="index">
                <el-tag effect="dark" style="margin-bottom:10px" size="mini" v-if="item.num != 0"
                        :type="item.meetingCondition==1?'success':'info'"
                        @click.stop="clickTag(item.num,data.day,item.meetingIds)">
                  会议数量:{{item.num}}
                </el-tag>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-row>
    </el-row>

    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="50%">
      <el-row label="开始时间" prop="startTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime" value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-row>
      <el-row label="结束时间" prop="endTime">
        <el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime" value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-row>
      <el-row label="会议名称" prop="name">
        <div>{{editForm.name}}</div>
      </el-row>
      <el-row label="会议分类" prop="categoryName">
        <div>{{editForm.categoryName}}</div>
      </el-row>
      <el-row label="申请人" prop="requireUsername">
        <div>{{editForm.requireUsername}}</div>
      </el-row>
      <el-row label="会议室" prop="roomName">
        <div>{{editForm.roomName}}</div>
      </el-row>

      <el-row label="其他参加" prop="otherAttender">
        <div>{{editForm.otherAttender}}</div>
      </el-row>
      <el-row label="参会人数" prop="attenderNum">
        <div>{{editForm.attenderNum}}</div>
      </el-row>
      <el-row label="参会客户数" prop="customerNum">
        <div>{{editForm.customerNum}}</div>
      </el-row>

      <el-row label="申请备注" prop="requireRemark">
        <div>{{editForm.requireRemark}}</div>
      </el-row>
      <el-row label="审批意见" prop="approveSuggestion">
        <div>{{editForm.approveSuggestion}}</div>
      </el-row>
    </el-drawer>

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

    <el-dialog title="会议明细" :visible.sync="meetDialogTableVisible" width="60%">
      <el-table :data="meetData">
        <el-table-column property="meetingName" label="会议名称" min-width="80"></el-table-column>
        <el-table-column property="categoryName" label="会议分类" min-width="80"></el-table-column>
        <el-table-column property="location" label="会议地点" min-width="80"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="primary">待审批</el-tag>
            <el-tag v-if="scope.row.status == 1" type="primary">审批中</el-tag>
            <el-tag v-if="scope.row.status == 2" type="primary">已批准</el-tag>
            <el-tag v-if="scope.row.status == 3" type="danger">已拒绝</el-tag>
            <el-tag v-if="scope.row.status == 4" type="primary">已开始</el-tag>
            <el-tag v-if="scope.row.status == 5" type="danger">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="execExecDate" label="会议日期" min-width="80"></el-table-column>
        <el-table-column property="meetingTime" label="会议时间" min-width="80"></el-table-column>
      </el-table>
    </el-dialog>

    <!--meetMeetingAttend界面-->
    <el-dialog title="参会确认" :visible.sync="attendVisible" width="50%" :close-on-click-modal="false">
      <meet-meeting-attend :meet-meeting="meetMeeting" :visible="attendVisible" @cancel="attendVisible=false"
                        @submit="afterAttendSubmit"></meet-meeting-attend>
    </el-dialog>

    <el-dialog title = "会议纪要" :visible.sync="recordVisible" with="50%" :close-on-click-modal="false">
      <el-form :model="recordForm"  label-width="200px" ref="recordForm">
        <el-form-item label="会议纪要" prop="content">
          <el-input type="textarea" placeholder="请输入会议纪要" rows="7" v-model="recordForm.content"
                    maxlength="1024" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="16" :offset="8">
            <el-button @click.native="recordVisible=false">取消</el-button>
<!--            <el-button v-loading="load.record" type="primary" @click.native="recordSubmit"
                       :disabled="load.add==true">提交</el-button>-->
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import Sticky from '@/components/Sticky' // 粘性header组件
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {listMeetMeeting, delMeetMeeting, batchDelMeetMeeting, getMyMeetMeeting} from '@/api/oa/meet/meetMeeting';
  import MeetMeetingAdd from './MeetMeetingRequire'; //新增界面
  import MeetMeetingEdit from './MeetMeetingEdit'; //修改界面
  import {mapGetters} from 'vuex'
  import MeetMeetingAttend from "./MeetMeetingAttend";
  import {listMeetMeetingRecord} from "../../../../api/oa/meet/meetMeetingRecord";


  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    data() {
      return {
        filters: {
          key: '',
        },
        meetMeeting: {},
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
          add: false,
          record:false,
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
          approveSuggestion: '',
        },
        /**begin 自定义属性请在下面加 请加备注**/
        showCalendar: true, //默认显示日历
        listLoading: false, // 查询中...
        targetMonth: new Date(), //目标月份
        meetDialogTableVisible:false, //会议明细
        attendVisible:false, //参与界面默认不显示
        recordVisible:false,
        recordForm:{
          id:'',
          meetingId:'',
          userid:'',
          username:'',
          headerImage:'',
          createTime:'',
          content:'',
          execId:'',
        },
        meetData:[],
        tadayArr: [],
        status: '',
        drawer: false,
        date: util.getDate(),
        tableHeight: 300,
        op: [{
          'status': '',
          'name': '全部'
        }, {
          'status': '0',
          'name': '待审批'
        }, {
          'status': '1',
          'name': '审批中'
        }, {
          'status': '2',
          'name': '批准'
        }, {
          'status': '3',
          'name': '拒绝'
        }, {
          'status': '4',
          'name': '开始'
        }, {
          'status': '5',
          'name': '结束'
        }]
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    // 切换月份
    watch: {
      targetMonth(val, olVal) {
        this.getMeetMeetings();
      },
    },
    methods: {
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
      changeDate(e) {
        this.date = e
      },
      //获取列表 MeetMeeting meet_meeting
      getMeetMeetings() {
        let params = {
          // pageSize: this.pageInfo.pageSize,
          // pageNum: this.pageInfo.pageNum,
          // total: this.pageInfo.total,
          // count: this.pageInfo.count,
          // branchId : this.userInfo.branchId,
          status: this.status,
          userid: this.userInfo.userid,
          //execDate: this.date,
          orderBy: "exec_exec_date asc",
          month: util.formatDate(this.targetMonth, "yyyy-MM")
        };
        // if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
        // 	let orderBys=[];
        // 	for(var i=0;i<this.pageInfo.orderFields.length;i++){
        // 		orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
        // 	}
        // 	params.orderBy= orderBys.join(",")
        // }
        // if(this.filters.key!==""){
        // 	params.key= '%'+this.filters.key+'%'
        // }else{
        // 	//params.xxx=xxxxx
        // }
        this.load.list = true;
        getMyMeetMeeting(params).then((res) => {
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

      //显示编辑界面 MeetMeeting meet_meeting
      showEdit: function(row, index) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面 MeetMeeting meet_meeting
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.getMeetMeetings();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },
      afterAttendSubmit(){
        this.attendVisible = false;
        this.getMeetMeetings();
      },
      //选择行meetMeeting
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除meetMeeting
      handleDel: function(row, index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          let params = {
            id: row.id
          };
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
      batchDel: function() {

        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.del = true;
          batchDelMeetMeeting(this.sels).then((res) => {
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
      /*rowClick: function(row, event, column) {
        //this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        // console.log(row,column)
        console.log(row)

        switch (row.attendStatus) {
          case '1':
            //this.drawer = true;
            return false;
          default:
            break;
        }
        this.$router.push({
          path: '/oa/meet/mine/attence',
          query: {
            id: row.id,
            attenderId: row.attenderId,
            execId: row.execId
          }
        })
      },*/
      rowClick: function(row, event, column) {
        //  @row-click="rowClick"
      },
      showAttend(row){
        this.attendVisible = true;
        this.meetMeeting=row;
      },
      selectStatus() {
        this.getMeetMeetings();
      },
      /**begin 自定义函数请在下面加**/
      showCalendarPage: function (){
        this.showCalendar=!this.showCalendar;
      },
      showMyMeetingCalendar(data) {
        let day = data.day;
        let num=0;
        let meetingCondition=0;
        let meetingIds=[];
        for (let i = 0; i < this.meetMeetings.length; i++) {
          if (this.meetMeetings[i].execExecDate.split(" ")[0] == day) {
            num++;
            if (meetingIds.indexOf(this.meetMeetings[i].id) == -1) {
              meetingIds.push(this.meetMeetings[i].id);
            }
          }
        }
        let mDate = new Date(day);
        const today=new Date(new Date(new Date().toLocaleDateString()).getTime());
        if(mDate >= today){
          meetingCondition=1;
        }

        let meeting =[
          {
            num,
            mDate,
            meetingCondition,
            meetingIds,
          }
        ];
        return meeting;
      },
      //点击标签
      clickTag(num,day,meetingIds) {
        this.meetDialogTableVisible = true;
        this.meetData = [];
        for (let i = 0; i <meetingIds.length ; i++) {
          let meet = {
            meetingName: "",
            location: "",
            meetingTime:'',
            categoryName:'',
            status:'',
            execExecDate:'',
          }
          for (let j = 0; j < this.meetMeetings.length; j++) {
            if (meetingIds[i]==this.meetMeetings[j].id && this.meetMeetings[j].execExecDate.split(" ")[0] == day) {
              meet.meetingName = this.meetMeetings[j].name;
              meet.location = (this.meetMeetings[j].customRoomName==null||this.meetMeetings[j].customRoomName=='')?
                this.meetMeetings[j].roomName:this.meetMeetings[j].customRoomName;
              meet.categoryName=this.meetMeetings[j].categoryName;
              meet.meetingTime += this.meetMeetings[j].startTime + " —— " + this.meetMeetings[j].endTime;
              meet.status=this.meetMeetings[j].status;
              meet.execExecDate = this.meetMeetings[j].execExecDate;
            }
          }
          this.meetData.push(meet);
        }
      },

      showRecord(row,index){
        let params={
          meetingId: row.id,
        }
        listMeetMeetingRecord(params).then((res) => {
          let tips=res.data.tips;
          this.$refs['recordForm'].resetFields();
          if(res.data.data.length>0){
            this.recordForm=res.data.data[0];
          }
        });
        this.recordVisible = true;
      },
      recordSubmit(){

      }
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      MeetMeetingAttend,
      'meet-meeting-add': MeetMeetingAdd,
      'meet-meeting-edit': MeetMeetingEdit,


      //在下面添加其它组件
      'meet-meeting-attend':MeetMeetingAttend,
    },
    mounted() {
      this.$nextTick(() => {
        this.getMeetMeetings();
        let clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        let subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      });
    }
  }
</script>

<style scoped>

</style>


<style>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
</style>
