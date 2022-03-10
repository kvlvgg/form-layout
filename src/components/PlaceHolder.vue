<template>
    <div :style="placeholderStyle" :class="$style.filler" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayout from '@/components/FormLayout.vue';

// Компонент для демонстрации шаблона
@Component
export default class Placeholder extends Vue {
    @Prop({ type: Number, default: 1 }) colspan!: number;

    get layout() {
        return this.$parent.$parent.$parent as FormLayout;
    }

    get rowDistance() {
        return this.$style[`distance-${this.layout.rowGap}`];
    }

    get placeholderStyle() {
        return {
            height: `calc(${this.$style[`height`]} * ${this.colspan} + ${this.rowDistance} * ${this.colspan - 1})`,
        };
    }
}
</script>

<style module lang="scss">
@import '@/assets/_variables.scss';

.filler {
    width: 100%;
    background-color: #888888;
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

    height: 32px;
}
</style>
