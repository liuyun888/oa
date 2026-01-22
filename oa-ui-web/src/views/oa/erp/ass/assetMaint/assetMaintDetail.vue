<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
    			<el-divider content-position="center">资产维修/保养</el-divider>
			</el-row>

            <table class="tab">
                <tbody>
                    <tr>
                        <td colspan="1" class="tl">标题</td>
                        <td colspan="3">{{detailForm.reqTitle}}</td>
                    </tr>

                    <tr>
                        <td class="tl">类别</td>
                        <td>资产维修/保养单</td>
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

                                <el-table-column prop="categoryName" align="center" label="资产类别"  width="">
                                </el-table-column>

                                <el-table-column prop="spec" align="center" label="规格型号"  width="">
                                </el-table-column>

                                <el-table-column prop="orignUnitAmount" align="center" label="原值"  width="">
                                </el-table-column>

                                <el-table-column prop="liableUserName" align="center" label="责任人"  width="100">
                                </el-table-column>

                                <el-table-column prop="maintType" align="center" label="维修方式" width="">
                                </el-table-column>

                                <el-table-column prop="maintFee" align="center" label="维修费用"  width="160">
                                </el-table-column>

                                <el-table-column  align="center" label="占原值百分比"  width="">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.maintOrignAmountPct}}%</span>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="maintOutBranchName" align="center" label="外部维修单位"  width="180">
                                </el-table-column>

                            </el-table>
                        </td>
                    </tr>

                     <tr>
                        <td colspan="1" class="tl">是否需要配件/耗材</td>
                        <td colspan="3"> {{detailForm.maintIsConsumables==='0'?'否':'是'}}</td>
                    </tr>

                    <tr v-show="showPeiJianVisible">
                        <td colspan="4" class="tl" style="text-align:center">配件/耗材基本信息</td>
                    </tr>

                    <tr v-show="showPeiJianVisible">
                        <td colspan="4" class="tl" >
                            <el-table size="small" border :data="haoCaiData" stripe>
                                <el-table-column
                                    label="序号"
                                    type="index"
                                    width="50">
                                </el-table-column>
                                <el-table-column prop="consuName"  align="center" label="名称" width="">
                                </el-table-column>

                                <el-table-column prop="consuSpec"  align="center" label="型号" width="" >
                                </el-table-column>

                                <el-table-column prop="consuNum"  align="center" label="数量"  width="">
                                </el-table-column>

                                <el-table-column prop="unitPrice" align="center" label="单价"  width="">
                                </el-table-column>

                                <el-table-column prop="subtotal" align="center" label="小计"  width="">
                                </el-table-column>

                                <el-table-column prop="remark"  align="center" label="说明"  width="">
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="1" class="tl">维修费用合计</td>
                        <td colspan="3">{{detailForm.maintTotalFeeAmount}} 元 &nbsp;&nbsp;&nbsp;&nbsp;大写： {{chineseTotal}}</td>
                    </tr>

                    <tr>
                        <td colspan="1" class="tl">维修期限</td>
                        <td colspan="3">
                            从: &nbsp;  {{detailForm.startDate}}   &nbsp; 至 &nbsp;  {{detailForm.endDate}}  &nbsp;  共  &nbsp; {{detailForm.totalDay}}   &nbsp;天
                        </td>
                    </tr>



                    <tr>
                        <td colspan="1" class="tl">维修事由</td>
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
    import {getDataByRequireId} from '@/api/oa/erp/ass/assetMaintenanceConsumables';
    import {Decimal} from 'decimal.js';
	import moneyTransToChinese from '@/utils/moneyTransToChinese';

    export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
            ]),
            

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
                    if(this.detailForm.maintIsConsumables === '1') {
                        this.getHaoCaiData();
                    }
                }
            },
          
            haoCaiData:{
                handler:function(val,oldval){
                    if(val.length > 0) {
                        let total = new Decimal(0);
                        val.forEach(f => {
                            total = total.plus(new Decimal(f.consuNum).mul(new Decimal(f.unitPrice)));
                        })
                        this.detailForm.maintTotalFeeAmount = Number(total);
                        this.chineseTotal = moneyTransToChinese.transToChinese(total);
                    }
                },
                deep:true//对象内部的属性监听，也叫深度监听
            },
            
            
            detailForm: {
                handler:function(val, oldval) {
                    if(!this.isNull(val.startDate) && !this.isNull(val.endDate)) {
                        this.detailForm.totalDay = this.getDaysBetween(val.startDate, val.endDate);
                    }
                    
                },
                deep:true
            }

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
                    ]
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
                    maintIsConsumables: '0',
                    maintTotalFeeAmount: 0,
                    //维修开始日期
                    startDate: '',
                    //维修结束日期
                    endDate: '',
                    totalDay: 0
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
                uploadArchiveId: '',
                uploadCategoryId: '',
                assetData: [],

                showPeiJianVisible: false,
                haoCaiData: [],
                currentRow: 0,
                currentHaoCaiRow: 0,
                chineseTotal: '零元',

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['detailForm'].resetFields();
                this.assetData = [];
                this.haoCaiData = [];
				this.$emit('submit');
            },

            addClose() {
                this.$refs['detailForm'].resetFields();
                this.assetData = [];
                this.haoCaiData = [];
            },

            //设置默认参数
			setDefaultParam() {
                this.chineseTotal = "零元";
                this.uploadArchiveId = this.detailForm.id;
                this.detailForm.maintIsConsumables === "1" ? this.showPeiJianVisible = true : this.showPeiJianVisible = false;
				this.uploadCategoryId = 'asset_maint_upload';
            },

            //查询资产
            searchAsset() {
                this.selectAssetVisible = true;
            },

            //选择资产关闭
            assetClose() {
                this.$refs.assetDetail.cancel();
            },

       
            jiSuan() {
				this.haoCaiData[this.currentHaoCaiRow].subtotal = Number(new Decimal(this.haoCaiData[this.currentHaoCaiRow].consuNum)
						.mul(new Decimal(this.haoCaiData[this.currentHaoCaiRow].unitPrice)));
            },
            
            jiSuanPercent(index) {
                let data = this.assetData[index];
                if(this.isNull(data.maintFee)) return;
                data.maintOrignAmountPct = Number((new Decimal(data.maintFee).div(new Decimal(data.orignUnitAmount))).mul(100).toFixed(2));
            },

            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
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

            getHaoCaiData() {
				let params = {
					requireId: this.detailForm.id
				};
                //查询申购单明细
                this.load.list = true;
				getDataByRequireId(params).then((res) => {
                    var tips=res.data.tips;
					if(tips.isOk){
                        this.haoCaiData = res.data.data;
                        if(this.haoCaiData.length > 0) {
                            this.haoCaiData.forEach(r => {
                                r.subtotal = Number(new Decimal(r.consuNum).mul(new Decimal(r.unitPrice)));
                            })
                        }
                    }
                    this.load.list = false;
				}).catch();
            },

            getDaysBetween(dateString1,dateString2){
                var  startDate = Date.parse(dateString1);
                var  endDate = Date.parse(dateString2);
                var days=(endDate - startDate)/(1*24*60*60*1000);
                return  days;
            },
            
        },
     
        components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
            'attachment-upload': AttachmentUpload,
        },
        
		mounted() {
            this.detailForm=Object.assign(this.detailForm, this.assetReceive);
            this.$nextTick(() => {
                this.getDetailData();
                if(this.detailForm.maintIsConsumables === '1') {
                    this.getHaoCaiData();
                }
            })
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

</style>