import type { ComputedRef, VNode, Slots } from 'vue';
import type { LayoutProps } from '@/components/layout/types';

import { computed } from 'vue';
import { Layout } from '@/components/layout/classes/layout';
import { isColumnOrRow, reduceVNodes } from '@/components/layout/helpers';

type CLayout = ComputedRef<Layout>;
type CVNodes = ComputedRef<VNode[]>;

export function useChildren(slots: Slots): CVNodes {
	return computed(() => {
		const children = slots.default?.() ?? [];
		return reduceVNodes(children, isColumnOrRow);
	});
}

export function useLayout(children: CVNodes, props: LayoutProps): CLayout {
	return computed(() => Layout.create(children.value, props));
}

export function useCells(layout: CLayout) {
	return computed(() => layout.value.getCells());
}

