<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">

				<el-divider content-position="center">基本信息</el-divider>

				<el-row>
					<el-col :span="12">
						<el-form-item label="相对方名称" prop="cpName">
							<el-input v-model="addForm.cpName"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="相对方编号" prop="cpSn">
							<el-input v-model="addForm.cpSn"> </el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="相对方简称" prop="cpShort">
							<el-input v-model="addForm.cpShort" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="相对方级别" prop="cpLevel">
							<el-select  v-model="addForm.cpLevel" placeholder="请选择">
								<el-option
									v-for="item in levelOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="item.optionValue">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="相对方类型" prop="cpTypeName">
							<el-select @change="optionsChange($event,'type')" v-model="addForm.cpTypeName" placeholder="请选择">
								<el-option
									v-for="item in typeOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="{value:item.optionValue, label:item.optionName}">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="相对方状态" prop="cpStatus">
							<el-select  v-model="addForm.cpStatus" placeholder="请选择">
								<el-option
									v-for="item in cpStatusOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-divider content-position="center">详细信息</el-divider>

				<el-row>
					<el-col :span="8">
						<el-form-item label="相对方行业" prop="cpIndustryName">
							<!-- <el-input v-model="addForm.cpIndustryName" ></el-input> -->
							<el-select @change="optionsChange($event,'industry')" v-model="addForm.cpIndustryName" placeholder="请选择">
								<el-option
									v-for="item in industryOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="{value:item.optionValue, label:item.optionName}">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="国家地区" prop="cpAddress">
							<el-input v-model="addForm.cpAddress" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="所在区域" prop="cpRegionName">
							<el-select @change="optionsChange($event,'region')" v-model="addForm.cpRegionName" placeholder="请选择">
								<el-option
									v-for="item in regionOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="{value:item.optionValue, label:item.optionName}">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="相对方网址" prop="cpWebsite">
							<el-input v-model="addForm.cpWebsite"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="相对方简介" prop="cpDesc">
							<el-input type="textarea" rows="4" v-model="addForm.cpDesc" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="法定代表" prop="cpFddb">
							<el-input v-model="addForm.cpFddb" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="注册信息" prop="cpZcxx">
							<el-input v-model="addForm.cpZcxx"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="纳税人识别码" prop="cpGszch">
							<el-input v-model="addForm.cpGszch"  ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="注册资本" prop="cpZczb">
							<el-input v-model="addForm.cpZczb"  ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="注册时间" prop="cpZcsj">
							<el-input v-model="addForm.cpZcsj" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="单位状态" prop="cpDwztName">
							<el-select @change="optionsChange($event,'copmanystatus')" v-model="addForm.cpDwztName" placeholder="请选择">
								<el-option
									v-for="item in companyStatusOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="{value:item.optionValue, label:item.optionName}">
								</el-option>
							</el-select>

						</el-form-item>
					</el-col>

				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="单位电话" prop="cpPhone">
							<el-input v-model="addForm.cpPhone"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="邮箱" prop="cpEmail">
							<el-input v-model="addForm.cpEmail"  ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="传真" prop="cpFax">
							<el-input v-model="addForm.cpFax" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="省市区">
							<el-input @focus="addressVisible=true" v-model="addressName"></el-input>
							<div class="addressPosition" v-if="addressVisible">
								<region-components @get-data="getAddressData($event)" size="3" @hide="addressVisible=false" :visible="addressVisible"></region-components>
							</div>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="负责人" prop="cpFzr">
							<el-input v-model="addForm.cpFzr" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="负责人手机" prop="cpFzrPhone">
							<el-input v-model="addForm.cpFzrPhone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-divider content-position="center">财务信息</el-divider>

				<el-row>
					<el-col :span="12">
						<el-form-item label="结算方式" prop="cpClearWayName">
							<el-select @change="optionsChange($event,'way')" v-model="addForm.cpClearWayName" placeholder="请选择">
								<el-option
									v-for="item in wayOptions"
									:key="item.optionValue"
									:label="item.optionName"
									:value="{value:item.optionValue, label:item.optionName}">
								</el-option>
							</el-select>

						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="开户行" prop="cpOpenBank">
							<el-input v-model="addForm.cpOpenBank" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="币种" prop="cpCurrency">
							<el-input v-model="addForm.cpCurrency" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="账号" prop="cpBankAccount">
							<el-input v-model="addForm.cpBankAccount" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<el-divider content-position="center">联系人信息</el-divider>

			<el-table style="margin-top: 10px" size="small" border :data="linkManData" stripe>
					<el-table-column
						label="序号"
						type="index"
						width="50">
					</el-table-column>

					<el-table-column align="center" label="姓名" width="">
						<template slot-scope="row">
							<span class="vTip">*</span>
							<el-input @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'one')" v-model="linkManData[row.$index].linkName"> </el-input>
							<div v-show="linkManData[row.$index].validate.oneShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{linkManData[row.$index].validate.oneMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="称呼" width="">
						<template slot-scope="row">
							<span class="vTip">*</span>
							<el-input @blur="validateParam(row.$index, 'two')"   @focus="currentIndex = row.$index"  v-model="linkManData[row.$index].linkCall"> </el-input>
							<div v-show="linkManData[row.$index].validate.twoShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{linkManData[row.$index].validate.twoMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="岗位" width="">
						<template slot-scope="row">
							<span class="vTip">*</span>
							<el-input  @focus="currentIndex = row.$index" @blur="validateParam(row.$index, 'three')" v-model="linkManData[row.$index].linkJob"> </el-input>
							<div v-show="linkManData[row.$index].validate.threeShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{linkManData[row.$index].validate.threeMsg}}</span>
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" label="部门" width="">
						<template slot-scope="row">
							<el-input  @focus="currentIndex = row.$index" v-model="linkManData[row.$index].linkDept"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="办公电话" width="">
						<template slot-scope="row">
							<el-input  @focus="currentIndex = row.$index" v-model="linkManData[row.$index].linkPhone"> </el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="邮箱" width="">
						<template slot-scope="row">
							<el-input  @focus="currentIndex = row.$index" v-model="linkManData[row.$index].linkEmail"> </el-input>
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


        <el-row style="margin-top:20px;text-align:center">
          <el-button v-loading="load.add" type="primary" size="small" @click="addSubmit">保存</el-button>
        	<el-button  size="small" @click.native="handleCancel">取消</el-button>
        </el-row>


		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addCounterparty } from '@/api/oa/ht/counterparty';
	import { mapGetters } from 'vuex';
	import RegionComponents from '../../crm/components/RegionComponents';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['counterparty','visible'],
		watch: {
	      'counterparty':function( counterparty ) {
	        this.addForm = counterparty;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					cpName: [
						{ required: true, message: '相对方名称不能为空', trigger: 'change' }
					],
					cpSn: [
						{ required: true, message: '相对方编号不能为空', trigger: 'change' }
					],
					cpShort: [
						{ required: true, message: '相对方简称不能为空', trigger: 'change' }
					],
					cpLevel: [
						{ required: true, message: '相对方级别不能为空', trigger: 'change' }
					],
					cpTypeName: [
						{ required: true, message: '相对方类型不能为空', trigger: 'change' }
					],

					cpFzr: [
						{ required: true, message: '负责人不能为空', trigger: 'change' }
					],

					cpOpenBank: [
						{ required: true, message: '开户行不能为空', trigger: 'change' }
					],

					cpCurrency: [
						{ required: true, message: '币种不能为空', trigger: 'change' }
					],

					cpBankAccount: [
						{ required: true, message: '账号不能为空', trigger: 'change' }
					],

				},
				//新增界面数据 ht_counterparty
				addForm: {
					cpId:'',cpSn:'',cpName:'',cpShort:'',cpLevel:'',cpType:'',cpTypeName:'',cpStatus:'',cpIndustry:'',cpIndustryName:'',cpAddress:'',cpRegion:'',cpRegionName:'',cpWebsite:'',cpDesc:'',cpFddb:'',cpZcxx:'',cpGszch:'',cpZczb:'',cpZcsj:'',cpDwzt:'',cpDwztName:'',cpPhone:'',cpEmail:'',cpFax:'',cpProvince:'',cpProvinceCode:'',cpCity:'',cpCityCode:'',cpDistrict:'',cpDistrictCode:'',cpFzr:'',cpFzrPhone:'',cpClearWay:'',cpClearWayName:'',cpOpenBank:'',cpCurrency:'',cpBankAccount:'',branchId:'',createTime:'',createUserId:'',createUserName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				linkManData: [],
				currentIndex: 0,

				//下拉框选择
				//相对方等级
				levelOptions: [],
				//相对方类型
				typeOptions: [],
				//行业
				industryOptions: [],
				//区域
				regionOptions: [],
				//结算方式
				wayOptions: [],
				//单位状态
				companyStatusOptions: [],

				//向对方状态
				cpStatusOptions: [
					{
						label: '认证',
						value: '1',
					},
					{
						label: '未认证',
						value: '2',
					}
				],
				addressVisible: false,
				addressName: '',


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交Counterparty ht_counterparty 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				let flag = this.validateData();
				if(!flag) {
					this.$message.error("客户联系人数据未填写完全");
					return
				};
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.transferData(this.addForm));
							console.log(params, "params--------->");
							addCounterparty(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},

			transferData(data) {
				data.linkmanList = this.linkManData;
				return data;
			},

			validateData() {
				this.linkManData.forEach((d, index) => {
					this.validateParam(index, "one");
					this.validateParam(index, "two");
					this.validateParam(index, "three");
				})

				let flag = this.linkManData.some(d => {
					if(d.validate.oneShow) {
						return false;
					}
					if(d.validate.twoShow) {
						return false;
					}
					if(d.validate.threeShow) {
						return false;
					}
					return true;
				})

				console.log(flag, "flag----");

                return flag;
			},


			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//增加一行
			addRow() {
				this.linkManData.push({
					linkId: '',
					cpId: '',
					linkName: '',
					linkCall: '',
					linkJob: '',
					linkDept: '',
					linkPhone: '',
					linkEmail: '',
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
				 this.linkManData.splice(index, 1);
			},

			getOption() {
                let params = [
					{ categoryId: "all", itemCode: "counterpartyLevel" },
					{ categoryId: "all", itemCode: "counterpartyType" },
					{ categoryId: "all", itemCode: "counterpartyIndustry"},
					{ categoryId: "all", itemCode: "region" },
					{ categoryId: "all", itemCode: "clearingForm"},
					{categoryId: "all", itemCode: "companyStatus"}
                ];
                listOption(params).then(res => {
					let data =  res.data.data;
					this.levelOptions = data.counterpartyLevel;
					//相对方类型
					this.typeOptions = data.counterpartyType;
					//行业
					this.industryOptions = data.counterpartyIndustry;
					//区域
					this.regionOptions = data.region;
					//结算方式
					this.wayOptions = data.clearingForm;
					//单位状态
					this.companyStatusOptions = data.companyStatus;
				});
			},

			//选择器改变
			optionsChange(data, kind) {
				let {label, value} = data;
				switch(kind) {
					case 'type' :
						this.addForm.cpType = value;
						this.addForm.cpTypeName = label;
					break;
					case 'industry':
						this.addForm.cpIndustry = value;
						this.addForm.cpIndustryName = label;
					break;
					case 'region':
						this.addForm.cpRegion = value;
						this.addForm.cpRegionName = label;
					break;
					case 'way':
						this.addForm.cpClearWay = value;
						this.addForm.cpClearWayName = label;
					break;
					case 'copmanystatus':
						this.addForm.cpDwzt = value;
						this.addForm.cpDwztName = label;
					break;
				}
			},

			//验证数据
			validateParam(index, position) {
				let data = this.linkManData[index];
				switch(position) {
					case 'one' :
						this.isNull(data.linkName) ? data.validate.oneShow = true : data.validate.oneShow = false;
					break;
					case 'two' :
						this.isNull(data.linkCall) ? data.validate.twoShow = true : data.validate.twoShow = false;
					break;
					case 'three' :
						this.isNull(data.linkJob) ? data.validate.threeShow = true : data.validate.threeShow = false;
					break;
				}
			},

			isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},


			//获取地址数据
			getAddressData(data, type) {
				this.addressVisible = false;
				this.addForm.cpProvince = data.province;
				this.addForm.cpProvinceCode = data.provinceCode;
				this.addForm.cpCity = data.city;
				this.addForm.cpCityCode = data.cityCode;
				this.addForm.cpDistrict = data.district;
				this.addForm.cpDistrictCode = data.districtCode;
				this.addressName = this.addForm.cpProvince + "/" + this.addForm.cpCity + "/" + this.addForm.cpDistrict;
			},


			initData() {
				this.getOption();
			}

			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'counterparty-edit':CounterpartyEdit
			'region-components' : RegionComponents
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.counterparty);
			/**在下面写其它函数***/
			this.initData();
		}//end mounted
	}

</script>

<style scoped>

.vTip {
	color: red;
	display: block;
	position: absolute;
	left: 1px;
}

.el-icon-circle-plus-outline, .el-icon-remove-outline {
	font-size: 18px;
	cursor: pointer;
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
