<template>
	<div ref="root" :style="layoutStyle" :class="$style.formLayout">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useCssModule, useSlots, watch } from 'vue';

import { useCells, useChildren, useLayout } from '@/components/layout/composables';
import { setCellStyle } from '@/components/layout/helpers';

const props = defineProps({
	mt: { type: String, default: '0' },
	columnGap: { type: String, default: 'lg' },
	rowGap: { type: String, default: 'x2s' },
	rowAutoSize: { type: Boolean, default: false },
});

const style = useCssModule();
const slots = useSlots();
const children = useChildren(slots);
const layout = useLayout(children, props);
const cells = useCells(layout);

const layoutStyle = computed(() => ({
	'column-gap': style[`distance-${props.columnGap}`],
	'row-gap': style[`distance-${props.rowGap}`],
	'margin-top': `${props.mt}px`,
	...layout.value.getGridTemplate(),
}));

const root = ref<HTMLDivElement | null>(null);

onMounted(buildLayout);
watch(cells, buildLayout);

function buildLayout() {
	nextTick(() => {
		if (!root.value) return;

		const children = Array.from(root.value.children);
		children.forEach((child, childIndex) => setCellStyle(child as HTMLDivElement, cells.value[childIndex].getStyle()));
	});
}
</script>

<style lang="scss" module>
.formLayout {
	display: grid;
	align-items: center;
}

:export {
	distance: {
		x2s: $distance-x2s;
		xs: $distance-xs;
		sm: $distance-sm;
		md: $distance-md;
		lg: $distance-lg;
		xl: $distance-xl;
	}
}
</style>

