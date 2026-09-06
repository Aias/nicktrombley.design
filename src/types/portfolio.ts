import type { ReactNode } from 'react';

export type GridPlacement = {
	xCells: number;
	yCells: number;
	widthCells: number;
	heightCells: number;
};

export type PortfolioItem = GridPlacement & {
	id: string;
	content: ReactNode;
	screens: 'large' | 'small' | 'all';
	small: Pick<GridPlacement, 'xCells' | 'yCells'>;
};

export function snapCells(value: number) {
	return Math.round(value * 4) / 4;
}

export function gridSize(value: number) {
	return `${Math.max(0.25, snapCells(value)) * 2}rem`;
}
