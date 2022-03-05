import * as THREE from 'three';
import {InteractionBlocks} from './interaction-blocks.js';
import {InteractionFiniteStateMachine} from './interaction-fsm.js';
import Constants from './constants';
import { AnimatedBackground } from "./subpages/background.js";
import { AnimatedRoom } from './animated-room.js';
import {Transition} from './transition.js';

import '/src/styles.css';
import '/src/subpages/substyles.css';
import '/res/fonts/Lora.ttf';
class Main{

    _renderer;
    _clock;
    _animatedRoom;
    _animatedBackground;
    _transition;

    _interactionBlocks = null;
    _interactionFSM = null;


    constructor(){
        this.main();
    }

    main(){
        Constants.isOnMobile = this._isUserOnMobile();

        const parent = this;

        this._renderer =new THREE.WebGLRenderer({
            antialias: true,
        });
        this._renderer.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.domElement.setAttribute('id', 'renderer');
        this._renderer.domElement.style.opacity = 0;
        document.body.appendChild(this._renderer.domElement);

        this._clock = new THREE.Clock();

        this._animatedRoom = new AnimatedRoom(this._renderer);
        this._animatedBackground = new AnimatedBackground(this._renderer);
        this._transition = new Transition(this._animatedRoom, this._animatedBackground, this._renderer);

        this._AddWindowEventListeners();
        Constants.GeneralLoadingManager.onLoad = function(){
            parent._interactionBlocks = new InteractionBlocks(parent._animatedRoom);
            parent._interactionFSM = new InteractionFiniteStateMachine(parent._interactionBlocks, parent._animatedRoom, parent._animatedBackground, parent._transition);
            parent._renderer.compile(parent._animatedRoom._world._scene, parent._animatedRoom._world._camera);
            parent._animate();
            parent._interactionFSM.SetState('prereqFullscreen');
        };
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
        Constants.Raycaster.setFromCamera(Constants.Mouse, this._animatedRoom._world._camera);
    }

    //updates the camera and renderer size
    _OnWindowResize() {
        if (this._animatedRoom){
            this._animatedRoom._world._camera.aspect = window.innerWidth / window.innerHeight;
            this._animatedRoom._world._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
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

    _animate(){
        requestAnimationFrame(() => {this._animate();});
        this._transition.render(this._clock.getDelta());
    }
}



let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new Main();
});

export{_APP}



