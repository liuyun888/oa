<template>
  <section>
    <el-row class="app-container rc-edit">
      <el-col>
        <!--新增界面 RcSchedule rc_schedule-->
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
          <!-- <el-col :span="22">
						<el-form-item label="日程类型" placeholder="日程类型">
							<el-select placeholder="" v-model="editForm.rcType">
								<el-option
									v-for="item in options.rcTypeList"
									:key="item.id"
									:label="item.value"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col> -->
          <el-col :span="22">
            <el-form-item label="日程标题">
              <el-input v-model="editForm.title" placeholder="日程标题"></el-input>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="22">
						<el-form-item label="接收人" >
							<el-input @click.native="userSelectVisible=true" v-model="editForm.receiveUsername" suffix-icon="el-icon-search" placeholder="接收人"></el-input>
						</el-form-item>
					</el-col> -->
          <el-col :span="22">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker v-model="editForm.startTime" type="dates" value-format="HH:mm" format="HH:mm"
                placeholder="选择日期时间">
              </el-time-picker>
            </el-form-item>
          </el-col>


          <el-col :span="22">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker v-model="editForm.endTime" type="dates" value-format="HH:mm" format="HH:mm"
                placeholder="选择日期时间">
              </el-time-picker>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="日程描述">
              <el-input type="textarea" :rows="2" v-model="editForm.description" placeholder="日程描述"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="22">
            <el-form-item label="紧急程度">
              <el-select placeholder="紧急程度" v-model="editForm.urgent">
                <el-option v-for="item in options.urgentList" :key="item.id" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="提醒类型">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="item in options.remindList" :key="item.id" :label="item.id">{{item.value}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>


          <el-col :span="22">
            <el-form-item label="立即提醒" prop="remindNowtime">
              <el-switch v-model="editForm.remindNowtime">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="开始前提醒">
              <el-input v-model="editForm.remindBeforestart" type="number" placeholder="分钟"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="结束前提醒">
              <el-input v-model="editForm.remindBeforeend" type="number" placeholder="分钟"></el-input>
            </el-form-item>
          </el-col>

          <el-form-item label="是否循环" prop="circleable">
            <el-switch v-model="editForm.circleable" @change="switchXh" active-text="" inactive-text="">
            </el-switch>
          </el-form-item>

          <div style="margin-bottom: 22px;">
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

          <el-col>
            <el-form-item class="btn-bar">
              <el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交
              </el-button>
              <el-button @click.native="handleCancel">取消</el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-col>



      <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
        <users-select :select-userids="filters.assignee?[filters.assignee.userid]:[]" @confirm="onUserSelected">
        </users-select>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    editRcSchedule
  } from '@/api/oa/rc/rcSchedule';
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
  import {
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      // getRemindType() {
      //   return this.editForm.remindType;
      // },
      // getStart_Flag() {
      //   return this.editForm.remindBeforestart_flag;
      // },
      // getEnd_Flag() {
      //   return this.editForm.remindBeforeend_flag;
      // },
      // getStartTime() {
      //   return this.editForm.startTime;
      // },
      // getEndTime() {
      //   return this.editForm.endTime;
      // },
    },
    props: ['rcSchedule', 'visible'],
    watch: {
      'rcSchedule': function(rcSchedule) {
        // this.remindbeforestartHour = parseInt(rcSchedule.remindBeforestart / 60);
        // this.remindbeforestartMin = parseInt(rcSchedule.remindBeforestart % 60);
        // this.remindbeforeendHour = parseInt(rcSchedule.remindBeforeend / 60);
        // this.remindbeforeendMin = parseInt(rcSchedule.remindBeforeend % 60);


        // rcSchedule.remindBeforestart_flag = rcSchedule.remindBeforestart != "";
        // rcSchedule.remindBeforeend_flag = rcSchedule.remindBeforeend != "";
        this.editForm = Object.assign(this.editForm, rcSchedule);
        if (this.editForm.remindType != "") {
          this.checkList = this.editForm.remindType.split(",");
        }

        this.editForm.remindNowtime == '1' ? this.editForm.remindNowtime = true : this.editForm.remindNowtime = false
        this.editForm.circleable == '1' ? this.editForm.circleable = true : this.editForm.circleable = false

        //分钟
        this.setMinute()

        //日期、周期、月份
        this.setDateWeekMonth()



        // console.log(this.editForm);
      },
      'visible': function(visible) {
        if (visible == true) {
          //从新打开页面时某些数据需要重新加载，可以在这里添加z1
        }
      },
    },
    data() {
      return {
        filters: {
          assignee: null,
        },
        options: {
          remindList: [{
              id: '0',
              value: "短信提醒"
            },
            {
              id: '1',
              value: "邮件提醒"
            }
          ], //提醒类型集,在元数据中可以定义获取
          rcTypeList: [{
              id: 1,
              value: "工作安排"
            },
            {
              id: 2,
              value: "会议日程"
            },
          ], //日程类型集
          urgentList: [{
              id: 1,
              value: "一般"
            },
            {
              id: 2,
              value: "重要"
            },
            {
              id: 3,
              value: "紧急"
            },
          ], //日程类型集
        }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        editFormRules: {},
        //编辑界面数据  RcSchedule rc_schedule
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
          remindNowtime: false,
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          branchId: '',
          circleable: false,
          circleType: '',
          circcleDates: '',
          circleDaysOfWeek: '',
          circleDaysOfMonth: '',
        },
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        checkList: [],
        remindbeforestartHour: 0,
        remindbeforestartMin: 10,
        remindbeforeendHour: 0,
        remindbeforeendMin: 10,
        userSelectVisible: false,
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
        this.$refs['editForm'].resetFields();
        this.$emit('cancel');
      },
      //编辑提交RcSchedule rc_schedule父组件监听@submit="afterEditSubmit"
      editSubmit: function() {



        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.load.edit = true;

              this.editForm.remindNowtime ? this.editForm.remindNowtime = '1' : this.editForm.remindNowtime =
                '0'
              this.editForm.circleable ? this.editForm.circleable = '1' : this.editForm.circleable = '0'

              //时间
              var start = this.timeToSec(this.editForm.startTime + ':00')
              var end = this.timeToSec(this.editForm.endTime + ':00')
              if (end <= start) {
                this.$message({
                  message: "日程开始时间不能晚于结束时间",
                  type: 'error'
                });
                return false;
              }

              //处理时间格式
              let date = util.getDate()
              if (this.editForm.remindBeforestart) {
                let startDate = date + ' ' + this.editForm.startTime + ':00'
                let beforeDate = util.getAboutTime(startDate, parseInt(this.editForm.remindBeforestart))
                this.editForm.remindBeforestart = util.getDate() + ' ' + beforeDate + ':00'
              }
              if (this.editForm.remindBeforeend) {
                let endDate = date + ' ' + this.editForm.endTime + ':00'
                let afterDate = util.getAboutTime(endDate, parseInt(this.editForm.remindBeforeend))
                this.editForm.remindBeforeend = util.getDate() + ' ' + afterDate + ':00'
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



              let params = Object.assign({}, this.editForm);
              editRcSchedule(params).then((res) => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs['editForm'].resetFields();
                  this.$emit('submit'); //  @submit="afterEditSubmit"
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });
              }).catch(err => this.load.edit = false);
            });
          }
        });
      },
      /**begin 在下面加自定义方法,记得补上面的一个逗号**/
      //选择接收人
      onUserSelected: function(users) {
        this.userSelectVisible = false;
        let userids = [];
        let usernames = [];
        for (let i = 0; i < users.length; i++) {
          userids.push(users[i].userid);
          usernames.push(users[i].username);
        }
        this.editForm.receiveUserid = userids.join(",");
        this.editForm.receiveUsername = usernames.join(",");
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
        //分钟
        let date = this.editForm.execCalcDate.substring(0, 10),
          starTime = '',
          beforeTime = '',
          endTime = '',
          afterTime = ''
        if (this.editForm.remindBeforestart) {
          starTime = date + ' ' + this.editForm.startTime + ':00'
          this.editForm.remindBeforestart = util.timeDifference(this.editForm.remindBeforestart, starTime)
        }
        if (this.editForm.remindBeforeend) {
          endTime = date + ' ' + this.editForm.endTime + ':00'
          this.editForm.remindBeforeend = util.timeDifference(this.editForm.remindBeforeend, endTime)
        }
      },
      //日期、周期、月份
      setDateWeekMonth() {
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
      UsersSelect,
      //在下面添加其它组件 'rc-schedule-edit':RcScheduleEdit
    },
    mounted() {
      this.editForm = Object.assign(this.editForm, this.rcSchedule);
      console.log(this.editForm)
      if (this.editForm.remindType != "") {
        this.checkList = this.editForm.remindType.split(",");
      }
      this.editForm.remindNowtime == '1' ? this.editForm.remindNowtime = true : this.editForm.remindNowtime = false
      this.editForm.circleable == '1' ? this.editForm.circleable = true : this.editForm.circleable = false

      //提醒分钟
      this.setMinute()

      //日期、周期、月份
      this.setDateWeekMonth()

    }
  }
</script>

<style scoped>
  .rc-edit {
    padding: 10px 20px;
  }

  .rc-edit .el-form-item {
    margin-bottom: 10px;
  }

  .rc-edit .el-form-item__label {
    min-width: 100px;
  }

  .rc-edit .el-form-item__content>div {
    width: 100% !important;
  }

  .el-col-22 {
    margin-bottom: 11px;
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

  .el-radio-group {
    margin-left: 120px;
  }
</style>

<style>
  .el-form-item__content {
    line-height: 40px;
    position: unset;
    font-size: 14px;
  }
</style>
