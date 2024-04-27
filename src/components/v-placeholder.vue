<template>
	<div ref="placeholder" :class="$style.placeholder" :style="style">
		{{ props.text }}
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const placeholder = ref<HTMLDivElement | null>(null);
const colspan = ref(1);

const props = defineProps({
	text: { type: String, default: null },
});

const style = computed(() => ({
	height: `calc(24px * ${colspan.value} + 4px * ${colspan.value - 1})`,
}));

onMounted(() => {
	setTimeout(() => {
		const el = placeholder.value;
		const cell = el?.parentElement;

		if (!cell) return;
		const [, span] = getComputedStyle(cell).gridRowEnd.split(' ');

		colspan.value = Number(span);
	});
});
</script>

<style lang="scss" module>
.placeholder {
	background-color: white;
	color: black;
	min-width: 140px;
	min-height: 24px;

	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

