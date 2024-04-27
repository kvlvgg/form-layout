<template>
    <v-form-layout>
        <v-form-layout-column>
            <v-form-layout-cell>
                <PlaceHolder text="1" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="2" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="3" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="4" />
            </v-form-layout-cell>
        </v-form-layout-column>

        <v-form-layout-column>
            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="6" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="7" />
            </v-form-layout-cell>
        </v-form-layout-column>

        <v-form-layout-column>
            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="6" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="7" />
            </v-form-layout-cell>
        </v-form-layout-column>

        <v-form-layout-column>
            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="6" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="7" />
            </v-form-layout-cell>
        </v-form-layout-column>

        <v-form-layout-row>
            <v-form-layout-cell>
                <PlaceHolder text="1" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="2" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="3" />
            </v-form-layout-cell>
        </v-form-layout-row>

        <v-form-layout-row>
            <v-form-layout-cell>
                <PlaceHolder text="5" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="6" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="7" />
            </v-form-layout-cell>
        </v-form-layout-row>

        <v-form-layout-row>
            <v-form-layout-cell>
                <PlaceHolder text="9" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="10" />
            </v-form-layout-cell>

            <v-form-layout-cell>
                <PlaceHolder text="11" />
            </v-form-layout-cell>
        </v-form-layout-row>
    </v-form-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Grid3 extends Vue {}
</script>
