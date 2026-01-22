<template>
    <section>
        <el-row  id="containers" class="page-container border padding">
            <el-row style="margin-bottom: 20px">
				<div>
					<el-button size="small" @click="cancel">取消</el-button>
                    <el-button type="primary" size="small" @click="addSubmit('hold')">保存</el-button>
				</div>
			</el-row>

            <el-form :model="editForm" size="small"  label-width="70px"  ref="editForm">
                
                <el-row>
                    <el-col :span="1" class="checkClass">
                       <el-checkbox v-model="checkedArr.checked1"></el-checkbox>
                   </el-col>
                   <el-col :span="17">
                        <el-form-item prop="assetName" label="资产名称">
                            <el-input v-model="editForm.assetName"></el-input>
                        </el-form-item>
                   </el-col>
                    <span v-show="validate.isShow1" class="tipMsg">{{validate.showMsg1}}</span>
                </el-row>

                <el-row>

                    <el-col :span="1" class="checkClass">
                        <el-checkbox v-model="checkedArr.checked2"></el-checkbox>
                   </el-col>

                   <el-col :span="17">
                        <el-form-item prop="spec" label="规格型号">
                            <el-input v-model="editForm.spec"></el-input>
                        </el-form-item>
                   </el-col>
                   <span v-show="validate.isShow2" class="tipMsg">{{validate.showMsg2}}</span>
                </el-row>

                <el-row>
                    <el-col :span="1" class="checkClass">
                        <el-checkbox v-model="checkedArr.checked3"></el-checkbox>
                    </el-col>

                   <el-col :span="17">
                        <el-form-item prop="categoryName" label="资产类别">
                            <el-input @focus="visibleSelectAssetType=true" suffix-icon="el-icon-collection-tag" v-model="editForm.categoryName"></el-input>
                        </el-form-item>
                   </el-col>
                   <span v-show="validate.isShow3" class="tipMsg">{{validate.showMsg3}}</span>
                </el-row>

                <el-row>
                    <el-col :span="1" class="checkClass">
                       <el-checkbox v-model="checkedArr.checked4"></el-checkbox>
                   </el-col>

                   <el-col :span="17">
                        <el-form-item prop="deptName" label="使用部门">
                            <el-input @focus="openDeptSelect" suffix-icon="el-icon-collection-tag" v-model="editForm.deptName"></el-input>
                        </el-form-item>
                   </el-col>
                   <span v-show="validate.isShow4" class="tipMsg">{{validate.showMsg4}}</span>
                </el-row>

                <el-row>
                    <el-col :span="1" class="checkClass">
                        <el-checkbox v-model="checkedArr.checked5"></el-checkbox>
                   </el-col>

                   <el-col :span="17">
                        <el-form-item prop="personLiableUsername" label="责任人">
                            <el-input @focus="openPersonLiableUserSelect" suffix-icon="el-icon-collection-tag" v-model="editForm.personLiableUsername"></el-input>
                        </el-form-item>
                   </el-col>
                   <span v-show="validate.isShow5" class="tipMsg">{{validate.showMsg5}}</span>
                </el-row>

                <el-row>

                    <el-col :span="1" class="checkClass">
                        <el-checkbox v-model="checkedArr.checked6"></el-checkbox>
                   </el-col>

                   <el-col :span="17">
                        <el-form-item prop="warehouseName" label="存放地点">
                            <el-input @focus="openWarehouseSelect" suffix-icon="el-icon-collection-tag" v-model="editForm.warehouseName"></el-input>
                        </el-form-item>
                   </el-col>

                    <span v-show="validate.isShow6" class="tipMsg">{{validate.showMsg6}}</span>
                </el-row>

                <el-row>
                    <el-col :span="1" class="checkClass">
                        <el-checkbox v-model="checkedArr.checked7" ></el-checkbox>
                   </el-col>

                   <el-col :span="17">
                        <el-form-item prop="cardStatus" label="资产状态">
                            <el-radio v-model="editForm.cardStatus" label="0">闲置</el-radio>
                            <el-radio v-model="editForm.cardStatus" label="1">在用</el-radio>
                            <el-radio v-model="editForm.cardStatus" label="1">借用</el-radio>
                            <el-radio v-model="editForm.cardStatus" label="3">维修</el-radio>
                            <el-radio v-model="editForm.cardStatus" label="4">报废</el-radio>
                        </el-form-item>
                   </el-col>

                   <span v-show="validate.isShow7" class="tipMsg">{{validate.showMsg7}}</span>
                </el-row>
            </el-form>
        </el-row>

        <el-dialog append-to-body title="选择资产分类" center width="60%" :visible.sync="visibleSelectAssetType" :close-on-click-modal="false">
			<asset-category-tree @node-click="getSelectAssetTypeData" @cancel="visibleSelectAssetType=false" ></asset-category-tree>
		</el-dialog>


         <el-dialog append-to-body title="选择部门" width="50%" top="5vh" :visible.sync="visibleDeptSelect" >
			<dept-tree :defaultExpandAll="true" @node-click="getDeptData"></dept-tree>
        </el-dialog>

        <el-dialog append-to-body  title="仓库选择" width="70%" top="5vh" :visible.sync="visibleWarehouseSelect">
			<warehouse-components @row-click="getWarehouseData"></warehouse-components>
		</el-dialog>

        <el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visiblepersonLiableUserSelect">
            <user-select @confirm="getPersonLiableUserData" :isSingleUser="true"></user-select>
        </el-dialog>

        <el-dialog append-to-body  title="人员选择" width="70%" top="5vh" :visible.sync="visiblePurchaseUserSelect">
            <user-select @confirm="getPurchaseUserData" :isSingleUser="true"></user-select>
        </el-dialog>

        <supplier-components :append-to-body="true" :visible="visibleSupplierSelect" @row-click="getSupplierData"></supplier-components>

         <el-dialog top="10vh" title="选择资产" append-to-body width="60%" :visible.sync="visibleAssetSelect"  :close-on-click-modal="false">
			<asset-card-components isSingerSelect="true"  @row-click="getAssetData" ref="assetDetail" :visible="visibleAssetSelect" @cancel="visibleAssetSelect=false" ></asset-card-components>
		</el-dialog>



    </section>
</template>

<script>
    import util from '@/common/js/util';//全局公共库
    import { mapGetters } from 'vuex';
    import { editAssetCard, batchEditAssetCard} from '@/api/oa/erp/ass/assetCard';
    import AssetCategoryTree from '../../ass/components/AssetCategoryTree';
    import DeptTree from '@/views/mdp/sys/dept/DeptTree';
    import WarehouseComponents from '../../stk/components/WarehouseComponents';
    import UsersSelect from '@/views/mdp/sys/user/UsersSelect';
    import SupplierComponents from '../../pur/components/SupplierComponents';
    import AssetCardComponents from '../components/AssetCardComponents';
    import AttachmentUpload from '@/views/mdp/arc/archiveAttachment/AttachmentUpload';
    import { isExitAssetSn } from '@/api/oa/erp/ass/assetCard';


    export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		}, 
		props:['assetCard', 'visible', 'assetType', 'cardIds'],
		watch: {

	      'assetCard':function( assetReceiveOper ) {
	            this.editForm = assetReceiveOper;
          },
          
          'assetType':function( data ) {
	            this.assetTypeObj = data;
          },

	      'visible':function(visible) {
	      	if(visible==true){
                //从新打开页面时某些数据需要重新加载，可以在这里添加
                this.editForm=Object.assign(this.editForm, this.assetCard);
                this.setDefaultParams();
	      	}
          }
          
        },
        data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'1',optionName:'女',seqOrder:'1',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				//新增界面数据 ass_asset_detail_oper
				editForm: {
                    assetName: '',
                    spec: '',
                    categoryId: '',
                    categoryName: '',
                    deptid: '',
                    deptName: '',
                    personLiableUserid: '',
                    personLiableUsername: '',
                    storeAddress: '',
                    warehouseId: '',
                    warehouseName: '',
                    cardStatus: '',   
                },

               
                /**begin 在下面加自定义属性,记得补上面的一个逗号**/
                assetTypeObj: '',
                visibleSelectAssetType: false,
                visibleDeptSelect: false,
                visibleWarehouseSelect: false,
                visiblepersonLiableUserSelect: false,
                visiblePurchaseUserSelect: false,
                visibleSupplierSelect: false,
                visibleAssetSelect: false,

                //上传数据
                uploadArchiveId: '',
                uploadCategoryId: '',

                //限制上传个数
                uploadLimit: 1,

                assetMsgShow: false,
                assetMsgTip: '',

                //验证
                checkedArr: {
                    checked1: false,
                    checked2: false,
                    checked3: false,
                    checked4: false,
                    checked5: false,
                    checked6: false,
                    checked7: false,
                },

                validate: {
                    isShow1: false,
                    showMsg1: '资产名称不能为空',
                    isShow2: '',
                    showMsg2: '',
                    isShow3: '',
                    showMsg3: '',
                    isShow4: '',
                    showMsg4: '',
                    isShow5: '',
                    showMsg5: '',
                    isShow6: '',
                    showMsg6: '',
                    isShow7: '',
                    showMsg7: '',
                },

                batchUpdateCardIds: [],

                /**end 在上面加自定义属性**/
			}//end return
        },//end data
        methods: {

            cancel(){
                this.$refs['editForm'].resetFields();
				this.$emit('cancel');
            },

            addClose() {
                this.$refs['editForm'].resetFields();
            },

            isNull(data) {
				if(data === null || data === '' || data === undefined) {
					return true;
				}
				return false;
            },
            
            getSelectAssetTypeData(data) {
                this.editForm.categoryId = data.categoryId;
                this.editForm.categoryName = data.categoryName;
                this.visibleSelectAssetType = false;
            },

            //开启部门选择
            openDeptSelect() {
                this.visibleDeptSelect = true;
            },

            //获取部门数据
            getDeptData(data) {
                this.editForm.deptid = data.deptid;
                this.editForm.deptName = data.deptName;
                this.visibleDeptSelect = false;
            },


            //开启仓库地址选择
            openWarehouseSelect() {
                this.visibleWarehouseSelect = true;
            },

            //获取仓库地址数据
            getWarehouseData(data) {
                this.editForm.warehouseId = data.id;
                this.editForm.warehouseName = data.name;
                this.editForm.storeAddress = data.address;
                this.visibleWarehouseSelect = false;
            },

             //开启责任人选择
            openPersonLiableUserSelect() {
                 this.visiblepersonLiableUserSelect = true;
             },


            //获取责任人数据
            getPersonLiableUserData(data) {
                this.editForm.personLiableUserid = data[0].userid;
                this.editForm.personLiableUsername = data[0].username;
                this.visiblepersonLiableUserSelect = false;
            },

            openPurchaseUserSelect() {
                this.visiblePurchaseUserSelect = true;
            },

            getPurchaseUserData(data) {
                this.editForm.purchaseUserid = data[0].userid;
                this.editForm.purchaseUsername = data[0].username;
                this.visiblePurchaseUserSelect = false;
            },


            //打开供应商显示
            openSupplierSelect() {
                this.visibleSupplierSelect = true;
            },

            //获得供应商数据
            getSupplierData(data) {
                this.editForm.supplierId = data.cpId;
                this.editForm.supplierName = data.cpName;
                this.visibleSupplierSelect = false;
            },



            //获得资产卡片数据
            getAssetData(data) {
                this.editForm.passetName = data.assetName;
                this.editForm.passetSn = data.assetSn;
                this.visibleAssetSelect = false;
            },

            //获取资产图片
            getImageUrl(file, fileList2) {
                fileList2.length === 0 ? this.editForm.assetImageUrl = '' : this.editForm.assetImageUrl = file.url;
            },

            setDefaultParams() {
                //需要批量修改的卡片Id
                this.cardIds.forEach(c => {
                    this.batchUpdateCardIds.push(c.cardId);
                })
                this.uploadArchiveId = this.editForm.cardId;
                this.uploadCategoryId = 'asset_card_upload';
            },


            addSubmit() {
                //验证是否有修改数据
                let flag = this.validateData();
                if(!flag) {
                    return;
                }
                //验证修改数据是否为空
                let result = this.isAllNull();

                if(!result) {
                    this.$message({
                        message: '请至少勾选一个修改项',
                        type: 'error'
                    });
                    return;
                }

                this.$refs.editForm.validate((valid) => {
					if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
                            let params = Object.assign({}, this.transferData(this.editForm)); 
							batchEditAssetCard(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
                                }
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
                    }
				});
            },

            transferData(data) {
                let params = {}

                if(this.checkedArr.checked1) {
                    this.$set(params,"assetName", data.assetName);
                }

                if(this.checkedArr.checked2) {
                    this.$set(params,"spec", data.spec);
                }

                if(this.checkedArr.checked3) {
                    this.$set(params,"categoryId", data.categoryId);
                    this.$set(params,"categoryName", data.categoryName);
                }

                if(this.checkedArr.checked4) {
                    this.$set(params,"deptid", data.deptid);
                    this.$set(params,"deptName", data.deptName);
                }

                if(this.checkedArr.checked5) {
                    this.$set(params,"personLiableUserid", data.personLiableUserid);
                    this.$set(params,"personLiableUsername", data.personLiableUsername);
                }

                if(this.checkedArr.checked6) {
                    this.$set(params,"storeAddress", data.storeAddress);
                    this.$set(params,"warehouseId", data.warehouseId);
                    this.$set(params,"warehouseName", data.warehouseName);
                }
                if(this.checkedArr.checked7) {
                    this.$set(params,"cardStatus", data.cardStatus);
                }
                this.$set(params,"cardIds", this.batchUpdateCardIds);
                return params;
            },

            validateData() {
                let flag = true;
                //如果第一个填写了
                if(this.checkedArr.checked1) {
                    if(this.isNull(this.editForm.assetName)) {
                        flag = false;
                        this.validate.isShow1 = true;
                        this.validate.showMsg1= '资产名称不能为空';
                    }else {
                        this.validate.isShow1 = false;
                    }
                }

                if(this.checkedArr.checked2) {
                    if(this.isNull(this.editForm.spec)) {
                         flag = false;
                        this.validate.isShow2 = true;
                        this.validate.showMsg2= '规格型号';
                    }else {
                        this.validate.isShow2 = false;
                    }
                }

                if(this.checkedArr.checked3) {
                    if(this.isNull(this.editForm.categoryName)) {
                         flag = false;
                        this.validate.isShow3 = true;
                        this.validate.showMsg3= '资产类别不能为空';
                    }else {
                        this.validate.isShow3 = false;
                    }
                }

                if(this.checkedArr.checked4) {
                    if(this.isNull(this.editForm.deptName)) {
                         flag = false;
                        this.validate.isShow4 = true;
                        this.validate.showMsg4= '使用部门不能为空';
                    }else {
                        this.validate.isShow4 = false;
                    }
                }

                if(this.checkedArr.checked5) {
                    if(this.isNull(this.editForm.personLiableUsername)) {
                         flag = false;
                        this.validate.isShow5 = true;
                        this.validate.showMsg5= '责任人';
                    }else {
                        this.validate.isShow5 = false;
                    }
                }

                if(this.checkedArr.checked6) {
                    if(this.isNull(this.editForm.warehouseName)) {
                         flag = false;
                        this.validate.isShow6 = true;
                        this.validate.showMsg6= '存放地点不能为空';
                    }else {
                        this.validate.isShow6 = false;
                    }
                }

                if(this.checkedArr.checked7) {
                    if(this.isNull(this.editForm.cardStatus)) {
                         flag = false;
                        this.validate.isShow7 = true;
                        this.validate.showMsg7= '资产状态不能为空';
                    }else {
                        this.validate.isShow7 = false;
                    }
                }
                return  flag ;
            },

            isAllNull() {
                if(!this.checkedArr.checked1 && !this.checkedArr.checked2 && !this.checkedArr.checked3 && !this.checkedArr.checked4
                    && !this.checkedArr.checked5 && !this.checkedArr.checked6 && !this.checkedArr.checked7) {
                    return false;
                }else {
                    return true;
                }
            },




        },
     
        components: {
            //在下面添加其它组件 'pur-require-edit':PurRequireEdit
            "asset-category-tree" : AssetCategoryTree,
            'dept-tree' : DeptTree,
            'warehouse-components' : WarehouseComponents,
            'user-select' : UsersSelect,
            'supplier-components': SupplierComponents,
            'asset-card-components' : AssetCardComponents,
            'attachment-upload': AttachmentUpload,
        },
        
		mounted() {
            this.$nextTick(() => {
                this.setDefaultParams();
            })
		}
    }

</script>

<style scoped>

.tipMsg {
	color: red;
    margin-left: 12px;
    font-size: 12px;
    line-height: 30px;
}

.checkClass {
    margin-right: 5px;
    margin-top: 6px;
}

</style>