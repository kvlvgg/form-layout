<template>
    <div v-show="isVisible && isParentVisible" ref="layout-cell">
        <slot />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FormLayoutColumn from '@/components/FormLayoutColumn.vue';

@Component
export default class FormLayoutCell extends Vue {
    @Prop({ type: Boolean, default: true }) isVisible!: boolean;
    @Prop({ type: Number, default: 1 }) colspan!: number;
    @Prop({ type: Number, default: 1 }) rowspan!: number;

    $parent!: FormLayoutColumn;

    private get isParentVisible() {
        return this.$parent.isVisible;
    }

    $refs!: {
        'layout-cell': HTMLDivElement;
    };

    public 'column-start' = 0;
    public 'column-span' = 0;
    public 'row-start' = 0;
    public 'row-span' = 0;

    public setStyle(styleProperty: string, value: number) {
        let keyword = '';
        if (styleProperty === 'grid-column-end' || styleProperty === 'grid-row-end') {
            keyword = ' span';
        }
        this.$refs['layout-cell'].style.setProperty(styleProperty, `${value}` + keyword);
    }

    @Watch('isVisible')
    onIsVisible() {
        this.$emit('is-visible-changed');
    }
}
</script>
