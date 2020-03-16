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
	User,
	Sound,
	TargetBehavior
} from '@microsoft/mixed-reality-extension-sdk';
import { Transform } from 'stream';

/**
 * The main class of this app. All the logic goes here.
 */
export default class PinkBalloonInstall {
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

	private heads: Actor[] = [];

	private sound1: Sound;

	constructor(private context: Context, private baseUrl: string) {
		console.log('PinkBalloonInstall STARTED');

		this.assets = new AssetContainer(context);
		this.context.onStarted(() => this.started());
		// this.context.onUserJoined((user) => this.userJoined(user));

		console.log('session Id connected:');
		console.log(this.context.sessionId);
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
		let hand1 = Actor.Create(this.context, {
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
		hand1.subscribe('transform');

		// LEFT HAND
		let hand2 = Actor.Create(this.context, {
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
		hand2.subscribe('transform');

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
		let head = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `https://pink-box-game.azurewebsites.net/clippyhead.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				attachment: {
					attachPoint: 'head',
					userId: user.id
				}
			}
		});
		head.subscribe('transform');

		this.heads.push(head);
		console.log('HEADS LIST');
		console.log(this.heads);
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private async started() {

		/////////////
		// SOUND1
		/////////////
		this.sound1 = this.assets.createSound(
			'piano',
			{ uri: `${this.baseUrl}/0m-057-A3.wav` }
		);

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
				uri: `https://pink-box-game.azurewebsites.net/coin-man.glb`,
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
				uri: `https://pink-box-game.azurewebsites.net/puzzle-piece.glb`,
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

		//////////////////////////////
		// OBJS / SHEETS
		//////////////////////////////

		const objects: string[] = [
			'barn-doors-small.png',
			'barn-m-studio-small.jpg',
			'barn-photo-studio-small.jpg',
			'desk-ar-1-small.jpg',
			'desk-ar-2-small.jpg',
			'large-cards-barn-1-small.jpg',
			'large-cards-barn-2-small.jpg',
			'ev-in-hololens-small.jpg',
			'figure-small.jpg',
			'm-in-person-small.jpg',
			'next-5-years-small.jpg',
			'vi-in-altspace-small.jpg',
			'win-small.jpg',
			'altspace-1-small.jpg',
			'altspace-2-small.jpg'
		];

		const square = this.assets.createBoxMesh('square', 3.5, 0.2, 2);

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
					uri: `https://pink-box-game.azurewebsites.net/`+objects[i]
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
								position: { x: 0, y: s, z: xPos },
								scale: { x: 0.07, y: 0.07, z: 0.07 },
								rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians() }
							}
						}
					}
				});
				object.setCollider("box", false);
				object.grabbable = true;

				xPos += 0.5;
			}
		}

		//////////////////////////////
		// NON-COLLIDING CARDS
		//////////////////////////////

		let jPos = 0;

		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 2; j++) {
				for (var k = 0; k < 2; k++) {

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
							//color: { r: Math.random(), g: Math.random(), b: Math.random() }
							//color: new Color4(1, 0, 0)
							color: this.generateColor()
						});
						shape.appearance.material = m;

						// SHAPE SIZE CHANGE
						
						// if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Box) {
						// 	shape.transform.local.scale = new Vector3(
						// 		(Math.random() + 0.05) * 0.8,
						// 		(Math.random() + 0.05) * 0.8,
						// 		(Math.random() + 0.05) * 0.8
						// 	);
						// }
						// if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Cylinder) {
						// 	const height = (Math.random() + 0.05) * 0.8;
						// 	const radius = (Math.random() + 0.05) * 0.5;
						// 	shape.transform.local.scale = new Vector3(
						// 		radius,
						// 		height,
						// 		radius
						// 	);
						// }
						// if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
						// 	const height = (Math.random() + 0.05) * 0.8;
						// 	const radius = (Math.random() + 0.05) * 0.5;
						// 	shape.transform.local.scale = new Vector3(
						// 		height,
						// 		radius,
						// 		radius
						// 	);
						// }
						// if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
						// 	const size = (Math.random() + 0.05) * 1.2;
						// 	shape.transform.local.scale = new Vector3(
						// 		size,
						// 		size,
						// 		size
						// 	);
						// }
						

					});
				}
				jPos+= 0.25;
			}
		}
		*/

		///////////////////////////////
		// SAUSAGES
		///////////////////////////////
		/* for (var i = 0; i < 7; i++) {
			let sausage = Actor.CreateFromGltf(new AssetContainer(this.context), {
				uri: `${this.baseUrl}/Sausage${i}.glb`,
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
			sausage.grabbable = true;
			this.subscribeToGrabTransforms(sausage);
		} */

		//////////////////////////////////
		// SAUSAGE 1 - STOOL SAUSAGE
		//////////////////////////////////
		const sausage1 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage1.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				transform: {
					local: {
						position: { x: -0.47, y: 0.69, z: 0.14},
						scale: { x: 0.07, y: 0.07, z: 0.07 },
						rotation: { x: -0.14, y: 0.86, z: -0.478, w: 0.10}
					}
				}
			}
		});
		sausage1.grabbable = true;
		this.subscribeToGrabTransforms(sausage1);

		//////////////////////////////////
		// SAUSAGE 2
		//////////////////////////////////
		/* const sausage2 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage2.glb`,
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
		sausage2.grabbable = true;
		this.subscribeToGrabTransforms(sausage2);

		//////////////////////////////////
		// SAUSAGE 3
		//////////////////////////////////
		const sausage3 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage3.glb`,
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
		sausage3.grabbable = true;
		this.subscribeToGrabTransforms(sausage3);*/

		//////////////////////////////////
		// SAUSAGE 4 - WALL SAUSAGE
		//////////////////////////////////
		const sausage4 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage4.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				transform: {
					local: {
						position: { x: 8.091, y: 1.43, z: -5.36},
						scale: { x: 0.07, y: 0.07, z: 0.07 },
						rotation: { x: 0.213, y: 0.54, z: 0.314, w: -0.74}
					}
				}
			}
		});
		sausage4.grabbable = true;
		this.subscribeToGrabTransforms(sausage4);

		//////////////////////////////////
		// SAUSAGE 5 - CHAIR SAUSAGE
		//////////////////////////////////
		const sausage5 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage5.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				transform: {
					local: {
						position: { x: 6.67, y: 0.87, z: -5.87},
						scale: { x: 0.07, y: 0.07, z: 0.07 },
						rotation: { x: -0.73, y: -0.65, z: 0.111, w: 0.079}
					}
				}
			}
		});
		sausage5.grabbable = true;
		this.subscribeToGrabTransforms(sausage5);

		//////////////////////////////////
		// SAUSAGE 6
		//////////////////////////////////
		/* const sausage6 = Actor.CreateFromGltf(new AssetContainer(this.context), {
			uri: `${this.baseUrl}/Sausage6.glb`,
			colliderType: 'box',
			actor: {
				name: 'Team planning object',
				transform: {
					local: {
						position: { x: 0, y: 0, z: 0 },
						scale: { x: 0.07, y: 0.07, z: 0.07 },
						rotation: { x: 0, y: 0, z: Angle.FromDegrees(90).radians() }
					}
				}
			}
		});
		sausage6.grabbable = true;
		this.subscribeToGrabTransforms(sausage6); */

		///////////////////////////////
		// SOUND BITS
		///////////////////////////////
		/*
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
					shape.transform.app.position = new Vector3(-j-5, 0.5 * k, -i + 5);
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
						color: { r: 0, g: 0, b: 1 }
					});
					shape.appearance.material = cubeMat;

					// ON GRAB
					// shape.onGrab('begin', () => {
					//	const c = this.context.actor(shape.id);
					//	console.log('grabbed');
					// });

					// ON GRAB END
					this.subscribeToGrabTransforms(shape);

					// BUTTON BEHAVIOR
					const buttonBehavior = shape.setBehavior(ButtonBehavior);

					buttonBehavior.onHover("enter", _ => {
						// PLAY SOUND
						shape.startSound(this.sound1.id, {volume: 1, time: 1});
					});

					buttonBehavior.onClick(_ => {
						console.log('click');

						// SHAPE COLOR CHANGE
						const m = this.assets.createMaterial('material', {
							color: this.generateColor()
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
							const height = (Math.random() + 0.05) * 4;
							const radius = (Math.random() + 0.05) * 0.5;
							shape.transform.local.scale = new Vector3(
								height,
								0.6,
								0.6
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
		*/

		///////////////////////////////
		// NON-COLLIDING SCULPTUREBITS
		///////////////////////////////

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 3; j++) {
				for (var k = 0; k < 1; k++) {

					const shape = Actor.CreatePrimitive(this.assets, {
						definition: {
							shape: this.generateShapePerRow(k + 1),
							dimensions: { x: 1.6, y: 0.20, z: 0.70 }
						},
						addCollider: true
					});

					// TRANSFORM
					shape.transform = new ActorTransform();
					shape.transform.app.position = new Vector3(4.56 - j, Math.random() + 1, - 3.6 + i);
					if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
						shape.transform.local.scale = new Vector3(0.8, 0.8, 0.8);
					} else if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
						shape.transform.local.scale = new Vector3(0.6, 0.6, 0.6);
					} else {
						shape.transform.local.scale = new Vector3(0.4, 0.4, 0.4);
					}
					shape.transform.local.rotation = Quaternion.RotationAxis(Vector3.Backward(), 90 * DegreesToRadians);

					// shape.transform.local.scale = new Vector3(0.1, 0.1, 0.1);

					// GRABBABLE
					shape.grabbable = true;

					// MATERIAL
					const cubeMat = this.assets.createMaterial('material', {
						color: { r: 0.5, g: 0.5, b: 0.5, a: 0.5 }
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
							color: this.generateColor()
						});
						shape.appearance.material = m;

						// SHAPE SIZE CHANGE
						/*if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Box) {
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
						}*/
						if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Capsule) {
							const height = (Math.random() + 0.05) * 4;
							const radius = (Math.random() + 0.05) * 0.5;
							shape.transform.local.scale = new Vector3(
								height,
								0.6,
								0.6
							);
						}
						/*if (shape.appearance.mesh.primitiveDefinition.shape === PrimitiveShape.Sphere) {
							const size = (Math.random() + 0.05) * 1.2;
							shape.transform.local.scale = new Vector3(
								size,
								size,
								size
							);
						}*/

					});

					// GRAB BEHAVIOR
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
		var shape = PrimitiveShape.Capsule;
		if (row === 2) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 3) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 4) {
			shape = PrimitiveShape.Capsule;
		}
		if (row === 5) {
			shape = PrimitiveShape.Capsule
		};
		return shape;
	}

	// pinks: https://i.pinimg.com/originals/05/41/90/054190a66e753cb0d4cf7ccf40c567b7.jpg
	private generateColor() {
		const colors: Color4[] = [
			new Color4(0, 0, 0), // black
			new Color4(1, 1, 1), // white

			new Color4(0.964, 0.6, 0.803), // pink
			new Color4(0.988, 0.580, 0.686), // rose
			new Color4(0.988, 0.274, 0.666), // fuscia
			new Color4(0.949, 0.321, 0.470), // punch

			new Color4(0.996, 0.772, 0.898), // blush
			new Color4(0.996, 0.498, 0.611), // watermelon
			new Color4(0.992, 0.643, 0.729), // flamingo
			new Color4(0.949, 0.419, 0.541), // rouge

			new Color4(0.992, 0.670, 0.623), // salmon
			new Color4(0.996, 0.490, 0.415), // coral
			new Color4(0.988, 0.580, 0.513), // peach
			new Color4(0.988, 0.298, 0.305), // strawberry

			new Color4(0.619, 0.258, 0.266), // rosewood
			new Color4(0.988, 0.729, 0.796), // lemonade
			new Color4(0.980, 0.525, 0.768), // taffy
			new Color4(0.992, 0.364, 0.658), // bubblegum

			new Color4(0.968, 0.603, 0.752), // ballet slipper
			new Color4(0.949, 0.721, 0.776), // crepe
			new Color4(0.882, 0.082, 0.517), // magenta
			new Color4(1, 0.086, 0.580), // hot pink
		];
		return colors[Math.floor(Math.random() * colors.length)];
		//return colors[0];
	}

}