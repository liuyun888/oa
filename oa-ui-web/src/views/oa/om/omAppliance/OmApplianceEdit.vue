<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  size="small" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" placeholder="名称" style="width:100%;"></el-input>
				</el-form-item> 
				<el-row>
					
					<el-col :span="8">
						<el-form-item label="分类名称" prop="categoryName">
							<el-select  v-model="editForm.categoryId" @change="selectCategory" filterable placeholder="请选择">
								<el-option
									v-for="item in omCategorys"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item> 
					</el-col>
					<el-col :span="6">
						<el-form-item label="单位" prop="unit">
							<el-input v-model="editForm.unit" placeholder="单位" ></el-input>
						</el-form-item> 
					</el-col>
					<el-col :span="10">
						<el-form-item label="规格" prop="standard">
							<el-input v-model="editForm.standard" placeholder="规格" ></el-input>
						</el-form-item> 
					</el-col>
				</el-row> 
				<el-form-item label="单价￥" prop="price">
					<el-input-number  controls-position="right" v-model="editForm.price" placeholder="单价"></el-input-number>&nbsp;&nbsp;元
				</el-form-item> 
				<el-form-item label="是否警示" prop="isWarn">
					<el-checkbox   true-label="1" false-label="0" v-model="editForm.isWarn"></el-checkbox>
					<br>
					库存小于&nbsp;&nbsp;<el-input-number size="small" controls-position="right" v-model="editForm.highWarn" :min="0" ></el-input-number>&nbsp;&nbsp;或者大于&nbsp;&nbsp;<el-input-number controls-position="right" v-model="editForm.highWarn" :min="0"  size="small"></el-input-number>&nbsp;&nbsp;即预警
				</el-form-item>
				
				<el-form-item label="单价限制￥" prop="highPrice">
					单次采购单价大于&nbsp;&nbsp;<el-input-number size="small" controls-position="right" v-model="editForm.lowPrice" placeholder="最低单价"></el-input-number>&nbsp;&nbsp;元且小于&nbsp;&nbsp;<el-input-number size="small" controls-position="right"  v-model="editForm.highPrice" placeholder="最高单价"></el-input-number>&nbsp;&nbsp;元
				</el-form-item>  
				<el-form-item label="采购限制" prop="highPurchase">
					单次采购数量大于&nbsp;&nbsp;<el-input-number size="small" controls-position="right" v-model="editForm.lowPurchase" :min="1" ></el-input-number>&nbsp;&nbsp;并且小于&nbsp;&nbsp;<el-input-number size="small" controls-position="right" v-model="editForm.highPurchase" :min="0" ></el-input-number>
				</el-form-item>  	
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="3" v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 


				<el-form-item label="图片">
					<upload v-if="fileVisible" :limit='1' :archiveId="editForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item> 

				<!-- 
				<el-form-item label="机构号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构号"></el-input>
				</el-form-item>  -->
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editOmAppliance } from '@/api/oa/om/omAppliance';
	import { mapGetters } from 'vuex'
	import { listOmCategory } from '@/api/oa/om/omCategory';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['omAppliance','visible'],
		watch: {
	      'omAppliance':function( omAppliance ) {
			this.editForm=Object.assign(this.editForm, this.omAppliance);  
			this.editForm.status == '1' ? this.editForm.status = true : this.editForm.status = false
			this.editForm.isWarn == '1' ? this.editForm.isWarn = true : this.editForm.isWarn = false	
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				this.getOmCategorys();
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					name: [
						{ required: true, message: '用品名称不能为空', trigger: 'change' }
					],
					highPrice: [
						{ 	type: 'number',trigger: 'change',required: false,message: '最高单价必须为数字值',
								transform(value) {
									if(value){
										return Number(value);
									}
								},
						}
					],
					lowPrice: [
						{ 	type: 'number',trigger: 'change',required: false,message: '最低单价必须为数字值',
								transform(value) {
									if(value){
										return Number(value);
									}
								},
						}
					]
				},
				//编辑界面数据  OmAppliance om_appliance
				editForm: {
					id:'',name:'',standard:'',categoryId:'',categoryName:'',remark:'',stock:'',status:'',unit:'',isWarn:'',highWarn:'',lowWarn:'',highPurchase:'',lowPurchase:'',price:'',highPrice:'',lowPrice:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				omCategorys: [],//查询结果
				fileVisible: true,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交OmAppliance om_appliance父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							this.editForm.status ? this.editForm.status = '1' : this.editForm.status = '0'
							this.editForm.isWarn ? this.editForm.isWarn = '1' : this.editForm.isWarn = '0'
							let params = Object.assign({}, this.editForm); 
							editOmAppliance(params).then((res) => {
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
			//获取列表 OmCategory om_category
			getOmCategorys() {
				let params = {
					branchId:this.userInfo.branchId,
					status:'1'
				};
				listOmCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.omCategorys = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch( );
			},
			selectCategory(value){
				let filters = this.omCategorys.filter( (obj) => obj.id  == value )
				if(filters != null && filters.length > 0){
					this.editForm.categoryName = filters[0].name
				}
			},
			onChange: function(file,fileList){
				//console.log(file)
				//console.log(fileList)
				let list = []
				if(fileList != null && fileList.length > 0){
					this.editForm.imageUrl = fileList[0].url
				}
			},

			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'om-appliance-edit':OmApplianceEdit
			'upload': AttachmentUpload,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.omAppliance);  
			this.editForm.status == '1' ? this.editForm.status = true : this.editForm.status = false
			this.editForm.isWarn == '1' ? this.editForm.isWarn = true : this.editForm.isWarn = false
			this.getOmCategorys();
		}
	}

</script>

<style scoped>

</style>