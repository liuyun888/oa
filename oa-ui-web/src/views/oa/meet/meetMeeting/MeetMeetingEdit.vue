<template>
  <section>
     <el-row class="page-container border padding">
      <el-form id="requireClass" :model="editForm" label-width="15%" :rules="editFormRules" ref="editForm">
        <el-form-item class="displayNone" label="主键" prop="id">
          <el-input v-model="editForm.id" placeholder="主键"></el-input>
        </el-form-item>
        <el-form-item label="会议主题" prop="name">
          <el-input v-model="editForm.name" placeholder="会议主题"></el-input>
        </el-form-item>
        <el-form-item label="自定义会议室" prop="customRoomName">
          <el-input v-model="editForm.customRoomName" placeholder="自定义会议室"></el-input>
        </el-form-item>
        <el-form-item class="displayNone" label="会议室id" prop="roomNmae">
          <el-input v-model="editForm.roomNmae" placeholder="会议室"></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.customRoomName == ''" label="会议室" prop="roomId">
          <!-- <el-autocomplete
						class="inline-input"
						v-model="editForm.roomName"
						:fetch-suggestions="querySearch"
						placeholder="会议室名称"
						@select="handleSelect"
					></el-autocomplete> -->
          <el-select v-model="editForm.roomId" @change="selectMeetBoardroom" filterable clearable placeholder="会议室">
            <el-option v-for="(item,index) in restaurants" :key="index" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="displayNone" label="会议分类id" prop="categoryId">
          <el-input v-model="editForm.categoryId" placeholder="会议分类id"></el-input>
        </el-form-item>
        <el-form-item label="会议分类" prop="categoryName">
          <!-- <el-input v-model="editForm.categoryName" placeholder="会议分类" ></el-input> -->
          <el-select v-model="editForm.categoryId" @change="selectCategory" filterable clearable placeholder="会议分类">
            <el-option v-for="(item,index) in categorys" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="displayNone" label="申请人id" prop="requireUserid">
          <el-input v-model="editForm.requireUserid" placeholder="申请人id"></el-input>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="editForm.startTime" type="dates" value-format="HH:mm" format="HH:mm"
            @change="changeStartTime" placeholder="选择日期时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker v-model="editForm.endTime" type="dates" value-format="HH:mm" format="HH:mm"
            @change="changeEndTime" placeholder="选择日期时间">
          </el-time-picker>
        </el-form-item>


        <el-form-item label="是否启用回执" prop="isUsingReturn">
          <!-- <el-input v-model="editForm.isUsingReturn" placeholder="是否启用回执,0否1是,会议参与人手动参加回执" ></el-input> -->
          <el-switch v-model="editForm.isUsingReturn" active-text="会议参与人手动参加回执" inactive-text="">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否启用会议签到" prop="isUsingSignin">
          <!-- <el-input v-model="editForm.isUsingSignin" placeholder="是否启用会议签到,0否1是" ></el-input> -->
          <el-switch v-model="editForm.isUsingSignin" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>

        <el-row v-if="editForm.isUsingSignin">
          <el-form-item label="">
            <!-- <el-input v-model="editForm.signinMode" placeholder="签到模式：0-人员签到,1-扫码签到,2-WIFI签到" ></el-input> -->
            <el-radio-group v-model="editForm.signinMode">
              <el-radio label="0">人员签到</el-radio>
              <el-radio label="1">扫码签到</el-radio>
              <el-radio label="2">WIFI签到</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="editForm.signinMode == '0'" label="" prop="signinUserid">
            <!-- <el-input v-model="editForm.signinUserid" placeholder="签到模式1：签到人员,所选人员为统一签到人员！默认为会议申请人！" ></el-input> -->
            <el-row>
              <el-button type="text" icon="el-icon-search" @click="openSelectUser('signinUserid')">签到人员</el-button>
              <el-tag style="margin-left:20px" type="info" v-if="editForm.signinUsername">{{editForm.signinUsername}}
              </el-tag>
            </el-row>
            <el-row>所选人员为统一签到人员！默认为会议申请人！</el-row>
          </el-form-item>
          <el-form-item v-if="editForm.signinMode == '2'" label="" prop="signinWifi">
            <el-input v-model="editForm.signinWifi" placeholder="签到WIFI"></el-input>
          </el-form-item>
        </el-row>

        <el-form-item label="参加人员">
          <el-button type="text" @click="openSelectUser('')" icon="el-icon-search">选择用户</el-button><br />
          <el-tag style="margin-right:10px" v-for="(item,index) in editForm.attenders" @close="handleClose(item)"
            closable>{{item.username}}</el-tag>
        </el-form-item>

        <!-- <el-form-item label="参会客户">
          <el-button type="text" @click="selectCustomerFormVisible = true" icon="el-icon-search">选择客户</el-button><br />
          <el-tag style="margin-right:10px" v-for="(item,index) in editForm.customers"
            @close="handleCloseCustomers(item)" closable>{{item.customerName}}</el-tag>
        </el-form-item> -->

        <el-form-item label="提醒方式">
          <!-- <el-input v-model="editForm.reminders" placeholder="提醒方式" ></el-input> -->
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="0">邮件</el-checkbox>
            <el-checkbox label="1">短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="是否马上提醒" prop="remindersImmediate">
          <!-- <el-input v-model="addForm.isUsingSignin" placeholder="是否启用会议签到,0否1是" ></el-input> -->
          <el-switch v-model="editForm.remindersImmediate" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>

        <el-form-item label="开始前提醒" prop="remindersBeforeStart">
          <el-input v-model="editForm.remindersBeforeStart" type="number" placeholder="分钟"></el-input>
        </el-form-item>

        <el-form-item label="结束前提醒" prop="remindersBeforeEnd">
          <el-input v-model="editForm.remindersBeforeEnd" type="number" placeholder="分钟"></el-input>
        </el-form-item>

        <el-form-item label="提醒内容" prop="content">
          <el-input type="textarea" :rows="4" v-model="editForm.content" placeholder="提醒内容"></el-input>
        </el-form-item>


        <el-form-item label="是否循环" prop="circleable">
          <el-switch v-model="editForm.circleable" @change="switchXh" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>



        <div style="margin-left: 15%; margin-bottom: 22px;">
          <el-radio-group v-if="editForm.circleable==1" v-model="editForm.circleType" @change="changeCircleType">
            <el-radio v-for="(item) in circleTypeArr" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </div>


        <div style="margin-left: 15%; margin-bottom: 22px;" v-if="editForm.circleable==1">
          <div v-if="editForm.circleType=='date'">
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
          <div v-if="editForm.circleType=='week'">
            <div class="date-list">
              <el-checkbox-group v-model="week" @change="changeWeek">
                <el-checkbox v-for="(item,index) in weekList" :label="item.value">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-if="editForm.circleType=='month'">
            <div class="date-list">
              <el-checkbox-group v-model="month" @change="changeMonth">
                <el-checkbox style="width: 50px;" v-for="(item,index) in datesList" :label="item.value">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>


        <el-form-item label="参会人数" prop="attenderNum">
          <el-input-number v-model="editForm.attenderNum" :min="0" :max="200"></el-input-number>
        </el-form-item>

        <el-form-item label="参会客户数" prop="customerNum">
          <el-input-number v-model="editForm.customerNum" :min="0" :max="200"></el-input-number>
        </el-form-item>



        <el-form-item label="其他参加" prop="otherAttender">
          <el-input type="textarea" :rows="4" v-model="editForm.otherAttender" placeholder="其他参加"></el-input>
        </el-form-item>
        <el-form-item label="申请备注" prop="requireRemark">
          <el-input type="textarea" :rows="4" v-model="editForm.requireRemark" placeholder="申请备注"></el-input>
        </el-form-item>

        <el-form-item label="附件">
          <upload v-if="fileVisible" :archiveId="editForm.id" :branchId="userInfo.branchId" @on-change="onChange">
          </upload>
        </el-form-item>

        <el-form-item>
          <el-col :span="16" :offset="8">
            <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.add" type="primary" @click.native="editSubmit" :disabled="load.add==true">提交
            </el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-dialog append-to-body title="选择用户" :visible.sync="selectUserFormVisible" width="80%">
        <users-select :is-single-user='isSingleUser'  @confirm="onUserSelected">
        </users-select>
      </el-dialog>

      <!-- <el-dialog append-to-body title="选择客户" :visible.sync="selectCustomerFormVisible" width="80%">
            <customer-select @cancel="selectCustomerFormVisible = false" @getSelectCustomers="onCustomerSelected">
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
    editMeetMeeting,
    getMeetMeeting
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


  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    props: ['meetMeeting', 'visible'],
    watch: { //数据发生变化，才会触发
      'meetMeeting': function(meetMeeting) {
        this.editForm = Object.assign(this.editForm, this.meetMeeting);

        if (this.editForm.reminders != '') {
          this.checkList = this.editForm.reminders.split(",")
        }

        //获取参与人员attenders、上传文件
        this.getMeetMeeting()

        this.editForm.isUsingReturn == '1' ? this.editForm.isUsingReturn = true : this.editForm.isUsingReturn = false
        this.editForm.isUsingSignin == '1' ? this.editForm.isUsingSignin = true : this.editForm.isUsingSignin = false


        //提醒分钟
        this.setMinute()

        //日期、周期、月份
        this.setDateWeekMonth()



        this.getMeetBoardrooms()
        this.getMeetCategorys()
      },
      'visible': function(visible) {
        if (visible == true) {
          //从新打开页面时某些数据需要重新加载，可以在这里添加

          this.fileVisible = true
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
        editFormRules: {
          name: [{
            required: true,
            message: '主题不能为空',
            trigger: 'change'
          }],
          startTime: [{
            required: true,
            message: '开始时间不能为空',
            trigger: 'change'
          }],
          endTime: [{
              required: true,
              message: '结束不能为空',
              trigger: 'change'
            },
            // { validator: changTime,  trigger: 'change' }
          ]
        },
        //新增界面数据 meet_meeting
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
          remindersImmediate: false,
          remindersBeforeStart: '',
          remindersBeforeEnd: '',
          circleable: false,
          circleType: '',
          circcleDates: '',
          circleDaysOfWeek: '',
          circleDaysOfMonth: '',
          content: '',
          otherAttender: '',
          attenderNum: '',
          customerNum: '',
          isUsingReturn: false,
          isUsingSignin: false,
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
        customers: [],
        attenders: [],
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
          value: '0',
          name: '周日',
        }, {
          value: '1',
          name: '周一',
        }, {
          value: '2',
          name: '周二',
        }, {
          value: '3',
          name: '周三',
        }, {
          value: '4',
          name: '周四',
        }, {
          value: '5',
          name: '周五',
        }, {
          value: '6',
          name: '周六',
        }],
        week: [],
        datesList: '',
        month: []
        /**end 在上面加自定义属性**/
      } //end return
    }, //end data
    methods: {
      // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
      handleCancel: function() {
        //this.$refs['editForm'].resetFields();
        this.$emit('cancel');
      },
      //新增提交MeetMeeting meet_meeting 父组件监听@submit="aftereEditSubmit"
      editSubmit: function() {

        this.$refs.editForm.validate((valid) => {
          if (valid) {
            var start = this.timeToSec(this.editForm.startTime + ':00')
            var end = this.timeToSec(this.editForm.endTime + ':00')
            if (end <= start) {
              this.$message({
                message: "会议开始时间不能晚于结束时间",
                type: 'error'
              });
              return false;
            }
            this.load.add = true

             let validParam = {
               id: this.editForm.id,
               roomId:this.editForm.roomId,
               startTime:this.editForm.startTime,
               endTime:this.editForm.endTime
             }
             //冲突判断
             checkMeetingTime(validParam).then((res) => {
               let tips = res.data.tips;
               if (tips.isOk) {
                 this.editMeeting()
               } else {
                 this.$confirm(res.data.tips.msg+"，是否继续？", '提示', {}).then(() => {
                   this.editMeeting()
                 }).catch(() => {
                   this.$message({
                     type: 'info',
                     message: '已取消操作'
                   });
                   this.load.add = false;
                   return false;
                 });
               }
             })
          }
        });
      },
      editMeeting() {
        this.editForm.reminders = ''
        //简单修改数据
        if (this.checkList.length > 0) {
          this.checkList.forEach((check) => {
            this.editForm.reminders = this.editForm.reminders + check + ","
          })
        }
        // this.editForm.startTime = new Date(this.editForm.startTime).getTime()
        // this.editForm.endTime = new Date(this.editForm.endTime).getTime()

        // this.editForm.remindersBeforeStart = this.editForm.startTime - (3600 * 1000 * this.hour) - (this.minute * 60 *
        //   1000)


        this.editForm.isUsingReturn ? this.editForm.isUsingReturn = 1 : this.editForm.isUsingReturn = 0
        this.editForm.isUsingSignin ? this.editForm.isUsingSignin = 1 : this.editForm.isUsingSignin = 0
        this.editForm.branchId = this.userInfo.branchId
        this.editForm.requireUserid = this.userInfo.userid
        this.editForm.requireUsername = this.userInfo.username
        this.editForm.deptid = this.userInfo.deptid
        this.editForm.deptName = this.userInfo.deptName
        this.editForm.remindersImmediate ? this.editForm.remindersImmediate = 1 : this.editForm.remindersImmediate = 0
        this.editForm.circleable ? this.editForm.circleable = 1 : this.editForm.circleable = 0



        //attender
        if (this.editForm.attenders) {
          this.editForm.attenders.forEach((item) => {
            item.userid = item.userId
          })
        }


        //处理时间格式
        let date = this.editForm.execCalcDate.substring(0, 10)
        if (this.editForm.remindersBeforeStart) {
          let startDate = date + ' ' + this.editForm.startTime + ':00'
          let beforeDate = util.getAboutTime(startDate, this.editForm.remindersBeforeStart)
          this.editForm.remindersBeforeStart = util.getDate() + ' ' + beforeDate + ':00'
        }
        if (this.editForm.remindersBeforeEnd) {
          let endDate = date + ' ' + this.editForm.endTime + ':00'
          let afterDate = util.getAboutTime(endDate, this.editForm.remindersBeforeEnd)
          this.editForm.remindersBeforeEnd = util.getDate() + ' ' + afterDate + ':00'
        }




        //处理循环
        if (this.editForm.circleable == 0) {
          this.editForm.circleType = ''
          this.editForm.circcleDates = ''
          this.editForm.circleDaysOfWeek = ''
          this.editForm.circleDaysOfMonth = ''
          this.valueDateArr = []
          this.datesList = ''
        }
        if (this.editForm.circleable == 1) {
          let value = this.editForm.circleType
          if (value == 'date') {
            this.editForm.circleDaysOfWeek = ''
            this.editForm.circleDaysOfMonth = ''
          }
          if (value == 'week') {
            this.editForm.circcleDates = ''
            this.editForm.circleDaysOfMonth = ''
          }
          if (value == 'month') {
            this.editForm.circcleDates = ''
            this.editForm.circleDaysOfWeek = ''
          }
        }

        console.log(this.editForm)
        // return



        let params = Object.assign({}, this.editForm);
        editMeetMeeting(params).then((res) => {
          this.load.add = false
          var tips = res.data.tips;
          if (tips.isOk) {
            this.$emit('submit'); //  @submit="afterAddSubmit"
          }
          this.$message({
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });
        }).catch(err => this.load.add = false);
      },
      getMeetMeeting() {
        let params = {
          meetingId: this.editForm.id
        }
        getMeetMeeting(params).then((res) => {
          // var tips = res.data.tips;
          if (res.data.data != null) {
            // this.editForm=Object.assign(this.editForm, res.data.data);
            this.editForm.attenders = res.data.data
            // this.editForm.meetMeetingAppendix = res.data.meetMeetingAppendix
          } else {}
        })
      },
      /**begin 在下面加自定义方法,记得补上面的一个逗号**/
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
        this.editForm.typeId = item.id
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
          this.editForm.categoryName = filters[0].name
        }
        //console.log(filters)
      },
      //选择会议室
      selectMeetBoardroom(value) {
        let filters = this.restaurants.filter((obj) => obj.id == value)
        if (filters != null && filters.length > 0) {
          this.editForm.roomName = filters[0].value
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
          this.editForm.signinUserid = users[0].userid
          this.editForm.signinUsername = users[0].username
        } else {
          users.forEach((item) => {
            let user = {
              id: '',
              meetingId: this.editForm.id,
              userId: item.userid,
              username: item.username,
              status: '',
              remark: '',
            }
            this.editForm.attenders.push(user)
          })
        }
        this.selectUserFormVisible = false
      },
      handleClose(value) {
        if (this.editForm.attenders != null && this.editForm.attenders.length > 0) {
          this.editForm.attenders.splice(this.editForm.attenders.indexOf(value), 1)
        }

      },

      handleCloseCustomers(value) {
        if (this.editForm.customers != null && this.editForm.customers.length > 0) {
          this.editForm.customers.splice(this.editForm.customers.indexOf(value), 1)
        }

      },
      onCustomerSelected(vls) {
        //console.log(vls)
        vls.forEach((item) => {
          let customer = {
            id: '',
            meetingId: this.editForm.id,
            customerId: item.customerId,
            customerName: item.customerName,
            status: '',
            remark: '',
          }
          this.editForm.customers.push(customer)
        })
        this.selectCustomerFormVisible = false

      },

      onChange: function(file, fileList) {
        //this.editForm.driverCardImageUrl = file.url
        // console.log(file)
        // console.log(fileList)
        let list = []
        if (fileList != null && fileList.length > 0) {
          fileList.forEach((item) => {
            let fileOne = {
              id: item.id,
              meetingId: this.editForm.id,
              name: item.name,
              addr: item.url,
              type: item.fileSuffix,
              remark: item.remark,
            }
            list.push(fileOne)
          })
          this.editForm.meetMeetingAppendix = list
        }
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
        this.editForm.startTime = e
      },
      changeEndTime(e) {
        this.editForm.endTime = e
      },
      switchXh(e) {
        this.editForm.circleable = e
        if (this.editForm.circleable) {
          this.getDaysArr()
        }
      },
      changeCircleType(e) {
        this.editForm.circleType = e
      },
      changeDate(e) {
        this.valueDateArr.push(e)
        var set = new Set(this.valueDateArr)
        this.valueDateArr = [...set]
        this.editForm.circcleDates = this.valueDateArr.toString()
      },
      delDates(i) {
        this.valueDateArr.splice(i, 1)
        this.editForm.circcleDates = this.valueDateArr.toString()
      },
      getDaysArr() {
        var daysArr = []
        for (let i = 1; i <= 31; i++) {
          daysArr.push({
            value: i.toString(),
            name: i,
          })
        }
        console.log(this.datesList)
        this.datesList = daysArr
      },
      changeWeek(e) {
        this.editForm.circleDaysOfWeek = e.toString()
      },
      changeMonth(e) {
        this.editForm.circleDaysOfMonth = e.toString()
      },
      //提醒分钟
      setMinute() {
        let date = this.editForm.execCalcDate.substring(0, 10),
          starTime = '',
          beforeTime = '',
          endTime = '',
          afterTime = ''
        if (this.editForm.remindersBeforeStart) {
          starTime = date + ' ' + this.editForm.startTime + ':00'
          this.editForm.remindersBeforeStart = util.timeDifference(this.editForm.remindersBeforeStart, starTime)
        }
        if (this.editForm.remindersBeforeEnd) {
          endTime = date + ' ' + this.editForm.endTime + ':00'
          this.editForm.remindersBeforeEnd = util.timeDifference(this.editForm.remindersBeforeEnd, endTime)
        }
      },
      //日期、周期、月份
      setDateWeekMonth(){
        //日期、周期、月份
        if (this.editForm.circleable) {
          this.getDaysArr()
        }
        if (this.editForm.circleType == 'date') {
        	this.valueDateArr = this.editForm.circcleDates.split(',')
        }
        if (this.editForm.circleType == 'week') {
        	this.week = this.editForm.circleDaysOfWeek.split(',')
        }
        if (this.editForm.circleType == 'month') {
        	this.month = this.editForm.circleDaysOfMonth.split(',')
        }
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
      this.editForm = Object.assign(this.editForm, this.meetMeeting);
      if (this.editForm.reminders != '') {
        this.checkList = this.editForm.reminders.split(",")
      }

      console.log(this.editForm)

      // this.getMeetMeeting()

      this.editForm.isUsingReturn == '1' ? this.editForm.isUsingReturn = true : this.editForm.isUsingReturn = false
      this.editForm.isUsingSignin == '1' ? this.editForm.isUsingSignin = true : this.editForm.isUsingSignin = false
      this.editForm.remindersImmediate == '1' ? this.editForm.remindersImmediate = true : this.editForm
        .remindersImmediate = false
      this.editForm.circleable == '1' ? this.editForm.circleable = true : this.editForm.circleable = false
      this.fileVisible = true




      //提醒分钟
      this.setMinute()

      //获取参与人员attenders、上传文件
      this.getMeetMeeting()

      //日期、周期、月份
      this.setDateWeekMonth()

      this.getMeetBoardrooms()
      this.getMeetCategorys()
    }, //end mounted
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
