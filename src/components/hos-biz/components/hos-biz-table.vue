/* 
* @Author: liruiqing@mediway.cn 
* @Date: 2022-03-12 10:56:42 
 * @Last Modified by: liruiqing@mediway.cn
 * @Last Modified time: 2022-08-02 15:55:10
*/
<template>
	<div class="hos-biz-table" :class="{flex: isFit}">
		<div class="hos-biz-form" v-if="form">
			<Form ref="form" v-bind="form" @reset="reset" @search="search">
				<slot name="form"></slot>
			</Form>
		</div>
		<slot name="top"></slot>
		<div class="hos-biz-toolbar clearfix" v-if="(page !== false && uiStyle == 1) || this.$slots.toolbar || columnSelected">
			<div class="hos-biz-toolbar-left" v-if="$slots.toolbar">
				<slot name="toolbar"></slot>
			</div>
			<div v-if="uiStyle == 1" class="hos-biz-toolbar-right">
				<div v-if="page !== false" class="hos-biz-pagination clearfix dib" :class="{'hasSetting': columnSelected}">
					<Page
						class="fr"
						@current-change="currentChange"
						@size-change="sizeChange"
						size="mini"
						:uid="uid"
						:total="total"
						ref="page"
						v-bind="pageConfig"
					></Page>
				</div>
				<div class="dib top-toolbar-table-setting" 
						v-if="columnSelected">
					<hos-popover 
						v-if="columnSelected"
						placement="bottom"
						width="100"
						trigger="click">
						<div 	
							v-for="(item, index) in cols" 
							:key="index" >
							<hos-checkbox 
							v-model="columnList" 						
							:label="item.columnSelectedLabel"
							>{{item.columnSelectedLabel}}</hos-checkbox>
						</div>
						<i class="hos-icon-setting" slot="reference"></i>
					</hos-popover>

				</div>
			</div>
			
		</div>
		<Table
			v-bind="$attrs"
			v-on="$listeners"
			v-loading="tableIsLoading"
			:uid="uid"
			:data="tableData"
			:asyncSlot="asyncSlot"
			:cols="selectedCols"
			:height="height"
		>
		</Table>
		<slot name="bottom"></slot>
		<div
			v-if="page !== false && uiStyle == 0"
			class="hos-biz-pagination clearfix"
			>
			<!-- <slot name="page"></slot> -->
			<Page
				class="simple-pagination"
				v-bind="pageConfig"
				@current-change="currentChange"
				@size-change="sizeChange"
				:uid="uid"
				:total="total"
				ref="page"
				prev-text="上一页"
				next-text="下一页"
			>
				<i class="hos-icon-refresh btn-refresh" @click="refresh"></i>
			</Page>
		</div>
	</div>
</template>
<script>
import Table from './table';
import Page from './pagination';
import Form from './form';
import tryGetOnlyArray from '../utils/data-patch-v1/try-get-only-array';
import tryGetPaginationParams from '../utils/data-patch-v1/try-get-pagination-params';
import { mapState } from 'vuex';
import { timestamp, uid, event, params, common } from '../utils/store-config';
import filterEmpty from '../utils/filter-empty';
import Sortable from 'sortablejs';
import RenderLabel from '../utils/render-label'
export default {
	name: 'HosBizTable',
	watch: {
		sTimestamp() {
			if (
				this.sUID === this.uid ||
				(this.sUID === 0 && this.sEvent === 'update')
			) {
				this.getData();
			}
		},
	},
	provide() {
		return {
			TABLE_PROVIDE: this,
		};
	},
	components: { Table, Page, Form },
	computed: {
		...mapState({
			sTimestamp: (state) => state.table[timestamp],
			sUID: (state) => state.table[uid],
			sEvent: (state) => state.table[event],
			sParams: (state) => state.table[params],
		}),
		formItems() {
			try {
				return Object.keys(this.form.model);
			} catch (e) {
				return [];
			}
		},
		asyncSlot() {
			const slotArr = ['form', 'page', 'top', 'bottom'];
			const _slot = {};
			Object.keys(this.$scopedSlots)
				.filter((ele) => !slotArr.includes(ele))
				.forEach((ele) => {
					_slot[ele] = this.$scopedSlots[ele];
				});
			return _slot;
		},
		pageConfig() {
			const simpleLayout = 'ssizes, home, prev, spager, next, end, slot, stotal';
			const hosLayout = 'total, home, prev, pager, next, end';
			const layout = this.uiStyle == 0 ? simpleLayout : hosLayout;
			if (Object.prototype.toString.call(this.page) === '[object Object]') {
				if (this.uiStyle == 0) {
					this.page.layout  = simpleLayout;
				} else {
					this.page.layout = hosLayout;
				}
				return Object.assign({}, this.page, { total: this.total });
			} else {
				return { total: this.total, layout };
			}
		},
		selectedCols(){
			if(this.columnSelected){
				const _arr = []
				for (let j = 0, lenj = this.cols.length; j < lenj;j++){
					for (let i = 0, len = this.columnList.length; i<len;i++){
						if ( this.columnList[i] === this.cols[j].columnSelectedLabel) {
							_arr.push(this.cols[j])
							break;
						}
					}
				}
				return _arr
			}
			return this.cols
		}
	},
	props: {
		uid: {
			default: 0,
		},
		data: {
			required: true,
		},
		init: {
			default: true,
		},
		form: Object | Boolean,
		page: Object | Boolean,
		pagePos: {
			default: 'bottom',
		},
		props: {
			default() {
				return {
					data: 'data',
					total: 'total',
				};
			},
		},
		dragable: Boolean,
		columnSelected: {type: Boolean, default: false},
		cols: {
			required: true,
			type: Array,
		},
		isFit: {
			type: Boolean,
			default: true
		}
	},
	data() {
		const UI_STYLE = process.env.VUE_APP_SIMPLE_ONCE
		return {
			uiStyle: UI_STYLE, // 0:极简  1:hos
			columnList: [],
			renderLabel: new RenderLabel(),
			dragTableBody: null,
			timer: null,
			params: {
				form: {},
				pagination: {},
			},
			tableData: [],
			tableIsLoading: false,
			total: undefined,
			height: undefined
		};
	},
	methods: {
		setTableData(response) {
			const data = response.data || response;
			this.tableIsLoading = false;
			let tableData = data[this.props.data];
			let total = data[this.props.total];
			if (!Array.isArray(tableData)) {
				tableData = tryGetOnlyArray(data).data;
			}
			if (typeof total !== 'number') {
				total = tryGetPaginationParams(data).total;
			}
			this.tableData = tableData;
			this.total = total;
		},
		parseData(params) {
			let _params = filterEmpty(params);
			if (typeof this.data === 'string') {
				this.tableIsLoading = true;
				/* eslint handle-callback-err: "warn" */
				return this.$api(this.data, _params).then(
					(response) => {
						this.setTableData(response);
					},
					(error) => {
						this.tableIsLoading = false;
					}
				);
			} else if (typeof this.data === 'function') {
				this.tableIsLoading = true;
				return this.data(_params).then(
					(response) => {
						this.setTableData(response);
					},
					(error) => {
						this.tableIsLoading = false;
					}
				);
			}
		},
		change() {
			if (Array.isArray(this.data)) {
				this.tableData = this.data;
				this.total = this.tableData.length;
			} else {
				return this.parseData({
					...this.params.form,
					...this.params.pagination,
					...this.sParams,
				});
			}
		},
		search(params) {
			this.params.form = params;
			// 点击搜索重置分页
			this.params.pagination.current = 1;
			if (this.$listeners.search) {
				return this.$emit('search', params);
			} else {
				return this.change();
			}
		},
		reset(params) {
			this.params.form = params;
			this.$emit('reset', params);
		},
		sizeChange(size) {
			this.params.pagination.size = size;
			this.params.pagination.current = 1;
			this.change();
		},
		currentChange(current) {
			this.params.pagination.current = current;
			this.change();
		},
		async getData() {
			try {
				if (this.page !== false) {
					this.params.pagination = await this.$refs.page.getParams();
				}
				if (this.form) {
					this.params.form = await this.$refs.form.getParams();
				}
				return this.change();
			} catch (error) {
				if (process.env.NODE_ENV === 'development')
					console.error('table debugger:', error);
			}
		},
		rowDrop() {
			this.dragTableBody = document
				.getElementById('hos-table-lq')
				.querySelector('.hos-table__body-wrapper tbody');
			const _this = this;
			Sortable.create(this.dragTableBody, {
				onEnd(evt) {
					const { newIndex, oldIndex } = evt;
					const currRow = _this.tableData.splice(oldIndex, 1)[0];
					_this.$emit('drag', newIndex, oldIndex, currRow);
					_this.tableData.splice(newIndex, 0, currRow);
				},
			});
		},
		setColumnToggle(){
			const renderLabel = new RenderLabel()
			this.columnList = this.cols.map(ele=>{
				let _label = renderLabel.getLabel(ele.label)
				ele.columnSelectedLabel = _label
				ele._show = true
				return _label
			})
		},
		refresh () {
			this.$store.commit('UPDATE_TABLE', {_uid: this.uid});
		}
		
	},
	mounted() {
		if (this.init) {
			this.getData();
		}
		// 拖拽行
		if (this.dragable) {
			this.rowDrop();
		}
		// 显示/隐藏列
		if (this.columnSelected){
			this.setColumnToggle()
		}
		if (this.isFit) {
			this.height = document.querySelector('.hos-table')? document.querySelector('.hos-table').offsetHeight: undefined
		}
	},
};
</script>
<style lang="scss" scoped>
.hos-biz-table {
    //overflow: hidden;
	flex-direction: column;
	height: 100%;
	background: transparent;
	&.flex {
		display: flex;
	}

	.hos-biz-toolbar {
		//overflow: hidden;
	}
}
</style>

<style lang="scss">
</style>
