<template>
  <section>
    <el-row class="app-container rc-show">
      <!--显示界面 RcSchedule rc_schedule-->
      <el-form :model="showForm" label-width="120px" :rules="showFormRules" ref="showForm">
        <!-- <el-col :span="22">
					<el-form-item label="日程类型" prop="rcType">
						<el-input class="no-border" type="text" readonly="readonly" v-model="showForm.rcType" ></el-input>
					</el-form-item>
				</el-col> -->
        <el-col :span="22">
          <el-form-item label="日程标题" prop="title">
            <el-input v-model="showForm.title" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="日程开始时间" prop="startTime">
            <el-input v-model="showForm.startTime" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="日程结束时间" prop="endTime">
            <el-input v-model="showForm.endTime" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="日程内容" prop="description">
            <el-input v-model="showForm.description" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="日程创建人" prop="createUsername">
            <el-input v-model="showForm.createUsername" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="22">
					<el-form-item label="日程接收人" prop="receiveUsername">
						<el-input v-model="showForm.receiveUsername" readonly="readonly" ></el-input>
					</el-form-item>
				</el-col> -->
        <el-col :span="22">
          <el-form-item label="紧急程度" prop="urgent">
            <el-input v-model="showForm.urgent" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="22">
          <el-form-item v-if="isexist(showForm.remindType)" label="提醒类型" prop="remindType">
            <el-input v-model="showForm.remindType" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item v-if="isexist(showForm.remindType) && isexist(showForm.remindNowtime)" label="立即提醒"
            prop="remindNowtime">
            <el-input value="已开启" readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item v-if="isexist(showForm.remindType) && isexist(showForm.remindBeforestart)" label="开始前提醒时间"
            prop="remindBeforestart_flag">
            <el-input readonly="readonly" style="width:auto !important;" type="number" min="0"
              v-model="remindbeforestartHour"></el-input><span>&nbsp;小时&nbsp;</span>
            <el-input readonly="readonly" style="width:auto !important;" type="number" min="0"
              v-model="remindbeforestartMin"></el-input><span>&nbsp;分钟&nbsp;</span>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item v-if="isexist(showForm.remindType) && isexist(showForm.remindBeforeend)" label="结束前提醒时间"
            prop="remindBeforeend">
            <el-input readonly="readonly" style="width:auto !important;" type="number" min="0"
              v-model="remindbeforeendHour"></el-input><span>&nbsp;小时&nbsp;</span>
            <el-input readonly="readonly" style="width:auto !important;" type="number" min="0"
              v-model="remindbeforeendMin"></el-input><span>&nbsp;分钟&nbsp;</span>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="btn-bar">
      <el-button size="mini" type="primary" @click="showEdit()">编辑</el-button>
      <el-button size="mini" type="primary" @click="complete()">完成</el-button>
      <el-button size="mini" type="danger" @click="delSchedule()">删除</el-button>
      <!-- <el-button size="mini" type="primary" @click="showLog()">日志</el-button> -->
      <!-- <el-popover
  			placement="top"
				style="min-width:120px"
				v-model="btnVisible">
				<div class="more">
					<el-button type="text" @click="showEdit()"><i class="el-icon-d-arrow-right el-icon--left"></i>编辑</el-button>
					<el-button type="text" @click="complete()"><i class="el-icon-d-arrow-right el-icon--left"></i>完成</el-button>
					<el-button type="text" @click="delSchedule()"><i class="el-icon-d-arrow-right el-icon--left"></i>删除</el-button>
					<el-button type="text" @click="showLog()"><i class="el-icon-d-arrow-right el-icon--left"></i>日志</el-button>
					<el-button type="text"><i class="el-icon-d-arrow-right el-icon--left"></i>共享</el-button>
					<el-button type="text"><i class="el-icon-d-arrow-right el-icon--left"></i>分享</el-button>
					<el-button type="text"><i class="el-icon-d-arrow-right el-icon--left"></i>收藏</el-button>
					<el-button type="text"><i class="el-icon-d-arrow-right el-icon--left"></i>帮助</el-button>
				</div>
			<el-button slot="reference" size="mini">更多<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
		</el-popover> -->
    </div>
    <el-dialog title="查看日志" :visible.sync="recordFormVisible" width="80%" :close-on-click-modal="false" append-to-body>
      <rc-schedule-record :rc-schedule-id="rcScheduleId" :visible="recordFormVisible" @cancel="recordFormVisible=false">
      </rc-schedule-record>
    </el-dialog>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import {
    listRcSchedule,
    completeRcSchedule,
    delRcSchedule
  } from '@/api/oa/rc/rcSchedule';
  import {
    showRcScheduleRecord
  } from '@/api/oa/rc/rcScheduleRecord';
  import RcScheduleRecordMng from '../rcScheduleRecord/RcScheduleRecordMng'; //新增日程界面
  import {
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    props: ['rcSchedule', 'visible'],
    watch: {
      'rcSchedule': function(rcSchedule) {
        this.remindbeforestartHour = parseInt(rcSchedule.remindBeforestart / 60);
        this.remindbeforestartMin = parseInt(rcSchedule.remindBeforestart % 60);
        this.remindbeforeendHour = parseInt(rcSchedule.remindBeforeend / 60);
        this.remindbeforeendMin = parseInt(rcSchedule.remindBeforeend % 60);
        this.showForm = rcSchedule;
        // console.log(111)
        // console.log(this.rcSchedule)

      },
      'visible': function(visible) {
        if (visible == true) {
          //从新打开页面时某些数据需要重新加载，可以在这里添加
        }
      }
    },
    data() {
      return {
        options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
        load: {
          list: false,
          edit: false,
          del: false,
          add: false,
          show: false
        }, //查询中...
        showFormRules: {
          id: [
            //{ required: true, message: '日程id不能为空', trigger: 'change' }
          ]
        },
        //编辑界面数据  RcSchedule rc_schedule
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
        /**begin 在下面加自定义属性,记得补上面的一个逗号**/
        recordFormVisible: false, //日志查看界面是否显示
        remindbeforestartHour: 0,
        remindbeforestartMin: 0,
        remindbeforeendHour: 0,
        remindbeforeendMin: 0,
        rcScheduleId: "",
        btnVisible: false,
        start:'',
        end:''
        /**end 在上面加自定义属性**/
      } //end return
    }, //end data
    methods: {
      showEdit() {
        this.$emit("edit");
      },
      complete() {
        this.$refs.showForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认完成吗？', "提示", {}).then(() => {
              this.load.edit = true;
              let params = Object.assign({}, this.showForm);
              completeRcSchedule(params).then((res) => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs['showForm'].resetFields;
                  this.$emit('submit'); //  @submit="afterShowSubmit"
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
      delSchedule() {
        this.$refs.showForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认删除吗？', "提示", {}).then(() => {
              this.load.del = true;
              let params = Object.assign({}, this.showForm);
              delRcSchedule(params).then((res) => {
                this.load.del = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.$refs['showForm'].resetFields;
                  this.$emit('submit'); //  @submit="afterShowSubmit"
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });
              }).catch(err => this.load.del = false);
            });
          }
        });
      },
      showLog() {
        this.rcScheduleId = this.showForm.id;
        this.recordFormVisible = true;
      },
      // 取消按钮点击 父组件监听@cancel="showFormVisible=false" 监听
      handleCancel: function() {
        this.$refs['showForm'].resetFields();
        this.$emit('cancel');
      },
      /**begin 在下面加自定义方法,记得补上面的一个逗号**/
      isexist(c) {
        if (c != null && c != "" && c != "false") {
          return true;
        } else {
          return false;
        }
      },
      /**end 在上面加自定义方法**/
    }, //end method
    components: {
      'rc-schedule-record': RcScheduleRecordMng,
      //在下面添加其它组件 'rc-schedule-edit':RcScheduleEdit
    },
    mounted() {
      this.showForm = Object.assign(this.showForm, this.rcSchedule);
      this.remindbeforestartHour = parseInt(this.showForm.remindBeforestart / 60);
      this.remindbeforestartMin = parseInt(this.showForm.remindBeforestart % 60);
      this.remindbeforeendHour = parseInt(this.showForm.remindBeforeend / 60);
      this.remindbeforeendMin = parseInt(this.showForm.remindBeforeend % 60);
    }
  }
</script>

<style>
  .rc-show {
    padding: 10px 20px;
  }

  .rc-show .el-form-item {
    margin-bottom: 10px;
  }

  .rc-show .el-input {
    border-bottom: 1px solid #DCDFE6;
  }

  .rc-show .el-input__inner {
    border: 0 !important;
  }

  .rc-show .rc-show .el-dialog__body {
    padding: 0 20px !important;
  }

  section>.btn-bar {
    text-align: right;
  }

  .more {
    background: #eee;
  }

  .more>button {
    display: block;
    width: 100%;
    margin-left: 0 !important;
    background: #fff;
    text-align: left;
    padding: 0 !important;
    height: 30px;
    border: 0;
    color: #222;
  }

  .more>button span {
    height: 100%;
    display: block;
  }

  .more>button i {
    background: #eee;
    height: 30px;
    line-height: 30px;
    width: 30px;
    text-align: center;
  }
</style>
