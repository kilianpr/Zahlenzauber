import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
TWEEN.Easing.myCustom = {};
TWEEN.Easing.myCustom.myEasingOut = function(k){
    var t = (k*100);
    var d = 100;
    var ts=(t/=d)*t;
    var tc=ts*t;
    return (-0.15000000000000036*tc*ts + 1.2*ts*ts + -2.7*tc + 2.4*ts + 0.25*t);
}

class DoubleClickNavigation{
    _ground;
    _renderer;
    _camera;
    _target;
    _controls;
    _raycaster;
    _velocity;
    _targetQuaternion;
    _rotSpeed;


    constructor(world, velocity, controls){
        this._ground = world._ground;
        this._controls = controls;
        this._renderer = world._threejs;
        this._camera = world._camera;
        this._target = this._controls._target;
        this._raycaster = new THREE.Raycaster();
        this._velocity = velocity;
        this.rotateToDefault();
        this.setRotSpeed(4*Math.PI);
    }

    addDoubleClickAction(){
        this._renderer.domElement.addEventListener('dblclick', (e) => {this._onDoubleClick(e)}, false);
    }

    removeDoubleClickAction(){
        this._renderer.domElement.removeEventListener('dblclick', (e) => {this._onDoubleClick(e)}, false);
    }

    _onDoubleClick(event){
        const mouse = {
            x: (event.clientX / this._renderer.domElement.clientWidth) * 2 -1,
            y: -(event.clientY / this._renderer.domElement.clientHeight) * 2 +1
        }
        this._raycaster.setFromCamera(mouse, this._camera);

        const intersects = this._raycaster.intersectObject(this._ground, false);
        if (intersects.length > 0){

            const p = intersects[0].point;
            const distance = this._target.position.distanceTo(p)

            TWEEN.removeAll();

            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.lookAt(p, this._target.position, this._target.up);
            this._targetQuaternion.setFromRotationMatrix(rotationMatrix);
            const angle = this._target.quaternion.angleTo(this._targetQuaternion);
            console.log('angle: '+angle);
            this._controls.walk();
            new TWEEN.Tween(this._target.position)
            .to({
                x: p.x,
                y: p.y,
                z: p.z
            }, (2000/this._velocity)*distance)
            .easing(TWEEN.Easing.myCustom.myEasingOut)
            .onComplete(() => {
                this._controls.idle();
            })
            .start();
         }
        }

    setVelocity(velocity){
        this._velocity = velocity;
    }

    setRotSpeed(rotSpeed){
        this._rotSpeed = rotSpeed;
    }


    Update(timeInSeconds){
        if (!this._target.quaternion.equals(this._targetQuaternion)) {
            this._isTurning = true;
            this._target.quaternion.rotateTowards(
                this._targetQuaternion,
                timeInSeconds * (this._rotSpeed)
            )
        } else{
            this._isTurning = false;
        }
    }

    rotateToDefault(){
        this._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);;
    }

}


export{DoubleClickNavigation}