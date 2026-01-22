<template>
	<section> 
		<el-row class="page-container border padding">

			<el-row>
				<div>
					<el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button type="primary" size="small" @click="editSubmit('hold')">暂存</el-button>
					<el-button type="primary" size="small" @click="editSubmit('submit')">提交</el-button>
				</div>
    			<el-divider content-position="center">资产盘点任务</el-divider>
			</el-row>

			<!--新增界面 AssetInventoryTask ass_asset_inventory_task--> 
			<el-form :model="editForm"  label-width="120px" :rules="addFormRules" ref="editForm">

				<el-row>
					<el-form-item label="盘点任务名称" prop="reqTitle">
						<el-input v-model="editForm.reqTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="盘点任务单"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="编号">
							<el-input disabled placeholder="系统自动生成"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="申请人" prop="reqUsername">
							<el-input readonly v-model="editForm.reqUsername"></el-input>
						</el-form-item>
					</el-col>
				
                    <el-col :span="12">
						<el-form-item label="申请日期">
							<el-date-picker
                                readonly
								type="date"
								v-model="editForm.reqDate"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="分配用户" prop="allocationType">
							<el-select v-model="editForm.allocationType" placeholder="请选择">
								<el-option
									v-for="item in allocationTypeArr"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				
                    <el-col :span="12" v-show="allocationUserVisible">
						<el-form-item label="用户">
							<el-input v-model="showUserNameMsg" @focus="visibleUserSelect=true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="12">
						<el-form-item label="资产类别" prop="categoryName">
							<el-input clearable @focus="selectAssetTypeVisible=true"  v-model="editForm.categoryName"></el-input>
						</el-form-item>
					</el-col>
				
                    <el-col :span="12">
						<el-form-item label="存放地点类别" prop="warehouseName">
							<el-input clearable @focus="visibleWarehouseSelect=true"  v-model="editForm.warehouseName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row>
					<el-col :span="12">
						<el-form-item label="采购时间" prop="purchasedateType">
							<el-select v-model="editForm.purchasedateType" placeholder="请选择">
								<el-option
									v-for="item in purchasedateTypeArr"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				
                    <el-col :span="12">
						<el-row v-show="purchasedateVisible">
							<el-form-item label="时间区间" prop="timeSection">
								<el-date-picker
									v-model="timeSection"
									type="daterange"
									range-separator="至"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
									>
								</el-date-picker>	
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>


				<el-row>
					<el-button type="primary" size="mini" @click="showCard">点击查看范围</el-button>
				</el-row>

				<el-row class="mt">
					<el-table v-loading="load.list" size="small" border :data="assetData" stripe>
						<el-table-column
							label="序号"
							type="index"
							width="50">
						</el-table-column>

						<el-table-column prop="cardStatus"  align="center" label="资产状态" width="">
							<template slot-scope="scope">
                            <span>{{cardStatusArr[parseInt(scope.row.cardStatus)]}}</span>
						</template>
						</el-table-column>
					
						<el-table-column prop="assetSn"  align="center" label="资产编码" width="">
						</el-table-column>

						<el-table-column prop="assetName"  align="center" label="资产名称" width="">
						</el-table-column>

						<el-table-column prop="categoryName"  align="center" label="资产类别" width="">
						</el-table-column>

						<el-table-column prop="spec"  align="center" label="规格型号" width="">
						</el-table-column>

						<el-table-column prop="personLiableUsername"  align="center" label="责任人" width="">
						</el-table-column>

						<el-table-column   align="center" label="链接" width="">
							<template slot-scope="scope">
								<span class="seeDetails" @click="gotoDetail(scope.row)">查看详情</span>
							</template>
						</el-table-column>

						<el-table-column   align="center" label="操作" width="">
							<template slot-scope="row">
								<i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-row>

				<el-row style="margin-top: 20px">
					<el-form-item label="备注" prop="reqReason">
						<el-input type="textarea" v-model="editForm.reqReason" :rows="4"></el-input>
					</el-form-item>
				</el-row>

				<el-row style="margin-top: 20px">
					<el-form-item label="上传">
						<attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
					</el-form-item>
				</el-row>
			</el-form>
		</el-row>


		<el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
            <user-select @confirm="getUserData"></user-select>
        </el-dialog>

		<el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
			<warehouse-components @row-click="getWarehouseData"></warehouse-components>
		</el-dialog>

		<el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="selectAssetTypeVisible" :close-on-click-modal="false">
			<asset-category-tree @node-click="getSelectAssetTypeData" @cancel="selectAssetTypeVisible=false" ></asset-category-tree>
		</el-dialog>

		<el-dialog append-to-body title="资产卡片" center :fullscreen="true"  :visible.sync="assetCardVisible" :close-on-click-modal="false">
			<asset-card-show :asset-detail="assetCardData" :visible="assetCardVisible" @submit="assetCardVisible=false" ></asset-card-show>
		</el-dialog>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editAssetInventoryTask, getTaskDetail, getCanOperTaskUser} from '@/api/oa/erp/ass/assetInventoryTask';
	import { getInventoryCards } from '@/api/oa/erp/ass/assetCard';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import {sn} from '@/common/js/sequence'; //id生成器
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
	import WarehouseComponents from '../../stk/components/WarehouseComponents';
	import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
	import AssetCardShow from '../assetCard/AssetCardShow';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['assetInventoryTask','visible'],
		watch: {
	      'assetInventoryTask':function( assetInventoryTask ) {
	        this.editForm = assetInventoryTask;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.setDefaultParam();
	      	}
		  },
		  
		  editForm: {
                handler:function(val, oldval) {
					val.purchasedateType === '2' ? this.purchasedateVisible = true : this.purchasedateVisible = false;
					val.allocationType !== '1' &&  !this.isNull(val.allocationType)? this.allocationUserVisible = true : this.allocationUserVisible = false;
                },
                deep:true
            }

	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					taskId: [
						//{ required: true, message: '盘点任务id不能为空', trigger: 'change' }
					],

					reqTitle: [
						{ required: true, message: '盘点任务名称不能为空', trigger: 'change' }
					],

					allocationType: [
						{ required: true, message: '分配用户不能为空', trigger: 'change' }
					],

					purchasedateType: [
						{ required: true, message: '采购时间不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 ass_asset_inventory_task
				editForm: {
					taskId:'',reqUsername:'',reqDeptid:'',reqDeptName:'',reqTitle:'',reqBranchId:'',reqBranchName:'',reqDate:'',allocationType:'',categoryId:'',categoryName:'',warehouseId:'',warehouseName:'',purchasedateType:'',startTime:'',endTime:'',taskStatus:'',reqStatus:'',reqReason:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				assetData: [],
				uploadArchiveId: '',
				uploadCategoryId: '',
				//分配用户选择
				allocationTypeArr: [
					{
						label: '资产责任人盘点',
						value: '1',
					},
					
					{
						label: '资产责任人盘点与指定盘点人员',
						value: '2',
					},

					{
						label: '仅指定盘点人员',
						value: '3',
					}
				],

				//分配用户显示
				allocationUserVisible: false,
				purchasedateTypeArr: [
					{
						label: '不限',
						value: '1',
					},
					
					{
						label: '指定时间范围',
						value: '2',
					},
				],
				purchasedateVisible: false,
				timeSection: [],
				visibleUserSelect: false,
				visibleWarehouseSelect: false,
				selectAssetTypeVisible: false,
				//查询数据
				personLiableUseridArr: [],	
				cardStatusArr: ['闲置', '在用', '借用', '维修', '报废', '调拨', '处置'],

				//资产卡片展示
				assetCardVisible: false,
				assetCardData: '',

				//用盘点权限的用户数据
				showUserNameMsg: '',
				userData: [],


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},

			//新增提交AssetInventoryTask ass_asset_inventory_task 父组件监听@submit="afterAddSubmit"
			editSubmit: function (status) {
				this.editForm.reqStatus = status;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							if(!this.isNull(this.editForm.reqDate) && this.editForm.reqDate instanceof Date) {
								this.editForm.reqDate = util.formatDate(this.editForm.reqDate, "yyyy-MM-dd HH:mm:ss")
							}
							let params = Object.assign({}, this.transfreData()); 
							editAssetInventoryTask(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			transfreData() {

				//1.获取有盘点权限的用户数据。
				let inventoryUserData = [];
				
				//2.获取关联资产卡片的数据
				let inventoryTaskDetail = [];

				if(this.editForm.allocationType === '1') {
					this.assetData.forEach(d => {
						if(this.isNull(d.personLiableUserid)) return;
						let param = {
							inventoryUserid : d.personLiableUserid,
							inventoryUsername : d.personLiableUsername
						}
						inventoryUserData.push(param);
					})
				}

				if(this.editForm.allocationType === '2') {
					this.assetData.forEach(d => {
						if(this.isNull(d.personLiableUserid)) return;
						let param = {
							inventoryUserid : d.personLiableUserid,
							inventoryUsername : d.personLiableUsername
						}
						inventoryUserData.push(param);
					})
					
					this.userData.forEach(a => {
						if(this.isNull(a.inventoryUserid)) return;
						let param = {
							inventoryUserid : a.inventoryUserid,
							inventoryUsername :  a.inventoryUsername
						}
						inventoryUserData.push(param);
					})
				}

				if(this.editForm.allocationType === '3') {
					inventoryUserData = this.userData;
				}

				let hash = {}; 
				inventoryUserData = inventoryUserData.reduce((preVal, curVal) => {
					hash[curVal.inventoryUserid] ? '' : hash[curVal.inventoryUserid] = true && preVal.push(curVal); 
					return preVal 
				}, [])

				this.assetData.forEach(a => {
					let param = {
						cardId: a.cardId,
						nowCardName: a.assetName
					}
					inventoryTaskDetail.push(param);
				})

				let param = {
					inventoryUserDatas: inventoryUserData,
					inventoryTaskDetails: inventoryTaskDetail,
					inventoryTask: this.editForm
				}

				return param;
			},

			//删除一行
			delRow(index) {
				this.assetData.splice(index, 1);
			},

			//查看详情
			gotoDetail(row) {
				this.assetCardData = row;
				Object.assign(this.assetCardData, row);
				this.assetCardVisible = true;
			},

			//获取用户数据
			getUserData(data) {
				
				if(!this.isNull(data)) {
					data.forEach(d => {
						let param = {
							inventoryUserid : d.userid,
							inventoryUsername :  d.username
						}
						this.showUserNameMsg += d.username + ","
						this.userData.push(param);
					})
				}

				this.visibleUserSelect = false;

			},

			//获取选择的仓库数据
			getWarehouseData(data) {
				this.editForm.warehouseId = data.id;
				this.editForm.warehouseName = data.name;
				this.visibleWarehouseSelect = false;
			},

			getSelectAssetTypeData(data) {
				this.editForm.categoryId = data.categoryId;
				this.editForm.categoryName = data.categoryName
				this.selectAssetTypeVisible = false;
			},

			//查询卡片
			showCard() {
				this.load.list = true;
				let params = {
					//采购开始时间
					startTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate(this.timeSection[0], "yyyy-MM-dd HH:mm:ss") : '',
					//采购结束时间
					endTime: (!this.isNull(this.timeSection) && this.timeSection.length !== 0) ? util.formatDate(this.timeSection[1], "yyyy-MM-dd HH:mm:ss") : '',
					//分类
					categoryId: this.editForm.categoryId,
					warehouseId: this.editForm.warehouseId,
					//用户Id
					allocationType: this.editForm.allocationType
				}
                getInventoryCards(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){ 
						this.assetData = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//设置默认参数
			setDefaultParam() {
				let user = this.userInfo;
				this.editForm=Object.assign(this.editForm, this.assetInventoryTask);  
				this.uploadArchiveId = this.editForm.taskId;
				this.uploadCategoryId = 'asset_inventory_task_upload';
				//查询该任务单的明细
				this.getTaskDetails();
				this.selectCanOperUser();
			},

			getTaskDetails() {
				let params = {
					detailStatusArr: "",
					taskId: this.editForm.taskId
				};
                //查询申购单明细
                this.load.list = true;
				getTaskDetail(params).then((res) => {
					var tips = res.data.tips;
					if(tips.isOk){
						this.assetData = res.data.data;
					}
                    this.load.list = false;
				}).catch();
			},


			//可以操作的用户
			selectCanOperUser() {
				let params = {
					taskId: this.editForm.taskId,
				}
                //查询申购单明细
				getCanOperTaskUser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.showUserNameMsg = '';
						this.userData = [];
						if(res.data.data !== null && res.data.data.length > 0) {
							res.data.data.forEach(r => {
								this.showUserNameMsg += r.inventoryUsername + ",";
								let param = {
										inventoryUserid : r.userid,
										inventoryUsername :  r.username
								}
								this.userData.push(param);
							})
						}
					}
				}).catch();
			},



            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},
			

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'asset-inventory-task-edit':AssetInventoryTaskEdit
			'attachment-upload': AttachmentUpload,
			'user-select' : UsersSelect,
			'warehouse-components' : WarehouseComponents,
			'asset-category-tree' : AssetCategoryTree,
			'asset-card-show' : AssetCardShow,
		},

		mounted() {
			/**在下面写其它函数***/
			this.setDefaultParam();
			
		}//end mounted
	}

</script>

<style scoped>

.mt {
	margin-top: 20px
}

.seeDetails {
	text-decoration: underline;
	cursor: pointer; 
	color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover{
    color: rgba(10, 69, 169, 0.6);
}
</style>