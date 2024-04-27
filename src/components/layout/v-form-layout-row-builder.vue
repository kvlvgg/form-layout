<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FormLayoutRow from '@/components/layout/v-form-layout-row.vue';
import { CreateElement, VNode } from 'vue';

@Component
export default class FormLayoutRowBuilder extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) rowAutoSize!: boolean;
    @Prop({ type: Boolean, default: false }) isLoading!: boolean;

    @Prop({ type: Array, default: () => [] }) items!: VNode[];
    @Prop({ type: Number, default: 0 }) rowStart!: number;
    @Prop({ type: Number, default: 0 }) rowEnd!: number;

    render(h: CreateElement) {
        return h('fragment', this.$slots.default);
    }

    $children!: FormLayoutRow[];
    $refs!: {
        layout: HTMLDivElement;
    };

    @Watch('rowStart')
    onRowStart() {
        this.buildLayout();
    }

    private layoutStyle = {
        'grid-template-columns': '',
        'grid-template-rows': '',
        'column-gap': '',
        'row-gap': '',
        'margin-top': `${this.mt}px`,
    };

    private get rows() {
        return this.$children.filter(x => x.isVisible && x.role === 'row');
    }

    private mounted() {
        this.subsribeOnColumnsEvents();
        this.subsribeOnCellsEvents();
        this.buildLayout();
    }

    private subsribeOnColumnsEvents() {
        this.$children.forEach(column => {
            column.$on('is-visible-changed', () => this.buildLayout());
        });
    }

    private subsribeOnCellsEvents() {
        this.$children.forEach(column => {
            column.$children.forEach(cell => {
                cell.$on('is-visible-changed', () => this.buildLayout());
            });
        });
    }

    private buildLayout() {
        this.calculateCellsPositions();
        if (!this.$isIE) this.buildGridTemplate();
        else this.buildGridTemplateForIE();
    }

    private calculateCellsPositions() {
        this.rows.forEach((row, rowIndex) => {
            this.getVisibleCells(row).forEach((cell, cellIndex) => {
                const leftGridColumnEnd = this.getLeftGridColumnEnd(rowIndex, cellIndex);
                const columnOffset = this.countColumnOffset(rowIndex, leftGridColumnEnd);

                cell['column-start'] = leftGridColumnEnd + columnOffset; // если cell.rowspan > 1, надо вычислять
                cell['column-span'] = cell.rowspan;
                cell['row-start'] = rowIndex + 1 + this.rowStart;
                cell['row-span'] = cell.colspan;
            });
        });
    }

    private countColumnOffset(rowIndex: number, leftGridColumnEnd: number, shift = 0): number {
        const leftNeighborsSpans = this.rows.reduce(
            (spans, row, currIndex) => {
                const aboveCell = this.getVisibleCells(row).find(
                    cell =>
                        cell['column-start'] <= leftGridColumnEnd &&
                        leftGridColumnEnd < cell['column-start'] + cell['column-span']
                );
                // Нас интересуют только колонки сверху.
                if (rowIndex <= currIndex) return spans;
                // Если сумма достигла индекса текущей строки, то нам нельзя учитывать colspan
                // ячейки в текущей колонки, иначе мы посчитаем лишний rowspan.
                if (currIndex < spans.rowspan) return spans;
                // Возможна ситуация, когда в колонке сверзу меньше детей, чем в текущей.
                // В этой ситуации будем считать так, как будто там есть ячейка с colspan = 1.
                if (!aboveCell) {
                    spans.rowspan += 1;
                    return spans;
                }

                spans.colspan = aboveCell['column-span'];
                spans.rowspan += aboveCell['row-span'];
                return spans;
            },
            {
                colspan: 1,
                rowspan: 0,
            }
        );

        const needsToBeShifted = leftNeighborsSpans.rowspan > rowIndex;
        if (needsToBeShifted)
            return this.countColumnOffset(
                rowIndex,
                leftGridColumnEnd + leftNeighborsSpans.colspan,
                shift + leftNeighborsSpans.colspan
            );
        return shift;
    }

    private getLeftGridColumnEnd(rowIndex: number, cellIndex: number): number {
        if (cellIndex === 0) return 1;

        const leftCell = this.getVisibleCells(this.rows[rowIndex])[cellIndex - 1];
        return leftCell['column-start'] + leftCell['column-span'];
    }

    // region CSS Grid Layout for All browsers except IE
    private buildGridTemplate() {
        this.$children.forEach(column => {
            this.getVisibleCells(column).forEach(cell => {
                cell.setStyle('grid-column-start', cell['column-start']);
                cell.setStyle('grid-column-end', cell['column-span']);
                cell.setStyle('grid-row-start', cell['row-start']);
                cell.setStyle('grid-row-end', cell['row-span']);
                cell.setStyle('align-self', cell.align);
            });
        });

        // this.layoutStyle['grid-template-columns'] = this.getGridTemplateColumns();
        this.layoutStyle['grid-template-rows'] = this.getGridTemplateRows();
        this.layoutStyle['column-gap'] = this.$style[`distance-${this.columnGap}`];
        this.layoutStyle['row-gap'] = this.$style[`distance-${this.rowGap}`];

        this.$emit('update:rowEnd', this.getMaxColumnsGridRow());
        this.$emit('update:gridTemplateColumns', this.getGridTemplateColumns());
        this.$emit('update:gridTemplateRows', this.getGridTemplateRows());
    }

    private getGridTemplateColumns() {
        const [longestRow] = this.rows.sort((a, b) => {
            const [lastCellA] = this.getVisibleCells(a).reverse();
            const [lastCellB] = this.getVisibleCells(b).reverse();
            const lastCellALength = lastCellA['column-start'] - lastCellA['column-span'];
            const lastCellBLength = lastCellB['column-start'] - lastCellB['column-span'];

            return lastCellBLength - lastCellALength;
        });

        const [lastCell] = this.getVisibleCells(longestRow).reverse();
        const lastCellLength = lastCell['column-start'] + lastCell['column-span'] - 1;

        return Array.from({ length: lastCellLength }).fill('1fr').join(' ');
    }

    private getGridTemplateRows() {
        return Array.from({ length: this.getMaxColumnsGridRow() - this.rowStart })
            .fill(this.rowAutoSize ? 'auto' : '1fr')
            .join(' ');
    }

    private getMaxColumnsGridRow() {
        const columnsChildrenMaxGridRows = [];

        for (const cell of this.getVisibleCells(this.rows[this.rows.length - 1])) {
            columnsChildrenMaxGridRows.push(cell['row-start'] + cell['row-span'] - 1);
        }

        return Math.max(...columnsChildrenMaxGridRows);
    }
    // end region

    // region CSS Grid Layout For IE
    private buildGridTemplateForIE() {
        this.$children.forEach(column => {
            this.getVisibleCells(column).forEach(cell => {
                cell['column-start'] = 2 * cell['column-start'] - 1;
                cell['column-span'] = 2 * cell['column-span'] - 1;
                cell['row-start'] = 2 * cell['row-start'] - 1;
                cell['row-span'] = 2 * cell['row-span'] - 1;

                cell.setStyle('-ms-grid-column', cell['column-start']);
                cell.setStyle('-ms-grid-column-span', cell['column-span']);
                cell.setStyle('-ms-grid-row', cell['row-start']);
                cell.setStyle('-ms-grid-row-span', cell['row-span']);
            });
        });

        this.$refs.layout.style.setProperty('-ms-grid-columns', this.getGridTemplateColumnsForIE());
        this.$refs.layout.style.setProperty('-ms-grid-rows', this.getGridTemplateRowsForIE());
    }

    private getGridTemplateColumnsForIE() {
        const columnGap = this.$style[`distance-${this.columnGap}`];
        return Array.from({ length: this.getMaxCellPerRow() })
            .fill(this.rowAutoSize ? 'auto' : '1fr')
            .join(` ${columnGap} `);
    }

    private getMaxCellPerRow() {
        const maxCellDistanceForChildren = [];

        for (const row of this.rows) {
            const visibleCells = this.getVisibleCells(row);
            const lastCell = visibleCells[visibleCells.length - 1];
            if (!lastCell) continue;
            else maxCellDistanceForChildren.push(lastCell['column-start'] + lastCell['column-span']);
        }

        return Math.max(...maxCellDistanceForChildren) / 2;
    }

    private getGridTemplateRowsForIE() {
        const rowGap = this.$style[`distance-${this.rowGap}`];
        return Array.from({ length: this.getMaxColumnsGridRowForIE() / 2 })
            .fill(this.rowAutoSize ? 'auto' : '1fr')
            .join(` ${rowGap} `);
    }

    private getMaxColumnsGridRowForIE() {
        const columnsChildrenMaxGridRows = [];

        for (const column of this.rows) {
            const visibleCells = this.getVisibleCells(column);
            const lastCell = visibleCells[visibleCells.length - 1];
            if (!lastCell) continue;
            else columnsChildrenMaxGridRows.push(lastCell['row-start'] + lastCell['row-span']);
        }

        return Math.max(...columnsChildrenMaxGridRows);
    }
    // end region

    private getVisibleCells(column: FormLayoutRow) {
        return column.$children.filter(x => x.isVisible);
    }
}
</script>

<style module lang="scss">
@import '@/assets/_variables.scss';

.form-layout {
    display: grid;
    display: -ms-grid;
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
