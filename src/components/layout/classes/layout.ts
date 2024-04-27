import type { VNode } from 'vue';
import type { LayoutProps } from '@/components/layout/types';

import { Cell } from '@/components/layout/classes/cell';
import { Segment, SegmentBuilder } from '@/components/layout/classes/segment';
import { COMPONENT_NAMES } from '@/components/layout/constants';

export class Layout {
	segments: Segment[] = [];

	private constructor(lines: VNode[], props: LayoutProps) {
		this.segments = this.createSegments(lines, props);
	}

	public static create(lines: VNode[], props: LayoutProps) {
		return new Layout(lines, props);
	}

	private createSegments(lines: VNode[], props: LayoutProps): Segment[] {
		return SegmentBuilder.createSegments(lines, props);
	}

	public getCells() {
		return this.segments.reduce((cells, segment) => cells.concat(segment.getCells()), [] as Cell[]);
	}

	public getGridTemplate() {
		return {
			'grid-template-columns': this.getTheLongestTemplate(),
			'grid-template-rows': this.segments.reduce((acc, curr) => `${acc} ${curr.gridTemplateRows}`, ''),
		};
	}

	private getTheLongestTemplate() {
		const firstColumnTemplate = this.segments.find(x => x.type === COMPONENT_NAMES.COLUMN)?.gridTemplateColumns ?? '';

		const templates = this.segments.map(x => x.gridTemplateColumns);
		const [longestTemplate = []] = templates.map(x => x.split(' ')).sort((a, b) => b.length - a.length);

		return longestTemplate.join(' ').length > firstColumnTemplate.length
			? longestTemplate.join(' ')
			: firstColumnTemplate;
	}
}

