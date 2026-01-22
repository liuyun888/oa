<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
				<div>
					<el-button size="small" @click="cancel">取消</el-button>
                    <el-button v-if="showHoldBtn" type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
					<el-button type="primary" size="small" @click="addSubmit('submit')">提交并发审</el-button>
				</div>
    			<el-divider content-position="center">资产处置</el-divider>
			</el-row>

            <!--新增界面 PurRequire pur_require-->
			<el-form :model="addForm" size="small"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-form-item label="标题" prop="reqTitle">
						<el-input v-model="addForm.reqTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产处置单"></el-input>
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
							<el-input readonly v-model="addForm.reqUsername"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请部门" prop="reqDeptName">
							<el-input readonly v-model="addForm.reqDeptName"></el-input>
						</el-form-item>
					</el-col>
                    <el-col :span="8">
						<el-form-item label="申请日期">
							<el-date-picker
                                readonly
								type="date"
								v-model="addForm.reqDate"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

            <el-row class="topSpace">
                <el-form-item label="处置原因" prop="reqReason">
                    <el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
                </el-form-item>
            </el-row>

            <el-row class="topSpace">
                <el-form-item label="盘点任务" >
                    <el-input  readonly v-model="addForm.inventoryTask"></el-input>
                </el-form-item>
            </el-row>


            <el-row v-show="showSelectAssetBtn">
                <el-form-item label="选择资产">
                    <el-button type="primary" size="mini" @click="searchAsset">搜索</el-button>
                </el-form-item>
            </el-row>

            <el-row>
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

                    <el-table-column  align="center" label="净值"  width="150">
                        <template slot-scope="row">
                            <el-input-number size="mini" controls-position="right"  @focus="setCurrentRow(row.$index)" v-model="assetData[row.$index].netWorth"  :min="0" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="残值"  width="150">
                        <template slot-scope="row">
                            <el-input-number size="mini" controls-position="right" @focus="setCurrentRow(row.$index)" v-model="assetData[row.$index].residualValue"  :min="0" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column  align="center" label="报废变卖值"  width="150">
                        <template slot-scope="row">
                            <el-input-number size="mini" controls-position="right" @focus="setCurrentRow(row.$index)" v-model="assetData[row.$index].premiumSale"  :min="0" :step="1" ></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column prop="disposalType" align="center" label="资产处置方式"  width="180">
                        <template slot-scope="row">
                            <el-select size="mini" v-model="assetData[row.$index].disposalType">
                                <el-option
                                    v-for="item in disposalType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                            </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                     <el-table-column prop="orignUnitAmount" align="center" label="备注文本"  width="">
                         <template slot-scope="row">
                            <el-input size="mini"  @focus="setCurrentRow(row.$index)" v-model="assetData[row.$index].disposeRemark"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作"  width="80">
                            <template slot-scope="row">
                            <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
                        </template>
                    </el-table-column>

                </el-table>
            </el-row>

            <el-row class="topSpace">
                <el-col :span="6">
                    <el-form-item label="原值合计" prop="dispTotalOrignAmount">
                        <span style="width:200px; display: inline-block">{{addForm.dispTotalOrignAmount}} 元</span>
                    </el-form-item>
                </el-col>


                <el-col :span="7">
                    <el-form-item prop="dispTotalOrignAmountChinese">
                        <span>大写: {{addForm.dispTotalOrignAmountChinese}}</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row class="topSpace">
                <el-col :span="6">
                    <el-form-item label="报废变卖值合计" prop="dispTotalScrapSaleAmount">
                        <span style="width:200px; display: inline-block">{{addForm.dispTotalScrapSaleAmount}} 元</span>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item prop="dispTotalScrapSaleAmountChinese">
                        <span>大写: {{addForm.dispTotalScrapSaleAmountChinese}}</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row class="topSpace">
                <el-form-item label="同时处置附加资产" prop="maintTotalFeeAmount">
                    <el-checkbox v-model="addForm.dispAddAssets"></el-checkbox>
                </el-form-item>
            </el-row>


            <el-row class="topSpace">
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
    import {sn} from '@/common/js/sequence'; //id生成器
    import AssetCardComponents from '../components/AssetCardComponents';
    import {addAssetMng} from '@/api/oa/erp/ass/assetMng';
    import {Decimal} from 'decimal.js';
    import moneyTransToChinese from '@/utils/moneyTransToChinese';


    export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['assetDispose','visible', 'disposeData', 'mngParams'],
		watch: {
	        'assetDispose':function( assetDisposeOper ) {
	            this.addForm = assetDisposeOper;
	        },

            'visible':function(visible) {
                if(visible==true){
                    //从新打开页面时某些数据需要重新加载，可以在这里添加
                    this.setDefaultParam();
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
                        this.addForm.dispTotalOrignAmount = Number(dispTotalOrignAmount);
                        this.addForm.dispTotalOrignAmountChinese = moneyTransToChinese.transToChinese(dispTotalOrignAmount);
                        this.addForm.dispTotalScrapSaleAmount = Number(premiumSale);
                        this.addForm.dispTotalScrapSaleAmountChinese = moneyTransToChinese.transToChinese(premiumSale);
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'change' }
                    ],
                    reqTitle: [
                        { required: true, message: '标题不能为空', trigger: 'change' }
                    ]
				},
				//新增界面数据 ass_asset_detail_oper
				addForm: {
                    reqTitle: '',
                    reqUserid: '',
                    reqUsername: '',
                    reqDeptid: '',
                    reqDeptName: '',
                    reqDate: '',
                    id: '',
                    opType: '',
                    reqReason: '',
                    dispAddAssets: false,
                    //原值合计
                    dispTotalOrignAmount: 0,
                    dispTotalOrignAmountChinese: '零元',
                    dispTotalScrapSaleAmount: 0,
                    dispTotalScrapSaleAmountChinese: '零元',
                    inventoryTask: '',

				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
                uploadArchiveId: '',
                uploadCategoryId: '',
                assetData: [],
                selectAssetVisible: false,
                assetMng: "dispose",
                //资产处置单方式
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
                currentRow: 0,
                //展示选择资产按钮
                showSelectAssetBtn: true,
                showHoldBtn: true

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['addForm'].resetFields();
                this.assetData = [];
				this.$emit('submit');
            },

            addClose() {
                this.$refs['addForm'].resetFields();
                this.assetData = [];
            },

            addSubmit(status) {
                this.addForm.mngStatus = status;
                this.$refs.addForm.validate((valid) => {
					if (valid) {
                        let flag = this.validateAssetData();
                        if(!flag) return;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							//明细数据校验
							if(!this.isNull(this.addForm.reqDate) && this.addForm.reqDate instanceof Date) {
								this.addForm.reqDate = util.formatDate.format(this.addForm.reqDate, "yyyy-MM-dd HH:mm:ss")
							}
							let params = Object.assign({}, this.transfreData(this.addForm));
							addAssetMng(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
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

               this.assetData.forEach(p => {
                    if(!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
                        p.allocDate = util.formatDate.format(p.allocDate, "yyyy-MM-dd HH:mm:ss")
                    }
				})

                data.dispAddAssets = data.dispAddAssets ? '1' : '0';

				let param = {
					assetMng: data,
					assetDetails: this.assetData
                };

				return param;
            },

            validateAssetData() {
                if(this.assetData.length <= 0) {
					this.$message.error("资产处置清单不能为空");
					return false;
                }
                return true;
            },


            //设置默认参数
			setDefaultParam() {
        var that = this;
				let user = this.userInfo;
				this.addForm.reqUserid = user.userid;
				this.addForm.reqUsername = user.username;
				this.addForm.reqDeptid = user.deptid;
				this.addForm.reqDeptName = user.deptName;
				this.addForm.reqDate = new Date();
                this.addForm.id = sn();

                //设置
                if(that.disposeData !== null) {
                  console.log(that.disposeData);
                    // that.assetData = that.disposeData;
                    console.log(334,that.assetData);
                    that.addForm.inventoryTask = that.mngParams.taskId;
                    that.showSelectAssetBtn = false;

                    if(!that.mngParams.isShowHold) {
                        that.showHoldBtn = false;
                    }
                }


                //操作类型：领用
                that.addForm.opType = "dispose";
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'asset_dispose_upload';
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

            //删除表单数据
            delRow(index) {
                this.assetData.splice(index, 1);
            },

            //获取选择的资产数据
            getAssetData(data) {
              console.log(123,this.assetData);
                data.forEach(d => {
					let flag = this.assetData.some(item => {
						if(item.cardId == d.cardId) {
							return true;
						}
                    })
                    if(flag) {return};
                    this.$set(d, "allocDate", new Date());
                    this.assetData.push(d);
                })
                this.selectAssetVisible = false;
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
            'asset-card-components' : AssetCardComponents,
        },

		mounted() {
			this.addForm=Object.assign(this.addForm, this.assetDispose);
			this.setDefaultParam();
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

.topSpace{
    margin-top: 20px;
}

</style>
