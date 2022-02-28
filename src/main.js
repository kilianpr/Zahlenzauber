import { World} from "./index.js";
import * as THREE from 'three';
import '/src/styles.css';
import '/src/subpages/substyles.css';
import '/res/fonts/Lora.ttf';
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
        Constants.isOnMobile = this._isUserOnMobile();
        console.log("User on mobile" + Constants.isOnMobile);
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
            parent._interactionFSM.SetState('prereqFullscreen');
        };
    }


    _RAF(){
        requestAnimationFrame(() => {this._RAF()});
        const delta = this._clock.getDelta();
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
        window.addEventListener('focus', () =>{
            setTimeout(() =>{
                this._interactionBlocks.move(this._interactionBlocks._wrapper._element, new THREE.Vector3(0,5,0));
            }, 1000);
        }, true);
        let updateMousePosBind = this._updateMousePosition.bind(this);
        document.body.addEventListener('click', updateMousePosBind, false);
        document.body.addEventListener('dblclick', updateMousePosBind, false);
    }
    
    _updateMousePosition(event){
        Constants.Mouse.x = (event.clientX /  document.body.clientWidth) * 2 -1;
        Constants.Mouse.y = -(event.clientY /  document.body.clientHeight) * 2 +1;
        Constants.Raycaster.setFromCamera(Constants.Mouse, this._world._camera);
    }

    //updates the camera and renderer size
    _OnWindowResize() {
        if (this._world){
            this._world._camera.aspect = window.innerWidth / window.innerHeight;
            this._world._camera.updateProjectionMatrix();
            this._world._threejs.setSize(window.innerWidth, window.innerHeight);
        }
        if (this._interactionBlocks){
            this._interactionBlocks.move(this._interactionBlocks._wrapper._element, new THREE.Vector3(0,5,0));
        }
      }

    _isUserOnMobile(){
        var UA = navigator.userAgent;
        return(
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new Main();
});



