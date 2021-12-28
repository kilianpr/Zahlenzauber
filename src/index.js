import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {Fire} from './particles.js';
import {BasicCharacterController} from '/src/controller.js';
import {Portal} from './portal.js';

import '/src/base.css';
import bricksText from '/res/room/blue-bricks.jpg';
import floorText from '/res/room/floorText.jpg';
import {Box3} from 'three';



class World{

  _threejs; //THREE.WebGLRenderer
  _camera; //THREE.PerspectiveCamera
  _scene; //THREE.Scene
  _light; //THREE.DirectionalLight
  _cameraLook; //the Vec3 where the _camera looks at
  _loadingScreen; //the LoadingScreen
  _bubble; //the SpeechBubble
  _portalA; //left Portal
  _portalB; //middle Portal
  _portalC; //right Portal
  _fireLeft; //left Fire
  _fireRight; //right Fire;
  _controls; //BasicCharacterController of the animated model


    constructor(){
        this._Initialize();
    }

    _Initialize(){
      //const gui = new dat.GUI();

      const parent = this;

      this._threejs = new THREE.WebGLRenderer({
          antialias: true,
      });
      this._threejs.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      
      document.body.appendChild(this._threejs.domElement);
      
      const fov = 60;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(0, 200, -10);
      this._cameraLook = {x: 0, y:0, z:0}
      this._camera.lookAt(this._cameraLook.x, this._cameraLook.y, this._cameraLook.z);
      this._camera.updateWorldMatrix( true, false );

      /*gui.add(this._camera.position, 'x', -100, 100);
      gui.add(this._camera.position, 'y', -100, 100);
      gui.add(this._camera.position, 'z', -100, 100);
      gui.add(this._cameraLook, 'x', -100, 100);
      gui.add(this._cameraLook, 'y', -100, 100);
      gui.add(this._cameraLook, 'z', -100, 100);*/

      this._scene = new THREE.Scene();
      
      this._light = new THREE.DirectionalLight(0xfff5b6, 0.2);
      this._light.position.set(50, 50, -20);
      this._scene.add(this._light);

      this.controls = new OrbitControls(
          this._camera, document.body);
    }


    //builds a room with 4 walls
    _BuildRoom(){

        const textLoader = new THREE.TextureLoader();
        const floor = textLoader.load(floorText);
        floor.wrapS = THREE.RepeatWrapping;
        floor.wrapT = THREE.RepeatWrapping;
        floor.repeat.set( 4, 4 );

        const planeGeo = new THREE.PlaneGeometry(100, 100)
        const ground = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x808080,
                map: floor
              }));
        ground.castShadow = false;
        ground.receiveShadow = false;
        ground.rotation.x = -Math.PI / 2;
        this._scene.add(ground);

        const bricks = textLoader.load(bricksText);
        bricks.wrapS = THREE.RepeatWrapping;
        bricks.wrapT = THREE.RepeatWrapping;
        bricks.repeat.set( 4, 4 );

        const wall1 = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x070722,
                map: bricks
              }));
        wall1.rotation.x = 0;
        wall1.rotation.y = -Math.PI /2;
        this._scene.add(wall1);
        wall1.position.set(50, 50, 0);


        const wall2 = wall1.clone();
        wall2.rotation.y = Math.PI /2;
        this._scene.add(wall2);
        wall2.position.set(-50, 50, 0);

        const wall3 = wall1.clone();
        wall3.rotation.y = Math.PI;
        this._scene.add(wall3);
        wall3.position.set(0, 50, 50);

        const wall4 = wall1.clone();
        wall4.rotation.y = 0;
        this._scene.add(wall4);
        wall4.position.set(0, 50, -50);

        this._portalA = new Portal(this, 20, 0, 0, 50);
        this._portalB = new Portal(this, 20, 25, 0, 50);
        this._portalC = new Portal(this, 20, -25, 0, 50);
      }


    _makeFire(){
      this._fireLeft = new Fire({
        scene: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(44, 0, 44)
      });
      this._fireRight = new Fire({
        scene: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(-44, 0, 44)
      });
    }

    _LoadAnimatedModel() {
      const params = {
        camera: this._camera,
        scene: this._scene,
      }
      this._controls = new BasicCharacterController(params);
    }
}

export{World};

/*let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});*/