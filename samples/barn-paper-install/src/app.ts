/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	Actor,
	AnimationKeyframe,
	AnimationWrapMode,
	AssetContainer,
	ButtonBehavior,
	Color4,
	Context,
	DegreesToRadians,
	PrimitiveShape,
	Quaternion,
	TextAnchorLocation,
	Vector3,
	ActorTransform
} from '@microsoft/mixed-reality-extension-sdk';
import { Transform } from 'stream';

/**
 * The main class of this app. All the logic goes here.
 */
export default class BarnPaperInstall {
	private assets: AssetContainer;
	private text: Actor = null;
	private textAnchor: Actor = null;
	private light: Actor = null;

	constructor(private context: Context, private baseUrl: string) {
		console.log('constructor for App');

		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());

		console.log('session Id connected:');
		console.log(this.context.sessionId);
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {
		// Create a new actor with no mesh, but some text.
		this.textAnchor = Actor.Create(this.context, {
			actor: {
				name: 'TextAnchor',
				transform: {
					app: { position: { x: 0, y: 1.2, z: 0 } }
				},
			}
		});

		this.text = Actor.Create(this.context, {
			actor: {
				parentId: this.textAnchor.id,
				name: 'Text',
				transform: {
					local: { position: { x: 0, y: 0.0, z: -1.5 } }
				},
				text: {
					contents: "",
					anchor: TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				},
			}
		});
		this.light = Actor.Create(this.context, {
			actor: {
				parentId: this.text.id,
				name: 'Light',
				transform: {
					local: {
						position: { x: 0, y: 1.0, z: -0.5 },
						rotation: Quaternion.RotationAxis(Vector3.Left(), -45.0 * DegreesToRadians),
					}
				},
				light: {
					color: { r: 1, g: 0.6, b: 0.3 },
					type: 'spot',
					intensity: 20,
					range: 6,
					spotAngle: 45 * DegreesToRadians
				},

			}
		});

		// Here we create an animation on our text actor. Animations have three mandatory arguments:
		// a name, an array of keyframes, and an array of events.
		this.textAnchor.createAnimation(
			// The name is a unique identifier for this animation. We'll pass it to "startAnimation" later.
			"Spin", {
				// Keyframes define the timeline for the animation: where the actor should be, and when.
				// We're calling the generateSpinKeyframes function to produce a simple 20-second revolution.
				keyframes: this.generateSpinKeyframes(20, Vector3.Up()),
				// Events are points of interest during the animation. The animating actor will emit a given
				// named event at the given timestamp with a given string value as an argument.
				events: [],

				// Optionally, we also repeat the animation infinitely.
				wrapMode: AnimationWrapMode.Loop
			}
		);

		// Load box model from glTF
		// const gltf = await this.assets.loadGltf(`${this.baseUrl}/altspace-cube.glb`, 'box');
		// Create a glTF actor
		/* const cube = Actor.CreateFromPrefab(this.context, {
			// Use the preloaded glTF for each box
			firstPrefabFrom: gltf,
			// Also apply the following generic actor properties.
			actor: {
				name: 'Altspace Cube',
				appearance: {
					materialId: cubeMat.id
				},
				transform: {
					app: {
						position: { x: (0) - 1.0, y: 0.5, z: (0) - 1.0 },
					},
					local: { scale: { x: 0.4, y: 0.4, z: 0.4 } }
				}
			}
		}); */

		/* for (var i = 0; i < 1; i++) {
			const cube = Actor.CreatePrimitive(this.assets, {
				definition: {
					shape: PrimitiveShape.Box,
					dimensions: { x: 0.85, y: 0.30, z: 0.85 }
				},
				addCollider: true
			});
			cube.transform = new ActorTransform();
			cube.transform.app.position = new Vector3(0.6, 0, 1.5); // x (width), y (height), z (depth)
			cube.transform.local.scale = new Vector3(0.4, 0.4, 0.4);
			const cubeMat = this.assets.createMaterial('material', {
				color: { r: 1, g: 1, b: 1 }
			});
			cube.appearance.material = cubeMat;
			// Create some animations on the cube.
			cube.createAnimation(
				'GrowIn', {
				keyframes: this.growAnimationData,
				events: []
			});
			cube.createAnimation(
				'DoAFlip', {
				keyframes: this.generateSpinKeyframes(0.25, Vector3.Right()),
				events: []
			});
			// Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
			// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
			const buttonBehavior = cube.setBehavior(ButtonBehavior);
			// Trigger the grow/shrink animations on click.
			buttonBehavior.onClick(_ => {
				console.log('click');
				// cube.enableAnimation('GrowIn');
				cube.enableAnimation('DoAFlip');
				// this.light.light.color = { r: Math.random(), g: Math.random(), b: Math.random() };
				const cubeMat = this.assets.createMaterial('material', {
					color: { r: Math.random(), g: Math.random(), b: Math.random() }
				});
				cube.appearance.material = cubeMat;
			});
		}*/

		//////////////////
		// CUBE 1
		//////////////////

		const cube = Actor.CreatePrimitive(this.assets, {
			definition: {
				shape: PrimitiveShape.Box,
				dimensions: { x: 1, y: 1, z: 1 }
			},
			addCollider: true
		});
		cube.transform = new ActorTransform();
		cube.transform.app.position = new Vector3(1, -0.25, 1); // x (width), y (height), z (depth)
		cube.transform.local.scale = new Vector3(0.25, 1.25, 0.5);
		// cube.transform.local.rotation = Quaternion.RotationAxis(Vector3.Right(), Math.PI / 6); // rotate cube on X, 30 degrees
		const cubeMat = this.assets.createMaterial('material', {
			color: { r: (82 / 255), g: (201 / 255), b: (245 / 255) }
		});
		cube.appearance.material = cubeMat;

		// Create some animations on the cube.
		cube.createAnimation(
			'GrowIn', {
			keyframes: this.growAnimationData,
			events: []
		});

		cube.createAnimation(
			'DoAFlip', {
			keyframes: this.generateSpinKeyframes(0.25, Vector3.Right()),
			events: []
		});

		// Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
		// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
		const buttonBehavior = cube.setBehavior(ButtonBehavior);

		// Trigger the grow/shrink animations on click.
		buttonBehavior.onClick(_ => {
			console.log('click cube');
			// cube.enableAnimation('GrowIn');
			cube.enableAnimation('DoAFlip');
			// this.light.light.color = { r: Math.random(), g: Math.random(), b: Math.random() };
			const cubeMat = this.assets.createMaterial('material', {
				// color: { r: Math.random(), g: Math.random(), b: Math.random() }
				color: this.pickColor()
			});
			cube.appearance.material = cubeMat;
		});

		//////////////////

		//////////////////
		// CUBE 2
		//////////////////

		const cube2 = Actor.CreatePrimitive(this.assets, {
			definition: {
				shape: PrimitiveShape.Box,
				dimensions: { x: 1, y: 1, z: 1 }
			},
			addCollider: true
		});
		cube2.transform = new ActorTransform();
		cube2.transform.app.position = new Vector3(-0.3, 0.15, 0.5); // x (width), y (height), z (depth)
		cube2.transform.local.scale = new Vector3(0.5, 0.06, 0.75);
		// cube2.transform.local.rotation = Quaternion.RotationAxis(Vector3.Right(), Math.PI / 6); // rotate cube on X, 30 degrees
		const cube2Mat = this.assets.createMaterial('material', {
			color: { r: (255 / 255), g: (255 / 255), b: (255 / 255) }
		});
		cube2.appearance.material = cube2Mat;

		// Create some animations on the cube.
		cube2.createAnimation(
			'GrowIn', {
			keyframes: this.growAnimationData,
			events: []
		});

		cube2.createAnimation(
			'DoAFlip', {
			keyframes: this.generateSpinKeyframes(0.25, Vector3.Right()),
			events: []
		});

		// Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
		// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
		const buttonBehavior2 = cube2.setBehavior(ButtonBehavior);

		// Trigger the grow/shrink animations on click.
		buttonBehavior2.onClick(_ => {
			console.log('click cube2');
			// cube2.enableAnimation('GrowIn');
			cube2.enableAnimation('DoAFlip');
			// this.light.light.color = { r: Math.random(), g: Math.random(), b: Math.random() };
			const cube2Mat = this.assets.createMaterial('material', {
				// color: { r: Math.random(), g: Math.random(), b: Math.random() }
				color: this.pickColor()
			});
			cube2.appearance.material = cube2Mat;
		});

		//////////////////

		//////////////////
		// PLANES
		//////////////////

		for (var i = 0; i < 7; i++) {

			const plane = Actor.CreatePrimitive(this.assets, {
				definition: {
					shape: PrimitiveShape.Plane,
					dimensions: { x: 1, y: 1, z: 1 }
				},
				addCollider: true
			});
			plane.transform = new ActorTransform();
			plane.transform.app.position = new Vector3(-0.2, -0.5 + (i * 0.10), 1.1); // x (width), y (height), z (depth)
			plane.transform.local.scale = new Vector3(0.30, 0.50, 0.30);
			plane.transform.local.rotation = Quaternion.RotationAxis(Vector3.Right(), Math.PI / 6);
			const planeMat = this.assets.createMaterial('material', {
				color: { r: (99 / 255), g: (1 / 255), b: (246 / 255) }
			});
			plane.appearance.material = planeMat;

			// Create some animations on the capsule.
			plane.createAnimation(
				'GrowIn', {
				keyframes: this.growAnimationData,
				events: []
			});

			plane.createAnimation(
				'DoAFlip', {
				keyframes: this.generateSpinKeyframesPlanes(0.25, Vector3.Right()),
				events: []
			});

			// Set up cursor interaction. We add the input behavior ButtonBehavior to the plane.
			// Button behaviors have two pairs of events: hover start/stop, and click start/stop.
			const buttonBehavior2 = plane.setBehavior(ButtonBehavior);

			// Trigger the grow/shrink animations on click.
			buttonBehavior2.onClick(_ => {
				console.log('click capsule');
				// plane.enableAnimation('GrowIn');
				plane.enableAnimation('DoAFlip');
				// this.light.light.color = { r: Math.random(), g: Math.random(), b: Math.random() };
				const capsuleMat = this.assets.createMaterial('material', {
					// color: { r: Math.random(), g: Math.random(), b: Math.random() }
					color: this.pickColor()
				});
				plane.appearance.material = capsuleMat;
			});
		}

		//////////////////

		// Now that the text and its animation are all being set up, we can start playing
		// the animation.
		this.textAnchor.enableAnimation('Spin');
	}

	/**
	 * Generate keyframe data for a simple spin animation.
	 * @param duration The length of time in seconds it takes to complete a full revolution.
	 * @param axis The axis of rotation in local space.
	 */
	private generateSpinKeyframesPlanes(duration: number, axis: Vector3): AnimationKeyframe[] {
		return [{
			time: 0 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 0 + (Math.PI / 6)) } } }
		}, {
			time: 0.25 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (Math.PI / 2) + (Math.PI / 6)) } } }
		}, {
			time: 0.5 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, Math.PI + (Math.PI / 6)) } } }
		}, {
			time: 0.75 * duration,
				value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (3 * Math.PI / 2) + (Math.PI / 6)) } } }
		}, {
			time: 1 * duration,
				value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (2 * Math.PI) + (Math.PI / 6)) } } }
		}];
	}

	private generateSpinKeyframes(duration: number, axis: Vector3): AnimationKeyframe[] {
		return [{
			time: 0 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 0) } } }
		}, {
			time: 0.25 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (Math.PI / 2)) } } }
		}, {
			time: 0.5 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, Math.PI) } } }
		}, {
			time: 0.75 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (3 * Math.PI / 2)) } } }
		}, {
			time: 1 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (2 * Math.PI)) } } }
		}];
	}

	private growAnimationData: AnimationKeyframe[] = [{
		time: 0,
		value: { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } }
	}, {
		time: 0.3,
		value: { transform: { local: { scale: { x: 0.5, y: 0.5, z: 0.5 } } } }
	}];

	private pickColor(): Object {
		const colors = [
			{r: (255 / 255), g: (255 / 255), b: (255 / 255)}, // white
			{r: (99 / 255), g: (1 / 255), b: (246 / 255)}, // purple
			{r: (255 / 255), g: (204 / 255), b: (255 / 255)}, // light pink
			{r: (224 / 255), g: (159 / 255), b: (243 / 255)}, // dark pink
			{r: (82 / 255), g: (201 / 255), b: (245 / 255)} // cyan
			// {r: (0 / 255), g: (0 / 255), b: (0 / 255)} // black
		];
		return colors[Math.floor(Math.random() * 5)];
	}
}