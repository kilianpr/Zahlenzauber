import { World} from "./index";
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {InteractionBlocks} from './interaction-blocks.js';
import {InteractionFiniteStateMachine} from './interaction-fsm.js';
import {AnimationManager} from './animation-manager.js'
import Constants from './constants';

class Main{

    _world;
    _previousRAF = null;
    _clock;
    _curStatus = 0;
    _interactionBlocks = null;
    _interactionFSM = null;

    constructor(){
        this.main();
    }

    main(){
        const parent = this;
        this._clock = new THREE.Clock();
        this._world = new World();
        this._controls = new AnimationManager(this._world._scene);
        this._world._BuildRoom();
        this._world._makeFire();
        this._AddWindowEventListeners();
        Constants.GeneralLoadingManager.onLoad = function(){
            parent._interactionBlocks = new InteractionBlocks(parent._world, parent._controls);
            parent._interactionFSM = new InteractionFiniteStateMachine(parent._world, parent._interactionBlocks, parent._controls);
            parent._RAF()
            parent._world._threejs.compile(parent._world._scene, parent._world._camera);
            parent._interactionFSM.SetState('transitionIn');
        };
    }


    _RAF(){
        requestAnimationFrame(() => {this._RAF()});
        const delta = this._clock.getDelta();
        if (this._controls.isReady() && this._interactionBlocks){
            let position = new THREE.Vector3(this._controls.getPosition().x,this._controls.getPosition().y+5, this._controls.getPosition().z);
            this._interactionBlocks.move(this._interactionBlocks._wrapper, position);
        }
        this._world._threejs.render(this._world._scene, this._world._camera);
        this._Step(delta);
        TWEEN.update();
        Constants.TweenGroup.Opacity.update();
        Constants.TweenGroup.CamMovement.update();
        Constants.TweenGroup.ModelMovement.update();
    }

    _Step(timeElapsed){
        if (this._controls) {
            this._controls.Update(timeElapsed);
        }
        
        if (this._interactionFSM && this._interactionFSM._clickNavigation){
            this._interactionFSM._clickNavigation.Update(timeElapsed);
        }


        if (this._world._fireRight.visible&&this._world._fireLeft.visible){
            this._world._fireLeft.Step(timeElapsed);
            this._world._fireRight.Step(timeElapsed);
        }
        

        //Null-check supresses error message since _Step may be called before the model is actually loaded causing a NullPointerException
        if (this._world._portalA._animation && this._world._portalB._animation && this._world._portalC._animation){
            if (this._world._portalA._animation.visible && this._world._portalB._animation.visible && this._world._portalC._animation.visible){
                this._world._portalA._animation.Step(timeElapsed);
                this._world._portalB._animation.Step(timeElapsed);
                this._world._portalC._animation.Step(timeElapsed);
            }
        }
        
    }

    _AddWindowEventListeners(){
        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);
        let updateMousePosBind = this._updateMousePosition.bind(this);
        this._world._threejs.domElement.addEventListener('click', updateMousePosBind, false);
        this._world._threejs.domElement.addEventListener('dblclick', updateMousePosBind, false);
    }
    
    _updateMousePosition(event){
        Constants.Mouse.x = (event.clientX / this._world._threejs.domElement.clientWidth) * 2 -1;
        Constants.Mouse.y = -(event.clientY / this._world._threejs.domElement.clientHeight) * 2 +1;
        Constants.Raycaster.setFromCamera(Constants.Mouse, this._world._camera);
    }

    //updates the camera and renderer size
    _OnWindowResize() {
        this._world._camera.aspect = window.innerWidth / window.innerHeight;
        this._world._camera.updateProjectionMatrix();
        this._world._threejs.setSize(window.innerWidth, window.innerHeight);
        this._interactionBlocks.move(this._interactionBlocks._wrapper, new THREE.Vector3(0,7,0));
      }
}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new Main();
});



