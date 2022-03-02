import '/src/subpages/substyles.css';
import * as THREE from 'three';
import watertexture from '/res/particles/water24.png';
import displacementImg from '/res/particles/displacement.png';
import '/res/fonts/Lora.ttf';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Constants from '../constants';


const _VSPortalPerformant = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const _FSPortal = `
uniform float time;
uniform sampler2D myTexture;
uniform sampler2D displacement;
varying vec2 vUv;
uniform vec3 pointer;
uniform vec2 windowSize;
varying vec3 vPosition;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
    vec4 displace = texture2D(displacement, vUv);

    //displacedUV.y = mix(vUv.y, displace.r-0.2, sin(time*0.01));


    vec3 normPointer = vec3(map(pointer.x, 0., windowSize.x, 0., windowSize.x/30.), map(pointer.y, 0., windowSize.y, 0., windowSize.y/30.), 0.0);
    float dist = length(vPosition - normPointer);
    //float prox = 1. - map(dist, 0., 0.2, 0. , 1.);

    vec2 displacedUV = vec2(vUv.x + 0.1 * sin(100. * pow(2.71, -1. * pow(dist, 2.0))+ 0.3*time), vUv.y);

    vec4 color = texture2D(myTexture, displacedUV);

    gl_FragColor = color;
  }
`;


class AnimatedBackground{
    _rendererPaused = true;

    constructor(renderer){
      this._renderer = renderer;
      this._InitScene();
    }

    _InitScene(){
        const parent = this;
        this._clock = new THREE.Clock();
        /*this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        
        this._threejs.domElement.setAttribute('id', 'sub-renderer');
        this._threejs.domElement.style.display = 'none';
        this._threejs.domElement.style.opacity = 0;
        document.body.appendChild(this._threejs.domElement);*/

        this._scene = new THREE.Scene();

        
        this._texture = new THREE.TextureLoader().load(watertexture);
        this._aspectVector = new THREE.Vector2(window.innerWidth, window.innerHeight);

        const uniforms = {
            myTexture: {
                value: parent._texture
            },
            time: {
              value: 0
            },
            displacement: {
              value: new THREE.TextureLoader().load(displacementImg)
            },
            pointer: {
              value: new THREE.Vector3()
            }, 
            windowSize: {
              value: parent._aspectVector
            }
      }
      
      this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        side: THREE.DoubleSide,
        fragmentShader: _FSPortal,
        vertexShader: _VSPortalPerformant,
        shadowSide: THREE.DoubleSide,
      });


      var frustumSize = 1;
      var aspect = window.innerHeight / window.innerWidth;
      this._camera = new THREE.OrthographicCamera( frustumSize  / - 2, frustumSize / 2, frustumSize * aspect / 2, frustumSize * aspect / - 2, 0.1, 100 );
      this._camera.position.z = 1;
      
      this._mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this._material );
      this._scene.add( this._mesh );
  
      this._onWindowResize();
      window.addEventListener( 'resize', () =>{
        this._onWindowResize();
      }, false );

      this._raycaster = new THREE.Raycaster();
      this._pointer = new THREE.Vector2();
      if (Constants.isOnMobile){
        window.addEventListener( 'touchmove', (event) => {this._onPointerMove(event);});
      }
      else{
        window.addEventListener( 'mousemove', (event) => {this._onPointerMove(event)});
      }
      let renderTargetParameters = { encoding: THREE.sRGBEncoding};
	    this._fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
    }

    _onWindowResize(){
      var frustumSize = 1;
      var aspect = window.innerHeight / window.innerWidth;
      
      if (aspect > 1){
        //this._mesh.scale.set(aspect, aspect, aspect);
        this._camera.left = frustumSize * 1/aspect / - 2;
        this._camera.right = frustumSize * 1/aspect / 2;
        this._camera.top = frustumSize / 2;
        this._camera.bottom = - frustumSize / 2;
      }else{
        //this._mesh.scale.set(1, 1, 1);
        this._camera.left = frustumSize / - 2;
        this._camera.right = frustumSize / 2;
        this._camera.top = frustumSize * aspect / 2;
        this._camera.bottom = - frustumSize * aspect / 2;
      }
    
      this._aspectVector = new THREE.Vector2(window.innerWidth, window.innerHeight);
      this._camera.updateProjectionMatrix();
      //this._threejs.setSize( window.innerWidth, window.innerHeight );
    }


    _onPointerMove(event){
      let x, y;
      if(event.type == 'touchmove'){
        var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
      } else if (event.type == 'mousemove') {
        x = event.clientX;
        y = event.clientY;
      }
      this._pointer.x = (x / window.innerWidth) * 2 - 1;
	    this._pointer.y = - (y / window.innerHeight) * 2 + 1;
      this._raycaster.setFromCamera(this._pointer, this._camera);
      const intersects = this._raycaster.intersectObjects(this._scene.children);
      if (intersects.length > 0){
        this._material.uniforms.pointer.value = intersects[0].point;
      }
    }
  

    render(delta, alone){
      //console.log('render bg');
      this._Step(delta);
      if (alone){
        this._renderer.setRenderTarget(this._fbo);
        this._renderer.clear();
        this._renderer.render( this._scene, this._camera);
      }
      else{
        this._renderer.setRenderTarget(null);
        this._renderer.render( this._scene, this._camera);
      }
    }

    _Step(timeElapsed) {
        if (!this._material.uniforms.time.value){
          this._material.uniforms.time.value = 0.0;
        }
        this._material.uniforms.time.value += timeElapsed*10;
      }

}


export{AnimatedBackground}
