<template>
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="司机名 汽车名"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchCarDriverTpls">查询</el-button>
			<el-button type="primary" v-on:click="confirmTpls">确定</el-button>
		 
			<div class="page-tips">已选择：  
				<el-tag
					v-for="sel in sels"
					:key="sel.driverUsername"
					closable @close="unselectTpls(sel)">
					{{sel.driverUsername +'------'+ sel.carName}}
				</el-tag>
			</div>
		</el-row>
		<el-row class="page-main padding-top"> 
			<el-col :span="24">	
				<el-table :row-key="'id'" :data="tpls" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" style="width: 100%;" ref="tplTable">
					<el-table-column :reserve-selection="true"	type="selection" width="65"></el-table-column>
					<el-table-column type="index" width="65"></el-table-column>
					<el-table-column prop="carName" sortable label="汽车名" min-width="120" ></el-table-column> 
					<el-table-column prop="driverUsername" label="司机名字" min-width="150" ></el-table-column>

					<el-table-column label="汽车前照片" width="170" >
					<template slot-scope="scope">   
						 <!-- <el-popover
							placement="top-start"
							title=""
							width="200"
							trigger="hover"
							content="">
							<img :src="baseImageUrl + scope.row.carFrontImageUrl"/>
							<el-image  slot="reference" 
								style="width: 150px; height: 100px"
								:src="baseImageUrl + scope.row.carFrontImageUrl">
							</el-image>
						</el-popover>  -->
						<el-popover
							placement="top-start"
							title=""
							trigger="hover">
							<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carFrontImageUrl"/>
							<img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.carFrontImageUrl" :alt="baseImageUrl + scope.row.carFrontImageUrl" >
						</el-popover>        
						
                 	</template>
					</el-table-column>
					<el-table-column label="汽车后照片" width="170" >
						<template slot-scope="scope">   
							<el-popover
								placement="top-start"
								title=""
								trigger="hover">
								<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carBackImageUrl"/>
								<img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.carBackImageUrl" :alt="baseImageUrl + scope.row.carBackImageUrl" >
							</el-popover>          
							
						</template>
					</el-table-column>
					<el-table-column label="汽车内饰照片" width="170" >
						<template slot-scope="scope"> 
							<el-popover
								placement="top-start"
								title=""
								trigger="hover">
								<img style="width: 400px; height: auto" :src="baseImageUrl + scope.row.carInnerImageUrl"/>
								<img style="width: 150px; height: 100px" slot="reference" :src="baseImageUrl + scope.row.carInnerImageUrl" :alt="baseImageUrl + scope.row.carInnerImageUrl" >
							</el-popover>                   
						</template>
					</el-table-column>

					<el-table-column prop="driverSex" label="性别" min-width="80">
						<template slot-scope="scope">
							<el-tag v-text="scope.row.driverSex"></el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80" >
						<template slot-scope="scope">
							<el-tag v-if="scope.row.status=='1'">√</el-tag>
							<el-tag v-else>×</el-tag>
						</template>
					</el-table-column>  
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
			</el-col>
			<!-- <el-col :span="6">
					<el-table-column>
						<el-tag>汽车前照片:</el-tag>
						<el-image style="width: 300px; height: 220px" :src="src"></el-image>
					</el-table-column> 	
					<el-table-column>
						<el-tag>汽车后照片:</el-tag>
						<el-image style="width: 300px; height: 220px" :src="src"></el-image>
					</el-table-column> 	
					<el-table-column>
						<el-tag>汽车内照片:</el-tag>
						<el-image style="width: 300px; height: 220px" :src="src"></el-image>
					</el-table-column> 	
			</el-col> -->
		</el-row> 
	
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件 
	import DeptTree from '@/views/mdp/sys/dept/DeptTree.vue'; 
	import { mapGetters } from 'vuex' 
	import md5 from 'js-md5';
	import { getTplAndCarDriver } from '@/api/oa/car/carCarDriverTpl';
	import config from '@/common/config'
	
	export default {
		props:['isSingleUser','selectTplids'],
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			'selectTplids':function(selectTplids){
				if((selectTplids==null || selectTplids.length==0 ) && this.sels.length==0){
					return;
				}else if((selectTplids==null || selectTplids.length==0 ) && this.sels.length>0){
					this.$refs.tplTable.clearSelection();
					return;
				}
				var needSearch=false;
				if(selectTplids.length!=this.sels.length){
					needSearch=true
				}else{
					var selecteds=selectTplids.filter(i=> this.sels.some(k=>k.id==i) );
					if(selecteds.length!=selectTplids.length){
						needSearch=true
					}
				}
				if(needSearch==true){ 
					this.$refs.tplTable.clearSelection();
					this.needSetTableUserChecked=true;
					this.searchCarDriverTpls()
				}
				
			}
		},
		data() {
			return {
				filters: {
					key: '',
				},
				tpls: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				allSels:[],//所有选中的数据
				options:{sex:[],locked:[]},//下拉选择框的所有静态数据 options.sex,options.project
				
				/**begin 自定义属性请在下面加 请加备注**/
				baseImageUrl: config.getArcFileUploadBasePath() + '/',	
				deptTree:{//部门树相关参数设置
					deptNodeSelected:{},//部门树被选中的节点数据	
				}, 
				branch: {},//选中的机构
				needSetTableUserChecked:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data 
		
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				} 
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getTpls();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getTpls();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getTpls();
			},
			searchCarDriverTpls(){
				 this.pageInfo.count=true;
				 this.getTpls();
			},
			//获取列表
			getTpls() { 
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count,
					status: '1'
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key="%"+this.filters.key+"%";
				}

				
				console.log(params)
				this.load.list = true;
				getTplAndCarDriver(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.tpls = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$message({ message: '通讯错误', type: 'error' });
				});
			},

			//选择行
			selsChange: function (sels) {
				console.log(sels)
				this.sels=sels  
			}, 
			// setTableTplChecked(){
			// 	if(this.selectTplids.length<=0){
			// 		return;
			// 	}
			// 	this.selectTplids.forEach(u=>{
			// 		var selected=this.sels.find(i=>i.id==u);
			// 		var user=this.tpls.find(i=>i.id==u);
			// 		if(selected){ 
						 
			// 		}else if(user){
			// 			this.$refs.tplTable.toggleRowSelection(user,true);
			// 		}
			// 	}) 
			// },  
			confirmTpls: function(){
				if(this.sels.length<1){
					this.$message({ message: "请选择一个车辆与司机的组合", type: 'error' });
					return;
				}
				if(this.sels.length!=1){
					this.$message({ message: "最多只能选择一个车辆与司机的组合", type: 'error' });
					return;
				}
				this.$emit('confirmTpls',this.sels)
			},
			// branchRowClick: function(row, event, column){
			// 	if(this.branch==null || row.id!=this.branch.id){
			// 		this.branch=row
			// 		this.deptTree.deptNodeSelected={}
			// 		this.searchCarDriverTpls();
					
			// 	}  
			// },
			unselectTpls:function(tpl){  
				this.$refs.tplTable.toggleRowSelection(tpl,false); 
			},
			 
			/**begin 自定义函数请在下面加**/
			
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		    'dept-tree': DeptTree,  
		    //在下面添加其它组件
		},
		mounted() {
			// if(this.selectTplids && this.selectTplids.length>0){
			// 	 this.needSetTableUserChecked=true;
			// }
			//this.branch={id:this.userInfo.branchId,branchName:this.userInfo.branchName}
			/**在下面写其它函数***/
			this.getTpls(); 
			
		}
	}

</script>

<style scoped>
.selected-tag {
	margin-top: 14px; 
	margin-left:14px;
}
</style>