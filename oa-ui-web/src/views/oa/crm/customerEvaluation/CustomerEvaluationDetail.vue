<template>
	<section class="page-container border padding">
		<el-row class="page-main padding-top">

			<!--列表 CustomerEvaluation crm_customer_evaluation-->
			<el-table :summary-method="getSummaries" show-summary :data="customerEvaluations"  highlight-current-row v-loading="load.list" border style="width: 100%;">
				<el-table-column prop="name" label="名称" min-width="80" ></el-table-column>
				<el-table-column label="打分" min-width="80">
                    <template slot-scope="row">
                        <el-select @change="selectLevel($event, row.$index)"  v-model="customerEvaluations[row.$index].levelName" placeholder="请选择">
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="{ value: item.value, label: item.label }"
                            >
                            </el-option>
                        </el-select>
					</template>
                </el-table-column>

				<el-table-column prop="value" label="分值" min-width="80" >
                </el-table-column>

				<el-table-column prop="" label="权重" min-width="80" >
                    <template slot-scope="scope">
                        <span>{{scope.row.proportion}}%</span>
                    </template>
                </el-table-column>
				<el-table-column prop="score" label="得分" min-width="80" ></el-table-column>
			</el-table>
		
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listCustomerEvaluation, addCustomerEvaluation } from '@/api/oa/crm/customerEvaluation';
	import  CustomerEvaluationEdit from './CustomerEvaluationEdit';//修改界面
    import { mapGetters } from 'vuex'
    import {Decimal} from 'decimal.js';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        props:['customer','visible'],
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
    
		data() {
			return {
				filters: {
					key: ''
				},
				customerEvaluations: [],//查询结果
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
				editFormVisible: false,//编辑界面是否显示
				//编辑customerEvaluation界面初始化数据
				editForm: {
					id:'',customerId:'',temId:'',level:'',score:''
                },
                
				/**begin 自定义属性请在下面加 请加备注**/
                levelOptions: [
                    {
                        label: '差',
                        value: "1",
                    },
                    {
                        label: '一般',
                        value: "2",
                    },
                    {
                        label: '中等',
                        value: "3",
                    },
                    {
                        label: '良好',
                        value: "4",
                    },
                    {
                        label: '优秀',
                        value: "5",
                    },
                ]
                
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getCustomerEvaluations();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCustomerEvaluations();
			},
			
			searchCustomerEvaluations(){
				 this.pageInfo.count=true; 
				 this.getCustomerEvaluations();
            },
            
			//获取列表 CustomerEvaluation crm_customer_evaluation
			getCustomerEvaluations() {
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
				listCustomerEvaluation(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
                        this.customerEvaluations = res.data.data;

                        if(this.customerEvaluations.length > 0) {
                            this.customerEvaluations.forEach(params => {
                                params.customerId = this.customer.customerId;
                                if(this.isNull(params.level)) {
                                    params.level = "1";
                                    params.levelName = '差';
                                    params.value = "1";
                                    params.score = Number(new Decimal(params.level).mul(new Decimal(params.proportion).div(100)));
                                }
                            })
                        }
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
            },
            
			/**begin 自定义函数请在下面加**/
            //选择登记值
            selectLevel(data, index) {
                const { value, label } = data;
                this.customerEvaluations[index].level = value;
                this.customerEvaluations[index].levelName = label;
                this.customerEvaluations[index].value = value;
                let count = Number(new Decimal(this.customerEvaluations[index].level).mul(new Decimal(this.customerEvaluations[index].proportion).div(100)));
                this.$set(this.customerEvaluations[index], "score", count);
            },

            getSummaries(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];

                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                   
                    if (index === 2) {
                        sums[index] = '';
                        return;
					}

					if (index === 3) {
                        sums[index] = '';
                        return;
					}

					if (index === 4) {
                        let amount = new Decimal(0);
                        param.data.forEach(p => {
                            if(this.isNull(p.score)) {
                                p.score = 0;
                            }
                            amount = amount.plus(p.score);
                        })
						sums[index] = Number(amount);
                        return;
					}
                });
                return sums;
			},

            //自定义合计

            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },

            //提交
            submit() {
                this.$confirm('确认更新吗？', '提示', {}).then(() => {
                    this.load.add=true
                    addCustomerEvaluation(this.customerEvaluations).then((res) => {
                        this.load.add=false
                        var tips=res.data.tips;
                        if(tips.isOk){
                            // this.$refs['addForm'].resetFields();
                            this.$emit('submit');//  @submit="afterAddSubmit"
                        }
                        this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                    }).catch( err  => this.load.add=false);
                });
            },


				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'customer-evaluation-edit':CustomerEvaluationEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCustomerEvaluations();
        	}); 
		}
	}

</script>

<style scoped>

</style>