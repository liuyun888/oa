<template>
	<section class="page-container border padding">

		<el-row class="page-main padding-top"> 
			<!--列表 CustomerAddress crm_customer_address-->
			<el-table :data="customerAddresss" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column prop="country" label="国家" min-width="80" ></el-table-column>
				<el-table-column prop="province" label="省份" min-width="80" ></el-table-column>
				<el-table-column prop="city" label="城市" min-width="80" ></el-table-column>
				<el-table-column prop="district" label="区县" min-width="80" ></el-table-column>
				<el-table-column prop="street" label="街道" min-width="80" ></el-table-column>
				<el-table-column prop="address" label="地址" min-width="80" ></el-table-column>
				<el-table-column prop="zipCode" label="邮政编码" min-width="80" ></el-table-column>
				<el-table-column prop="typeName" label="地址类型名称" width="120" ></el-table-column>
				
				<el-table-column label="操作" width="180" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>

			</el-table>
			
            <el-row style="margin-top:20px">
                <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
            </el-row>
		
			<!--编辑 CustomerAddress crm_customer_address界面-->
			<el-dialog append-to-body top="3vh" title="编辑地址" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <customer-address-edit :customer-address="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></customer-address-edit>
			</el-dialog>
	
			<!--新增 CustomerAddress crm_customer_address界面-->
			<el-dialog append-to-body top="3vh" title="新增地址" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<customer-address-add :customer-address="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></customer-address-add>
			</el-dialog>
			


		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listCustomerAddress, delCustomerAddress, batchDelCustomerAddress } from '@/api/oa/crm/customerAddress';
	import  CustomerAddressAdd from './CustomerAddressAdd';//新增界面
	import  CustomerAddressEdit from './CustomerAddressEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },
        
        props:['customer','visible'],
		watch: {
	      'customer':function( customer ) {
	        // this.customerObj = customer;
          },
          
	      'visible':function(visible) { 
	      	if(visible==true){
                  //从新打开页面时某些数据需要重新加载，可以在这里添加
                this.$nextTick(() => {
				    this.getCustomerAddresss();
        	    });
	      	}
	      }
	    },

		data() {
			return {
				filters: {
					key: ''
				},
				customerAddresss: [],//查询结果
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
				
				addFormVisible: false,//新增customerAddress界面是否显示
				//新增customerAddress界面初始化数据
				addForm: {
					addressId:'',curstomerId:'',country:'',countryCode:'',province:'',provinceCode:'',city:'',cityCode:'',street:'',streetCode:'',district:'',districtCode:'',zipCode:'',phone:'',fax:'',email:'',contacterUserId:'',contacterUserName:'',typeId:'',typeName:'', address:'', appendAddress:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑customerAddress界面初始化数据
				editForm: {
					addressId:'',curstomerId:'',country:'',countryCode:'',province:'',provinceCode:'',city:'',cityCode:'',street:'',streetCode:'',district:'',districtCode:'',zipCode:'',phone:'',fax:'',email:'',contacterUserId:'',contacterUserName:'',typeId:'',typeName:'',address:'', appendAddress:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getCustomerAddresss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCustomerAddresss();
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
				this.getCustomerAddresss();
			},
			searchCustomerAddresss(){
				 this.pageInfo.count=true; 
				 this.getCustomerAddresss();
			},
			//获取列表 CustomerAddress crm_customer_address
			getCustomerAddresss() {
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
				this.load.list = true;
				listCustomerAddress(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.customerAddresss = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 CustomerAddress crm_customer_address
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 CustomerAddress crm_customer_address
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getCustomerAddresss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getCustomerAddresss();
			},
			//选择行customerAddress
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除customerAddress
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { addressId: row.addressId };
					delCustomerAddress(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getCustomerAddresss();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除customerAddress
			batchDel: function () {
				if(this.sels.length === 0) {
					this.$message.error('请先选择记录');
					return;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelCustomerAddress(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getCustomerAddresss(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
            }
            
			/**begin 自定义函数请在下面加**/
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'customer-address-add':CustomerAddressAdd,
		    'customer-address-edit':CustomerAddressEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCustomerAddresss();
        	}); 
		}
	}

</script>

<style scoped>

</style>