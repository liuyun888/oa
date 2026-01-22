<template>
  <section class="page-container padding" v-loading="load.list">
    <el-row class="border">
      <el-col :span="24" class="border">
        <div class="right">
          <div class="right-header">
            <div class="right-title" v-text="userInfo.username + '的考核'"></div>
            <div class="right-operation">
              <el-select v-model="filters.year" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button
                type="primary"
                style="margin-left:15px"
                @click="examineBtn"
                v-show="editForm.isAssInfo"
              >查看</el-button>
              <el-button
                type="primary"
                style="margin-left:15px"
                @click="saveBtn('save')"
                v-loading="load.save"
              >暂存</el-button>
              <el-button v-if="editForm.status=='1'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('selfConfirm')"
                v-loading="load.save"
              >完成员工确认</el-button>
              <el-button v-if="editForm.status=='2'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('reConfirm')"
                v-loading="load.save"
              >完成主管确认</el-button>
              <el-button v-if="editForm.status=='2'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('rejectReConfirm')"
                v-loading="load.save"
              >请员工重新确认</el-button>
              <el-button v-if="editForm.status=='3'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('selfEvalConfirm')"
                v-loading="load.save"
              >完成自评</el-button>
              <el-button v-if="editForm.status=='4'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('reEvalConfirm')"
                v-loading="load.save"
              >完成复评</el-button>
              <el-button v-if="editForm.status=='5'"
                type="primary"
                style="margin-left:15px"
                @click="finishSubmitBtnClick('vouchEvalConfirm')"
                v-loading="load.save"
              >完成核定</el-button>
            </div>
          </div>
          <div class="right-content" v-loading="load.show" v-if="schemeListCpd.length>0">
            <el-tabs v-model="activeName">
              <el-tab-pane :label="genTabLabel(scheme)" :name="''+index" v-for="(scheme,index) in schemeListCpd" :key="'tab-'+index">
                <div class="right-tabs-span">

                  <span class="gray-dot"></span>
                  <span>未开始</span>
                  <span class="blue-dot"></span>
                  <span>初始</span>
                  <span class="green-dot"></span>
                  <span>考核中</span>
                  <span class="red-dot"></span>
                  <span>已结束</span>
                </div>
                <div class="right-date">
                  <ul class="right-date-ul">
                    <li
                      v-for="(dateScope,index) in scheme.dateScopes"
                      :key="index"
                      :class="getItemStyleClass(scheme,dateScope)"
                      @click="clickDateScope(scheme,dateScope)"
                    >
                      {{dateScope.title}}
                      <span
                        :class="getSpanStyleClass(scheme,dateScope)"
                      ></span>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="right-content-access" v-show="contents.length>0">
              <el-table :data="contents" style="width: 100%" show-summary  :span-method="objectSpanMethod">
                <el-table-column prop="seqNum" label="序号" width="80"></el-table-column>
                <el-table-column prop="categoryName" label="指标分类" width="180"></el-table-column>
                <el-table-column prop="name" label="指标名称" min-width="180"></el-table-column>
                <el-table-column prop="weight" label="分值">
                  <template slot-scope="scope">
                      {{genWeightPoints(scope.row.weight,editForm.totalPoints) }}分
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="指标说明" min-width="240"></el-table-column>
                <el-table-column prop="selfDesc" label="个性化说明" min-width="150">
                  <template slot-scope="scope">
                    <el-input v-if="editForm.reCstatus!='1'&&(editForm.reUserid==userInfo.userid||editForm.assUserid==userInfo.userid)"  type="textarea" rows=2  size="small" v-model="scope.row.selfDesc" placeholder></el-input>
                    <div v-else>{{scope.row.selfDesc}}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="weight" label="满分"></el-table-column> -->
                <el-table-column prop="selfPoints" label="自评分" width="100">
                  <template slot="header">
                    自评&nbsp;<el-button size="mini" type="text" @click="copyTemplatePoints">复制模板</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-input type="number" size="small" @change="onSelfPointsChange(scope.row,$event)"  @input="onSelfPointsChange(scope.row,$event)"
                      min=0 :max="genWeightPoints(scope.row.weight,editForm.totalPoints) "
                      v-model="contents[scope.$index].selfPoints"
                      :disabled="( editForm.isSelf=='1'||editForm.reCstatus!='1'||editForm.assUserid!=userInfo.userid) "
                    ></el-input>
                    <!-- oninput="value=value.replace(/[^0-9.]/g,'')" -->
                  </template>
                </el-table-column>
                <el-table-column prop="rePoints" label="复评分" width="100">
                  <template slot="header">
                    复评&nbsp;<el-button size="mini" type="text" @click="copySelfPoints">复制自评</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-input type="number"  size="small" @change="onRePointsChange(scope.row,$event)"  @input="onRePointsChange(scope.row,$event)"
                      min=0 :max="genWeightPoints(scope.row.weight,editForm.totalPoints) "
                      v-model="contents[scope.$index].rePoints"
                      :disabled="( editForm.isReEval=='1'||editForm.isSelf!='1' ||editForm.reUserid!=userInfo.userid) "
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="vouchPoints" label="核定分" width="100">
                  <template slot="header">
                    核定&nbsp;<el-button size="mini" type="text" @click="copyRePoints">复制复评</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-input type="number" size="small" @change="onVouchPointsChange(scope.row,$event)" @input="onVouchPointsChange(scope.row,$event)"
                      min=0 :max="genWeightPoints(scope.row.weight,editForm.totalPoints) "
                      v-model="contents[scope.$index].vouchPoints"
                      :disabled="( editForm.isVouch=='1' || editForm.isReEval!='1'||editForm.isSelf!='1'||editForm.vouchId!=userInfo.userid)   "
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <div class="access-row">
                <div class="access-row-left">当前状态</div>
                <div class="access-row-right">

                   <el-row>

                    <el-steps :space="200" :active="editFormStatus" process-status="wait" finish-status="success">
                      <el-step :title="item.name" v-for="(item,index) in jxGradeStatus" :key="index"></el-step>
                    </el-steps>
                   </el-row>
                   <el-row>
                     <font v-if="editForm.schemeType=='0'" color="blue"> 月度&nbsp;&nbsp;{{editForm.year}}&nbsp;&nbsp; {{editForm.month}}月 </font>
                    <font v-if="editForm.schemeType=='1'" color="blue">  季度&nbsp;&nbsp;{{editForm.year}}&nbsp;&nbsp; {{editForm.quarter}}季 </font>
                    <font v-if="editForm.schemeType=='2'" color="green"> 半年&nbsp;&nbsp;{{editForm.year}}&nbsp;&nbsp; {{editForm.semiAnnual=='1'?'上半年':'下半年'}} </font>
                    <font v-if="editForm.schemeType=='3'" color="red"> 年度&nbsp;&nbsp;{{editForm.year}}年 </font>
                  &nbsp;|&nbsp;
                  <font v-for="(item,index) in jxGradeStatus" :key="index">
                    <el-tag  :type="item.tagType" v-if="editForm.status==item.id"> {{item.name}}  </el-tag>
                  </font>
                  | &nbsp;复评人:<font color="blue">{{editForm.reUsername?editForm.reUsername:'未指定'}}</font> <el-button @click="reUserSelectVisible=true" size="small" disabled>设置</el-button>&nbsp;| &nbsp;核定人:<font color="blue">{{editForm.vouchName?editForm.vouchName:'未指定'}}</font>&nbsp;<el-button @click="vouchUserSelectVisible=true"  size="small" disabled>设置</el-button>
                   </el-row>
                </div>
              </div>
              <div class="access-row">
                <div class="access-row-left">自我评价</div>
                <div class="access-row-right">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="editForm.selfRemark"
                    :disabled=" editForm.isSelf=='1'||editForm.reCstatus!='1'"
                  ></el-input>
                </div>
              </div>
              <div class="access-row">
                <div class="access-row-left">复核评价</div>
                <div class="access-row-right">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="editForm.reRemark"
                    :disabled=" editForm.isReEval=='1'||editForm.isSelf!='1'"
                  ></el-input>
                </div>
              </div>
              <div class="access-row">
                <div class="access-row-left">核定评价</div>
                <div class="access-row-right">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="editForm.vouchRemark"
                    :disabled="editForm.isVouch=='1'||editForm.isReEval!='1'||editForm.isSelf!='1'"
                  ></el-input>
                </div>
              </div>
              <div class="access-row">
                <div class="access-row-left">附件</div>
                <div class="access-row-right">
                  <attachment-upload
                    @on-change="onChange"
                    @on-remove="getRemoveMsg"
                    :archiveId="editForm.id?editForm.id:'221221343432423'"
                    :branchId="userInfo.branchId"
                  ></attachment-upload>
                </div>
              </div>
              <div class="footer">团队协作、业绩指标完成情况、服务覆盖到每一个客户，并紧密联系服务好每一个客户是客服工作重点。</div>
            </div>
          </div>
          <div style="align-item:center;">
              <font color="red">无绩效数据</font>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 查看 -->
    <el-dialog append-to-body title="考核详情" :visible.sync="examineVisible" width="50%" center>
      <el-row :gutter="20" v-loading="load.show">
        <el-col :span="24">
          考核情况
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">考核状态</el-col>
        <el-col :span="18">
          <el-checkbox v-model="inspectionSituation.isSelf" disabled>已自评</el-checkbox>
          <el-checkbox v-model="inspectionSituation.isReEval" disabled>已复评</el-checkbox>
          <el-checkbox v-model="inspectionSituation.isVouch" disabled>待奖励</el-checkbox>
        </el-col>
        <el-col :span="6">自评成绩</el-col>
        <el-col :span="6">分数：{{inspectionSituation.selfPoints}}</el-col>
        <el-col :span="12">等级：{{selfPointsClass}}</el-col>
        <el-col :span="6">复评成绩</el-col>
        <el-col :span="6">分数：{{inspectionSituation.totalPoints}}</el-col>
        <el-col :span="12">等级：{{totalPointsClass}}</el-col>
        <el-col :span="6">核定成绩</el-col>
        <el-col :span="6">分数：{{inspectionSituation.vouch}}</el-col>
        <el-col :span="12">等级：{{vouchClass}}</el-col>
        <el-col :span="24">
          所在部门考核情况
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">选择部门</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-select v-model="deptid" placeholder="请选择" size="mini" @change="getDeptAssessmentOf">
              <el-option
                v-for="item in depts"
                :key="item.deptid"
                :label="item.deptName"
                :value="item.deptid"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="24">部门人数 ： {{deptUserNum}}</el-col>
        <el-col :span="12">
          <div style="margin-bottom:20px">规定占比</div>
          <div class="examine" v-for="item in deptRatios" :key="item.id">
            <span v-text="getClass(item.classType)"></span>
            <span v-text="item.ratio * 100 + '%'"></span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-bottom:20px">已占比</div>
          <div class="examine" v-for="(item,index) in makeUp" :key="index">
            <span v-text="getClass(item.classTyle)"></span>
            <span v-text="Math.floor(item.ratio * 100 * 100) / 100   + '%'"></span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import { listJxAssessScheme } from "@/api/oa/jx/jxAssessScheme";
import {
  saveAssessInfo,
  getJxAssessGradeDetail,
  getAssessmentInformation,
  deptAssessmentOf,
  listJxAssessGradeFullYear,
} from "@/api/oa/jx/jxAssessGrade";

import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import { sn } from "@/common/js/sequence"; //id生成器
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    schemeListCpd(){

      var jxAssessSchemes=[];
      this.jxAssessSchemeExecs.forEach(exec=>{
        if(!jxAssessSchemes.some(scheme=>exec.schemeId==scheme.id)){
          jxAssessSchemes.push({id:exec.schemeId,schemeType:exec.schemeType,name:exec.name})
        }
      })
      jxAssessSchemes.sort((a,b)=>parseInt(a.schemeType)-parseInt(b.schemeType))
      jxAssessSchemes.forEach(scheme=>{
        var months= [
        { schemeId:'',title: "一月",key:'1', id: '1',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null },
        { schemeId:'',title: "二月",key:'2', id: '2',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "三月",key:'3', id: '3',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "四月",key:'4', id: '4',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "五月",key:'5', id: '5',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null  },
        { schemeId:'',title: "六月",key:'6', id: '6',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "七月",key:'7', id: '7',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "八月",key:'8', id: '8',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "九月",key:'9', id: '9',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "十月",key:'10', id: '10',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "十一月",key:'11', id: '11',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "十二月",key:'12', id: '12',schemeType:'0',jxAssessGrade:null,jxAssessSchemeExec:null   }
      ]
      var quarters= [
        { schemeId:'',title: "一季度",key:'13', id: '1',schemeType:'1',jxAssessGrade:null,jxAssessSchemeExec:null  },
        { schemeId:'',title: "二季度",key:'14', id: '2',schemeType:'1',jxAssessGrade:null,jxAssessSchemeExec:null  },
        { schemeId:'',title: "三季度",key:'15', id: '3',schemeType:'1',jxAssessGrade:null,jxAssessSchemeExec:null  },
        { schemeId:'',title: "四季度",key:'16', id: '4' ,schemeType:'1',jxAssessGrade:null,jxAssessSchemeExec:null  }
      ]
      var semiAnnuals= [
        { schemeId:'',title: "上半年度",key:'17', id: '1',schemeType:'2',jxAssessGrade:null,jxAssessSchemeExec:null   },
        { schemeId:'',title: "下半年度",key:'18', id: '2',schemeType:'2',jxAssessGrade:null,jxAssessSchemeExec:null   }
      ]
      var annuals= [{ schemeId:'',title: "年度考核",key:'19', id: '1',schemeType:'3',jxAssessGrade:null,jxAssessSchemeExec:null  }]
        var schemeExecList=this.jxAssessSchemeExecs.filter(exec=>exec.schemeId==scheme.id)
        scheme.dataScopes=[]
        schemeExecList.forEach(exec=>{
          if(exec.schemeType=='0'){
            scheme.dateScopes= this.schemeTypeYearStatus(scheme,exec,months,'month');
          }else if(exec.schemeType=='1'){
            scheme.dateScopes= this.schemeTypeYearStatus(scheme,exec,quarters,'quarter');
          }else if(exec.schemeType=='2'){
            scheme.dateScopes= this.schemeTypeYearStatus(scheme,exec,semiAnnuals,'semiAnnual');
          }else if(exec.schemeType=='3'){
            scheme.dateScopes= this.schemeTypeYearStatus(scheme,exec,annuals,'annual');
          }
        })
      })

      return jxAssessSchemes
    },
    editFormStatus(){
      return parseInt(this.editForm.status);
    }
  },
  data() {
    return {
      input: "",
      activeName: "0",
      options: [],
      value: "",
      textarea: "",
      jxAssessSchemes: [],



       username: "",
      isHide: true,
      pageInfo: {
        //分页数据
        pageSize: 10, //每页数据
        pageNum: 1 //当前页码、从1开始计算
      },
      load: {
        list: false,
        edit: false,
        del: false,
        add: false,
        show: false,
        save: false
      }, //查询中...
      filters: {
        assUserid: "",
        year: new Date().getFullYear(),
      },
      contents:[],
      editForm: {
        id: "",
        userid: "",
        assUserid: "",
        branchId: "",
        contents: [],
        totalPoints: 0,
        evaluate: "",
        accessory: "",
        isAssInfo: "",
        tempTotalPoints: "",
        scheme: "", //所属考核方案
        schemeNum: "", //所属考核方案对应的类型(如月度考核中的1，2，3，4月)
        year: "",
        selfRemark: "",
        vouchRemark: "",
        selfPoints: 0,
        vouch: 0,
        isSelf: 0,
        isReEval: 0,
        isVouch: 0
      },
      monthNum: 1,
      quarterNum: 1,
      semiAnnualNum: 1,
      annualNum: 1,
      clickli: "",
      key: "",
      assUser: "",
      status: "0", // 考核人的状态 0-自评，1-复评，2-核定，3-复评和核定
      examineVisible: false,
      deptid: "",
      inspectionSituation: {
        selfPoints: 0,
        totalPoints: 0,
        vouch: 0,
        isSelf: false,
        isReEval: false,
        isVouch: false
      }, //考核情况
      depts: [],
      deptRatios: [],
      makeUp: [],
      deptUserNum: "",
      assessClass:[],
      selfPointsClass:"",
      totalPointsClass:"",
      vouchClass:"",
      jxAssessGrades:[],
      jxAssessSchemeExecs:[],
      dateScope:null,
      jxGradeStatus:[
        {id:'0',name:'初始',tagType:'info'},
        {id:'1',name:'待签约',tagType:'primary'},
        {id:'2',name:'待主管确认',tagType:'primary'},
        {id:'3',name:'待自评',tagType:'warning'},
        {id:'4',name:'待复评',tagType:'warning'},
        {id:'5',name:'待核定',tagType:'warning'},
        {id:'6',name:'待奖励',tagType:'danger'},
        {id:'7',name:'已完成',tagType:'info'},
      ],
    };
  },
  watch: {
    "filters.year": {
      handler: function(a, b) {
        this.contents=[]
        this.dateScope=null
        this.filters.gradeId=""
        this.filters.schemeId=""
        this.getJxAssessGradeFullYear();
      }
    },
    activeName: {
      handler: function(a, b) {
        this.contents=[]
        this.dateScope=null
      }
    },
  },
  methods: {
    //获取考核方案列表
    getlistJxAssessScheme() {
      let params = {
        branchId: this.userInfo.branchId
      };

			params.orderBy='scheme_type asc'
      this.load.list=true;
      listJxAssessScheme(params).then(res => {

        this.load.list=false;
        let tips = res.data.tips;
        if (tips.isOk) {
          this.jxAssessSchemes = res.data.data;
        } else {
          this.$message({
            message: tips.msg,
            type: "error"
          });
        }
      });
    },

    //判断一个时间是否在一个时间段中
    isTimes(startdate, enddate) {
      var newdate = new Date();
      var startdate = new Date(startdate);
      var enddate = new Date(enddate);
      var a = newdate.getTime() - startdate.getTime();
      var b = newdate.getTime() - (enddate.getTime() + 24 * 60 * 60 * 1000);
      if (a > 0 && b < 0) {
        return 1;
      }
      if (a < 0) {
        return 2;
      }
      if (b > 0) {
        return 0;
      }
    },
    //点击某月/某季/某半年度/年度时
    clickDateScope(scheme,dateScope) {
      this.dateScope=dateScope;
      var grade=dateScope.jxAssessGrade;
      if(!grade){
        this.contents=[]
        this.jxAssessScheme=scheme
        this.$message({
            message: "无绩效数据",
            type: "error"
          });
        return;
      }
      this.jxAssessScheme=scheme
      this.contents=[]
      this.getJxAssessGradeDetail();
    },
    //获取某个人全年数据
    getJxAssessGradeFullYear() {
      var params={year:this.filters.year};
      params.assUserid=this.filters.assUserid;
      this.load.list=true;
      listJxAssessGradeFullYear(params).then(res=>{

        this.load.list=false;
         this.jxAssessGrades=res.data.data;
         this.jxAssessSchemeExecs=res.data.schemeExecList;
      })
    },
    //获取考核信息
    getJxAssessGradeDetail() {
        if(!this.dateScope){
          return;
        }
        this.load.list = true;
        var params={
          id:this.dateScope.jxAssessGrade.id
        }
        getJxAssessGradeDetail(params).then(res => {
          this.load.list = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.editForm = res.data.data;
            this.contents=res.data.contents;
          } else {
            this.$message({
              message: tips.msg,
              type: "error"
            });
          }
        });
    },
    //保存
    saveBtn(action) {
      let boo = this.verify();
      if (boo) {
        this.$confirm("确定要打分吗", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //this.editForm.year = this.filters.year;
            let params = Object.assign(this.editForm, {});
            params.contents=this.contents
            this.load.save = true;
            params.action=action
            saveAssessInfo(params).then(res => {
              this.load.save = false;
              let tips = res.data.tips;
              if (tips.isOk) {
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            });
          })
          .catch(() => {
            this.load.save = false;
          });
      }
    },
    finishSubmitBtnClick(action){
      this.saveBtn(action)
    },
    //校验
    verify() {
      let boo = true;
      return true;
    },
    //删除文件后回调
    getRemoveMsg(file, fileList) {},
    //上传成功后回调
    onChange(file, fileList) {
      this.editForm.accessory = "";
      for (let i = 0; i < fileList.length; i++) {
        if (i >= 1) {
          this.editForm.accessor += ",";
        }
        this.editForm.accessory += fileList[i].cdnUrl;
      }
    },
    //年份
    yearData() {
      let year = new Date().getFullYear();
      this.filters.year = year;
      for (let i = 0; i < 5; i++) {
        let yeardata = {
          value: year - i,
          label: year - i
        };
        this.options.push(yeardata);
      }
    },
    //查看
    examineBtn() {
      this.examineVisible = true;
      let params = Object.assign(this.filters, {});
      this.load.show = true;
      this.inspectionSituation.selfPoints = 0 ;
      this.inspectionSituation.totalPoints = 0;
      this.inspectionSituation.vouch = 0 ;
      this.inspectionSituation.isSelf = false ;
      this.inspectionSituation.isReEval = false;
      this.inspectionSituation.isVouch =false ;
         //考核情况
      getAssessmentInformation(params).then(res => {
          let tips = res.data.tips;
          this.load.show = false;
          if (tips.isOk) {
            console.log(" res.data.data.jxAssessGrade"+JSON.stringify(res.data.data.jxAssessGrade));
            if (
              res.data.data.jxAssessGrade != null &&
              res.data.data.jxAssessGrade != ""
            ) {
              let jxAssessGrade = res.data.data.jxAssessGrade;
              this.inspectionSituation.isSelf =
                jxAssessGrade.isSelf == "1" ? true : false;
              this.inspectionSituation.isReEval =
                jxAssessGrade.isReEval == "1" ? true : false;
              this.inspectionSituation.isVouch =
                jxAssessGrade.isVouch == "1" ? true : false;
              if (jxAssessGrade.isSelf == "1") {
                this.inspectionSituation.selfPoints =
                  jxAssessGrade.selfPoints;
              }
              if (jxAssessGrade.isReEval == "1") {
                this.inspectionSituation.totalPoints =
                  jxAssessGrade.totalPoints;
              }
              if (jxAssessGrade.isVouch == "1") {
                this.inspectionSituation.vouch = jxAssessGrade.vouch;
              }
            } else {
              this.inspectionSituation.selfPoints = 0;
              this.inspectionSituation.totalPoints = 0;
              this.inspectionSituation.vouch = 0;
              this.inspectionSituation.isSelf = false;
              this.inspectionSituation.isReEval = false;
              this.inspectionSituation.isVouch = false;
            }
            this.depts = res.data.data.depts;
            this.deptRatios = res.data.data.deptRatios;
            this.makeUp = res.data.data.makeUp;
            this.deptUserNum = res.data.data.deptUserNum;
            this.deptid = this.depts[0].deptid;
            //判断自评分数，复评分数和核定分数的考核等级
            this.assessClass = res.data.data.assessClass;
            if(this.inspectionSituation.isSelf == true){
              this.selfPointsClass =  this.getGradeClass(this.inspectionSituation.selfPoints);
            }
            if(this.inspectionSituation.isReEval == true){
              this.totalPointsClass =  this.getGradeClass(this.inspectionSituation.totalPoints);
            }
            if(this.inspectionSituation.isVouch == true){
              this.vouchClass =  this.getGradeClass(this.inspectionSituation.vouch);
            }

          }
        })
        .catch(err => (this.load.show = false));
    },
    getClass(type) {
      if (type == "1") {
        return "优秀";
      }
      if (type == "2") {
        return "良好";
      }
      if (type == "3") {
        return "中等";
      }
      if (type == "4") {
        return "合格";
      }
      if (type == "5") {
        return "不合格";
      }
    },
    //根据部门查询部门评优情况
    getDeptAssessmentOf(deptid) {
      console.log(deptid);
      let params = {
        deptid: deptid,
        branchId: this.userInfo.branchId
      };
      this.load.show = true;
      deptAssessmentOf(params)
        .then(res => {
          this.load.show = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.deptUserNum = res.data.data.deptUserNum;
            this.makeUp = res.data.data.list;
          }
        })
        .catch(err => {
          this.load.show = true;
        });
    },
    //判断当前分数是什么等级（例如90优秀)
    getGradeClass(grade){
      for(let i =0 ; i<this.assessClass.length ; i++){
        let prescribedLimitLeft = parseInt(this.assessClass[i].prescribedLimitLeft);
        let prescribedLimitRight = parseInt(this.assessClass[i].prescribedLimitRight);
        let g = parseInt(grade);
        if(prescribedLimitLeft <= g && g <= prescribedLimitRight){
          if(this.assessClass[i].classTyle == '1'){
              return '优秀';
          }
          if(this.assessClass[i].classTyle == '2'){
              return '良好';
          }
          if(this.assessClass[i].classTyle == '3'){
              return '中等';
          }
          if(this.assessClass[i].classTyle == '4'){
              return '合格';
          }
          if(this.assessClass[i].classTyle == '5'){
              return '不合格';
          }
          break;
        }
      }
    },
    onSelfPointsChange(row,val){
      let integer = /^(-|\+)?\d+$/;  //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points=parseInt(val);
        var max=this.genWeightPoints(row.weight,this.editForm.totalPoints)
        if (points>max) {
          row.selfPoints=max
        } else {
          this.$nextTick(() => {
            row.selfPoints=points;
          });
        }
      }
      this.calcPoints();
    },
    onRePointsChange(row,val){
      let integer = /^(-|\+)?\d+$/;  //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points=parseInt(val);
        var max=this.genWeightPoints(row.weight,this.editForm.totalPoints)
        if (points>max) {
          row.rePoints=max
        } else {
          this.$nextTick(() => {
            row.rePoints=points;
          });
        }
      }
      this.calcPoints();
    },
    onVouchPointsChange(row,val){
      let integer = /^(-|\+)?\d+$/;  //输入整数(包括0)的正则，解决不能输入负号问题
      if (integer.test(val)) {
        var points=parseInt(val);
        var max=this.genWeightPoints(row.weight,this.editForm.totalPoints)
        if (points>max) {
          row.vouchPoints=max
        } else {
          this.$nextTick(() => {
            row.vouchPoints=points;
          });
        }
      }
      this.calcPoints();
    },
    calcPoints(){
      var newVal=this.contents;
      var rePoints=0;
      var selfPoints=0;
      var vouchPoints=0;
      newVal.forEach(i=>{
        rePoints=rePoints+(i.rePoints?i.rePoints:0)
        selfPoints=selfPoints+(i.selfPoints?i.selfPoints:0)
        vouchPoints=vouchPoints+(i.vouchPoints?i.vouchPoints:0)
      })

      this.editForm.rePoints=rePoints;
      this.editForm.selfPoints=selfPoints
      this.editForm.vouchPoints=vouchPoints
    },
    getItemStyleClass(scheme,dateScope){
      var classList=[];
      var exec=dateScope.jxAssessSchemeExec
      if(!exec){
        classList.push('gray')
        if(this.dateScope&&this.dateScope.key==dateScope.key && scheme.id==this.dateScope.schemeId  ){
          classList.push('clickgray')
        }
      } else if(exec.execStatus=='0'){
        classList.push('blue')
        if(this.dateScope&&this.dateScope.key==dateScope.key && scheme.id==this.dateScope.schemeId  ){
          classList.push('clickblue')
        }
      }else if(exec.execStatus=='1'){
        classList.push('green')
        if(this.dateScope&&this.dateScope.key==dateScope.key&& scheme.id==this.dateScope.schemeId  ){
          classList.push('clickgreen')
        }

      }else if(exec.execStatus=='2'){
        classList.push('red')
        if(this.dateScope&&this.dateScope.key==dateScope.key&& scheme.id==this.dateScope.schemeId  ){
          classList.push('clickred')
        }
      }
      return classList;
     // [item.execStatus == 0 ? 'blue' : (item.execStatus == 1 ? 'red' : 'gray'),filters.month == item.id && item.execStatus == 0 ? 'clickblue' : (filters.month == item.id && item.execStatus == 1 ? 'clickred' :(filters.month == item.id && item.execStatus == 2 ? 'clickgray':'' ))]
    },
    //[item.execStatus == 0 ? 'spancolor1' : (item.execStatus == 1 ? 'spancolor2' : 'spancolor3')]
    getSpanStyleClass(scheme,dateScope){
      var exec=dateScope.jxAssessSchemeExec
      var classList=[];
      if(exec==null){
        classList.push('span-gray')
      }else if(exec.execStatus=='0'){
        classList.push('span-blue')
      }else if(exec.execStatus=='1'){
        classList.push('span-green')
      }else if(exec.execStatus=='2'){
        classList.push('span-red')
      }
      return classList;
     // [item.execStatus == 0 ? 'blue' : (item.execStatus == 1 ? 'red' : 'gray'),filters.month == item.id && item.execStatus == 0 ? 'clickblue' : (filters.month == item.id && item.execStatus == 1 ? 'clickred' :(filters.month == item.id && item.execStatus == 2 ? 'clickgray':'' ))]
    },
    schemeTypeYearStatus(scheme,exec,dateScopes,dateFieldName){
      var grade=this.jxAssessGrades.find(g=>g.schemeExecId==exec.id && g[dateFieldName]==exec[dateFieldName] )
      if(!!grade){
        var dateScope=dateScopes.find(ds=>ds.id==grade[dateFieldName])
        dateScope.jxAssessGrade=grade
        dateScope.jxAssessSchemeExec=exec
        dateScope.schemeId=scheme.id
      }
      return dateScopes;
    },
    genTabLabel(schemeExec){
      if(schemeExec.schemeType=='0'){
        return schemeExec.name+"(月度)"
      }else if(schemeExec.schemeType=='1'){
        return schemeExec.name+"(季度)"
      }else if(schemeExec.schemeType=='2'){
        return schemeExec.name+"(半年)"
      } else if(schemeExec.schemeType=='3'){
        return schemeExec.name+"(年度)"
      }
    },
    genWeightPoints(weight,totalPoints){
      return parseInt(weight*totalPoints/100)
    },
    copyTemplatePoints(){

      if(this.editForm.status!='3'){
        this.$message({ showClose:true, message: "当前不是待自评状态，不允许更改自评数据", type: 'error' });
        return;
      }
      if(this.editForm.assUserid!=this.userInfo.userid){
        this.$message({ showClose:true, message: "您不是该绩效考核人，不允许更改自评数据", type: 'error' });
        return;
      }
      this.contents.forEach(i=>{
        i.selfPoints=this.genWeightPoints(i.weight,this.editForm.totalPoints)
      })
      this.calcPoints()
    },
    copySelfPoints(){

      if(this.editForm.status!='4'){
        this.$message({ showClose:true, message: "当前不是待复评状态，不允许更改复评数据", type: 'error' });
        return;
      }
      if(this.editForm.reUserid!=this.userInfo.userid){
        this.$message({ showClose:true, message: "您不是该绩效复评人，不允许更改复评数据", type: 'error' });
        return;
      }
      this.contents.forEach(i=>{
        i.rePoints=i.selfPoints
      })
      this.calcPoints()
    },
    copyRePoints(){
      if(this.editForm.status!='5'){
        this.$message({ showClose:true, message: "当前不是待核定状态，不允许更改核定数据", type: 'error' });
        return;
      }
      if(this.editForm.vouchId!=this.userInfo.userid){
        this.$message({ showClose:true, message: "您不是该绩效核定人，不允许更改核定数据", type: 'error' });
        return;
      }
      this.contents.forEach(i=>{
        i.vouchPoints=i.rePoints
      })
      this.calcPoints()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        debugger;
        if (this.contents.length == rowIndex + 1) {
          return;
        }
        var nextRow = this.contents[rowIndex + 1];
        if (!row.startIndex && row.startIndex !== 0) {
          nextRow.startIndex = rowIndex;

          var next = Object.assign({}, nextRow);
          var i = rowIndex + 1;
          while (next.categoryName == row.categoryName) {
            i = i + 1;
            next = this.contents[i];
          }
          nextRow.rowspan = i - rowIndex;
          return {
            rowspan: nextRow.rowspan,
            colspan: 1,
          };
        } else {
          if (rowIndex < row.startIndex + row.rowspan) {
            if (rowIndex < row.startIndex + row.rowspan - 1) {
              nextRow.startIndex = row.startIndex;
              nextRow.rowspan = row.rowspan;
            }
            return {
              rowspan: 0,
              colspan: 1,
            };
          }
        }
      }
    },
  },
  mounted() {
    this.editForm.id = sn();
    this.filters.assUserid = this.userInfo.userid;
    this.filters.branchId = this.userInfo.branchId;
    this.filters.schemeType="0"

    this.yearData();
    this.getlistJxAssessScheme();
    this.getJxAssessGradeFullYear();
  },
  directives: {
    enterNumber: {
      inserted(el, binding, vnode, oldVnode) {
        el.addEventListener("keypress", function(e) {
          e = e || window.event;

          let charcode =
            typeof e.charCode === "number" ? e.charCode : e.keyCode;

          let re = /\d/;

          if (
            !re.test(String.fromCharCode(charcode)) &&
            charcode > 9 &&
            !e.ctrlKey
          ) {
            if (e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }
          }
        });
      }
    },
  },
  components: {
    //在下面添加其它组件 'hr-user-contract-edit':HrUserContractEdit
    "attachment-upload": AttachmentUpload
  }
};
</script>
<style lang="scss" scoped>
ul {
  padding: 0px;
  margin: 0px;
  list-style: none;
}
.container {
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
}
.left {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  color: #666666;
  .left-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    .left-input {
      margin-left: 15px;
      font-size: 14px;
      margin-top: 0.5rem;
      width: 60%;
    }
  }
  .left-content {
    height: 47rem;
    font-size: 12px;
    overflow: auto;
    li {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
    }

    li:hover {
      background: #e7ecf6;
    }
    .left-content-button {
      width: 200px;
      height: 54px;
      border: 2px solid #eaeaea;
      opacity: 1;
      border-radius: 6px;
      font-size: 14px;
      color: #333 !important;
    }
    .clickli {
      background: #e7ecf6;
    }
  }
  .left-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .left-content::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    height: 50px;
    outline-offset: -1px;
    outline: 1px solid #fff;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .left-content::-webkit-scrollbar-track {
    background-color: #fff;
  }
}
.right {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow:hidden;
  font-size: 14px!important;
  color: #666666;
  .right-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    color: #666666;
    .right-title {
      padding-top: 1rem;
      font-size: 14px;
      width: 60%;
      padding-left: 15px;
    }
    .right-operation {
      width: 40%;
      padding-right: 15px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .right-content {
    height: 47rem;
    padding: 15px;
    overflow: scroll;
    .right-tabs {
      border-bottom: 2px solid #bdc3c7;
    }
    .right-tabs-span {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        margin-left: 10px;
        font-size: 14px;
      }
      .blue-dot {
        height: 10px;
        width: 10px;
        background: #3498db;
        border-radius: 50%;
      }
      .red-dot {
        height: 10px;
        width: 10px;
        background: red;
        border-radius: 50%;
      }
      .gray-dot {
        height: 10px;
        width: 10px;
        background: gray;
        border-radius: 50%;
      }
    }
    .right-date {
      height: 50px;
      .right-date-ul {
        display: flex;
        justify-content: flex-start;
        li {
          height: 30px;
          min-width: 60px;
          line-height: 30px;
          text-align: center;
          margin-right: 2px;
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          border: 1px solid white;
          font-size: 14px;
          span {
            position: absolute;
            width: 18px;
            height: 10px;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            top: -4px;
            right: -6px;
            display: block;
          }
        }
        .blue:hover {
          border: 1px solid #3498db;
        }
        .red:hover {
          border: 1px solid red;
        }
        .gray:hover {
          border: 1px solid #ecf0f1;
        }

        .span-gray {
          background: gray;
        }
        .span-red {
          background: red;
        }
        .span-green {
          background: green;
        }
        .span-blue {
          background: blue;
        }
        .clickblue {
          border: 1px solid blue;
        }
        .clickred {
          border: 1px solid red;
        }
        .clickgray {
          border: 1px solid gray;
        }
        .clickgreen {
          border: 1px solid green;
        }
      }
      .right-date-content {
        .right-date-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }

    .right-content-access {
      .access-row {
        margin: 20px 0px;
        padding-left: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .access-row-left {
          width: 20%;
        }
        .access-row-right {
          width: 70%;
        }
      }
    }
    .footer {
      border: 1px solid #f3f3f3;
      background: #f3f3f3;
      padding: 10px 20px;
    }
  }
  .right-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .right-content::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    height: 50px;
    outline-offset: -1px;
    outline: 1px solid #fff;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .right-content::-webkit-scrollbar-track {
    background-color: #fff;
  }
}
.noData {
  display: flex;
  height: 20rem;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.el-col {
  margin-bottom: 20px !important;
}
.el-divider--horizontal {
  margin: 10px 0px;
}
.examine {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
