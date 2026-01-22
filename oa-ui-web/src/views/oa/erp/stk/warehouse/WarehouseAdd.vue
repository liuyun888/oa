<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="addForm"  label-width="100px" :rules="addFormRules" ref="addForm">

				<el-row>
					<el-col :span="12">
						<el-form-item label="地址定位" prop="addressGps">
							<el-button @click="locationVisible=true" type="primary">地址定位</el-button>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row>
					<el-form-item label="仓库名称" prop="name">
						<el-input v-model="addForm.name" placeholder="仓库名称" ></el-input>
					</el-form-item>
				</el-row>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="仓库员" prop="houseUser">
        			<el-input v-model="addForm.houseUser" placeholder="仓库员" @focus="visibleUserSelect=true" clearable ></el-input>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="联系电话" prop="phone">
        			<el-input v-model="addForm.phone" placeholder="联系电话" ></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="库房数量" prop="houseNum">
        			<el-input v-model="addForm.houseNum" placeholder="库房数量" ></el-input>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="物品存放类别"  prop="houseClass">
        			<el-input @focus="selectAssetTypeVisible=true" v-model="addForm.houseClass" placeholder="物品存放类别" clearable ></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="仓库所属省" prop="province">
							<el-input v-model="addForm.province" placeholder="仓库所属的省" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="仓库所属市" prop="city">
							<el-input v-model="addForm.city" placeholder="仓库所属的市" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="区域名称" prop="districtName">
							<el-input v-model="addForm.districtName" placeholder="区域名称" ></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="仓库所属街道" prop="street">
							<el-input v-model="addForm.street" placeholder="仓库所属的街道" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="仓库所属地址" prop="address">
							<el-input v-model="addForm.address" placeholder="仓库所属地址" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>
		</el-row>
    <el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
        <user-select @confirm="getUserData"></user-select>
    </el-dialog>

    <el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="selectAssetTypeVisible" :close-on-click-modal="false">
    	<asset-category-tree @node-click="getSelectAssetTypeData" @cancel="selectAssetTypeVisible=false" ></asset-category-tree>
    </el-dialog>
		<el-dialog append-to-body title="选择定位" :visible.sync="locationVisible"  width="50%"  :close-on-click-modal="false">
			<location-select
				v-if="locationVisible"
				:attrName="attrName"
				:value="value"
				:addrName="addrName"
				@cancel="locationVisible=false"
				@getPoi="getPisotion"
			>
			</location-select>
		</el-dialog>



	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addWarehouse } from '@/api/oa/erp/stk/warehouse';
	import { mapGetters } from 'vuex';
	import locationSelect from '@/views/oa/car/components/locationSelect';
  import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
  import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['warehouse','visible'],
		watch: {
	      'warehouse':function( warehouse ) {
	        this.addForm = warehouse;
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
					],
					name: [
						{required: true, message: '仓库名称不能为空', trigger: 'change' }
					]
				},
        selectAssetTypeVisible: false,
        visibleUserSelect: false,
				//新增界面数据 stk_warehouse
				addForm: {
					id:'',name:'',districtId:'',districtName:'',province:'',city:'',street:'',provinceCode:'',cityCode:'',streetCode:'',address:'',addressGps:'',branchId:'',branchName:'',houseUser:'',phone:'',houseNum:'',houseClass:'',classId:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				locationVisible: false,
				attrName: '',
				value: '',
				addrName: '',
        userData: [],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
      getSelectAssetTypeData(data) {
      	this.addForm.classId = data.categoryId;
      	this.addForm.houseClass = data.categoryName
      	this.selectAssetTypeVisible = false;
      },
      //获取用户数据
      getUserData(data) {

      	if(!this.isNull(data)) {
      		// data.forEach(d => {
      		// 	// let param = {
      		// 	// 	inventoryUserid : d.userid,
      		// 	// 	inventoryUsername :  d.username
      		// 	// }
      		// 	this.addForm.houseUser = d.username
      		// 	this.userData.push(param);
      		// })
          this.addForm.houseUser = data[0].username
      	}

      	this.visibleUserSelect = false;

      },
      isNull(data) {
      	if(data === null || data === '' || data === undefined) {
      		return true;
      	}
      	return false;
      },
			//新增提交Warehouse stk_warehouse 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addWarehouse(params).then((res) => {
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
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getPisotion(val,addrName,attrName, addr) {
				//获取位置
				this.addForm.address = addrName;
				this.addForm.addressGps = val;
				this.addForm.province = addr.province;
				this.addForm.city = addr.city;
				this.addForm.districtName = addr.district;
				this.addForm.street = addr.street;
				this.addForm.streetCode = addr.streetNumber;
				this.locationVisible = false;
			}
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'warehouse-edit':WarehouseEdit
			'location-select' : locationSelect,
      'asset-category-tree' : AssetCategoryTree,
      'user-select' : UsersSelect,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.warehouse);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
