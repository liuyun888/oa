<template>
	<section class="page-container padding">
		 <el-row >
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="申请人" prop="username">
				{{this.userInfo.username}}
				</el-form-item>
				<el-form-item label="申请部门" prop="deptName">
				{{this.userInfo.deptName}}
				</el-form-item>
				<el-form-item label="用品" prop="applianceId">
					<el-button type="text" @click="openSelectAppliance" >选择用品</el-button>
					<el-tag v-if="addForm.applianceName != ''" style="margin-left:20px;" v-text="addForm.applianceName"></el-tag>
					<font color="red" v-if="addForm.applianceName != ''">规格:{{addForm.standard}}</font>
					&nbsp;<font color="red" v-if="addForm.applianceName != ''">当前库存:{{addForm.stock}}</font>
					
				</el-form-item>  
				<el-form-item label="申领数量" prop="num">
					<el-input-number v-model="addForm.num"   :min="1" :max="100000"></el-input-number>
				</el-form-item>  
				<el-form-item label="使用类型" prop="useType">
					<!-- <el-input v-model="addForm.useType" placeholder="使用类型:0个人使用,1部门使用"></el-input> -->
					<el-radio-group v-model="addForm.useType">
						<el-radio label="0">个人使用</el-radio>
						<el-radio label="1">部门使用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="领取方式" prop="receiveType">
					<!-- <el-input v-model="addForm.receiveType" placeholder="领取方式:0自取,1快递,2他人代领" ></el-input> -->
					<el-radio-group v-model="addForm.receiveType">
						<el-radio label="0">自取</el-radio>
						<el-radio label="1">快递</el-radio>
						<el-radio label="2">他人代领</el-radio>
            			<el-radio label="3">仓库配送</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="addForm.receiveType == '2'" label="" prop="remark">
					<el-input v-model="addForm.receiveName" placeholder="领取人名字" ></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="remark">
					<el-input type="textarea" :rows="3" maxlength="255" v-model="addForm.remark" placeholder="说明" ></el-input>
				</el-form-item>
				<!--<el-form-item label="申请时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="状态0已提交,1审批中,2已通过,3未通过,4已归还" prop="status">
					<el-input v-model="addForm.status" placeholder="状态0已提交,1审批中,2已通过,3已领取,4未通过,5已归还" ></el-input>
				</el-form-item>
				 <el-form-item label="机构号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构号" ></el-input>
				</el-form-item>  -->
				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button v-loading="load.add" type="primary" @click="addSubmit" :disabled="load.add==true">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>

			<el-dialog title="选择用品" append-to-body :visible.sync="selectApplianceVisible"  width="70%"  :close-on-click-modal="false">
				<appliance-components @onSelectAppliance="onSelectAppliance" @cancel="selectApplianceVisible=false" ></appliance-components>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addOmApplianceRequire } from '@/api/oa/om/omApplianceRequire';
	import { mapGetters } from 'vuex'
	import omApplianceComponents from '../components/OmApplianceComponents';
	import config from '@/common/config';//全局公共库

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['omApplianceRequire','visible'],
		watch: {
	      'omApplianceRequire':function( omApplianceRequire ) {

	      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加
				  this.addForm.useType = '0'
				  this.addForm.receiveType = '0'
				  this.addForm.useTime = new Date().getTime()
	      	}
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					applianceId: [
						{ required: true, message: '用品不能为空', trigger: 'change' }
					],
					useType: [
						{ required: true, message: '使用类型不能为空', trigger: 'change' }
					],
					receiveType: [
						{ required: true, message: '申领类型', trigger: 'change' }
					],
					
					num: [
						{ required: true, message: '申领数量不能为空', trigger: 'change' }
					],
				},
				//新增界面数据 om_appliance_require
				addForm: {
					id:'',applianceId:'',applianceName:'',standard:'',num:1,stock:'',remark:'',useType:'',receiveType:'',useTime: '',createTime:'',status:'',branchId:'',receiveName:'',userid:'',username:'',deptName:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				selectApplianceVisible: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交OmApplianceRequire om_appliance_require 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				debugger;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
					  if(this.addForm.num<=0||this.addForm.num==null||this.addForm.num==''){
					    this.$message({ message: '申领数量不能小于等于0,请增加数量', type: 'error' });
					    return;
            			}
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							this.addForm.branchId = this.userInfo.branchId
							this.addForm.status = '0'
							this.addForm.userid = this.userInfo.userid
							this.addForm.username = this.userInfo.username
              this.addForm.deptName = this.userInfo.deptName
							let params = Object.assign({}, this.addForm);
							addOmApplianceRequire(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.addForm=res.data.data
									this.sendToProcessApprova(this.addForm,"om_appliance_require_approva")
									//this.$emit('submit',this.addForm);//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$message({ message: '表单验证不通过', type: 'error' });
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			openSelectAppliance(){
				this.selectApplianceVisible = true
			},
			onSelectAppliance(value){
				//console.log(value)
				this.selectApplianceVisible = false
				this.addForm.applianceId = value.id
				this.addForm.applianceName = value.name
				this.addForm.stock = value.stock
				this.addForm.standard = value.standard
			},

			//检测输入要使用的数量是否要大于0
			changNum(value){
				if(0 >= value){
					this.$message({ message: '不能小于等于0,请增加数量', type: 'error' });
					// this.addForm.num = this.addForm.stock
				}

			},
			
			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
				if(row.bizFlowState=='1'){
					this.$message.error("已经发起，不允许重复发起");
					return;
				}
				let extVars={omApplianceRequireId:row.id,branchId:this.userInfo.branchId}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:row.id,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED', 
						omApplianceRequireId:row.id,
						num:row.num,
						applianceId:row.applianceId,
						branchId:this.userInfo.branchId,  
					},
				}
				debugger;
				if(bizKey=="om_appliance_require_approva"){
					//预算变更审核
					params.mainTitle='关于【'+row.username+'申领办公用品'+row.applianceName+row.num+(row.unit?row.unit:'')+'】的申请';
					params.mainContext='申请人：'+row.username+','+'用品名称：'+row.applianceName+',规格：'+row.stanrd+',申领数量：'+row.num+',当前库存：'+row.stock 
										+'<br>申领说明：'+row.remark;
					params.restUrl=config.getOaBasePath()+"/om/omApplianceRequire/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});
				}else {
					this.$message.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'om-appliance-require-edit':OmApplianceRequireEdit
			'appliance-components':omApplianceComponents,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.omApplianceRequire);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
