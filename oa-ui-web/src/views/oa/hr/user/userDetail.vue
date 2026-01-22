<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>人事档案</el-breadcrumb-item>
          <el-breadcrumb-item>员工信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-button size="mini">保存</el-button>
        <el-button size="mini">编辑</el-button>
        <el-button size="mini">关闭</el-button>
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
        <!-- 个人信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">个人信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
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
            <div class="box">{{baseInfo.sex}}</div>
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
            <div class="box">{{baseInfo.presentDddress}}</div>
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
          <div class="cardBoxs">
            <attachment-upload></attachment-upload>
          </div>
        </el-card>
        <!-- 在职信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">在职信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
          <div class="cardBoxs">
            <div class="box">工号</div>
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
            <div class="box">{{baseInfo.post}}</div>
            <div class="box">职务</div>
            <div class="box">{{baseInfo.duty}}</div>
          </div>

          <div class="cardBoxs">
            <div class="box">工作地点</div>
            <div class="box">{{baseInfo.workplace}}</div>
            <div class="box">系统账号</div>
            <div class="box">{{baseInfo.account}}</div>
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
            >&nbsp;&nbsp;编辑</el-button>
          </div>
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
        </el-card>
        <!-- 联系信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">联系信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-edit"
            >&nbsp;&nbsp;编辑</el-button>
          </div>
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
            <div class="box">{{baseInfo.sortherPhonenox}}</div>
          </div>
        </el-card>

        <!-- 家庭信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">家庭信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="familyInfo" border style="width: 100%">
            <el-table-column fixed prop="familyTies" label="家庭关系" min-width="100"></el-table-column>
            <el-table-column prop="familyName" label="姓名" min-width="100"></el-table-column>
            <el-table-column prop="jobUnits" label="任职单位" min-width="120"></el-table-column>
            <el-table-column prop="city" label="职业" min-width="100"></el-table-column>
            <el-table-column prop="contactInformation" label="联系方式" min-width="100"></el-table-column>
            <el-table-column prop="zip" label="备注" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 任职记录 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">任职记录</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="qualRecord" border style="width: 100%">
            <el-table-column fixed prop="date" label="开始时间" min-width="120"></el-table-column>
            <el-table-column prop="name" label="结束时间" min-width="120"></el-table-column>
            <el-table-column prop="province" label="职务" min-width="100"></el-table-column>
            <el-table-column prop="city" label="部门" min-width="120"></el-table-column>
            <el-table-column prop="address" label="岗位" min-width="120"></el-table-column>
            <el-table-column prop="zip" label="备注" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 个人经历 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">个人经历</span>
          </div>
          <div class="box-title">
            <span class="span1"></span>
            <span class="span2">工作经历</span>
            <!-- <span class="span3">新建</span> -->
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="span3 el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="workExperience" border style="width: 100%">
            <el-table-column fixed prop="date" label="开始日期" min-width="120"></el-table-column>
            <el-table-column prop="name" label="结束日期" min-width="120"></el-table-column>
            <el-table-column prop="province" label="公司" min-width="100"></el-table-column>
            <el-table-column prop="city" label="职位" min-width="100"></el-table-column>
            <el-table-column prop="address" label="工作描述" min-width="200"></el-table-column>
            <el-table-column prop="zip" label="离职原因" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="box-title">
            <span class="span1"></span>
            <span class="span2">工作经历</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="span3 el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="eduRrecord" border style="width: 100%">
            <el-table-column fixed prop="schoolName" label="学校名称" min-width="120"></el-table-column>
            <el-table-column prop="major" label="专业" min-width="100"></el-table-column>
            <el-table-column prop="degree" label="学位" min-width="100"></el-table-column>
            <el-table-column prop="startTime" label="入学日期" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="毕业日期" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="box-title">
            <span class="span1"></span>
            <span class="span2">工作经历</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="span3 el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="traRrecord" border style="width: 100%">
            <el-table-column fixed prop="trainName" label="培训名称" min-width="120"></el-table-column>
            <el-table-column prop="trainUnit" label="培训单位" min-width="120"></el-table-column>
            <el-table-column prop="startTime" label="开始日期" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="结束日期" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="box-title">
            <span class="span1"></span>
            <span class="span2">工作经历</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="span3 el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="credentials" border style="width: 100%">
            <el-table-column fixed prop="certificateName" label="证书名称" min-width="150"></el-table-column>
            <el-table-column prop="startTime" label="颁发日期" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="失效日期" min-width="120"></el-table-column>
            <el-table-column prop="issueUnit" label="颁发单位" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 合同信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">合同信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="contInfo" border style="width: 100%">
            <el-table-column fixed prop="startTime" label="合同开始时间	" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="合同到期时间	" min-width="120"></el-table-column>
            <el-table-column prop="contractName" label="合同名称" min-width="120"></el-table-column>
            <el-table-column prop="contractType" label="合同类型" min-width="120"></el-table-column>
            <el-table-column prop="identification" label="签订标识" min-width="120"></el-table-column>
            <el-table-column prop="contractStatus" label="合同状态" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 奖惩信息 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">奖惩信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="rePuInfo" border style="width: 100%">
            <el-table-column fixed prop="certificateName" label="奖惩名称	" min-width="150"></el-table-column>
            <el-table-column prop="time" label="奖惩日期	" min-width="120"></el-table-column>
            <el-table-column prop="type" label="奖惩类型" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 薪酬福利 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">薪酬福利</span>
            <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
          </div>
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
        </el-card>

        <!-- 个人假期 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">个人假期</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              class="el-icon-plus"
            >&nbsp;&nbsp;新建</el-button>
          </div>
          <el-table :data="perHoliday" border style="width: 100%">
            <el-table-column fixed prop="year" label="年份	" min-width="100"></el-table-column>
            <el-table-column prop="annualLeave" label="剩余带薪年假" min-width="120"></el-table-column>
            <el-table-column prop="paidLeave" label="剩余调休假期" min-width="120"></el-table-column>
            <el-table-column prop="paidSickLeave" label="剩余带薪病假" min-width="120"></el-table-column>

            <el-table-column prop="leaveInLieu" label="剩余调休假" min-width="120"></el-table-column>
            <el-table-column prop="marriageLeave" label="剩余婚假" min-width="120"></el-table-column>
            <el-table-column prop="annualVacation" label="剩余年假" min-width="120"></el-table-column>

            <el-table-column prop="sickLeave" label="剩余病假" min-width="120"></el-table-column>
            <el-table-column prop="totalDays" label="剩余总天数" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: center;margin-top:20px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          ></el-pagination>
        </el-card>

        <!-- 员工动态 -->
        <el-card class="box-card step-jump">
          <div slot="header" class="clearfix">
            <span class="bor-card-title">员工动态</span>
          </div>
          <el-table :data="rePuInfo" border style="width: 100%">
            <el-table-column fixed prop="certificateName" label="操作时间	" min-width="150"></el-table-column>
            <el-table-column prop="time" label="IP地址	" min-width="120"></el-table-column>
            <el-table-column prop="type" label="浏览器" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
            <el-table-column prop="type" label="操作者" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="操作方法" min-width="120"></el-table-column>
            <el-table-column prop="remark" label="操作记录" min-width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: center;margin-top:20px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          ></el-pagination>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      activeStep: 0,
      scrollTop: 0, // 没用到
      //步骤条
      stepsArr: [
        { title: "个人信息" },
        { title: "在职信息" },
        { title: "员工状态" },
        { title: "联系信息" },
        { title: "家庭信息" },
        { title: "任职记录" },
        { title: "个人经历" },
        { title: "合同信息" },
        { title: "奖惩信息" },
        { title: "薪酬福利" },
        { title: "个人假期" },
        { title: "员工动态" }
      ],
      userId: "",
      baseInfo: {}, //其他信息
      familyInfo: [], //家庭信息
      qualRecord: [], // 任职记录
      workExperience: [], //工作经历
      eduRrecord: [], //教育记录
      traRrecord: [], //培训记录
      credentials: [], //资格证书
      contInfo: [], //合同信息
      rePuInfo: [], //奖惩信息
      salaryWelfare: {}, //薪酬福利
      perHoliday: [], //个人假期
      empDynamic: [], //员工动态

      currentPage4: 4
    };
  },
  created() {
    this.userId = this.$route.params.id;
    console.log(this.userId);
    console.log(this.userInfo.branchId);
  },
  mounted() {
    this.$refs.contentRight.addEventListener("scroll", this.onScroll);
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 当元素滚动条被滚动时运行的脚本
    onScroll() {
      var jump = document.querySelectorAll(".step-jump");
      var distance = this.$refs.contentRight.scrollTop;
      jump.forEach((item, index) => {
        if (distance >= item.offsetTop - jump[0].offsetTop) {
          this.activeStep = index;
        }
      });
    },
    jump(index) {
      this.activeStep = index;
      let jump = document.querySelectorAll(".step-jump");
      let total = jump[index].offsetTop - jump[0].offsetTop;
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
    },
    smoothUp(distance, total, step) {
      if (distance > total) {
        distance -= step;
        this.$refs.contentRight.scrollTop = distance;
        setTimeout(this.smoothDown(distance, total, step), 10);
      } else {
        this.$refs.contentRight.scrollTop = total;
      }
    }
  },
  components: {
    "attachment-upload": AttachmentUpload
  }
};
</script>

<style scoped lang="scss">
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
  margin: 10px 200px;
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
</style>
