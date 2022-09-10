<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayoutColumn from '@/components/FormLayoutColumn.vue';
import { CreateElement, VNode } from 'vue';

@Component
export default class FormLayout extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) rowAutoSize!: boolean;
    @Prop({ type: Boolean, default: false }) isLoading!: boolean;

    @Prop({ type: Array, default: () => [] }) cols!: VNode[];

    render(h: CreateElement) {
        return h('div', { ref: 'layout', class: this.$style['form-layout'], style: this.layoutStyle }, [this.cols]);
    }

    $children!: FormLayoutColumn[];
    $refs!: {
        layout: HTMLDivElement;
    };

    private layoutStyle = {
        'grid-template-columns': '',
        'grid-template-rows': '',
        'column-gap': '',
        'row-gap': '',
        'margin-top': `${this.mt}px`,
    };

    private get columns() {
        return this.$children.filter(x => x.isVisible && x.role === 'column');
    }

    private get rows() {
        return this.$children.filter(x => x.isVisible && x.role === 'row');
    }

    private mounted() {
        this.checkProperUsage();
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
        console.log('this.$isIE', this.$isIE);
        this.calculateCellsPositions();
        if (!this.$isIE) this.buildGridTemplate();
        else this.buildGridTemplateForIE();
    }

    private calculateCellsPositions() {
        this.columns.forEach((column, columnIndex) => {
            this.getVisibleCells(column).forEach((cell, cellIndex) => {
                const aboveGridRowEnd = this.getAboveGridRowEnd(columnIndex, cellIndex);
                const rowOffset = this.countRowOffset(columnIndex, aboveGridRowEnd);

                cell['column-start'] = columnIndex + 1;
                cell['column-span'] = cell.rowspan;
                cell['row-start'] = aboveGridRowEnd + rowOffset;
                cell['row-span'] = cell.colspan;
            });
        });

        this.rows.forEach((row, rowIndex) => {
            this.getVisibleCells(row).forEach((cell, cellIndex) => {
                cell['column-start'] = cellIndex + 1; // если cell.rowspan > 1, надо вычислять
                cell['column-span'] = cell.rowspan;
                cell['row-start'] = rowIndex + 1; // если cell.colspan > 1, надо вычислять
                cell['row-span'] = cell.colspan;
            });
        });
    }

    private countRowOffset(columnIndex: number, aboveCellGridRowEnd: number, shift = 0): number {
        const leftNeighborsSpans = this.columns.reduce(
            (spans, column, currIndex) => {
                const leftCell = this.getVisibleCells(column).find(
                    cell =>
                        cell['row-start'] <= aboveCellGridRowEnd &&
                        aboveCellGridRowEnd < cell['row-start'] + cell['row-span']
                );
                // Нас интересуют только колонки слева.
                if (columnIndex <= currIndex) return spans;
                // Если сумма достигла индекса текущей колонки, то нам нельзя учитывать rowspan
                // ячейки в текущей колонки, иначе мы посчитаем лишний rowspan.
                if (currIndex < spans.colspan) return spans;
                // Возможна ситуация, когда в колонке слева меньше детей, чем в текущей.
                // В этой ситуации будем считать так, как будто там есть ячейка с rowspan = 1.
                if (!leftCell) {
                    spans.colspan += 1;
                    return spans;
                }

                spans.colspan += leftCell['column-span'];
                spans.rowspan = leftCell['row-span'];
                return spans;
            },
            {
                colspan: 0,
                rowspan: 1,
            }
        );

        const needsToBeShifted = leftNeighborsSpans.colspan > columnIndex;
        if (needsToBeShifted)
            return this.countRowOffset(
                columnIndex,
                aboveCellGridRowEnd + leftNeighborsSpans.rowspan,
                shift + leftNeighborsSpans.rowspan
            );
        return shift;
    }

    private getAboveGridRowEnd(columnIndex: number, cellIndex: number): number {
        if (cellIndex === 0) return 1;

        const aboveCell = this.getVisibleCells(this.columns[columnIndex])[cellIndex - 1];
        return aboveCell['row-start'] + aboveCell['row-span'];
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

        this.layoutStyle['grid-template-columns'] = this.getGridTemplateColumns();
        this.layoutStyle['grid-template-rows'] = this.getGridTemplateRows();
        this.layoutStyle['column-gap'] = this.$style[`distance-${this.columnGap}`];
        this.layoutStyle['row-gap'] = this.$style[`distance-${this.rowGap}`];
    }

    private getGridTemplateColumns() {
        return this.columns
            .reduce((template, child) => {
                template.push(`${child.colspan}fr`);
                return template;
            }, [] as string[])
            .join(' ');
    }

    private getGridTemplateRows() {
        return Array.from({ length: this.getMaxColumnsGridRow() })
            .fill(this.rowAutoSize ? 'auto' : '1fr')
            .join(' ');
    }

    private getMaxColumnsGridRow() {
        const columnsChildrenMaxGridRows = [];

        for (const column of this.columns) {
            const visibleCells = this.getVisibleCells(column);
            const lastCell = visibleCells[visibleCells.length - 1];
            if (!lastCell) continue;
            else columnsChildrenMaxGridRows.push(lastCell['row-start'] + lastCell['row-span'] - 1);
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
        return this.columns
            .reduce((template, child) => {
                template.push(`${child.colspan}fr`);
                return template;
            }, [] as string[])
            .join(` ${columnGap} `);
    }

    private getMaxCellPerRow() {
        const cellCountForChildren = [this.columns.reduce((count, col) => count + col.colspan, 0)];

        for (const row of this.rows) {
            const visibleCells = this.getVisibleCells(row);
            const lastCell = visibleCells[visibleCells.length - 1];
            if (!lastCell) continue;
            else cellCountForChildren.push(lastCell['column-start'] + lastCell['column-span']);
        }

        return Math.max(...cellCountForChildren);
    }

    private getGridTemplateRowsForIE() {
        const rowGap = this.$style[`distance-${this.rowGap}`];
        return Array.from({ length: this.getMaxColumnsGridRowForIE() / 2 })
            .fill(this.rowAutoSize ? 'auto' : '1fr')
            .join(` ${rowGap} `);
    }

    private getMaxColumnsGridRowForIE() {
        const columnsChildrenMaxGridRows = [];

        for (const column of this.columns) {
            const visibleCells = this.getVisibleCells(column);
            const lastCell = visibleCells[visibleCells.length - 1];
            if (!lastCell) continue;
            else columnsChildrenMaxGridRows.push(lastCell['row-start'] + lastCell['row-span']);
        }

        return Math.max(...columnsChildrenMaxGridRows);
    }
    // end region

    private getVisibleCells(column: FormLayoutColumn) {
        return column.$children.filter(x => x.isVisible);
    }

    private checkProperUsage() {
        let isUsageError = false;

        this.$children.forEach(x => {
            if (x.$vnode.componentOptions?.tag !== 'v-form-layout-column') isUsageError = true;
        });

        // if (isUsageError)
        //     log.dev.error(__filename, 'Дочерними элементами v-form-layout могут быть только v-form-layout-column');
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
