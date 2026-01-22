<template>
  <section>
     <el-row class="page-container border padding">
      <el-form id="requireClass" :model="addForm" label-width="15%" :rules="addFormRules" ref="addForm">
        <el-form-item class="displayNone" label="主键" prop="id">
          <el-input v-model="addForm.id" placeholder="主键"></el-input>
        </el-form-item>
        <el-form-item label="会议主题" prop="name">
          <el-input v-model="addForm.name" placeholder="会议主题"></el-input>
        </el-form-item>
        <el-form-item label="自定义会议室" prop="customRoomName">
          <el-input v-model="addForm.customRoomName" placeholder="自定义会议室"></el-input>
        </el-form-item>
        <el-form-item class="displayNone" label="会议室id" prop="roomId">
          <el-input v-model="addForm.roomId" placeholder="会议室id"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.customRoomName == ''" label="会议室" prop="roomName">
          <!-- <el-autocomplete
						class="inline-input"
						v-model="addForm.roomName"
						:fetch-suggestions="querySearch"
						placeholder="会议室名称"
						@select="handleSelect"
					></el-autocomplete> -->
          <el-select v-model="addForm.roomId" @change="selectMeetBoardroom" filterable clearable placeholder="会议室">
            <el-option v-for="(item,index) in restaurants" :key="index" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="displayNone" label="会议分类id" prop="categoryId">
          <el-input v-model="addForm.categoryId" placeholder="会议分类id"></el-input>
        </el-form-item>
        <el-form-item label="会议分类" prop="categoryName">
          <!-- <el-input v-model="addForm.categoryName" placeholder="会议分类" ></el-input> -->
          <el-select v-model="addForm.categoryId" @change="selectCategory" filterable clearable placeholder="会议分类">
            <el-option v-for="(item,index) in categorys" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="displayNone" label="申请人id" prop="requireUserid">
          <el-input v-model="addForm.requireUserid" placeholder="申请人id"></el-input>
        </el-form-item>


        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="addForm.startTime" type="dates" value-format="HH:mm" format="HH:mm"
            @change="changeStartTime" placeholder="选择日期时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker v-model="addForm.endTime" type="dates" value-format="HH:mm" format="HH:mm"
            @change="changeEndTime" placeholder="选择日期时间">
          </el-time-picker>
        </el-form-item>


        <el-form-item label="是否启用回执" prop="isUsingReturn">
          <!-- <el-input v-model="addForm.isUsingReturn" placeholder="是否启用回执,0否1是,会议参与人手动参加回执" ></el-input> -->
          <el-switch v-model="addForm.isUsingReturn" active-text="会议参与人手动参加回执" inactive-text="">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否启用会议签到" prop="isUsingSignin">
          <!-- <el-input v-model="addForm.isUsingSignin" placeholder="是否启用会议签到,0否1是" ></el-input> -->
          <el-switch v-model="addForm.isUsingSignin" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>

        <el-row v-if="addForm.isUsingSignin">
          <el-form-item label="" prop="signinMode">
            <!-- <el-input v-model="addForm.signinMode" placeholder="签到模式：0-人员签到,1-扫码签到,2-WIFI签到" ></el-input> -->
            <el-radio-group v-model="addForm.signinMode">
              <el-radio :label="0">人员签到</el-radio>
              <el-radio :label="1">扫码签到</el-radio>
              <el-radio :label="2">WIFI签到</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="addForm.signinMode == '0'" label="" prop="signinUserid">
            <!-- <el-input v-model="addForm.signinUserid" placeholder="签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！" ></el-input> -->
            <el-row>
              <el-button type="text" icon="el-icon-search" @click="openSelectUser('signinUserid')">签到人员</el-button>
              <el-tag style="margin-left:20px" type="info" v-if="addForm.signinUsername">{{addForm.signinUsername}}
              </el-tag>
            </el-row>
            <el-row>所选人员为统一签到人员！默认为会议申请人！</el-row>
          </el-form-item>
          <el-form-item v-if="addForm.signinMode == '2'" label="" prop="signinWifi">
            <el-input v-model="addForm.signinWifi" placeholder="签到WIFI"></el-input>
          </el-form-item>
        </el-row>

        <el-form-item label="参加人员">
          <el-button type="text" @click="openSelectUser('')" icon="el-icon-search">选择用户</el-button><br />
          <el-tag style="margin-right:10px" v-for="(item,index) in addForm.attenders" @close="handleClose(item)"
            closable>{{item.username}}</el-tag>
        </el-form-item>

        <!-- <el-form-item label="参会客户">
					<el-button type="text" @click="selectCustomerFormVisible = true" icon="el-icon-search">选择客户</el-button><br/>
					<el-tag style="margin-right:10px" v-for="(item,index) in addForm.customers" @close="handleCloseCustomers(item)" closable>{{item.customerName}}</el-tag>
				</el-form-item> -->

        <el-form-item label="提醒方式">
          <!-- <el-input v-model="addForm.reminders" placeholder="提醒方式" ></el-input> -->
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="0">邮件</el-checkbox>
            <el-checkbox label="1">短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="是否马上提醒" prop="remindersImmediate">
          <!-- <el-input v-model="addForm.isUsingSignin" placeholder="是否启用会议签到,0否1是" ></el-input> -->
          <el-switch v-model="addForm.remindersImmediate" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>


        <el-form-item label="开始前提醒" prop="remindersBeforeStart">
          <el-input v-model="addForm.remindersBeforeStart" type="number" placeholder="分钟"></el-input>
        </el-form-item>

        <el-form-item label="结束前提醒" prop="remindersBeforeEnd">
          <el-input v-model="addForm.remindersBeforeEnd" type="number" placeholder="分钟"></el-input>
        </el-form-item>

        <el-form-item label="提醒内容" prop="content">
          <el-input type="textarea" :rows="4" v-model="addForm.content" placeholder="提醒内容"></el-input>
        </el-form-item>


        <el-form-item label="选择日期（默认本日）" prop="circleable">
          <el-switch v-model="addForm.circleable" @change="switchXh" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>

        <div style="margin-left: 15%; margin-bottom: 22px;">
          <el-radio-group v-if="addForm.circleable==1" v-model="addForm.circleType" @change="changeCircleType">
            <el-radio v-for="(item) in circleTypeArr" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </div>


        <div style="margin-left: 15%; margin-bottom: 22px;" v-if="addForm.circleable==1">
          <div v-if="addForm.circleType=='date'">
            <el-date-picker @change="changeDate" value-format="yyyy-MM-dd" v-model="valueDate" type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div class="text">可以选择多个日期</div>
            <div class="date-list">
              <div v-for="(item,index) in valueDateArr" style="margin-right: 22px; margin-bottom: 11px;">
                {{item}} <i class="el-icon-close" @click="delDates(index)"></i>
              </div>
            </div>
          </div>
          <div v-if="addForm.circleType=='week'">
            <div class="date-list">
              <el-checkbox-group v-model="week" @change="changeWeek">
                <el-checkbox v-for="(item,index) in weekList" :label="item.value">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-if="addForm.circleType=='month'">
            <div class="date-list">
              <el-checkbox-group v-model="month" @change="changeMonth">
                <el-checkbox style="width: 50px;" v-for="(item,index) in datesList" :label="item.value">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>



        <!-- <el-form-item label="开始前提醒" prop="remindersBeforeStart">
          会议开始前<el-input-number size="mini" controls-position="right" v-model="hour" :min="0" :max="12">
          </el-input-number>
          小时<el-input-number size="mini" controls-position="right" v-model="minute" :min="0" :max="60">
          </el-input-number>
          分钟提醒
        </el-form-item> -->

        <el-form-item label="参会人数" prop="attenderNum">
          <el-input-number v-model="addForm.attenderNum" :min="0" :max="200"></el-input-number>
        </el-form-item>

        <el-form-item label="参会客户数" prop="customerNum">
          <el-input-number v-model="addForm.customerNum" :min="0" :max="200"></el-input-number>
        </el-form-item>

        <el-form-item label="其他参加" prop="otherAttender">
          <el-input type="textarea" :rows="4" v-model="addForm.otherAttender" placeholder="其他参加"></el-input>
        </el-form-item>
        <el-form-item label="申请备注" prop="requireRemark">
          <el-input type="textarea" :rows="4" v-model="addForm.requireRemark" placeholder="申请备注"></el-input>
        </el-form-item>

        <el-form-item label="附件">
          <upload v-if="fileVisible" :archiveId="addForm.id" :branchId="userInfo.branchId" @on-change="onChange">
          </upload>
        </el-form-item>
        <!--
				<el-form-item label="立刻提醒" prop="remindersImmediate">
					<el-input v-model="addForm.remindersImmediate" placeholder="立刻提醒" ></el-input>
				</el-form-item>


				<el-form-item class="displayNone" label="单位id" prop="deptId">
					<el-input v-model="addForm.deptId" placeholder="单位id" ></el-input>
				</el-form-item>
				<el-form-item label="单位" prop="deptName">
					<el-input v-model="addForm.deptName" placeholder="单位" ></el-input>
				</el-form-item>
				<el-form-item label="申请人" prop="requireUsername">
					<el-input v-model="addForm.requireUsername" placeholder="申请人" ></el-input>
				</el-form-item>
				<el-form-item label="归属机构" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="归属机构" ></el-input>
				</el-form-item>
				<el-form-item label="自定义会议地点" prop="customRoomName">
					<el-input v-model="addForm.customRoomName" placeholder="自定义会议地点" ></el-input>
				</el-form-item>
				<el-form-item label="结束前提醒" prop="remindersBeforeEnd">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.remindersBeforeEnd" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="会议开始备注" prop="startRemark">
					<el-input v-model="addForm.startRemark" placeholder="会议开始备注" ></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="状态0待审批,1审批中,2已批准,3已拒绝,4已开始,5已结束" prop="status">
					<el-input v-model="addForm.status" placeholder="状态0待审批,1审批中,2已批准,3已拒绝,4已开始,5已结束" ></el-input>
				</el-form-item>
				<el-form-item label="审批意见" prop="approveSuggestion">
					<el-input v-model="addForm.approveSuggestion" placeholder="审批意见" ></el-input>
				</el-form-item> -->
        <el-form-item>
          <el-col>
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交
            </el-button>
            <el-button @click.native="handleCancel">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-dialog append-to-body title="选择用户" :visible.sync="selectUserFormVisible" width="80%">
            <users-select :is-single-user='isSingleUser'  @confirm="onUserSelected">
        </users-select>
      </el-dialog>
      <!--
			<el-dialog append-to-body title="选择客户" :visible.sync="selectCustomerFormVisible" width="80%">
			    <customer-select @cancel="selectCustomerFormVisible = false"  @getSelectCustomers="onCustomerSelected">
				</customer-select>
			</el-dialog> -->
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    checkMeetingTime,
    addMeetMeeting
  } from '@/api/oa/meet/meetMeeting';
  import {
    mapGetters
  } from 'vuex'
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; //选择用户
  import CustomerSelect from "@/views/oa/crm/components/CustomerComponents";
  import {
    listMeetBoardroom
  } from '@/api/oa/meet/meetBoardroom';
  import {
    listMeetCategory
  } from '@/api/oa/meet/meetCategory';

  import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件

  import {
    sn
  } from "@/common/js/sequence"; //id生成器

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    props: ['meetMeeting', 'visible'],
    watch: {
      'meetMeeting': function(meetMeeting) {
        //this.addForm = meetMeeting;

      },
      'visible': function(visible) {
        if (visible == true) {
          //从新打开页面时某些数据需要重新加载，可以在这里添加
          this.fileVisible = true
          // this.addForm.id = sn()

          this.addForm.roomId = this.meetMeeting.roomId
          this.addForm.roomName = this.meetMeeting.roomName

          // if (this.meetMeeting.startTime != '' && this.meetMeeting.endTime != '') {
          //   this.addForm.startTime = this.meetMeeting.startTime
          //   this.addForm.endTime = this.meetMeeting.endTime
          // } else {
          //   let start = new Date();
          //   this.addForm.endTime = start.setTime(start.getTime() + 3600 * 1000 * 2)
          // }


        }
      }
    },
    data() {
      return {
        options: {}, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        addFormRules: {
          name: [{
            required: true,
            message: '主题不能为空',
            trigger: 'change'
          }],
          startTime: [{
            required: true,
            message: '开始时间不能为空',
            trigger: 'change',
          }],
          endTime: [{
              required: true,
              message: '结束不能为空',
              trigger: 'change',
            },
            // { validator: changTime,  trigger: 'change' }
          ]
        },
        //新增界面数据 meet_meeting
        addForm: {
          // id: 'nononono',
          name: '',
          customRoomName: '',
          categoryId: '',
          categoryName: '',
          requireUserid: '',
          requireUsername: '',
          roomId: '',
          roomName: '',
          startTime: '',
          endTime: '',
          reminders: '',
          remindersBeforeStart: '',
          remindersBeforeEnd: '',
          content: '',
          otherAttender: '',
          attenderNum: '',
          customerNum: '',
          isUsingReturn: false,
          isUsingSignin: false,
          remindersImmediate: false,
          circleable: false,
          circleType: '',
          circcleDates: '',
          circleDaysOfWeek: '',
          circleDaysOfMonth: '',
          signinMode: '',
          signinUserid: '',
          signinUsername: '',
          signinWifi: '',
          branchId: '',
          deptId: '',
          deptName: '',
          requireRemark: '',
          startRemark: '',
          createTime: '',
          status: '',
          approveSuggestion: '',
          attenders: [],
          customers: [],
          meetMeetingAppendix: [],
        },
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        isSingleUser: true,
        selectUserFormVisible: false,
        restaurants: [],
        categorys: [],
        checkList: [],
        hour: 0,
        minute: 5,
        selectCustomerFormVisible: false,
        fileVisible: true,
        circleTypeArr: [{
          value: 'date',
          name: '按日期'
        }, {
          value: 'week',
          name: '按周期'
        }, {
          value: 'month',
          name: '按每月日期'
        }],
        valueDate: '',
        valueDateArr: [],
        weekList: [{
          value: 0,
          name: '周日',
        }, {
          value: 1,
          name: '周一',
        }, {
          value: 2,
          name: '周二',
        }, {
          value: 3,
          name: '周三',
        }, {
          value: 4,
          name: '周四',
        }, {
          value: 5,
          name: '周五',
        }, {
          value: 6,
          name: '周六',
        }],
        week: [],
        datesList: '',
        month: []
        /**end 在上面加自定义属性**/
      } //end return
    }, //end data
    methods: {

      // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
      handleCancel: function() {
        //this.$refs['addForm'].resetFields();
        this.$emit('cancel');
      },
      //新增提交MeetMeeting meet_meeting 父组件监听@submit="afterAddSubmit"
      addSubmit: function() {

        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var start = this.timeToSec(this.addForm.startTime + ':00')
            var end = this.timeToSec(this.addForm.endTime + ':00')
            if (end <= start) {
              this.$message({
                message: "会议开始时间不能晚于结束时间",
                type: 'error'
              });
              return false;
            }
            this.load.add = true
            this.addMeeting()

          }
        });
      },

      addMeeting() {
        this.addForm.reminders = ''
        //简单修改数据
        if (this.checkList.length > 0) {
          this.checkList.forEach((check) => {
            this.addForm.reminders = this.addForm.reminders + check + ","
          })
        }

        this.addForm.isUsingReturn ? this.addForm.isUsingReturn = 1 : this.addForm.isUsingReturn = 0
        this.addForm.isUsingSignin ? this.addForm.isUsingSignin = 1 : this.addForm.isUsingSignin = 0
        this.addForm.branchId = this.userInfo.branchId
        this.addForm.requireUserid = this.userInfo.userid
        this.addForm.requireUsername = this.userInfo.username
        this.addForm.deptid = this.userInfo.deptid
        this.addForm.deptName = this.userInfo.deptName
        this.addForm.remindersImmediate ? this.addForm.remindersImmediate = 1 : this.addForm.remindersImmediate = 0
        this.addForm.circleable ? this.addForm.circleable = 1 : this.addForm.circleable = 0

        //attender
        this.addForm.attenders.forEach((item) => {
          item.userid = item.userId
        })

        //处理时间格式
        let date = util.getDate()
        if (this.addForm.remindersBeforeStart) {
          let startDate = date + ' ' + this.addForm.startTime + ':00'
          let beforeDate = util.getAboutTime(startDate, parseInt(this.addForm.remindersBeforeStart))
          this.addForm.remindersBeforeStart = util.getDate() + ' ' + beforeDate + ':00'
        }
        if (this.addForm.remindersBeforeEnd) {
          let endDate = date + ' ' + this.addForm.endTime + ':00'
          let afterDate = util.getAboutTime(endDate, parseInt(this.addForm.remindersBeforeEnd))
          this.addForm.remindersBeforeEnd = util.getDate() + ' ' + afterDate + ':00'
        }


        //处理循环
        if (this.addForm.circleable == 0) {
          this.addForm.circleType = ''
          this.addForm.circcleDates = ''
          this.addForm.circleDaysOfWeek = ''
          this.addForm.circleDaysOfMonth = ''
          this.valueDateArr = []
          this.datesList = ''
        }
        if (this.addForm.circleable == 1) {
          let value = this.addForm.circleType
          if (value == 'date') {
            this.addForm.circleDaysOfWeek = ''
            this.addForm.circleDaysOfMonth = ''
          }
          if (value == 'week') {
            this.addForm.circcleDates = ''
            this.addForm.circleDaysOfMonth = ''
          }
          if (value == 'month') {
            this.addForm.circcleDates = ''
            this.addForm.circleDaysOfWeek = ''
          }
        }

        console.log(this.addForm)
        // return


        let params = Object.assign({}, this.addForm);

        addMeetMeeting(params).then((res) => {
          this.load.add = false
          var tips = res.data.tips;
          if (tips.isOk) {
            //this.$refs['addForm'].resetFields();
            let form = {
              // id: 'nononono',
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
              //remindersImmediate: '',
              remindersBeforeStart: '',
              remindersBeforeEnd: '',
              content: '',
              otherAttender: '',
              attenderNum: '',
              customerNum: '',
              isUsingReturn: false,
              isUsingSignin: false,
              remindersImmediate: false,
              circleable: false,
              circleType: '',
              circcleDates: '',
              circleDaysOfWeek: '',
              circleDaysOfMonth: '',
              signinMode: '',
              signinUserid: '',
              signinUsername: '',
              signinWifi: '',
              branchId: '',
              deptId: '',
              deptName: '',
              requireRemark: '',
              startRemark: '',
              createTime: '',
              status: '',
              approveSuggestion: '',
              attenders: [],
              customers: [],
              meetMeetingAppendix: [],
            }

            // this.addForm.remindersBeforeStart = this.addForm.startTime - (3600 * 1000 * this.hour) - (this.minute *
            //   60 *
            //   1000)


            this.addForm = form

            this.$emit('submit'); //  @submit="afterAddSubmit"
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.add = false);
      },
      /**begin 在下面加自定义方法,记得补上面的一个逗号**/
      //校验数据
      validateTime() {

      },
      querySearch(queryString, cb) {
        queryString = queryString.trim()

        var restaurants = this.restaurants;
        const results = this.restaurants.filter(obj => obj.value.indexOf(queryString) != -1)
        if (results.length < 0) {
          queryString = ''
        }
        cb(results);
      },
      handleSelect(item) {
        console.log(item);
        this.addForm.typeId = item.id
      },

      //获取列表 MeetCategory meet_category
      getMeetCategorys() {
        let params = {
          branchId: this.userInfo.branchId,
        };
        listMeetCategory(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.categorys = res.data.data
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
        }).catch();
      },
      //选择会议分类
      selectCategory(value) {

        let filters = this.categorys.filter((obj) => obj.id == value)
        if (filters != null && filters.length > 0) {
          this.addForm.categoryName = filters[0].name
        }

        console.log(filters)
      },
      //选择会议室
      selectMeetBoardroom(value) {
        let filters = this.restaurants.filter((obj) => obj.id == value)
        if (filters != null && filters.length > 0) {
          this.addForm.roomName = filters[0].value
        }
        //console.log(filters)
      },
      //获取列表 MeetBoardroom meet_boardroom
      getMeetBoardrooms() {
        let params = {
          branchId: this.userInfo.branchId,
        };
        this.restaurants = []
        listMeetBoardroom(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((meetBoardroom) => {
                let tempMeetBoardroom = {
                  value: meetBoardroom.name,
                  id: meetBoardroom.id
                }
                this.restaurants.push(tempMeetBoardroom)
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
      openSelectUser(flag) {
        if (flag == 'signinUserid') {
          this.isSingleUser = true
        } else {
          this.isSingleUser = false
        }
        this.selectUserFormVisible = true
      },
      onUserSelected: function(users) {
        if (this.isSingleUser) {
          this.addForm.signinUserid = users[0].userid
          this.addForm.signinUsername = users[0].username
        } else {
          users.forEach((item) => {
            let user = {
              id: '',
              meetingId: this.addForm.id,
              userId: item.userid,
              username: item.username,
              status: '',
              remark: '',
            }
            this.addForm.attenders.push(user)
          })
        }
        this.selectUserFormVisible = false
      },
      handleClose(value) {
        if (this.addForm.attenders != null && this.addForm.attenders.length > 0) {
          this.addForm.attenders.splice(this.addForm.attenders.indexOf(value), 1)
        }

      },

      handleCloseCustomers(value) {
        if (this.addForm.customers != null && this.addForm.customers.length > 0) {
          this.addForm.customers.splice(this.addForm.customers.indexOf(value), 1)
        }
      },
      onCustomerSelected(vls) {
        console.log(vls)
        vls.forEach((item) => {
          let customer = {
            id: '',
            meetingId: this.addForm.id,
            customerId: item.customerId,
            customerName: item.customerName,
            status: '',
            remark: '',
          }
          this.addForm.customers.push(customer)
        })
        this.selectCustomerFormVisible = false

      },
      onChange: function(file, fileList) {
        //this.addForm.driverCardImageUrl = file.url
        console.log(file)
        console.log(fileList)
        let list = []
        if (fileList != null && fileList.length > 0) {
          fileList.forEach((item) => {
            let fileOne = {
              id: item.id,
              meetingId: this.addForm.id,
              name: item.name,
              addr: item.url,
              type: item.fileSuffix,
              remark: item.remark,
            }
            console.log(fileOne)
            list.push(fileOne)
          })
          this.addForm.meetMeetingAppendix = list
        }
      },
      switchXh(e) {
        this.addForm.circleable = e
        if (this.addForm.circleable) {
          this.getDaysArr()
        }
      },
      changeCircleType(e) {
        this.addForm.circleType = e
      },
      changeDate(e) {
        this.valueDateArr.push(e)
        var set = new Set(this.valueDateArr)
        this.valueDateArr = [...set]
        this.addForm.circcleDates = this.valueDateArr.toString()
      },
      delDates(i) {
        this.valueDateArr.splice(i, 1)
        this.addForm.circcleDates = this.valueDateArr.toString()
      },
      getDaysArr() {
        var daysArr = []
        for (let i = 1; i <= 31; i++) {
          daysArr.push({
            value: i,
            name: i,
          })
        }
        this.datesList = daysArr
      },
      changeWeek(e) {
        this.addForm.circleDaysOfWeek = e.toString()
      },
      changeMonth(e) {
        this.addForm.circleDaysOfMonth = e.toString()
      },
      //hh:mm:ss  转时间戳
      timeToSec(time) {
        if (time !== null) {
          var s = "";
          var hour = time.split(":")[0];
          var min = time.split(":")[1];
          var sec = time.split(":")[2];
          s = Number(hour * 3600) + Number(min * 60) + Number(sec);
          return s;
        }
      },
      changeStartTime(e) {
        console.log(e)
        this.addForm.startTime = e
      },
      changeEndTime(e) {
        console.log(e)
        this.addForm.endTime = e
      }
      /**end 在上面加自定义方法**/

    }, //end method
    components: {
      //在下面添加其它组件 'meet-meeting-edit':MeetMeetingEdit
      "users-select": UsersSelect,
      "customer-select": CustomerSelect,
      'upload': AttachmentUpload,
    },
    mounted() {
      //this.addForm=Object.assign(this.addForm, this.meetMeeting);
      /**在下面写其它函数***/
      if (this.meetMeeting != null) {
        if (this.meetMeeting.startTime != '' && this.meetMeeting.endTime != '') {
          this.addForm.startTime = this.meetMeeting.startTime
          this.addForm.endTime = this.meetMeeting.endTime
        }
        this.addForm.roomId = this.meetMeeting.roomId
        this.addForm.roomName = this.meetMeeting.roomName
      } else {
        let start = new Date();
        // this.addForm.endTime = start.setTime(start.getTime() + 3600 * 1000 * 2)
      }

      this.fileVisible = true
      // this.addForm.id = sn()
      // console.log(this.addForm.id)

      // var a= util.getAboutTime('2021-02-15 15:36:00','cut',24)
      // console.log(a)

      this.getMeetBoardrooms()
      this.getMeetCategorys()
    } //end mounted
  }
</script>

<style>
  #requireClass .el-form-item__label {
    text-align: left;
  }

  .displayNone {
    display: none;
  }

  .date-list {
    display: flex;
    padding: 22px 0px;
    flex-flow: wrap;
    padding-bottom: 44px;
  }

  .text {
    line-height: 1;
    font-size: 14px;
    display: inline-block;
  }
</style>
