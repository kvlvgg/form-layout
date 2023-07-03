<template>
    <div ref="layout" :class="$style['form-layout']" :style="layoutStyle">
        <component
            v-for="(builder, i) in builders"
            :key="i"
            :is="builderComponents[builder.type]"
            :items="builder.items"
            :rowStart="i === 0 ? 0 : builders[i - 1].rowEnd"
            :rowEnd.sync="builder.rowEnd"
            :columnGap="columnGap"
            :rowGap="rowGap"
            @update:rowEnd="test"
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
type Builder = { type: 'column' | 'row'; rowEnd: number; items: (ColumnVNode | RowVNode)[] };

@Component
export default class FormLayout extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) rowAutoSize!: boolean;
    @Prop({ type: Boolean, default: false }) isLoading!: boolean;

    test() {
        console.log('updated', this.builders);
    }

    $refs!: {
        layout: HTMLDivElement;
    };

    builderComponents = {
        column: FormLayoutColumnBuilder,
        row: FormLayoutRowBuilder,
    };

    layoutStyle = {
        'grid-template-columns': '',
        'grid-template-rows': '',
        'column-gap': '',
        'row-gap': '',
        'margin-top': `${this.mt}px`,
    };

    builders: Builder[] = [];

    mounted() {
        const children = this.$slots.default?.map(child =>
            Object.assign(child, { role: child.tag?.toLowerCase().includes('column') ? 'column' : 'row' })
        ) as (ColumnVNode | RowVNode)[];

        this.builders = children?.reduce((builders, child) => {
            const builder = builders[builders.length - 1];
            if (builder?.type === child.role) builder.items.push(child);
            if (!builder || builder.type !== child.role) builders.push({ type: child.role, rowEnd: 0, items: [child] });

            return builders;
        }, [] as Builder[]);

        this.layoutStyle['column-gap'] = this.$style[`distance-${this.columnGap}`];
        this.layoutStyle['row-gap'] = this.$style[`distance-${this.rowGap}`];
        this.layoutStyle['margin-top'] = `${this.mt}px`;
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
