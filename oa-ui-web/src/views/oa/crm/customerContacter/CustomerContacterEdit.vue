<template>
	<section>
		 <el-row class="page-container border padding">
			<el-col :span="leftSpan">
				<el-form class="leftForm"  :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="姓名" prop="contacterName">
								<el-input v-model="editForm.contacterName" placeholder="姓名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="称呼" prop="titleName">
								<el-input @focus="customerCallVisible=true" v-model="editForm.titleName" placeholder="称呼"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="别名" prop="anotherName">
								<el-input v-model="editForm.anotherName" placeholder="别名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="岗位" prop="jobTitle">
								<el-input v-model="editForm.jobTitle" placeholder="岗位"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="项目角色" prop="projectRole">
								<el-input v-model="editForm.projectRole" placeholder="项目角色"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="意向判断" prop="attitude">
								<el-input v-model="editForm.attitude" placeholder="意向判断"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="关注点" prop="attention">
								<el-input v-model="editForm.attention" placeholder="关注点"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="电子邮件" prop="contacterEmail">
								<el-input v-model="editForm.contacterEmail" placeholder="电子邮件"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="办公室电话" prop="phoneOffice">
								<el-input v-model="editForm.phoneOffice" placeholder="办公室电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="住宅电话" prop="phoneHome">
								<el-input v-model="editForm.phoneHome" placeholder="住宅电话"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="移动电话" prop="mobilePhone">
								<el-input v-model="editForm.mobilePhone" placeholder="移动电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="传真" prop="contacterFax">
								<el-input v-model="editForm.contacterFax" placeholder="传真"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="IM号码" prop="imcode">
								<el-input v-model="editForm.imcode" placeholder="移动电话"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-divider content-position="center">自定义信息</el-divider>

					<el-row>
						<el-col :span="12">
							<el-form-item label="出生年月" prop="birthday">
								<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthday"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="生日提醒前几天" prop="birthdayNotifydays">
								<el-input-number  v-model="editForm.birthdayNotifydays" :min="0" :max="200"></el-input-number>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="语言" prop="contacterLanguage">
								<el-select  v-model="editForm.contacterLanguage" placeholder="请选择">
									<el-option
										v-for="item in languageOptions"
										:key="item.optionValue"
										:label="item.optionName"
										:value="item.optionValue">
									</el-option>
								</el-select>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="是否主联系人" prop="isMain">
								<el-checkbox true-label="1" false-label="0" v-model="editForm.isMain"></el-checkbox>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="是否人脉" prop="isPerson">
								<el-checkbox true-label="1" false-label="0" v-model="editForm.isPerson"></el-checkbox>
							</el-form-item> 
						</el-col>

						<el-col :span="12">
							<el-form-item label="备注文档" prop="remarkDoc">
								<el-input  @focus="openDocSelect" v-model="editForm.remarkDocName"></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="4" v-model="editForm.remark" placeholder="备注"></el-input>
							</el-form-item> 
						</el-col>
					</el-row>

					<!-- <div v-show="isShowRightMenu" :style="{'top': menuTop}" class="rightMenu" @click="openRightDrawer">
					</div> -->

				</el-form>
			</el-col>

			<!-- 从右侧抽屉跳转的数据不显示该组件，防止递归调用 -->
			<!-- <el-col v-if="isShowRightNav " class="rightNav" :span="rightSpan">
				<right-drawer-components :isShowAll="isShowAll" :visible="isShowRightNav" :customerName="customerContacter.customerName"  :customerId="customerContacter.customerId"></right-drawer-components>
			</el-col> -->

			<el-dialog append-to-body  title="称呼"  top="2vh" :visible.sync="customerCallVisible" width="50%" :close-on-click-modal="false">
				<customer-base-data-components @getRowClick="getRowClickData" :visible="customerCallVisible" :type="callType">
				</customer-base-data-components>
			</el-dialog>

			<archive-select-components  @get-archive-data="getArchiveData" ref="archiveSelect">
			</archive-select-components>

			

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editCustomerContacter} from '@/api/oa/crm/customerContacter';
	import CustomerBaseDataComponents from '../components/CustomerBaseDataComponents';
	import ArchiveSelectComponents from '../components/ArchiveSelectComponents';
	import RightDrawerComponents from '../components/RightDrawerComponents';
	import { mapGetters } from 'vuex'
	
	export default {  
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['customerContacter','visible'],
		watch: {
	      'customerContacter':function( customerContacter ) {
	        this.editForm = customerContacter;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					contacterId: [
						//{ required: true, message: '联系人id不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  CustomerContacter crm_customer_contacter
				editForm: {
					contacterId:'',contacterName:'',customerId:'',customerName:'',title:'',titleName:'',anotherName:'',firstName:'',jobTitle:'',projectRole:'',attitude:'',attention:'',contacterEmail:'',phoneOffice:'',phoneHome:'',mobilePhone:'',contacterFax:'',imcode:'',birthday:'',birthdayNotifydays:'',contacterLanguage:'',isMain:'',isPerson:'',remark:'',remarkDoc:'', remarkDocName:'', parentId: '', branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				isShowRightMenu: true,
				menuTop: "0px",
				leftSpan: 24,
				rightSpan: 7,
				isShowRightNav: false,
				isShowAll: 'lower',
				customerCallVisible:false,
				callType: 'call',
				//语言
				languageOptions: [],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){ 
				this.$refs['editForm'].resetFields(); 
				this.$emit('cancel');
			},
			//编辑提交CustomerContacter crm_customer_contacter父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({},this.editForm); 
							editCustomerContacter(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit', this.editForm);//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},


			

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//开启右侧抽屉
			openRightDrawer() {
				this.isShowRightNav = !this.isShowRightNav;
				this.isShowRightNav ? this.leftSpan = 17 : this.leftSpan = 24;
			},

			//展示右侧按钮
			showMenu() {
				this.$nextTick(() => {
					this.isShowRightMenu = true;
					this.menuTop = (this.$refs.editForm.$el.clientHeight / 2 - 10) + "px";
				})
			},

			//获取点击数据
			getRowClickData (row, type) {
				switch(type) {
					case 'call':
						this.customerCallVisible = false;
						this.editForm.title = row.id;
						this.editForm.titleName = row.text;
					break;
				}
			},

			getOption() {
                let params = [
					{ categoryId: "all", itemCode: "language" },
                ];
                listOption(params).then(res => {
					this.languageOptions = res.data.data.language;
                });
			},

			openDocSelect() {
				this.$refs.archiveSelect.openDialog();
			},

			getArchiveData(data) {
				this.editForm.remarkDoc = data.archiveId;
				this.editForm.remarkDocName = data.archiveTitle;
			},


			/**end 在上面加自定义方法**/
		},//end method
		components: {
			//在下面添加其它组件 'customer-contacter-edit':CustomerContacterEdit
			'customer-base-data-components': CustomerBaseDataComponents,
			'archive-select-components' : ArchiveSelectComponents,
			'right-drawer-components' : RightDrawerComponents
		},

		mounted() {
			this.editForm=Object.assign(this.editForm, this.customerContacter);
			this.showMenu();
			this.getOption();
		}
	}

</script>

<style scoped>
.leftForm {
	position: relative;
}

.rightMenu {
	font-size: 40px;
	color: royalblue;
	position: absolute;
	cursor: pointer;
	z-index: 2;
	right: 0px;
	height: 58px;
	padding: 10px;
	background: url('../customer/img/show-hover.png') -2px 0px no-repeat;
}

</style>