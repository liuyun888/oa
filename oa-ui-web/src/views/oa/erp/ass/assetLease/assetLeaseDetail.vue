<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
    			<el-divider content-position="center">资产出租/出借</el-divider>
			</el-row>


             <table class="tab">
                <tbody>
                    <tr>
                        <td colspan="1" class="tl">标题</td>
                        <td colspan="3">{{detailForm.reqTitle}}</td>
                    </tr>

                    <tr>
                        <td class="tl">类别</td>
                        <td>资产出租/出借单</td>
                        <td class="tl">编号</td>
                        <td>{{detailForm.id}}</td>
                    </tr>

                    <tr>
                        <td class="tl">申请人</td>
                        <td >{{detailForm.reqUsername}}</td>
                        <td class="tl">申请部门</td> 
                        <td >{{detailForm.reqDeptName}}</td>
                    </tr>

                    <tr>
                        <td  colspan="1" class="tl">申请日期</td>
                        <td  colspan="3">{{detailForm.reqDate}}</td>
                    </tr>

                    <tr>
                        <td colspan="4">
                             <el-table  size="small" v-loading="load.list" border :data="assetData" stripe>
                                <el-table-column
                                    label="序号"
                                    type="index"
                                    width="50">
                                </el-table-column>
                            
                                <el-table-column prop="assetSn"  align="center" label="资产编码" width="">
                                </el-table-column>

                                <el-table-column prop="assetName" align="center" label="资产名称" width="" >
                                </el-table-column>

                                <el-table-column prop="categoryName" align="center" label="资产类别"  width="">
                                </el-table-column>

                                <el-table-column prop="spec" align="center" label="规格型号"  width="">
                                </el-table-column>

                                <el-table-column prop="orignUnitAmount" align="center" label="原值"  width="">
                                </el-table-column>

                                <el-table-column prop="nowDeptName" align="center" label="使用部门"  width="245">
                                </el-table-column>

                                <el-table-column prop="nowPsersonLiableUsername" align="center" label="责任人"  width="100">
                                </el-table-column>

                                <el-table-column prop="nowWarehouseName" align="center" label="存放地点"  width="200">
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>


                    <tr>
                        <td colspan="1" class="tl">借用期限</td>
                        <td colspan="3">
                            <span>从: &nbsp;  {{detailForm.startDate}}   &nbsp; 至 &nbsp;  {{detailForm.endDate}}  &nbsp;  共  &nbsp; {{detailForm.totalDay}}   &nbsp;天</span>
                        </td>
                    </tr>

                    <tr>
                        <td class="tl">借入机构</td>
                        <td >{{detailForm.inBranchName}}</td>
                        <td class="tl">借入部门</td> 
                        <td >{{detailForm.inDeptName}}</td>
                    </tr>

                    <tr>
                        <td class="tl">借出机构</td>
                        <td >{{detailForm.outBranchName}}</td>
                        <td class="tl">借出部门</td> 
                        <td >{{detailForm.outDeptName}}</td>
                    </tr>

                    <tr>
                        <td colspan="1" class="tl">借出事由</td>
                        <td colspan="3">{{detailForm.reqReason}}</td>
                    </tr>

                     <tr>
                        <td colspan="1" class="tl">附件</td>
                        <td colspan="3">
                            <attachment-upload :isDisabled="true" :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
                        </td>
                    </tr>
                </tbody>
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
		props:['assetReceive','visible'],
		watch: {
	      'assetReceive':function( assetReceiveOper ) {
	            this.detailForm = assetReceiveOper;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
                //从新打开页面时某些数据需要重新加载，可以在这里添加
                this.setDefaultParam();
                this.detailForm=Object.assign(this.detailForm, this.assetReceive);
                this.getDetailData();
	      	}
	      }
        },
        data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
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
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
                uploadArchiveId: '',
                uploadCategoryId: '',
                assetData: [],

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            addClose() {
                this.$refs['detailForm'].resetFields();
                this.assetData = [];
                this.validateData = [];
            },


            //设置默认参数
			setDefaultParam() {
				this.uploadArchiveId = this.detailForm.id;
				this.uploadCategoryId = 'asset_lease_upload';
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
            this.detailForm=Object.assign(this.detailForm, this.assetReceive);
            this.setDefaultParam();
            this.getDetailData();
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

</style>