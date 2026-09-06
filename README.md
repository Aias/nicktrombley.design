# nick trombley . design

a portfolio of sorts.

## Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm build
```

React renders the portfolio and its interactive mockups. StyleX owns component styles. The CSS reset removes browser defaults. TypeScript 7, oxlint, and oxfmt check the source. The build prerenders the page into `build/` for static hosting.

## Layout and content

[Portfolio items](src/data/portfolio.tsx) pair each component with its desktop and small-screen position. Positions and dimensions use major grid cells. One major cell is `2rem`, divided into four `0.5rem` minor cells. Layout values snap to the nearest minor cell. Dimensions measure the distance between opposing border centers. Frames include the final one-pixel stroke.

```tsx
<PortfolioWidget xCells={2} yCells={3} widthCells={15} heightCells={9}>
	<VariableAnalysis
		predictor={{ id: 'dose', label: 'Dose' }}
		outcome={{ id: 'response', label: 'Response' }}
		confounders={[
			{ id: 'age', label: 'Age' },
			{ id: 'duration', label: 'Treatment duration' }
		]}
	/>
</PortfolioWidget>
```

Widgets reveal in portfolio order with a 75 ms stagger and a two-second blur and fade. Reduced motion skips the entrance animation.

Each mockup accepts typed data props and fills its parent. Controls update local state and expose callbacks for integration. Analysis statistics are supplied separately for each variable direction. Single-line text truncates. Descriptions retain the line limits in the design. D3 computes the capacity treemap and performance trend curves from the supplied data.

## Design system

[StyleX tokens](src/styles/tokens.stylex.ts) define colors, typography, spacing, and grid divisions. Inter Variable is bundled locally. Change `fonts.ui` and the font import in `src/main.tsx` to replace it. The profile uses Cardo through `fonts.serif`.

SVG is used for chart geometry and icon assets. Mockup icons retain their original SVG geometry and multi-tone fills through theme tokens. The portfolio supports system, light, and dark themes with a green hover and focus treatment.
