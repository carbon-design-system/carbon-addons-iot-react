import { storiesOf, moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";

import { ButtonModule } from "./button.module";


storiesOf("Components/Button", module)
	.addDecorator(
		moduleMetadata({
			imports: [
				ButtonModule
			]
		})
	)
	.addDecorator(withKnobs)
	.add("Basic", () => ({
		template: `
			<button [aiButton]="aiButton" [size]="size">Button</button>
			&nbsp;
			<button [aiButton]="aiButton" [size]="size" disabled="true">Button</button>
			&nbsp;
			<button [aiButton]="aiButton" [size]="size">
				With icon<svg class="bx--btn__icon" ibmIconAdd size="20"></svg>
			</button>
		`,
		props: {
			aiButton: select("Button kind", ["primary", "secondary", "tertiary", "ghost", "danger", "danger--primary"], "primary"),
			size: select("Size of the buttons", ["normal", "sm", "field"], "normal")
		}
	}))
	.add("Icon only", () => ({
		template: `
			<button
				[aiButton]="aiButton"
				[size]="size"
				[iconOnly]="true"
				[hasAssistiveText]="true"
				[assistiveTextPlacement]="assistiveTextPlacement"
				[assistiveTextAlignment]="assistiveTextAlignment">
				<svg class="bx--btn__icon" ibmIconCopy size="20"></svg>
				<span class="bx--assistive-text">Icon description</span>
			</button>
		`,
		props: {
			aiButton: select("Button kind", ["primary", "secondary", "tertiary", "ghost", "danger", "danger--primary"], "tertiary"),
			size: select("Size of the buttons", ["normal", "sm", "field"], "normal"),
			assistiveTextPlacement: select("Placement of assistive text", ["top", "bottom", "left", "right"], "top"),
			assistiveTextAlignment: select("Alignment of assistive text", ["center", "start", "end"], "center")
		}
	}))
	.add("Skeleton", () => ({
		template: `
			<button aiButton skeleton="true"></button>
			&nbsp;
			<button aiButton skeleton="true" size="sm"></button>
		`
	}));
