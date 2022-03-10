<template>
    <div ref="layout" :class="$style['form-layout']" :style="layoutStyle">
        <slot />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormLayoutColumn from '@/components/FormLayoutColumn.vue';

@Component
export default class FormLayout extends Vue {
    @Prop({ type: String, default: '0' }) mt!: string;
    @Prop({ type: String, default: 'lg' }) columnGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: String, default: 'x2s' }) rowGap!: 'x2s' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    @Prop({ type: Boolean, default: false }) isLoading!: boolean;

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
        return this.$children.filter(x => x.isVisible);
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
        this.columns.forEach(column => {
            this.getVisibleCells(column).forEach(cell => {
                cell.setStyle('grid-column-start', cell['column-start']);
                cell.setStyle('grid-column-end', cell['column-span']);
                cell.setStyle('grid-row-start', cell['row-start']);
                cell.setStyle('grid-row-end', cell['row-span']);
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
        return Array.from({ length: this.getMaxColumnsGridRow() }).fill('1fr').join(' ');
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
        this.columns.forEach(column => {
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

    private getGridTemplateRowsForIE() {
        const rowGap = this.$style[`distance-${this.rowGap}`];
        return Array.from({ length: this.getMaxColumnsGridRowForIE() / 2 })
            .fill('1fr')
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
            if (x.$vnode.componentOptions?.tag !== 'FormLayoutColumn') isUsageError = true;
        });

        if (isUsageError) console.error('Дочерними элементами v-form-layout могут быть только v-form-layout-column');
    }
}
</script>

<style module lang="scss">
@import '@/assets/_variables.scss';

.form-layout {
    display: grid;
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
