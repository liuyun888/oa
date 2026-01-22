<template>
    <section>
        <el-row class="page-container border padding">
            <el-row>
    			<el-divider content-position="center">资产盘点</el-divider>
			</el-row>

            <table class="tab">
                <tr>
                    <td colspan="1" class="tl">标题</td>
                    <td colspan="3">{{detailForm.reqTitle}}</td>
                </tr>

                <tr>
                    <td class="tl">类别</td>
                    <td >资产盘点单</td>
                    <td class="tl">编号</td>
                    <td >{{detailForm.id}}</td>
                </tr>

                <tr>
                    <td class="tl">申请人</td>
                    <td >{{detailForm.reqUsername}}</td>
                    <td class="tl">申请部门</td>
                    <td >{{detailForm.reqDeptName}}</td>
                </tr>

                <tr>
                    <td class="tl">盘点任务</td>
                    <td >{{detailForm.inventoryTask}}</td>
                    <td class="tl">申请日期</td>
                    <td >{{detailForm.reqDate}}</td>
                </tr>

                <tr>
                    <td colspan="4">
                        <el-table size="small" border :data="assetData" stripe>
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                        </el-table-column>
                    
                        <el-table-column prop="assetSn"  align="center" label="资产编码" width="">
                        </el-table-column>

                        <el-table-column prop="assetName" align="center" label="资产名称" width="" >
                        </el-table-column>

                        <el-table-column prop="nowPsersonLiableUsername" align="center" label="责任人"  width="100">
                        </el-table-column>

                        <el-table-column prop="nowWarehouseName" align="center" label="存放地点"  width="200">
                        </el-table-column>

                        <el-table-column prop="nowDeptName" align="center" label="资产使用部门"  width="200">
                        </el-table-column>

                        <el-table-column  align="center" label="资产使用状态"  width="200">
                            <template slot-scope="scope">
                                <span>
                                    {{assetStatusArr[scope.row.assetStatusAfter]}}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column  prop="disposeRemark" align="center" label="备注"  width="200">
                        </el-table-column>
                      
                    </el-table>
                    </td>
                </tr>

                <tr>
                    <td colspan="1" class="tl">备注</td>
                    <td colspan="3">{{detailForm.reqReason}}</td>
                </tr>

                 <tr>
                    <td colspan="1" class="tl">上传</td>
                    <td colspan="3">
                        <attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
                    </td>
                </tr>
            </table>
        </el-row>

    </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import {getDetail} from '@/api/oa/erp/ass/assetMng';


    export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		}, 
		props:['assetReceive','visible', 'mngParams'],
		watch: {
          
          'assetReceive':function( assetReceiveOper ) {
	            this.detailForm = assetReceiveOper;
           },
           
	      'visible':function(visible) {
                if(visible==true){
                    //从新打开页面时某些数据需要重新加载，可以在这里添加
                    this.setDefaultParam();
                    
                }
           },
        },
        data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
                    ],
                    reqTitle: [
                        { required: true, message: '标题不能为空', trigger: 'change' }
                    ],
                    inDeptName: [
                        { required: true, message: '借入部门不能为空', trigger: 'change' }
                    ],
                    outDeptName: [
                        { required: true, message: '借出部门不能为空', trigger: 'change' }
                    ],

				},
				//新增界面数据 ass_asset_detail_oper
				detailForm: {
                    reqTitle: '',
                    reqUserid: '',
                    reqUsername: '',
                    reqDeptid: '',
                    reqDeptName: '',
                    reqDate: '',
                    id: '',
                    opType: '',
                    reqReason: '',
                    startDate: '',
                    endDate: '',
                    totalDay: 0,
                    inDeptId: '',
                    inDeptName: '',
                    outDeptId: '',
                    outDeptName: '',
                    inBranchId: '',
                    inBranchName: '',
                    outBranchId: '',
                    outBranchName: '',
                },
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
                uploadArchiveId: '',
                uploadCategoryId: '',
                assetData: [],
                visibleDeptSelect: false,
                visibleWarehouseSelect: false,
                visibleUserSelect: false,
                //是否是批量选择
                assetMng: "inventory",
                assetStatusArr: ['闲置', '在用', '借用', '维修', '报废'],
                assetStatusOptions: [
                    {
                        label: '闲置',
                        value: '0'
                    },

                    {
                        label: '在用',
                        value: '1'
                    },

                    {
                        label: '借用',
                        value: '2'
                    },

                    {
                        label: '维修',
                        value: '3'
                    },

                    {
                        label: '报废',
                        value: '4'
                    }
                ]

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['detailForm'].resetFields();
                this.assetData = [];
                this.$emit('submit');
                // Object.assign(this.$data.detailForm, this.$options.data().detailForm);
            },

            // addClose() {
            //     this.$refs['detailForm'].resetFields();
            //     this.assetData = [];
            //     Object.assign(this.$data.detailForm, this.$options.data().detailForm);
            // },

            //设置默认参数
			setDefaultParam() {
                this.detailForm=Object.assign(this.detailForm, this.assetReceive);
                this.getDetailData();
				this.uploadArchiveId = this.detailForm.id;
                this.uploadCategoryId = 'asset_inventory_upload';
            },

            getDetailData() {
				let params = {
					requireId: this.detailForm.id
				};
                //查询申购单明细
                this.load.list = true;
				getDetail(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){
						this.assetData = res.data.data;
                    }
                    this.load.list = false;
				}).catch();
			},

        },
     
        components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
            'attachment-upload': AttachmentUpload,
        },
        
		mounted() {
            this.setDefaultParam();
		}//end mounted

    }



</script>


<style scoped>


table,th,td{
	border:1px solid rgb(159, 159, 159);
}

table{
	width:100%;
}

.tab{
    border-collapse:collapse;
}

.tab tr td{
    text-align: left;
    line-height: 26px;
    padding: 4px;
}

.tab .tl {
    background: rgb(246, 246, 246);
}

.mt {
	margin-top: 20px;
	
}

.seeDetails {
	text-decoration: underline;
	cursor: pointer; 
	color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover{
    color: rgba(10, 69, 169, 0.6);
}

.seeDetails {
	text-decoration: underline;
	cursor: pointer; 
	color: rgba(10, 69, 169, 1.0);
}

.seeDetails:hover{
    color: rgba(10, 69, 169, 0.6);
}

</style>