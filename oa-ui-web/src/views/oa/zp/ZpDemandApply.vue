<template>
  <div id="container">
    <div class="selected">
      <div>
        <el-tag type="info" closable style="background:white" v-if="status != ''">文档状态:<span style="color:#ff7675" v-text="statusName"></span></el-tag>
        <el-tag type="info" closable style="background:white" v-if="deptName != ''">申请部门:<span style="color:#ff7675" v-text="deptName"></span></el-tag>
        <el-tag type="info" closable style="background:white" v-if="startDate!= '' || endDate != ''">创建时间:<span style="color:#ff7675" v-text="startDate + '/'+ endDate "></span></el-tag>
        <el-input placeholder="请输入内容" v-model="theme" class="input-with-select" size="mini" style="width:250px">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-button type="text" @click="showCondition = !showCondition">{{showCondition == true ? '展开' : '收起'}}筛选</el-button>
    </div>
    <div :class="{'condition':true,'showCondition': showCondition == true ? true : false }">
      <div class="condition-box">
        <div class="condition-title">文档状态</div>
        <div class="condition-items">
          <span class="item" :class="{'click-item' : status == '' ? true : false}" @click="clickDocuStatus('')">不限</span>
          <span class="item" :class="{'click-item' : status == '0' ? true : false}" @click="clickDocuStatus('0')">草稿</span>
          <span class="item" :class="{'click-item' : status == '1' ? true : false}" @click="clickDocuStatus('1')">待审</span>
          <span class="item" :class="{'click-item' : status == '2' ? true : false}" @click="clickDocuStatus('2')">驳回</span>
          <span class="item" :class="{'click-item' : status == '3' ? true : false}" @click="clickDocuStatus('3')">废弃</span>
          <span class="item" :class="{'click-item' : status == '4' ? true : false}" @click="clickDocuStatus('4')">过期</span>
          <span class="item" :class="{'click-item' : status == '5' ? true : false}" @click="clickDocuStatus('5')">发布</span>
        </div>
      </div>
      <div class="condition-box">
        <div class="condition-title">申请部门</div>
        <div class="condition-items">
          <span class="item" :class="{'click-item' : deptStatus == '' ? true : false}" @click="clickApplyDept('')">不限</span>
          <span class="item" :class="{'click-item' : deptStatus == '1' ? true : false}" @click="clickApplyDept('1')">选择部门</span>
        </div>
      </div>
      <div class="condition-box">
        <div class="condition-title">创建时间</div>
        <div class="condition-items">
          <span class="item" :class="{'click-item' : timeStatus == '' ? true : false}" @click="clickCreateTime('')">不限</span>
          <span class="item" :class="{'click-item' : timeStatus == '0' ? true : false}" @click="clickCreateTime('0')">近一周</span>
          <span class="item" :class="{'click-item' : timeStatus == '1' ? true : false}" @click="clickCreateTime('1')">近一个月</span>
          <span class="item" :class="{'click-item' : timeStatus == '2' ? true : false}" @click="clickCreateTime('2')">近三个月</span>
          <span class="item" :class="{'click-item' : timeStatus == '3' ? true : false}" @click="clickCreateTime('3')">近半年</span>
          <span class="item" :class="{'click-item' : timeStatus == '4' ? true : false}" @click="clickCreateTime('4')">近一年</span> 
        </div>
        <div>
          <el-date-picker
            style="margin-right:20px;width:150px"
            size="mini" 
            v-model="startDate"
            type="date"
            placeholder="开始日期">
          </el-date-picker>
          <el-date-picker
            style="width:150px"
            size="mini" 
            v-model="endDate"
            type="date"
            placeholder="截止日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <!-- 选择部门 -->
    <el-dialog append-to-body title="选择部门" :visible.sync="deptSelectVisible" width="60%">
      <dept-tree
        show-root
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        @node-click="handleLeftDeptNodeClick"
      ></dept-tree>
    </el-dialog>
  </div>
</template>

<script>
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import dateUtil from "@/common/js/dateUtil"; // 全局公共库
import util from "@/common/js/util"; // 全局公共库
export default {
  data(){
    return{
      theme:'',
      showCondition:true,
      status:'', //文档状态 0 1 2 ...
      statusName:'' ,// 文档状态名称 '' 草稿 待审 ...
      deptStatus:'',
      deptName:'',
      timeStatus:'',
      deptSelectVisible:false,
      startDate:'',
      endDate:'',
    }
  },
  methods:{
    handleLeftDeptNodeClick(data, node, comp) {
      this.deptName = data.deptName;
      this.deptSelectVisible = false;
    },
    //文档状态
    clickDocuStatus(status){
      this.status = status;
      if(this.status == '0') this.statusName =  '草稿';
      if(this.status == '1') this.statusName =  '待审';
      if(this.status == '2') this.statusName =  '驳回';
      if(this.status == '3') this.statusName =  '废弃';
      if(this.status == '4') this.statusName =  '过期';
      if(this.status == '5') this.statusName =  '发布';
      return '';
    },
    //申请部门
    clickApplyDept(deptStatus){
      this.deptStatus = deptStatus;
      if(this.deptStatus == '') this.deptName = '';
      if(this.deptStatus == '1') this.deptSelectVisible = true;;
    },
    //创建时间
    clickCreateTime(timeStatus){
      this.timeStatus = timeStatus;
      if(this.timeStatus == ''){
        this.startDate = null;
        this.endDate = null ;
      }
      //近一周
      if(this.timeStatus == '0'){
        let time = dateUtil.getNearWeekStartDate();
        this.startDate = util.formatDate(time[0], "yyyy-MM-dd");
        this.endDate = util.formatDate(time[1], "yyyy-MM-dd");
      }
      // //近一月
      if(this.timeStatus == '1'){
        let time = dateUtil.getNearMonthStartDate();
        this.startDate = util.formatDate(time[0], "yyyy-MM-dd");
        this.endDate = util.formatDate(time[1], "yyyy-MM-dd");
      }
      //近三个月
      if(this.timeStatus == '2'){
        let time = dateUtil.getNearThreeMonthStartDate();
        this.startDate = util.formatDate(time[0], "yyyy-MM-dd");
        this.endDate = util.formatDate(time[1], "yyyy-MM-dd");
      }
      //近半年
      if(this.timeStatus == '3'){
        let time = dateUtil.getNearHalfYearStartDate();
        this.startDate = util.formatDate(time[0], "yyyy-MM-dd");
        this.endDate = util.formatDate(time[1], "yyyy-MM-dd");
      }
      //近一年
      if(this.timeStatus == '4'){
        let time = dateUtil.getNearYearStartDate();
        this.startDate = util.formatDate(time[0], "yyyy-MM-dd");
        this.endDate = util.formatDate(time[1], "yyyy-MM-dd");
      }
    }
  },
  mounted(){
    
  },
  components:{
    'dept-tree':DeptTree
  }
};
</script>

<style lang="scss" scoped>
*{
  font-size: 14px;
  color: #666666;
}
#container {
  padding: 10px;
  .selected{
    padding:5px 10px;
    background: #f7f7f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid white;
  }
 
  .condition{
    height: 150px;
    opacity: 1;
    background:  #f7f7f7;
    transition:all 0.2s;
    .condition-box{
      height: 45px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom:1px solid white;
      .condition-title{
        width: 150px;
        text-align: right;
      }
      .condition-items{
        display: flex;
        justify-content: flex-start;
        padding: 0px 10px;
        .item{
          padding: 2px;
          border-radius: 4px;
          margin:0px 15px;
          border:1px solid #f7f7f7;
        }
        .item:hover{
          color: #4285f4;
          border:1px solid #4285f4;
        }
        .click-item{
          color: #4285f4;
          border:1px solid #4285f4;
        }
      }
    }
  }
  .showCondition{
    height: 0px;
    overflow: hidden;
    opacity: 0;
  } 
}
</style>
