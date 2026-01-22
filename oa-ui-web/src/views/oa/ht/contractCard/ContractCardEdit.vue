<template>
	<section>
		<el-row class="page-container border padding"> 

			<!--编辑界面 ContractCard ht_contract_card--> 
			<el-form :model="editForm" size="mini" label-width="120px" :rules="editFormRules" ref="editForm">
				
				<line-components text="基本信息"></line-components>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="合同名称" prop="htName">
							<el-input v-model="editForm.htName"></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="合同编号" prop="htSn">
							<el-input v-model="editForm.htSn"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="签约主体" prop="htPartyName">
							<el-input v-model="editForm.htPartyName"></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="合同生效日期" prop="htEffectDate">
							<el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.htEffectDate"> </el-date-picker>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row> 
					<el-col :span="12">
						<el-form-item label="合同总金额" prop="htGrossAmount">
							<el-input @change="amountChange('htGrossAmount')"   v-model="editForm.htGrossAmount">
								<template slot="prepend">￥</template>
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
					</el-col>  
					<el-col :span="12">
						<el-form-item label="成本中心" prop="cbCenterId"> 
							<el-input suffix-icon="el-icon-search" @focus="visibleDeptSelect=true" v-model="editForm.cbCenterName"></el-input>
						</el-form-item>
					</el-col> 
				</el-row>  
				<el-row>
					<el-col :span="12">
						<el-form-item label="负责人" prop="htFzUsername">
							<el-input v-model="editForm.htFzUsername"> </el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="合同类型">
							<span >{{editForm.htTypeName}}</span>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="签订日期" prop="htSignDate">
							<el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.htSignDate"> </el-date-picker>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="到期日期" prop="htExpireDate">
							<el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="editForm.htExpireDate"> </el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="合同状态" prop="htStatus">
							<el-select clearable size="mini" v-model="editForm.htStatus">
                                 <el-option
                                    v-for="item in dicts.contractStatus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                            </el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="需求说明" prop="htDemand">
							<el-input type="textarea" :rows="4" v-model="editForm.htDemand"> </el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="合同重要条款" prop="htImportantClause">
							<el-input type="textarea" :rows="4" v-model="editForm.htImportantClause"> </el-input>
						</el-form-item> 
					</el-col>
				</el-row>

				<line-components text="相对方信息"></line-components>

				<el-row>
					<el-col :span="24">
						<el-form-item label="客户名称" prop="cpName">
							<el-input v-model="editForm.cpName"> </el-input>
						</el-form-item> 
					</el-col> 
				</el-row>   
				<el-row>
					<el-col :span="12">
						<el-form-item label="客户法人" prop="cpFddb">
							<el-input v-model="editForm.cpFddb"> </el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="12">
						<el-form-item label="纳税人识别号" prop="cpGszch">
							<el-input v-model="editForm.cpGszch"> </el-input>
						</el-form-item> 
					</el-col>  
				</el-row>  
				<el-row>
					<el-col :span="12">
						<el-form-item label="开户行" prop="cpOpenBank">
							<el-input v-model="editForm.cpOpenBank"> </el-input>
						</el-form-item> 
					</el-col>

					<el-col :span="12">
						<el-form-item label="账号" prop="cpBankAccount">
							<el-input v-model="editForm.cpBankAccount"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					
					<el-col :span="12">
						<el-form-item label="联系人" prop="linkName">
							<el-input v-model="editForm.linkName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系方式" prop="linkPhone">
							<el-input v-model="editForm.linkPhone"> </el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="24">
						<el-form-item label="通讯地址" prop="cpAddress">
							<el-input v-model="editForm.cpAddress"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<line-components text="开票信息"></line-components>
				<el-row> 
					<el-col :span="12">
						<el-form-item label="开票类型" prop="invoiceType">
							<el-select clearable style="width:100%;" v-model="editForm.invoiceType" placeholder="请选择">
								<el-option
									v-for="item in invoiceTypeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="税率" prop="invoicePoint">
							<el-input type="number" min="1" max="100" style="width:80%;" v-model="editForm.invoicePoint"> </el-input>&nbsp;&nbsp;%
						</el-form-item> 
					</el-col>
				</el-row>  
			</el-form>
		</el-row>
		
               
               <el-dialog append-to-body title="成本中心" width="50%" top="5vh"  :visible.sync="visibleDeptSelect" >
                  <dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
               </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editContractCard } from '@/api/oa/ht/contractCard';
	import LineComponents from '../components/LineComponents';
	import { mapGetters } from 'vuex'
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import DeptTree from '@/views/mdp/sys/dept/DeptTree';
	
	//金额正则
	var amountReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['contractCard','visible'],
		watch: {
	      'contractCard':function( contractCard ) {
	        this.editForm = Object.assign({},contractCard);
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					title: [
							{ required: true, message: '标题不能为空', trigger: 'change' }
					],

					cpName: [
					{ required: true, message: '客户名称不能为空', trigger: 'change' }
					],

					htPartyName: [
					{ required: true, message: '签约主体不能为空', trigger: 'change' }
					],

					linkPhone: [
					{ required: true, message: '客户联系人电话不能为空', trigger: 'change' }
					], 
					cbCenterId:[
					{ required: true, message: '成本中心不能为空', trigger: 'change' }
					],

					htGrossAmount:[
					{ required: true, message: '合同总金额不能为空', trigger: 'change' }
					],

					invoiceType:[
					{ required: true, message: '税种不能为空', trigger: 'change' }
					],

					invoicePoint:[
					{ required: true, message: '税率不能为空', trigger: 'change' }
					],
				},
				//编辑界面数据  ContractCard ht_contract_card
				editForm: {
					htId:'',draftId:'',cpId:'',cpName:'',linkName:'',linkPhone:'',cpAddress:'',cpOpenBank:'',cpBankAccount:'',htName:'',htSn:'',htGrossAmount:'',htKaiPiaoAmount:'',htReceivedAmount:'',htReceivableAmount:'',htPayedAmount:'',htPayableAmount:'',htFile:'',htEffectDate:'',htFzUserid:'',htFzUsername:'',htParentType:'',htType:'',htSignDate:'',htExpireDate:'',htStatus:'',htDemand:'',htParty:'',htPartyName:'',htImportantClause:'',branchId:'',createTime:'',createUserId:'',createUserName:'',cbCenterId:'',cbCenterName:'',invoiceType:'',invoicePoint:'',cpGszch:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				conditionData: [],
				proData: [], 
				cbData: [],
				conditionStatus1Option:[
					{
						label: '初始',
						value: '0',
					},
					{
						label: '待收款',
						value: '1',
					},
					{
						label: '已收款',
						value: '2',
					}
				],
				conditionStatus0Option:[
					{
						label: '初始',
						value: '0',
					},
					{
						label: '待付款',
						value: '1',
					},
					{
						label: '已付款',
						value: '2',
					}
				],
				invoiceTypeOptions: [																																		
					{
						label: '增值税专业发票',
						value: '1',
					},
					{
						label: '增值税普通发票',
						value: '2',
					},
					{
						label: '其它',
						value: '3',
					}
				],
				dicts:{
					costType:[ 
					],
					productType:[ 
					],
					amountType:[   
					],
					contractStatus:[

					]
				}, 
				 visibleDeptSelect:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交ContractCard ht_contract_card父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				if(this.contractCard.bizFlowState=='1'||this.editForm.bizFlowState=='1'){
					this.$message({ message:"审核中数据不允许修改提交", type: 'error' }); 
					return;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editContractCard(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit', this.editForm);//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}else{
						this.$message({ message: "表单验证不通过，请修改后提交", type: 'error' }); 
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			addRow(type) {
				switch(type) {
					case 'pro':
					this.proData.push(
						{
							productName : '',
							productSpec : '',
							productMeasUnit : '',
							productPrice: '',
							productNum : '',
							productGrossAmount: '',
							isThirdParty: '0',
						}
					)
					break;
					case 'thirdParty' :
					this.thirdPartyData.push(
						{
							productName : '',
							productType : '',
							productSpec : '',
							productMeasUnit : '',
							productPrice: '',
							productNum : '',
							productGrossAmount: '',
							isThirdParty: '1',
						}
					)
					break;
					case 'cb' :
					this.cbData.push({
						cbType: '',
						cbMandayAmount: '',
					})
					break;
					case 'condition':
						var dct="";
						if(this.editForm.htParentType=='1'){
							dct="1"
						}else{
							dct="0"
						}
					this.conditionData.push(
						{  
							conditionType: '1',
							conditionTiaoJian: '',
							conditionRatio: '50',
							conditionAmount: '',
							conditionRemark: '',
							conditionStatus:'0',
							dct:dct
						}
					)
					break;
				}
			},

			delRow(type, index) {
				switch(type) {
					case 'pro':
					this.proData.splice(index, 1);
					break;
					case 'thirdParty' :
					this.thirdPartyData.splice(index, 1);
					break;
					case 'cb' :
					this.cbData.splice(index, 1);
					break;
					case 'condition':
					this.conditionData.splice(index, 1);
					break;
				}
			},

			validateAmount(value) {
				if(this.isNull(value)) {return null;}
				if(amountReg.test(value)) {
					return value;
				}else {
					return null;
				}
			},

			isNull(obj) {
				if(obj === null || obj === '' || obj === undefined) {
					return true;
				}
				return false;
			},
			
			amountChange(type) {
				switch(type) {
					case 'htGrossAmount':
						this.editForm.htGrossAmount = this.validateAmount(this.editForm.htGrossAmount);
					break;
				}
			},

			initData(){
				this.editForm=Object.assign(this.editForm, this.contractCard);
				this.cbData = this.contractCard.cbList;
				this.conditionData = this.contractCard.conditionList;
				this.proData = this.contractCard.productList;
			},
			getDeptData(data) {
				this.visibleDeptSelect = false;
				this.editForm.cbCenterId = data.deptid;
				this.editForm.cbCenterName = data.deptName;
				this.$refs['editForm'].validateField('cbCenterId');
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			'line-components' : LineComponents,
			DeptTree,
		},
		mounted() {
			initSimpleDicts('all',['costType','amountType','productType','contractStatus']).then(res=>this.dicts=res.data.data); 
			this.initData();
		}
	}

</script>

<style scoped>

.app-container {
   margin: 0;
   padding: 0 40px;
}
 



</style>