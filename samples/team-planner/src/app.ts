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
	AlphaMode,
	Angle,
	Color3,
	User
} from '@microsoft/mixed-reality-extension-sdk';
import { Transform } from 'stream';

/**
 * The main class of this app. All the logic goes here.
 */
export default class TeamPlanner {
	private assets: AssetContainer;
	private light: Actor = null;
	private userId: string;

	private barnimage: Actor = null;
	private barn: Actor = null;
	private blocks: Actor = null;
	private blogpost: Actor = null;
	private hiring: Actor = null;
	private hololens2: Actor = null;
	private identitysystems: Actor = null;
	private interfaceimage: Actor = null;
	private lumpydatasets: Actor = null;
	private mroffice: Actor = null;
	private mrevideo: Actor = null;
	private quest: Actor = null;
	private toast: Actor = null;
	private unity: Actor = null;
	private vive: Actor = null;
	private vrbook: Actor = null;
	private vrpaper: Actor = null;

	private hand1: Actor = null;
	private hand2: Actor = null;
	private head: Actor = null;

	private heads: Actor[] = [];

	constructor(private context: Context, private baseUrl: string) {
		console.log('TeamPlanner STARTED');

		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());
		this.context.onUserJoined((user) => this.userJoined(user));
		this.context.onUserLeft((user) => this.userLeft(user));

		console.log('session Id connected:');
		console.log(this.context.sessionId);
	}

	private userLeft(user: User) {

		console.log('USER JOINED TRY TO DELETE RIGHT HAND, LEFT HAND, HEAD');
		this.head.destroy();
		this.hand1.destroy();
		this.hand2.destroy();


	}

	private userJoined(user: User) {

		console.log('USER JOINED TRY TO MAKE RIGHT HAND, LEFT HAND, HEAD');

		// MESH
		const square = this.assets.createBoxMesh('square', 0.2, 0.1, 0.2);

		// MATERIALS
		const mat = this.assets.createMaterial('logo', {
			color: Color3.Blue()
		});
		const redMat = this.assets.createMaterial('logo', {
			color: Color3.Red()
		});
		const grayMat = this.assets.createMaterial('logo', {
			color: Color3.LightGray()
		});

		// RIGHT HAND
		this.hand1 = Actor.Create(this.context, {
			actor: {
				name: 'Team planning object',
				appearance: {
					meshId: square.id,
					materialId: grayMat.id
				},
				attachment: {
					attachPoint: 'right-hand',
					userId: user.id
				}
			}
		});
		this.hand1.subscribe('transform');

		// LEFT HAND
		this.hand2 = Actor.Create(this.context, {
			actor: {
				name: 'Team planning object',
				appearance: {
					meshId: square.id,
					materialId: grayMat.id
				},
				attachment: {
					attachPoint: 'left-hand',
					userId: user.id
				}
			}
		});
		this.hand2.subscribe('transform');

		// HEAD
		// const head = Actor.Create(this.context, {
		// 	actor: {
		// 		name: 'Team planning object',
		// 		appearance: {
		// 			meshId: square.id,
		// 			materialId: redMat.id
		// 		},
		// 		attachment: {
		// 			attachPoint: 'head',
		// 			userId: user.id
		// 		}
		// 	}
		// });
		// head.subscribe('transform');

		// HEAD
		this.head = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/clippyhead.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				attachment: {
					attachPoint: 'head',
					userId: user.id
				}
			}
		});
		this.head.subscribe('transform');

		this.heads.push(head);
		console.log('HEADS LIST');
		console.log(this.heads);
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

		/*

		//////////////////////////////
		// COIN MEN
		//////////////////////////////
		for (var i = 0; i < 1; i++) {
			let object = Actor.CreateFromGltf(new AssetContainer(this.context), {
				uri: `${this.baseUrl}/coin-man.glb`,
				colliderType: 'box',
				actor: {
					name: 'Team planning object',
					transform: {
						local: {
							position: { x: -3, y: 0, z: i },
							scale: { x: 0.07, y: 0.07, z: 0.07 },
							rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians() }
						}
					}
				}
			});
			object.grabbable = true;
		}

		//////////////////////////////
		// PUZZLE PIECES
		//////////////////////////////
		for (var i = 0; i < 1; i++) {
			let object = Actor.CreateFromGltf(new AssetContainer(this.context), {
				uri: `${this.baseUrl}/puzzle-piece.glb`,
				colliderType: 'box',
				actor: {
					name: 'Team planning object',
					transform: {
						local: {
							position: { x: -3, y: 0.5, z: i },
							scale: { x: 0.07, y: 0.07, z: 0.07 },
							rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians() }
						}
					}
				}
			});
			object.grabbable = true;
		}
		*/

		//////////////////////////////
		// NON-COLLIDING CARDS
		//////////////////////////////

		const objects: string[] = [
			'Slide32.PNG',
			'Slide33.PNG',
			'Slide34.PNG',
			'Slide35.PNG',
			'Slide36.PNG',
			'Slide37.PNG'
		];

		const square = this.assets.createBoxMesh('square', 7, 0.2, 4);

		let xPos = 0;
		for (var s = 0; s < 1; s++) {
			xPos = 0;
			for (var i = 0; i < objects.length; i++) {
				
				// Gltf
				// let object = Actor.CreateFromGltf(new AssetContainer(this.context), {
				// 	uri: `${this.baseUrl}/`+objects[i]+`.glb`,
				// 	colliderType: 'box',
				// 	actor: {
				// 		name: 'Team planning object',
				// 		transform: {
				// 			local: {
				// 				position: { x: 0, y: 0, z: xPos },
				// 				scale: { x: 0.07, y: 0.07, z: 0.07 },
				// 				rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians()}
				// 			}
				// 		}
				// 	}
				// });
				
				// Texture
				const tex = this.assets.createTexture('tex', {
					// uri: `${this.baseUrl}/altspace-logo.jpg`
					uri: `${this.baseUrl}/${objects[i]}`
				});

				// Material
				const mat = this.assets.createMaterial('logo', {
					color: Color3.White(),
					mainTextureId: tex.id
				});

				// Actor
				let object = Actor.Create(this.context, {
					actor: {
						name: 'Team planning object',
						appearance: {
							meshId: square.id,
							materialId: mat.id
						},
						transform: {
							local: {
								position: { x: 9.6 + xPos, y: 1.44, z: xPos},
								scale: { x: 0.07, y: 0.07, z: 0.07 },
								rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians() }
							}
						}
					}
				});
				object.setCollider("box", false);
				object.grabbable = true;

				this.subscribeToGrabTransforms(object);

				xPos += 0.25;
			}
		}

		//////////////////////////////////
		// NON-COLLIDING LINES/CIRCLE BITS
		//////////////////////////////////
		/*
		let jPos = 0;

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {

					const shape = Actor.CreatePrimitive(this.assets, {
						definition: {
							shape: this.generateShapePerRow(k + 1),
							dimensions: { x: 0.07, y: 0.07, z: 0.07 }
						},
						addCollider: true
					});

					// TRANSFORM
					shape.transform = new ActorTransform();
					// shape.transform.app.position = new Vector3(-j, 0.5 * k, -i + 5);
					shape.transform.app.position = new Vector3(j, (0.5 * k) - 2, -(i/2));
					if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
						shape.transform.local.scale = new Vector3(0.7, 0.7, 0.7);
					} else if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
						shape.transform.local.scale = new Vector3(0.5, 0.5, 0.5);
					} else {
						shape.transform.local.scale = new Vector3(0.25, 4, 0.25);
					}

					// shape.transform.local.scale = new Vector3(0.1, 0.1, 0.1);

					// GRABBABLE
					shape.grabbable = true;

					// MATERIAL
					const cubeMat = this.assets.createMaterial('material', {
						color: { r: 1, g: 1, b: 1 }
					});
					shape.appearance.material = cubeMat;

					// BUTTON BEHAVIOR
					const buttonBehavior = shape.setBehavior(ButtonBehavior);
					buttonBehavior.onClick(_ => {
						console.log('click');

						// SHAPE COLOR CHANGE
						const m = this.assets.createMaterial('material', {
							color: this.generateColor()
						});
						shape.appearance.material = m;
					});
				}
				jPos+= 0.25;
			}
		}
		*/

		///////////////////////////////
		// NON-COLLIDING SCULPTUREBITS
		///////////////////////////////

		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 2; j++) {
				for (var k = 0; k < 2; k++) {

					const shape = Actor.CreatePrimitive(this.assets, {
						definition: {
							shape: this.generateShapePerRow(k + 1),
							dimensions: { x: 1.7, y: 0.60, z: 1.70 }
						},
						addCollider: true
					});

					// TRANSFORM
					shape.transform = new ActorTransform();
					// shape.transform.app.position = new Vector3(-j, (0.5 * k) + 0.5, -i + 3.5);
					shape.transform.app.position = new Vector3(-0.061 - j, 0.711 + k, -1.59 - i);
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
								(Math.random() + 0.05) * 0.4,
								(Math.random() + 0.05) * 0.4,
								(Math.random() + 0.05) * 0.4
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

					// REGISTER POS
					this.subscribeToGrabTransforms(shape);
				}
			}
		}
	}

	private subscribeToGrabTransforms(shape: Actor) {
		shape.subscribe('transform');
		shape.onGrab("end", () => {
			console.log('*************************');
			console.log('position x:', shape.transform.app.position.x);
			console.log('position y:', shape.transform.app.position.y);
			console.log('position z:', shape.transform.app.position.z);
			console.log('-------');
			console.log('rotation x:', shape.transform.app.rotation.x);
			console.log('rotation y:', shape.transform.app.rotation.y);
			console.log('rotation z:', shape.transform.app.rotation.z);
			console.log('rotation w:', shape.transform.app.rotation.w);
			console.log('*************************');
			console.log(' ');
		});
	}

	private generateShapePerRow(row: number) {
		var shape = PrimitiveShape.Box;
		if (row === 2) {
			// shape = PrimitiveShape.Sphere;
			shape = PrimitiveShape.Box;
		}
		if (row === 3) {
			shape = PrimitiveShape.Box;
		}
		if (row === 4) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 5) {
			shape = PrimitiveShape.Sphere
		};
		return shape;
	}

	private generateColor() {
		const colors: Color4[] = [
			new Color4(1, 0, 0), // red
			new Color4(0, 1, 0), // green
			new Color4(0, 0, 1), // blue
			new Color4(1, 1, 0), // yellow
			new Color4(0, 1, 1), // cyan
			new Color4(1, 0, 1), // magenta
		];
		return colors[Math.floor(Math.random() * colors.length)];
		//return colors[0];
	}

}