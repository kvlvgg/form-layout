<template>
    <div :style="placeholderStyle" :class="$style.filler">
        {{ rowOrColumnText + ' ' + text }}
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayout from '@/components/FormLayout.vue';

// Компонент для демонстрации шаблона
@Component
export default class Placeholder extends Vue {
    @Prop({ type: String, default: null }) text!: number;
    @Prop({ type: Number, default: 1 }) colspan!: number;

    get layout() {
        return this.$parent?.$parent?.$parent as FormLayout;
    }

    get rowDistance() {
        return this.$style[`distance-${this.layout.rowGap}`];
    }

    get rowOrColumnText() {
        return this.$parent?.$parent.role.slice(0, 3);
    }

    get placeholderStyle() {
        return {
            height: `calc(${this.$style[`height`]} * ${this.colspan} + ${this.rowDistance} * ${this.colspan - 1})`,
            // 'background-color': `#${Math.floor(Math.random() * 1_000_000)}`,
            'background-color': `#777777`,
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'font-size': '30px',
            color: 'black',
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

    height: 56px;
}
</style>
