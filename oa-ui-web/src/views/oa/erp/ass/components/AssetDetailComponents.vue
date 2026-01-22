<template>
	<section>
		<el-row class="page-container border padding">
            <el-row>

                <!--列表 AssetDetail ass_asset_detail-->
                <el-col :span="5">
                    <asset-category-tree @node-click="getTreeData"></asset-category-tree>
                </el-col>

                <el-col :span="1">
                </el-col>

                <el-col :span="18" >
                    <el-row style="margin-bottom: 5px">
                        <el-col style="margin-right:5px" :span="7">
                            <el-input v-model="filters.assetName" placeholder="资产名称"></el-input>
                        </el-col>

                        <el-col style="margin-right:5px" :span="8">
                            <el-input v-model="personLiableUserName" clearable placeholder="责任人">
                                <i @click="openUserSelect" slot="suffix" class="el-icon-s-custom"></i>
                            </el-input>
                        </el-col>

                        <el-col style="margin-right:5px" :span="7">
                            <el-input v-model="warehouseName" clearable  placeholder="存放地点">
                                <i @click="openWarehouseSelect" slot="suffix" class="el-icon-menu"></i>
                            </el-input>
                        </el-col>

                    </el-row>

                    <el-row style="margin-bottom: 5px">

                        <el-col style="margin-right:5px" :span="7">
                            <el-input v-model="filters.vagueAssetSn"  placeholder="资产编码"></el-input>
                        </el-col>

                        <el-col style="margin-right:5px" :span="8">
                            <el-button style="margin-top:5px" size="mini" type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchAssetDetails">查询</el-button>
                            <el-button style="margin-top:5px" size="mini" type="primary" v-on:click="confirm">确定</el-button>
                        </el-col>

                    </el-row>

                    <el-table height="300" size="small" :data="assetDetails" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                    <el-table-column  sortable type="selection" width="40"></el-table-column>
                    <el-table-column sortable type="index" width="40"></el-table-column>
                    <el-table-column prop="assetSn" label="资产编码" min-width="80" ></el-table-column>
                    <el-table-column prop="assetName" label="资产名称" min-width="80" ></el-table-column>
                    <el-table-column prop="spec" label="规格型号" min-width="80" ></el-table-column>
                    <el-table-column prop="categoryName" label="资产类别" min-width="80" ></el-table-column>
                    <el-table-column  label="资产状态" min-width="80" >
                        <template slot-scope="scope">
                            <span>{{assetStatusArr[parseInt(scope.row.cardStatus)]}}</span>
						</template>
                    </el-table-column>
                    </el-table>
                    <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
                </el-col>
            </el-row>
		</el-row>

        <el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="visibleUserSelect">
			<user-select @confirm="getUserData" :isSingleUser="true"></user-select>
		</el-dialog>

        <el-dialog append-to-body title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
			<warehouse-components @row-click="getWarehouseData"></warehouse-components>
		</el-dialog>


	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
    import {listAssetDetail} from '@/api/oa/erp/ass/assetDetail';
    import { mapGetters } from 'vuex';
    import AssetCategoryTree from './AssetCategoryTree';
    //import Sticky from '@/components/Sticky'; // 粘性header组件
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
    import WarehouseComponents from '../../stk/components/WarehouseComponents';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
        },

        props:['visible', 'assetMng', 'isSingerSelect'],

        watch: {
	      'warehouseName':function() {
              if(this.warehouseName === '' || this.warehouseName === null) {
                  this.filters.warehouseId = '';
              }
          },

           'personLiableUserName':function() {
                if(this.personLiableUserName === '' || this.personLiableUserName === null) {
                    this.filters.personLiableUserid = '';
                }
            },

           'visible':function(visible) {
                if(visible==true){
                    //从新打开页面时某些数据需要重新加载，可以在这里添加
                    this.setQueryParam();
                    this.listAssetDetail();
                }
            },

            'isSingerSelect': function(visible) {
            }

        },


		data() {
			return {
				filters: {
                    assetName: '',
                    personLiableUserid: '',
                    warehouseId: '',
                    categoryId: '',
                    assetStatus: '',
                    vagueAssetSn:'',
				},
				assetDetails: [],//查询结果
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
                assetStatusArr: ['闲置', '在用', '借用', '维修', '报废', '调拨', '处置'],
                //显示用户选择dialog
                visibleUserSelect: false,
                visibleWarehouseSelect: false,
                //责任人姓名
                personLiableUserName: '',
                //仓库名称
                warehouseName: '',
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.listAssetDetail();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.listAssetDetail();
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
				this.listAssetDetail();
			},
			searchAssetDetails(){
				 this.pageInfo.count=true;
				 this.listAssetDetail();
			},
			//获取列表 AssetDetail ass_asset_detail
			listAssetDetail() {
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
                    params.key = this.filters.assetName;
                    params.personLiableUserName = this.personLiableUserName;
                    // params.personLiableUserid = this.filters.personLiableUserid;
                    params.warehouseId = this.filters.warehouseId;
                    params.categoryId = this.filters.categoryId;
                    params.assetStatusArr = this.filters.assetStatusArr;
                    params.vagueAssetSn = this.filters.vagueAssetSn;

				}else{
					//params.xxx=xxxxx
				}
                this.load.list = true;
                listAssetDetail(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.assetDetails = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行assetDetail
			selsChange: function (sels) {
				this.sels = sels;
			},

			rowClick: function(row, event, column){
                this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
            },

            /**begin 自定义函数请在下面加**/
            openUserSelect() {
                this.visibleUserSelect = true;
            },

            //获取用户数据
            getUserData(data) {
                this.filters.personLiableUserid = data[0].userid;
                this.personLiableUserName = data[0].username;
                this.visibleUserSelect = false;
            },

            openWarehouseSelect() {
                this.visibleWarehouseSelect = true;
            },

            //打开仓库选择
            getWarehouseData(data) {
                this.filters.warehouseId = data.id;
                this.warehouseName = data.name
                this.visibleWarehouseSelect = false;
            },

            cancel() {
                this.filters = {
                    assetName: '',
                    personLiableUserid: '',
                    warehouseId: '',
                };
                this.warehouseName = '';
                this.personLiableUserName = '';
            },

            confirm() {
                this.$emit('confirm', this.sels);
                this.cancel();
            },

            //获取资产分类树数据
            getTreeData(data) {
                this.filters.categoryId = data.categoryId;
                this.listAssetDetail();
            },

            setQueryParam() {
                switch(this.assetMng) {
                    case 'use':
                    //只能查询闲置机器
                    this.filters.assetStatusArr = '0';
                    break;
                    case 'return':
                    //查询除了闲置机器以外的机器 再用，借用，维修
                    this.filters.assetStatusArr = '1,2,3';
                    break;
                    case 'change':
                    //资产变更查询全部
                    this.filters.assetStatusArr = '';
                    break;
                    case 'maint':
                    //维修查询全部
                    this.filters.assetStatusArr = '0,1,2';
                    break;
                    //租用借用
                    case 'lease':
                    this.filters.assetStatusArr = '0';
                    break;
                    //调拨
                    case 'reallocation':
                    this.filters.assetStatusArr = '';
                    break;
                    //处置
                    case 'dispose':
                    this.filters.assetStatusArr = '0,1,2,3';

                }
            },

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {

            //在下面添加其它组件
            'asset-category-tree' : AssetCategoryTree,
            'user-select' : UsersSelect,
            'warehouse-components' : WarehouseComponents
		},
		mounted() {
            this.setQueryParam();
			this.$nextTick(() => {
				this.listAssetDetail();
        	});
		}
	}

</script>

<style scoped>

.el-icon-s-custom, .el-icon-menu{
    cursor: pointer;
    margin-top: 10px;
    padding: 2px;
}




</style>
