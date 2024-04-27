import type { VNode } from 'vue';
import { COMPONENT_NAMES } from '@/components/layout/constants';

type VNodeWithName = VNode & { type: { name: string } };

export const isColumnOrRow = (vnode: VNode) =>
	[COMPONENT_NAMES.COLUMN, COMPONENT_NAMES.ROW].some(x => x === (vnode as VNodeWithName).type.name);

export const isCell = (vnode: VNode) => (vnode as VNodeWithName).type.name === COMPONENT_NAMES.CELL;

// vnode объявленный с помощью синтаксиса v-for.
export const isCollectionNode = (vnode: VNode) => vnode.type === Symbol.for('v-fgt');

export const getName = <T = string>(vnode?: VNode) => (vnode ? (vnode as VNodeWithName).type.name : '') as unknown as T;

export const reduceVNodes = (vnodes: VNode[], isType: typeof isColumnOrRow | typeof isCell) =>
	vnodes.reduce((children, child) => {
		if (isType(child)) children.push(child);
		if (isCollectionNode(child)) children.push(...Array.from(child.children as VNode[]).filter(child => isType(child)));

		return children;
	}, [] as VNode[]);

export const setCellStyle = (el: HTMLDivElement, style: Record<string, string>) => {
	for (const styleProperty in style) {
		el.style.setProperty(styleProperty, style[styleProperty]);
	}
};

