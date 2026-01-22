<template>
	<section class="page-container border padding">
		<el-row class="page-main padding-top">
			<!--列表 CustomerOpertion crm_customer_opertion-->
			<el-table :data="customerOpertions" @sort-change="sortChange" highlight-current-row v-loading="load.list" border  @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="operTime" label="操作时间" min-width="80" ></el-table-column>
				<el-table-column prop="operUserName" label="操作人" min-width="80" ></el-table-column>
				<el-table-column prop="ipAddress" label="ip地址" min-width="80" ></el-table-column>
				<el-table-column prop="changeMsg" label="改变" min-width="80" ></el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky'; // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listCustomerOpertion} from '@/api/oa/crm/customerOpertion';
	import { mapGetters } from 'vuex';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props:['customer','visible'],
		watch: {
	      'customer':function( customer ) {
	        this.customerObj = customer;
          },
          
	      'visible':function(visible) { 
	      	if(visible==true){
                  //从新打开页面时某些数据需要重新加载，可以在这里添加
                this.$nextTick(() => {
				    this.getCustomerOpertions();
        	    });
	      	}
	      } 
	    },


		data() {
			return {
				filters: {
					key: ''
				},
				customerOpertions: [],//查询结果
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
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getCustomerOpertions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCustomerOpertions();
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
				this.getCustomerOpertions();
			},
			searchCustomerOpertions(){
				 this.pageInfo.count=true; 
				 this.getCustomerOpertions();
			},
			//获取列表 CustomerOpertion crm_customer_opertion
			getCustomerOpertions() {
                //默认倒序排序
                this.pageInfo.orderFields.push('oper_time');
                this.pageInfo.orderDirs.push('desc');
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
                    count:this.pageInfo.count,
                    customerId: this.customer.customerId
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
				this.load.list = true;
				listCustomerOpertion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
                        this.customerOpertions = res.data.data;
                        //不需要显示出来的数组
                        let excludeArr = ['customerStatus', 'customerType', 'description', 'size', 'source', 'sectorId',
                            'managerUserId', 'agentId', 'parentId', 'customerDocId', 'customerIntroductiondocId', 
							'securityLevel', 'updateTime']

                        this.customerOpertions.forEach(item => {
							let obj = {};
							if(!this.isNull(item.changeValue)) {
								obj = JSON.parse(item.changeValue);
							}
							let changeMsg = item.operType === 'create' ? '创建' : item.operType === 'delete'? '删除' : '更新';
							let temp = "";
                            if(obj.length > 0 && !this.isNull(obj)) {
                                obj.forEach(o => {
                                    if(excludeArr.indexOf(o.name) !== -1) {
                                        return;
									}
									//日期修改
									if(o.name === 'birthday') {
										o.old = !this.isNull(o.old) ? this.timestampToTime(o.old) : '';
										o.new = !this.isNull(o.new) ? this.timestampToTime(o.new) : '';
									}
									if(item.operType !== 'create') {
                                    	temp += "将 "+(this.isNull(o.doc) ? '空' : o.doc)+" 由 "+ (this.isNull(o.old) ? '空' : o.old) +" 更新为" + (this.isNull(o.new) ? '空' : o.new) + ", ";
									}
								})
                                changeMsg += temp;
                            }
                            item.changeMsg = changeMsg;
                        })
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
            },
            
			/**begin 自定义函数请在下面加**/
            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
			},

			timestampToTime(time = +new Date()) {
				var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
				return date.toJSON().substr(0, 19).replace('T', ' ');
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCustomerOpertions();
        	}); 
		}
	}

</script>

<style scoped>

</style>