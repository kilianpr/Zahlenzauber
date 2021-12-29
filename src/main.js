import { World} from "./index";
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {InteractionBlocks} from './interaction-blocks';
import {InteractionFiniteStateMachine} from './interaction-fsm';

class Main{

    _world;
    _previousRAF;
    _curStatus = 0;

    constructor(){
        this.main();
    }

    main(){
        const parent = this;
        this._world = new World();
        this._world._BuildRoom();
        this._world._LoadAnimatedModel()
        this._world._makeFire();
        this._interactionBlocks = new InteractionBlocks(this._world);
        this._interactionFSM = new InteractionFiniteStateMachine(this._world, this._interactionBlocks);
        this._RAF();
        this._world._threejs.compile(this._world._scene, this._world._camera);
        window.addEventListener('resize', () => { //resizes renderer on Resize
            this._OnWindowResize();
        }, false);
        THREE.DefaultLoadingManager.onLoad = function(){
            parent._interactionFSM.SetState('transitionIn');
        };
    }


    _RAF(){
        requestAnimationFrame((t) => {
            const parent = this;
            if (this._previousRAF === null) {
              this._previousRAF = t;
            }
            this._RAF();
    
            if (this._world._controls.isReady()){
              let position = new THREE.Vector3(this._world._controls.getPosition().x,this._world._controls.getPosition().y+5, this._world._controls.getPosition().z);
              parent._interactionBlocks.move(this._interactionBlocks._wrapper, position);
            }
                      
            this._world._threejs.render(this._world._scene, this._world._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
            TWEEN.update(t);
          });
    }

    _Step(timeElapsed){
        const timeElapsedS = timeElapsed * 0.001;
  
        if (this._world._controls) {
            this._world._controls.Update(timeElapsedS);
        }


        if (this._world._fireRight.visible&&this._world._fireLeft.visible){
            this._world._fireLeft.Step(timeElapsedS);
            this._world._fireRight.Step(timeElapsedS);
        }
        

        //Null-check supresses error message since _Step may be called before the model is actually loaded causing a NullPointerException
        if (this._world._portalA._animation && this._world._portalB._animation && this._world._portalC._animation){
            if (this._world._portalA._animation.visible && this._world._portalB._animation.visible && this._world._portalC._animation.visible){
                this._world._portalA._animation.Step(timeElapsedS);
                this._world._portalB._animation.Step(timeElapsedS);
                this._world._portalC._animation.Step(timeElapsedS);
            }
        }
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



