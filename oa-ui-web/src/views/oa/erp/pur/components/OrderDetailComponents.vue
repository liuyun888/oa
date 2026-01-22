<template> 
	<section class="page-container border padding">
		<el-row class="page-header">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchOrderDetails">查询</el-button>
			<el-button  @click.native="handleCancel">取消</el-button>
			<el-button type="primary"  @click="addSubmit">提交</el-button>
		</el-row>
		<el-row class="page-main padding-top">
			<!--列表 OrderDetail pur_order_detail-->
			<el-table :data="orderDetails" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="purOrderId" label="采购单编号" min-width="80" ></el-table-column>
                <el-table-column prop="assetName" label="资产名称" min-width="80" ></el-table-column>
				<el-table-column prop="spec" label="规格型号" min-width="80" ></el-table-column>
				<el-table-column prop="stockNum" label="采购数量" min-width="80" ></el-table-column>
                <el-table-column prop="reachNum" label="已到数量" min-width="80" ></el-table-column>
                <el-table-column prop="orignUnitAmount" label="单价" min-width="80" ></el-table-column>
                <el-table-column prop="purchaseDate" label="日期" min-width="80" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listOrderDetail} from '@/api/oa/erp/pur/orderDetail';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				orderDetails: [],//查询结果
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
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data

		props:['visible','purOrderId'],	

		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
				this.$nextTick(() => {
					this.getOrderDetails();
				}); 
	      	}
	      } 
	    },

		methods: {

            handleCancel:function(){
				this.$emit('cancel');
			},

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getOrderDetails();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOrderDetails();
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
				this.getOrderDetails();
			},
			searchOrderDetails(){
				 this.pageInfo.count=true; 
				 this.getOrderDetails();
            },
            

			//获取列表 OrderDetail pur_order_detail
			getOrderDetails() {
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
				if(this.purOrderId){
					params.purOrderId=this.purOrderId
				}
				this.load.list = true;
				listOrderDetail(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.orderDetails = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行orderDetail
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			
            rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
            },
            
			/**begin 自定义函数请在下面加**/
            addSubmit: function() {
                this.$emit('add-submit', this.sels);//  @row-click="rowClick"
            }
                

			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getOrderDetails();
        	}); 
		}
	}

</script>

<style scoped>

</style>