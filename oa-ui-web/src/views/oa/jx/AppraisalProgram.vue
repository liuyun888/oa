<template>
  <section >
    <el-row class="page-container padding">
      <el-col :span="6" class="padding border">
        <div class="left">
          <div class="left-header">
            <el-input
              placeholder="查询模板"
              suffix-icon="el-icon-search"
              v-model="filters.key"
              style="width:50%"
            ></el-input>
            <el-button @click="addClick">新建</el-button>
          </div>
          <div class="left-content" v-loading="load.list">
            <div v-for="(item,index) in schemeListCpd" :key="index">
              <div class="left-contetn-title" v-text="item.name+'('+item.schemes.length+')'"></div>
              <ul v-if="item.schemes.length>0">
                <li
                  v-for="(i,index) in item.schemes"
                  :key="index"
                  :class="{clickli:i.id == clickli}"
                  @click="showJxAssessScheme(i)"
                >
                  <span v-text="i.name"></span>
                  <div class="record-button">
                    <el-button
                      type="text"
                      style="font-size:12px"
                      @click.stop="copyJxAssessScheme(i)"
                    >复制</el-button>
                    <el-button type="text" style="font-size:12px" @click.stop="delJxAssessScheme(i)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" class="padding border">
          <el-row>
            <el-col :span="6">{{jxAssessScheme.id?'编辑':'新增'}}</el-col>
            <el-col :offset="12" :span="6">
              <el-button
                class="right-operation"
                type="primary"
                :disabled="load.edit==true"
                v-loading="load.edit"
                @click="editSubmit"
              >保存</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-form :model="jxAssessScheme"   size="small" label-width="120px" :rules="addFormRules"  ref="jxAssessSchemeRef">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="考核类型" prop="schemeType">
                      <el-select :disabled="!!jxAssessScheme.id" v-model="jxAssessScheme.schemeType" placeholder="请选择" style="width:100%" @change="onSchemeTypeChange">
                        <el-option
                          v-for="item in dicts.jxSchemeType"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="方案名称" prop="name">
                        <el-input v-model="jxAssessScheme.name" placeholder="请输入方案名称"  ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              <el-form-item label="自评开放时间" prop="planStartDay">
                在
                <font v-if="jxAssessScheme.schemeType=='0'">每月末</font>
                <font v-else-if="jxAssessScheme.schemeType=='1'">每季末</font>
                <font v-else-if="jxAssessScheme.schemeType=='2'">每半年末</font>
                <font v-else-if="jxAssessScheme.schemeType=='3'">每年末</font>
                <el-select
                  v-model="jxAssessScheme.planStartType"
                  placeholder="请选择" style="width:100px;"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input v-model="jxAssessScheme.planStartDay" placeholder style="width:100px;" ></el-input>
                <span class="row-span">天</span> 开始，到

                <font v-if="jxAssessScheme.schemeType=='0'">每月末</font>
                <font v-else-if="jxAssessScheme.schemeType=='1'">每季末</font>
                <font v-else-if="jxAssessScheme.schemeType=='2'">每半年末</font>
                <font v-else-if="jxAssessScheme.schemeType=='3'">每年末</font>

                <el-select
                  v-model="jxAssessScheme.planEndType"
                  placeholder="请选择" style="width:100px;"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input v-model="jxAssessScheme.planEndDay" placeholder style="width:100px;" ></el-input>
                <span class="row-span">天</span>结束,这段时间内员工可以进行绩效自评
               </el-form-item>
               <el-form-item label="考核指标模板" prop="templateName">
                 <el-input size="small" style="width:30%;" :disabled="!!jxAssessScheme.id"
                  placeholder="请选择模板"
                  v-model="jxAssessScheme.templateName"
                  suffix-icon="el-icon-search"  @focus="showTemplateSelect"
                ></el-input>
                 <font color="red" v-if="jxAssessScheme.templateName">&nbsp;&nbsp;模板总分{{jxAssessScheme.totalPoints}}</font>
                <el-button v-if="jxAssessScheme.templateName"  @click="employeeInfoVisible=true">查看适用该模板的员工</el-button>

              </el-form-item>
              <el-form-item label="说明" prop="remark">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="jxAssessScheme.remark"
                ></el-input>
              </el-form-item>

              <el-form-item>
                 <el-checkbox v-model="jxAssessScheme.status" true-label="1" false-label="0">启用方案</el-checkbox>
                <el-checkbox v-model="jxAssessScheme.autoInit"  true-label="1" false-label="0">自动初始化</el-checkbox>
                <el-checkbox v-model="jxAssessScheme.remindStatus"  true-label="1" false-label="0">提醒考核</el-checkbox>
              </el-form-item>
            </el-form>
          </el-row>

          <el-row v-show="jxAssessScheme&&jxAssessScheme.id">
              <jx-assess-scheme-exec-mng :jx-assess-scheme="jxAssessScheme" :visible="execMngVisible"  ref="schemeExecMngRef"></jx-assess-scheme-exec-mng>
          </el-row>
      </el-col>
    </el-row>
      <el-dialog title="选择模板" :visible.sync="templateListVisible"  size="40%" top="10vh" append-to-body  :close-on-click-modal="false">
				<assess-template :show-type="'select'" :visible="templateListVisible" @select="onTemplateSelect" :scheme-type="jxAssessScheme.schemeType"></assess-template>
			</el-dialog>

      <el-dialog title="查看员工列表" :visible.sync="employeeInfoVisible"  fullscreen append-to-body  :close-on-click-modal="false">
				 <employee-info :template-id="jxAssessScheme.templateId"></employee-info>
			</el-dialog>
  </section>
</template>
<script>
import {
  listJxAssessScheme,
  addJxAssessScheme,
  editJxAssessScheme,
  delJxAssessScheme,
  copyJxAssessScheme,
} from "@/api/oa/jx/jxAssessScheme";
import { mapGetters } from "vuex";
import JxAssessSchemeExecMng from "@/views/oa/jx/jxAssessSchemeExec/JxAssessSchemeExecMng"
import AssessTemplate from "@/views/oa/jx/AssessTemplate"
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import EmployeeInfo from '../hr/user/employeeInfo.vue';
export default {
  computed: {
    ...mapGetters(["userInfo"]),

    schemeListCpd(){
      var schemes=this.jxAssessSchemes;
      var schemeTypes=this.dicts.jxSchemeType;
      schemeTypes.forEach(i=>{
        if( !schemes || schemes.length==0){
          i.schemes=[]
        }else{
          var schemesf= schemes.filter(k=>k.schemeType==i.id);
          if(schemesf && schemesf.length>0){
            i.schemes=schemesf
          }else{
            i.schemes=[]
          }
        }
      })

      return schemeTypes;
    }
  },
  data() {
    return {
      filters: {
        key: ''
      },
      input: "",
      options: [
        {
          value: "1",
          label: "之前"
        },
        {
          value: "2",
          label: "之后"
        }
      ],
      addFormRules: {
        name: [
          { required: true, message: "考核模板名称不能为空", trigger: "blur" }
        ],
        schemeType: [
          { required: true, message: "考核方案类型不能为空", trigger: "blur" }
        ],
        templateId: [
          { required: true, message: "绩效模板不能为空", trigger: "blur" }
        ],
      },
      jxAssessSchemes: [],
      jxAssessScheme: {
        id: "",
        schemeType: "",
        planStartDay: "",
        planStartType: "",
        remark: "",
        planEndDay: "",
        planEndType: "",
        branchId: "",
        status: "0",
        remindStatus: "0",
        createdAt: "",
        updatedAt: "",
        templateId:'',
        templateName:'',
        name:'',
        autoInit:'0',
        totalPoints:100,
      },
      planIsUseed: true,
      planIsRemind: true,
      clickli: "0",
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      execMngVisible:false,
      dicts:{
        jxSchemeType:[],
      },
      templateListVisible:false,
      employeeInfoVisible:false,
    };
  },
  methods: {
    getJxAssessSchemes() {
      let params = {
        branchId: this.userInfo.branchId
      };
      listJxAssessScheme(params).then(res => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.jxAssessSchemes = res.data.data;
        } else {
          this.$message({ message: tips.msg, type: "error" });
        }
      });
    },
    //选择考核方案类型
    showJxAssessScheme(scheme) {
      this.jxAssessScheme = Object.assign({},scheme);
    },
    addClick(){
      this.$refs["jxAssessSchemeRef"].resetFields();
      this.jxAssessScheme.id=""
      this.jxAssessScheme.planStartType="1"
      this.jxAssessScheme.planStartDay=10
      this.jxAssessScheme.planEndType="2"
      this.jxAssessScheme.planEndDay=10
      this.jxAssessScheme.status="0"
      this.jxAssessScheme.remindStatus="0"
      this.jxAssessScheme.autoInit="0"
    },
    //保存
    editSubmit: function() {
      let boo = this.verify();
      if (boo) {
        this.$confirm("确认提交吗？", "提示", {}).then(() => {
          this.load.edit = true;
          this.jxAssessScheme.planIsUseed =
            this.planIsUseed == true ? "1" : "2";
          this.jxAssessScheme.planIsRemind =
            this.planIsRemind == true ? "1" : "2";
          let params = Object.assign({}, this.jxAssessScheme);
          var fun=editJxAssessScheme;
          if(!this.jxAssessScheme.id){
            fun=addJxAssessScheme
          }
          fun(params)
            .then(res => {
              this.load.edit = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.jxAssessScheme=res.data.data;
                this.getJxAssessSchemes();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(err => (this.load.edit = false));
        });
      }
    },
    //校验选择的时间是否正确
    verify() {
      let planStartType = this.jxAssessScheme.planStartType;
      let planEndType = this.jxAssessScheme.planEndType;
      let planStartDay = this.jxAssessScheme.planStartDay;
      let planEndDay = this.jxAssessScheme.planEndDay;
      let ex = /^\d+$/;
      if (!ex.test(planStartDay)) {
        this.$message.error("起始时间必须为整数");
        return false;
      }
      if (!ex.test(planEndDay)) {
        this.$message.error("结束时间必须为整数");
        return false;
      }
      if (parseInt(planStartDay) > 360) {
        this.$message.error("起始时间不能大于360");
        return false;
      }
      if (parseInt(planEndDay) > 360) {
        this.$message.error("结束时间不能大于360");
        return false;
      }
      if (parseInt(planStartDay) < 1) {
        this.$message.error("起始时间必须大于等于1");
        return false;
      }
      if (parseInt(planEndDay) < 1) {
        this.$message.error("结束时间必须大于等于1");
        return false;
      }
      //之前--之前
      if (planStartType == "1" && planEndType == "1") {
        if (parseInt(planStartDay) < parseInt(planEndDay)) {
          this.$message.error("考核时间设置不正确");
          return false;
        }
      }
      //之后--之前
      if (planStartType == "2" && planEndType == "1") {
        this.$message.error("考核时间设置不正确");
        return false;
      }
      //之后--之后
      if (planStartType == "2" && planEndType == "2") {
        if (parseInt(planStartDay) > parseInt(planEndDay)) {
          this.$message.error("考核时间设置不正确");
          return false;
        }
      }
      return true;
    },
    //删除模板
    delJxAssessScheme(jxAssessScheme) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = { id: jxAssessScheme.id };
        delJxAssessScheme(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
               this.getJxAssessSchemes();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //复制模板
    copyJxAssessScheme(jxAssessScheme) {
      let params = {
        id: jxAssessScheme.id
      };
      copyJxAssessScheme(params).then(res => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.getJxAssessSchemes();
        }
        this.$message({
          message: tips.msg,
          type: tips.isOk ? "success" : "error"
        });
      });
    },
    showTemplateSelect(){
       if(!this.jxAssessScheme.schemeType){
        this.$message({
          message: '请先选择考核类型',
          type:  "error"
        });
        return;
      }
      this.templateListVisible=true
    },
    onTemplateSelect(template){
      if(!this.jxAssessScheme.schemeType){
        this.$message({
          message: '请先选择考核类型',
          type:  "error"
        });
        this.templateListVisible=false;
        return;
      }
      if(template.schemeType!=this.jxAssessScheme.schemeType){
        this.$message({
          message: '模板方案类型不匹配，请选择同类型的模板',
          type:  "error"
        });
        return;
      }
      this.jxAssessScheme.templateId=template.id
      this.jxAssessScheme.templateName=template.name
      this.jxAssessScheme.totalPoints=template.totalPoints
      this.jxAssessScheme.name=template.name.replaceAll("模板","")+"方案"
      this.templateListVisible=false;
    },

    onSchemeTypeChange(){
      var scheme=this.dicts.jxSchemeType.find(i=>i.id==this.jxAssessScheme.schemeType)
      this.jxAssessScheme.templateId=''
      this.jxAssessScheme.templateName=''
    },
    showLinkUsersByTemplateId(){

    }
  },
  components:{
    JxAssessSchemeExecMng,AssessTemplate,
    EmployeeInfo,
  },
  mounted() {
    initSimpleDicts('all',['jxSchemeType']).then(res=>this.dicts=res.data.data);
    this.getJxAssessSchemes();
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
}

.left {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  .left-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .left-title {
      padding-left: 15px;
      font-size: 14px;
      padding-top: 1rem;
    }
  }
  .left-content {
    color: #666666;
    height: 47rem;
    font-size: 12px;
    .left-contetn-title {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
    }
    .left-contetn-title:hover {
      background: #ecf0f1;
    }
    ul {
      padding: 0px;
      margin: 0px;
    }
    li {
      color: #666666;
      height: 40px;
      line-height: 40px;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px;
      list-style-type: none;
    }
    li:hover {
      background: #e7ecf6;
    }
    .clickli {
      background: #e7ecf6;
    }
    .record-button {
      display: none;
    }
    li:hover .record-button {
      display: block;
    }
  }
}
.right {
  background-color: #ffffff;
  height: 50rem;
  border-radius: 2px;
  overflow: hidden;
  font-size: 14px!important;

  .right-header {
    height: 3rem;
    background: #fafbfc;
    border-bottom: 1px solid #efefef;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .right-title {
      padding-top: 1rem;
      font-size: 14px;
      padding-left: 15px;
    }
    .right-operation {
      padding-right: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .right-content {
    color: #666666;
    height: 47rem;
    padding: 15px;
    .right-content-row {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .row-left {
        width: 20%;
      }
      .row-right {
        width: 80%;
      }
      .row-flex {
        display: flex;
        justify-items: center;
        justify-content: flex-start;
        .row-span {
          height: 36px;
          line-height: 36px;
          margin: 0px 5px;
        }
      }
    }
    .footer {
      border: 1px solid #f3f3f3;
      background: #f3f3f3;
      padding: 10px 20px;
      color: #333333;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
