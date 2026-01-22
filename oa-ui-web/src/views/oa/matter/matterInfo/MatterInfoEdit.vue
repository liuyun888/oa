<template>
	<section>
		<div class="content">
		   <div class="smallContent">
		       <div class="bigtitle">管理事项</div>
			   <div class="titlediv">
			       <span class="main_title">事项库管理</span>
			       <span class="second_tile">/&nbsp;管理事项</span>
			   </div>
			   <el-form  label-position="left"  label-width="80px">
			   <div class="form_context">
			       <div class="form_title">
			           <span>基本信息</span>
			       </div>
			       <div>
			          <el-form-item label="专业名称">
                          <el-input v-model="matterInfo.majorName" size="small" style="width:300px;"></el-input>
				      </el-form-item>
				      <el-form-item label="业务名称">
                          <el-input v-model="matterInfo.businessName" size="small" style="width:300px;"></el-input>
				      </el-form-item>
				      <el-form-item label="公司手册">
                          <el-input v-model="matterInfo.companyHandbook" size="small" style="width:300px;"></el-input>
				      </el-form-item>
			       </div>
			       <div class="form_title">
			           <span>检查项目</span>
			       </div>
			       <div>
			            <el-row style="margin-bottom:20px;">
						  <el-col :span="5">
						      <el-button size="small" type="primary" @click="addItemFormVisible=true" plain>添加检查项目</el-button>
						  </el-col>
						  <el-col :span="11">
						       <el-button size="small" type="primary" plain>添加检查内容</el-button>
						  </el-col>
						  <el-col :span="8">
						      <el-button size="small" type="primary" plain>添加检查标准</el-button>
						  </el-col>
						</el-row>
			            <el-row>
						  <el-col :span="5">
						      <el-table ref="itemTable"  highlight-current-row @row-click="clickItem" size="small" :data="inspectItemList" height="450" border style="width: 100%">
							    <el-table-column prop="orderNumber" label="序号" min-width="50">
							    </el-table-column>
							    <el-table-column  prop="name" label="检查项目" min-width="180">
							    </el-table-column>
							  </el-table>
						  </el-col>
						  <el-col :span="11">
						     <el-table ref="contentTable" highlight-current-row @row-click="clickContent" size="small" :data="inspectContentList" height="450" border style="width: 100%">
							    <el-table-column prop="serialNumber" label="编号" min-width="90">
							    </el-table-column>
							    <el-table-column  prop="contentName" label="检查内容" min-width="180">
							    </el-table-column>
							    <el-table-column  prop="inspectMethod" label="检查方法" min-width="180">
							    </el-table-column>
							    <el-table-column  label="检查频次">
							       <el-table-column prop="legalFrequency" label="法定频次">
							       </el-table-column>
							       <el-table-column prop="adviseFrequency" label="建议频次">
							       </el-table-column>
							    </el-table-column>
							    <el-table-column prop="remarks" label="备注">
							    </el-table-column>
							  </el-table>
						  </el-col>
						  <el-col :span="8">
						      <el-table size="small" :data="inspectStandardList" height="450" border style="width: 100%">
							    <el-table-column  prop="standard" label="检查标准" min-width="180">
							        <!--<template slot-scope="scope">
							          <el-input type="textarea" v-model="scope.row.standard"></el-input>
					                </template>-->
							    </el-table-column>
							    <el-table-column  label="检查依据">
							       <el-table-column  prop="accordingName" label="依据名称">
							       </el-table-column>
							       <el-table-column  prop="clause" label="依据条款">
							       </el-table-column>
							    </el-table-column>
							  </el-table>
						  </el-col>
						</el-row>
			       </div>
			       <div class="bottomdiv">
				      <el-button size="small" style="width: 119px;" type="primary" @click="editSubmit" :loading="editSubmitLoading">提交</el-button>
				   </div>
			   </div>
			   
			   </el-form>
		   </div>
		</div>
		
		<!--新增 MatterInspectItem 检查项目界面-->
		<el-dialog title="新增" :visible.sync="addItemFormVisible"  width="50%"  :close-on-click-modal="false">
			<matter-inspect-item-add :matter-inspect-item="addForm" :visible="addItemFormVisible" @cancel="addItemFormVisible=false" @submit="afterAddSubmit"></matter-inspect-item-add>
		</el-dialog> 
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
    import { getMatterInfo,editMatterInfo} from '../../../../api/oa/matter/matterInfo';
    import { listMatterInspectContent } from '../../../../api/oa/matter/matterInspectContent';
	import { listMatterInspectStandard } from '../../../../api/oa/matter/matterInspectStandard';
	import  MatterInspectItemAdd from '../matterInspectItem/MatterInspectItemAdd';//新增界面
	
	export default {
		props:[],
		watch: {

	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				id:"",
				matterInfo:{},
				inspectItemList:[],
				inspectContentList:[],
				inspectStandardList:[],
				
				tempContentAndStandardList:[],
				tempId:"",
				n:1,
				editSubmitLoading:false,
				addItemFormVisible:false
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getMatterInfoFun() {
				let params = {
					id:this.id
				};
				getMatterInfo(params).then((res) => {
					var tips=res.data.tips;
					console.log(res.data);
					if(tips.isOk){ 
						this.matterInfo=res.data.data.matterInfo;
						this.inspectItemList=res.data.data.itemList;
						this.inspectContentList=res.data.data.contentList;
						this.inspectStandardList=res.data.data.standardList;
						
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			setCurrent(row){
			    this.$refs.contentTable.setCurrentRow(row);
			},
			clickItem(row, event, column){
			   let params={itemId:row.id};
			   listMatterInspectContent(params).then((res) => {
					var tips=res.data.tips;
					console.log(res.data);
					if(tips.isOk){ 
						this.inspectContentList = res.data.data;
						this.inspectStandardList=[];
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			clickContent(row, event, column){
			    let params={contentId:row.id};
			    listMatterInspectStandard(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.inspectStandardList = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					this.$message({ message: '你已取消操作', type: 'info' });
				});
			},
			//编辑提交MatterInfo 事项库-事项基本信息父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let params = Object.assign({}, this.matterInfo);
							this.editSubmitLoading=true; 
							editMatterInfo(params).then((res) => {
								var tips=res.data.tips;
								this.editSubmitLoading=false; 
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
							   this.editSubmitLoading=false; 
							});
						});
			},
			
			/*getContentStandard(){
			    var clist=this.inspectContentList;
			    var slist=this.inspectStandardList;
			    for(var i=0;i<slist.length;i++){
			       for(var j=0;j<clist.length;j++){
			          if(slist[i].contentId==clist[j].id){
			              var map=Object.assign({}, clist[j]);
			              map.accordingName=slist[i].accordingName;
			              map.clause=slist[i].clause;
			              map.standard=slist[i].standard;
			              //console.log(map);
			              this.tempContentAndStandardList.push(map);
			              break;
			          }
			       }
			    }
			    console.log(this.tempContentAndStandardList);
			}*/
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'matter-info-edit':MatterInfoEdit
		    'matter-inspect-item-add':MatterInspectItemAdd
		},
		mounted() {
			var s=this.$route.query;
		    this.id=s.id;
		    this.$nextTick(() => {
		        this.getMatterInfoFun();
		        
        	});
        	
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.editForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>
        .content{
        position:absolute; 
        width:100%; 
        background-color:#f6f8f9;
        left:0; 
        top:0;
    }
    .smallContent{
        padding: 30px 128px;
    }
    .bigtitle{
       font-size: 26px;
    }
    .main_title{
       color: #44b549;
    }
    .second_tile{
       color: #9a9a9a;
    }
    .titlediv{
       padding: 26px 0px 40px;
    }
    .form_context{
       margin-bottom: 30px;
       background-color: #fff;
       -moz-border-radius: 3px;
       -webkit-border-radius: 3px;
       box-shadow: 0 1px 5px 0 rgba(0,0,0,0.05);
       padding: 40px;
    }
    .form_title{
        font-size: 14px;
	    height: 32px;
	    line-height: 32px;
	    border-bottom: 1px solid #e7e7eb;
	    margin-bottom: 25px;
	    font-weight: normal;
    }
    .form_intro{
        color: #8d8d8d;
	    margin-left: 1em;
	    font-weight: normal;
    }
    .shuomingtext{
      color: #8b8e8e;
      line-height: 24px;
   }
   .shuomingtext_red{
      color: #e25b5b;
      line-height: 24px;
   }
   .bottomdiv{
      border-top: 1px solid #e7e7eb;
      padding-top: 20px;
      text-align: center;
   }
</style>