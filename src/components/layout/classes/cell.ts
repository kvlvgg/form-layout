import type { VNode } from 'vue';

type CellProps = {
	colspan: number;
	rowspan: number;
};

export class Cell {
	vnode: VNode;
	props: CellProps = {
		colspan: 1,
		rowspan: 1,
	};

	style = {
		'column-start': 0,
		'column-span': 0,
		'row-start': 0,
		'row-span': 0,
	};

	getStyle() {
		return {
			'grid-column-start': `${this.style['column-start']}`,
			'grid-column-end': `${this.style['column-span']} span`,
			'grid-row-start': `${this.style['row-start']}`,
			'grid-row-end': `${this.style['row-span']} span`,
		};
	}

	constructor(vnode: VNode) {
		this.vnode = vnode;
		if (vnode.props?.colspan) this.props.colspan = vnode.props.colspan;
		if (vnode.props?.rowspan) this.props.rowspan = vnode.props.rowspan;
	}

	public static create(vnode: VNode) {
		return new Cell(vnode);
	}
}

