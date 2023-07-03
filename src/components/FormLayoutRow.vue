<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FormLayoutCell from '@/components/FormLayoutCell.vue';
import { CreateElement } from 'vue';

@Component
export default class FormLayoutRow extends Vue {
    @Prop({ type: Boolean, default: true }) isVisible!: boolean;
    @Prop({ type: Number, default: 1 }) rowspan!: number;

    role = 'row';

    $children!: FormLayoutCell[];

    mounted() {
        this.checkProperUsage();
    }

    private checkProperUsage() {
        let isUsageError = false;

        this.$children.forEach(x => {
            if (x.$vnode.componentOptions?.tag !== 'v-form-layout-cell') isUsageError = true;
        });

        // if (isUsageError)
        //     log.dev.error(__filename, 'Дочерними элементами v-form-layout-column могут быть только v-form-layout-cell');
    }

    @Watch('isVisible')
    onIsVisible() {
        this.$emit('is-visible-changed');
    }

    render(h: CreateElement) {
        return h('fragment', this.$slots.default);
    }
}
</script>
