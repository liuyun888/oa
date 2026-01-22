<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
				<div>
					<el-button size="small" @click="cancel">取消</el-button>
					<el-button type="primary" size="small" @click="editSubmit('hold')">暂存</el-button>
					<el-button type="primary" size="small" @click="editSubmit('submit')">提交并发审</el-button>
				</div>
    			<el-divider content-position="center">资产维修/保养</el-divider>
			</el-row>

            <!--新增界面 PurRequire pur_require--> 
			<el-form :model="editForm" size="small"  label-width="140px" :rules="editFormRules" ref="editForm">
				<el-row>
					<el-form-item label="标题" prop="reqTitle">
						<el-input v-model="editForm.reqTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产领用单"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="编号">
							<el-input disabled placeholder="系统自动生成"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="申请人" prop="reqUsername">
							<el-input readonly v-model="editForm.reqUsername"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请部门" prop="reqDeptName">
							<el-input readonly v-model="editForm.reqDeptName"></el-input>
						</el-form-item>
					</el-col>
                    <el-col :span="8">
						<el-form-item label="申请日期">
							<el-date-picker
                                readonly
								type="date"
								v-model="editForm.reqDate"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

            <el-row>
                <el-form-item label="选择资产">
                    <el-button type="primary" size="mini" @click="searchAsset">搜索</el-button>
                </el-form-item>
            </el-row>

            <el-row>
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

                    <el-table-column prop="categoryName" align="center" label="资产类别"  width="">
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="规格型号"  width="">
                    </el-table-column>

                    <el-table-column prop="orignUnitAmount" align="center" label="原值"  width="">
                    </el-table-column>

                    <el-table-column prop="liableUserName" align="center" label="责任人"  width="100">
                    </el-table-column>

                    <el-table-column align="center" label="维修方式" width="">
                        <template slot-scope="row">
                            <el-input @focus="setCurrentRow(row.$index)" size="mini" v-model="assetData[row.$index].maintType"> </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="维修费用"  width="160">
                        <template slot-scope="row">
                            <el-input-number size="mini" @input="jiSuanPercent(row.$index)"  controls-position="right"  @focus="setCurrentRow(row.$index)" v-model="assetData[row.$index].maintFee" :min="1" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="占原值百分比"  width="">
                        <template slot-scope="scope">
                            <span>{{scope.row.maintOrignAmountPct}}%</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="外部维修单位"  width="180">
                        <template slot-scope="row">
                            <el-input @focus="setCurrentRow(row.$index)" size="mini" v-model="assetData[row.$index].maintOutBranchName"> </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作"  width="80">
                        <template slot-scope="row">
                            <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <el-row style="margin-top:10px">
                <el-form-item label="是否需要配件/耗材" prop="reqReason">
                    <el-radio @change="showPeiJianVisible=true" v-model="editForm.maintIsConsumables" label="1">是</el-radio>
                    <el-radio @change="showPeiJianVisible=false" v-model="editForm.maintIsConsumables" label="0">否</el-radio>
                </el-form-item>
            </el-row>

            <el-row v-show="showPeiJianVisible">
                <el-divider content-position="center">配件/耗材基本信息</el-divider>
                <el-table size="small" border :data="haoCaiData" stripe>
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                    </el-table-column>
                
                    <el-table-column   align="center" label="名称" width="">
                        <template slot-scope="row">
                            <span class="vTip">*</span>
							<el-input @blur="validateParam(row.$index, 'one')"  @focus="setHaoCaiCurrentRow(row.$index)" size="mini" v-model="haoCaiData[row.$index].consuName"> </el-input>
                             <div v-show="haoCaiData[row.$index].validate.oneShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{haoCaiData[row.$index].validate.oneMsg}}</span>
							</div>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="型号" width="" >
                        <template slot-scope="row">
                            <span class="vTip">*</span>
							<el-input @blur="validateParam(row.$index, 'two')"  @focus="setHaoCaiCurrentRow(row.$index)" size="mini" v-model="haoCaiData[row.$index].consuSpec"> </el-input>
                            <div v-show="haoCaiData[row.$index].validate.twoShow">
								<i class="el-icon-warning"></i>
								<span class="tipMsg">{{haoCaiData[row.$index].validate.twoMsg}}</span>
							</div>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="数量"  width="">
                        <template slot-scope="row">
                            <el-input-number size="mini" controls-position="right" @input="jiSuan" @focus="setHaoCaiCurrentRow(row.$index)" v-model="haoCaiData[row.$index].consuNum" :min="1" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="单价"  width="">
                        <template slot-scope="row">
                            <el-input-number size="mini" controls-position="right" @input="jiSuan" @focus="setHaoCaiCurrentRow(row.$index)" v-model="haoCaiData[row.$index].unitPrice"  :min="0" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="小计"  width="">
                        <template slot-scope="row">
							<el-input readonly @focus="setHaoCaiCurrentRow(row.$index)" size="mini" v-model="haoCaiData[row.$index].subtotal"> </el-input>
						</template>
                    </el-table-column>

                    <el-table-column  align="center" label="说明"  width="">
                         <template slot-scope="row">
							<el-input  @focus="setHaoCaiCurrentRow(row.$index)" size="mini" v-model="haoCaiData[row.$index].remark"> </el-input>
						</template>
                    </el-table-column>

                    <el-table-column align="center"  width="80">
						 <template slot="header">
							<i class="el-icon-circle-plus-outline"  @click="addRow"></i>
						</template>
						<template slot-scope="row">
							 <i class="el-icon-remove-outline" @click="delHaoCai(row.$index)"></i>
						</template>
					</el-table-column>

                </el-table>

            </el-row>

            <el-row style="margin-top:10px">
                <el-form-item label="维修费用合计" prop="maintTotalFeeAmount">
                   <span style="width:200px; display: inline-block">{{editForm.maintTotalFeeAmount}} 元</span>
                   <span>大写: {{chineseTotal}}</span>
                </el-form-item>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="维修开始日期" prop="startDate">
                        <el-date-picker
                            v-model="editForm.startDate"
                            type="date"
                            placeholder="开始日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                
                <el-col :span="16">
                    <el-form-item label="维修结束日期" prop="endDate">
                        <el-date-picker
                            v-model="editForm.endDate"
                            type="date"
                            placeholder="结束日期">
                        </el-date-picker>
                        <span style="margin-left: 20px">共  {{editForm.totalDay}}  天</span>
                        <span v-if="dateTip" style="color: red; margin-left: 20px">* 结束时间不能早于开始时间</span>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row style="margin-top: 20px">
                <el-form-item label="维修事由" prop="reqReason">
                    <el-input type="textarea" v-model="editForm.reqReason" :rows="4"></el-input>
                </el-form-item>
            </el-row>

            <el-row style="margin-top: 20px">
                <el-form-item label="上传">
					<attachment-upload :archiveId="uploadArchiveId" :categoryId="uploadCategoryId" :branchId="userInfo.branchId"></attachment-upload>
				</el-form-item>
            </el-row>

			</el-form>
        </el-row>
        
        <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="selectAssetVisible" @close="assetClose" :close-on-click-modal="false">
			<asset-card-components :assetMng="assetMng" @confirm="getAssetData" ref="assetDetail" :visible="selectAssetVisible" @cancel="selectAssetVisible=false" ></asset-card-components>
		</el-dialog>



    </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import AssetCardComponents from '../components/AssetCardComponents';
    import DeptTree from '@/views/mdp/sys/dept/DeptTree';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect'
    import WarehouseComponents from '../../stk/components/WarehouseComponents';
    import {Decimal} from 'decimal.js';
    import moneyTransToChinese from '@/utils/moneyTransToChinese';
    import {editAssetMng, getDetail} from '@/api/oa/erp/ass/assetMng';
    import {getDataByRequireId} from '@/api/oa/erp/ass/assetMaintenanceConsumables';

    export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
            ]),
            
		}, 
		props:['assetMaint','visible'],
		watch: {
	       'assetMaint':function( assetMaintOper ) {
	            this.editForm = assetMaintOper;
                this.getDetailData();
                 if(this.editForm.maintIsConsumables === '1') {
                        this.showPeiJianVisible = true;
                        this.getHaoCaiData();
                    }
            },
           
            'visible':function(visible) {
                if(visible==true){
                    //从新打开页面时某些数据需要重新加载，可以在这里添加
                    this.setDefaultParam();
                    this.getDetailData();
                    if(this.editForm.maintIsConsumables === '1') {
                        this.showPeiJianVisible = true;
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
                        this.editForm.maintTotalFeeAmount = Number(total);
                        this.chineseTotal = moneyTransToChinese.transToChinese(total);
                    }
                },
                deep:true//对象内部的属性监听，也叫深度监听
            },
            
            editForm: {
                handler:function(val, oldval) {
                    if(!this.isNull(val.startDate) && !this.isNull(val.endDate)) {
                        this.editForm.totalDay = this.getDaysBetween(val.startDate, val.endDate);
                        this.editForm.totalDay < 0 ? this.dateTip = true : this.dateTip = false;
                    }
                },
                deep:true
            }

        },
        data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
                    ],
                    reqTitle: [
                        { required: true, message: '标题不能为空', trigger: 'change' }
                    ]
				},
				//新增界面数据 ass_asset_detail_oper
				editForm: {
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
                selectAssetVisible: false,
                visibleDeptSelect: false,
                visibleUserSelect: false,
                visibleWarehouseSelect: false,
                //是否是批量选择
                isBatchChange: false,
                batchDisabled: true,
                assetMng: "maint",
                showPeiJianVisible: false,
                haoCaiData: [],
                currentRow: 0,
                currentHaoCaiRow: 0,
                chineseTotal: '零元',
                //日期提示
                dateTip: false,

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['editForm'].resetFields();
                this.assetData = [];
                this.haoCaiData = [];
				this.$emit('submit');
            },

            addClose() {
                this.$refs['editForm'].resetFields();
                this.assetData = [];
                this.haoCaiData = [];
            },

            editSubmit(status) {
                this.editForm.mngStatus = status;
                this.$refs.editForm.validate((valid) => {
					if (valid) {
						let flag = this.validateAssetData();
                        if(!flag) return;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							//明细数据校验
							if(!this.isNull(this.editForm.reqDate) && this.editForm.reqDate instanceof Date ) {
								this.editForm.reqDate = util.formatDate(this.editForm.reqDate, "yyyy-MM-dd HH:mm:ss")
							}
                            let params = Object.assign({}, this.transfreData(this.editForm)); 
							editAssetMng(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.detailData = [];
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
                    }
				});
            },

            transfreData(data) {
                //资产中维修字段拆分
                let assetDetailOper = [];
                
                if(!this.isNull(data.startDate) && data.startDate instanceof Date) {
					data.startDate = util.formatDate(data.startDate, "yyyy-MM-dd HH:mm:ss")
                }

                if(!this.isNull(data.endDate) && data.endDate instanceof Date) {
                    data.endDate = util.formatDate(data.endDate, "yyyy-MM-dd HH:mm:ss")
                }

                if(this.assetData.length > 0) {
					this.assetData.forEach(p => {
                        
                        if(!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
							p.allocDate = util.formatDate(p.allocDate, "yyyy-MM-dd HH:mm:ss")
						}

                        let param = {
                            assetId: p.id,
                            maintType: p.maintType,
                            maintFee: p.maintFee,
                            maintOutBranchId: p.maintOutBranchId,
                            maintOutBranchName: p.maintOutBranchName,
                            maintOrignAmountPct: p.maintOrignAmountPct,
                        }
                        assetDetailOper.push(param);
					})
                }
               
				let param = {
					assetMng: data,
                    assetDetails: this.assetData,
                    haoCai: this.haoCaiData,
                    assetDetailOper: assetDetailOper
				};
				return param;
            },

            validateAssetData() {

                if(this.assetData.length <= 0) {
					this.$message.error("入库资产清单不能为空");
					return false;
                }

                //校验日期，结束日期不能早于开始日期
                if(this.dateTip) {
                    this.$message.error("结束日期不能早于开始日期");
					return false;
                }


                //验证耗材数据
                if(this.haoCaiData.length > 0) {
                    //验证数据
                    this.haoCaiData.forEach((d, index) => {
                        this.validateParam(index, "one");
					    this.validateParam(index, "two");
                    })
                }

                let flag = "true";

				this.haoCaiData.forEach (d => {
					if(d.validate.oneShow) {
						flag = false;
						return flag;
					}
					if(d.validate.twoShow) {
						flag = false;
						return flag;
					}
                })
                
				if(!flag) {
					return false;
                }
                
                return true;
                
            },

            //设置默认参数
			setDefaultParam() {
                // this.editForm.maintIsConsumables = "0";
                // this.chineseTotal = "零元";
                // //设置维修日期
                // this.editForm.totalDay = 0;
                // this.dateTip = false;
                //操作类型：维修
                this.editForm.opType = "maint";
				this.uploadArchiveId = this.editForm.id;
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

            setCurrentRow(index) {
				this.currentRow = index;
            },

            setHaoCaiCurrentRow(index) {
				this.currentHaoCaiRow = index;
            },
            
            //删除表单数据
            delRow(index) {
                this.assetData.splice(index, 1);
                if(this.assetData.length <= 0) this.batchDisabled = true;
            },

            //获取选择的资产数据
            getAssetData(data) {
                data.forEach(d => {
					let flag = this.assetData.some(item => {
						if(item.cardId == d.cardId) {
							return true;
						}
                    })
                    if(flag) {return};
                    //设置维修费用
                    this.$set(d,"allocDate", new Date());
                    this.$set(d,"maintOrignAmountPct", 0);
                    this.assetData.push(d);
                })
                if(data.length >0) this.batchDisabled = false;
                this.selectAssetVisible = false;
            },

        
            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },
            
            getDaysBetween(dateString1,dateString2){
                var  startDate = Date.parse(dateString1);
                var  endDate = Date.parse(dateString2);
                var days=(endDate - startDate)/(1*24*60*60*1000);
                return  days;
            },

            //资产明细添加一行
			addRow() {
				let params = {
					//资产名称
					consuName: '',
					//规格型号
					consuSpec:'',
					//申购数量
					consuNum: 0,
					//单价
					unitPrice: 0,
					//小计
                    subtotal: 0,
                    remark: '',
					validate: {
						//detail验证
						oneShow: false,
						oneMsg: "资产名称不能为空",
						twoShow: false,
						twoMsg: "资产型号不能为空",
					}
				}
				this.haoCaiData.push(params);
            },
            
            validateParam(index, position) {
				let data = this.haoCaiData[index];
				switch(position) {
					case 'one' :
						this.isNull(data.consuName) ? data.validate.oneShow = true : data.validate.oneShow = false; 
					break;
					case 'two' :
						this.isNull(data.consuSpec) ? data.validate.twoShow = true : data.validate.twoShow = false; 
					break;
				}
			},

			delHaoCai(index) {
				this.haoCaiData.splice(index, 1);
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

            getDetailData() {
				let params = {
					requireId: this.editForm.id
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
					requireId: this.editForm.id
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
                                r.validate = {
                               		oneShow: false,
                                    oneMsg: "资产名称不能为空",
                                    twoShow: false,
                                    twoMsg: "资产型号不能为空",
                                }
                            })
                        }
                    }
                    this.load.list = false;
				}).catch();
            },

        },
     
        components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
            'attachment-upload': AttachmentUpload,
            'asset-card-components' : AssetCardComponents,
            'dept-tree' : DeptTree,
            'user-select' : UsersSelect,
            'warehouse-components' : WarehouseComponents
        },
        
		mounted() {
			this.editForm=Object.assign(this.editForm, this.assetMaint);
            this.setDefaultParam();
            this.getDetailData();
            if(this.editForm.maintIsConsumables === '1') {
               this.showPeiJianVisible = true;
               this.getHaoCaiData();
            }
		}//end mounted


        
    }



</script>


<style>

.operBar {
    width: 100%;
    height: 40px;
    border: 1px solid #EBEEF5;
}

.operBtn {
    line-height: 40px;
    float: right;
    margin-right: 10px;
}


.vTip {
	color: red;
	display: block;
	position: absolute;
	left: 1px;
}

.el-icon-warning {
	position: relative;
	top: 5px;
	margin-right: 1px;
}

.el-icon-warning, .tipMsg {
	color: red;
	float: left;
}

.el-icon-circle-plus-outline, .el-icon-remove-outline {
	font-size: 20px;
	cursor: pointer;
	padding: 5px;
}


</style>