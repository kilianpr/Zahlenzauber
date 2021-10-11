import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {ParticleSystem} from './particles.js';
import {BasicCharacterController} from '/src/controller.js';
import {Portal} from './portal.js';
import {SpeechBubble} from './welcome.js';

import '/src/base.css';
import bricksText from '/res/room/blue-bricks.jpg';
import floorText from '/res/room/floorText.jpg';
import { Box3, Vector3} from 'three';



class World{


    constructor(){
        this._Initialize();
    }

    _Initialize(){

      //const gui = new dat.GUI();


      this._threejs = new THREE.WebGLRenderer({
          antialias: true,
      });
      this._threejs.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
      this._threejs.shadowMap.enabled = true;
      this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      
      document.body.appendChild(this._threejs.domElement);
      
      window.addEventListener('resize', () => { //makes Renderer smaller on Resize
          this._OnWindowResize();
      }, false);

      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 0.1;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(0, 10, -30);
      this.pointLook = {x: 0, y:10, z:50}
      this._camera.lookAt(this.pointLook.x, this.pointLook.y, this.pointLook.z);


      /*gui.add(this._camera.position, 'x', -100, 100);
      gui.add(this._camera.position, 'y', -100, 100);
      gui.add(this._camera.position, 'z', -100, 100);
      gui.add(this.pointLook, 'x', -100, 100);
      gui.add(this.pointLook, 'y', -100, 100);
      gui.add(this.pointLook, 'z', -100, 100);*/


      this._scene = new THREE.Scene();

      //this._threejs.shadowMap.enabled = true;
      
      this._light = new THREE.DirectionalLight(0xfff5b6, 1, 100);
      this._light.position.set(50, 50, -50);
      this._scene.add(this._light);

      //const controls = new OrbitControls(
      //    this._camera, this._threejs.domElement);
      //controls.target.set(0, 0, 0);
      //controls.update();

      this._BuildRoom();

      this._particlesLeft = new ParticleSystem({
        parent: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(44, 0, 44)
      });
      this._particlesRight = new ParticleSystem({
        parent: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(-44, 0, 44)
      });

      const axesHelper = new THREE.AxesHelper( 5 );
      this._scene.add( axesHelper );

      this._bubble = new SpeechBubble(this._camera, "Herzlich Willkommen");
      this._bubble.moveBubble(new THREE.Vector3(0, 0, 0));
      this._LoadAnimatedModel()
      this._RAF();

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
        ground.receiveShadow = true;
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


         


      //updates the camera and renderer size
      _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        this._bubble.moveBubble(new Vector3(0,0,0));
      }


      _LoadAnimatedModel() {
        const params = {
          camera: this._camera,
          scene: this._scene,
        }
        this._controls = new BasicCharacterController(params);
      }

      //renders the scene and passes the elapsed time to the _Step function
      _RAF() {
        requestAnimationFrame((t) => {
          if (this._previousRAF === null) {
            this._previousRAF = t;
          }
          
          this._RAF();
          
          
          this._threejs.render(this._scene, this._camera);
          this._Step(t - this._previousRAF);
          this._previousRAF = t;
        });
      }

      //updates the controls with the time which elapsed after the previous animation frame
      _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
          this._mixers.map(m => m.update(timeElapsedS));
        }
    
        if (this._controls) {
          this._controls.Update(timeElapsedS);
        }

        this._particlesLeft.Step(timeElapsedS);
        this._particlesRight.Step(timeElapsedS);

        //supresses error message since this may be called before the model is actually loaded causing a NullPointerException
        try{
          this._portalA._animation.Step(timeElapsedS);
          this._portalB._animation.Step(timeElapsedS);
          this._portalC._animation.Step(timeElapsedS);
        }
        catch(e){
        }
        
      }

}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});