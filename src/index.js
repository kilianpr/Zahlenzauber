import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';

import '/src/base.css';
import portal from '/res/room/portalwoinside.fbx';


class World{

    constructor(){
        this._Initialize();
    }

    _Initialize(){

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
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(0, 40, -31);
        this._camera.lookAt(0, 30, 50);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight();
        light.target.position.set(0, 50, 50);
        this._scene.add(light);
        this._scene.add(light.target);

        light = new THREE.AmbientLight(0xFFFFFF, 0.25);
        this._scene.add(light);


        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        this._BuildRoom();
        this._RAF();

    }


    //builds a room with 4 walls
    _BuildRoom(){
        const planeGeo = new THREE.PlaneGeometry(100, 100)
        const ground = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x808080,
              }));
        ground.castShadow = false;
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;
        this._scene.add(ground);


        const wall1 = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x070722,
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


        const loader = new FBXLoader();
        let _scene = this._scene;
        loader.load(portal, function(obj){
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            _scene.add(obj);
        }, undefined, function ( error ) {

          console.error( error );
        
        });

      }


      //updates the camera and renderer size
      _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
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
      }

}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});