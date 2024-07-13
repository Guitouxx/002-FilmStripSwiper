<script lang="ts">
	import 'css/main.css';
	import { each, random, times } from 'lodash-es';
	import { damp } from 'maath/easing';
	import normalizeWheel from 'normalize-wheel';
	import { onMount } from 'svelte';
	import { Binding, Folder, Pane, ThemeUtils } from 'svelte-tweakpane-ui';
	import { Clock, Color, Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
	import { Card } from './Card';
	import type { Params, StageSize } from './types';

	//----- Vars

	let clock: Clock;
	let renderer: WebGLRenderer;
	let scene: Scene;
	let camera: PerspectiveCamera;
	let stageScale: StageSize;

	let container: Group;

	let wrapperEl: HTMLElement;

	let params: Params = {
		easing: {
			speed: 0.1,
			friction: 0.4
		},
		//cards
		cards: {
			totalCards: 20,
			baseScale: 1.2,
			padding: 0.2
		},
		//shader
		shader: {
			angle: 90,
			waveOffset: 0,
			amplitude: 1.2,
			inverse: false
		}
	};

	const scroll = {
		position: 0,
		target: 0
	};

	const touch = {
		active: false,
		current: 0,
		start: 0
	};

	//----- Methods

	const initThree = () => {
		renderer = new WebGLRenderer({
			alpha: false,
			antialias: true
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		wrapperEl.appendChild(renderer.domElement);
	};

	const initScene = () => {
		const color = new Color('#222');

		//Scene Config
		scene = new Scene();
		scene.background = color;

		camera = new PerspectiveCamera(50, renderer.domElement.offsetWidth / renderer.domElement.offsetHeight, 0.1, 50);
		camera.position.z = 5;

		// Main Container
		container = new Group();
		scene.add(container);

		stageScale = calculateUnitSize(camera.position.z, camera);

		addCards();

		//start a threejs clock
		clock = new Clock(true);
	};

	const initEvents = () => {
		window.addEventListener('wheel', onWheel);
		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('touchend', onTouchEnd);
		window.addEventListener('touchmove', onTouchMove);
	};

	const render = () => {
		requestAnimationFrame(render);
		renderer.render(scene, camera);

		const delta = clock.getDelta();

		damp(scroll, 'position', scroll.target, 0.1, delta);

		container.traverse((child) => {
			if (child instanceof Card) {
				(child as Card).render(delta, scroll.position, params);
			}
		});
	};

	const resize = () => {
		renderer.setSize(window.innerWidth, window.innerHeight);

		camera.aspect = renderer.domElement.offsetWidth / renderer.domElement.offsetHeight;
		camera.updateProjectionMatrix();

		stageScale = calculateUnitSize(camera.position.z, camera);

		//replace all cards
		let widthTotal = 0;
		each(container?.children, (child, index) => {
			const card = child as Card;
			card.resize(params, stageScale);

			if (!index) {
				card.userData.x = 0;
			} else {
				const beforeLastCard = container.children[index - 1] as Card;
				const beforeHalfWidth = beforeLastCard.userData.width / 2;
				card.userData.x = beforeLastCard.userData.x + beforeHalfWidth + beforeLastCard.userData.padding + card.userData.width / 2;
			}

			card.position.x = card.userData.x;
			widthTotal += card.userData.width + card.userData.padding;
		});

		each(container?.children, (child) => {
			const card = child as Card;
			card.userData.widthTotal = widthTotal;
		});
	};

	//----- Utils Methods

	const addCards = () => {
		times(params.cards.totalCards, (index) => {
			const card = new Card({
				color: random(0, 1, true) * 0xffffff,
				size: random(0.5, 1.5, true),
				totalCards: 10,
				index: index,
				stageScale: stageScale
			});
			container.add(card);
		});
	};

	const reset = () => {
		container.clear();
		addCards();
		resize();
	};

	const calculateUnitSize = (distance: number, camera: PerspectiveCamera): StageSize => {
		const vFov = camera.fov * (Math.PI / 180);
		const height = 2 * Math.tan(vFov / 2) * distance;
		const width = height * camera.aspect;

		return { width, height };
	};

	//----- Event Handlers

	const onWheel = (e: WheelEvent) => {
		const normalized = normalizeWheel(e);
		const speed = normalized.pixelY * 0.1;

		scroll.target += speed * params.easing.speed;
	};

	const onTouchStart = (e: TouchEvent) => {
		touch.active = true;
		touch.start = e.touches[0].clientX;
	};

	const onTouchEnd = (e: TouchEvent) => {
		touch.active = false;
	};

	const onTouchMove = (e: TouchEvent) => {
		if (!touch.active) return;

		const x = (touch.start - e.touches[0].clientX) * 0.2;
		scroll.target += x * params.easing.speed;

		touch.start = e.touches[0].clientX;
	};

	//----- Lifecycle

	onMount(() => {
		initThree();
		initScene();
		initEvents();
		// addGUI();
		resize();
		render();
	});
</script>

<svelte:window on:resize={resize} />

<div bind:this={wrapperEl} id="threejs-wrapper" class="fixed left-0 top-0 h-full w-full"></div>
<div class="fixed right-2 top-2">
	<Pane theme={ThemeUtils.presets.iceberg}>
		<Folder title="Layout">
			<Binding bind:object={params.cards} key={'totalCards'} label="total cards" options={{ min: 5, max: 30, step: 1 }} on:change={reset} />
			<Binding bind:object={params.cards} key={'baseScale'} label="base scale" options={{ min: 0, max: 5, step: 0.1 }} on:change={resize} />
			<Binding bind:object={params.cards} key={'padding'} label="padding" options={{ min: 0, max: 0.5, step: 0.01 }} on:change={resize} />
		</Folder>
		<Folder title="Easing">
			<Binding bind:object={params.easing} key={'speed'} label="speed" options={{ min: 0.02, max: 0.2, step: 0.01 }} />
			<Binding bind:object={params.easing} key={'friction'} label="friction" options={{ min: 0, max: 0.9, step: 0.1 }} />
		</Folder>
		<Folder title="Shader">
			<Binding bind:object={params.shader} key={'angle'} label="angle" options={{ min: -90, max: 90, step: 1 }} />
			<Binding bind:object={params.shader} key={'waveOffset'} label="waveOffset" options={{ min: -2, max: 2, step: 0.01 }} />
			<Binding bind:object={params.shader} key={'amplitude'} label="amplitude" options={{ min: 0, max: 2, step: 0.1 }} />
			<Binding bind:object={params.shader} key={'inverse'} label="inverse" />
		</Folder>
	</Pane>
</div>
