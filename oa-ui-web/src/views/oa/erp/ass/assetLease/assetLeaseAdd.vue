<template>
    <section>
        <el-row class="page-container border padding">
            <el-row>
				<div>
					<el-button size="small" @click="cancel">取消</el-button>
                    <el-button type="primary" size="small" @click="addSubmit('hold')">暂存</el-button>
					<el-button type="primary" size="small" @click="addSubmit('submit')">提交并发审</el-button>
				</div>
    			<el-divider content-position="center">资产出租/出借</el-divider>
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
							<el-input disabled placeholder="资产出租/出借单"></el-input>
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

                    <el-table-column prop="deptName" align="center" label="资产使用部门"  width="200">
                    </el-table-column>

                    <el-table-column prop="liableUserName" align="center" label="责任人"  width="100">
                    </el-table-column>

                     <el-table-column prop="warehouseName" align="center" label="存放地点"  width="200">
                    </el-table-column>

                    <el-table-column align="center" label="操作"  width="80">
                            <template slot-scope="row">
                            <i class="el-icon-remove-outline" @click="delRow(row.$index)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <el-row class="topSpace">
                <el-col :span="8">
                    <el-form-item label="借用开始时间" prop="startDate">
                        <el-date-picker
                            v-model="addForm.startDate"
                            type="date"
                            placeholder="开始日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="16">
                    <el-form-item label="借用结束时间" prop="endDate">
                        <el-date-picker
                            v-model="addForm.endDate"
                            type="date"
                            placeholder="借用结束时间">
                        </el-date-picker>
                        <span style="margin-left: 20px">共  {{addForm.totalDay}}  天</span>
                        <span v-if="dateTip" style="color: red; margin-left: 20px">* 结束时间不能早于开始时间</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row class="topSpace">
                <el-col :span="8">
                    <el-form-item label="借入机构" >
                        <el-input @focus="visibleInBranchSelect = true"  v-model="addForm.inBranchName" ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="借入部门" >
                        <el-input @focus="openInDept"  v-model="addForm.inDeptName" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row class="topSpace">
                <el-col :span="8">
                    <el-form-item label="借出机构" >
                        <el-input @focus="visibleOutBranchSelect = true" v-model="addForm.outBranchName" ></el-input>
                    </el-form-item>
                </el-col>

                 <el-col :span="8">
                    <el-form-item label="借出部门" >
                        <el-input @focus="openOutDept" v-model="addForm.outDeptName" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row class="topSpace">
                <el-form-item label="借出事由" prop="reqReason">
                    <el-input type="textarea" v-model="addForm.reqReason" :rows="4"></el-input>
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

        <el-dialog append-to-body   title="选择部门" width="50%" top="5vh"  :visible.sync="visibleInDeptSelect" >
			<dept-tree :defaultExpandAll="true" @node-click="getInDeptData"></dept-tree>
        </el-dialog>

         <el-dialog append-to-body   title="选择部门" width="50%" top="5vh"  :visible.sync="visibleOutDeptSelect" >
			<dept-tree :defaultExpandAll="true" @node-click="getOutDeptData"></dept-tree>
        </el-dialog>

        <el-dialog append-to-body  title="选择机构" width="50%" top="5vh" :visible.sync="visibleInBranchSelect">
            <branch-select @row-click="getInBranchData"></branch-select>
        </el-dialog>

        <el-dialog append-to-body  title="选择机构" width="50%" top="5vh" :visible.sync="visibleOutBranchSelect">
            <branch-select @row-click="getOutBranchData"></branch-select>
        </el-dialog>

    </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import {sn} from '@/common/js/sequence'; //id生成器
    import AssetCardComponents from '../components/AssetCardComponents';
    import DeptTree from '@/views/mdp/sys/dept/DeptTree';
    import BranchSelect from '@/views/mdp/sys/branch/BranchSelect';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
    import {addAssetMng} from '@/api/oa/erp/ass/assetMng';

    export default {
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['assetLease','visible'],
		watch: {
	      'assetLease':function( assetLeaseOper ) {
	            this.addForm = assetLeaseOper;
	      },
	      'visible':function(visible) {
                if(visible==true){
                    //从新打开页面时某些数据需要重新加载，可以在这里添加
                    this.setDefaultParam();
                }
           },
           addForm: {
                handler:function(val, oldval) {
                    if(!this.isNull(val.startDate) && !this.isNull(val.endDate)) {
                        this.addForm.totalDay = this.getDaysBetween(val.startDate, val.endDate);
                        this.addForm.totalDay < 0 ? this.dateTip = true : this.dateTip = false;
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
                    ],
                    inDeptName: [
                        { required: true, message: '借入部门不能为空', trigger: 'change' }
                    ],
                    outDeptName: [
                        { required: true, message: '借出部门不能为空', trigger: 'change' }
                    ],

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
                selectAssetVisible: false,
                visibleInDeptSelect: false,
                visibleOutDeptSelect: false,
                visibleInBranchSelect: false,
                visibleOutBranchSelect: false,
                //是否是批量选择
                isBatchChange: false,
                batchDisabled: true,
                assetMng: "lease",
                dateTip: false,


				/**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['addForm'].resetFields();
                this.assetData = [];
                this.$emit('submit');
                Object.assign(this.$data.addForm, this.$options.data().addForm);
            },

            addClose() {
                this.$refs['addForm'].resetFields();
                this.assetData = [];
                Object.assign(this.$data.addForm, this.$options.data().addForm);
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
							if(!this.isNull(this.addForm.reqDate) && this.addForm.reqDate instanceof Date ) {
								this.addForm.reqDate = util.formatDate.format.format(this.addForm.reqDate, "yyyy-MM-dd HH:mm:ss")
							}
                            let params = Object.assign({}, this.transfreData(this.addForm));
							addAssetMng(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
                    }
				});
            },

            transfreData(data) {

                if(!this.isNull(data.startDate) && data.startDate instanceof Date) {
					data.startDate = util.formatDate.format.format(data.startDate, "yyyy-MM-dd HH:mm:ss")
                }

                if(!this.isNull(data.endDate) && data.endDate instanceof Date) {
                    data.endDate = util.formatDate.format.format(data.endDate, "yyyy-MM-dd HH:mm:ss")
                }

                this.assetData.forEach(p => {
                    if(!this.isNull(p.allocDate) && p.allocDate instanceof Date) {
                        p.allocDate = util.formatDate.format.format(p.allocDate, "yyyy-MM-dd HH:mm:ss")
                    }
				})


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

                //校验日期，结束日期不能早于开始日期
                if(this.dateTip) {
                    this.$message.error("结束日期不能早于开始日期");
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
                this.addForm.opType = "lease";
				this.uploadArchiveId = this.addForm.id;
				this.uploadCategoryId = 'asset_lease_upload';
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
                    // this.$set(d,"liableUserid", this.userInfo.userid);
                    // this.$set(d,"liableUserName",  this.userInfo.username);
                    this.$set(d,"allocDate",  new Date());
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

            //开启借入部门
            openInDept() {
                this.visibleInDeptSelect = true;
            },

            getInDeptData(data) {
                this.addForm.inDeptId = data.deptid;
                this.addForm.inDeptName = data.deptName;
                this.visibleInDeptSelect = false;
            },

            //开启借出部门
            openOutDept() {
                this.visibleOutDeptSelect = true;
            },

            getOutDeptData(data) {
                this.addForm.outDeptId = data.deptid;
                this.addForm.outDeptName = data.deptName;
                this.visibleOutDeptSelect = false;
            },

            getInBranchData(data) {
                this.addForm.inBranchId = data.id;
                this.addForm.inBranchName = data.branchName;
                this.visibleInBranchSelect = false;
            },

            getOutBranchData(data) {
                this.addForm.outBranchId = data.id;
                this.addForm.outBranchName = data.branchName;
                this.visibleOutBranchSelect = false;
            },

        },

        components: {
			//在下面添加其它组件 'pur-require-edit':PurRequireEdit
            'attachment-upload': AttachmentUpload,
            'asset-card-components' : AssetCardComponents,
            'dept-tree' : DeptTree,
            'user-select' : UsersSelect,
            'branch-select' : BranchSelect
        },

		mounted() {
			this.addForm=Object.assign(this.addForm, this.assetLease);
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
