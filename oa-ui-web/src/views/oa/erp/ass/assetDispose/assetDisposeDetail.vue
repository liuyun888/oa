<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
    			<el-divider content-position="center">资产处置明细</el-divider>
			</el-row>

            <table class="tab">
                <tbody>
                    <tr>
                        <td colspan="1" class="tl">标题</td>
                        <td colspan="3">{{detailForm.reqTitle}}</td>
                    </tr>

                    <tr>
                        <td class="tl">类别</td>
                        <td>资产处置单</td>
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
                        <td  colspan="1" class="tl">处置原因</td>
                        <td  colspan="3">{{detailForm.reqReason}}</td>
                    </tr>

                     <tr>
                        <td  colspan="1" class="tl">盘点任务</td>
                        <td  colspan="3">{{detailForm.inventoryTask}}</td>
                    </tr>

                    <tr>
                        <td colspan="4">
                            <el-table v-loading="load.list" size="small" border :data="assetData" stripe>
                                <el-table-column
                                    label="序号"
                                    type="index"
                                    width="50">
                                </el-table-column>
                            
                                <el-table-column prop="assetSn"  align="center" label="资产编码" width="">
                                </el-table-column>

                                <el-table-column prop="assetName" align="center" label="资产名称" width="" >
                                </el-table-column>

                                <el-table-column prop="spec" align="center" label="规格型号"  width="">
                                </el-table-column>

                                <el-table-column prop="categoryName" align="center" label="资产类别"  width="">
                                </el-table-column>

                                <el-table-column prop="warehouseDate" align="center" label="采购日期"  width="">
                                </el-table-column>

                                <el-table-column prop="liableUserName" align="center" label="责任人"  width="90">
                                </el-table-column>

                                <el-table-column prop="warehouseName" align="center" label="存放地点"  width="140">
                                </el-table-column>

                                <el-table-column prop="orignUnitAmount" align="center" label="原值"  width="">
                                </el-table-column>

                                <el-table-column prop="netWorth"  align="center" label="净值">
                                </el-table-column>

                                <el-table-column  prop="residualValue" align="center" label="残值">
                                </el-table-column>

                                <el-table-column prop="premiumSale"  align="center" label="报废变卖值">
                                </el-table-column>

                                <el-table-column prop="disposalType" align="center" label="资产处置方式">
                                </el-table-column>

                                <el-table-column prop="disposeRemark" align="center" label="备注文本">
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="1" class="tl">原值合计</td>
                        <td colspan="3">{{detailForm.dispTotalOrignAmount}}元 &nbsp;&nbsp;&nbsp;&nbsp;大写：{{detailForm.dispTotalOrignAmountChinese}}</td>
                    </tr>

                     <tr>
                        <td colspan="1" class="tl">报废变卖值合计</td>
                        <td colspan="3">{{detailForm.dispTotalScrapSaleAmount}}元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大写：{{detailForm.dispTotalScrapSaleAmountChinese}}</td>
                    </tr>


                     <tr>
                        <td colspan="1" class="tl">同时处置附加资产</td>
                        <td colspan="3">{{detailForm.dispAddAssets === '0' ? '否' : '是'}}</td>
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
    import {Decimal} from 'decimal.js';
	import moneyTransToChinese from '@/utils/moneyTransToChinese';


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
          },

           assetData:{
                handler:function(val,oldval){
                    if(val.length > 0) {
                        let dispTotalOrignAmount = new Decimal(0);
                        let premiumSale = new Decimal(0);
                        val.forEach(f => {
                            dispTotalOrignAmount = dispTotalOrignAmount.plus(new Decimal(f.orignUnitAmount));

                            if(!this.isNull(f.premiumSale)) {
                                premiumSale = premiumSale.plus(new Decimal(f.premiumSale));
                            }
                        })
                        this.detailForm.dispTotalOrignAmount = Number(dispTotalOrignAmount);
                        this.detailForm.dispTotalOrignAmountChinese = moneyTransToChinese.transToChinese(dispTotalOrignAmount);
                        
                        this.detailForm.dispTotalScrapSaleAmount = Number(premiumSale);
                        this.detailForm.dispTotalScrapSaleAmountChinese = moneyTransToChinese.transToChinese(premiumSale);
                    }
                },
                deep:true//对象内部的属性监听，也叫深度监听
            },
          


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
                disposalType: [
                    {
                        value: '0',
                        label: '出让'
                    },
                    {
                        value: '1',
                        label: '转让'
                    },
                    {
                        value: '2',
                        label: '出售'
                    },
                    {
                        value: '3',
                        label: '报废'
                    },
                    {
                        value: '4',
                        label: '报损'
                    },
                    {
                        value: '5',
                        label: '置换'
                    },
                    {
                        value: '6',
                        label: '盘亏'
                    },
                    {
                        value: '7',
                        label: '拍卖'
                    },
                    {
                        value: '8',
                        label: '捐赠'
                    }
                ],
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
                if(!this.isNull(this.detailForm.id)) {
                    this.uploadArchiveId = this.detailForm.id;
				    this.uploadCategoryId = 'asset_dispose_upload';
                }
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
                        this.assetData.forEach(a => {
                            this.disposalType.forEach(d => {
                                if(a.disposalType === d.value) {
                                    a.disposalType = d.label;
                                }
                            })
                        })
                    }
                    this.load.list = false;
				}).catch();
            },
            
            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
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