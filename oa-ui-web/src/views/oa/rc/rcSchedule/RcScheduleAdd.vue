<template>
  <section>
    <el-row class="app-container rc-add">
      <el-col>
        <!--新增界面 RcSchedule rc_schedule-->
        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          <!-- <el-col :span="22">
						<el-form-item label="日程类型" placeholder="日程类型">
							<el-select placeholder="" v-model="addForm.rcType">
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
            <el-form-item label="日程标题" prop="title">
              <el-input v-model="addForm.title" placeholder="日程标题"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker v-model="addForm.startTime" type="dates" value-format="HH:mm" format="HH:mm"
                placeholder="选择日期时间">
              </el-time-picker>
            </el-form-item>
          </el-col>


          <el-col :span="22">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker v-model="addForm.endTime" type="dates" value-format="HH:mm" format="HH:mm"
                placeholder="选择日期时间">
              </el-time-picker>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="日程描述" prop="description">
              <el-input type="textarea" :rows="2" v-model="addForm.description" placeholder="日程描述"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="22">
            <el-form-item label="接收人" prop="receiveuserName">
              <el-input @click.native="userSelectVisible=true" v-model="addForm.receiveUsername"
                suffix-icon="el-icon-search" placeholder="接收人"></el-input>
            </el-form-item>
          </el-col> -->


          <el-col :span="22">
            <el-form-item label="紧急程度">
              <el-select placeholder="紧急程度" v-model="addForm.urgent">
                <el-option v-for="item in options.urgentList" :key="item.id" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="提醒类型">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="0">邮件</el-checkbox>
                <el-checkbox label="1">短信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="立即提醒" prop="remindNowtime">
              <el-switch v-model="addForm.remindNowtime">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="开始前提醒">
              <el-input v-model="addForm.remindBeforestart" type="number" placeholder="分钟"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="结束前提醒">
              <el-input v-model="addForm.remindBeforeend" type="number"  placeholder="分钟"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="是否循环" prop="circleable">
              <el-switch v-model="addForm.circleable" @change="switchXh" active-text="" inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-radio-group v-if="addForm.circleable==1" v-model="addForm.circleType" @change="changeCircleType">
              <el-radio v-for="(item) in circleTypeArr" :label="item.value">{{item.name}}</el-radio>
            </el-radio-group>
          </el-col>

          <el-col :span="22">
            <div style="margin-left: 120px; margin-bottom: 22px;" v-if="addForm.circleable==1">
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
          </el-col>

       <!--   <el-col :span="22">

          </el-col>


 -->

          <el-col>
            <el-form-item class="btn-bar">
              <el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交
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
    addRcSchedule
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
    },
    props: ['rcSchedule', 'visible'],
    watch: {
      'rcSchedule': function(rcSchedule) {
        this.addForm = rcSchedule;

      },
      'visible': function(visible) {
        if (visible == true) {
          // this.remindType_check = [];
          console.log(this.remindType_check)
          if (this.addForm.remindType_check != '') {
            this.remindType_check = this.addForm.remindType_check.split(",")
          }
          //从新打开页面时某些数据需要重新加载，可以在这里添加
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
              id: 1,
              value: "短信提醒"
            },
            {
              id: 2,
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
        }, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        load: {
          list: false,
          edit: false,
          del: false,
          add: false
        }, //查询中...
        addFormRules: {
          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'change'
          }],
        },
        //新增界面数据 rc_schedule
        addForm: {
          // id: '',
          createUserid: '',
          createUsername: '',
          receiveUserid: '',
          receiveUsername: '',
          branchId: '',
          title: '',
          description: '',
          rcType: '',
          startTime: '',
          endTime: '',
          urgent: '',
          remindType:'',
          remindNowtime: false,
          remindBeforestart: '',
          remindBeforeend: '',
          status: '',
          circleable: false,
          circleType: '',
          circcleDates: '',
          circleDaysOfWeek: '',
          circleDaysOfMonth: '',
        },
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        remindType_check: [],
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
        month: [],
        /**end 在上面加自定义属性**/
      } //end return
    }, //end data
    methods: {
      // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
      handleCancel: function() {
        this.$refs['addForm'].resetFields();
        this.$emit('cancel');
      },
      //新增提交RcSchedule rc_schedule 父组件监听@submit="afterAddSubmit"
      addSubmit: function() {
        //时间
        var start = this.timeToSec(this.addForm.startTime + ':00')
        var end = this.timeToSec(this.addForm.endTime + ':00')
        if (end <= start) {
          this.$message({
            message: "日程开始时间不能晚于结束时间",
            type: 'error'
          });
          return false;
        }



        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addForm.createUserid = this.userInfo.userid;
              this.addForm.createUsername = this.userInfo.username;
              this.addForm.receiveUserid = this.userInfo.userid;
              this.addForm.receiveUsername = this.userInfo.username;
              this.addForm.branchId = this.userInfo.branchId;
              this.load.add = true;

              //简单修改数据
              if (this.checkList.length > 0) {
                this.checkList.forEach((check) => {
                  this.addForm.remindType = this.addForm.remindType + check + ","
                })
              }
              
              console.log( this.addForm.remindType)

              this.addForm.remindNowtime ? this.addForm.remindNowtime = 1 : this.addForm.remindNowtime = 0
              this.addForm.circleable ? this.addForm.circleable = 1 : this.addForm.circleable = 0

              //处理时间格式
              let date = util.getDate()
              if (this.addForm.remindBeforestart) {
                let startDate = date + ' ' + this.addForm.startTime + ':00'
                let beforeDate = util.getAboutTime(startDate, parseInt(this.addForm.remindBeforestart))
                this.addForm.remindBeforestart = util.getDate() + ' ' + beforeDate + ':00'
              }
              if (this.addForm.remindBeforeend) {
                let endDate = date + ' ' + this.addForm.endTime + ':00'
                let afterDate = util.getAboutTime(endDate, parseInt(this.addForm.remindBeforeend))
                this.addForm.remindBeforeend = util.getDate() + ' ' + afterDate + ':00'
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


              let params = Object.assign({}, this.addForm);

              console.log(params)



              addRcSchedule(params).then((res) => {
                this.load.add = false
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.remindType_check = [];
                  this.$refs['addForm'].resetFields();
                  this.$emit('submit'); //  @submit="afterAddSubmit"
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });
              }).catch(err => this.load.add = false);
            });
          }
        });
      },
      //选择接收人
      onUserSelected: function(users) {
        this.userSelectVisible = false;
        let userids = [];
        let usernames = [];
        for (let i = 0; i < users.length; i++) {
          userids.push(users[i].userid);
          usernames.push(users[i].username);
        }
        this.addForm.receiveUserid = userids.join(",");
        this.addForm.receiveUsername = usernames.join(",");
      },
      /**begin 在下面加自定义方法,记得补上面的一个逗号**/
      isexist(c) {
        if (c != null && c != "" && c != "false") {
          return true;
        } else {
          return false;
        }
      },
      // changeStartTime(e) {
      //   this.addForm.startTime = e
      // },
      // changeEndTime(e) {
      //   this.addForm.endTime = e
      // },
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
      switchXh(e) {
        this.addForm.circleable = e
        if (this.addForm.circleable) {
          this.getDaysArr()
        }
      },
      // changeCircleType(e) {
      //   this.addForm.circleType = e
      // },
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
      /**end 在上面加自定义方法**/

    }, //end method
    components: {
      UsersSelect,
      //在下面添加其它组件 'rc-schedule-edit':RcScheduleEdit
    },
    // this.addForm.startTime = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    // this.addForm.endTime = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+(d.getHours()+1)+":"+d.getMinutes()+":"+d.getSeconds();
    mounted() {
      this.addForm = Object.assign(this.addForm, this.rcSchedule);
      /**在下面写其它函数***/

    } //end mounted
  }
</script>

<style>
  .rc-add {
    padding: 10px 20px;
  }

  .rc-add .el-form-item {
    margin-bottom: 10px;
  }

  .rc-add .el-form-item__label {
    min-width: 100px;
  }

  .rc-add .el-form-item__content>div {
    width: 100% !important;
  }

  .el-col-22 {
      margin-bottom: 11px;
  }

  .rcs input[type="number"] {
      padding-left: 5px;
      padding-right: 0;
      width: 100%;
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
