import { COMPONENT_NAMES } from '@/components/layout/constants'

export type SegmentName = typeof COMPONENT_NAMES.COLUMN | typeof COMPONENT_NAMES.ROW
export type LayoutProps = {
    mt: string
    columnGap: string
    rowGap: string
    rowAutoSize: boolean
}
