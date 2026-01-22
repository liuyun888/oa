<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">

				<el-form-item label="品牌名称" prop="brandName">
					<el-input v-model="addForm.brandName" placeholder="品牌名称" ></el-input>
				</el-form-item>

        <el-form-item label="首字母" prop="firstLetter">
        	<el-input v-model="addForm.firstLetter" placeholder="首字母" ></el-input>
        </el-form-item>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="负责人" prop="personUser">
              <el-input v-model="addForm.personUser" placeholder="负责人" @focus="visibleUserSelect=true" clearable ></el-input>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="联系电话" prop="personPhone">
        			<el-input v-model="addForm.personPhone" placeholder="联系电话" ></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="品牌入驻日期" prop="brandDate">
              <el-date-picker
               v-model="addForm.brandDate"
               type="datetime"
               value-format="yyyy-MM-dd HH:mm:ss"
               placeholder="品牌入驻日期">
              </el-date-picker>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="品牌状态" prop="brandStatus">
        			<el-select v-model="addForm.brandStatus" style="width: 100%;" placeholder="请选择">
        			    <el-option
        			      v-for="item in statusOptions"
        			      :key="item.value"
        			      :label="item.label"
        			      :value="item.value">
        			    </el-option>
        			  </el-select>
        		</el-form-item>
        	</el-col>
        </el-row>

        <el-form-item label="品牌供应商地址" prop="brandAddress">
          <el-input v-model="addForm.brandAddress" placeholder="品牌供应商地址" ></el-input>
        </el-form-item>

        <el-form-item label="是否盈余" prop="isProfit">
        	<el-radio v-model="addForm.isProfit" label="1">是</el-radio>
        		<el-radio v-model="addForm.isProfit" label="0">否</el-radio>
        </el-form-item>

				<el-form-item label="是否品牌制作商" prop="factoryStatus">
					<el-radio v-model="addForm.factoryStatus" label="1">是</el-radio>
  					<el-radio v-model="addForm.factoryStatus" label="0">否</el-radio>
				</el-form-item>


				<el-form-item label="品牌logo" prop="logo">
					<attachment-upload :eliminate="eliminate" :archiveId="uploadArchiveId1" :categoryId="uploadCategoryId1" :branchId="userInfo.branchId"  @on-change="getBrandLogo" :limit="1"></attachment-upload>
				</el-form-item>

				<el-form-item label="专区大图" prop="bigPic">
					<attachment-upload :eliminate="eliminate" :archiveId="uploadArchiveId2" :categoryId="uploadCategoryId2" :branchId="userInfo.branchId"  @on-change="getBrandBigPic" :limit="1"></attachment-upload>
				</el-form-item>

				<el-form-item label="品牌故事" prop="brandStory">
					<el-input type="textarea" v-model="addForm.brandStory" placeholder="品牌故事" :rows="4"></el-input>
				</el-form-item>

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
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addBrand } from '@/api/oa/erp/pur/brand';
	import { mapGetters } from 'vuex';
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
	import {sn} from '@/common/js/sequence'; //id生成器
  import UsersSelect from '@/views/mdp/sys/user/UsersSelect';


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['brand','visible'],
		watch: {
	      'brand':function( brand ) {
	        this.addForm = brand;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				//从新打开页面时某些数据需要重新加载，可以在这里添加
				this.setDefaultParam();
	      	}
	      }
	    },
		data() {
			return {
        statusOptions: [{
          value: '驻场',
          label: '驻场'
        }, {
          value: '退出',
          label: '退出'
        }],
        visibleUserSelect: false,
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '品牌id不能为空', trigger: 'change' }
					],
					brandName: [
						{ required: true, message: '品牌名称不能为空', trigger: 'change' }
					],
					firstLetter: [
						{ required: true, message: '品牌首字母不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 pur_brand
				addForm: {
					id:'',brandName:'', firstLetter:'', factoryStatus:'1', logo:'', bigPic:'', brandStory:'',personUser:'',personPhone:'',brandDate:'',brandStatus:'',brandAddress:'',isProfit:'1',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				 //上传组件必要参数
				uploadArchiveId1: '',
				uploadArchiveId2: '',
				uploadCategoryId1: '',
				uploadCategoryId2: '',
				eliminate: '',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交Brand pur_brand 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addBrand(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.eliminate = true;
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getBrandLogo(data) {
				this.addForm.logo = data.url;
			},
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
          this.addForm.personUser = data[0].username
      	}
      	this.visibleUserSelect = false;
      },
      isNull(data) {
      	if(data === null || data === '' || data === undefined) {
      		return true;
      	}
      	return false;
      },
			getBrandBigPic(data) {
				this.addForm.bigPic = data.url;
			},

			setDefaultParam() {
				this.addForm.factoryStatus = '1';
				 //生成docId
				this.addForm.id = sn();
				//ArchiveId
				this.uploadArchiveId1 = this.addForm.id + "logo";
				this.uploadArchiveId2 = this.addForm.id + "bigPic";
				//生成docIdCategory
				this.uploadCategoryId1 = 'brand_upload_logo';
				this.uploadCategoryId2 = 'brand_upload_bigPic';
			},

			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'brand-edit':BrandEdit
			'attachment-upload' : AttachmentUpload,
      'user-select' : UsersSelect,
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.brand);
			/**在下面写其它函数***/
			this.setDefaultParam();
		}//end mounted
	}

</script>

<style scoped>

</style>
