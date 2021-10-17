import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {ParticleSystem} from './particles.js';
import {BasicCharacterController} from '/src/controller.js';
import {Portal} from './portal.js';
import {SpeechBubble, LoadingScreen, Message} from './welcome.js';

import '/src/base.css';
import bricksText from '/res/room/blue-bricks.jpg';
import floorText from '/res/room/floorText.jpg';
import {Box3} from 'three';



class World{


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
      //this._threejs.shadowMap.enabled = true;
      //this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      
      document.body.appendChild(this._threejs.domElement);
      
      window.addEventListener('resize', () => { //makes Renderer smaller on Resize
          this._OnWindowResize();
      }, false);

      const fov = 60;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(0, 200, -10);
      this.pointLook = {x: 0, y:0, z:0}
      this._camera.lookAt(this.pointLook.x, this.pointLook.y, this.pointLook.z);
      this._camera.updateWorldMatrix( true, false );



      /*gui.add(this._camera.position, 'x', -100, 100);
      gui.add(this._camera.position, 'y', -100, 100);
      gui.add(this._camera.position, 'z', -100, 100);
      gui.add(this.pointLook, 'x', -100, 100);
      gui.add(this.pointLook, 'y', -100, 100);
      gui.add(this.pointLook, 'z', -100, 100);*/


      this._scene = new THREE.Scene();

      this._threejs.shadowMap.enabled = true;
      
      this._light = new THREE.DirectionalLight(0xfff5b6, 0.2);
      this._light.position.set(50, 50, -20);
      this._scene.add(this._light);

      this.controls = new OrbitControls(
          this._camera, document.body);

      this._loaded = false;

      this._BuildRoom();


      //const axesHelper = new THREE.AxesHelper( 5 );
      //this._scene.add( axesHelper );

      this._LoadAnimatedModel()
      this._makeFire();
      this._Interact();
      this._RAF();
      this._threejs.compile(this._scene, this._camera);
      THREE.DefaultLoadingManager.onLoad = function(){
        parent._onFirstLoad()
      };
    }


    _Interact(){
      const parent = this;
      this._loadingScreen = new LoadingScreen();
      this._bubble = new SpeechBubble(
        this._camera, [
          new Message("Herzlich Willkommen!", () => {this._controls.wave()}, false), 
          new Message("Ich bin Falk, </br> der Zahlenzauberer. Ja lol ey. Why not actually?", () => {
            this._controls.spell();
            this._controls.enableControls();
            setTimeout(() => {
              parent._particlesLeft.show();
              parent._particlesRight.show();
            }, 1000)
          }, true)], 
        new THREE.Vector3(0, 5, 0));
    }


    _onFirstLoad(){
      const parent = this;
      if (!this._loaded){
        console.log("onLoad")
        this._loaded = true;
        parent._loadingScreen.remove();
        const coords = { x: parent._camera.position.x, y: parent._camera.position.y, z: parent._camera.position.z, 
          xLook: parent.pointLook.x, yLook: parent.pointLook.y, zLook: parent.pointLook.z };
        new TWEEN.Tween(coords)
        .to({ x: 0, y: 12, z: -20, xLook:0, yLook:12, zLook: 50}, 3000)
        .onComplete(function(){
          parent._bubble.show();
          parent._controls.wave();
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() =>{
          parent._camera.position.set(coords.x, coords.y, coords.z),
          parent._camera.lookAt(coords.xLook, coords.yLook, coords.zLook);
        }
        )
        .delay(700)
        .start();
      }
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


    _makeFire(){
      this._particlesLeft = new ParticleSystem({
        scene: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(44, 0, 44)
      });
      this._particlesRight = new ParticleSystem({
        scene: this._scene,
        camera: this._camera,
        centerPos: new THREE.Vector3(-44, 0, 44)
      });
    }


      //updates the camera and renderer size
      _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        this._bubble.move(new THREE.Vector3(0,5,0));
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

          if (this._controls.isReady()){
            let position = new THREE.Vector3(this._controls.getPosition().x,this._controls.getPosition().y+5, this._controls.getPosition().z);
            this._bubble.move(position);
          }
                    
          this._threejs.render(this._scene, this._camera);
          this._Step(t - this._previousRAF);
          this._previousRAF = t;
          TWEEN.update(t);
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


        if (this._particlesRight.visible&&this._particlesLeft.visible){
          this._particlesLeft.Step(timeElapsedS);
          this._particlesRight.Step(timeElapsedS);
        }
        

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