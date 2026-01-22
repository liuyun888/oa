<template>
	<section>
		<el-row class="container">

			<el-row style="margin-bottom:20px">
				<el-button  size="small" @click.native="handleCancel">取消</el-button>  
				<el-button v-loading="load.add" type="primary" size="small" @click="addSubmit">保存</el-button>
			</el-row>

			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="客户名称" prop="customerName">
							<el-input disabled v-model="addForm.customerName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="客户编码" prop="customerCode">
							<el-input v-model="addForm.customerCode"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="客户简称" prop="customerEngName">
							<el-input v-model="addForm.customerEngName"></el-input>
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
							<el-input v-model="addForm.zipCode"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="地址" prop="address">
							<el-input v-model="addForm.address"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="电话" prop="phone">
							<el-input v-model="addForm.phone"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="语言" prop="language">									
							<el-select @change="changeLanguage" v-model="addForm.languageName" placeholder="请选择">
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
							<el-input v-model="addForm.email"></el-input>
						</el-form-item>
					</el-col>
					

					<el-col :span="12">
						<el-form-item label="传真" prop="fax">
							<el-input v-model="addForm.fax"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					
					<el-col :span="12">
						<el-form-item label="网站" prop="fax">
							<el-input v-model="addForm.website"></el-input>
						</el-form-item>
					</el-col>

					<el-row>
						<el-col :span="12">
							<el-form-item label="介绍" prop="introduction">
								<el-input type="textarea" :rows="2" v-model="addForm.introduction"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-row>
				
			
				<el-row>
					<el-col :span="12">
						<el-form-item label="状态" prop="customerStatusName">
							<el-input @focus="customerStatusVisible=true" v-model="addForm.customerStatusName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="类型" prop="customerType">
							<span>{{addForm.customerTypeName}}</span>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="描述" prop="descriptionName">
							<el-input @focus="customerDescriptVisible=true" v-model="addForm.descriptionName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="规模" prop="sizeName">
							<el-input @focus="customerSizeVisible=true" v-model="addForm.sizeName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="获得途径" prop="sourceName">
							<el-input @focus="customerSourceVisible=true" v-model="addForm.sourceName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="行业" prop="sectorName">
							<el-input @focus="customerIndustryVisible=true" v-model="addForm.sectorName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="客户经理" prop="managerUserName">
							<el-input @focus="customerUserVisible=true" v-model="addForm.managerUserName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="中介机构" prop="agentName">
							<el-input @focus="zjjgVisible=true" v-model="addForm.agentName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="上级单位" prop="parentName">
							<el-input @focus="sjdwVisible = true" v-model="addForm.parentName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="文档" prop="customerDocName">
							<el-input @focus="openDocSelect" v-model="addForm.customerDocName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="背景资料" prop="customerIntroductiondocName">
							<el-input @focus="openIndocSelect" v-model="addForm.customerIntroductiondocName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="安全级别" prop="securityLevelName">
							<el-select @change="changeSecurityLevel" v-model="addForm.securityLevelName" placeholder="请选择">
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
						<el-form-item label="信用额度" prop="creditAmount">
							<el-input v-model="addForm.creditAmount"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="信用期间" prop="creditTime">
							<el-input v-model="addForm.creditTime"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="开户银行" prop="bankName">
							<el-input v-model="addForm.bankName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="账户" prop="accountName">
							<el-input v-model="addForm.accountName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="银行账户" prop="accounts">
							<el-input v-model="addForm.accounts"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<span>提示: 系统默认第一行为主联系人</span>
				<el-table style="margin-top: 10px" size="small" border :data="contacterData" stripe>
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
						<template slot-scope="row">
							<i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
						</template>
					</el-table-column>
				</el-table>
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
				<customer-industry-tree @node-click="getIndustryRow" :refresh="customerIndustryVisible"></customer-industry-tree>
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
	import { addCustomer } from '@/api/oa/crm/customer';
	import { mapGetters } from 'vuex'
	import CustomerBaseDataComponents from '../components/CustomerBaseDataComponents';
	import CustomerIndustryTree from '../components/CustomerIndustryTree';
	import UsersSelect from '../../../mdp/sys/user/UsersSelect';
	import ArchiveSelectComponents from '../components/ArchiveSelectComponents';
	import CustomerComponents from '../components/CustomerComponents';
	import RegionComponents from '../components/RegionComponents';

	
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customer','visible'],
		watch: {
	      'customer':function( customer ) {
	        this.addForm = customer;
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
				addForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'', languageName: '',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',securityLevel:'',securityLevelName: '', evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},

				resetForm: {
					customerId:'',customerName:'',customerCode:'',customerEngName:'',address:'',addressGps:'',zipCode:'',country:'',province:'',provinceCode:'',city:'',cityCode:'',district:'',districtCode:'',language:'', languageName: '',phone:'',fax:'',email:'',website:'',introduction:'',customerStatus:'',customerStatusName:'',customerType:'',customerTypeName:'',description:'',descriptionName:'',size:'',sizeName:'',source:'',sourceName:'',sectorId:'',sectorName:'',managerUserId:'',managerUserName:'',agentId:'',agentName:'',parentId:'',parentName:'',customerDocId:'',customerDocName:'',customerIntroductiondocId:'',customerIntroductiondocName:'',securityLevel:'',securityLevelName: '', evaluation:'',rating:'',portalStatus:'',creditAmount:'',creditTime:'',bankName:'',accountName:'',accounts:'',totalContractAmount:'',isAttention:'',createTime:'',createUserId:'',createUserName:'',updateTime:'',updateUserId:'',updateUserName:'',lastContactTime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				//折叠面板
				activeNames: ['1', '2', '3', '4'],
				//联系人数据
				contacterData: [
					{
						contacterName: '',
						title: '',
						titleName: '',
						jobTitle: '',
						contacterEmail: '',
						phoneOffice: '',
						phoneHome: '',
						mobilePhone: '',
						isMain: '1',
						validate: {
							oneShow: false,
							twoShow: false,
							threeShow: false,
							oneMsg: '名称不能为空',
							twoMsg: '称呼不能为空',
							threeMsg: '岗位不能为空',
						}
					}
				],

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

				addressVisible : false,
				addressName: '',

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.reset();
				this.$emit('cancel');
			},

			//新增提交Customer crm_customer 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				//验证联系人
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let flag = this.validateData();
						if(!flag) {
							this.$message.error("客户联系人数据未填写完全");
							return
						};
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.transfreData(this.addForm)); 
							addCustomer(params).then((res) => {
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

			//添加后或者关闭后清空表单
			reset() {
				Object.assign(this.resetForm, this.addForm);
				//地址
				this.addressName = '';
				//联系人
				this.contacterData = [
					{
						contacterName: '',
						title: '',
						titleName: '',
						jobTitle: '',
						contacterEmail: '',
						phoneOffice: '',
						phoneHome: '',
						mobilePhone: '',
						isMain: '1',
						validate: {
							oneShow: false,
							twoShow: false,
							threeShow: false,
							oneMsg: '名称不能为空',
							twoMsg: '称呼不能为空',
							threeMsg: '岗位不能为空',
						}
					}
				];
			},

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

			transfreData(addFrom) {
				let params = {
					customer: addFrom,
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
				this.addForm=Object.assign(this.addForm, this.customer);  
				//设置默认客户经理为当前登陆人
				this.addForm.managerUserId = this.userInfo.userid;
				this.addForm.managerUserName = this.userInfo.username;  
			},

			//语言改变
			changeLanguage(data) {
				this.addForm.language = data.value;
				this.addForm.languageName = data.label;
			},

			//安全级别
			changeSecurityLevel(data) {
				this.addForm.securityLevel = data.value;
				this.addForm.securityLevelName = data.label;
			},

			//获取点击数据
			getRowClickData (row, type) {
				switch(type) {
					case 'status':
						this.customerStatusVisible = false;
						this.addForm.customerStatus = row.id;
						this.addForm.customerStatusName = row.text;
					break;
					case 'description' :
						this.customerDescriptVisible = false;
						this.addForm.description = row.id;
						this.addForm.descriptionName = row.text;
					break;
					case 'size' :
						this.customerSizeVisible = false;
						this.addForm.size = row.id;
						this.addForm.sizeName = row.text;
					break;
					case 'source':
						this.customerSourceVisible = false;
						this.addForm.source = row.id;
						this.addForm.sourceName = row.text;
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
				this.addForm.sectorId = row.id;
				this.addForm.sectorName = row.name;
				this.customerIndustryVisible = false;
			},

			//获取用户数据
			getUserData(data) {
				this.addForm.managerUserId = data[0].userid;
				this.addForm.managerUserName = data[0].username;  
				this.customerUserVisible = false;
			},

			//开启文档选择
			openDocSelect() {
				this.$refs.archiveSelect.openDialog();
			},

			//获取文档数据
			getArchiveData(data) {
				this.addForm.customerDocId = data.archiveId;
				this.addForm.customerDocName = data.archiveTitle;
			},

			openIndocSelect() {
				this.$refs.archiveSelect2.openDialog();
			},

			getArchiveData2(data) {
				this.addForm.customerIntroductiondocId = data.archiveId;
				this.addForm.customerIntroductiondocName = data.archiveTitle;
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
				if(this.contacterData.length === '1' && !data) {
					this.contacterData[0].isMain = '1';
					return;
				}
				this.contacterData.forEach((c, index) => {
					this.currentIndex === index ? c.isMain = '1' : c.isMain = '0';
				})
			},

			//获取客户信息
			getSjdwData(data , type) {
				this.addForm.parentId = data.customerId;
				this.addForm.parentName = data.customerName;
				this.sjdwVisible = false;
			},

			getZjjgData(data, type) {
				this.addForm.agentId = data.customerId;
				this.addForm.agentName = data.customerName;
				this.zjjgVisible = false;
			},

			getAddressData(data, type) {
				this.addressVisible = false;
				this.addForm.country = data.country;
				this.addForm.province = data.province;
				this.addForm.provinceCode = data.provinceCode;
				this.addForm.city = data.city;
				this.addForm.cityCode = data.cityCode;
				this.addForm.district = data.district;
				this.addForm.districtCode = data.districtCode;
				this.addressName = this.addForm.country + "/" + this.addForm.province + "/" + this.addForm.city + "/" + this.addForm.district;
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
			this.initData();
		}//end mounted
	}

</script>

<style scoped>

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