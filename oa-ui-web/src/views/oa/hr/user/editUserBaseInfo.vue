<template>
  <section>
    <div class="header">
      <div class="header-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>人事档案</el-breadcrumb-item>
          <el-breadcrumb-item>员工信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-button size="mini" @click="close">关闭</el-button>
      </div>
    </div>
    <!-- <div class="userInfo"></div> -->
    <div class="content">
      <div class="content-left">
        <el-steps direction="vertical" space="50px" :active="activeStep">
          <el-step
            v-for="(item, index) in stepsArr"
            :key="index"
            :title="item.title"
            @click.native="jump(index)"
          ></el-step>
        </el-steps>
      </div>
      <div class="content-right" ref="contentRight">
        <!-- 头像-->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">头像</span>
          </div>
          <div style="margin: 20px;" class="head-portrait">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="uploadParams"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="head-portrait-box1">
              <div>
                <span>{{baseInfo.username}}</span>
                <span>
                  <el-tag>{{baseInfo.status}}</el-tag>
                </span>
              </div>
              <div v-text="baseInfo.deptName +'  '+ baseInfo.post"></div>
              <div style>本企业工龄</div>
              <div v-text="dateStr"></div>
            </div>
            <!-- <div class="head-portrait-box2"></div> -->
          </div>
        </el-card>
        <!-- 个人信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">个人信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="openDialog('perInfo')"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">姓名</div>
              <div class="box">{{baseInfo.username}}</div>
              <div class="box">曾用名</div>
              <div class="box">{{baseInfo.formerName}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">身份证号码</div>
              <div class="box">{{baseInfo.idCardNo}}</div>
              <div class="box">性别</div>
              <div class="box">{{baseInfo.sex == "0" ? "男" : " 女"}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">出生日期</div>
              <div class="box">{{baseInfo.birthdate}}</div>
              <div class="box">年龄</div>
              <div class="box">{{baseInfo.age}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">民族</div>
              <div class="box">{{baseInfo.nation}}</div>
              <div class="box">政治面貌</div>
              <div class="box">{{baseInfo.politicsStatus}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">入团日期</div>
              <div class="box">{{baseInfo.smokedDate}}</div>
              <div class="box">入党日期</div>
              <div class="box">{{baseInfo.partyDate}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">最高学历</div>
              <div class="box">{{baseInfo.eduBack}}</div>
              <div class="box">最高学位</div>
              <div class="box">{{baseInfo.degree}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">婚姻情况</div>
              <div class="box">{{baseInfo.maritalStatus}}</div>
              <div class="box">健康情况</div>
              <div class="box">{{baseInfo.healthyCondition}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">身高(厘米)</div>
              <div class="box">{{baseInfo.stature}}</div>
              <div class="box">体重(千克)</div>
              <div class="box">{{baseInfo.weight}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">现居地</div>
              <div class="box">{{baseInfo.presentAddress}}</div>
              <div class="box">籍贯</div>
              <div class="box">{{baseInfo.nativePlace}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">出生地</div>
              <div class="box">{{baseInfo.birthplace}}</div>
              <div class="box">户口所在地</div>
              <div class="box">{{baseInfo.regPerResidence}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">户口所在派出所</div>
              <div class="box">{{baseInfo.regPerResidenceLocal}}</div>
              <div class="box">到本单位日期</div>
              <div class="box">{{baseInfo.startTime}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">参加工作日期</div>
              <div class="box">{{baseInfo.workTime}}</div>
              <div class="box">连续工龄</div>
              <div class="box">{{baseInfo.workingYears}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">本企业工龄</div>
              <div class="box">{{baseInfo.enterpriseYears}}</div>
              <div class="box"></div>
              <div class="box"></div>
            </div>
          </div>
        </el-card>
        <!-- 在职信息 -->
        <el-card class="box-card step-jump" v-if="empStatus">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">在职信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="openDialog('jobInfo')"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">系统编号</div>
              <div class="box">{{baseInfo.userid}}</div>
              <div class="box">所属机构</div>
              <div class="box">{{baseInfo.branchName}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">所在部门</div>
              <div class="box">{{baseInfo.deptName}}</div>
              <div class="box">汇报上级</div>
              <div class="box">{{baseInfo.reportName}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">所属岗位</div>
              <div class="box">{{baseInfo.postName}}</div>
              <div class="box">职责描述</div>
              <div class="box">{{baseInfo.duty}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">工作地点</div>
              <div class="box">{{baseInfo.workplace}}</div>
              <div class="box">工号</div>
              <div class="box">{{baseInfo.displayUserid}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">
                职业技能：
                <el-tag
                  style="margin-left:10px;margin-bottom:10px"
                  v-for="(skill,index) in hrSkills"
                  :key="index"
                >{{skill.skillName}}</el-tag>
              </div>
            </div>
          </div>

        </el-card>
        <!-- 离职信息 -->
        <el-card class="box-card step-jump" v-if="!empStatus">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">离职信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="editDimissionVisible = true"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">申请离职日期</div>
              <div class="box">{{dimission.applyTime}}</div>
              <div class="box">实际离职日期</div>
              <div class="box">{{dimission.practicalTime}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">薪资结算日期</div>
              <div class="box">{{dimission.balanceDate}}</div>
              <div class="box">离职原因</div>
              <div class="box">{{dimission.cause}}</div>
            </div>

            <div class="cardBoxs">
              <div class="box">离职备注</div>
              <div class="box">{{dimission.remark}}</div>
              <div class="box"></div>
              <div class="box"></div>
            </div>
          </div>

        </el-card>
        <!-- 员工状态 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">员工状态</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="openDialog('statusInfo')"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">员工状态</div>
              <div class="box">{{baseInfo.status}}</div>
              <div class="box">人员级别</div>
              <div class="box">{{baseInfo.level}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">工作性质</div>
              <div class="box">{{baseInfo.jobNature}}</div>
              <div class="box">入职日期</div>
              <div class="box">{{baseInfo.entryTime}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">用工期限(年)</div>
              <div class="box">{{baseInfo.jobDeadline}}</div>
              <div class="box">转正日期</div>
              <div class="box">{{baseInfo.positiveTime}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">试用期限(月)</div>
              <div class="box">{{baseInfo.trialDeadline}}</div>
              <div class="box"></div>
              <div class="box"></div>
            </div>
          </div>

        </el-card>
        <!-- 联系信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">联系信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="openDialog('StaffInfo')"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">手机号码</div>
              <div class="box">{{baseInfo.phoneno}}</div>
              <div class="box">邮箱地址</div>
              <div class="box">{{baseInfo.email}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">办公地点</div>
              <div class="box">{{baseInfo.officeAddress}}</div>
              <div class="box">办公电话</div>
              <div class="box">{{baseInfo.officePhoneno}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">紧急联系人</div>
              <div class="box">{{baseInfo.emergencyContact}}</div>
              <div class="box">紧急联系人电话</div>
              <div class="box">{{baseInfo.emeContactPho}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">其他联系方式</div>
              <div class="box">{{baseInfo.ortherPhoneno}}</div>
              <div class="box"></div>
              <div class="box"></div>
            </div>
          </div>

        </el-card>
        <!-- 家庭信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">家庭信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              v-if="!open.family"
              @click="openItem('family')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
           <el-button
              style="float: right; padding: 3px 0"
              type="text"
              v-if="open.family"
              @click="openItem('family')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.family"
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="add('familyInfo')"
            >&nbsp;&nbsp;新增</el-button>
          </div>
          <hr-user-family-infoMng v-if="open.family" style="margin: 20px;" ref="familyInfo" :userid="baseInfo.userid"></hr-user-family-infoMng>
        </el-card>
        <!-- 任职记录 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">任职记录</span>
            <el-button
              v-if="!open.record"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('record')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              v-if="open.record"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('record')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.record"
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="add('record')"
            >&nbsp;&nbsp;新增</el-button>
          </div>
          <hr-user-record-mng v-if="open.record" style="margin: 20px;" ref="record" :userid="baseInfo.userid"></hr-user-record-mng>
        </el-card>

        <!-- 个人经历 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">个人经历</span>
            <el-button
              v-if="!open.experience"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('experience')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              v-if="open.experience"
              @click="openItem('experience')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
          </div>
          <div v-if="open.experience" style="margin: 20px;">
            <div class="box-title">
              <span class="span1"></span>
              <span class="span2">工作经历</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                class="span3 el-icon-plus"
                @click="add('workExperience')"
              >&nbsp;&nbsp;新建</el-button>
            </div>
            <hr-user-worked-mng ref="workExperience" :userid="baseInfo.userid"></hr-user-worked-mng>
            <div class="box-title">
              <span class="span1"></span>
              <span class="span2">教育记录</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                class="span3 el-icon-plus"
                @click="add('eduRecord')"
              >&nbsp;&nbsp;新建</el-button>
            </div>
            <hr-user-edu-recordmng ref="eduRecord" :userid="baseInfo.userid"></hr-user-edu-recordmng>
            <div class="box-title">
              <span class="span1"></span>
              <span class="span2">培训记录</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                class="span3 el-icon-plus"
                @click="add('trainRecord')"
              >&nbsp;&nbsp;新建</el-button>
            </div>
            <hr-user-train-mng ref="trainRecord" :userid="baseInfo.userid"></hr-user-train-mng>
            <div class="box-title">
              <span class="span1"></span>
              <span class="span2">资格证书</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                class="span3 el-icon-plus"
                @click="add('credential')"
              >&nbsp;&nbsp;新建</el-button>
            </div>
            <hr-user-credential-mng ref="credential" :userid="baseInfo.userid"></hr-user-credential-mng>
            <attachment-upload
              @uploadSuccess="uploadSuccess"
              @on-remove="onRemove"
              :userId="baseInfo.userid"
              :isUserInfo="isUserInfo"
              :branchId="userInfo.branchId"
              :categoryId="categoryId"
              :limit="10"
              style="margin-top:20px"
            ></attachment-upload>
          </div>
        </el-card>
        <!-- 合同信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">合同信息</span>
            <el-button
              v-if="!open.contract"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('contract')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              v-if="open.contract"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('contract')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.contract"
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="add('contract')"
            >&nbsp;&nbsp;新增</el-button>
          </div>
          <hr-user-contract-mng v-if="open.contract" style="margin: 20px;" ref="contract" :userid="baseInfo.userid"></hr-user-contract-mng>
        </el-card>

        <!-- 奖惩信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">奖惩信息</span>
            <el-button
              v-if="!open.repuType"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('repuType')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              v-if="open.repuType"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('repuType')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.repuType"
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="add('repuType')"
            >&nbsp;&nbsp;新增</el-button>
          </div>
          <hr-user-incentive-info-mng v-if="open.repuType" style="margin: 20px;" ref="repuType" :userid="baseInfo.userid"></hr-user-incentive-info-mng>
        </el-card>
        <!-- 账户信息(个人) -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">账户信息(个人)</span>
            <el-button
              v-if="!open.userInfo"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('userInfo')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              v-if="open.userInfo"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('userInfo')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.userInfo"
              style="float: right; padding: 3px 0"
              type="text"
              @click="editSalaryWelfareBtn"
            >编辑</el-button>
          </div>
          <div v-if="open.userInfo" style="margin: 20px;">
            <div class="cardBoxs">
              <div class="box">工资账户名</div>
              <div class="box">{{salaryWelfare.salaryAccountName}}</div>
              <div class="box">工资银行</div>
              <div class="box">{{salaryWelfare.salaryBank}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">工资账号</div>
              <div class="box">{{salaryWelfare.salaryAccount}}</div>
              <div class="box">公积金账户</div>
              <div class="box">{{salaryWelfare.accumulationAccount}}</div>
            </div>
            <div class="cardBoxs">
              <div class="box">社保号码</div>
              <div class="box">{{salaryWelfare.socialSecurity}}</div>
              <div class="box"></div>
              <div class="box"></div>
            </div>
            <div class="box-title">
              <span class="span1"></span>
              <span class="span2">工资记录</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                class="span3 el-icon-plus"
                @click="add('salary')"
              >&nbsp;&nbsp;新建</el-button>
            </div>
            <hr-user-salary-mng :userid="baseInfo.userid" ref="salary"></hr-user-salary-mng>
          </div>
        </el-card>

        <!-- 个人假期 -->
       <!-- <el-card class="box-card step-jump">
          <div style="margin: 20px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="带薪假期" name="first">
                <div class="box-title">
                  <span class="span1">个人假期</span>
                  <span class="span2">带薪假期</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    class="span3 el-icon-plus"
                    @click="add('perHoliday')"
                  >&nbsp;&nbsp;新建</el-button>
                </div>
                <hr-user-per-holiday-mng ref="perHoliday" :userid="baseInfo.userid"></hr-user-per-holiday-mng>
              </el-tab-pane>
              <el-tab-pane label="请假明细" name="second">
                <div class="box-title">
                  <span class="span1"></span>
                  <span class="span2">请假明细</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    class="span3 el-icon-plus"
                    @click="add('leave')"
                  >&nbsp;&nbsp;新建</el-button>
                </div>
                <hr-user-leave-mng ref="leave" :userid="baseInfo.userid"></hr-user-leave-mng>
              </el-tab-pane>
              <el-tab-pane label="加班明细" name="third">
                <div class="box-title">
                  <span class="span1"></span>
                  <span class="span2">加班明细</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    class="span3 el-icon-plus"
                    @click="add('overtime')"
                  >&nbsp;&nbsp;新建</el-button>
                </div>
                <hr-user-overtime-mng ref="overtime" :userid="baseInfo.userid"></hr-user-overtime-mng>
              </el-tab-pane>
            </el-tabs>
          </div>

        </el-card> -->

        <!-- 员工动态 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">员工动态</span>
            <el-button
              v-if="!open.dynamically"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('dynamically')"
            >&nbsp;&nbsp;展开<i class="el-icon-arrow-right"></i></el-button>
            <el-button
              v-if="open.dynamically"
              style="float: right; padding: 3px 0"
              type="text"
              @click="openItem('dynamically')"
            >&nbsp;&nbsp;收起<i class="el-icon-arrow-down"></i></el-button>
            <el-button
              v-if="open.dynamically"
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
              @click="add('dynamically')"
            >&nbsp;&nbsp;新增</el-button>
          </div>
          <hr-user-dynamically-mng v-if="open.dynamically" style="margin: 20px;" ref="dynamically" :userid="baseInfo.userid"></hr-user-dynamically-mng>
        </el-card>
      </div>
    </div>
    <!--个人信息弹框-->
    <el-dialog title="个人信息" :visible.sync="editPerInfoVisible" width="60%" top="3vh">
      <el-form ref="perInfo" :model="baseInfo" label-width="120px" size="mini" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="username" style="width:80%">
              <el-input v-model="baseInfo.username" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="曾用名" style="width:80%">
              <el-input v-model="baseInfo.formerName" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号码" style="width:80%">
              <el-input v-model="baseInfo.idCardNo" maxlength="18" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="	性别" style="width:80%">
              <el-radio v-model="baseInfo.sex" label="0">男</el-radio>
              <el-radio v-model="baseInfo.sex" label="1">女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" style="width:80%">
              <el-date-picker
                v-model="baseInfo.birthdate"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" style="width:80%">
              <el-input v-model="baseInfo.age" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" style="width:80%">
              <el-select v-model="baseInfo.nation" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in nation"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" style="width:80%">
              <el-select v-model="baseInfo.politicsStatus" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in politicsStatus"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入团日期" style="width:80%">
              <el-date-picker
                v-model="baseInfo.smokedDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入党日期" style="width:80%">
              <el-date-picker
                v-model="baseInfo.partyDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最高学历" style="width:80%">
              <el-select v-model="baseInfo.eduBack" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in eduBackground"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学位" style="width:80%">
              <el-select v-model="baseInfo.degree" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in qualification"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="婚姻情况" style="width:80%">
              <el-select v-model="baseInfo.maritalStatus" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in maritalStatus"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康情况" style="width:80%">
              <el-select v-model="baseInfo.healthyCondition" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in healCondition"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身高(厘米)" style="width:80%">
              <el-input v-model="baseInfo.stature" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重(千克)" style="width:80%">
              <el-input v-model="baseInfo.weight" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="现居地" style="width:80%">
              <el-input v-model="baseInfo.presentAddress" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" style="width:80%">
              <el-input v-model="baseInfo.nativePlace" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生地" style="width:80%">
              <el-input v-model="baseInfo.birthplace" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户口所在地" style="width:80%">
              <el-input v-model="baseInfo.regPerResidence" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="户口所在派出所" style="width:80%">
              <el-input v-model="baseInfo.regPerResidenceLocal" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到本单位日期" prop="startTime" style="width:80%">
              <el-date-picker
                v-model="baseInfo.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参加工作日期" style="width:80%">
              <el-date-picker
                v-model="baseInfo.workTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="连续工龄" style="width:80%">
              <el-input v-model="baseInfo.workingYears" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="本企业工龄" style="width:80%">
              <el-input v-model="baseInfo.enterpriseYears" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="editBtn('perInfo')"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 在职信息弹框 -->
    <el-dialog title="在职信息" :visible.sync="editJobInfoVisible" width="60%">
      <el-form ref="jobInfo" :model="baseInfo" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职务" style="width:80%">
              <el-input v-model="baseInfo.duty" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地点" style="width:80%">
              <el-input v-model="baseInfo.workplace" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所在部门/岗位" style="width:80%">
              <el-input v-model="baseInfo.postName" suffix-icon="el-icon-search" @focus="editUserDeptFormVisible = true"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇报上级" style="width:80%">
              <el-input v-model="baseInfo.reportName" maxlength="50" clearable suffix-icon="el-icon-search" @focus="userSelectVisible = true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="在职技能" style="width:80%">
              <el-tag
                :key="index"
                v-for="(skill,index) in hrSkills"
                closable
                @close="handleClose(skill,index)"
                style="margin-left:10px;margin-bottom:10px"
              >{{skill.skillName}}</el-tag>
              <el-button type="text" @click="skillSelectVisible = true">选择技能</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="editBtn('jobInfo')"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 联系信息弹框 -->
    <el-dialog title="联系信息" :visible.sync="editStaffInfoVisible" width="60%">
      <el-form ref="StaffInfo" :model="baseInfo" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneno" style="width:80%">
              <el-input v-model="baseInfo.phoneno" maxlength="11" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" style="width:80%">
              <el-input v-model="baseInfo.email" maxlength="20" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="办公地点" style="width:80%">
              <el-input v-model="baseInfo.officeAddress" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话" style="width:80%">
              <el-input v-model="baseInfo.officePhoneno" maxlength="11" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="紧急联系人" style="width:80%">
              <el-input v-model="baseInfo.emergencyContact" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人电话" style="width:80%">
              <el-input v-model="baseInfo.emeContactPho" maxlength="11" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="其他联系方式" style="width:80%">
              <el-input v-model="baseInfo.ortherPhoneno" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="editBtn('StaffInfo')"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 员工状态弹框 -->
    <el-dialog title="员工状态" :visible.sync="editstatusInfoVisible" width="60%">
      <el-form ref="statusInfo" :model="baseInfo" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工状态" style="width:80%">
              <el-select v-model="baseInfo.status" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in staffStatus"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员类别" style="width:80%">
              <el-select v-model="baseInfo.level" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in perCategory"
                  :key="item.optionName"
                  :label="item.optionName"
                  :value="item.optionValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作性质" style="width:80%">
              <el-input v-model="baseInfo.jobNature" maxlength="50" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryTime" style="width:80%">
              <el-date-picker
                v-model="baseInfo.entryTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用工期限(年)" style="width:80%">
              <el-input v-model="baseInfo.jobDeadline" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转正日期" style="width:80%">
              <el-date-picker
                v-model="baseInfo.positiveTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="试用期限(月)" prop="trialDeadline" style="width:80%">
              <el-input v-model="baseInfo.trialDeadline" maxlength="8" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="editBtn('statusInfo')"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 薪酬福利弹框 -->
    <el-dialog title="薪酬福利" :visible.sync="editSalaryWelfareVisible" width="60%">
      <el-form ref="salaryWelfare" :model="salaryWelfare" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工资账户名" prop="salaryAccountName" style="width:80%">
              <el-input
                v-model="salaryWelfare.salaryAccountName"
                placeholder="工资账户名"
                maxlength="18"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工资银行" prop="salaryBank" style="width:80%">
              <el-input
                v-model="salaryWelfare.salaryBank"
                placeholder="工资银行"
                maxlength="50"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工资账号" prop="salaryAccount" style="width:80%">
              <el-input
                v-model="salaryWelfare.salaryAccount"
                placeholder="工资账号"
                maxlength="18"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公积金账户" prop="accumulationAccount" style="width:80%">
              <el-input
                v-model="salaryWelfare.accumulationAccount"
                placeholder="公积金账户"
                maxlength="18"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社保号码" prop="socialSecurity" style="width:80%">
              <el-input
                v-model="salaryWelfare.socialSecurity"
                placeholder="社保号码"
                maxlength="18"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="concalSalaryWelfare">取 消</el-button>
        <el-button
          type="primary"
          @click="editSalaryWelfare"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >提 交</el-button>
      </span>
    </el-dialog>
    <!-- 离职信息弹框 -->
    <el-dialog title="离职信息" :visible.sync="editDimissionVisible" width="60%">
      <el-form ref="dimission" :model="dimission" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请离职日期" prop="applyTime">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dimission.applyTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际离职日期" prop="practicalTime">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dimission.practicalTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="薪资结算日期" prop="balanceDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dimission.balanceDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职原因" prop="cause">
              <el-input v-model="dimission.cause" placeholder="离职原因" maxlength="255" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="离职备注" prop="remark">
              <el-input v-model="dimission.remark" placeholder="离职备注" maxlength="255" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button
          type="primary"
          @click="editDimission"
          v-loading="load.edit"
          :disabled="load.edit==true"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--设置用户部门界面-->
    <el-dialog
      title="设置所在部门及归属岗位"
      :visible.sync="editUserDeptFormVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-dept-edit 
        :user="{userid:baseInfo.userid,username:baseInfo.username}"
        :branch="{id:userInfo.branchId,branchName:userInfo.branchName}"
        :visible="editUserDeptFormVisible"
        @cancel="editUserDeptFormVisible=false"
        @submit="onUserDeptSubmit"
      ></user-dept-edit>
    </el-dialog>
    <!-- 选择上级 -->
    <el-dialog append-to-body title="选择上级" :visible.sync="userSelectVisible" width="70%">
      <users-select @confirm="onUserSelected"></users-select>
    </el-dialog>
    <el-dialog
      append-to-body
      title="技能条件"
      :visible.sync="skillSelectVisible"
      class="dialog-body"
      width="60%"
    >
      <skill-mng :skillIds="skillIds" :jump="true" @select-confirm="onTagSelected"></skill-mng>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
import {
  listHrUserBaseInfo,
  editHrUserBaseInfo,
  getEmployeeInfo,
} from "@/api/oa/hr/user/hrUserBaseInfo";
import {
  listArchiveAttachment,
  delArchiveAttachment,
} from "@/api/mdp/arc/archiveAttachment";
import HrUserFamilyInfoMng from "@/views/oa/hr/user/hrUserFamilyInfo/HrUserFamilyInfoMng"; //家庭信息
import HrUserRecordMng from "@/views/oa/hr/user/hrUserRecord/HrUserRecordMng"; //任职记录
import HrUserWorkedMng from "@/views/oa/hr/user/hrUserWorked/HrUserWorkedMng"; //工作经历
import HrUserEduRecordMng from "@/views/oa/hr/user/hrUserEduRecord/HrUserEduRecordMng"; //教育记录
import HrUserTrainMng from "@/views/oa/hr/user/hrUserTrain/HrUserTrainMng"; //培训记录
import HrUserCredentialMng from "@/views/oa/hr/user/hrUserCredential/HrUserCredentialMng"; //资格证书
import HrUserContractMng from "@/views/oa/hr/user/hrUserContract/HrUserContractMng"; //合同信息
import HrUserIncentiveInfoMng from "@/views/oa/hr/user/hrUserIncentiveInfo/HrUserIncentiveInfoMng"; //奖惩信息
import HrUserSalaryMng from "@/views/oa/hr/user/hrUserSalary/HrUserSalaryMng"; //工资调整记录
import HrUserPerHolidayMng from "@/views/oa/hr/user/hrUserPerHoliday/HrUserPerHolidayMng"; //带薪假期
import HrUserLeaveMng from "@/views/oa/hr/user/hrUserLeave/HrUserLeaveMng"; //请假明细
import HrUserOvertimeMng from "@/views/oa/hr/user/hrUserOvertime/HrUserOvertimeMng"; //加班明细
import HrUserDynamicallyMng from "@/views/oa/hr/user/hrUserDynamically/HrUserDynamicallyMng"; //员工动态
import config from "@/common/config"; //全局公共库import
import { editHrUserTreatmentByUserid,listHrUserTreatment } from "@/api/oa/hr/user/hrUserTreatment";
import {
  addHrUserDimission,
  editHrUserDimission,
  delHrUserDimission,
  listHrUserDimission,
} from "@/api/oa/hr/user/hrUserDimission";
import {
  addHrUserAccessory,
  delHrUserAccessoryByWhere,
} from "@/api/oa/hr/user/hrUserAccessory";
import DeptTree from "@/views/mdp/sys/dept/DeptTree.vue";
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import UserDeptEdit from "@/views/mdp/sys/userDept/UserDeptEdit"; //修改部门和岗位
import { datemonth } from "@/utils/index";
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import skillMng from "@/views/oa/hr/skill/skillMng";
import { getUserDeptPost } from "@/api/oa/hr/user/sysUser";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      activeStep: 0,
      scrollTop: 0, // 没用到
      //步骤条
      stepsArr: [
        { title: "头像" },
        { title: "个人信息" },
        { title: "在职信息" },
        { title: "员工状态" },
        { title: "联系信息" },
        { title: "家庭信息" },
        { title: "任职记录" },
        { title: "个人经历" },
        { title: "合同信息" },
        { title: "奖惩信息" },
        { title: "账户信息(个人)" },
        // { title: "个人假期" },
        { title: "员工动态" },
      ],
      isUserInfo:1, 
      //其他信息对象
      baseInfo: {
        id: "",
        userid: "",
        deptid: "",
        deptName: "",
        branchId: "",
        branchName: "",
        reportId: "",
        reportName: "",
        duty: "",
        workplace: "",
        account: "",
        post: "",
        status: "",
        level: "",
        jobNature: "",
        entryTime: "",
        positiveTime: "",
        jobDeadline: "",
        trialDeadline: "",
        phoneno: "",
        email: "",
        officeAddress: "",
        officePhoneno: "",
        emergencyContact: "",
        emeContactPho: "",
        ortherPhoneno: "",
        username: "",
        formerName: "",
        idCardNo: "",
        sex: "",
        birthdate: "",
        age: "",
        nation: "",
        politicsStatus: "",
        smokedDate: "",
        partyDate: "",
        eduBack: "",
        degree: "",
        maritalStatus: "",
        healthyCondition: "",
        stature: "",
        weight: "",
        presentAddress: "",
        nativePlace: "",
        birthplace: "",
        regPerResidence: "",
        regPerResidenceLocal: "",
        startTime: "",
        workTime: "",
        workingYears: "",
        enterpriseYears: "",
        accessory: "",
        skillIds: [],
      },
      //离职信息对象
      dimission: {
        id: "",
        applyTime: "",
        practicalTime: "",
        balanceDate: "",
        cause: "",
        remark: "",
      },
      //薪酬福利
      salaryWelfare: {
        salaryAccountName: "",
        salaryBank: "",
        salaryAccount: "",
        accumulationAccount: "",
        socialSecurity: "",
      },

      currentPage4: 4,
      nation: [], //民族
      politicsStatus: [], //	政治面貌
      eduBackground: [], // 学历
      qualification: [], //学位
      maritalStatus: [], //婚姻状况
      healCondition: [], //	健康情况
      perCategory: [], //人员类别
      staffStatus: [], //员工状态
      contractType: [], //合同类型
      contractStatus: [], //合同状态
      repuType: [], //奖惩类型
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      editPerInfoVisible: false,
      editJobInfoVisible: false,
      editstatusInfoVisible: false,
      editStaffInfoVisible: false,
      editSalaryWelfareVisible: false,
      editDimissionVisible: false,
      editUserDeptFormVisible: false,
      userSelectVisible: false,
      skillSelectVisible: false,
      activeName: "first",
      imageUrl: "",
      uploadAction: config.getArcFileUploadBasePath() + "/mdp/arc/file/upload", //上传图片的路径
      dateStr: "", //本企业工龄
      //上传头像
      uploadParams: {
        branchId: "",
        archiveId: "",
        categoryId: "",
      },
      empStatus: true, //true显示在职信息，false显示离职信息
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "到本单位日期不能为空", trigger: "blur" },
        ],
        entryTime: [
          { required: true, message: "入职日期不能为空", trigger: "blur" },
        ],
        trialDeadline: [
          { required: true, message: "试用期限(月)不能为空", trigger: "blur" },
        ],
        phoneno: [{ required: true, message: "手机不能为空", trigger: "blur" }],
        familyTies: [
          { required: true, message: "家庭关系不能为空", trigger: "blur" },
        ],
        familyName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
      },  
      categoryId: "resume",
      //附件
      accessory: {
        id: "",
        name: "",
        type: "",
        accessory: "",
        userid: "",
      },
      skillIds: [],
      hrSkills: [],
      open:[
        {family:false},
        {record:false},
        {experience:false},
        {contract:false},
        {repuType:false},
        {userInfo:false},
        {dynamically:false},
      ]
    };
  },
  created() {
    this.userid = this.$route.query.userid; 
    this.getEmployeeInfo();
    this.getOption();
  },
  mounted() {  
    this.$refs.contentRight.addEventListener("scroll", this.onScroll);
  },
  methods: {
    handleClick(row) {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //获取下拉列表数据
    getOption() {
      let params = [
        { categoryId: "all", itemCode: "qualification" },
        { categoryId: "all", itemCode: "nation" },
        { categoryId: "all", itemCode: "politicsStatus" },
        { categoryId: "all", itemCode: "maritalStatus" },
        { categoryId: "all", itemCode: "healCondition" },
        { categoryId: "all", itemCode: "perCategory" },
        { categoryId: "all", itemCode: "eduBackground" },
        { categoryId: "all", itemCode: "staffStatus" },
        { categoryId: "all", itemCode: "contractType" },
        { categoryId: "all", itemCode: "contractStatus" },
        { categoryId: "all", itemCode: "repuType" },
      ];
      listOption(params).then((res) => {
        this.nation = res.data.data.nation;
        this.qualification = res.data.data.qualification;
        this.politicsStatus = res.data.data.politicsStatus;
        this.maritalStatus = res.data.data.maritalStatus;
        this.healCondition = res.data.data.healCondition;
        this.perCategory = res.data.data.perCategory;
        this.eduBackground = res.data.data.eduBackground;
        this.staffStatus = res.data.data.staffStatus;
        this.contractType = res.data.data.contractType;
        this.contractStatus = res.data.data.contractStatus;
        this.repuType = res.data.data.repuType;
      });
    },
    //回显数据
    getEmployeeInfo() {
      let params = {
        userid: this.userid,
        branchId: this.userInfo.branchId,
      };
      getEmployeeInfo(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.baseInfo = res.data.data.baseInfoMap[0];
          //职业技能
          this.hrSkills = res.data.data.hrSkills;
          for (let i = 0; i < this.hrSkills.length; i++) {
            this.skillIds.push(this.hrSkills[i].skillId);
          }
          if (
            this.baseInfo.status == "解聘" ||
            this.baseInfo.status == "离职" ||
            this.baseInfo.status == "退休"
          ) {
            this.stepsArr[2].title = "离职信息";
            this.getDimission();
            this.empStatus = false;
          } else {
            this.stepsArr[2].title = "在职信息";
            this.empStatus = true;
          }
          if (res.data.data.salaryWelfare&&res.data.data.salaryWelfare.length > 0) {
            this.salaryWelfare = res.data.data.salaryWelfare[0];
          }
          //上传头像需要传的参数
          this.uploadParams.branchId = this.userInfo.branchId;
          this.uploadParams.archiveId = this.baseInfo.id;
          //回显头像
          if (
            this.baseInfo.accessory != "" &&
            this.baseInfo.accessory != null
          ) {
            this.imageUrl =
              config.getArcImagePath() + "/" + this.baseInfo.accessory;
          }
          //传入入职日期获取本企业工龄
          if (
            this.baseInfo.entryTime != "" &&
            this.baseInfo.entryTime != null
          ) {
            this.dateStr = datemonth(this.baseInfo.entryTime);
          } else {
            this.dateStr = "0年0月";
          }
        } else {
          this.$message({ message: tips.msg, type: "error" });
        }
      });
    },

    //打开弹框
    openDialog(formName) {
      if ("perInfo" == formName) {
        this.editPerInfoVisible = true;
      } else if ("jobInfo" == formName) {
        this.editJobInfoVisible = true;
      } else if ("statusInfo" == formName) {
        this.editstatusInfoVisible = true;
      } else if ("StaffInfo" == formName) {
        this.editStaffInfoVisible = true;
      }
      this.saveSourceData = Object.assign({}, this.baseInfo);
      // this.saveSourceData = this.baseInfo;
    },
    //修改信息按钮
    editBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editBaseInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消按钮
    cancel() {
      this.baseInfo = this.saveSourceData;
      this.editPerInfoVisible = false;
      this.editJobInfoVisible = false;
      this.editstatusInfoVisible = false;
      this.editStaffInfoVisible = false;
    },

    //修改基本信息
    editBaseInfo() {
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.load.edit = true;
        this.baseInfo.skillIds = [];
        for (let i = 0; i < this.hrSkills.length; i++) {
          this.baseInfo.skillIds.push(this.hrSkills[i].skillId);
        }
        let params = Object.assign({}, this.baseInfo);
        editHrUserBaseInfo(params)
          .then((res) => {
            this.load.edit = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.baseInfo=Object.assign(this.baseInfo,res.data.data);
              this.editPerInfoVisible = false;
              this.editJobInfoVisible = false;
              this.editstatusInfoVisible = false;
              this.editStaffInfoVisible = false;
              if (
                this.baseInfo.status == "解聘" ||
                this.baseInfo.status == "离职" ||
                this.baseInfo.status == "退休"
              ) {
                this.stepsArr[2].title = "离职信息";
                this.empStatus = false;
                this.addDimission(); //添加离职信息
              } else {
                this.stepsArr[2].title = "在职信息";
                this.empStatus = true;
                this.deleteDimission(); //删除离职信息
              }
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.edit = false));
      });
    },
    //新增
    add(ref) {
      if (ref == "familyInfo") {
        this.$refs.familyInfo.showAdd();
      } else if (ref == "record") {
        this.$refs.record.showAdd();
      } else if (ref == "workExperience") {
        this.$refs.workExperience.showAdd();
      } else if (ref == "eduRecord") {
        this.$refs.eduRecord.showAdd();
      } else if (ref == "trainRecord") {
        this.$refs.trainRecord.showAdd();
      } else if (ref == "credential") {
        this.$refs.credential.showAdd();
      } else if (ref == "contract") {
        this.$refs.contract.showAdd();
      } else if (ref == "repuType") {
        this.$refs.repuType.showAdd();
      } else if (ref == "salary") {
        this.$refs.salary.showAdd();
      } else if (ref == "perHoliday") {
        this.$refs.perHoliday.showAdd();
      } else if (ref == "leave") {
        this.$refs.leave.showAdd();
      } else if (ref == "overtime") {
        this.$refs.overtime.showAdd();
      } else if (ref == "dynamically") {
        this.$refs.dynamically.showAdd();
      }
    },
    //编辑薪酬福利按钮
    editSalaryWelfareBtn() {
      this.saveSourceData = Object.assign({}, this.salaryWelfare);
      this.editSalaryWelfareVisible = true;
    },
    //编辑薪酬福利
    editSalaryWelfare() {
      this.salaryWelfare.userid = this.userid;
      let params = Object.assign({}, this.salaryWelfare);
      this.$refs.salaryWelfare.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            editHrUserTreatmentByUserid(params)
              .then((res) => {
                this.load.edit = false;
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.SalaryWelfare = Object.assign({}, params);
                  this.editSalaryWelfareVisible = false;
                }
                this.$message({
                  message: tips.msg,
                  type: tips.isOk ? "success" : "error",
                });
              })
              .catch((err) => (this.load.edit = false));
          });
        }
      });
    },
    //取消修改
    concalSalaryWelfare() {
      this.salaryWelfare = Object.assign({}, this.saveSourceData);
      this.editSalaryWelfareVisible = false;
    },

    // 上传头像
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.baseInfo.accessory = res.data.url;
      let params = Object.assign({}, this.baseInfo);
      editHrUserBaseInfo(params)
        .then((res) => {
          var tips = res.data.tips;
        })
        .catch((err) => {
          this.$message({
            message: "保存图片失败",
            type: "error",
          });
        });
    },
    //头像上传前
    beforeAvatarUpload(file) {
      console.log(1,file.type);

      const isImg = file.type.indexOf("image/")>=0;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if(!isImg){
        this.$message.error("只能上传图片")
      }
      return isImg&&isLt2M;
    },
    //获取离职信息
    getDimission() {
      let params = {
        userid: this.baseInfo.userid,
      };
      listHrUserDimission(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          if(res.data.data.length!==0){
            this.dimission = res.data.data[0];
          }
          this.editDimissionVisible = false;
        } else {
          this.$message({ message: tips.msg, type: "error" });
        }
      });
    },
    //获取账户信息
    getSalaryWelfare() {

      let params = {
        userid: this.baseInfo.userid,
      };
      listHrUserTreatment(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          if(res.data.data.length!==0){
            this.salaryWelfare.salaryAccountName = res.data.data[0].salaryAccountName
            this.salaryWelfare.salaryBank = res.data.data[0].salaryBank
            this.salaryWelfare.salaryAccount = res.data.data[0].salaryAccount
            this.salaryWelfare.accumulationAccount = res.data.data[0].accumulationAccount
            this.salaryWelfare.socialSecurity = res.data.data[0].socialSecurity
          }
        } else {
          this.$message({ message: tips.msg, type: "error" });
        }
      });
    },

    //关闭
    close() {
      this.$router.push({ path: "/oa/hr/user/employeeInfo" });
    },
    //添加离职信息
    addDimission() {
      let params = {
        userid: this.baseInfo.userid,
      };
      addHrUserDimission(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.dimission = res.data.data;
        }
        this.$message({
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
      });
    },
    //删除离职信息
    deleteDimission() {
      let params = Object.assign({}, this.dimission);
      delHrUserDimission(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.dimission = {};
        }
      });
    },
    //修改离职信息
    editDimission() {
      this.$refs.dimission.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.load.edit = true;
            let params = Object.assign({}, this.dimission);
            editHrUserDimission(params).then((res) => {
              this.load.edit = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.editDimissionVisible = false;
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error",
              });
            });
          });
        }
      });
    },
    //选择上级后回调
    onUserSelected(users) {
      this.baseInfo.reportId = users[0].userid;
      this.baseInfo.reportName = users[0].username;
      this.userSelectVisible = false;
    },
    
    onUserDeptSubmit(){
      var params={
        userid:this.baseInfo.userid,
        branchId:this.baseInfo.branchId
      }
      getUserDeptPost(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          var data=res.data.data;
          if(data){
            this.baseInfo.post=data.postId
            this.baseInfo.postName=data.postName
            this.baseInfo.deptid=data.deptid
            this.baseInfo.deptName=data.deptName
            if(!this.baseInfo.reportId){
              this.baseInfo.reportId=data.manager
              this.baseInfo.reportName=data.managerName
            }
          }
        }
        this.editUserDeptFormVisible=false
      })
    },
    //上传附件成功回调
    uploadSuccess(file) {
      this.accessory.name = file.name;
      (this.accessory.type = "1"), (this.accessory.accessory = file.url);
      this.accessory.userid = this.baseInfo.userid;
      this.saveAccessoryt();
    },
    onRemove(file) {
      let params = {
        userid: this.baseInfo.userid,
        type: "1",
      };
      delHrUserAccessoryByWhere(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
        }
      });
    },
    //保存上传的附件
    saveAccessoryt() {
      let params = Object.assign({}, this.accessory);
      addHrUserAccessory(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          console.log("ok");
        }
      });
    },
    // 当元素滚动条被滚动时运行的脚本
    onScroll() {
      var jump = document.querySelectorAll(".step-jump");
      var distance = this.$refs.contentRight.scrollTop;
      jump.forEach((item, index) => {
        if (distance >= item.offsetTop - jump[0].offsetTop-50) {
          this.activeStep = index;
        }
      });
    },
    jump(index) {
      let jump = document.querySelectorAll(".step-jump");
      let total = jump[index].offsetTop - jump[0].offsetTop-10;
      let distance = this.$refs.contentRight.scrollTop;
      let step = total / 50;
      if (total > distance) {
        this.smoothDown(distance, total, step);
      } else {
        let newTotal = distance - total;
        this.smoothUp(distance, total, step);
      }
    },
    smoothDown(distance, total, step) {
      if (distance < total) {
        distance += step;
        this.$refs.contentRight.scrollTop = distance;
        setTimeout(this.smoothDown(distance, total, step), 10);
      } else {
        this.$refs.contentRight.scrollTop = total;
      }
      this.activeStep = index;
    },
    smoothUp(distance, total, step) {
      if (distance > total) {
        distance -= step;
        this.$refs.contentRight.scrollTop = distance;
        setTimeout(this.smoothDown(distance, total, step), 10);
      } else {
        this.$refs.contentRight.scrollTop = total;
      }
      this.activeStep = index;
    },
    //选择技能后回调
    onTagSelected(skills) {
      this.hrSkills = skills;
      this.skillSelectVisible = false;
    },
    //删除 技能
    handleClose(skill, index) {
      this.hrSkills.splice(index, 1);
      this.skillIds = [];
      for (let i = 0; i < this.hrSkills.length; i++) {
        this.skillIds.push(this.hrSkills[i].skillId);
      }
    },
    //展开页面
    openItem(item){
      if(item == 'family'){
        this.open.family = !this.open.family
      }
      if(item == 'record'){
        this.open.record = !this.open.record
      }
      if(item == 'experience'){
        this.open.experience = !this.open.experience
      }
      if(item == 'contract'){
        this.open.contract = !this.open.contract
      }
      if(item == 'repuType'){
        this.open.repuType = !this.open.repuType
      }
      if(item == 'userInfo'){
        this.open.userInfo = !this.open.userInfo
        this.getSalaryWelfare();
      }
      if(item == 'dynamically'){
        this.open.dynamically = !this.open.dynamically
      }
      this.$forceUpdate();
    }
  },
  components: {
    "dept-tree": DeptTree,
    "users-select": UsersSelect,
    "user-dept-edit": UserDeptEdit,
    "attachment-upload": AttachmentUpload,
    "hr-user-family-infoMng": HrUserFamilyInfoMng,
    "hr-user-record-mng": HrUserRecordMng,
    "hr-user-worked-mng": HrUserWorkedMng,
    "hr-user-edu-recordmng": HrUserEduRecordMng,
    "hr-user-train-mng": HrUserTrainMng,
    "hr-user-credential-mng": HrUserCredentialMng,
    "hr-user-contract-mng": HrUserContractMng,
    "hr-user-incentive-info-mng": HrUserIncentiveInfoMng,
    "hr-user-salary-mng": HrUserSalaryMng,
    "hr-user-per-holiday-mng": HrUserPerHolidayMng,
    "hr-user-leave-mng": HrUserLeaveMng,
    "hr-user-overtime-mng": HrUserOvertimeMng,
    "hr-user-dynamically-mng": HrUserDynamicallyMng,
    "skill-mng": skillMng,
  },
};
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px !important;
}
.container {
  background-color: #f7f7f7;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 100px;
  align-content: center;
  background: white;
}
.userInfo {
  height: 100px;
}
.step-jump {
  margin-bottom: 20px;
}
.content {
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  background: white;
  .content-left {
    width: 200px;
  }
  .content-right {
    height: 700px;
    flex: 1;
    overflow: auto;
  }
  .content-right::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #d1d1d1;
    -webkit-transition: background-color 0.3s ease-in-out;
    transition: background-color 0.3s ease-in-out;
  }
  .content-right::-webkit-scrollbar-thumb {
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
  .content-right::-webkit-scrollbar-track {
    background-color: #fff;
  }
  .cardBoxs {
    display: flex;
    justify-content: flex-start;
    height: 30;
    line-height: 30px;
    color: #666666;
    font-size: 15px;
    .box {
      flex: 1;
    }
  }
}
.bor-card-title {
  display: inline-block;
  font-size: 20px;
  color: #333333;
  font-weight: 700;
}
.box-title {
  margin: 10px 0px;
  .span1 {
    display: inline-block;
    height: 18px;
    width: 3px;
    background: #4285f4;
    margin-right: 10px;
    vertical-align: middle;
    margin-top: -5px;
  }
  .span2 {
  }
  .span3 {
    float: right;
    color: #4285f4;
  }
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9 !important;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  border: 1px dashed #d9d9d9 !important;
  width: 178px;
  height: 178px;
  display: block;
}
.head-portrait {
  display: flex;
  justify-content: flex-start;
  align-content: center;
}
.head-portrait-box1 {
  margin: 0px 20px;
  div {
    height: 40px;
  }
}
.head-portrait-box2 {
  div {
    height: 40px;
  }
}
//清空卡片内边距
</style>
<style>
  .el-card__body{
    padding:0 !important;
  }
</style>
