import type { VNode } from 'vue';

import { isCell, reduceVNodes } from '@/components/layout/helpers';
import { Cell } from '@/components/layout/classes/cell';

type LineProps = {
	span: number;
};

export class Line {
	vnode: VNode;
	cells: Cell[];

	props: LineProps = {
		span: 1,
	};

	constructor(vnode: VNode) {
		this.vnode = vnode;
		if (vnode.props?.span) this.props.span = vnode.props.span;

		this.cells = [];
		if (vnode.children !== null && typeof vnode.children !== 'string' && 'default' in vnode.children) {
			const defaultSlotVNodes = (vnode.children.default as () => VNode[])();
			this.cells = reduceVNodes(defaultSlotVNodes, isCell).map((child: VNode) => Cell.create(child));
		}
	}

	public static create(vnode: VNode) {
		return new Line(vnode);
	}

	getCells() {
		return this.cells;
	}
}

