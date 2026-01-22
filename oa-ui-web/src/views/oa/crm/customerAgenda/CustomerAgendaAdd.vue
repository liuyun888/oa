<template>
	<section>
		 <el-row class="page-container border padding"> 
			<div class="content">
				<el-form class="form" :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
					
					<el-form-item label="标题" prop="agendaText">
						<el-input v-model="addForm.agendaText" placeholder="日程标题" ></el-input>
					</el-form-item> 

					<el-form-item label="日程内容" prop="agendaNav">
						<el-input type="textarea" rows="3" v-model="addForm.agendaNav" placeholder="日程内容" ></el-input>
					</el-form-item> 

					<el-form-item label="接收人" prop="receiveName">
						<!-- <el-input v-model="addForm.receiveName" placeholder="接收人" @focus="visibleUserSelect=true"></el-input> -->
						<div @click="visibleUserSelect=true">
							<i class="el-icon-search"></i><span>选择接收人</span>
							<el-tag
								style="margin-right:20px"
								v-for="tag in receiveUser"
								:key="tag.receiveUserId"
								@close="closeReceiveTag(tag.receiveUserId)"
								closable>
								{{tag.receiveUserName}}
							</el-tag>
						</div>
					</el-form-item> 
				
					<el-form-item label="紧急程度" prop="urgentLevel">
						<el-select @change="changeUrgentLevel" v-model="addForm.urgentLevelName" placeholder="紧急程度">
							<el-option
								v-for="item in urgencyLevelData"
								:key="item.optionValue"
								:label="item.optionName"
								:value="{value:item.optionValue, label:item.optionName}">
							</el-option>
						</el-select>
					</el-form-item> 

			
					<el-form-item label="开始时间" prop="beginTime">
						<el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.beginTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>

					<el-form-item label="结束时间" prop="endTime">
						<el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>

					<el-form-item label="提醒方式" prop="tipType">
						<el-checkbox-group @change="tipTypeChange" v-model="tipTypeArr">
							<el-checkbox label="短信"></el-checkbox>
							<el-checkbox label="邮件"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>

					<div v-if="isShowMore">
						<el-form-item label="立即提醒" prop="remindImmediately">
							<el-switch
								v-model="addForm.remindImmediately"
								active-color="#13ce66"
								active-value="1"
								inactive-value="0">
							</el-switch>
						</el-form-item>

						<el-form-item label="开始前提醒">
							<el-row>
								<el-checkbox true-label="1" false-label="0"  v-model="addForm.remindBeforeStart"></el-checkbox>&nbsp;开始前
								<el-input-number controls-position="right" v-model="addForm.remindBeforeHour" :min="0" ></el-input-number> &nbsp;小时
								<el-input-number controls-position="right" v-model="addForm.remindBeforeMinute" :min="0"></el-input-number> &nbsp;分钟
							</el-row>
						</el-form-item>

						<el-form-item label="结束前提醒">
							<el-row>
								<el-checkbox true-label="1" false-label="0"  v-model="addForm.remindEndStart"></el-checkbox>&nbsp;结束前
								<el-input-number controls-position="right" v-model="addForm.remindEndHour"   :min="0"></el-input-number> &nbsp;小时
								<el-input-number controls-position="right" v-model="addForm.remindEndMinute" :min="0"></el-input-number> &nbsp;分钟
							</el-row>
						</el-form-item>
					</div>

					<el-form-item label="相关文档" prop="urgentLevel">
						<div @click="openDocSelect">
							<i class="el-icon-search"></i><span>选择相关文档</span>
							<el-tag style="margin-right:20px"
								v-for="tag in archiveData"
								:key="tag.id"
								closable
								@close="closeArchiveTag(tag.id)"
								>
								<span>{{tag.archiveTitle}} - {{tag.authorName}} - {{tag.archivingDate}}</span>
							</el-tag>
						</div>
					</el-form-item>


					<el-form-item label="相关流程" >
						<el-input disabled  placeholder="相关流程" ></el-input>
					</el-form-item>
				</el-form>
			</div>

			<div class="footer">
				<el-col :span="24" :offset="8"> 
					<el-button @click.native="handleCancel">取消</el-button>  
					<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
				</el-col>
			</div>
		</el-row>

		<archive-select-components isMultiple="true" @multipleSelect="getArchiveData" ref="archiveSelect">
		</archive-select-components>

		<el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
            <user-select @confirm="getUserData" ></user-select>
        </el-dialog>

	</section>
</template>

<script>
	
	import util from '@/common/js/util'; //全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption'; //下拉框数据查询 
	import { addCustomerAgenda } from '@/api/oa/crm/customerAgenda';
	import ArchiveSelectComponents from '../components/ArchiveSelectComponents';
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
	import { mapGetters } from 'vuex';
		
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerAgenda', 'visible', 'customerId', 'customerName',],
		watch: {
		  
		  'customerId':function( customerId ) {
	        this.addForm.customerId = customerId;
		  },

		  'customerName':function( customerName ) {
	         this.addForm.customerName = customerName;
		  },
		  
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.initData();
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					agendaText: [
						{ required: true, message: '日程标题不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_agenda
				addForm: {
					agendaId:'',agendaText:'',agendaNav:'',customerId:'',customerName:'',contacterId:'',contacterName:'',urgentLevel:'',urgentLevelName:'',beginTime:'',endTime:'',tipType:'',remindImmediately:'0',remindBeforeStart:'',remindBeforeHour:'',remindBeforeMinute:'',remindEndStart:'',remindEndHour:'',remindEndMinute:'',workPlanType:'',agendaCreateId:'',agendaCreateName:'',agendaCreateImg:'',agendaCreateTime:'',isPlan:'1',branchId:'',businessId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				//是否展示更多表单
				isShowMore: false,
				tipTypeArr: [],
				//紧急程度数据
				urgencyLevelData: [],

				//选择的相关文档
				archiveData: [],

				//显示用户选择组件
				visibleUserSelect: false,

				//接收人用户
				receiveUser: [],


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.reset();
				this.$emit('cancel');
			}, 
			//新增提交CustomerAgenda crm_customer_agenda 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.addForm.customerId = this.customerId;
				this.addForm.customerName = this.customerName;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.transferData(this.addForm)); 
							addCustomerAgenda(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.reset();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			reset() {
				this.$refs['addForm'].resetFields();
				this.receiveUser = [];
				this.archiveData = [];
			},		


			//改变数据
			transferData(data) {
				let customerAgendaDocList = [];
				if(this.archiveData.length > 0) {
					this.archiveData.forEach(a => {
						let obj = {
							docId: a.id,
							docName: a.archiveTitle,
							docType: 'doc'
						}
						customerAgendaDocList.push(obj);
					})
				}

				//日期
				if(!this.isNull(data.beginTime) && data.beginTime instanceof Date) {
					data.beginTime = util.formatDate(data.beginTime, "yyyy-MM-dd HH:mm:ss")
				}

				if(!this.isNull(data.endTime) && data.endTime instanceof Date) {
					data.endTime = util.formatDate(data.endTime, "yyyy-MM-dd HH:mm:ss")
				}

				let params = {
					customerAgenda: data,
					customerAgendaDocList: customerAgendaDocList,
					customerAgendaUsers: this.receiveUser
				}
				return params;
			},

			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },

			//提示类型发生改变
			tipTypeChange(value) {
				this.tipTypeArr.length > 0 ? this.isShowMore = true : this.isShowMore = false;
			},

			getOption() {
                let params = [
					{ categoryId: "all", itemCode: "urgencyLevel" },
                ];
                listOption(params).then(res => {
					this.urgencyLevelData = res.data.data.urgencyLevel
                });
			},

			initData() {
				this.getOption();
			},

			changeUrgentLevel(data) {
				this.addForm.urgentLevel = data.value;
				this.addForm.urgentLevelName = data.label;
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
					this.archiveData.push(d);
                })
			},

			closeArchiveTag(id) {
				this.archiveData.forEach((p, index) => {
					if(p.id === id) {
						this.archiveData.splice(index, 1);
					}
				})
			},

			closeReceiveTag(id) {
				this.receiveUser.forEach((p, index) => {
					if(p.receiveUserId === id) {
						this.receiveUser.splice(index, 1);
					}
				})
			},

			//获取接收人数据
			getUserData(data) {
				this.visibleUserSelect = false;
				data.forEach(d => {
					let flag = this.receiveUser.some(item => {
						if(item.receiveUserId === d.userid) {
							return true;
						}
					})
					if(flag) {return};
					//设置维修费用
					this.receiveUser.push({receiveUserId: d.userid, receiveUserName: d.username});
                })
			},

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'customer-agenda-edit':CustomerAgendaEdit
			'archive-select-components' : ArchiveSelectComponents,
			'user-select' : UsersSelect,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.customerAgenda);  
			/**在下面写其它函数***/
			this.initData();
		}//end mounted
	}

</script>

<style scoped>

.app-container{
	height: 500px;
}

.content {
	position: absolute;
	bottom: 50px;
	top: 0px;
	overflow: auto;
	width: 100%;
	padding-right: 10px;
}

.footer {
	position: absolute;
	bottom: 0;
	right: 0;
	height: 50px;
	width: 100%;
}

.form span:hover {
	cursor: pointer;

}

</style>