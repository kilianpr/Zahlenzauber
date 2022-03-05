import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { World} from "./index.js";
import {AnimationManager} from './animation-manager.js';
import Constants from './constants';
import {ClickNavigation} from './clicknav.js';




class AnimatedRoom{
    _world;
    _controls;
    _renderer;
    _clickNavigation;
    _fbo;

    constructor(renderer){
        this._renderer = renderer;
        this._Init();
    }

    _Init(){
        this._world = new World();
        this._world._BuildRoom();
        this._world._makeFire();
        this._controls = new AnimationManager(this._world._scene);
        this._clickNavigation = new ClickNavigation(this._world, this._controls);
        let renderTargetParameters = { encoding: THREE.sRGBEncoding};
	    this._fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
    }

    render(delta, alone){
        //console.log('render Room');
        this._Step(delta);
        TWEEN.update();
        Constants.TweenGroup.Opacity.update();
        Constants.TweenGroup.CamMovement.update();
        Constants.TweenGroup.ModelMovement.update();
        
        if (alone){
            this._renderer.setRenderTarget(this._fbo);
            this._renderer.clear();
            this._renderer.render( this._world._scene, this._world._camera);
        }
        else{
            this._renderer.setRenderTarget(null);
            this._renderer.render( this._world._scene, this._world._camera);
        }
    }

    _Step(timeElapsed){
        if (this._controls) {
            this._controls.Update(timeElapsed);
        }
        
        if (this._clickNavigation){
            this._clickNavigation.Update(timeElapsed);
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
}

export{AnimatedRoom}