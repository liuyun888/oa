<template>
	<section >
		  <el-select clearable size="mini" v-model="conditionId" style="width:100%;" :disabled="disabled">
				<el-option
				v-for="item in contractCondition"
				:key="item.conditionId"
				:label="item.conditionTiaoJian+'  '+getShowTips(item)"
				:value="item.conditionId">
				<span style="float: left">{{ item.conditionTiaoJian }}</span>
				<span style="float: right; color: #8492a6; font-size: 13px">{{ getShowTips(item) }}</span>
				</el-option>
			</el-select>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listContractCondition} from '@/api/oa/ht/contractCondition';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props:['htId','value','disabled'],
        watch: {
	      'htId':function(htId) { 
	      	 this.getContractConditions();
	      },
		  'conditionId':function(conditionId) { 
	      	 this.$emit('input',conditionId)
			 this.$emit('selected',this.contractCondition.find(i=>i.conditionId==conditionId))
	      },
		  'value':function(value) { 
	      	 this.conditionId=value
	      },
	    },
		data() {
			return {
				filters: {
					key: ''
				},
				conditionId:'',
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

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getContractConditions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getContractConditions();
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
				this.getContractConditions();
			},
			searchContractCards(){
				 this.pageInfo.count=true; 
				 this.getContractConditions();
			},
			//获取列表 ContractCard ht_contract_card
			getContractConditions() {
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
			},
			getShowTips(item){
				if(item.dct=='1'){
					return '应收金额￥'+ item.conditionAmount+' 已申请￥'+item.requireAmount+' 已开票￥'+item.invoicedAmount+' 已收款￥'+item.finishAmount+' 状态：'+this.getConditionStatusName(item);
				}else{
					return '应付金额￥'+ item.conditionAmount+' 已申请￥'+item.requireAmount+' 已收票￥'+item.invoicedAmount+' 已付款￥'+item.finishAmount+' 状态：'+this.getConditionStatusName(item);
				}
				
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
        
        components: { 
        },
        
		mounted() { 
			this.$nextTick(() => {
				this.getContractConditions();
        	}); 
		}
	}

</script>

<style scoped>

</style>
