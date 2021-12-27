import { SpeechBubble, Message, LoadingScreen } from "./welcome";
import { World} from "./index";
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

class Main{

    _world;
    _previousRAF;

    constructor(){
        this.main();
    }

    main(){
        const parent = this;
        this._world = new World();
        this._world._BuildRoom();
        this._world._LoadAnimatedModel()
        this._world._makeFire();
        this._Interact();
        this._RAF();
        this._world._threejs.compile(this._world._scene, this._world._camera);
        window.addEventListener('resize', () => { //resizes renderer on Resize
            this._OnWindowResize();
        }, false);
        THREE.DefaultLoadingManager.onLoad = function(){
            parent._tweenEntry();
        };
    }

    _Interact(){
        this._loadingScreen = new LoadingScreen();
        this._speechBubble = new SpeechBubble(this._world._camera, new THREE.Vector3(0, 5, 0));
        let message1 = new Message("Herzlich Willkommen!", () => {this._world._controls.wave()}, false, true, false);
        let message2 = new Message("Ich bin Merlin, </br> der Zahlenzauberer.", () => {
                        this._world._controls.spell();
                        this._world._controls.enableControls();
                        setTimeout(() => {
                            this._world._fireLeft.show();
                            this._world._fireRight.show();
                            this._world._portalA.showAnimation();
                            this._world._portalB.showAnimation();
                            this._world._portalC.showAnimation();
                        }, 1000)
                    }, true);
        let message3 = new Message("Klicke auf Start um loszulegen", () => {
                        const coords = { x: this._world._camera.position.x, y: this._world._camera.position.y, z: this._world._camera.position.z,
                                        xLook:0, yLook:12, zLook: 50};
                        new TWEEN.Tween(coords)
                        .to({ x: 30, y: 30, z: -40, xlook: 0, ylook: 12, zLook: 50}, 3000)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() =>{
                            this._world._camera.position.set(coords.x, coords.y, coords.z)
                            this._world._camera.lookAt(coords.xLook, coords.yLook, coords.zLook);
                            this._speechBubble.remove();
                        })
                        .delay(700)
                        .start();
                        }, false)
        this._speechBubble.addMessage(message1);
        this._speechBubble.addMessage(message2);
        this._speechBubble.addMessage(message3);
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
              parent._speechBubble.move(position);
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

    _tweenEntry(){
        const parent = this;
        console.log("onLoad")
        this._loadingScreen.remove();
        const coords = { x: this._world._camera.position.x, y: this._world._camera.position.y, z: this._world._camera.position.z, 
          xLook: this._world._cameraLook.x, yLook: this._world._cameraLook.y, zLook: this._world._cameraLook.z };
        new TWEEN.Tween(coords)
        .to({ x: 0, y: 12, z: -20, xLook:0, yLook:12, zLook: 50}, 3000)
        .onComplete(function(){
          parent._speechBubble.show();
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() =>{
          parent._world._camera.position.set(coords.x, coords.y, coords.z),
          parent._world._camera.lookAt(coords.xLook, coords.yLook, coords.zLook);
        }
        )
        .delay(700)
        .start();
      }

    //updates the camera and renderer size
    _OnWindowResize() {
        this._world._camera.aspect = window.innerWidth / window.innerHeight;
        this._world._camera.updateProjectionMatrix();
        this._world._threejs.setSize(window.innerWidth, window.innerHeight);
        this._speechBubble.move(new THREE.Vector3(0,5,0));
      }
}

let _APP = null;
  
window.addEventListener('DOMContentLoaded', () => {
    _APP = new Main();
});



