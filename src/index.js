import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {ParticleSystem, PortalParticles} from './particles.js';

import '/src/base.css';
import portal from '/res/room/portal.obj';
import stoneText from '/res/room/stonetext.jpg';
import smoke from '/res/room/smoke.png';
import { Box3 } from 'three';



class World{


    constructor(){
        this._Initialize();
    }

    _Initialize(){

      const gui = new dat.GUI();

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
        this._camera.position.set(47, 36, -29);
        this.pointLook = {x: -31, y: 8, z:53.5}
        this._camera.lookAt(this.pointLook.x, this.pointLook.y, this.pointLook.z);
        console.log(this._camera)


        /*gui.add(this._camera.position, 'x', -100, 100);
        gui.add(this._camera.position, 'y', -100, 100);
        gui.add(this._camera.position, 'z', -100, 100);
        gui.add(this.pointLook, 'x', -100, 100);
        gui.add(this.pointLook, 'y', -100, 100);
        gui.add(this.pointLook, 'z', -100, 100);*/


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
        this._BuildPortal(0, 0, 50, 20);
        this._BuildPortal(25, 0, 50, 20);
        this._BuildPortal(-25, 0, 50, 20);
      }


      _BuildPortal(positionX, positionY, positionZ, width){
        const parent = this;
        const objLoader = new OBJLoader();
        const textLoader = new THREE.TextureLoader();
        objLoader.load(portal, function(obj){
            var texture = textLoader.load(stoneText);
            var mat = new THREE.MeshStandardMaterial({map:texture});
            obj["children"][0].material = mat;
            obj.position.set(positionX, positionY, positionZ);
            obj.rotation.y = Math.PI/2;
            var box = new THREE.Box3().setFromObject(obj);
            let initWidth = box.max.x - box.min.x;
            if (Math.round(initWidth) !== width){
              obj.scale.set(width/initWidth, width/initWidth, width/initWidth);
            }
            var box = new THREE.Box3().setFromObject(obj);
            const helper = new THREE.Box3Helper( box, 0xffff00 );
            parent._scene.add( helper );
            let height = 0.9*(box.max.y - box.min.y);
            console.log(height, width);
            let plane = new PortalParticles(parent, 0.75*width, height, positionX, positionY+height/2, positionZ-0.2)
            parent._scene.add(obj);
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

        this._particlesLeft.Step(timeElapsedS);
        this._particlesRight.Step(timeElapsedS);
      }

}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});