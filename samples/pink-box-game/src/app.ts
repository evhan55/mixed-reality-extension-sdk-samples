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
	ColliderType,
	DegreesToRadians,
	PrimitiveShape,
	Quaternion,
	TextAnchorLocation,
	Vector3,
	ActorTransform,
	ActionEvent,
	RigidBodyConstraints,
	AlphaMode
} from '@microsoft/mixed-reality-extension-sdk';
import { Transform } from 'stream';

/**
 * The main class of this app. All the logic goes here.
 */
export default class PinkBoxGame {
	private assets: AssetContainer;
	private light: Actor = null;
	private carpet: Actor = null;
	private cone: Actor = null;

	constructor(private context: Context, private baseUrl: string) {
		console.log('PinkBoxGame STARTED');

		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());

		console.log('session Id connected:');
		console.log(this.context.sessionId);
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {

		/////////////
		// LIGHT
		/////////////

		this.light = Actor.Create(this.context, {
			actor: {
				name: 'Light',
				transform: {
					app: {
						position: { x: 0, y: 1.0, z: -0.5 },
						rotation: Quaternion.RotationAxis(Vector3.Left(), -45.0 * DegreesToRadians),
					}
				},
				light: {
					color: { r: 1, g: 0.6, b: 0.3 },
					type: 'spot',
					intensity: 5,
					range: 6,
					spotAngle: 45 * DegreesToRadians
				},

			}
		});

		////////////////
		// CARPET
		////////////////

		this.carpet = Actor.CreateFromGltf(new AssetContainer(this.context), {
			// at the given URL
			uri: `${this.baseUrl}/goals-carpet.glb`,
			// and spawn box colliders around the meshes.
			colliderType: 'box',
			// Also apply the following generic actor properties.
			actor: {
				name: 'POD Goals Carpet',
				// Parent the glTF model to the text actor.
				transform: {
					local: {
						position: { x: 0, y: -3.25, z: -3},
						scale: { x: 1.5, y: 1.5, z: 1.5}
					}
				}
			}
		});

		/* 
		////////////////
		// CONE
		////////////////
		const blueTexture = this.assets.createTexture('blueTexture', {
			color: {r: 0, g: 0, b: 1}
			}
		);

		const blue = this.assets.createMaterial('blueMat', {
			color: { r: .102, g: 0.169, b: 0.843 }
		});

		this.cone = Actor.CreateFromGltf(new AssetContainer(this.context), {
			// at the given URL
			uri: `${this.baseUrl}/cone.glb`,
			// and spawn box colliders around the meshes.
			colliderType: 'mesh',
			// Also apply the following generic actor properties.
			actor: {
				name: 'Cone Shape',
				// Parent the glTF model to the text actor.
				transform: {
					local: {
						position: { x: 0, y: -3.25, z: -3 },
						scale: { x: 1.5, y: 1.5, z: 1.5 }
					}
				}
			}
		});

		// GRABBABLE
		this.cone.grabbable = true;

		// MATERIAL
		// const cubeMat = this.assets.createMaterial('material', {
		// 	color: { r: 1, g: 0, b: 1 }
		// });
		// this.cone.appearance.material = cubeMat;
		console.log('this cones material:', this.cone.appearance.material);

		const coneButtonBehavior = this.cone.setBehavior(ButtonBehavior);
		coneButtonBehavior.onClick(_ => {
			console.log('click cone');

			// SHAPE COLOR CHANGE
			const m = this.assets.createMaterial('material', {
				color: { r: Math.random(), g: Math.random(), b: Math.random() }
			});
			this.cone.appearance.material = m;
		});
		*/

		//////////////////////////////
		// NON-COLLIDING PRIMITIVES
		//////////////////////////////

		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				for (var k = 0; k < 5; k++) {

					const shape = Actor.CreatePrimitive(this.assets, {
						definition: {
							shape: this.generateShapePerRow(k + 1),
							dimensions: { x: 1.7, y: 0.60, z: 1.70 }
						},
						addCollider: true
					});

					// TRANSFORM
					shape.transform = new ActorTransform();
					shape.transform.app.position = new Vector3(-j, 0.5 * k, -i + 5);
					if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
						shape.transform.local.scale = new Vector3(0.8, 0.8, 0.8);
					} else if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
						shape.transform.local.scale = new Vector3(0.6, 0.6, 0.6);
					} else {
						shape.transform.local.scale = new Vector3(0.4, 0.4, 0.4);
					}

					// shape.transform.local.scale = new Vector3(0.1, 0.1, 0.1);

					// GRABBABLE
					shape.grabbable = true;

					// MATERIAL
					const cubeMat = this.assets.createMaterial('material', {
						color: { r: 1, g: 1, b: 1 }
					});
					shape.appearance.material = cubeMat;

					// ON GRAB
					// shape.onGrab('begin', () => {
					//	const c = this.context.actor(shape.id);
					//	console.log('grabbed');
					// });

					// BUTTON BEHAVIOR
					const buttonBehavior = shape.setBehavior(ButtonBehavior);
					buttonBehavior.onClick(_ => {
						console.log('click');

						// SHAPE COLOR CHANGE
						const m = this.assets.createMaterial('material', {
							color: { r: Math.random(), g: Math.random(), b: Math.random() }
						});
						shape.appearance.material = m;

						// SHAPE SIZE CHANGE
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Box) {
							shape.transform.local.scale = new Vector3(
								(Math.random() + 0.05) * 0.8,
								(Math.random() + 0.05) * 0.8,
								(Math.random() + 0.05) * 0.8
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Cylinder) {
							const height = (Math.random() + 0.05) * 0.8;
							const radius = (Math.random() + 0.05) * 0.5;
							shape.transform.local.scale = new Vector3(
								radius,
								height,
								radius
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
							const height = (Math.random() + 0.05) * 0.8;
							const radius = (Math.random() + 0.05) * 0.5;
							shape.transform.local.scale = new Vector3(
								height,
								radius,
								radius
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
							const size = (Math.random() + 0.05) * 1.2;
							shape.transform.local.scale = new Vector3(
								size,
								size,
								size
							);
						}

					});
				}
			}
		}

		/*

		//////////////////////////
		// COLLIDING PRIMITIVES
		//////////////////////////

		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				for (var k = 0; k < 5; k++) {

					// PLINKO BALL EXAMPLE
					// const cube = Actor.Create(this.context, {
					//	actor: {
					//		appearance: {
					//			meshId: this.assets.createSphereMesh('ball', 0.5).id
					//		},
					//		transform: {
					//			app: { position: new Vector3(-j, 0.5 * k, -i) }
					//		},
					//		rigidBody: {
					//			mass: 1
					//		},
					//		collider: { geometry: { shape: "auto"} }
					//	}
					// });

					const shape = Actor.CreatePrimitive(this.assets, {
						definition: {
							shape: this.generateShapePerRow(k+1),
							dimensions: { x: 1.7, y: 0.60, z: 1.70 }
						},
						addCollider: true
					});

					// TRANSFORM
					shape.transform = new ActorTransform();
					shape.transform.app.position = new Vector3(-j + 5, 0.5 * k, -i + 5);
					if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
						shape.transform.local.scale = new Vector3(0.8, 0.8, 0.8);
					} else if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
						shape.transform.local.scale = new Vector3(0.6, 0.6, 0.6);
					} else {
						shape.transform.local.scale = new Vector3(0.4, 0.4, 0.4);
					}

					// RIGID BODY
					shape.enableRigidBody({
						mass: 3
					});

					// GRABBABLE
					shape.grabbable = true;

					// MATERIAL
					const m = this.assets.createMaterial('material', {
						color: { r: 1, g: 1, b: 1, a: 0.8 }
					});
					shape.appearance.material = m;
					shape.appearance.material.alphaMode = AlphaMode.Blend;

					// ON GRAB
					shape.onGrab('begin', () => {
						const c = this.context.actor(shape.id);
						c.rigidBody.useGravity = false;
						c.rigidBody.isKinematic = true;
					});

					// ON RELEASE
					shape.onGrab('end', () => {
						const c = this.context.actor(shape.id);
						c.rigidBody.useGravity = true;
						c.rigidBody.isKinematic = false;
					});

					// BUTTON BEHAVIOR
					const buttonBehavior = shape.setBehavior(ButtonBehavior);
					buttonBehavior.onClick(_ => {
						console.log('click');

						// SHAPE COLOR CHANGE
						const m = this.assets.createMaterial('material', {
							color: { r: Math.random(), g: Math.random(), b: Math.random() }
						});
						shape.appearance.material = m;

						// SHAPE SIZE CHANGE
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Box) {
							shape.transform.local.scale = new Vector3(
								(Math.random() + 0.1) * 2.1,
								(Math.random() + 0.1) * 2.1,
								(Math.random() + 0.1) * 2.1
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Cylinder) {
							const height = (Math.random() + 0.1) * 2.7;
							const radius = (Math.random() + 0.1) * 1;
							shape.transform.local.scale = new Vector3(
								radius,
								height,
								radius
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
							const height = (Math.random() + 0.1) * 2.1;
							const radius = (Math.random() + 0.1) * 1.5;
							shape.transform.local.scale = new Vector3(
								height,
								radius,
								radius
							);
						}
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
							const size = (Math.random() + 0.1) * 2.1;
							shape.transform.local.scale = new Vector3(
								size,
								size,
								size
							);
						}
					});

				}
			}
		}
		
		*/

	}
	

	private generateShapePerRow(row: number) {
		var shape = PrimitiveShape.Box;
		if (row === 2) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 3) {
			shape = PrimitiveShape.Cylinder;
		}
		if (row === 4) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 5) {
			shape = PrimitiveShape.Sphere
		};
		return shape;
	}

	/**
	 * Generate keyframe data for a simple spin animation.
	 * @param duration The length of time in seconds it takes to complete a full revolution.
	 * @param axis The axis of rotation in local space.
	 */
	private generateSpinKeyframes(duration: number, axis: Vector3, angle: number): AnimationKeyframe[] {
		// const angle = (Math.PI / 4);
		console.log('angle is:');
		console.log(angle);
		return [{
			time: 0 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 0 - angle) } } }
		}, {
			time: 0.25 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (Math.PI / 2) - angle) } } }
		}, {
			time: 0.5 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (Math.PI) - angle) } } }
		}, {
			time: 0.75 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (3 * Math.PI / 2) - angle) } } }
		}, {
			time: 1 * duration,
			value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, (2 * Math.PI) - angle) } } }
		}];
	}

	private growAnimationData: AnimationKeyframe[] = [{
		time: 0,
		value: { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } }
	}, {
		time: 0.3,
		value: { transform: { local: { scale: { x: 0.5, y: 0.5, z: 0.5 } } } }
	}];
}