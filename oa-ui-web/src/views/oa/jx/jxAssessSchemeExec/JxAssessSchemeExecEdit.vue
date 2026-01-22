<template>
	<section  class="page-container padding">
	    <el-row class="page-header padding-bottom">
			<font  style="font-size:18px;">{{editForm.name}}</font>
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 JxAssessSchemeExec 考核方案--> 
			<el-form :model="editForm"  size="small" label-position="top" :rules="editFormRules" ref="editFormRef"> 
				<el-form-item  label="年份" prop="year">
					    <el-date-picker :disabled="!!(jxAssessSchemeExec&&jxAssessSchemeExec.year)"
							v-model="editForm.year"
							type="year"
							value-format="yyyy"
							placeholder="选择年">
						</el-date-picker>
						
						<el-date-picker v-if="editForm.schemeType=='0'" :disabled="!!(jxAssessSchemeExec&&jxAssessSchemeExec.month)"
						v-model="editForm.month"
						type="month"
						format="M月"
						value-format="M"
						placeholder="选择月">
						</el-date-picker>
						
					<el-radio-group v-model="editForm.quarter" v-if="editForm.schemeType=='1'" :disabled="!!(jxAssessSchemeExec&&jxAssessSchemeExec.quarter)">
						<el-radio-button label="1">一季度</el-radio-button>
						<el-radio-button label="2">二季度</el-radio-button>
						<el-radio-button label="3">三季度</el-radio-button>
						<el-radio-button label="4">四季度</el-radio-button> 
					</el-radio-group>
					
					<el-radio-group v-model="editForm.semiAnnual" v-if="editForm.schemeType=='2'" :disabled="!!(jxAssessSchemeExec&&jxAssessSchemeExec.semiAnnual)">
						<el-radio-button label="1">上半年度</el-radio-button>
						<el-radio-button label="2">下半年度</el-radio-button> 
					</el-radio-group>
				</el-form-item> 
				 
              <el-form-item label="自评提交时间" prop="planStartDay">
                <el-row>
					 <el-date-picker v-model="editForm.startDate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>&nbsp;~&nbsp;
					 
					 <el-date-picker v-model="editForm.endDate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-row>
               </el-form-item>   
				<el-form-item label="说明" prop="remark">
					<el-input type="textarea" rows="6" v-model="editForm.remark" placeholder="说明"></el-input> 
					<el-checkbox v-model="editForm.remindStatus" true-label="1" false-label="0">提醒考核</el-checkbox> 
					<el-checkbox v-model="editForm.initStatus" true-label="1" false-label="0" disabled>是否已初始完毕</el-checkbox>  
 				</el-form-item>    
				<el-form-item label="状态" prop="execStatus">
					<el-select v-model="editForm.execStatus" placeholder="状态" :disabled="opType=='add'">
						<el-option value="0" label="初始"> </el-option>
						<el-option value="1" label="执行中"> </el-option>
						<el-option value="2" label="已结束"> </el-option> 
						<el-option value="3" label="已暂停"> </el-option> 
						<el-option value="4" label="已关闭"> </el-option> 
					</el-select>
				</el-form-item>  
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addJxAssessSchemeExec,editJxAssessSchemeExec } from '@/api/oa/jx/jxAssessSchemeExec';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //JxAssessSchemeExecEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['jxAssessSchemeExec','visible','opType','jxAssessScheme'],

		watch: {
	      'jxAssessSchemeExec':function( jxAssessSchemeExec ) {
	         

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      		this.initData()
	      	}
	      },
		  'editForm.year':function(){
			  this.initDate()
		  },
		  'editForm.month':function(){
			  
			  this.initDate()
		  },
		  'editForm.semiAnnual':function(){
			  
			  this.initDate()
		  },
		  'editForm.annual':function(){
			  
			  this.initDate()
		  }
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: 'id不能为空', trigger: 'change' }
					]
				},

				//编辑界面数据  JxAssessSchemeExec 考核方案
				editForm: {
					id:'',schemeType:'',planStartDay:'',planStartType:'',remark:'',planEndDay:'',planEndType:'',branchId:'',status:'',remindStatus:'',createdAt:'',updatedAt:'',schemeId:'',startDate:'',endDate:'',initStatus:'',execStatus:'',initDate:'',year:'',month:'',quarter:'',semiAnnual:'',annual:'',name:'',execUserNum:'',vouchUserNum:'',selfUserNum:'',reUserNum:'',templateId:'',templateName:'',autoInit:'',selfCnum:'',reCnum:'',vouchCnum:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交JxAssessSchemeExec 考核方案父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editJxAssessSchemeExec(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addJxAssessSchemeExec(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.editForm=res.data.data
                                        this.initData()
                                        this.currOpType="edit";
                                        this.$emit('submit');//  @submit="afterAddSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}
						});
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType 
                if(this.opType=='edit'){
					this.editForm = Object.assign({},this.jxAssessSchemeExec);
                }else{
					if(this.jxAssessSchemeExec){
						this.editForm = Object.assign({},this.jxAssessSchemeExec);
					}
					this.editForm.initStatus="0"
					this.editForm.status="0"
					this.editForm.execStatus="0"
					if(this.jxAssessScheme){ 
						this.editForm = Object.assign(this.editForm,this.jxAssessScheme);
						this.editForm.schemeId=this.jxAssessScheme.id  
					}
					this.editForm.id='' 
					this.editForm.initStatus="0"
					this.editForm.status="0"
					this.editForm.execStatus="0"
					var date=new Date();
					this.editForm.year=date.getFullYear()+'';
                }
            },
			initDate(){
				debugger;
				var year=this.editForm.year;
				if(!year){
					return;
				}
				var fieldName='';
				var fieldData='';
				var lastDate=new Date();
				if(this.editForm.schemeType=='0'){
					fieldName='month'
					fieldData=this.editForm[fieldName]
					if(!fieldData){
						return;
					}
					lastDate=new Date(year,parseInt(fieldData),0)

				}else if(this.editForm.schemeType=='1'){
					fieldName='quarter'
					fieldData=this.editForm[fieldName]
					if(!fieldData){
						return;
					}
					fieldData=parseInt(fieldData)
					var month=fieldData*3;
					lastDate=new Date(year,month,0)
				}else if(this.editForm.schemeType=='2'){
					fieldName='semiAnnual'
					fieldData=this.editForm[fieldName]
					if(!fieldData){
						return;
					}
					fieldData=parseInt(fieldData)
					var month=fieldData*6;
					lastDate=new Date(year,month,0)
				}else if(this.editForm.schemeType=='3'){
					fieldName='annual'
					lastDate=new Date(year,12,0)
				} 
				
				
				
				if(!fieldData){
					return;
				}
				if(!this.editForm.planStartDay){
					this.editForm.planStartDay=30
					this.editForm.planStartType="1"
				}
				if(!this.editForm.planEndDay){
					this.editForm.planEndDay=30
					this.editForm.planEndType='2'
				}
				var startDate=new Date();
				if(this.editForm.planStartType=='1'){
					startDate.setTime(lastDate.getTime()-this.editForm.planStartDay*24*60*60*1000);
				}else{
					startDate.setTime(lastDate.getTime()+this.editForm.planStartDay*24*60*60*1000);
				}
				var endDate=new Date();
				if(this.editForm.planEndType=='1'){
					endDate.setTime(lastDate.getTime()-this.editForm.planEndDay*24*60*60*1000);
				}else{
					endDate.setTime(lastDate.getTime()+this.editForm.planEndDay*24*60*60*1000);
				}
				this.editForm.startDate=util.formatDate(startDate,'yyyy-MM-dd HH:mm:ss')
				
				this.editForm.endDate=util.formatDate(endDate,'yyyy-MM-dd HH:mm:ss')

			}
			/**begin 在下面加自定义方法**/

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>