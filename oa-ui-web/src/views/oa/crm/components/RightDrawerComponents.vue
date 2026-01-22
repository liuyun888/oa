<template>
	<section>
        <div class="container clearfix">
            
            <div v-if="isShowAll === 'all' || isShowAll === 'medium'" class="header">
                <span>{{customerName}} / {{businessName}} <c v-if="businessName!==null && businessName!==undefined">/</c> <b>{{customerManagerUserName}}</b> 
                    <div @click="addContacterVisible=true" v-if="activeName === 'tab2'" style="float:right; margin-right:5px;"><el-button size="mini" type="primary">新建联系人</el-button></div>
                </span>
                <div v-if="isShowAll === 'all' || isShowAll === 'medium'" class="tab">
                    <ul>
                        <li v-if="isShowAll === 'all' || isShowAll === 'medium'" :class="{'liActive':activeName==='tab1'}" @click="switchTab('tab1') " :v-bind="activeName">客户联系</li>
                        <li v-if="isShowAll === 'all' || isShowAll === 'medium'" :class="{'liActive':activeName==='tab2'}" @click="switchTab('tab2')"  :v-bind="activeName">联系人</li>
                        <li v-if="isShowAll === 'all' " :class="{'liActive':activeName==='tab3'}" @click="switchTab('tab3')" :v-bind="activeName">销售机会</li>
                    </ul>
                </div>
            </div>

            <div class="content">
                <div v-if="activeName === 'tab1'" class="tab1">
                    <el-input  @focus="focusCustomerRelation" type="textarea" v-model="recordObj.agendaNav" :rows="textRows" placeholder="请填写联系记录"></el-input>
                    <div v-if="showRelationNav" class="relationNav">
                            <el-row>
                                <el-button @click="addRecord" style="margin-left:16px" type="primary" size="mini">提交</el-button>
                                <el-button @click="addAgendaVisible=true" size="mini">安排计划</el-button>
                                <el-select clearable  @change="contacterSelect" v-model="recordObj.contacterName" style="margin-left:6px; width:80px !important" placeholder="-联系人-" size="mini">
                                    <el-option
                                        v-for="item in contacterOptions"
                                        :key="item.contacterId"
                                        :label="item.contacterName"
                                        :value="{value:item.contacterId, label:item.contacterName}">
                                    </el-option>
                                </el-select>

                                <el-select  @change="businessSelect" v-model="recordObj.businessName" style="margin-left:6px; width:80px !important" placeholder="-商机-" size="mini">
                                    <el-option
                                        v-for="item in businessOptions"
                                        :key="item.businessId"
                                        :label="item.businessName"
                                        :value="{value:item.businessId, label:item.businessName}">
                                    </el-option>
                                </el-select> 
                                
                                <span @click="openFuJiaNav" >附加信息 <i class="el-icon-arrow-down"></i> </span>
                            </el-row>
                        </div>

                        <div class="fuJiaNav">
                            <el-row v-show="showFuJiaNav">
                               <el-row class="formInput">
                                    <el-col class="left" :span="3">
                                        <span>相关文档:</span>
                                    </el-col>
                                    <el-col :span="18">
                                        <div>
                                            <span class="clickTip" @click="openDocSelect"> <i class="el-icon-search"></i> </span>
                                            <span class="tag" v-for="tag in archiveData" :key="tag.docId">
                                                <span v-if="tag.docType === 'doc' ">{{tag.docName}} <i @click="closeArchiveTag(tag.docId)" class="el-icon-circle-close"></i> </span>
                                            </span>
                                        </div>
                                    </el-col>
                               </el-row>

                               <!-- <el-row class="formInput">
                                    <el-col class="left" :span="3">
                                         <span>相关流程:</span> 
                                    </el-col>
                                    <el-col :span="18">
                                        <div>
                                            <span class="clickTip" ><i class="el-icon-search"></i></span>
                                        </div>
                                    </el-col>
                               </el-row>

                                <el-row class="formInput">
                                    <el-col class="left" :span="3">
                                         <span>相关项目:</span> 
                                    </el-col>
                                    <el-col :span="18">
                                        <div>
                                            <span class="clickTip"><i class="el-icon-search"></i></span>
                                        </div>
                                    </el-col>
                                </el-row> -->

                                 <el-row class="formInput">

                                    <el-col class="left" :span="3">
                                         <span>相关附件:</span> 
                                    </el-col>
                                    
                                    <el-col :span="18">
                                        <div class="uploadSty">
                                            <attachment-upload @on-remove="getRemoveFuJianData" @uploadSuccess="getFuJianData" :archiveId="uploadArchiveId" :categoryId="uploadCategoryFuJianId" :branchId="userInfo.branchId"></attachment-upload>
                                        </div>
                                    </el-col>

                                </el-row>

                                <el-row class="formInput">
                                    <el-col class="left" :span="3">
                                         <span>上传图片:</span> 
                                    </el-col>
                                    <el-col :span="18">
                                        <div>
                                            <attachment-upload @on-remove="getRemoveImageData" @uploadSuccess="getImageData" :archiveId="uploadArchiveId" :categoryId="uploadCategoryImageId" :branchId="userInfo.branchId"></attachment-upload>
                                        </div>
                                    </el-col>
                                </el-row>

                            </el-row>
                        </div>

                        <div class="detail">
                            <div class="detail-head">
                                <div class="menu">
                                    <el-button-group> 
                                        <el-button @click="switchRecord" size="mini" :type="recordBtnType">联系记录</el-button>
                                        <el-button @click="switchPlan" size="mini" :type="planBtnType">联系计划</el-button>
                                    </el-button-group>
                                </div>
                                <!--排序-->
                            </div>

                        <div class="detail-nav">
                            <ul v-if="recordBtnType === 'primary'" v-loading="recordLoad.list">
                                <li v-for="(item) in recordData" :key="item.agendaId">
                                    <el-row>

                                        <div class="left" >
                                            <el-avatar :size="avatarSize" :src="item.agendaCreateImg"></el-avatar>
                                        </div>

                                        <div class="right">
                                            <p>{{item.agendaCreateName}} &nbsp; {{item.agendaCreateTime}}</p>
                                            <p>{{item.agendaNav}}</p>
                                           
                                            <p @click="openContacter(item, 'agenda')" v-if="item.contacterId !== null && item.contacterId !== '' ">相关联系人: <a style="color:#409EFF">{{item.contacterName}}</a> </p>
                                            <p @click="openBusiness(item)" v-if="item.businessId !== null && item.businessId !== '' ">相关商机: <a style="color:#409EFF">{{item.businessName}}</a> </p>

                                            <!--相关文档-->
                                            <p style="margin-bottom:10px" v-if="undefined !== item.docList && item.docList.length > 0">
                                                相关文档: <a style="color:#409EFF" v-for="(a) in item.docList" :key="a.id"><span v-if="a.docType === 'doc'">{{a.docName}}</span> &nbsp;</a>
                                            </p >

                                            <p style="margin-bottom:10px" v-if="undefined !== item.docList && item.docList.length > 0">
                                                相关附件: <a style="color:#409EFF" v-for="(a) in item.docList" :key="a.id"><span v-if="a.docType === 'fujian'" @click="openImage(a.docUrl)">{{a.docName}}</span> &nbsp;</a>
                                            </p >

                                            <p style="margin-bottom:10px" v-if="undefined !== item.docList && item.docList.length > 0">
                                                相关图片: <a style="color:#409EFF" v-for="(a) in item.docList" :key="a.id"><span v-if="a.docType === 'img'" @click="openImage(a.docUrl)">{{a.docName}}</span> &nbsp;</a>
                                            </p >

                                            <!-- <p v-if="item.contacterName !== null">相关流程: <a style="color:#409EFF">{{item.contacterName}}</a> </p> -->
                                            <!-- <p v-if="item.contacterName !== null">相关项目: <a style="color:#409EFF">{{item.contacterName}}</a> </p> -->
                                        </div>
                                    </el-row>
                                </li>
                            </ul>

                            <ul v-if="planBtnType === 'primary'" v-loading="planLoad.list">
                                <li v-for="(item) in planData" :key="item.agendaId">
                                    <el-row>
                                        <div class="plan">
                                            <span>{{item.agendaText}}</span>
                                            <span>
                                                <i class="el-icon-time"></i> {{item.beginTime}}  至  {{item.endTime}}
                                            </span>
                                            <p>{{item.agendaNav}}</p>
                                            <span v-if="undefined !== item.docList && item.docList.length > 0">
                                                相关文档: <a style="color:#409EFF" v-for="(a) in item.docList" :key="a.id">{{a.docName}} &nbsp;</a>
                                            </span>
                                            <!-- <p >相关流程: </p> -->
                                            <p style="float: right">创建人: {{item.agendaCreateName}} 创建于: {{item.agendaCreateTime}}</p>
                                        </div>
                                    </el-row>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div v-loading="load.list" v-if="activeName === 'tab2'" class="tab1">
                    <el-card style="margin-bottom:10px;" class="box-card" v-for="(item) in customerContacters" :key="item.contacterId" >
                        <div slot="header" class="clearfix">

                            <span><a @click="openContacter(item, 'contacter')"  style="font-size:18px; color: #66b1ff">{{item.contacterName}}</a>&nbsp;&nbsp;{{item.titleName}}</span>
                            <span style="float: right">
                                <i class="el-icon-user-solid"></i>&nbsp; <span>{{item.jobTitle}}</span>
                            </span>
                        </div>

                        <div class="text item">
                            <el-row>
                                <el-col :span="12"><a>移动电话</a>: {{item.mobilePhone}}</el-col>
                                <el-col :span="12"><a>电子邮箱</a>: {{item.contacterEmail}}</el-col>
                            </el-row>

                            <el-row style="margin-top:10px">
                                <el-col :span="12"><a>办公电话</a>: {{item.phoneOffice}}</el-col>
                                <el-col :span="12"><a>IM号码</a>: {{item.imcode}}</el-col>
                            </el-row>
                        </div>
                   </el-card>

                    <div style="margin-top:10px">
                        <el-pagination layout="total, sizes, prev, pager, next" @current-change="ContacterhandleCurrentChange" @size-change="ContacterhandleSizeChange" :page-sizes="[3]" :current-page="contacterPageInfo.pageNum" :page-size="contacterPageInfo.pageSize"  :total="contacterPageInfo.total" style="float:right;"></el-pagination> 
                    </div>
                </div>

                <div v-loading="businessLoad.list" v-if="activeName === 'tab3'" class="tab1">
                   
                    <el-card  v-for="(item) in businessData" :key="item.bussinessId" class="box-card">
                        
                        <div slot="header" class="clearfix">
                            <span><a style="font-size:20px; color: #66b1ff">{{item.businessName}}</a></span>
                            <span style="margin-left: 26px; float:right">
                                <i class="el-icon-wallet"></i>&nbsp; <span>{{item.expectEarnings}}</span> &nbsp;
                                <i class="el-icon-time"></i>&nbsp; <span>{{item.businessCreateTime}}</span>
                            </span>
                        </div>

                        <div class="text item">
                            <el-row>
                                <el-col :span="8"><a>销售预期:</a> {{item.expectDate}}</el-col>
                                <el-col :span="8"><a>可能性:</a> <span :class="item.possibility >=0.0 && item.possibility < 0.4 ? 'info' :
                                                                               item.possibility >=0.4 && item.possibility <= 0.7 ? 'primary': 'warn' ">{{item.possibility}}</span>  </el-col>
                                <el-col :span="8"><a>归档状态:</a> <span :class="item.archiveStatus === '1' ? 'primary' : item.archiveStatus === '2' ? 'info' : 'warn'">
                                {{item.archiveStatus === '1' ? '进行中' : item.archiveStatus === '2' ? '成功' : '失败'}}</span> </el-col>
                            </el-row>

                            <el-row style="margin-top:10px">
                                <el-col :span="8"><a>销售状态:</a> {{item.businessStatus}}</el-col>
                                <el-col :span="8"><a>成功关键因素:</a>{{item.successKeyCause}} </el-col>
                                <el-col :span="8"><a>失败关键因素:</a>{{item.faulitKeyCause}}</el-col>
                            </el-row>
                        </div>
                    </el-card>
 
                    <div style="margin-top:10px">
                        <el-pagination layout="total, sizes, prev, pager, next" @current-change="businessCurrentChange" @size-change="businesshandleSizeChange" :page-sizes="[3]" :current-page="businessPageInfo.pageNum" :page-size="businessPageInfo.pageSize"  :total="businessPageInfo.total" style="float:right;"></el-pagination> 
                    </div>

                </div>
            </div>

            <div class="footer" v-if="activeName === 'tab1'" >
                <el-pagination v-if="recordBtnType === 'primary'" layout="total, sizes, prev, pager, next" @current-change="recordCurrentChange" @size-change="recordhandleSizeChange" :page-sizes="[5,10, 15, 20, 25]" :current-page="recordPageInfo.pageNum" :page-size="recordPageInfo.pageSize"  :total="recordPageInfo.total" style="float:right;"></el-pagination>               
                <el-pagination v-if="planBtnType === 'primary'" layout="total, sizes, prev, pager, next" @current-change="planCurrentChange" @size-change="planhandleSizeChange" :page-sizes="[5,10, 15, 20, 25]" :current-page="planPageInfo.pageNum" :page-size="planPageInfo.pageSize"  :total="planPageInfo.total" style="float:right;"></el-pagination> 
            </div>
        </div>

        <el-dialog append-to-body title="新增日程" top="4vh" :visible.sync="addAgendaVisible"  width="60%"  :close-on-click-modal="false">
			<customer-agenda-add :customerId="customerId" :customerName="customerName" :visible="addAgendaVisible" @cancel="addAgendaVisible=false" @submit="addAgendaVisible=false"></customer-agenda-add>
		</el-dialog>

        <el-dialog class="abow_dialog" append-to-body title="新增联系人"  :visible.sync="addContacterVisible"  :close-on-click-modal="false">
            <customer-contacter-add @submit="addContacterSubmitAfter" :customerId="customerId" :customerName="customerName" :visible="addContacterVisible" @cancel="addContacterVisible=false" ></customer-contacter-add>
        </el-dialog>

        <div class="detailDialog">
            <el-dialog  append-to-body  :fullscreen="true" :visible.sync="contacterVisible"  :close-on-click-modal="false">
                <customer-contacter-detail  :contacter="contacterForm" :visible="contacterVisible" @cancel="contacterVisible=false" @delSubmit="contacterVisible=false" ></customer-contacter-detail>
            </el-dialog> 
        </div>

        <!--编辑 CustomerBusiness crm_customer_business界面-->
        <el-dialog append-to-body :fullscreen="true" title="客户商机" :visible.sync="businessVisible"  :close-on-click-modal="false">
            <customer-business-edit :customer-business="businessForm" :visible="businessVisible" @cancel="businessVisible=false" @submit="businessVisible=false"></customer-business-edit>
        </el-dialog>

        <archive-select-components  isMultiple="true" @multipleSelect="getArchiveData" ref="archiveSelect">
		</archive-select-components>


    </section>
</template>

<script>
    import { listCustomerContacter, getContacterById } from '@/api/oa/crm/customerContacter';
    import { addCustomerAgenda, listCustomerAgenda } from '@/api/oa/crm/customerAgenda';
    import { listCustomerBusiness, getBusinessById} from '@/api/oa/crm/customerBusiness';
    import CustomerAgendaAdd from '../customerAgenda/CustomerAgendaAdd';
    import CustomerContacterAdd from '../customerContacter/CustomerContacterAdd';
    import { mapGetters } from 'vuex';
    import CustomerContacterDetail from '../customerContacter/CustomerContacterDetail';
    import CustomerBusinessEdit from '../customerBusiness/CustomerBusinessEdit';//修改界面
    import ArchiveSelectComponents from '../components/ArchiveSelectComponents';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import config from "@/common/config"; //全局公共库import
    import {sn} from '@/common/js/sequence'; //id生成器
    

    export default { 
        
      	computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},

        props: ['customerId', 'customerName', 'customerManagerUserName', 'businessId', 'businessName', 'visible', 'isShowAll'],

        watch: {

	       'customerId':function( customerId ) {
                //按需查询
                switch(this.activeName) {
                    case 'tab1' :
                        this.getCustomerAgenda();
                    break;
                    case 'tab2' :
                        this.getCustomerContacters();
                    break;
                    case 'tab3' :
                        this.getCustomerBusiness();
                    break;
                }
            },
          
            visible :{
            　　immediate:true,
                handler:function(value){
                    if(value==true){
                        this.getCustomerAgenda();
                    }
                }
            }
	    },

		data() {
			return {
                textRows: 1,
                //展示联系信息填写内容
                showRelationNav: false,
                showFuJiaNav: false,
                //用户图像
                avatarUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                load:{ list: false, edit: false, del: false, add: false },//查询中...
                recordLoad:{ list: false, edit: false, del: false, add: false },
                planLoad:{ list: false, edit: false, del: false, add: false },
                filters: {
					key: ''
				},
                //客户联系人分页
                contacterPageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:3,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
                },
                //客户联系人数据
                customerContacters: [],
                //联系记录
                recordPageInfo: {
                    total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:5,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
                },
                recordData: [],
                //联系计划
                planPageInfo: {
                    total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:5,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
                },
                planData: [],
                businessLoad:{ list: false, edit: false, del: false, add: false },
                businessPageInfo: {
                    total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:5,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
                },
                //当前选中
                activeName: "tab1",
                //头像大小
                avatarSize: 50,
                //联系计划按钮类型
                recordBtnType: 'primary',
                planBtnType: '',
                //联系记录对象
                recordObj : {agendaId:'', agendaText:'', agendaNav:'', customerId:'', customerName:'', contacterId:'',contacterName:'',urgentLevel:'',urgentLevelName:'',beginTime:'',endTime:'',tipType:'',remindImmediately:'',remindBeforeStart:'',remindBeforeHour:'',remindBeforeMinute:'',remindEndStart:'',remindEndHour:'',remindEndMinute:'',workPlanType:'',agendaCreateId:'',agendaCreateName:'',agendaCreateImg:'',agendaCreateTime:'',isPlan:'0',branchId:'',businessId:'', businessName: '', receiveUserName: '', receiveUserId: ''},
                recordRefresh: {agendaId:'', agendaText:'', agendaNav:'', customerId:'', customerName:'', contacterId:'',contacterName:'',urgentLevel:'',urgentLevelName:'',beginTime:'',endTime:'',tipType:'',remindImmediately:'',remindBeforeStart:'',remindBeforeHour:'',remindBeforeMinute:'',remindEndStart:'',remindEndHour:'',remindEndMinute:'',workPlanType:'',agendaCreateId:'',agendaCreateName:'',agendaCreateImg:'',agendaCreateTime:'',isPlan:'0',branchId:'',businessId:'', businessName: '', receiveUserName: '', receiveUserId: ''},
                //客户联系人select
                contacterOptions:[],
                //安排计划显示
                addAgendaVisible: false,
                //传给子组件的数据
                addContacterVisible: false,
                //商机
                businessData: [],
                businessOptions: [],
                contacterVisible: false,
                contacterForm: '',
                businessVisible: false,
                businessForm: '',
                archiveData: [],

                //上传
                uploadArchiveId: '',
                uploadCategoryFuJianId: '',
                uploadCategoryImageId: '',
                imgShowUrl: config.getArcImagePath() + "/",
            }
            
		},//end data
		methods: {

            //点击客户联系input框
            focusCustomerRelation() {
                this.textRows = 4;
                this.showRelationNav = true;
                //查询联系人， 联系商机数据生成options
                this.getCustomerAllContacters();
                this.getCustomerAllBusiness();
            },

            //打开附加信息内容
            openFuJiaNav() {
                this.showFuJiaNav = !this.showFuJiaNav;
            },

            ContacterhandleSizeChange(pageSize) { 
				this.contacterPageInfo.pageSize=pageSize; 
				this.getCustomerContacters();
            },
            
			ContacterhandleCurrentChange(pageNum) {
				this.contacterPageInfo.pageNum = pageNum;
				this.getCustomerContacters();
            },
            
            recordhandleSizeChange(pageSize) { 
				this.recordPageInfo.pageSize=pageSize; 
				this.getCustomerAgenda();
            },

            recordCurrentChange(pageNum) {
				this.recordPageInfo.pageNum = pageNum;
				this.getCustomerAgenda();
            },

            planCurrentChange(pageSize) { 
				this.planPageInfo.pageSize=pageSize; 
				this.getCustomerAgendaPlan();
            },
            
            planhandleSizeChange(pageNum) {
				this.planPageInfo.pageNum = pageNum;
				this.getCustomerAgendaPlan();
            },

            businessCurrentChange(pageSize) { 
				this.businessPageInfo.pageSize=pageSize; 
				this.getCustomerBusiness();
            },
            businesshandleSizeChange(pageNum) {
				this.businessPageInfo.pageNum = pageNum;
				this.getCustomerBusiness();
            },

            //查询客户的联系人
			getCustomerContacters() {
				let params = {
					pageSize: this.contacterPageInfo.pageSize,
					pageNum: this.contacterPageInfo.pageNum,
					total: this.contacterPageInfo.total,
                    count:this.contacterPageInfo.count,
                    customerId: this.customerId,
                    branchId: this.userInfo.branchId
				};
				if(this.contacterPageInfo.orderFields!=null && this.contacterPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.contacterPageInfo.orderFields.length;i++){ 
						orderBys.push(this.contacterPageInfo.orderFields[i]+" "+this.contacterPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listCustomerContacter(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.contacterPageInfo.total = res.data.total;
						this.contacterPageInfo.count=false;
                        this.customerContacters = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false);
            },

            //查询该客户的所有联系人
            getCustomerAllContacters() {
                let params = {
					pageSize: 999,
					pageNum: 1,
					total: 0,
                    count: false,
                    customerId: this.customerId,
                    branchId: this.userInfo.branchId
                };
                listCustomerContacter(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
                        this.contacterOptions = res.data.data;
					}
					this.load.list = false;
				}).catch( err => this.load.list = false);
            },

            getCustomerAllBusiness() {
                let params = {
					pageSize: 999,
					pageNum: 1,
					total: 0,
                    count: false,
                    customerId: this.customerId,
                    branchId: this.userInfo.branchId
                };
                listCustomerBusiness(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
                        this.businessOptions = res.data.data;
					}
					this.load.list = false;
				}).catch( err => this.load.list = false);
            },

            //获取客户商机
            getCustomerBusiness() {
               let params = {
					pageSize: this.businessPageInfo.pageSize,
					pageNum: this.businessPageInfo.pageNum,
					total: this.businessPageInfo.total,
                    count:this.businessPageInfo.count,
                    customerId: this.customerId,
                    branchId: this.userInfo.branchId
				};
				if(this.businessPageInfo.orderFields!=null && this.businessPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.businessPageInfo.orderFields.length;i++){ 
						orderBys.push(this.businessPageInfo.orderFields[i]+" "+this.businessPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.businessLoad.list = true;
                listCustomerBusiness(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){
                        this.businessPageInfo.total = res.data.total;
                        this.businessPageInfo.count=false;
                        this.businessData = res.data.data;
                        this.businessData.forEach(param => {
                            if(!this.isNull(param.expectDate)) {
                                param.expectDate = (param.expectDate+"").substring(0, 10);
                            }
                        })
                    }else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.businessLoad.list = false;
				}).catch( err => this.businessLoad.list = false);
            },
            
            //添加联系人记录
            addRecord() {
                this.recordObj.customerId =  this.customerId;
                this.recordObj.customerName = this.customerName;

                if(this.isNull(this.recordObj.agendaNav)) {
                    //显示错误
                    this.$message.error('请填写客户联系记录');
                    return;
                }

                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.load.add=true
                    let params = Object.assign({}, this.transfreData(this.recordObj)); 
                    addCustomerAgenda(params).then((res) => {
                        this.load.add=false
                        var tips=res.data.tips;
                        if(tips.isOk){
                            //刷新表单数据
                            this.textRows = 1;
                            this.refresh();
                            this.getCustomerAgenda();
                            this.$emit('submit');//  @submit="afterAddSubmit"
                        }
                        this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                    }).catch( err  => this.load.add=false);
                });
            },

            refresh() {
                this.recordObj = Object.assign(this.recordObj, this.recordRefresh);
                this.uploadArchiveId = false,
                this.uploadCategoryFuJianId= null,
                this.uploadCategoryImageId= null,
                this.archiveData = [];
            },

            transfreData(data) {
                let params = {
                    "customerAgenda": data,
                    "customerAgendaDocList" : this.archiveData
                }
                return params;
            },

            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },

            /**
             * 查询客户联系记录
             */
            getCustomerAgenda() {
                this.recordPageInfo.orderFields.push('agenda_create_time');
                this.recordPageInfo.orderDirs.push('desc');
                let params = {
					pageSize: this.recordPageInfo.pageSize,
					pageNum: this.recordPageInfo.pageNum,
					total: this.recordPageInfo.total,
                    count:this.recordPageInfo.count,
                    customerId: this.customerId,
                    isPlan: '0'
				};
				if(this.recordPageInfo.orderFields!=null && this.recordPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.recordPageInfo.orderFields.length;i++){ 
						orderBys.push(this.recordPageInfo.orderFields[i]+" "+this.recordPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.recordLoad.list = true;
				listCustomerAgenda(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.recordPageInfo.total = res.data.total;
                        this.recordPageInfo.count=false;
                        this.recordData = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.recordLoad.list = false;
				}).catch( err => this.recordLoad.list = false );
            },

             /**
             * 查询客户联系计划
             */
            getCustomerAgendaPlan() {
                this.planPageInfo.orderFields.push('agenda_create_time');
                this.planPageInfo.orderDirs.push('desc');
                let params = {
					pageSize: this.planPageInfo.pageSize,
					pageNum: this.planPageInfo.pageNum,
					total: this.planPageInfo.total,
                    count:this.planPageInfo.count,
                    customerId: this.customerId,
                    isPlan: '1'
				};
				if(this.planPageInfo.orderFields!=null && this.planPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.planPageInfo.orderFields.length;i++){ 
						orderBys.push(this.planPageInfo.orderFields[i]+" "+this.planPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.planLoad.list = true;
				listCustomerAgenda(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.planPageInfo.total = res.data.total;
                        this.planPageInfo.count=false;
                        this.planData = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.planLoad.list = false;
				}).catch( err => this.planLoad.list = false );
            },

            switchRecord() {
                this.recordBtnType = 'primary';
                this.planBtnType = ''
            },

            switchPlan() {
                this.recordBtnType = '';
                this.planBtnType = 'primary'
                //查询计划数据
                this.getCustomerAgendaPlan();
            },

            contacterSelect(obj) {
                this.recordObj.contacterId = obj.value;
                this.recordObj.contacterName = obj.label;
            },

            businessSelect(obj) {
                this.recordObj.businessId = obj.value;
                this.recordObj.businessName = obj.label;
            },

            addContacterSubmitAfter() {
                this.addContacterVisible = false;
                this.getCustomerContacters();
            },

            //转换tab
            switchTab(value) {
                //按需查询
                switch(value) {
                    case 'tab1' :
                        this.activeName = value;
                    break;
                    case 'tab2' :
                        this.activeName = value;
                        this.getCustomerContacters();
                    break;
                    case 'tab3' :
                        this.activeName = value;
                        this.getCustomerBusiness();
                    break;
                }
            },

            //打开联系人
            openContacter(data, source) {
                if(source === 'contacter') {
                    this.contacterForm = data;
                    this.contacterVisible = true;
                }else {
                    let params = {
                        contacterId: data.contacterId,
                        branchId: this.userInfo.branchId
                    }
                    getContacterById(params).then((res) => {
                        var tips=res.data.tips;
                        if(tips.isOk){
                            this.contacterForm = res.data.data;
                            this.contacterVisible = true;
                        }else{
                            this.$message({ message: tips.msg, type: 'error' });
                        }
                    }).catch( err => {} );
                }
            },

            //打开商机
            openBusiness(data) {
                let params = {
                    businessId: data.businessId,
                    branchId: this.userInfo.branchId
                }
                getBusinessById(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
                        this.businessForm = res.data.data;
                        this.businessVisible = true;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
                }).catch( err => {} );
            },

            openDocSelect() {
				this.$refs.archiveSelect.openDialog();
            },
            
            //获取相关文档数据
			getArchiveData(data) {
				data.forEach(d => {
					let flag = this.archiveData.some(item => {
						if(item.id == d.id) {
							return true;
						}
					})
                    if(flag) {return};
                    let param = {
                        docId: d.id,
                        docName: d.archiveTitle,
                        docType: 'doc'
                    }
					this.archiveData.push(param);
                })
            },
            
            closeArchiveTag(id) {
				this.archiveData.forEach((p, index) => {
					if(p.docId === id) {
						this.archiveData.splice(index, 1);
					}
				})
            },
            
            initData() {
                this.recordObj.agendaId = sn();
                this.uploadArchiveId = this.recordObj.agendaId;
                this.uploadCategoryFuJianId =  'customer_agenda_fujian';
                this.uploadCategoryImageId = 'customer_agenda_image';
            },

            getFuJianData(file, fileList) {
                let param = {
                    docId: file.id,
                    docName: file.name,
                    docUrl: file.url,
                    docType: 'fujian'
                }
                this.archiveData.push(param);
            },

            getRemoveFuJianData(file, fileList) {
                this.archiveData.forEach((p, index) => {
					if(p.docId === file.id) {
						this.archiveData.splice(index, 1);
					}
				})
            },


            getRemoveImageData (file, fileList) {
                this.archiveData.forEach((p, index) => {
					if(p.docId === file.id) {
						this.archiveData.splice(index, 1);
					}
				})
            },
            
            getImageData(file, fileList) {
                let param = {
                    docId: file.id,
                    docName: file.name,
                    docUrl: file.url,
                    docType: 'img'
                }
                this.archiveData.push(param);
            },

            openImage(url) {
                //打开附件， 图片
                if(this.isNull(url)) return;
                window.open(this.imgShowUrl+url);
            },



		},//end methods
        
        components: { 
            'customer-agenda-add':CustomerAgendaAdd,
            'customer-contacter-add':CustomerContacterAdd,
            'customer-contacter-detail': CustomerContacterDetail,
            'customer-business-edit':CustomerBusinessEdit,
            'archive-select-components' : ArchiveSelectComponents,
            'attachment-upload': AttachmentUpload,
        },
        
		mounted() { 
            this.initData();
		}
	}

</script>

<style scoped>
ul {
    margin: 0;
    padding: 0;
}

ul li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.container {
   z-index: 99;
}

.header {
    width: 100%;
    height: 98px;
    flex: 0 0 auto;
    font-size: 12px;
    line-height: 43px;
    border: 1px solid rgb(226, 236, 242);
    border-left: 0;
}

.header span {
    height: 42.6px;
    display: block;
    border-bottom: 1px solid rgb(226, 236, 242);
}

/** tab页 */
.tab {
    /* height: 55px; */
}

.tab ul {
    margin: 15px 0 0 10px;
}

.tab ul li {
    display: inline-block;
    margin-right: 38px;
    font-size: 14px;
    height: 39px;
}

.tab ul li:hover {
   cursor: pointer;
   color: #409EFF;
}


/** 内容 */
.content {
    margin-left: 12px;
    margin:0; /*公共*/
    width:100%;
}

.clearfix:after {
    content:'';display:block;clear:both;
}

.content .tab1 {
    margin-top: 10px;
}

.relationNav {
    margin-top: 10px;
    border-bottom: 1px solid rgb(226, 236, 242);
    line-height: 50px;
    cursor: pointer;
}

.relationNav span {
    font-size: 12px; 
    float: right;
    line-height: 50px;
    margin-right: 5px;
}


.fuJiaNav {
    margin-top: 10px;
}

.fuJiaNav span {
    float: left;
    font-size: 12px;
    margin-top: 6px;
}

.formInput {
    margin-top: 5px;
}

.formInput .left { 
    margin-left: 5px;
}

.formInput .tag {
    margin: 7px 10px 0 10px;
    color: #409EFF;
}

.formInput .tag .el-icon-circle-close:hover {
    cursor: pointer;
}

.formInput .clickTip:hover {
    cursor: pointer;
}

.formInput .uploadSty {
    font-size: 12px !important;


}

.detail {
    width: 100%;
}

.detail-head {
    width: 100%;
    height: 40px;
}

.detail-head .menu {
    text-align: center;
    line-height: 40px;
}

.detail-nav ul,li{ padding:0;margin:0;list-style:none}

.detail-nav {
    margin-top: 10px;
}

.detail-nav li {
    border-bottom: 1px solid rgb(226, 236, 242);
}

.detail-nav li:first-child {
    border-top: 1px solid rgb(226, 236, 242);
}

.detail-nav p{
    font-size: 12px;
}

.detail-nav .left {
    height: 100%;
    width: 80px;
    padding: 10px 0 0 12px;
    float: left;
}

.detail-nav .right {
  margin-left: 10px;
  float: left;
  font-size: 12px;
  padding-bottom: 10px;
}

.detail-nav .plan span {
    font-size: 12px;
}

.detail-nav .plan p {
    margin-right: 10px;
    padding: 0;
}

.detail-nav .plan span:nth-child(1) {
    margin-left: 2px;
}

.detail-nav .plan span:nth-child(2) {
    float: right;
    margin: 4px 10px 0 0;
    color: #409EFF;
}


.box-card {
    font-size:12px;
    margin-top: 8px;
}

.box-card .text a{
    font-size: 13px;
} 

.box-card .text .info, .primary, .warn{
    font-weight: 700;
}

.box-card .text .info {
    color: #409EFF;
}

.box-card .text .primary {
    color: #E6A23C;
}

.box-card .text .warn {
    color: #F56C6C;
}





.liActive {
	border-bottom: 2px solid #409EFF;
}

.footer {
    height: 50px;
    width: 100%;
}

</style>


<style>

/* .abow_dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.abow_dialog .el-dialog {
    margin: 0 auto !important;
    height: 80%;
    overflow:hidden;
} 

 .abow_dialog .el-dialog__body {
    position: relative;
    left: 0;
    top: 54px;
    bottom: 0;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
}  */

</style>
