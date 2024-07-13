import { damp } from 'maath/easing';
import { Color, DoubleSide, GLSL3, Mesh, PlaneGeometry, ShaderMaterial, Texture } from 'three';
import fragmentShader from './fragment.glsl';
import type { CardOptions, Params, StageSize } from './types';
import vertexShader from './vertex.glsl';

const geometry = new PlaneGeometry(1, 1, 32, 32);
const material = new ShaderMaterial({
	uniforms: {
		uColor: { value: new Color() },
		uStageWidth: { value: 0 },
		uAmplitude: { value: 0.65 },
		uWaveOffset: { value: 0 },
		uAngle: { value: 90 },
		uInvert: { value: 1 }
	},
	glslVersion: GLSL3,
	side: DoubleSide,
	fragmentShader,
	vertexShader
});

export class Card extends Mesh {
	texture?: Texture;
	size: number;
	stageScale: StageSize;

	totalCards = 0;
	index = 0;

	extraOffset = 0;

	constructor(options: CardOptions) {
		super(geometry, material.clone());

		this.totalCards = options.totalCards;
		this.index = options.index;
		this.size = options.size;
		this.stageScale = options.stageScale;

		(material.uniforms.uColor.value as Color).setHex(options.color);
	}

	resize(playParams: Params, stageScale: StageSize) {
		this.scale.set(playParams.cards.baseScale * this.size, playParams.cards.baseScale, 1);

		this.stageScale = stageScale;
		this.extraOffset = 0;
		this.userData.padding = this.stageScale.width * playParams.cards.padding;
		this.userData.width = this.scale.x;
	}

	render(delta: number, position: number, playParams: Params) {
		this.position.x = this.userData.x - position * (1 - playParams.easing.friction) - this.extraOffset;

		const offset = this.scale.x * 0.5;
		const viewportWidth = this.stageScale.width;
		const min = this.position.x + offset < -viewportWidth;
		const max = this.position.x - offset > viewportWidth;

		const mat = this.material as ShaderMaterial;
		mat.uniforms.uStageWidth.value = this.stageScale.width;
		damp(mat.uniforms.uAmplitude, 'value', playParams.shader.amplitude, 0.1, delta);
		damp(mat.uniforms.uAngle, 'value', playParams.shader.angle, 0.1, delta);
		damp(mat.uniforms.uWaveOffset, 'value', playParams.shader.waveOffset, 0.1, delta);
		mat.uniforms.uInvert.value = playParams.shader.inverse ? -1 : 1;

		if (min) {
			this.extraOffset -= this.userData.widthTotal;
		}
		if (max) {
			this.extraOffset += this.userData.widthTotal;
		}
	}

	dispose() {
		this.geometry?.dispose();
		this.clear();
	}

	// ---- End Custom callbacks
}
