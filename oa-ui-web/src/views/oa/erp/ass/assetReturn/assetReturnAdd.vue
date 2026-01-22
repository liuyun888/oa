<template>
    <section>
        <el-row class="page-container border padding">

            <el-row>
				<div>
					<el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
					<el-button type="primary" size="small" @click="addSubmit('submit')">提交并发审</el-button>
				</div>
    			<el-divider content-position="center">资产归还</el-divider>
			</el-row>

            <!--新增界面 PurRequire pur_require-->
			<el-form :model="addForm" size="small"  label-width="100px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-form-item label="标题" prop="reqTitle">
						<el-input v-model="addForm.reqTitle" placeholder="请输入标题" ></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="类别">
							<el-input disabled placeholder="资产归还单"></el-input>
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

            <el-row>
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

                    <el-table-column prop="categoryName" align="center" label="资产类别"  width="">
                    </el-table-column>

                    <el-table-column prop="spec" align="center" label="规格型号"  width="">
                    </el-table-column>

                    <el-table-column prop="orignUnitAmount" align="center" label="原值"  width="">
                    </el-table-column>

                    <el-table-column prop="" align="center" label="归还日期"  width="245">
                        <template slot-scope="row">
							<el-date-picker
                                @focus="setCurrentRow(row.$index)"
								v-model="assetData[row.$index].allocDate"
								type="date"
								size="mini"
								placeholder="选择日期"
                                :clearable="false">
							</el-date-picker>
						</template>
                    </el-table-column>

                    <el-table-column prop="" align="center" label="归还后存放地点"  width="200">
                         <template slot-scope="row">
                            <span class="vTip">*</span>
                           <el-input @focus="openWarehouseSelect(row.$index)" v-model="assetData[row.$index].nowWarehouseName" size="mini"> </el-input>
                            <div v-show="validateData[row.$index].threeShow">
                                <i class="el-icon-warning"></i>
                                <span class="tipMsg">{{validateData[row.$index].threeMsg}}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作"  width="80">
                            <template slot-scope="row">
                            <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="operBar">
                   <div class="operBtn">
                        <el-row>
                            <el-button :disabled="batchDisabled" type="primary" size="mini" @click="batchUsed('warehouse')">批量存放地点</el-button>
                        </el-row>
                   </div>
                </div>
            </el-row>


            <el-row style="margin-top: 20px">
                <el-form-item label="申请事由" prop="reqReason">
                    <el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
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


        <el-dialog append-to-body @close="selectWarehouseClose" title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
			<warehouse-components @row-click="getWarehouseData"></warehouse-components>
		</el-dialog>



    </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import {sn} from '@/common/js/sequence'; //id生成器
    import AssetCardComponents from '../components/AssetCardComponents';
    import WarehouseComponents from '../../stk/components/WarehouseComponents';
    import {addMngFlow} from '@/api/oa/erp/ass/assetMng';

    import {sendReturnToProcessApprova} from '@/api/oa/erp/ass/assUtil';

    export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['assetReturn','visible'],
		watch: {
	      'assetReturn':function( assetReturn ) {
	            this.addForm = assetReturn;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
                //从新打开页面时某些数据需要重新加载，可以在这里添加
                this.setDefaultParam();
	      	}
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
                //验证数据
                validateData: [],
                assetMng: "return",
                currentRow: 0,

				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['addForm'].resetFields();
                this.assetData = [];
                this.validateData = [];
				this.$emit('submit');
            },

            addClose() {
                this.$refs['addForm'].resetFields();
                this.assetData = [];
                this.validateData = [];
            },

            addSubmit(status) {
                this.addForm.mngStatus = 'hold';
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
              addMngFlow(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.detailData = [];
                                    sendReturnToProcessApprova(this,res.data.data);
                                    this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
                    }
				});
            },

            transfreData(data) {
                if(this.assetData.length > 0) {
					this.assetData.forEach(p => {
						if(!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
							p.allocDate = util.formatDate.format(p.allocDate, "yyyy-MM-dd HH:mm:ss")
						}
					})
				}
				let param = {
					assetMng: data,
					assetDetails: this.assetData
				};
				return param;
            },

            validateAssetData() {
                if(this.assetData.length <= 0) {
					this.$message.error("入库资产清单不能为空");
					return false;
				}

				this.assetData.forEach((d, index) => {
					this.validateDetail(index, "three");
				})

				//验证是否完成
				let flag = "true";
				this.validateData.forEach (d => {
					if(d.threeShow) {
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
				let user = this.userInfo;
				this.addForm.reqUserid = user.userid;
				this.addForm.reqUsername = user.username;
				this.addForm.reqDeptid = user.deptid;
				this.addForm.reqDeptName = user.deptName;
				this.addForm.reqDate = new Date();
                this.addForm.id = sn();
                //操作类型：领用
                this.addForm.opType = "return";
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'asset_return_upload';
            },

            validateDetail(index, position) {
				let param = this.assetData[index];
                let data = this.validateData[index];
				switch(position) {
					case 'three' :
                        this.isNull(param.nowWarehouseName) ? data.threeShow = true : data.threeShow = false;
                    break;
				}
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
                    this.$set(d, "allocDate", new Date());
                    this.$set(d, "deptid", this.userInfo.deptid);
                    this.$set(d, "deptName",  this.userInfo.deptName);
                    this.$set(d,"liableUserid", this.userInfo.userid);
                    this.$set(d,"liableUserName",  this.userInfo.username);
                    this.assetData.push(d);
                    let validate = {
						threeMsg: "存放地点不能为空",
						threeShow: false,
					}
					this.validateData.push(validate);
                })
                if(data.length >0) this.batchDisabled = false;
                this.selectAssetVisible = false;
            },

            openWarehouseSelect(index) {
                this.currentRow = index;
                this.visibleWarehouseSelect = true;
            },

            //打开仓库选择
            getWarehouseData(data) {
                if(this.isBatchChange) {
                    this.assetData.forEach(a => {
                        this.$set(a,"nowStoreAddress",  data.address);
                        this.$set(a,"nowWarehouseId", data.id);
                        this.$set(a,"nowWarehouseName",  data.name);
                    })
                }else {
                        this.$set(this.assetData[this.currentRow],"nowStoreAddress",  data.address);
                        this.$set(this.assetData[this.currentRow],"nowWarehouseId", data.id);
                        this.$set(this.assetData[this.currentRow],"nowWarehouseName",  data.name);
                }
                this.isBatchChange = false;
                this.visibleWarehouseSelect = false;
                this.batchRemoveValidate(3);
            },

            //批量选择取消验证
            batchRemoveValidate(index) {
                this.validateData.forEach(v => {
                    if(index === 3) {
                        v.threeShow = false;
                    }
                })
            },

            batchUsed(type) {
                if(this.assetData.length === 0) {
                    return;
                }
                this.isBatchChange = true;
                this.visibleWarehouseSelect = true;
            },

            //选择仓库关闭
            selectWarehouseClose() {
                this.isNull(this.assetData[this.currentRow].nowWarehouseName) ? this.validateData[this.currentRow].threeShow = true : this.validateData[this.currentRow].threeShow = false;
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
            'warehouse-components' : WarehouseComponents
        },

		mounted() {
			this.addForm=Object.assign(this.addForm, this.assetReturn);
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


</style>
