<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="90px" :rules="addFormRules" ref="addForm">
				
				<div class="form-top">
					<el-form-item label="具体地址" prop="address">
						<el-input v-model="addForm.address" placeholder="地址" ></el-input>
					</el-form-item>

					<el-form-item label="区域" prop="city">
						<el-input @focus="addressVisible=true" v-model="addressName" placeholder="城市" ></el-input>
						<div class="addressPosition" v-if="addressVisible">
							<region-components @get-data="getAddressData($event)" size="4" @hide="addressVisible=false" :visible="addressVisible"></region-components>
						</div>
					</el-form-item> 
					
					<el-form-item label="邮政编码" prop="zipCode">
						<el-input v-model="addForm.zipCode" placeholder="邮政编码" ></el-input>
					</el-form-item> 
					
					<el-form-item label="电话" prop="phone">
						<el-input v-model="addForm.phone" placeholder="电话" ></el-input>
					</el-form-item> 
					
					<el-form-item label="传真" prop="fax">
						<el-input v-model="addForm.fax" placeholder="传真" ></el-input>
					</el-form-item> 
					
					<el-form-item label="电子邮件" prop="email">
						<el-input v-model="addForm.email" placeholder="电子邮件" ></el-input>
					</el-form-item> 
					
					<el-form-item label="联系人" prop="contacterUserName">
						<el-input v-model="addForm.contacterUserName" placeholder="联系人名称" ></el-input>
					</el-form-item> 
					
					<el-form-item label="地址类型" prop="typeName">
						<el-select @change="selectAddressType" v-model="addForm.typeName" placeholder="请选择">
							<el-option
								v-for="item in typeArr"
								:key="item.value"
								:label="item.label"
								:value="{value:item.value, label:item.label}">
							</el-option>
						</el-select>
					</el-form-item> 

					<el-form-item label="附加地址" prop="appendAddress">
						<el-input v-model="addForm.appendAddress" placeholder="附加地址" ></el-input>
					</el-form-item>
				</div>

				<div class="form-bottom">
					<el-form-item class="btn">
						<el-col :span="24" :offset="8"> 
							<el-button @click.native="handleCancel">取消</el-button>  
							<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
						</el-col>
					</el-form-item> 
				</div>

			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addCustomerAddress } from '@/api/oa/crm/customerAddress';
	import { mapGetters } from 'vuex';
	import RegionComponents from '../components/RegionComponents';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerAddress','visible', 'customerId'],
		watch: {
	      'customerAddress':function( customerAddress ) {
	        this.addForm = customerAddress;
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
					address: [
						{ required: true, message: '地址不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 crm_customer_address
				addForm: {
					addressId:'',curstomerId:'',country:'',countryCode:'',province:'',provinceCode:'',city:'',cityCode:'',street:'',streetCode:'',district:'',districtCode:'',zipCode:'',phone:'',fax:'',email:'',contacterUserId:'',contacterUserName:'',typeId:'',typeName:'',appendAddress:'',address:'',branchId: ''
				},

				addFormRefresh: {
					addressId:'',curstomerId:'',country:'',countryCode:'',province:'',provinceCode:'',city:'',cityCode:'',street:'',streetCode:'',district:'',districtCode:'',zipCode:'',phone:'',fax:'',email:'',contacterUserId:'',contacterUserName:'',typeId:'',typeName:'',appendAddress:'',address:'',branchId: ''
				},


				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				addressVisible: false,
				addressName: '',
				typeArr: [
					{
						label: '',
						value: '',
					},
					{
						label: '送货地址',
						value: '1',
					},
					{
						label: '发票地址',
						value: '2',
					},
					{
						label: '邮寄地址',
						value: '3',
					},
					{
						label: '上门地址',
						value: '4',
					},
				]


				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				// this.$refs['addForm'].resetFields();
				this.refreshData();
				this.$emit('cancel');
			},

			refreshData() {
				Object.assign(this.addForm, this.addFormRefresh);
				this.addressName = '';
			},

			//新增提交CustomerAddress crm_customer_address 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.addForm.curstomerId = this.customerId;
				this.addForm.branchId = this.userInfo.branchId;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCustomerAddress(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.refreshData();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getAddressData(data) {
				this.addressVisible = false;
				this.addForm.country = data.country;
				this.addForm.countryCode = data.countryCode;
				this.addForm.province = data.province;
				this.addForm.provinceCode = data.provinceCode;
				this.addForm.city = data.city;
				this.addForm.cityCode = data.cityCode;
				this.addForm.district = data.district;
				this.addForm.districtCode = data.districtCode;
				this.addForm.street = data.street;
				this.addForm.streetCode = data.streetCode;
				this.addressName = this.addForm.country + "/" + this.addForm.province + "/" + this.addForm.city + "/" + this.addForm.district + "/" + this.addForm.street;
			},

			selectAddressType(data) {
				let {label, value} = data;
				this.addForm.typeId = data.value;
				this.addForm.typeName = data.label;
			}
			
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'customer-address-edit':CustomerAddressEdit
			'region-components' : RegionComponents
			
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.customerAddress);  
			/**在下面写其它函数***/
		}//end mounted
	}

</script>

<style scoped>

.form-top {
	height: 500px;
	overflow-x:hidden;
	overflow-y:visible;
	padding: 0 10px 0 10px;
}

.form-bottom {
	border-top: 1px solid rgb(241, 241, 241);
}

.form-bottom .btn {
	margin-top: 10px;
}


</style>