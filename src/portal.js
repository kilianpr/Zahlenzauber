import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import watertexture from '/res/particles/water.png'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import portal from '/res/room/portal.obj';
import portalGLTF from '/res/room/portal.glb';
import stoneText from '/res/room/stonetext.jpg';
import Constants from './constants.js';


const _VSPortal = `
uniform float randomMultiplier;
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
  void main() {
    vUv = uv;

    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.5*sin((sqrt(pow(position.x, 2.0) +  pow(position.y, 2.0)/3.0)-time/5.0)*2.0), 1.0);
  }
`;

const _VSPortalPerformant = `
uniform float randomMultiplier;
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const _FSPortal = `
uniform float time;
uniform sampler2D myTexture;
varying vec2 vUv;
varying vec3 vPosition;
  void main() {
    vec2 displacedUV = vec2(vUv.x + 0.1 * sin(vUv.y*100. + time), vUv.y);
    gl_FragColor = texture2D(myTexture, displacedUV);
    gl_FragColor.a = 0.8;
  }
`;

class Portal{

    constructor(parent, width, position) {
      const positionX = position.x;
      const positionY = position.y;
      const positionZ = position.z

      const textLoader = new THREE.TextureLoader(Constants.GeneralLoadingManager);
      var texture = textLoader.load(stoneText);
      var mat = new THREE.MeshStandardMaterial({map:texture});

      const object = this;
      const objLoader = new OBJLoader(Constants.GeneralLoadingManager);
      objLoader.load(portal, (obj) => {

          this._object = obj;  
          //set stone texture of portal
          obj["children"][0].material = mat;
          obj.name = "portalFrame";
  
          //set position and rotation
          obj.position.set(positionX, positionY, positionZ);
          obj.rotation.y = Math.PI/2;
  
          //scales the portal to the given width
          let box = new THREE.Box3().setFromObject(obj);
          let initWidth = box.max.x - box.min.x;
          if (Math.round(initWidth) !== width){
            obj.scale.set(width/initWidth, width/initWidth, width/initWidth);
          }
          
          box.setFromObject(obj);
          object._innerHeight = 0.9*(box.max.y - box.min.y);
          parent._scene.add(obj);
          this._animation = new Animation(parent, 0.75*width, this._innerHeight, positionX, positionY+this._innerHeight/2, positionZ);
      });

      this._checkpoint = new CheckPoint(5);
      this._checkpoint.show();
      this._checkpoint._element.position.set(positionX, 0, 45);
      parent._scene.add(this._checkpoint._element);
    }

    showAnimation(){
      this._animation.visible = true;
    }

    getCheckPointMesh(){
      return this._checkpoint._element;
    }
    
}


class Animation{

    constructor(parent, width, height, positionX, positionY, positionZ){
        this._geometry = new THREE.PlaneGeometry(width, height, 100, 100);

        this.visible = false;

        const uniforms = {
          myTexture: {
              value: new THREE.TextureLoader(Constants.GeneralLoadingManager).load(watertexture),
          },
          time: {
            value: 0
          },

        };

    this._material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      side: THREE.DoubleSide,
      fragmentShader: _FSPortal,
      vertexShader: _VSPortalPerformant,
      shadowSide: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    })

      this._plane = new THREE.Mesh(this._geometry, this._material);
      this._plane.position.set(positionX, positionY, positionZ-.8);
      this._plane.name = "portalInside";
  
      //this._light = new THREE.RectAreaLight( 0xffffff, 1,  width, height );
      //this._light.position.set(positionX, positionY, positionZ);
      //this._light.lookAt(positionX, 0, 0);
  
      parent._scene.add(this._plane);
      //parent._scene.add(this._light);
      console.log(this);
    

}



  Step(timeElapsed) {
    if (!this._material.uniforms.time.value){
      this._material.uniforms.time.value = 0.0;
    }
    this._material.uniforms.time.value += timeElapsed*10;
  }
    
}


  class CheckPoint {
    constructor(radius){
      this._radius = radius
      this._create();
  }

    _create(){
        const geometry = new THREE.CylinderGeometry(this._radius, this._radius, .5, 32, 1);
        const material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, color: 0xFFD700});
        this._element = new THREE.Mesh(geometry, material);
        this._element.name = "checkpoint";
    }

    show(){
        new TWEEN.Tween(this._element.material, Constants.TweenGroup.Opacity)
        .to({opacity: 1}, 2000)
        .start();
    }

    hide(){
        new TWEEN.Tween(this._element.material, Constants.TweenGroup.Opacity)
        .to({opacity: 0},2000)
        .start();
    }
}



export {Portal};