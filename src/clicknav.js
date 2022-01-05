import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Constants from './constants.js'
TWEEN.Easing.myCustom = {};
TWEEN.Easing.myCustom.myEasingOut = function(k){
    var t = (k*100);
    var d = 100;
    var ts=(t/=d)*t;
    var tc=ts*t;
    return (-0.15000000000000036*tc*ts + 1.2*ts*ts + -2.7*tc + 2.4*ts + 0.25*t);
}

class ClickNavigation{
    _ground;
    _renderer;
    _camera;
    _target;
    _controls;
    _raycaster;
    _velocity;
    _targetQuaternion;
    _rotSpeed;


    constructor(world, controls){
        this._ground = world._ground;
        this._controls = controls;
        this._renderer = world._threejs;
        this._camera = world._camera;
        this._target = this._controls._target;
        this._raycaster = new THREE.Raycaster();
        this.rotateToDefault();
        this.setRotSpeed(4*Math.PI);
    }

    addClickActions(){
        this._bindFuncDouble =  this._onDoubleClick.bind(this);
        this._bindFuncSingle =  this._onSingleClick.bind(this);
        this._renderer.domElement.addEventListener('dblclick', this._bindFuncDouble, false);
        this._renderer.domElement.addEventListener('click', this._bindFuncSingle, false);
    }

    removeClickActions(){
        this._renderer.domElement.removeEventListener('dblclick', this._bindFuncDouble, false);
        this._renderer.domElement.removeEventListener('click', this._bindFuncSingle, false);
    }


    _onDoubleClick(){
        this._onClick(40, 'run');
    }

    
    _onSingleClick(){
        this._onClick(25, 'walk');
    }

    _onClick(velocity, animationName){
        const intersects = Constants.Raycaster.intersectObject(this._ground, false);
        if (intersects.length > 0){
            const p = intersects[0].point;
            if (p.z > 44.5){
                p.z = 44.5;
            }
            Constants.TweenGroup.ModelMovement.removeAll();
            this.moveToPoint(p, velocity, animationName, () => {this._controls.idle()});
            }
    }


        


    setRotSpeed(rotSpeed){
        this._rotSpeed = rotSpeed;
    }


    rotateToDefault(){
        this._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);;
    }

    moveToPoint(p, velocity, animationName, onFinish){
        const distance = this._target.position.distanceTo(p)
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(p, this._target.position, this._target.up);
        this._targetQuaternion.setFromRotationMatrix(rotationMatrix);
        if (animationName=='walk'){
            this._controls.walk();
        }
        else if (animationName == 'run'){
            this._controls.run();
        }
        new TWEEN.Tween(this._target.position, Constants.TweenGroup.ModelMovement)
        .to({
            x: p.x,
            y: p.y,
            z: p.z
        }, (2000/velocity)*distance)
        .easing(TWEEN.Easing.myCustom.myEasingOut)
        .onComplete(() => {
            onFinish();
        })
        .start();
    }


    Update(timeInSeconds){
        if (!this._target.quaternion.equals(this._targetQuaternion)) {
            this._target.quaternion.rotateTowards(
                this._targetQuaternion,
                timeInSeconds * (this._rotSpeed)
            )
        }
    }
}


export{ClickNavigation}