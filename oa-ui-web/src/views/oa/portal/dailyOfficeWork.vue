<template>
  <div class="dailyContainer">
    <el-row :gutter="10">
      <!-- 最新动态 -->
      <el-col :span="16">
        <div class="recent-news">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;最新动态</span>
          </div>
          <div class="recent-news-content">
            <el-row :gutter="20">
              <el-col :span="16">
                <div>
                  <img
                    :src="item"
                    alt
                    width="100%"
                    height="230px"
                    v-for="(item,index) in  dataList"
                    :key="index"
                    v-show="currentIndex  == index"
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="image-list">
                  <div class="image-item" :class="{'image-item-back':currentIndex == 0 }">
                    <div style="margin-right:5px">
                      <img
                        src="../../../assets/image/daily_work1.png"
                        alt
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div class="image-box">
                      <div class="image-top" title="当OA遇上云-整个协同OA领域正在发生一场裂变">当OA遇上云-整个协同OA领域正在发生一场裂变</div>
                      <div
                        class="image-bottom"
                        title="移动互联的到来，让OA与云变得紧密关联起来。一方面，传统的OA产品开始利用云平台强化服务价值、推动产品研发变革，另一方面，新一代云OA产品开始广泛发展起来，成为协同OA领域的新秀。当OA遇上云，OA厂商会是怎样的布局和动作呢？传统OA的云端化之变每一家大型集团型企业，尤其是组织分散型的企业可能都有这样的困扰：上了一套系统希望在全集团推广使用，服务器高配，但还是不可避免地遭到用户的..."
                      >
                        移动互联的到来，让OA与云变得紧密关联起来。一方面，传统的OA产品开始利用云平台强化服务价值、推动产品研发变革，另一方面，新一代云OA产品开始广泛发展起来，成为协同OA领域的新秀。当OA遇上云，OA厂商会是怎样的布局和动作呢？
                        传统OA的云端化之变每一家大型集团型企业，尤其是组织分散型的企业可能都有这样的困扰：上了一套系统希望在全集团推广使用，服务器高配，但还是不可避免地遭到用户的...
                      </div>
                    </div>
                  </div>
                  <div class="image-item" :class="{'image-item-back':currentIndex == 1 }">
                    <div style="margin-right:5px">
                      <img
                        src="../../../assets/image/daily_work2.png"
                        alt
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div class="image-box">
                      <div
                        class="image-top"
                        title="移动办公，让世界触手可及-唛盟强大的移动版功能即将问世"
                      >移动办公，让世界触手可及-唛盟OA强大的移动版功能即将发布2.0</div>
                      <div class="image-bottom" title="更多精彩敬请期待........">更多精彩敬请期待........</div>
                    </div>
                  </div>
                  <div class="image-item" :class="{'image-item-back':currentIndex == 2 }">
                    <div style="margin-right:5px">
                      <img
                        src="../../../assets/image/daily_work3.jpg"
                        alt
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div class="image-box">
                      <div
                        class="image-top"
                        title="来！揭开10.0的神秘面纱-唛盟2.0产品即将发布"
                      >来！揭开2.0的神秘面纱-唛盟OA产品即将发布</div>
                      <div
                        class="image-bottom"
                        title="今日唛盟团队正在加班加点，忙碌地进行着唛盟2.0产品的相关制作、demo搭建等，大家也正翘首以盼的等待着千呼万唤始出来的神秘的2.0版本，那么2.0究竟是怎样的呢，让我们来一起揭开2.0的神秘面纱：首先看下：系统模块，30个个模块，功能应有尽有，模块之间相互融合，灵活的前台应用是基于强大的后台配置支持，企业客户可根据自身的实际需求结合2.0系统管理，配置..."
                      >今日唛盟团队正在加班加点，忙碌地进行着唛盟2.0产品的相关制作、demo搭建等，大家也正翘首以盼的等待着千呼万唤始出来的神秘的2.0版本，那么2.0究竟是怎样的呢，让我们来一起揭开2.0的神秘面纱：首先看下：系统模块，30个个模块，功能应有尽有，模块之间相互融合，灵活的前台应用是基于强大的后台配置支持，企业客户可根据自身的实际需求结合2.0系统管理，配置...</div>
                    </div>
                  </div>
                  <div class="image-item" :class="{'image-item-back':currentIndex == 3 }">
                    <div style="margin-right:5px">
                      <img
                        src="../../../assets/image/daily_work4.png"
                        alt
                        width="40px"
                        height="40px"
                      />
                    </div>
                    <div class="image-box">
                      <div class="image-top" title="唛盟补丁包程序更新">唛盟补丁包程序更新</div>
                      <div
                        class="image-bottom"
                        title="为了营造更好的客户体验，唛盟2.0补丁包更新了！本次更新增加流程结束提醒选项，可根据企业具体情况设置提醒人；在待办、已办流程名称后面增加了一个小图标，以显示流程进度；pc钉钉应用中可直接登录web版OA系统；批量更改、清除微信企业号应用ID等。智能办公时代，更好的用户体验在于有更多的选择而非规则。"
                      >为了营造更好的客户体验，唛盟2.0补丁包更新了！本次更新增加流程结束提醒选项，可根据企业具体情况设置提醒人；在待办、已办流程名称后面增加了一个小图标，以显示流程进度；pc钉钉应用中可直接登录web版OA系统；批量更改、清除微信企业号应用ID等。智能办公时代，更好的用户体验在于有更多的选择而非规则。</div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="flow-tab">
          <div class="flow-tab-header">
            <el-tabs v-model="flowActiveName" @tab-click="handleClick">
              <el-tab-pane label="我发起的" name="IStarted"></el-tab-pane>
              <el-tab-pane label="我参与的" name="IParticipateIn"></el-tab-pane>
              <el-tab-pane label="我主办的" name="MyHost"></el-tab-pane>
              <el-tab-pane label="我监控的" name="MyMonitor"></el-tab-pane>
            </el-tabs>
          </div>

          <div class="flow-tab-content">
            <el-table
              :data="executions"
              style="width: 100%;font-size:12px"
              :show-header="false"
              @row-click="gotolink('/mdp/workflow/ru/execution/ExecutionListMyMonitors')"
              v-loading="load.list"
            >
              <el-table-column sortable prop="mainTitle" label="流程【任务】(点击详情)" min-width="300"></el-table-column>
              <el-table-column
                sortable
                prop="startTime"
                label="发起时间"
                width="150"

              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="my-project">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp; 我的项目</span>
            <div>
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getXmProjects"></i>
              <i
                class="el-icon-more"
                style=" color: #3E68fe;"
                @click="gotolink('/xm/core/xmProject/XmProjectMng')"
              ></i>
            </div>
          </div>
          <div class="my-project-content">
            <el-table
              :data="xmProjects"
              style="width: 100%"
              :show-header="false"
              v-loading="load.projectList"
              @row-click="gotolink('/xm/core/xmProject/XmProjectMng')"
            >
              <el-table-column prop="id" label="编号" min-width="120"></el-table-column>
              <el-table-column prop="name" label="项目名称" min-width="220"></el-table-column>
              <el-table-column prop="xmType" label="类型" min-width="160"></el-table-column>
              <el-table-column prop="rate " label="rate " min-width="270">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.rate"></el-progress>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 会议管理 -->
        <div class="conference">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;会议管理</span>
            <div>
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getMeetMeeting"></i>
              <i
                class="el-icon-more"
                style=" color: #3E68fe;"
                @click="gotolink('/oa/meet/meetMeeting/MyMeetMeeting')"
              ></i>
            </div>
          </div>
          <div class="conference-content">
            <el-tabs v-model="meetActiveName">
              <el-tab-pane label="参与的会议" name="first"></el-tab-pane>
            </el-tabs>
            <el-table
              :data="meetings"
              style="width: 100%"
              :show-header="false"
              v-loading="load.meetingList"
              @row-click="gotolink('/oa/meet/meetMeeting/MyMeetMeeting')"
            >
              <el-table-column prop="name" label="会议名称" width="180" ></el-table-column>
              <el-table-column
                prop="customRoomName"
                label="自定义会议地点"
                min-width="180"

              ></el-table-column>
              <el-table-column prop="status" label="状态" min-width="80" >
                <template slot-scope="scope">{{getStatus(scope.row.status)}}</template>
              </el-table-column>
              <el-table-column
                prop="requireUsername"
                label="申请人"
                min-width="180"

              ></el-table-column>
              <el-table-column prop="startTime" label="开始时间" min-width="100" ></el-table-column>
              <el-table-column prop="endTime" label="结束时间" min-width="100" ></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 内部邮件 -->
        <div class="conference">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;内部邮件</span>
            <div>
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getInteriorMailEmail"></i>
              <i
                class="el-icon-more"
                style=" color: #3E68fe;"
                @click="gotolink('/oa/mail/mailEmail/MailEmailInbox')"
              ></i>
            </div>
          </div>
          <div class="conference-content">
            <el-tabs v-model="inEmailActiveName" @tab-click="inEmailClick">
              <el-tab-pane label="收邮箱" name="first"></el-tab-pane>
              <el-tab-pane label="发邮箱" name="second"></el-tab-pane>
              <el-tab-pane label="草稿箱" name="third"></el-tab-pane>
            </el-tabs>
            <el-table
              :data="interiorEmails"
              style="width: 100%"
              :show-header="false"
              v-loading="load.inEmailList"
              @row-click="gotolink('/oa/mail/mailEmail/MailEmailInbox')"
            >
              <el-table-column prop="subject" label="主题" min-width="280"></el-table-column>
              <el-table-column prop="username" label="发件用户名字" min-width="80"></el-table-column>
              <el-table-column prop="sendTime" label="时间" min-width="150"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 外部邮件 -->
        <div class="conference">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;外部邮件</span>
            <div>
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getExternalMailEmail"></i>
              <i
                class="el-icon-more"
                style=" color: #3E68fe;"
                @click="gotolink('/oa/mail/outMailEmail/MailEmailInbox')"
              ></i>
            </div>
          </div>
          <div class="conference-content">
            <el-tabs v-model="externalActiveName" @tab-click="exEmailClick">
              <el-tab-pane label="收邮件" name="first"></el-tab-pane>
              <el-tab-pane label="发邮件" name="second"></el-tab-pane>
              <el-tab-pane label="草稿箱" name="third"></el-tab-pane>
            </el-tabs>
            <el-table
              :data="externalEmails"
              style="width: 100%"
              :show-header="false"
              v-loading="load.exEmailList"
              @row-click="gotolink('/oa/mail/outMailEmail/MailEmailInbox')"
            >
              <el-table-column prop="subject" label="主题" min-width="280"></el-table-column>
              <el-table-column prop="username" label="发件用户名字" min-width="80"></el-table-column>
              <el-table-column prop="sendTime" label="时间" min-width="150"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <!-- 考勤中心 -->
        <div class="attendance-centre">
          <div class="header">
            <span class="el-icon-timer" style=" color: #3E68fe;">&nbsp;考勤中心</span>

          </div>
          <div class="attendance-centre-content">
            <div class="content-top">
              <div class="contentp-top-lef">
                <div class="contentp-top-lef-box1" v-text="timetable"></div>
                <div class="contentp-top-lef-box2">{{clockDate}}</div>
              </div>
            </div>
            <div class="content-bottom" v-for="(item,index) in scheduleArr" :key="index">
              <div class="content-bottom-left">
                <div class="el-icon-user sign-line1"></div>
                <div class="sign-line3"></div>
                <div class="el-icon-user sign-line2"></div>
              </div>
              <div class="content-bottom-right">
                  <div class="content-bottom-right-box1">
                    <div style="font-size:12px;color:#999999;width:30%">上班{{item.beOnDuty}}</div>
                    <div
                      style="font-size:14px;color:#333333;overflow:hidden;flex:1"
                      v-if="item.beWorkTime != ''"
                      v-text="'签到时间'+item.beWorkTime"
                    ></div>
                    <el-tag v-show ="item.beOntimeState == '0'" type="success"> 正常 </el-tag>
                    <el-tag v-show ="item.beOntimeState == '1'" type="danger"> 迟到 </el-tag>
                    <el-tag v-show ="item.beOntimeState == '2'" type="danger"> 严重迟到 </el-tag>
                    <el-tag v-show ="item.beOntimeState == '3'" type="danger"> 旷工 </el-tag>
                    <el-tag v-show ="item.beOntimeState == '4'" type="danger"> 早退 </el-tag>
                    <el-tag v-show ="item.beOntimeState == '5'" type="danger"> 缺卡 </el-tag>
                    <el-button type="text" @click="signInBtn(item.beOnDutyState,item.beOnDuty,item.beBtnPoi,index)" v-show="item.beStatus == '0'">签到</el-button>
                  </div>
                  <div class="content-bottom-right-box2"></div>
                  <div class="content-bottom-right-box3">
                    <div style="font-size:12px;color:#999999;width:30%">下班{{item.offDuty}}</div>
                    <div
                      style="font-size:14px;color:#333333; overflow: hidden;flex:1"
                      v-if="item.offTime != ''"
                      v-text="'签退时间'+item.offTime"
                    ></div>
                    <el-tag v-show ="item.offOntimeState == '0'" type="success"> 正常 </el-tag>
                    <el-tag v-show ="item.offOntimeState == '1'" type="danger"> 迟到 </el-tag>
                    <el-tag v-show ="item.offOntimeState == '2'" type="danger"> 严重迟到 </el-tag>
                    <el-tag v-show ="item.offOntimeState == '3'" type="danger"> 矿工 </el-tag>
                    <el-tag v-show ="item.offOntimeState == '4'" type="danger"> 早退 </el-tag>
                    <el-tag v-show ="item.offOntimeState == '5'" type="danger"> 缺卡 </el-tag>
                    <el-button type="text" @click="signInBtn(item.offDutyState,item.offDuty,item.offBtnPoi,index)" v-show="item.offStatus == '0'">签退</el-button>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div class="menu">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;快捷菜单</span>
          </div>
          <div class="menu-content">
            <div class="quick-menu" @click="gotolink('/mdp/workflow/ru/task/TaskListAssigneeToMe')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-task.png" />
              </div>
              <div class="quick-menu-text">我的任务</div>
            </div>
            <div
              class="quick-menu"
              @click="gotolink('/mdp/workflow/re/procdef/ProcdefListForStart')"
            >
              <div class="quick-menu-icon-outer">
                <!-- <i class="el-icon-user"></i> -->
                <img src="../../../assets/image/platform/module-flow.png" alt />
              </div>
              <div class="quick-menu-text">发起流程</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/sig/sigSeal/SigSealAddApply')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-sealCenter.png" alt />
              </div>
              <div class="quick-menu-text">用印申请</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/erp/pur/require/RequireMng')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-property.png" alt />
              </div>
              <div class="quick-menu-text">资产申请</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/car/carRequire/CarRequire')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-car.png" alt />
              </div>
              <div class="quick-menu-text">用车申请</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/meet/meetMeeting/MeetMeetingRequire')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-meeting.png" alt />
              </div>
              <div class="quick-menu-text">会议申请</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/ht/contractType/ContractTypeMng')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-contract.png" alt />
              </div>
              <div class="quick-menu-text">新建合同</div>
            </div>
            <div class="quick-menu" @click="gotolink('/oa/mail/outMailEmail/MailEmailMng')">
              <div class="quick-menu-icon-outer">
                <img src="../../../assets/image/platform/module-email2.png" alt />
              </div>
              <div class="quick-menu-text">新建邮件</div>
            </div>
          </div>
        </div>
        <!-- 客户中心 -->
        <div class="customer-center">
          <div class="header">
            <span class="el-icon-s-custom" style=" color: #3E68fe;">&nbsp;客户中心</span>
            <div class="notification-announcement-icon">
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getCounterparty"></i>
              <i
                class="el-icon-more"
                style=" color: #3E68fe;"
                @click="gotolink('/oa/crm/customer/CustomerMng')"
              ></i>
            </div>
          </div>
          <div class="customer-center-content">
            <el-table
              :data="customers"
              style="width: 100%"
              :show-header="false"
              v-loading="load.customerList"
              @row-click="gotolink('/oa/crm/customer/CustomerMng')"
            >
              <el-table-column
                prop="customerName"
                label="客户名称"
                min-width="80"

              ></el-table-column>
              <el-table-column
                prop="lastContactDay"
                label="未联系"
                min-width="80"

              ></el-table-column>
              <el-table-column
                prop="managerUserName"
                label="客户经理"
                min-width="80"

              ></el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="100" ></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 任务中心 -->
        <div class="my-task">
          <div class="header">
            <span class="el-icon-document" style=" color: #3E68fe;">&nbsp; 我的任务</span>
            <div>
              <i class="el-icon-refresh" style=" color: #3E68fe;" @click="getXmTask"></i>
            </div>
          </div>
          <div class="mmy-task-content">
            <el-table
              :data="xmTasks"
              style="width: 100%"
              :show-header="false"
              v-loading="load.taskList"
              @row-click="gotolink('/xm/core/xmProject/XmProjectMng')"
            >
              <el-table-column prop="id" label="编号" min-width="100"></el-table-column>
              <el-table-column prop="name" label="项目名称" min-width="120"></el-table-column>
              <el-table-column prop="description" label="描述" min-width="160"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 我的日程 -->
        <div class="schedule">
          <div class="header">
            <span class="el-icon-s-custom" style=" color: #3E68fe;">&nbsp;我的日程</span>
            <div class="notification-announcement-icon">
              <i class="el-icon-circle-plus-outline" style=" color: #3E68fe;" @click="addSchedule"></i>
            </div>
          </div>
          <div class="schedule-content">
            <div class="schedule-content">
              <el-calendar v-model="calendar">
                <template slot="dateCell" slot-scope="{date, data}">
                  <div style="calendarTemplate" @click="clickDay(data)">
                    <div :class="isHaveData(date,data) ? 'is_day' : ''">{{ date.getDate()}}</div>
                  </div>
                </template>
              </el-calendar>
            </div>
            <div class="schedule-footer" v-show="list.length > 0 ? true : false">
              <div
                class="schedule-footer-item"
                v-for="item in list"
                :key="item.id"
                @click="showSchedule(item)"
              >
                <div class="item1"></div>
                <div class="item2">
                  <span class="item-span1" v-text="item.title"></span>
                  <span class="item-span2">{{item.startTime}} — {{item.endTime}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--新增 RcSchedule rc_schedule界面-->
    <el-dialog
      title="新增日程"
      :visible.sync="addScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-add
        :rc-schedule="addScheduleForm"
        :visible="addScheduleVisible"
        @cancel="addScheduleVisible=false"
        @submit="afterAddSubmit"
      ></rc-schedule-add>
    </el-dialog>
    <!-- 查看日程 -->
    <el-dialog
      title="查看日程"
      :visible.sync="showScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-show
        :rc-schedule="showScheduleForm"
        :visible="showScheduleVisible"
        @cancel="showScheduleVisible=false"
        @edit="showEdit"
        @submit="aftershowSubmit"
      ></rc-schedule-show>
    </el-dialog>
    <!--编辑 RcSchedule rc_schedule界面-->
    <el-dialog
      title="编辑日程"
      :visible.sync="editScheduleVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <rc-schedule-edit
        :rc-schedule="editScheduleForm"
        :visible="editScheduleVisible"
        @cancel="editScheduleVisible=false"
        @submit="afterEditSubmit"
      ></rc-schedule-edit>
    </el-dialog>
  </div>
</template>
<script>
import { listCustomer } from "@/api/oa/crm/customer";
import { listXmTask } from "@/api/xm/core/xmTask";
import { listXmProject } from "@/api/xm/core/xmProject";
import { listExecution } from "@/api/mdp/workflow/ru/execution";
import { minelistMeetMeeting } from "@/api/oa/meet/meetMeeting";
import { listMailEmail } from "@/api/oa/mail/mailEmail";
import RcScheduleAdd from "@/views/oa/rc/rcSchedule/RcScheduleAdd"; //新增日程界面
import RcScheduleShow from "@/views/oa/rc/rcSchedule/RcScheduleShow"; //显示日程界面
import RcScheduleEdit from "@/views/oa/rc/rcSchedule/RcScheduleEdit"; //修改日程界面
import { listRcScheduleByMonth, listRcSchedule } from "@/api/oa/rc/rcSchedule";
import { insertAttendance,getUserVeryDaySchedule } from "@/api/oa/kq/attendance";

import { mapGetters } from "vuex";
import util from "@/common/js/util"; // 全局公共库
const fromStartTime = new Date();
const toStartTime = new Date();
fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
export default {
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    calendar(newVal, oldVal) {
      let newMonth = util.formatDate(newVal, "yyyy-MM");
      let oldMonth = util.formatDate(oldVal, "yyyy-MM");
      if (newMonth != oldMonth) {
        this.getRcScheduleByMonth();
      }
    },
  },
  data() {
    return {
      dataList: [
        require("../../../assets/image/daily_work1.png"),
        require("../../../assets/image/daily_work2.png"),
        require("../../../assets/image/daily_work3.jpg"),
        require("../../../assets/image/daily_work4.png"),
      ],
      currentIndex: 0,
      percentage: 20,
      timer: "",
      clockTimer: "",
      activeName: "first",
      meetActiveName: "first",
      value: new Date(),
      calendar: new Date(),
      clockDate: "",
      customers: [],
      flowActiveName: "IStarted",
      executions: [],
      startUserId: "",
      partake: "",
      sponsors: "",
      monitors: "",
      xmProjects: [],
      xmTasks: [],
      meetings: [],
      interiorEmails: [], // 内部邮件
      externalEmails: [], //外部邮件
      interiorEmailType: 2, // 内部邮件类型
      externalEmailType: 2, //外部邮件类型
      inEmailActiveName: "first",
      externalActiveName: "first",
      addScheduleVisible: false,
      showScheduleVisible: false,
      editScheduleVisible: false,
      addScheduleForm: {},
      showScheduleForm: {},
      editScheduleForm: {},
      tableData: [],
      list: [],
      listSchedule: [],
      startUserId: "",
      signInTime:"", //签到时间
      signOutTime:"" ,//签退时间
      schedule:{},//考勤班次
      scheduleArr:[], //班次
      day: "",
      clockStatus:"0", //0-签到 1-签退
      attendance:{
        id:"",
        userid:"",
        workTime:"",
        state:"",
        lcStatus : "0",
        btnPoi:"0",
        branchId:"",
        outState: "0", //是否是外勤
        outRemarks:"0",
        outImg:"",
        deptid:"",
        scheduleTime:""
      },
      load: {
        list: false,
        flowList: false,
        customerList: false,
        projectList: false,
        taskList: false,
        meetingList: false,
        inEmailList: false,
        exEmailList: false,
      },
      timetable:""
    };
  },
  methods: {
    //下一张
    nextIndex() {
      if (this.currentIndex == this.dataList.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex = this.currentIndex + 1;
      }
    },
    //流程
    getExecutionListMyMonitors() {
      this.load.list = true;
      let params = {
        pageSize: 5,
        pageNum: 1,
        total: 0,
        count: true,
        fromStartTime:
          util.formatDate(fromStartTime, "yyyy-MM-dd") + " 00:00:00",
        toStartTime:
          util.formatDate(toStartTime, "yyyy-MM-dd") + " 23:59:59",
      };
      params.tenantId = this.userInfo.branchId;
      if (this.startUserId != "") {
        params.startUserId = this.startUserId;
      }
      if (this.partake != "") {
        params.partake = this.partake;
      }
      if (this.sponsors != "") {
        params.sponsors = this.sponsors;
      }
      if (this.monitors != "") {
        params.monitors = this.monitors;
      }
      params.tenantId = this.userInfo.branchId;
      listExecution(params)
        .then((res) => {
          this.load.list = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.executions = res.data.data;
             this.executions.forEach((item)=>{
               item.startTime = item.startTime.substring(0,10)
             })
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
        })
        .catch(() => {
          this.load.list = false;
        });
    },
    //客户中心 (查询最新8条数据)
    getCounterparty() {
      let orderBys = [];
      let params = {
        pageSize: 10,
        pageNum: 1,
        total: 1,
        count: true,
      };
      this.load.customerList = true;
      listCustomer(params)
        .then((res) => {
          this.load.customerList = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.customers = res.data.data;
			this.customers.forEach((item)=>{
				item.createTime = item.createTime.substring(0,10)
			})
            let nowDate = new Date();
            for (let i = 0; i < this.customers.length; i++) {
              let createTime = this.customers[i].createTime.split(" ")[0];
            }
          }
        })
        .catch((res) => {
          this.load.customerList = false;
        });
    },
    handleClick(data) {
      //我发起的
      if (data.name == "IStarted") {
        this.startUserId = this.userInfo.userid;
        this.partake = "";
        this.sponsors = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我参与的
      if (data.name == "IParticipateIn") {
        this.partake = this.userInfo.userid;
        this.startUserId = "";
        this.sponsors = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我主办的
      if (data.name == "MyHost") {
        this.sponsors = "%" + this.userInfo.userid + "%";
        this.startUserId = "";
        this.partake = "";
        this.monitors = "";
        this.getExecutionListMyMonitors();
      }
      //我监控的
      if (data.name == "MyMonitor") {
        this.monitors = "%" + this.userInfo.userid + "%";
        this.startUserId = "";
        this.partake = "";
        this.sponsors = "";
        this.getExecutionListMyMonitors();
      }
    },
    //我的项目
    getXmProjects() {
      let orderBys = [];
      //降序
      orderBys.push("create_time" + " " + "desc");
      let params = {
        pageSize: 5,
        pageNum: 1,
        orderBy: orderBys.join(","),
      };
      params.branchId = this.userInfo.branchId;
      this.load.projectList = true;
      listXmProject(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.xmProjects = res.data.data;
            this.xmProjects.forEach((item, i) => {
              this.xmProjects[i].rate = this.getProjectProgress(item);
            });
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.projectList = false;
        })
        .catch((err) => (this.load.projectList = false));
    },
    getProjectProgress(pro) {
      let count = 0;
      let rate = pro.task.data.reduce(function (sum, cur) {
        count++;
        sum += parseInt(cur.rate);
        return sum;
      }, 0);
      return count == 0 ? 0 : Math.round(rate / count);
    },
    //我的任务
    getXmTask() {
      let orderBys = [];
      //降序
      orderBys.push("create_time" + " " + "desc");

      let params = {
        branchId: this.userInfo.branchId,
        executorUserid: this.userInfo.userid,
        pageSize: 5,
        pageNum: 1,
        orderBy: orderBys.join(","),
      };
      this.load.taskList = true;
      listXmTask(params)
        .then((res) => {
          this.load.taskList = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.xmTasks = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.load.taskList = false;
        })
        .catch((err) => {
          this.load.taskList = false;
        });
    },
    //参与的会议
    getMeetMeeting() {
      let orderBys = [];
      //降序
      orderBys.push("create_time" + " " + "desc");
      let params = {
        pageSize: 5,
        pageNum: 1,
        // count: false,
        branchId: this.userInfo.branchId,
        // status: 6,
        // orderBy: orderBys.join(","),
      };
      this.load.meetingList = true;
      minelistMeetMeeting(params)
        .then((res) => {
          this.load.meetingList = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.meetings = res.data.data;
          }
        })
        .catch((err) => (this.load.meetingList = false));
    },
    //获取会议的状态
    getStatus(status) {
      if (status == "0") {
        return "待审批";
      }
      if (status == "1") {
        return "审批中";
      }
      if (status == "2") {
        return "已批准";
      }
      if (status == "3") {
        return "已拒绝";
      }
      if (status == "4") {
        return "已开始";
      }
      if (status == "5") {
        return "已结束";
      }
    },
    //内部邮件
    getInteriorMailEmail() {
      let params = {
        branchId: this.userInfo.branchId,
        userid: this.userInfo.userid,
        pageSize: 5,
        pageNum: 1,
        isOuter: 0,
        isOrder: "desc",
      };
      params.type = this.interiorEmailType;
      this.load.inEmailList = true;
      listMailEmail(params)
        .then((res) => {
          this.load.inEmailList = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.interiorEmails = res.data.data;
            this.interiorEmails.forEach((item)=>{
            	item.sendTime = item.sendTime.substring(0,10)
            })
          }
        })
        .catch((err) => {
          this.load.inEmailList = false;
        });
    },
    //点击内部邮件选项卡
    inEmailClick(type) {
      if (type.name == "first") {
        this.interiorEmailType = 2;
        this.getInteriorMailEmail();
      }
      if (type.name == "second") {
        this.interiorEmailType = 1;
        this.getInteriorMailEmail();
      }
      if (type.name == "third") {
        this.interiorEmailType = 0;
        this.getInteriorMailEmail();
      }
    },
    //外部邮件
    getExternalMailEmail() {
      let params = {
        branchId: this.userInfo.branchId,
        userid: this.userInfo.userid,
        pageSize: 5,
        pageNum: 1,
        isOuter: 1,
        isOrder: "desc",
      };
      params.type = this.externalEmailType;
      this.load.exEmailList = true;
      listMailEmail(params)
        .then((res) => {
          this.load.exEmailList = false;
          let tips = res.data.tips;
          if (tips.isOk) {
            this.externalEmails = res.data.data;
            this.externalEmails.forEach((item)=>{
            	item.sendTime = item.sendTime.substring(0,10)
            })
          }
        })
        .catch((err) => {
          this.load.exEmailList = false;
        });
    },
    //点击外部邮件选项卡
    exEmailClick(type) {
      if (type.name == "first") {
        this.externalEmailType = 2;
        this.getExternalMailEmail();
      }
      if (type.name == "second") {
        this.externalEmailType = 1;
        this.getExternalMailEmail();
      }
      if (type.name == "third") {
        this.externalEmailType = 0;
        this.getExternalMailEmail();
      }
    },
    afterAddSubmit() {
      this.addScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    //点击日历
    clickDay(data) {
      this.list = [];
      for (let i = 0; i < this.listSchedule.length; i++) {
        let startStr = this.listSchedule[i].startTime.split(/\s+/)[0];
        let endStr = this.listSchedule[i].endTime.split(/\s+/)[0];
        let day = new Date(data.day).getTime();
        let startTime = new Date(startStr).getTime();
        let endTime = new Date(endStr).getTime();
        if (startTime <= day && day <= endTime) {
          this.list.push(this.listSchedule[i]);
        }
      }
      this.day = data;
    },
    //获取日程是上午开始还是下午开始
    getStr(date) {
      let times = date.split(/\s+/)[1].split(":");
      let hours = new Date(date).getHours();
      if (hours < 12) {
        return times[0] + ":" + times[1] + " " + "AM";
      } else {
        return times[0] + ":" + times[1] + " " + "PM";
      }
    },
    //显示日程
    showSchedule(item) {
      this.showScheduleForm = item;
      this.showScheduleVisible = true;
    },
    //显示编辑界面 RcSchedule rc_schedule
    showEdit: function () {
      this.editScheduleVisible = true;
      this.editScheduleForm = Object.assign({}, this.showScheduleForm);
    },
    afterEditSubmit() {
      this.editScheduleVisible = false;
      this.showScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    aftershowSubmit() {
      this.getRcScheduleByMonth();
      this.showScheduleVisible = false;
      this.getRcScheduleByMonth();
    },
    //新增日程
    addSchedule() {
      let s = new Date();
      s.setHours(0);
      s.setMinutes(0);
      s.setSeconds(0);
      s.setMilliseconds(0);
      let e = new Date(s.getTime() + 24 * 1000 * 3600 - 1000);
      this.addScheduleForm.receiveUserid = this.userInfo.userid;
      this.addScheduleForm.receiveUsername = this.userInfo.username;
      this.addScheduleForm.startTime =
        s.getFullYear() +
        "-" +
        (s.getMonth() + 1) +
        "-" +
        s.getDate() +
        " " +
        s.getHours() +
        ":" +
        s.getMinutes() +
        ":" +
        s.getSeconds();
      this.addScheduleForm.endTime =
        e.getFullYear() +
        "-" +
        (e.getMonth() + 1) +
        "-" +
        e.getDate() +
        " " +
        e.getHours() +
        ":" +
        e.getMinutes() +
        ":" +
        e.getSeconds();
      this.addScheduleVisible = true;
    },
    isHaveData(date, data) {
      for (let i = 0; i < this.listSchedule.length; i++) {
        let startStr = this.listSchedule[i].startTime.split(/\s+/)[0];
        let endStr = this.listSchedule[i].endTime.split(/\s+/)[0];
        let day = new Date(data.day).getTime();
        let startTime = new Date(startStr).getTime();
        let endTime = new Date(endStr).getTime();
        if (startTime <= day && day <= endTime) {
          return true;
        }
      }
      return false;
    },
    //根据月份获取获取日程
    getRcScheduleByMonth() {
      let params = {
        receiveUserid: this.userInfo.userid,
        branchId: this.userInfo.branchId,
        month: util.formatDate(this.calendar, "yyyy-MM"),
      };
      listRcScheduleByMonth(params).then((res) => {
        let tips = res.data.tips;
        if (tips.isOk) {
          this.listSchedule = res.data.data;
          if (this.day != "") {
            this.clickDay(this.day);
          }
        }
      });
    },
    //路由跳转
    gotolink(link) {
      this.$router.replace(link);
    },
    //时钟
    clock() {
      let date = new Date();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      this.clockDate = hours + ":" + minutes + ":" + seconds;
    },
    //打卡上下班
    signInBtn(state,scheduleTime,btnPoi,index) {
      let boo = this.judgeTime(state,index);
      if(!boo){
        this.$confirm('现在是上班时间, 是否继续签退?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.signInOption(state,scheduleTime,btnPoi,index);
        }).catch(() => {
        });
      }else{
        this.signInOption(state,scheduleTime,btnPoi,index);
      }

    },
    //执行打卡操作
    signInOption(state,scheduleTime,btnPoi,index){
      this.attendance.userid = this.userInfo.userid;
      this.attendance.workTime = util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.attendance.state = state;
      this.attendance.lcStatus = "0";
      this.attendance.outState = "0";
      this.attendance.branchId = this.userInfo.branchId;
      this.attendance.outImg = "";
      this.attendance.deptid = this.userInfo.deptid;
      this.attendance.scheduleTime = scheduleTime;
      this.attendance.btnPoi = btnPoi;
      let params = Object.assign({},this.attendance);
      insertAttendance(params).then(res =>{
        let tips = res.data.tips;
        if(tips.isOk){
          if(state == "0"){
            this.scheduleArr[index].beStatus = '1';
            this.scheduleArr[index].beOntimeState = res.data.attendance && res.data.attendance.ontimeState ? res.data.attendance.ontimeState : "";
            this.scheduleArr[index].beWorkTime = params.workTime;
          }else{
            this.scheduleArr[index].offStatus = '1';
            this.scheduleArr[index].offOntimeState = res.data.attendance && res.data.attendance.ontimeState ? res.data.attendance.ontimeState : "";
            this.scheduleArr[index].offTime = params.workTime;
          }
          this.$message({ message: "打卡成功", type: "success"});
        }else{
          this.$message({ message: "打卡失败", type: "error"});
        }

      })
    },
    //显示年月日星期几
    getTime() {
      var date = new Date();
      var year = "",
        month = "",
        day = "",
        week = "",
        val=""
      year = date.getFullYear();
      month = this.addZero(date.getMonth() + 1);
      day = this.addZero(date.getDate());
      week = date.getDay();
      switch (date.getDay()) {
        case 0:
          val = "星期天";
          break;
        case 1:
          val = "星期一";
          break;
        case 2:
          val = "星期二";
          break;
        case 3:
          val = "星期三";
          break;
        case 4:
          val = "星期四";
          break;
        case 5:
          val = "星期五";
          break;
        case 6:
          val = "星期六";
          break;
      }
      this.timetable = " " + year + "年" +month +"月" +day + "日 "  + val;
    },
    addZero(temp){
      if(temp<10) return "0"+temp;
      else return temp;
    },
    //获取当天考勤班次和考勤情况
    getUserVeryDaySchedule(){
      let params = {}
      getUserVeryDaySchedule(params).then(res => {
        let tips =res.data.tips;
        if(tips.isOk){
          this.scheduleArr = res.data.data;
        }
      })
    },
    //判断是否是在上班时间签退
    judgeTime(state,index){
      if(state == '1'){
        let beOnDuty = this.scheduleArr[index].beOnDuty;
        let offDuty = this.scheduleArr[index].offDuty;
        let year = new Date().getFullYear();
        let month = this.addZero(new Date().getMonth() +1);
        let  day = this.addZero(new Date().getDate())
        let beOnDutyStr = year + "-" + month +"-" +day +" " + beOnDuty;
        let offDutyStr = year + "-" + month +"-" +day +" " + offDuty;
        let beOnDutyTime = new Date(beOnDutyStr).getTime();
        let offDutyTime = new Date(offDutyStr).getTime();
        let nowTime = new Date().getTime();
        if(beOnDutyTime <=nowTime && nowTime <= offDutyTime ){
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
    this.startUserId = this.userInfo.userid;
    this.getExecutionListMyMonitors();
    this.getCounterparty();
    this.getXmProjects();
    this.getXmTask();
    this.getMeetMeeting();
    this.getInteriorMailEmail();
    this.getExternalMailEmail();
    this.startUserId = this.userInfo.userid;
    this.getRcScheduleByMonth();
    this.getTime();
    this.getUserVeryDaySchedule();
    this.timer = setInterval(this.nextIndex, 3000);
    this.clockTimer = setInterval(this.clock, 1000);
  },
  components: {
    "rc-schedule-add": RcScheduleAdd,
    "rc-schedule-show": RcScheduleShow,
    "rc-schedule-edit": RcScheduleEdit,
  },
};
</script>
<style lang="scss" scoped>
.dailyContainer {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 5px;
  color: #666666;
  .header {
    display: flex;
    align-content: center;
    align-items: center;
    padding: 10px 12px;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
  }
  .recent-news {
    font-size: 14px;
    background: white;
    margin-bottom: 10px;
    .recent-news-content {
      padding: 8px 12px;
      .image-list {
        border: 1px solid #f1f1f1;
        .image-item {
          height: 48px;
          padding: 4px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          border: 1px solid white;
          border-bottom: 1px solid #f1f1f1;
          .image-box {
            flex: 1;
            overflow: hidden;
            .image-top {
              overflow: hidden;
              height: 20px;
              line-height: 20px;
            }
            .image-bottom {
              overflow: hidden;
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .image-item:hover {
          background: rgba(0, 171, 252, 0.2);
        }
        .image-item-back {
          background: rgba(0, 171, 252, 0.2);
          border: 1px dashed rgba(0, 171, 252, 0.2);
        }
      }
    }
  }
  .notification-announcement {
    font-size: 14px;
    background: white;
    height: 282px;
    margin-bottom: 10px;
    .notification-announcement-content {
      padding: 5px;
      .portal-image-list {
        .portal-image-item {
          height: 60px;
          padding: 5px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          .portal-image-item-left {
            height: 40px;
            width: 40px;
            background: coral;
            margin-right: 10px;
          }
          .portal-image-item-right {
            flex: 1;
            .portal-image-item-right-box1 {
              height: 20px;
              font-size: 13px;
              color: #333333;
              display: flex;
              justify-content: space-between;
            }
            .portal-image-item-right-box2 {
              height: 20px;
              font-size: 12px;
              color: #b6b3c8;
            }
          }
        }
        .portal-image-item:hover {
          -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          -webkit-transform: translate3d(0, 0px, -2px);
          // transform: translate3d(0, 1px, -2px);
        }
      }
    }
  }
  .stat-block {
    display: flex;
    justify-content: space-between;
    background: white;
    .stat-block-box {
      flex: 1;
      margin: 15px 10px;
      height: 90px;
      display: flex;
      border-radius: 4px;
      overflow: hidden;
      color: white;
      transition: all 0.3s;
      .stat-block-box-icon {
        font-size: 200%;
        -webkit-transition: -webkit-transform 0.5s ease-in;
        -moz-transition: -moz-transform 0.5s ease-in;
        -o-transition: -o-transform 0.5s ease-in;
        transition: transform 0.5s ease-in;
      }
      .stat-block-box1 {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
      }
      .stat-block-box2 {
        background: rgb(93, 156, 236);
        width: 70%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
    }
    .stat-block-box:hover {
      transform: scale(1.02);
      -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
      .stat-block-box-icon {
        -webkit-transform: rotate(360deg) scale(1);
        -moz-transform: rotate(360deg) scale(1);
        -o-transform: rotate(360deg) scale(1);
        -transform: rotate(360deg) scale(1);
      }
    }
  }
  .flow-tab {
    background: white;
    min-height: 310px;
    .flow-tab-header {
      padding: 0px 5px;
    }
    .flow-tab-content {
      padding: 0px 5px;
    }
  }
  .customer-center {
    margin-top: 10px;
    font-size: 14px;
    background: white;
    margin-bottom: 10px;
    min-height: 310px;
    .customer-center-content {
      padding: 10px 5px;
    }
  }
  .my-project {
    background: white;
    min-height: 310px;
    margin-top: 10px;
  }
  .my-task {
    background: white;
    min-height: 310px;
  }
  .attendance-centre {
    background: white;
    .attendance-centre-content {
      padding: 10px;
      height: 244px;
      .content-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .contentp-top-lef {
          .contentp-top-lef-box1 {
            height: 26px;
            line-height: 26px;
            color: #999999;
            font-size: 12px;
          }
          .contentp-top-lef-box2 {
            font-size: 30px;
            height: 50px;
            line-height: 50px;
            color: #333333;
          }
        }
      }
      .content-bottom {
        display: flex;
        justify-content: flex-start;
        height: 80px;
        .content-bottom-left {
          width: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          align-items: center;
          height: 100%;
          .sign-line3 {
            width: 2px;
            background: linear-gradient(180deg, #0083fd 0, #fff 100%);
            height: 40px;
          }
        }
        .content-bottom-right {
          flex: 1;
          height: 100%;
          .content-bottom-right-box1 {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: flex-start;
          }
          .content-bottom-right-box2 {
            height: 1px;
            background: #f1f1f1;
          }
          .content-bottom-right-box3 {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: flex-start;
          }
        }
      }
    }
  }
  .discussion {
    margin-top: 10px;
    background: white;
    .discussion-image-list {
      padding: 5px;
      .discussion-image-item {
        height: 60px;
        padding: 5px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        .discussion-image-item-left {
          height: 40px;
          width: 40px;
          background: coral;
          margin-right: 10px;
        }
        .discussion-image-item-right {
          flex: 1;
          .discussion-image-item-right-box1 {
            height: 20px;
            font-size: 13px;
            color: #333333;
            display: flex;
            justify-content: space-between;
          }
          .discussion-image-item-right-box2 {
            height: 20px;
            font-size: 12px;
            color: #b6b3c8;
          }
        }
      }
      .discussion-image-item:hover {
        -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        -webkit-transform: translate3d(0, 0px, -2px);
      }
    }
  }
  .block-item {
    min-height: 138px;
    display: flex;
    justify-content: flex-start;
    border-radius: 4px;
    transform: scale(1.02);
    -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    padding: 10px;
    position: relative;
    .block-item-content {
      color: white;
      width: 100%;
      .block-item-content-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.7);
      }
      .block-item-content-number {
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .block-item-content-progress {
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .block-item-content-desc {
        margin: -5px 0 -3px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .stat-icon {
      text-align: center;
      position: absolute;
      opacity: 0.15;
      bottom: 0px;
      right: 0px;
      color: #fff;
      width: 128px;
      height: 128px;
      text-shadow: 3px 7px rgba(0, 0, 0, 0.25);
    }
  }
  .block-item:hover {
    transform: scale(1.05);
    -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
  }
  .menu {
    background: white;
    min-height: 280px;
    margin-top: 10px;
    .menu-content {
      display: flex;
      justify-content: flex-start;
      padding: 10px;
      flex-wrap: wrap;
      .quick-menu {
        height: 80px;
        width: 60px;
        margin-right: 15px;
        cursor: pointer;
        margin-bottom: 20px;
        .quick-menu-icon-outer {
          width: 52px;
          height: 52px;
          padding: 6px;
          border: 1px solid transparent;
          border-radius: 5px;
          text-align: center;
          line-height: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 30px;
            color: white;
          }
        }
        .quick-menu-text {
          height: 30px;
          width: 60px;
          line-height: 30px;
          font-size: 12px;
          color: #333;
          float: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: center;
        }
      }
      .quick-menu:hover {
        opacity: 0.8;
        .quick-menu-text {
          color: rgb(3, 169, 244);
        }
      }
    }
  }
  .datum {
    background: white;
    margin-top: 10px;
    height: 360px;
    .datum-content {
      padding: 5px;
    }
  }
  .conference {
    background: white;
    margin-top: 10px;
    min-height: 300px;
    .conference-content {
      padding: 5px;
    }
  }
  .schedule {
    margin-top: 10px;
    background: white;
    padding-bottom: 20px;
    .schedule-footer {
      margin: 5px 10px;
      background: #f7f7f7;
      padding: 5px 10px;
      border-radius: 5px;
      .schedule-footer-item {
        padding: 5px 10px;
        background: #fff;
        margin-top: 4px;
        margin-bottom: 4px;
        border-radius: 7px;
        font-size: 12px;
        line-height: 20px;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        .item1 {
          background: rgb(52, 141, 249);
          height: 32px;
          width: 2px;
          margin-right: 20px;
        }
        .item2 {
          display: flex;
          flex-direction: column;
          .item-span1 {
            color: #757482;
            font-size: 12px;
            line-height: 16px;
            height: 16px;
          }
          .item-span2 {
            color: #b6b4cb;
            font-size: 12px;
            line-height: 16px;
            height: 16px;
          }
        }
      }
      .schedule-footer-item:hover {
        -webkit-box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        -webkit-transform: translate3d(0, 0px, -2px);
      }
    }
  }
  .customColor {
    color: white;
  }
  .el-tabs__header {
    margin: 0 0 10px;
  }
}
</style>
<style lang="scss">
.dailyContainer {
  .schedule-content {
    font-size: 14px !important;
    color: #606266 !important;
    .calendarTemplate {
      height: 100%;
      width: 100%;
    }
    .el-calendar-day {
      height: 50px;
      padding: 0px;
      text-align: center;
      line-height: 50px;
    }
    .el-calendar-table tr td:first-child {
      border-left: 0px;
    }
    .el-calendar-table tr:first-child td {
      border-top: 0px;
    }
    .el-calendar-table td {
      border-bottom: 0px;
      border-right: 0px;
    }
    .is_day {
      background: #2196f3;
      color: white;
    }
  }
  .el-table td {
    border-bottom: 0px;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: white;
  }
}
</style>
