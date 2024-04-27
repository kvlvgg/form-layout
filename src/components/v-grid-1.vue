<template>
	<v-form-layout rowAutoSize>
		<v-form-layout-column :span="2">
			<v-form-layout-cell>
				<v-placeholder text="1" />
			</v-form-layout-cell>

			<v-form-layout-cell :colspan="2" :rowspan="3">
				<v-placeholder :colspan="2" text="2" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="3" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="4" />
			</v-form-layout-cell>
		</v-form-layout-column>

		<v-form-layout-column>
			<v-form-layout-cell>
				<v-placeholder text="5" />
			</v-form-layout-cell>

			<v-form-layout-cell />

			<v-form-layout-cell :rowspan="2">
				<v-placeholder text="6" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="7" />
			</v-form-layout-cell>

			<v-form-layout-cell :rowspan="2">
				<v-placeholder text="8" />
			</v-form-layout-cell>
		</v-form-layout-column>

		<v-form-layout-column>
			<v-form-layout-cell>
				<v-placeholder text="9" />
			</v-form-layout-cell>

			<v-form-layout-cell />

			<v-form-layout-cell>
				<v-placeholder text="10" />
			</v-form-layout-cell>
		</v-form-layout-column>

		<v-form-layout-row>
			<v-form-layout-cell>
				<v-placeholder text="1" />
			</v-form-layout-cell>

			<v-form-layout-cell :colspan="2">
				<v-placeholder :colspan="2" text="2" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="3" />
			</v-form-layout-cell>
		</v-form-layout-row>

		<v-form-layout-row>
			<v-form-layout-cell :colspan="2">
				<v-placeholder :colspan="2" text="5" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="6" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="7" />
			</v-form-layout-cell>
		</v-form-layout-row>

		<v-form-layout-row>
			<v-form-layout-cell :rowspan="2">
				<v-placeholder text="9" />
			</v-form-layout-cell>

			<!-- <v-form-layout-cell>
                <v-placeholder text="10" />
            </v-form-layout-cell> -->

			<v-form-layout-cell>
				<v-placeholder text="11" />
			</v-form-layout-cell>
		</v-form-layout-row>

		<v-form-layout-column :span="2">
			<v-form-layout-cell>
				<v-placeholder text="1" />
			</v-form-layout-cell>

			<v-form-layout-cell :colspan="2" :rowspan="3">
				<v-placeholder :colspan="2" text="2" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="3" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="4" />
			</v-form-layout-cell>
		</v-form-layout-column>

		<v-form-layout-column>
			<v-form-layout-cell>
				<v-placeholder text="5" />
			</v-form-layout-cell>

			<v-form-layout-cell />

			<v-form-layout-cell :rowspan="2">
				<v-placeholder text="6" />
			</v-form-layout-cell>

			<v-form-layout-cell>
				<v-placeholder text="7" />
			</v-form-layout-cell>

			<v-form-layout-cell :rowspan="2">
				<v-placeholder text="8" />
			</v-form-layout-cell>
		</v-form-layout-column>

		<v-form-layout-column>
			<v-form-layout-cell>
				<v-placeholder text="9" />
			</v-form-layout-cell>

			<v-form-layout-cell />

			<v-form-layout-cell>
				<v-placeholder text="10" />
			</v-form-layout-cell>
		</v-form-layout-column>
	</v-form-layout>
</template>
