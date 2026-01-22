<template>
    <div class="page-container border padding">
      <div style="width:50px; float:left;"><i style="font-size:50px" class="el-icon-s-order"></i></div>
      <div>
        <span>{{dubanItem.id}}</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="督办详情" name="first">
            <div class="container">
              <el-row class="top">任务内容
                <el-divider></el-divider>
              </el-row>
              
              <el-row class="content">
                    <el-row>
                      <el-col class="fontStyle" :span="4">任务名称：</el-col>
                      <el-col :span="20" v-text="dubanItem.name ? dubanItem.name : '暂无'  ">暂无</el-col>
                    </el-row>  
                    <el-divider></el-divider>
                    <el-row>
                      <el-col class="fontStyle" :span="4">督办字号</el-col>
                      <el-col :span="8" v-text="dubanItem.id ? dubanItem.id : '暂无' "></el-col>
                      <el-col class="fontStyle" :span="4">责任人：</el-col>
                      <el-col :span="8" v-text="dubanItem.dutyName ? dubanItem.dutyName : '暂无' ">暂无</el-col>
                    </el-row>
                    <el-divider></el-divider>  
                    <el-row>
                      <el-col class="fontStyle" :span="4">牵头部门：</el-col>
                      <el-col :span="8">{{dubanItem.betweenDeptName ? dubanItem.betweenDeptName : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">牵头人：</el-col>
                      <el-col :span="8">{{dubanItem.betweenName ? dubanItem.betweenName : "暂无"}}</el-col>
                    </el-row>  
                    <el-divider></el-divider>
                    <el-row>
                      <el-col class="fontStyle" :span="4">计划开始时间：</el-col>
                      <el-col :span="8">{{dubanItem.startTime ? dubanItem.startTime : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">计划结束时间：</el-col>
                      <el-col :span="8">{{dubanItem.endTime ? dubanItem.endTime : '暂无'}}</el-col>
                    </el-row>  
                    <el-divider></el-divider>
                    <el-row>
                      <el-col class="fontStyle" :span="4">主办单位：</el-col>
                      <el-col :span="8">{{dubanItem.hostDeptName ? dubanItem.hostDeptName : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">主办：</el-col>
                      <el-col :span="8">{{dubanItem.hostName ? dubanItem.hostName : '暂无'}}</el-col>
                    </el-row>  
                    <el-divider></el-divider>
                    <el-row>
                      <el-col class="fontStyle" :span="4">协办单位：</el-col>
                      <el-col :span="8">
                        <el-button v-if="dubanItem.coopDept.length > 0" v-for="(item,index) in dubanItem.coopDept" :key="index" type="text">{{item.deptName}}</el-button>
                        <el-button v-if="dubanItem.coopDept.length == 0" type="text">暂无</el-button>
                      </el-col>
                      <el-col class="fontStyle" :span="4">协办：</el-col>
                      <el-col :span="8">
                        <el-button v-if="dubanItem.coopUser != null " v-for="(item,index) in dubanItem.coopUser" :key="index" type="text">{{item.username}}</el-button>
                      </el-col>  
                    </el-row>  
                    <el-divider></el-divider>
              </el-row>
             
            </div>
            <div class="container">
              <el-row style="margin-top: 20px" class="top">任务阶段
                <el-divider></el-divider>
              </el-row>
              
              <el-row class="content" v-if="dubanItem.tasks != null" v-for="(item,index) in dubanItem.tasks" :key="index" >
                    <el-row>
                      <el-col class="fontStyle" :span="4">任务名称：</el-col>
                      <el-col :span="20">{{item.name ? item.name : '暂无'}}</el-col>
                    </el-row>  
                    <el-row>
                      <el-col class="fontStyle" :span="4">督办字号</el-col>
                      <el-col :span="8">{{item.dubanId ? item.dubanId : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">责任人：</el-col>
                      <el-col :span="8">{{item.dutyName ? item.dutyName : '暂无'}}</el-col>
                    </el-row>
                    
                    <el-row>
                      <el-col class="fontStyle" :span="4">计划开始时间：</el-col>
                      <el-col :span="8">{{item.startTime ? item.startTime : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">计划结束时间：</el-col>
                      <el-col :span="8">{{item.endTime ? item.endTime : '暂无'}}</el-col>
                    </el-row>  
                    <el-row>
                      <el-col class="fontStyle" :span="4">主办单位：</el-col>
                      <el-col :span="8">{{item.hostDeptName ? item.hostDeptName : '暂无'}}</el-col>
                      <el-col class="fontStyle" :span="4">主办：</el-col>
                      <el-col :span="8">{{item.hostName ? item.hostName : '暂无'}}</el-col>
                    </el-row>  
                    <el-row>
                      <el-col class="fontStyle" :span="4">协办单位：</el-col>
                      <el-col :span="8">
                        <el-button v-if="item.coopDept.length > 0" v-for="(dept,key) in item.coopDept" :key="key" type="text">{{dept.deptName ? dept.deptName : '暂无'}}</el-button>
                        <el-button v-if="item.coopDept.length == 0" type="text" ></el-button>
                      </el-col>
                      <el-col class="fontStyle" :span="4">协办：</el-col>
                      <el-col :span="8">
                        <el-button v-for="(user,key) in item.coopUser" :key="key" type="text">{{user.username ? user.username : '暂无'}}</el-button>  
                      </el-col>  
                    </el-row>  
                    <el-divider></el-divider>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="进度视图" name="second">
            <div class="container">
              <duban-progress v-if="progressVisible" :dubanItem='dubanItem'></duban-progress>
            </div>
          </el-tab-pane>
          <el-tab-pane label="反馈信息" name="third">
            <div class="container">角色管理</div>
          </el-tab-pane>
          <el-tab-pane label="日志列表" name="fourth">
            <div class="container">定时任务补偿</div> 
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
</template>
<script>

  import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
  import { mapGetters } from 'vuex'
  import DubanProgress from './DubanProgress';
  import { getMessages } from '@/api/oa/duban/dubanItem';

  export default {
    props:['dubanId'],
    computed:{
        ...mapGetters([
		      'userInfo'
			  ]),
    },
    watch:{
        'dubanId': function(dubanId){
            console.log(dubanId)
        },
        'activeName':  function(newVal){
            this.progressVisible = this.activeName == 'second' ?  true : false
        }
       
    },
    data() {
        return {
            activeName: 'first',
            id: '',
            dubanItem: {
              id:'',name:'',categoryId:'',categoryName:'',dutyId:'',dutyName:'',betweenDeptid:'',betweenDeptName:'',betweenId:'',betweenName:'',branchId:'',startTime:'',endTime:'',hostDeptId:'',hostDeptName:'',hostId:'',hostName:'',remark:'',status:'',createTime:'',progress:'',
              coopDept: [],
              coopUser: [],
              tasks: [],
            },
            progressVisible: false,
        };
    },
    methods: {
        handleClick(tab, event) {
          //console.log(tab, event);
        },
        onGetDubanMessage(){
            let params = {
              id: this.$route.query.id
            }
            getMessages(params).then((res) => {
              var tips=res.data.tips;
              if(tips.isOk){
                  this.dubanItem = res.data.data
              }else{
                  this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
              }
            }).catch( );
        },
        isNull(data) {
          if(data === null || data === '' || data === undefined) {
            return true;
          }
          return false;
        },
    },
    mounted(){
      this.$nextTick(()=>{
          console.log(this.$route.query.id);
          this.onGetDubanMessage();
      });
    },
    components:{
      'duban-progress':DubanProgress,
    }
  };
</script>
<style scoped>
  .app-container{
    margin-left: 10px;
    margin-right: 10px;
  }
  .container{
    margin-left: 50px;
    margin-right: 20px;
  }
  .container span{
    width: 100px;
  }
  .top{
    font-size: 18px;
    color: #1E90FF;
  }
  .fontStyle{
    font-size: 14px;
  }
  .content{
    padding-left:30px;
    padding-top: 10px;
    background-color: #F5F5F5;
  }
  .content > .el-row{
    line-height: 40px;
    height: 40px;
  }
  .el-divider{
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>