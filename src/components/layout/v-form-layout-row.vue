<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FormLayoutCell from '@/components/layout/v-form-layout-cell.vue';
import { CreateElement } from 'vue';

@Component
export default class FormLayoutRow extends Vue {
    @Prop({ type: Boolean, default: true }) isVisible!: boolean;
    @Prop({ type: Number, default: 1 }) rowspan!: number;

    role = 'row';

    $children!: FormLayoutCell[];

    @Watch('isVisible')
    onIsVisible() {
        this.$emit('is-visible-changed');
    }

    render(h: CreateElement) {
        return h('fragment', this.$slots.default);
    }
}
</script>
