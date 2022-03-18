import * as THREE from 'three';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Fire} from './particles.js';
import {Portal} from './portal.js';
import Constants from './constants.js';

import bricksText from '/res/room/bricks.png';
import floorText from '/res/room/woodenfloor.png';
import Logo from '/res/icons/logo.png';



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
  _ground; //ground of the room


    constructor(){
        this._Initialize();
    }

    _Initialize(){
      /*this._threejs = new THREE.WebGLRenderer({
          antialias: true,
      });
      this._threejs.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
      
      this._threejs.domElement.setAttribute('id', 'main-renderer');
      this._threejs.domElement.style.opacity = 0;
      document.body.appendChild(this._threejs.domElement);*/
      
      const fov = 60;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(0, 140, -10);
      this._cameraLook = {x: 0, y:0, z:0}
      this._camera.lookAt(this._cameraLook.x, this._cameraLook.y, this._cameraLook.z);
      this._camera.updateWorldMatrix( true, false );
      this._scene = new THREE.Scene();
      
      this._light = new THREE.AmbientLight(0xFCF9D9, .4);
      this._scene.add(this._light);

      /*const orbitControls = new OrbitControls(
          this._camera, document.body)*/
    }


    //builds a room with 4 walls
    _BuildRoom(){

        const textLoader = new THREE.TextureLoader(Constants.GeneralLoadingManager);
        const floor = textLoader.load(floorText);
        floor.wrapS = THREE.RepeatWrapping;
        floor.wrapT = THREE.RepeatWrapping;
        floor.repeat.set( 2, 2 );

        const planeGeo = new THREE.PlaneGeometry(100, 100)
        this._ground = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x808080,
                map: floor
              }));
        this._ground.castShadow = false;
        this._ground.receiveShadow = false;
        this._ground.rotation.x = -Math.PI / 2;
        this._ground.name = "ground";
        this._scene.add(this._ground);

        const bricks = textLoader.load(bricksText);
        bricks.wrapS = THREE.RepeatWrapping;
        bricks.wrapT = THREE.RepeatWrapping;
        bricks.repeat.set( 1, 1 );

        const wall1 = new THREE.Mesh(
            planeGeo,
            new THREE.MeshStandardMaterial({
                color: 0x3c81da,
                map: bricks
              }));
        wall1.rotation.x = 0;
        wall1.rotation.y = -Math.PI /2;
        this._scene.add(wall1);
        wall1.position.set(50, 50, 0);
        wall1.name = "wall1";


        const wall2 = wall1.clone();
        wall2.rotation.y = Math.PI /2;
        this._scene.add(wall2);
        wall2.position.set(-50, 50, 0);
        wall1.name = "wall2";


        const wall3 = wall1.clone();
        wall3.rotation.y = Math.PI;
        this._scene.add(wall3);
        wall3.position.set(0, 50, 50);
        wall1.name = "wall3";


        const wall4 = wall1.clone();
        wall4.rotation.y = 0;
        this._scene.add(wall4);
        wall4.position.set(0, 50, -50);
        wall1.name = "wall4";

        const logoGeometry = new THREE.PlaneGeometry(20, 11.25);
        const logoMaterial = new THREE.MeshBasicMaterial({map: textLoader.load(Logo)});
        this._logo = new THREE.Mesh(logoGeometry, logoMaterial);
        this._logo.position.set(0, 40, 49);
        this._logo.rotateY(Math.PI);
        this._scene.add(this._logo);

        this._portalA = new Portal(this, 20, Constants.PortalPositions.Left, 'Übungen');
        this._portalB = new Portal(this, 20, Constants.PortalPositions.Mid, 'Videos');
        this._portalC = new Portal(this, 20, Constants.PortalPositions.Right, 'About');
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

    getPortalPlane(portal){
      switch(portal){
        case 'Left': return this._portalA._animation._plane;
        case 'Mid': return this._portalB._animation._plane; 
        case 'Right': return this._portalC._animation._plane;
      }
    }    
}

export{World};