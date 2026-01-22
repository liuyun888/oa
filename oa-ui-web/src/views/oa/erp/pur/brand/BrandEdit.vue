<template>
	<section>
		 <el-row class="page-container border padding">
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">

				<el-form-item label="品牌名称" prop="brandName">
					<el-input v-model="editForm.brandName" ></el-input>
				</el-form-item>

				<el-form-item label="首字母" prop="firstLetter">
					<el-input v-model="editForm.firstLetter"></el-input>
				</el-form-item>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="负责人" prop="personUser">
              <el-input v-model="editForm.personUser" placeholder="负责人" @focus="visibleUserSelect=true" clearable ></el-input>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="联系电话" prop="personPhone">
        			<el-input v-model="editForm.personPhone" placeholder="联系电话" ></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>

        <el-row>
        	<el-col :span="12">
        		<el-form-item label="品牌入驻日期" prop="brandDate">
               <el-date-picker
                v-model="editForm.brandDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="品牌入驻日期">
               </el-date-picker>
        		</el-form-item>
        	</el-col>

        	<el-col :span="12">
        		<el-form-item label="品牌状态" prop="brandStatus">
        			<el-select v-model="editForm.brandStatus" style="width: 100%;" placeholder="请选择">
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
          <el-input v-model="editForm.brandAddress" placeholder="品牌供应商地址" ></el-input>
        </el-form-item>

        <el-form-item label="是否盈余" prop="isProfit">
        	<el-radio v-model="editForm.isProfit" label="1">是</el-radio>
        		<el-radio v-model="editForm.isProfit" label="0">否</el-radio>
        </el-form-item>

				<el-form-item label="是否品牌制作商" prop="factoryStatus">
					<el-radio v-model="editForm.factoryStatus" label="1">是</el-radio>
  					<el-radio v-model="editForm.factoryStatus" label="0">否</el-radio>
				</el-form-item>

				<el-form-item label="品牌logo" prop="logo">
					<el-image v-if="isShowLogo" style="width: 250px; height: 200px" :src="logoSrc"></el-image>
					<attachment-upload  :archiveId="uploadArchiveId1" :categoryId="uploadCategoryId1" :branchId="userInfo.branchId"  @on-change="getBrandLogo" @on-remove="removeBrandLogo" :limit="1"></attachment-upload>
				</el-form-item>

				<el-form-item label="专区大图" prop="bigPic">
					<el-image v-if="isShowPic" style="width: 250px; height: 200px" :src="picSrc"></el-image>
					<attachment-upload  :archiveId="uploadArchiveId2" :categoryId="uploadCategoryId2" :branchId="userInfo.branchId"  @on-change="getBrandBigPic" @on-remove="removeBrandBigPic" :limit="1"></attachment-upload>
				</el-form-item>

				<el-form-item label="品牌故事" prop="brandStory">
					<el-input type="textarea" v-model="editForm.brandStory"  :rows="4"></el-input>
				</el-form-item>

				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
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
	import { editBrand } from '@/api/oa/erp/pur/brand';
	import { mapGetters } from 'vuex';
	import config from '@/common/config';
	import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
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
			this.editForm = brand;
			this.editForm.factoryStatus = this.editForm.factoryStatus+"";
      this.editForm.isProfit = this.editForm.isProfit+"";
			this.setDefaultParam();
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加

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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
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
				//编辑界面数据  Brand pur_brand
				editForm: {
					id:'',brandName:'',firstLetter:'',factoryStatus:'',logo:'',bigPic:'',brandStory:'',personUser:'',personPhone:'',brandDate:'',brandStatus:'',brandAddress:'',isProfit:'1',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				baseImageUrl: config.getArcFileUploadBasePath() + '/',
				uploadArchiveId1: '',
				uploadArchiveId2: '',
				uploadCategoryId1: '',
				uploadCategoryId2: '',
				isShowLogo: false,
				isShowPic: false,
				logoSrc: "",
				picSrc: "",
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交Brand pur_brand父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editBrand(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			setDefaultParam() {
				//生成docId
				//ArchiveId
				this.uploadArchiveId1 = this.editForm.id + "logo";
				this.uploadArchiveId2 = this.editForm.id + "bigPic";
				//生成docIdCategory
				this.uploadCategoryId1 = 'brand_upload_logo';
				this.uploadCategoryId2 = 'brand_upload_bigPic';
				this.logoSrc = this.baseImageUrl + this.editForm.logo;
				this.picSrc = this.baseImageUrl + this.editForm.bigPic;
				this.isShowLogo = true;
				this.isShowPic = true;
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
          this.editForm.personUser = data[0].username
      	}
      	this.visibleUserSelect = false;
      },
      isNull(data) {
      	if(data === null || data === '' || data === undefined) {
      		return true;
      	}
      	return false;
      },
			getBrandLogo(data) {
				this.editForm.logo = data.url;
				this.logoSrc = this.baseImageUrl + this.editForm.logo;
				this.isShowLogo = true;
			},

			getBrandBigPic(data) {
				this.editForm.bigPic = data.url;
				this.picSrc = this.baseImageUrl + this.editForm.bigPic;
				this.isShowPic = true;
			},

			removeBrandLogo(data) {
				//删除
				this.editForm.logo = "";
				this.isShowLogo = false;
			},

			removeBrandBigPic(data) {
				this.editForm.bigPic = "";
				this.isShowPic = false;
			},

			confirmEnding(str, target) {
				var start = str.length-target.length;
				var arr = str.substr(start,target.length);
				if(arr == target){
					return true;
				}
				return false;
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {
			//在下面添加其它组件 'brand-edit':BrandEdit
			'attachment-upload': AttachmentUpload,
      'user-select' : UsersSelect,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.brand);
			this.editForm.factoryStatus = this.editForm.factoryStatus+"";
      this.editForm.isProfit = this.editForm.isProfit+"";
			this.setDefaultParam();
		}
	}

</script>

<style scoped>

</style>
