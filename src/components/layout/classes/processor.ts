import { Segment } from '@/components/layout/classes/segment';
import { COMPONENT_NAMES } from '@/components/layout/constants';

class ColumnSegmentProcessor {
	segment: Segment;
	rowStart: number;

	constructor(segment: Segment, rowStart: number) {
		this.segment = segment;
		this.rowStart = rowStart;
	}

	public calculateStyle() {
		this.calculateCellsPositions();
		this.calculateSegmentStyle();
	}

	private calculateCellsPositions() {
		this.segment.lines.forEach((line, lineIndex) => {
			line.cells.forEach((cell, cellIndex) => {
				const aboveGridRowEnd = this.getAboveGridRowEnd(lineIndex, cellIndex);
				const rowOffset = this.countRowOffset(lineIndex, aboveGridRowEnd);

				cell.style['column-start'] = lineIndex + 1;
				cell.style['column-span'] = cell.props.rowspan;
				cell.style['row-start'] = aboveGridRowEnd + rowOffset;
				cell.style['row-span'] = cell.props.colspan;
			});
		});
	}

	private calculateSegmentStyle() {
		this.segment.rowStart = this.rowStart;
		this.segment.rowEnd = this.getMaxColumnsGridRow();
		this.segment.gridTemplateColumns = this.getGridTemplateColumns();
		this.segment.gridTemplateRows = this.getGridTemplateRows();
	}

	private getAboveGridRowEnd(lineIndex: number, cellIndex: number): number {
		if (cellIndex === 0) return this.rowStart + 1;

		const aboveCell = this.segment.lines[lineIndex].cells[cellIndex - 1];
		return aboveCell.style['row-start'] + aboveCell.style['row-span'];
	}

	private countRowOffset(lineIndex: number, aboveCellGridRowEnd: number, shift = 0): number {
		const leftNeighborsSpans = this.segment.lines.reduce(
			(spans, line, currLineIndex) => {
				const leftCell = line.cells.find(
					cell =>
						cell.style['row-start'] <= aboveCellGridRowEnd &&
						aboveCellGridRowEnd < cell.style['row-start'] + cell.style['row-span'],
				);
				// Нас интересуют только колонки слева.
				if (lineIndex <= currLineIndex) return spans;
				// Если сумма достигла индекса текущей колонки, то нам нельзя учитывать rowspan
				// ячейки в текущей колонки, иначе мы посчитаем лишний rowspan.
				if (currLineIndex < spans.colspan) return spans;
				// Возможна ситуация, когда в колонке слева меньше детей, чем в текущей.
				// В этой ситуации будем считать так, как будто там есть ячейка с rowspan = 1.
				if (!leftCell) {
					spans.colspan += 1;
					return spans;
				}

				spans.colspan += leftCell.style['column-span'];
				spans.rowspan = leftCell.style['row-span'];
				return spans;
			},
			{
				colspan: 0,
				rowspan: 1,
			},
		);

		const needsToBeShifted = leftNeighborsSpans.colspan > lineIndex;
		if (needsToBeShifted)
			return this.countRowOffset(
				lineIndex,
				aboveCellGridRowEnd + leftNeighborsSpans.rowspan,
				shift + leftNeighborsSpans.rowspan,
			);
		return shift;
	}

	private getMaxColumnsGridRow() {
		const columnsChildrenMaxGridRows = [];

		for (const line of this.segment.lines) {
			const lastCell = line.cells[line.cells.length - 1];
			if (!lastCell) continue;
			else columnsChildrenMaxGridRows.push(lastCell.style['row-start'] + lastCell.style['row-span'] - 1);
		}

		return Math.max(...columnsChildrenMaxGridRows);
	}

	private getGridTemplateColumns() {
		return this.segment.lines
			.reduce((template, line) => {
				template.push(`${line.props.span}fr`);
				return template;
			}, [] as string[])
			.join(' ');
	}

	private getGridTemplateRows() {
		return Array.from({ length: this.getMaxColumnsGridRow() - this.rowStart })
			.fill(this.segment.layoutProps.rowAutoSize ? 'auto' : '1fr')
			.join(' ');
	}
}

class RowSegmentProcessor {
	segment: Segment;
	rowStart;

	constructor(segment: Segment, rowStart: number) {
		this.segment = segment;
		this.rowStart = rowStart;
	}

	public calculateStyle() {
		this.calculateCellsPositions();
		this.calculateSegmentStyle();
	}

	private calculateCellsPositions() {
		this.segment.lines.forEach((line, lineIndex) => {
			line.cells.forEach((cell, cellIndex) => {
				const leftGridColumnEnd = this.getLeftGridColumnEnd(lineIndex, cellIndex);
				const columnOffset = this.countColumnOffset(lineIndex, leftGridColumnEnd);

				cell.style['column-start'] = leftGridColumnEnd + columnOffset; // если cell.rowspan > 1, надо вычислять
				cell.style['column-span'] = cell.props.rowspan;
				cell.style['row-start'] = lineIndex + 1 + this.rowStart;
				cell.style['row-span'] = cell.props.colspan;
			});
		});
	}

	private calculateSegmentStyle() {
		this.segment.rowStart = this.rowStart;
		this.segment.rowEnd = this.getMaxColumnsGridRow();
		this.segment.gridTemplateColumns = this.getGridTemplateColumns();
		this.segment.gridTemplateRows = this.getGridTemplateRows();
	}

	private getLeftGridColumnEnd(lineIndex: number, cellIndex: number): number {
		if (cellIndex === 0) return 1;

		const leftCell = this.segment.lines[lineIndex].cells[cellIndex - 1];
		return leftCell.style['column-start'] + leftCell.style['column-span'];
	}

	private countColumnOffset(lineIndex: number, leftGridColumnEnd: number, shift = 0): number {
		const leftNeighborsSpans = this.segment.lines.reduce(
			(spans, line, currLineIndex) => {
				const aboveCell = line.cells.find(
					cell =>
						cell.style['column-start'] <= leftGridColumnEnd &&
						leftGridColumnEnd < cell.style['column-start'] + cell.style['column-span'],
				);
				// Нас интересуют только колонки сверху.
				if (lineIndex <= currLineIndex) return spans;
				// Если сумма достигла индекса текущей строки, то нам нельзя учитывать colspan
				// ячейки в текущей колонки, иначе мы посчитаем лишний rowspan.
				if (currLineIndex < spans.rowspan) return spans;
				// Возможна ситуация, когда в колонке сверзу меньше детей, чем в текущей.
				// В этой ситуации будем считать так, как будто там есть ячейка с colspan = 1.
				if (!aboveCell) {
					spans.rowspan += 1;
					return spans;
				}

				spans.colspan = aboveCell.style['column-span'];
				spans.rowspan += aboveCell.style['row-span'];
				return spans;
			},
			{
				colspan: 1,
				rowspan: 0,
			},
		);

		const needsToBeShifted = leftNeighborsSpans.rowspan > lineIndex;
		if (needsToBeShifted)
			return this.countColumnOffset(
				lineIndex,
				leftGridColumnEnd + leftNeighborsSpans.colspan,
				shift + leftNeighborsSpans.colspan,
			);
		return shift;
	}

	private getMaxColumnsGridRow() {
		const columnsChildrenMaxGridRows = [];

		for (const cell of this.segment.lines[this.segment.lines.length - 1].cells) {
			columnsChildrenMaxGridRows.push(cell.style['row-start'] + cell.style['row-span'] - 1);
		}

		return Math.max(...columnsChildrenMaxGridRows);
	}

	private getGridTemplateColumns() {
		const [longestRow] = [...this.segment.lines].sort((a, b) => {
			const [lastCellA] = [...a.cells].reverse();
			const [lastCellB] = [...b.cells].reverse();
			const lastCellALength = lastCellA.style['column-start'] - lastCellA.style['column-span'];
			const lastCellBLength = lastCellB.style['column-start'] - lastCellB.style['column-span'];

			return lastCellBLength - lastCellALength;
		});

		const [lastCell] = [...longestRow.cells].reverse();
		const lastCellLength = lastCell.style['column-start'] + lastCell.style['column-span'] - 1;

		return Array.from({ length: lastCellLength }).fill('1fr').join(' ');
	}

	private getGridTemplateRows() {
		return Array.from({ length: this.getMaxColumnsGridRow() - this.rowStart })
			.fill(this.segment.layoutProps.rowAutoSize ? 'auto' : '1fr')
			.join(' ');
	}
}

export const processors = {
	[COMPONENT_NAMES.COLUMN]: ColumnSegmentProcessor,
	[COMPONENT_NAMES.ROW]: RowSegmentProcessor,
} as const;

