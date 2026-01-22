<template>
	<section class="page-container border padding">
		<el-row>
			<el-select clearable  v-model="filters.htStatus" placeholder="合同状态">
				<el-option
				v-for="item in dicts.contractStatus"
				:key="item.id"
				:label="item.name"
				:value="item.id">
				</el-option>
			</el-select>
			<contract-type-select  v-model="filters.htType">
			</contract-type-select>
			<el-input v-model="filters.key" placeholder="名称、编号查询" style="width:20%;"></el-input>
			<el-button type="primary" icon="el-icon-search" v-loading="load.list" :disabled="load.list==true"
				v-on:click="searchContractCards">查询</el-button>
		</el-row>
		<el-row class="page-main padding-top">
			<!--列表 ContractCard ht_contract_card-->
			<el-table :data="contractCards" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="htName" label="合同名称" min-width="120" ></el-table-column>
				<el-table-column prop="htSn" label="合同编号" min-width="80" ></el-table-column>
				<el-table-column prop="cpName" label="相对方" min-width="80" ></el-table-column> 
				<el-table-column prop="htStatus"  label="合同状态" width="100">
				<template slot-scope="scope">
					<span>{{dicts.contractStatus[scope.row.htStatus]?dicts.contractStatus[scope.row.htStatus].name:scope.row.htStatus}}</span>
				</template>
				</el-table-column>
				<el-table-column prop="htFzUsername"  label="负责人" min-width="80"></el-table-column>
				<el-table-column prop="htSignDate"  label="签订日期" min-width="80"></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listContractCard} from '@/api/oa/ht/contractCard';
	import { mapGetters } from 'vuex'
  	import ContractTypeSelect from '../contractType/ContractTypeSelect'; //合同卡片明细
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props:['visible','htParentType'],
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
					key: '',
					htType:'',
					htStatus:'',
				},
				contractCards: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				dicts: {contractStatus:[]}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

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
				
				if (this.filters.key !== "") {
					params.key=this.filters.key
				}  
				
				if (this.filters.htStatus !== "") {
					params.htStatus=this.filters.htStatus
				}  
				
				if (this.filters.htType !== "") {
					params.htType=this.filters.htType
				} 
				if(this.htParentType){
					params.htParentType=this.htParentType
				}
				

				this.load.list = true;
				listContractCard(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.contractCards = res.data.data;
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
			/**end 自定义函数请在上面加**/
			
		},//end methods
        
        components: { 
			ContractTypeSelect
        },
        
		mounted() { 
			this.$nextTick(() => {
      			initSimpleDicts('all',['costType','amountType','productType','contractStatus']).then(res=>this.dicts=res.data.data); 
				this.getContractCards();
        	}); 
		}
	}

</script>

<style scoped>

</style>
