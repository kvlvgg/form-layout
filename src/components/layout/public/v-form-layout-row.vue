<template>
	<slot />
</template>

<script setup lang="ts">
defineProps({
	span: { type: Number, default: 1 },
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { COMPONENT_NAMES } from '@/components/layout/constants';

export default defineComponent({
	name: COMPONENT_NAMES.ROW,
});
</script>

