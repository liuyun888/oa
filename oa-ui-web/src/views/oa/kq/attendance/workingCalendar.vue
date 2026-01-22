<template>
  <div class="container">
    <el-row class="page-container border padding">
      <el-row>
        <el-col :xs="22" :sm="22" :md="23" :lg="23" :xl="23">
          <!-- <el-date-picker v-model="calendarDate" type="month" placeholder="选择月"></el-date-picker> -->
          <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">新增假日</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <el-calendar v-model="calendar" v-loading="load.list">
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date,data}">
          <div>{{date.getDate() }}</div>
          <div v-for="(item,index) in  getCalendar(date,data)" :key="index">
            <el-tag v-text="item.tag" v-if="item.dbStatus == 0" @click.stop="clickTag(item)"></el-tag>
            <el-tag v-text="item.tag" v-if="item.dbStatus == 1" type="success" @click.stop="clickTag(item)"></el-tag>
            <el-tag v-text="item.tag" v-if="item.dbStatus == 2" type="danger" @click.stop="clickTag(item)"></el-tag>
          </div>
        </template>
      </el-calendar>
    </el-row>
    <!-- 新建节日 -->
    <el-dialog title="新建节日" :visible.sync="addDialogVisible" width="30%">
      <el-form ref="addForm" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="节日名称" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFestival('addForm')" v-loading="load.add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="tag">
          <el-input v-model="editForm.tag" :disabled="editForm.dbStatus != '2' ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker v-model="editForm.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker v-model="editForm.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="dbStatus" v-if="editForm.dbStatus != '2'">
          <el-radio v-model="editForm.dbStatus" label="0" @change="changeRadio('工作日')">工作日</el-radio>
          <el-radio v-model="editForm.dbStatus" label="1" @change="changeRadio('休息日')">休息日</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delBtn" v-loading="load.del">删 除</el-button>
        <el-button type="primary" @click="editBtn" v-loading="load.edit">保 存</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  //import Sticky from "@/components/Sticky"; // 粘性header组件
  import {
    listWorkCalendar,
    addKqYearDateAll,
    editKqYearDateAll,
    delKqYearDateAll,
  } from "@/api/oa/kq/kqYearDateAll";

  import {
    mapGetters
  } from "vuex";
  export default {
    computed: {
      ...mapGetters(["userInfo"]),
    },

    data() {
      return {
        calendar: new Date(),
        load: {
          list: false,
          edit: false,
          del: false,
          add: false,
          show: false
        }, //查询中...
        addDialogVisible: false,
        editDialogVisible: false,
        calendars: [],
        form: {
          id: "",
          branchId: "",
          repYear: "",
          month: "",
          tag: "",
          startTime: "",
          endTime: "",
          dbStatus: "",
        },
        editForm: {
          id: "",
          branchId: "",
          repYear: "",
          month: "",
          tag: "",
          startTime: "",
          endTime: "",
          dbStatus: "",
        },
        rules: {
          tag: [{
            required: true,
            message: "节日名称不能为空",
            trigger: "change"
          }],
          startTime: [{
            required: true,
            message: "开始时间不能为空",
            trigger: "change"
          }, ],
          endTime: [{
            required: true,
            message: "结束时间不能为空",
            trigger: "change"
          }, ],
        },
      };
    },
    methods: {
      getWorkCalendar() {
        let params = {
          branchId: this.userInfo.branchId,
          year: this.calendar.getFullYear(),
          month: this.calendar.getMonth() + 1,
        };
        this.load.list = true;
        listWorkCalendar(params)
          .then((res) => {
            this.load.list = false;
            let tips = res.data.tips;
            if (tips.isOk) {
              this.calendars = res.data.data;
            }
          })
          .catch((err) => {
            this.load.list = false;
          });
      },
      getCalendar(date, data) {
        //先判断当前日期是否包含在数据库中
        let dayData = this.getDayData(date);
        if (dayData.length > 0) {
          return dayData;
        } else {
          //如果不包含在数据库中的数据，则判断当前是星期几，默认周六日为休息日，其他时间为工作日
          let day = date.getDay();
          let d = {};
          if (day == 6 || day == 0) {
            d.tag = "休息日";
            d.dbStatus = "1";
          } else {
            d.tag = "工作日";
            d.dbStatus = "0";
          }
          d.branchId = this.userInfo.branchId;
          d.repYear = this.calendar.getFullYear();
          d.month = this.calendar.getMonth() + 1;
          d.startTime = data.day;
          d.endTime = data.day;
          dayData.push(d);
          return dayData;
        }
      },
      getDayData(date) {
        let data = [];
        for (let i = 0; i < this.calendars.length; i++) {
          let startTime = new Date(this.calendars[i].startTime).getTime();
          let endTime = new Date(this.calendars[i].endTime).getTime();
          let dayTime = date.getTime();
          if (startTime <= dayTime && endTime >= dayTime) {
            data.push(this.calendars[i]);
          }
        }
        return data;
      },
      //新增节日
      addFestival(addForm) {
        this.$refs[addForm]
          .validate((valid) => {
            if (valid) {
              let startTime = new Date(this.form.startTime).getTime();
              let endTime = new Date(this.form.endTime).getTime();
              if (startTime > endTime) {
                this.$message({
                  message: "开始时间不能早于结束时间",
                  type: "error",
                });
                return;
              }
              this.load.add = true;
              this.form.branchId = this.userInfo.branchId;
              this.form.repYear = this.calendar.getFullYear();
              this.form.month = this.calendar.getMonth() + 1;
              this.form.dbStatus = "2";
              let params = Object.assign({}, this.form);
              addKqYearDateAll(params)
                .then((res) => {
                  this.load.add = false;
                  let tips = res.data.tips;
                  if (tips.isOk) {
                    this.addDialogVisible = false;
                    this.getWorkCalendar();
                  }
                  this.$message({
                    message: tips.msg,
                    type: tips.isOk ? "success" : "error",
                  });
                })
                .catch((err) => {
                  this.load.add = false;
                });
            } else {
              return false;
            }
          })
      },
      clickTag(item) {
        this.editForm = Object.assign({}, item);
        this.editDialogVisible = true;
      },
      //编辑
      editBtn() {
        let startTime = new Date(this.editForm.startTime).getTime();
        let endTime = new Date(this.editForm.endTime).getTime();
        if (startTime > endTime) {
          this.$message({
            message: "开始时间不能早于结束时间",
            type: "error",
          });
          return;
        }
        let params = Object.assign({}, this.editForm);
        this.load.edit = true;
        editKqYearDateAll(params)
          .then((res) => {
            this.load.edit = false;
            let tips = res.data.tips;
            if (tips.isOk) {
              let data = res.data.data;
              this.editForm = data;
              this.getWorkCalendar();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
            if (tips.isOk){
              this.editDialogVisible = false
            }
          })
          .catch((err) => {
            this.load.edit = false;
          });

      },

      //删除
      delBtn() {
        let params = Object.assign({}, this.editForm);
        this.load.del = true;
        delKqYearDateAll(params)
          .then((res) => {
            this.load.del = false;
            let tips = res.data.tips;
            if (tips.isOk) {
              this.editDialogVisible = false;
              this.getWorkCalendar();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => {
            this.load.del = false;
          });
      },

      changeRadio(tag) {
        this.editForm.tag = tag;
      },
    },
    watch: {},
    mounted() {
      // this.getDaysInMonth();
      this.getWorkCalendar();
    },
    components: {

    },
  };
</script>
<style lang="scss" scoped>
  .calendarTemplate {
    width: 100%;
    height: 100%;

    .el-tag {
      margin-right: 5px;
    }
  }
</style>

<style>
  .el-input--medium .el-input__inner {
    height: 36px;
    line-height: 36px;
    width: 220px;
  }
</style>
