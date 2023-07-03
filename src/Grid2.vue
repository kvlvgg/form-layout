<template>
    <FormLayout>
        <FormLayoutColumn :colspan="2">
            <FormLayoutCell>
                <PlaceHolder text="1" />
            </FormLayoutCell>

            <FormLayoutCell :colspan="2" :rowspan="3">
                <PlaceHolder :colspan="2" text="2" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="3" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="4" />
            </FormLayoutCell>
        </FormLayoutColumn>

        <FormLayoutColumn>
            <FormLayoutCell>
                <PlaceHolder text="5" />
            </FormLayoutCell>

            <FormLayoutCell />

            <FormLayoutCell :rowspan="2">
                <PlaceHolder text="6" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="7" />
            </FormLayoutCell>

            <FormLayoutCell :rowspan="2">
                <PlaceHolder text="8" />
            </FormLayoutCell>
        </FormLayoutColumn>

        <FormLayoutColumn>
            <FormLayoutCell>
                <PlaceHolder text="9" />
            </FormLayoutCell>

            <FormLayoutCell />

            <FormLayoutCell>
                <PlaceHolder text="10" />
            </FormLayoutCell>
        </FormLayoutColumn>

        <FormLayoutRow>
            <FormLayoutCell>
                <PlaceHolder text="1" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="2" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="3" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="4" />
            </FormLayoutCell>
        </FormLayoutRow>

        <FormLayoutRow>
            <FormLayoutCell>
                <PlaceHolder text="5" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="6" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="7" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="8" />
            </FormLayoutCell>
        </FormLayoutRow>

        <FormLayoutRow>
            <FormLayoutCell>
                <PlaceHolder text="9" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="10" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="11" />
            </FormLayoutCell>

            <FormLayoutCell>
                <PlaceHolder text="12" />
            </FormLayoutCell>
        </FormLayoutRow>
    </FormLayout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Grid2 extends Vue {}
</script>
