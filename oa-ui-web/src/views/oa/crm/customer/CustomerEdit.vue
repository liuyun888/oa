<template>
	<section>
		<el-row class="container"  >
			<el-form :model="editForm"  label-width="120px" :rules="addFormRules" ref="editForm">
				<!-- <el-collapse v-model="activeNames" @change="handleChange"> -->
					<!-- <el-collapse-item title="一般" name="1"> -->
						
						<el-row>
							<el-col :span="12">
								<el-form-item label="客户名称" prop="customerName">
									<el-input v-model="editForm.customerName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="客户编码" prop="customerCode">
									<el-input v-model="editForm.customerCode"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>

							<el-col :span="12">
								<el-form-item label="客户简称" prop="customerEngName">
									<el-input v-model="editForm.customerEngName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="所在地区" prop="addressName">
									<el-input @focus="addressVisible=true" v-model="addressName"></el-input>
									<div class="addressPosition" v-if="addressVisible">
										<region-components @get-data="getAddressData($event)" size="3" @hide="addressVisible=false" :visible="addressVisible"></region-components>
									</div>
								</el-form-item>
							</el-col>
							
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="邮政编码" prop="zipCode">
									<el-input v-model="editForm.zipCode"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="公司地址" prop="address">
									<el-input v-model="editForm.address"></el-input>
								</el-form-item>
							</el-col>

						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="电话" prop="phone">
									<el-input v-model="editForm.phone"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="语言" prop="language">									
									<el-select @change="changeLanguage" v-model="editForm.languageName" placeholder="请选择">
										<el-option
											v-for="item in languageOptions"
											:key="item.optionValue"
											:label="item.optionName"
											:value="{value:item.optionValue, label:item.optionName}">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>

							<el-col :span="12">
								<el-form-item label="电子邮件" prop="email">
									<el-input v-model="editForm.email"></el-input>
								</el-form-item>
							</el-col>
							

							<el-col :span="12">
								<el-form-item label="传真" prop="fax">
									<el-input v-model="editForm.fax"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="网站" prop="fax">
									<el-input v-model="editForm.website"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="介绍" prop="introduction">
									<el-input type="textarea" :rows="2" v-model="editForm.introduction"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

					<!-- </el-collapse-item> -->
					<!-- <el-collapse-item title="分类信息" name="2"> -->

						<el-row>
							<el-col :span="12">
								<el-form-item label="状态" prop="customerStatusName">
									<el-input @focus="customerStatusVisible=true" v-model="editForm.customerStatusName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="类型" prop="customerType">
									<span>{{editForm.customerTypeName}}</span>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="描述" prop="descriptionName">
									<el-input @focus="customerDescriptVisible=true" v-model="editForm.descriptionName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="规模" prop="sizeName">
									<el-input @focus="customerSizeVisible=true" v-model="editForm.sizeName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="获得途径" prop="sourceName">
									<el-input @focus="customerSourceVisible=true" v-model="editForm.sourceName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="行业" prop="sectorName">
									<el-input @focus="customerIndustryVisible=true" v-model="editForm.sectorName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="客户经理" prop="managerUserName">
									<el-input @focus="customerUserVisible=true" v-model="editForm.managerUserName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="中介机构" prop="agentName">
									<el-input @focus="zjjgVisible=true" v-model="editForm.agentName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="上级单位" prop="parentName">
									<el-input @focus="sjdwVisible = true" v-model="editForm.parentName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="文档" prop="customerDocName">
									<el-input @focus="openDocSelect" v-model="editForm.customerDocName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="背景资料" prop="customerIntroductiondocName">
									<el-input @focus="openIndocSelect" v-model="editForm.customerIntroductiondocName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="安全级别" prop="securityLevelName">
									<el-select @change="changeSecurityLevel" v-model="editForm.securityLevelName" placeholder="请选择">
										<el-option
											v-for="item in securityLevelOptions"
											:key="item.optionValue"
											:label="item.optionName"
											:value="{value:item.optionValue, label:item.optionName}">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="客户价值" prop="evaluation">
									<el-input readonly v-model="editForm.evaluation"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="级别" prop="rating">
									<el-input v-model="editForm.rating"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="门户状态" prop="portalStatus">
									<span>{{editForm.portalStatus === '0' ? '未开通' : '已开通'}}</span>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="信用额度" prop="creditAmount">
									<el-input v-model="editForm.creditAmount"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="信用期间" prop="creditTime">
									<el-input v-model="editForm.creditTime"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="开户银行" prop="bankName">
									<el-input v-model="editForm.bankName"></el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="账户" prop="accountName">
									<el-input v-model="editForm.accountName"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item label="银行账户" prop="accounts">
									<el-input v-model="editForm.accounts"></el-input>
								</el-form-item>
							</el-col>
						</el-row>

					<!-- </el-collapse-item> -->

					<!-- <el-collapse-item title="联系人" name="4"> -->
						
						<span>提示: 系统默认第一行为主联系人</span>
						<el-table v-loading="load.list" style="margin-top: 10px" size="small" border :data="contacterData" stripe>
							<el-table-column
								label="序号"
								type="index"
								width="50">
							</el-table-column>
						
							<el-table-column align="center" label="姓名" width="">
								<template slot-scope="row">
									<span class="vTip">*</span>
									<el-input @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'one')" v-model="contacterData[row.$index].contacterName"> </el-input>
									<div v-show="contacterData[row.$index].validate.oneShow">
										<i class="el-icon-warning"></i>
										<span class="tipMsg">{{contacterData[row.$index].validate.oneMsg}}</span>
									</div>
								</template>
							</el-table-column>

							<el-table-column align="center" label="称呼" width="">
								<template slot-scope="row">
									<span class="vTip">*</span>
									<el-input @blur="validateParam(row.$index, 'two')"   @focus="openCallDialog(row.$index)"  v-model="contacterData[row.$index].titleName"> </el-input>
									<div v-show="contacterData[row.$index].validate.twoShow">
										<i class="el-icon-warning"></i>
										<span class="tipMsg">{{contacterData[row.$index].validate.twoMsg}}</span>
									</div>
								</template>
							</el-table-column>

							<el-table-column align="center" label="岗位" width="">
								<template slot-scope="row">
									<span class="vTip">*</span>
									<el-input  @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'three')" v-model="contacterData[row.$index].jobTitle"> </el-input>
									<div v-show="contacterData[row.$index].validate.threeShow">
										<i class="el-icon-warning"></i>
										<span class="tipMsg">{{contacterData[row.$index].validate.threeMsg}}</span>
									</div>
								</template>
							</el-table-column>

							<el-table-column align="center" label="电子邮件" width="">
								<template slot-scope="row">
									<el-input  @focus="currentIndex = row.$index" v-model="contacterData[row.$index].contacterEmail"> </el-input>
								</template>
							</el-table-column>

							<el-table-column align="center" label="办公室电话" width="">
								<template slot-scope="row">
									<el-input  @focus="currentIndex = row.$index" v-model="contacterData[row.$index].phoneOffice"> </el-input>
								</template>
							</el-table-column>

							<el-table-column align="center" label="住宅电话" width="">
								<template slot-scope="row">
									<el-input  @focus="currentIndex = row.$index" v-model="contacterData[row.$index].phoneHome"> </el-input>
								</template>
							</el-table-column>

							<el-table-column align="center" label="移动电话" width="">
								<template slot-scope="row">
									<el-input  @focus="currentIndex = row.$index" v-model="contacterData[row.$index].mobilePhone"> </el-input>
								</template>
							</el-table-column>

							<el-table-column align="center" label="主联系人" width="80">
								<template slot-scope="row">
									<el-checkbox true-label="1" false-label="0"  @change="mainChange($event, row.$index)" v-model="contacterData[row.$index].isMain"></el-checkbox>
								</template>
							</el-table-column>

							<el-table-column align="center"  width="80">
								<template slot="header">
									<i class="el-icon-circle-plus-outline"  @click="addRow"></i>
								</template>

								<template slot-scope="scope">
									<i v-if="scope.row.isShowDel" class="el-icon-remove-outline" @click="delRow(scope.$index)"></i>
								</template>
							</el-table-column>
						</el-table>
					<!-- </el-collapse-item> -->
				<!-- </el-collapse> -->
			</el-form>
		</el-row>


		<!-- 查询客户类型 -->
		<el-dialog append-to-body title="状态" top="2vh" :visible.sync="customerStatusVisible" width="50%" :close-on-click-modal="false">
			<customer-base-data-components @getRowClick="getRowClickData" :visible="customerStatusVisible" :type="statusType">
			</customer-base-data-components>
		</el-dialog>

		<el-dialog append-to-body title="描述" top="2vh" :visible.sync="customerDescriptVisible" width="50%" :close-on-click-modal="false">
			<customer-base-data-components @getRowClick="getRowClickData" :visible="customerDescriptVisible" :type="descriptionType">
			</customer-base-data-components>
		</el-dialog>

		<el-dialog append-to-body title="规模" top="2vh" :visible.sync="customerSizeVisible" width="50%" :close-on-click-modal="false">
			<customer-base-data-components @getRowClick="getRowClickData" :visible="customerSizeVisible" :type="sizeType">
			</customer-base-data-components>
		</el-dialog>

		<el-dialog append-to-body title="获取途径" top="2vh" :visible.sync="customerSourceVisible" width="50%" :close-on-click-modal="false">
			<customer-base-data-components @getRowClick="getRowClickData" :visible="customerSourceVisible" :type="sourceType">
			</customer-base-data-components>
		</el-dialog>

		<el-dialog append-to-body title="行业"  top="2vh" :visible.sync="customerIndustryVisible" width="50%" :close-on-click-modal="false">
			<div class="industry">
				<customer-industry-tree @node-click="getIndustryRow" :refresh="true"></customer-industry-tree>
			</div>
		</el-dialog>

		<el-dialog append-to-body @close="selectCallClose" title="称呼"  top="2vh" :visible.sync="customerCallVisible" width="50%" :close-on-click-modal="false">
			<customer-base-data-components @getRowClick="getRowClickData" :visible="customerCallVisible" :type="callType">
			</customer-base-data-components>
		</el-dialog>

        <el-dialog append-to-body  title="客户经理" width="70%" top="2vh" :visible.sync="customerUserVisible">
            <users-select @confirm="getUserData" :isSingleUser="true"></users-select>
        </el-dialog>

		<archive-select-components @get-archive-data="getArchiveData" ref="archiveSelect">
		</archive-select-components>

		<archive-select-components @get-archive-data="getArchiveData2" ref="archiveSelect2">
		</archive-select-components>

		<el-dialog append-to-body title="上级单位"  top="2vh" :visible.sync="sjdwVisible" width="50%" :close-on-click-modal="false">
			<customer-components @getRowClick="getSjdwData"  :visible="sjdwVisible"></customer-components>
		</el-dialog>

		<el-dialog append-to-body title="中介机构"  top="2vh" :visible.sync="zjjgVisible" width="50%" :close-on-click-modal="false">
			<customer-components :customerType="zjjgType" @getRowClick="getZjjgData"  :visible="zjjgVisible"></customer-components>
		</el-dialog>


	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editCustomer} from '@/api/oa/crm/customer';
	import { mapGetters } from 'vuex'
	import CustomerBaseDataComponents from '../components/CustomerBaseDataComponents';
	import CustomerIndustryTree from '../components/CustomerIndustryTree';
	import UsersSelect from '../../../mdp/sys/user/UsersSelect';
	import ArchiveSelectComponents from '../components/ArchiveSelectComponents';
	import CustomerComponents from '../components/CustomerComponents';
	import {listCustomerContacter} from '@/api/oa/crm/customerContacter';
	import RegionComponents from '../components/RegionComponents';
	
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customer','visible'],
		watch: {
		
		  'customer': {
				handler(newval, old) {
					this.editForm = newval;
				},
				// immediate: true,
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
					customerName: [
						{ required: true, message: '客户名称不能为空', trigger: 'tigger' }
					],

					customerEngName: [
						{ required: true, message: '客户简称不能为空', trigger: 'tigger' }
					],

					email: [
						{ required: true, message: '电子邮件不能为空', trigger: 'tigger' }
					],

					address: [
						{ required: true, message: '地址不能为空', trigger: 'tigger' }
					],

					customerStatusName: [
						{ required: true, message: '状态不能为空', trigger: 'tigger' }
					],

					descriptionName: [
						{ required: true, message: '描述不能为空', trigger: 'tigger' }
					],

					sizeName: [
						{ required: true, message: '规模不能为空', trigger: 'tigger' }
					],

					sourceName: [
						{ required: true, message: '来源不能为空', trigger: 'tigger' }
					],

					sectorName: [
						{ required: true, message: '行业不能为空', trigger: 'tigger' }
					],

					managerUserName: [
						{ required: true, message: '客户经理不能为空', trigger: 'tigger' }
					],

				},
				//新增界面数据 crm_customer
				editForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'', languageName: '',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',securityLevel:'',securityLevelName: '', evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				//折叠面板
				activeNames: ['1', '2', '3', '4'],

				//联系人数据
				contacterData: [],
				oldContacterData: [],

				//语言
				languageOptions: [],
				//客户状态显示
				customerStatusVisible: false,
				statusType: 'status',
				//客户描述显示
				customerDescriptVisible: false,
				descriptionType: 'description',
				//客户规模显示
				customerSizeVisible: false,
				sizeType: 'size',
				customerSourceVisible: false,
				sourceType: 'source',
				customerCallVisible: false,
				callType: 'call',
				customerIndustryVisible: false,
				//客户经理选择
				customerUserVisible: false,
				//保密级别
				securityLevelOptions:[],
				//当前
				currentIndex: 0,
				//上级单位显示
				sjdwVisible: false,
				//中介机构
				zjjgVisible: false,
				zjjgType: 'zjjg',
				//客户
				oldCustomer: '',

				//选择区县
				addressVisible: false,
				//地址全程
				addressName: '',
			
				

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},

			//新增提交Customer crm_customer 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				//验证联系人
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						let flag = this.validateData();
						if(!flag) {
							this.$message.error("客户联系人数据未填写完全");
							return
						};
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.transfreData(this.editForm)); 
							editCustomer(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								if(tips.isOk){
									this.$emit('submit', this.editForm);
								}
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			//验证额外数据
			validateData() {

				if(this.contacterData.length <= 0) {
					this.$message.error("客户联系人不能为空");
					return false;
				}


				//验证数据
				this.contacterData.forEach((d, index) => {
					this.validateParam(index, "one");
					this.validateParam(index, "two");
					this.validateParam(index, "three");
				})
				
				let flag = "true";

				this.contacterData.forEach (d => {
					if(d.validate.oneShow) {
						flag = false;
						return flag;
					}
					if(d.validate.twoShow) {
						flag = false;
						return flag;
					}
					if(d.validate.threeShow) {
						flag = false;
						return flag;
					}
                })
                
				if(!flag) {
					return false;
                }
                
                return true;


			},

			transfreData(editForm) {
				let params = {
					customer: editForm,
					contacterList: this.contacterData
				}
				return params;
			},

			handleChange(val) {
			},

			//增加一行
			addRow() {
				this.contacterData.push({
					contacterName: '',
					title: '',
					titleName: '',
					jobTitle: '',
					contacterEmail: '',
					phoneOffice: '',
					phoneHome: '',
					mobilePhone: '',
					isMain: '0',
					isShowDel: true,
					validate: {
						oneShow: false,
						twoShow: false,
						threeShow: false,
						oneMsg: '名称不能为空',
						twoMsg: '称呼不能为空',
						threeMsg: '岗位不能为空',
					}
				})
			},

			//删除一行
			delRow(index) {
				 this.contacterData.splice(index, 1);
			},

			//获取字典数据
			getOption() {
                let params = [
					{ categoryId: "all", itemCode: "language" },
					{ categoryId: "all", itemCode: "secrecyLevel"},
                ];
                listOption(params).then(res => {
					this.languageOptions = res.data.data.language;
					this.securityLevelOptions = res.data.data.secrecyLevel;
                });
			},

			initData() {
				this.getOption();
				// //查询该客户联系人信息
				// this.searchCustomerContacter();
			},

			//语言改变
			changeLanguage(data) {
				this.editForm.language = data.value;
				this.editForm.languageName = data.label;
			},

			//安全级别
			changeSecurityLevel(data) {
				this.editForm.securityLevel = data.value;
				this.editForm.securityLevelName = data.label;
			},

			//获取点击数据
			getRowClickData (row, type) {
				switch(type) {
					case 'status':
						this.customerStatusVisible = false;
						this.editForm.customerStatus = row.id;
						this.editForm.customerStatusName = row.text;
					break;
					case 'description' :
						this.customerDescriptVisible = false;
						this.editForm.description = row.id;
						this.editForm.descriptionName = row.text;
					break;
					case 'size' :
						this.customerSizeVisible = false;
						this.editForm.size = row.id;
						this.editForm.sizeName = row.text;
					break;
					case 'source':
						this.customerSourceVisible = false;
						this.editForm.source = row.id;
						this.editForm.sourceName = row.text;
					break;
					case 'call':
						this.customerCallVisible = false;
						this.contacterData[this.currentIndex].title = row.id;
						this.contacterData[this.currentIndex].titleName = row.text;
					break;
				}
			},

			//获取客户行业数据
			getIndustryRow(row, event, column) {
				this.editForm.sectorId = row.id;
				this.editForm.sectorName = row.name;
				this.customerIndustryVisible = false;
			},

			//获取用户数据
			getUserData(data) {
				this.editForm.managerUserId = data[0].userid;
				this.editForm.managerUserName = data[0].username;  
				this.customerUserVisible = false;
			},

			//开启文档选择
			openDocSelect() {
				this.$refs.archiveSelect.openDialog();
			},

			//获取文档数据
			getArchiveData(data) {
				this.editForm.customerDocId = data.archiveId;
				this.editForm.customerDocName = data.archiveTitle;
			},

			openIndocSelect() {
				this.$refs.archiveSelect2.openDialog();
			},

			getArchiveData2(data) {
				this.editForm.customerIntroductiondocId = data.archiveId;
				this.editForm.customerIntroductiondocName = data.archiveTitle;
			},

			openCallDialog(index) {
				this.currentIndex = index;
				this.customerCallVisible = true;
			},

			//验证数据
			validateParam(index, position) {
				let data = this.contacterData[index];
				switch(position) {
					case 'one' :
						this.isNull(data.contacterName) ? data.validate.oneShow = true : data.validate.oneShow = false; 
					break;
					case 'two' :
						this.isNull(data.titleName) ? data.validate.twoShow = true : data.validate.twoShow = false; 
					break;
					case 'three' :
						this.isNull(data.jobTitle) ? data.validate.threeShow = true : data.validate.threeShow = false; 
					break;
				}
			},

			selectCallClose() {
				this.isNull(this.contacterData[this.currentIndex].title) ? this.contacterData[this.currentIndex].validate.twoShow = true : this.contacterData[this.currentIndex].validate.twoShow = false;
			},

			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},

			
			mainChange(data, index) {
				this.currentIndex = index;

				if(this.contacterData.length === 1 && !data) {
					this.contacterData[0].isMain = '1';
					return;
				}

				this.contacterData.forEach((c, index) => {
					this.currentIndex === index ? c.isMain = '1' : c.isMain = '0';
				})
			},

			//获取客户信息
			getSjdwData(data , type) {
				this.editForm.parentId = data.customerId;
				this.editForm.parentName = data.customerName;
				this.sjdwVisible = false;
			},

			getZjjgData(data, type) {
				this.editForm.agentId = data.customerId;
				this.editForm.agentName = data.customerName;
				this.zjjgVisible = false;
			},

			// searchCustomerContacter() {
			// 	let params = {
			// 		customerId: this.editForm.customerId,
			// 		branchId: this.userInfo.branchId
			// 	}

			// 	this.load.list = true;
			// 	listCustomerContacter(params).then((res) => {
			// 		var tips=res.data.tips;
			// 		if(tips.isOk){
			// 			this.oldContacterData = res.data.data;
			// 			this.contacterData = res.data.data;
			// 			this.$emit('getContacter', this.contacterData);
			// 			if(this.contacterData.length > 0) {
			// 				this.contacterData.forEach(r => {
			// 					r.validate = {
			// 						oneShow: false,
			// 						twoShow: false,
			// 						threeShow: false,
			// 						oneMsg: '名称不能为空',
			// 						twoMsg: '称呼不能为空',
			// 						threeMsg: '岗位不能为空',
			// 					}
			// 				})
			// 			}
			// 		}
			// 		this.load.list = false;
			// 	}).catch( err  => this.load.list = false);
			// },

			//获取选择的区县数据
			getAddressData(data, type) {
				this.addressVisible = false;
				this.editForm.country = data.country;
				this.editForm.province = data.province;
				this.editForm.provinceCode = data.provinceCode;
				this.editForm.city = data.city;
				this.editForm.cityCode = data.cityCode;
				this.editForm.district = data.district;
				this.editForm.districtCode = data.districtCode;
				this.addressName = this.editForm.country + "/" + this.editForm.province + "/" + this.editForm.city + "/" + this.editForm.district;
			},

			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'customer-edit':CustomerEdit
			'customer-base-data-components': CustomerBaseDataComponents,
			'customer-industry-tree' : CustomerIndustryTree,
			'users-select' : UsersSelect,
			'archive-select-components' : ArchiveSelectComponents,
			'customer-components' : CustomerComponents,
			'region-components' : RegionComponents
		},

		mounted() {
			this.editForm = Object.assign(this.editForm, this.customer);
			this.addressName = this.editForm.country + "/" + this.editForm.province + "/" + this.editForm.city + "/" + this.editForm.district;
			this.contacterData = this.editForm.contacterList;
			if(this.contacterData.length > 0) {
				this.contacterData.forEach(r => {
					r.validate = {
						oneShow: false,
						twoShow: false,
						threeShow: false,
						oneMsg: '名称不能为空',
						twoMsg: '称呼不能为空',
						threeMsg: '岗位不能为空',
					}
				})
			}
			this.$nextTick(() => {
				this.initData();
			})

		}//end mounted
	}

</script>

<style scoped>

.container{
	padding: 20px;
}

.el-icon-circle-plus-outline, .el-icon-remove-outline {
	font-size: 18px;
	cursor: pointer;
}

.industry {
    height: 500px;
    overflow: auto;
}

.vTip {
	color: red;
	display: block;
	position: absolute;
	left: 1px;
}

.el-icon-warning {
	position: relative;
	top: 5px;
	margin-right: 1px;
}

.el-icon-warning, .tipMsg {
	color: red;
	float: left;
}

.addressPosition {
	position: absolute;
	top: 16px;
	left: -20px;
}

</style>