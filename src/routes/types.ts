export interface Params {
	easing: {
		speed: number;
		friction: number;
	};
	cards: {
		totalCards: number;
		baseScale: number;
		padding: number;
	};
	shader: {
		angle: number;
		waveOffset: number;
		amplitude: number;
		inverse: boolean;
	};
}

export interface CardOptions {
	color: number;
	size: number;
	totalCards: number;
	index: number;
	stageScale: { width: number; height: number };
}

export type StageSize = {
	width: number;
	height: number;
};
