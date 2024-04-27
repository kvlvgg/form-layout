<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayoutColumnBuilder from '@/components/layout/v-form-layout-column-builder.vue';
import FormLayoutRowBuilder from '@/components/layout/v-form-layout-row-builder.vue';
import { CreateElement, VNode } from 'vue';

type ColumnVNode = { type: 'column'; vnode: VNode };
type RowVNode = { type: 'row'; vnode: VNode };
type Builder = {
    id: number;
    type: 'column' | 'row';
    items: VNode[];
};

type BuilderState = {
    id: number;
    type: 'column' | 'row';
    rowEnd: number;
    gridTemplateColumns: string;
    gridTemplateRows: string;
};

@Component
export default class FormLayout extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) rowAutoSize!: boolean;

    render(h: CreateElement) {
        const getComponentType = ({ componentOptions }: VNode) =>
            componentOptions?.tag?.toLowerCase().includes('column') ? 'column' : 'row';
        const createChild = (vnode: VNode) => ({ type: getComponentType(vnode), vnode });

        const vnodes = this.$slots.default?.filter(vnode => vnode.tag) ?? [];
        const children = vnodes.map(vnode => createChild(vnode)) as (ColumnVNode | RowVNode)[];

        const createBuilder = (id: number, type: 'column' | 'row', items: VNode[]) => ({
            id,
            type,
            items,
        });

        const builders = children.reduce((builders, child, index) => {
            const lastBuilder = builders.at(-1);

            if (lastBuilder?.type === child.type) lastBuilder.items.push(child.vnode);
            else builders.push(createBuilder(index, child.type, [child.vnode]));

            return builders;
        }, [] as Builder[]);

        if (!this.buildersState.length)
            this.buildersState = builders.map(builder => ({
                id: builder.id,
                type: builder.type,
                rowEnd: 0,
                gridTemplateColumns: '',
                gridTemplateRows: '',
            }));

        const getBuilderState = (builder: Builder) => this.buildersState.find(x => x.id === builder.id) as BuilderState;

        return h(
            'div',
            { class: this.$style['form-layout'], style: { ...this.layoutStyle, ...this.gridTemplate } },

            builders.map((builder, i) => {
                const rowStart = i === 0 ? 0 : getBuilderState(builders[i - 1]).rowEnd;
                const builderState = getBuilderState(builder);

                return h(
                    this.builderComponents[builder.type],
                    {
                        props: {
                            rowStart,
                            rowEnd: builderState.rowEnd,
                            gridTemplateColumns: builderState.gridTemplateColumns,
                            gridTemplateRows: builderState.gridTemplateRows,
                            columnGap: this.columnGap,
                            rowGap: this.rowGap,
                            rowAutoSize: this.rowAutoSize,
                        },

                        on: {
                            'update:rowEnd': (value: number) => (builderState.rowEnd = value),
                            'update:gridTemplateColumns': (value: string) => (builderState.gridTemplateColumns = value),
                            'update:gridTemplateRows': (value: string) => (builderState.gridTemplateRows = value),
                        },
                    },
                    builder.items
                );
            })
        );
    }

    mounted() {
        this.layoutStyle['column-gap'] = this.$style[`distance-${this.columnGap}`];
        this.layoutStyle['row-gap'] = this.$style[`distance-${this.rowGap}`];
        this.layoutStyle['margin-top'] = `${this.mt}px`;
    }

    builderComponents = {
        column: FormLayoutColumnBuilder,
        row: FormLayoutRowBuilder,
    };

    layoutStyle = {
        'column-gap': '',
        'row-gap': '',
        'margin-top': `${this.mt}px`,
    };

    buildersState: BuilderState[] = [];

    get gridTemplate() {
        return {
            'grid-template-columns': this.getTheLongestTemplate(this.buildersState),
            'grid-template-rows': this.buildersState.reduce((acc, curr) => `${acc} ${curr.gridTemplateRows}`, ''),
            '-ms-grid-columns': this.getTheLongestTemplate(this.buildersState),
            '-ms-grid-rows': this.buildersState.reduce((acc, curr) => `${acc} ${curr.gridTemplateRows}`, ''),
        };
    }

    getTheLongestTemplate(buildersState: BuilderState[]) {
        const firstColumnTemplate = buildersState.find(x => x.type === 'column')?.gridTemplateColumns ?? '';

        const templates = buildersState.map(x => x.gridTemplateColumns);
        const [longestTemplate = []] = templates.map(x => x.split(' ')).sort((a, b) => b.length - a.length);

        return longestTemplate.join(' ').length > firstColumnTemplate.length
            ? longestTemplate.join(' ')
            : firstColumnTemplate;
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
