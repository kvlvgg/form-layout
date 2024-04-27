import type { VNode } from 'vue';
import type { LayoutProps, SegmentName } from '@/components/layout/types';

import { processors } from '@/components/layout/classes/processor';
import { getName } from '@/components/layout/helpers';
import { Line } from '@/components/layout/classes/line';
import { Cell } from '@/components/layout/classes/cell';

export class Segment {
	type: SegmentName;
	lines: Line[];
	rowStart = 0;
	rowEnd = 0;
	gridTemplateColumns = '';
	gridTemplateRows = '';
	layoutProps: LayoutProps;

	private constructor(type: SegmentName, lines: VNode[], layoutProps: LayoutProps) {
		this.type = type;
		this.lines = lines.map(line => Line.create(line));
		this.layoutProps = layoutProps;
	}

	public static create(type: SegmentName, lines: VNode[], layoutProps: LayoutProps) {
		return new Segment(type, lines, layoutProps);
	}

	getCells() {
		return this.lines.reduce((cells, line) => cells.concat(line.getCells()), [] as Cell[]);
	}
}

export class SegmentBuilder {
	segments: Segment[] = [];
	layoutProps: LayoutProps;
	state: {
		rowStart: number;
		lines: VNode[];
		type: SegmentName;
	};

	public static createSegments(lines: VNode[], layoutProps: LayoutProps) {
		const segmentBuilder = new SegmentBuilder(lines, layoutProps);
		lines.forEach(line => segmentBuilder.addLine(line));
		segmentBuilder.flushLines();

		return segmentBuilder.segments;
	}

	private constructor(lines: VNode[], layoutProps: LayoutProps) {
		const [firstLine] = lines;
		this.layoutProps = layoutProps;
		this.state = {
			rowStart: 0,
			lines: [],
			type: getName(firstLine),
		};
	}

	private addLine(line: VNode) {
		const lineType = getName<SegmentName>(line);

		if (this.state.type !== lineType) {
			this.flushLines();
			this.state.lines = [line];
			this.state.type = lineType;

			return;
		}

		this.state.lines.push(line);
	}

	private flushLines() {
		const segment = Segment.create(this.state.type, this.state.lines, this.layoutProps);
		const processor = new processors[this.state.type](segment, this.state.rowStart);
		processor.calculateStyle();

		this.state.rowStart = segment.rowEnd;
		this.segments.push(segment);
	}
}

