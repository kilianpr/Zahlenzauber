import transition from '/res/particles/transition2.png';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';


const VS = `
varying vec2 vUv;

void main() {
	vUv = vec2( uv.x, uv.y );
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const FS = `
uniform float mixRatio;
	
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;

uniform int useTexture;
uniform float threshold;

varying vec2 vUv;

void main() {

	vec4 texel1 = texture2D( tDiffuse1, vUv );
	vec4 texel2 = texture2D( tDiffuse2, vUv );

	if (useTexture==1) {

		vec4 transitionTexel = texture2D( tMixTexture, vUv );
		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);

		gl_FragColor = mix( texel2, texel1, mixf );

	} else {

		gl_FragColor = mix( texel1, texel2, mixRatio );

	}
}
`
class Transition{
	constructor(sceneA, sceneB, renderer){
		this._renderer = renderer;
		this._sceneA = sceneA;
		this._sceneB = sceneB;
		this._Init();
	}

	_Init(){
		const that = this;

		this._renderer.setPixelRatio( window.devicePixelRatio );
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this._renderer.domElement );

		this._scene = new THREE.Scene();
		this._width = window.innerWidth;
		this._height = window.innerHeight;

		this._camera = new THREE.OrthographicCamera( this._width / - 2, this._width / 2, this._height / 2, this._height / - 2, - 10, 10 );

		this._texture = new THREE.TextureLoader().load(transition);

		this._material = new THREE.ShaderMaterial({
			uniforms: {

				tDiffuse1: {
					value: null
				},
				tDiffuse2: {
					value: null
				},
				mixRatio: {
					value: 0.0
				},
				threshold: {
					value: 0.1
				},
				useTexture: {
					value: 1
				},
				tMixTexture: {
					value: that._texture
				}
			},
			vertexShader: VS,
			fragmentShader: FS
		});
		
		this._geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
		this._mesh = new THREE.Mesh(this._geometry,this._material );
		this._scene.add(this._mesh);

		this._material.uniforms.tDiffuse1.value = this._sceneA._fbo.texture;
    	this._material.uniforms.tDiffuse2.value = this._sceneB._fbo.texture;

		this._transitionParams = {
			'useTexture': true,
			'transition': 0,
			'texture': 5,
			'cycle': true,
			'animate': true,
			'threshold': 0.3
		};

		this._tweenToSub = new TWEEN.Tween(this._transitionParams)
		.to( { transition: 1 }, 1500 )

		this._tweenToMain = new TWEEN.Tween(this._transitionParams)
		.to( { transition: 0 }, 1500 )
	}

	setTextureThreshold(value) {
        this._material.uniforms.threshold.value = value;
    }

	useTexture(value) {
        this._material.uniforms.useTexture.value = value ? 1 : 0;
    }

	startTransition(texture = true, smooth = true){
		this.useTexture(texture);
		if (smooth){
			if (this._transitionParams.transition == 0){
				this._tweenToSub.start();
			}
			else{
				this._tweenToMain.start();
			}	
		} else{
			this._transitionParams.transition = (this._transitionParams.transition == 1)? 0 : 1;
		}
	
	}

	render(delta){
		// Transition animation
		TWEEN.update();
		this._material.uniforms.mixRatio.value = this._transitionParams.transition;

		if (this._transitionParams.transition == 0){
			this._sceneA.render(delta, false);
		} 
		else if (this._transitionParams.transition == 1){
			this._sceneB.render(delta, false);
		}
		else{
			this._sceneA.render(delta, true);
			this._sceneB.render(delta, true);
			this._renderer.setRenderTarget( null );
			this._renderer.clear();
			this._renderer.render(this._scene,this._camera );
		}  
	}
}

export {Transition}
