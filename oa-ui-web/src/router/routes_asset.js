import Vue from 'vue'
/* Layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)

export default {

   routes: [
        {
            path: '/oa/erp/ass',
            component: Layout,
            name: '资产管理',
            meta: {
                title: '资产管理',
                icon: 'property'
            },
            iconCls: 'fa el-icon-menu',
            //leaf: true,//只有一个节点
            children: [
                { path: 'assetDetail/AssetDetailMng', component: _import('oa/erp/ass/assetDetail/Index'), name: 'AssetDetailMng', meta: { title: '资产总览' } },
                { path: 'assetCard/AssetCardMng', component: _import('oa/erp/ass/assetCard/Index'), name: '资产卡片', meta: { title: '资产卡片' } },
                { path: 'assetMng/AssetMngMng', component: _import('oa/erp/ass/assetMng/Index'), name: 'AssetMngMng', meta: { title: '申请管理' } },
                { path: 'assetMng/MyAssetMngMng', component: _import('oa/erp/ass/assetMng/MyAssetMngMng'), name: 'MyAssetMngMng', meta: { title: '我的申请' } },
                { path: 'pur/stockIn/StockInMng', component: _import('oa/erp/pur/stockIn/Index'), name: '资产入库', meta: { title: '资产入库' } },
                { path: 'assetCategory/AssetCategory', component: _import('oa/erp/ass/assetCategory/AssetCategoryMng'), name: '资产分类', meta: { title: '资产分类' } },
                { path: 'assetInventoryTask/AssetInventoryTaskMng', component: _import('oa/erp/ass/assetInventoryTask/Index'), name: '盘点任务', meta: { title: '盘点任务' } },
                { path: 'assetInventory/assetInventoryMng', component: _import('oa/erp/ass/assetInventory/Index'), name: '资产盘点', meta: { title: '资产盘点' } },
                { path: 'warehouse/WarehouseMng', component: _import('oa/erp/stk/warehouse/WarehouseMng'), name: '仓库管理', meta: { title: '仓库管理' } },
            ]
        },
        {
            path: '/oa/erp/pur',
            component: Layout,
            name: '采购管理',
            meta: {
                title: '采购管理',
                icon: 'property'
            },
            iconCls: 'fa el-icon-menu',
            //leaf: true,//只有一个节点
            children: [
                { path: 'require/RequireMng', component: _import('oa/erp/pur/require/RequireMng'), name: '申购单管理', meta: { title: '申购单管理' } },
                { path: 'require/RequireDetailMng', component: _import('oa/erp/pur/requireDetail/RequireDetailMng'), name: '申购物资清单', meta: { title: '申购物资清单' } },
                { path: 'order/OrderMng', component: _import('oa/erp/pur/order/OrderMng'), name: '采购单管理', meta: { title: '采购单管理' } },
                { path: 'order/OrderDetailMng', component: _import('oa/erp/pur/orderDetail/OrderDetailMng'), name: '采购物资清单', meta: { title: '采购物资清单' } },
                { path: 'stockIn/StockInMng', component: _import('oa/erp/pur/stockIn/StockInMng'), name: '入库管理', meta: { title: '入库管理' } },
                { path: 'stockIn/StockInDetailMng', component: _import('oa/erp/pur/stockInDetail/StockInDetailMng'), name: '入库清单', meta: { title: '入库清单' } },
                { path: 'supplier/SupplierMng', component: _import('oa/erp/pur/supplier/SupplierMng'), name: '供应商管理', meta: { title: '供应商管理' } },
                { path: 'brand/BrandMng', component: _import('oa/erp/pur/brand/BrandMng'), name: '品牌管理', meta: { title: '品牌管理' } },
            ]
        },
   ]

}
