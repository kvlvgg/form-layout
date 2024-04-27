<template>
	<div>
		<slot />
	</div>
</template>

<script setup lang="ts">
defineProps({
	colspan: { type: Number, default: 1 },
	rowspan: { type: Number, default: 1 },
	align: { type: String, default: 'auto' },
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { COMPONENT_NAMES } from '@/components/layout/constants';

export default defineComponent({
	name: COMPONENT_NAMES.CELL,
});
</script>

