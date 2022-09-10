<template>
    <div ref="layout" :class="$style['form-layout']" :style="layoutStyle">
        <component
            v-for="(builder, i) in builders"
            :key="i"
            :is="builder[0].role === 'column' ? ColumnBuilder : RowBuilder"
            :cols="builder"
            :rowsssss="builder"
            :columnGap="columnGap"
            :rowGap="rowGap"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayoutColumnBuilder from '@/components/FormLayoutColumnBuilder.vue';
import FormLayoutRowBuilder from '@/components/FormLayoutRowBuilder.vue';
import { VNode } from 'vue';

type ColumnVNode = VNode & { role: 'column' };
type RowVNode = VNode & { role: 'row' };

@Component
export default class FormLayout extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) rowAutoSize!: boolean;
    @Prop({ type: Boolean, default: false }) isLoading!: boolean;

    $refs!: {
        layout: HTMLDivElement;
    };

    ColumnBuilder = FormLayoutColumnBuilder;
    RowBuilder = FormLayoutRowBuilder;

    private layoutStyle = {
        'grid-template-columns': '',
        'grid-template-rows': '',
        'column-gap': '',
        'row-gap': '',
        'margin-top': `${this.mt}px`,
    };

    get builders() {
        const children = this.$slots.default?.map(child =>
            Object.assign(child, { role: child.tag?.toLowerCase().includes('column') ? 'column' : 'row' })
        ) as (ColumnVNode | RowVNode)[];

        const result = children?.reduce((builders, child) => {
            const builder = builders[builders.length - 1];
            if (builder?.[0].role === child.role) builder?.push(child);
            if (!builder || builder?.[0].role !== child.role) builders.push([child]);

            return builders;
        }, [] as (ColumnVNode | RowVNode)[][]);

        console.log(result);

        return result;
    }
}
</script>

<style module lang="scss">
@import '@/assets/_variables.scss';
.form-layout {
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
