<template>
	<section>
		<el-row class="page-container border padding">  
				
                  <el-table size="small" border :data="contractConditions" stripe>
                     <el-table-column
                           label="序号"
                           type="index"
                           width="50">
                     </el-table-column>

                     <el-table-column align="center" label="款项类别" min-width="100">  
                           <template slot-scope="row">
                              <el-select clearable size="mini" v-model="contractConditions[row.$index].conditionType">
                                 <el-option
                                    v-for="item in dicts.amountType"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                 </el-option>
                              </el-select>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="editForm.htParentType=='1'?'回款条件':'付款条件'" min-width="120" >
                           <template slot-scope="row">
                        <el-input size="mini" v-model="contractConditions[row.$index].conditionTiaoJian"> </el-input>
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="editForm.htParentType=='1'?'回款比例%':'付款比例%'"  min-width="80">
                           <template slot-scope="row">
                              <el-input-number size="mini" controls-position="right" @change="onConditionRatioChange(row.row)" v-model="contractConditions[row.$index].conditionRatio" :min="0" :step="1" :disabled="row.row.conditionStatus=='2'"></el-input-number>%
                           </template>
                     </el-table-column>

                     <el-table-column  align="center" :label="editForm.htParentType=='1'?'应收金额':'应付金额'"  min-width="100">
                           <template slot-scope="row">
                              ￥<el-input-number size="mini" controls-position="right" v-model="contractConditions[row.$index].conditionAmount" :min="0" :step="1" :disabled="row.row.conditionStatus=='2'"></el-input-number>
                           </template>
                     </el-table-column>

                     <el-table-column  align="left" :label="editForm.htParentType=='1'?'收款状态':'付款状态'"  min-width="80">
                        <template slot-scope="row">
                           <el-select disabled v-if="editForm.htParentType=='1'" size="mini" style="padding:5px;" v-model="contractConditions[row.$index].conditionStatus" placeholder="请选择">
                              <el-option
                                 v-for="item in conditionStatus1Option"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                              </el-option>
                           </el-select>
						   <el-select disabled v-else size="mini" style="padding:5px;" v-model="contractConditions[row.$index].conditionStatus" placeholder="请选择">
                              <el-option
                                 v-for="item in conditionStatus0Option"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                              </el-option>
                           </el-select>
                        </template>
                     </el-table-column>

                     <el-table-column align="center"  width="80">
                        <template slot="header">
                           <i class="el-icon-circle-plus-outline"  @click="addRow('condition');"></i>
                        </template>
                        <template slot-scope="row">
                           <i class="el-icon-remove-outline" @click="delRow('condition', row.$index)"></i>
                        </template>
                     </el-table-column>
                  </el-table>
					<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
					@size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
					:page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { batchSaveCondition,listContractCondition } from '@/api/oa/ht/contractCondition';
	import LineComponents from '../components/LineComponents';
	import { mapGetters } from 'vuex'
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	
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
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.initData();
	      	}
		  }
		   
	    },
		data() {
			return { 
				filters: {
					key: ''
				},
 				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}, 
				editFormRules: {
					htId: [
						//{ required: true, message: '合同id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  ContractCard ht_contract_card
				editForm: {
					htId:'',draftId:'',cpId:'',cpName:'',linkName:'',linkPhone:'',cpAddress:'',cpOpenBank:'',cpBankAccount:'',htName:'',htSn:'',htGrossAmount:'',htKaiPiaoAmount:'',htReceivedAmount:'',htReceivableAmount:'',htPayedAmount:'',htPayableAmount:'',htFile:'',htEffectDate:'',htFzUserid:'',htFzUsername:'',htParentType:'',htType:'',htSignDate:'',htExpireDate:'',htStatus:'',htDemand:'',htParty:'',htPartyName:'',htImportantClause:'',branchId:'',createTime:'',createUserId:'',createUserName:'',cbCenterId:'',cbCenterName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				contractConditions: [],  
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
				 
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getContractConditions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getContractConditions();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getContractConditions();
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交ContractCard ht_contract_card父组件监听@submit="afterEditSubmit"
			editSubmit: function () { 
				this.$confirm('确认提交吗？', '提示', {}).then(() => { 
					this.load.edit=true
					let params={
						htId:this.contractCard.htId,
						contractConditions:this.contractConditions
					}
					batchSaveCondition(params).then((res) => {
						this.load.edit=false
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchContractConditions();
							this.$emit('submit', params);//  @submit="afterEditSubmit"
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err =>this.load.edit=false);
				});  
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			addRow(type) {
				switch(type) {
					case 'pro':
					this.contractConditions.push(
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
						if(this.contractCard.htParentType=='1'){
							dct="1"
						}else{
							dct="0"
						}
						var conditionAmount=this.contractCard.htGrossAmount*50/100
					this.contractConditions.push(
						{  
							conditionType: '1',
							conditionTiaoJian: '',
							conditionRatio: '50',
							conditionAmount: conditionAmount,
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
					this.contractConditions.splice(index, 1);
					break;
					case 'thirdParty' :
					this.thirdPartyData.splice(index, 1);
					break;
					case 'cb' :
					this.cbData.splice(index, 1);
					break;
					case 'condition':
					this.contractConditions.splice(index, 1);
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
				this.searchContractConditions();
			},
			searchContractConditions(){
				 this.pageInfo.count=true; 
				 this.getContractConditions();
			},
			//获取列表 ContractCondition 项目合同关联关系表
			getContractConditions() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key=this.filters.key
				}

				params.htId=this.contractCard.htId

				this.load.list = true;
				listContractCondition(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.contractConditions = res.data.data;
					}else{
						this.$message({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			onConditionRatioChange(row){
				row.conditionAmount=row.conditionRatio*this.contractCard.htGrossAmount/100
			}
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			'line-components' : LineComponents,
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

.primaryText {
	text-decoration: underline;
	color: royalblue;
	cursor: pointer !important;
}



</style>