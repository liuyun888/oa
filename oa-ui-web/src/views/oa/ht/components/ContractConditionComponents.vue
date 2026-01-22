<template>
	<section class="page-container border padding">
		<el-row class="page-main padding-top">
			<!--列表 ContractCard ht_contract_card-->
			<el-table :data="contractCondition" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="conditionType" label="款项类别"  width="120" >
					<template slot-scope="scope">
						{{getConditionTypeName(scope.row)}}
					</template>
				</el-table-column>
				<el-table-column prop="conditionTiaoJian" label="款项条件" min-width="120" ></el-table-column>
				<el-table-column prop="conditionAmount" label="款项金额" min-width="80" >
					<template slot-scope="scope">
						￥{{scope.row.conditionAmount}}
					</template>
				</el-table-column> 
				<el-table-column prop="requireAmount" label="已申请金额" min-width="80" >
					<template slot-scope="scope">
						￥{{scope.row.requireAmount}}
					</template>
				</el-table-column> 
				<el-table-column prop="invoicedAmount" label="已开票金额" min-width="80" >
					<template slot-scope="scope">
						￥{{scope.row.invoicedAmount}}
					</template>
				</el-table-column> 
				
				<el-table-column prop="finishAmount" label="已完成金额" min-width="80" >
					<template slot-scope="scope">
						￥{{scope.row.finishAmount}}
					</template>
				</el-table-column>   
				<el-table-column  align="left" label="状态">
					<template slot-scope="scope"> 
						<el-tag v-if="scope.row.conditionStatus=='0'||scope.row.conditionStatus==''||scope.row.conditionStatus==null" type="primary">{{getConditionStatusName(scope.row)}}</el-tag>
						<el-tag v-else-if="scope.row.conditionStatus=='1'" type="warning">{{getConditionStatusName(scope.row)}}</el-tag>
						<el-tag v-else-if="scope.row.conditionStatus=='2'" type="success">{{getConditionStatusName(scope.row)}}</el-tag>
						<el-tag v-else type="info">{{getConditionStatusName(scope.row)}}</el-tag> 
					</template>
				</el-table-column>
				
				<el-table-column prop="forecastDate" align="left" label="预计完成日期"> 
				</el-table-column> 
				<el-table-column prop="finishDate" label="完成日期" min-width="80" > 
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listContractCondition} from '@/api/oa/ht/contractCondition';
	import { mapGetters } from 'vuex'
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props:['visible','htId'],
        watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.$nextTick(() => {
                    this.getContractCards();
                }); 
	      	}
	      } 
	    },
		data() {
			return {
				filters: {
					key: ''
				},
				contractCondition: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				dicts:{
					amountType:[],
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getContractCards();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getContractCards();
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
				this.getContractCards();
			},
			searchContractCards(){
				 this.pageInfo.count=true; 
				 this.getContractCards();
			},
			//获取列表 ContractCard ht_contract_card
			getContractCards() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				if(this.htId){
					params.htId=this.htId
				}else{
					return;
				}
				this.load.list = true;
				listContractCondition(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
                        this.contractCondition = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			selsChange() {
				
			},
			getConditionTypeName(row){
				var amountType=this.dicts.amountType.find(i=>i.id==row.conditionType);
				if(amountType){
					return amountType.name
				}else{
					return row.conditionType
				}
			},
			getConditionStatusName(row){
				if(row.dct=='1'){
					if(row.conditionStatus=='0'){
						return "初始"
					}else if(row.conditionStatus=='1'){
						return "待收款"
					}else{
						return "已收款"
					}
				}else{
					if(row.conditionStatus=='0'){
						return "初始"
					}else if(row.conditionStatus=='1'){
						return "待付款"
					}else{
						return "已付款"
					}
				} 
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
        
        components: { 
        },
        
		mounted() { 
			initSimpleDicts('all',[ 'amountType' ]).then(res=>this.dicts=res.data.data); 
			this.$nextTick(() => {
				this.getContractCards();
        	}); 
		}
	}

</script>

<style scoped>

</style>
