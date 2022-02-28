import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Constants from './constants.js'
import { Vector3 } from 'three';
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
    _modelInteraction = false;
    _navigationAction = false;


    constructor(world, controls){
        this._world = world;
        this._controls = controls;
        this._renderer = world._threejs;
        this._camera = world._camera;
        this._target = this._controls._target;
        this._raycaster = new THREE.Raycaster();
        this.rotateToDefault();
        this.setRotSpeed(4*Math.PI);
        this.addAllClickActions();
    }

    addAllClickActions(){
        this._bindFuncDouble =  this._onDoubleClick.bind(this);
        this._bindFuncSingle =  this._onSingleClick.bind(this);
        document.body.addEventListener('dblclick', this._bindFuncDouble, false);
        document.body.addEventListener('click', this._bindFuncSingle, false);
    }

    removeAllClickActions(){
        document.body.removeEventListener('dblclick', this._bindFuncDouble, false);
        document.body.removeEventListener('click', this._bindFuncSingle, false);
    }


    _onDoubleClick(){
        this._onClick(40, 'run');
    }

    
    _onSingleClick(){
        this._onClick(25, 'walk');
    }

    activateModelInteraction(){
        this._modelInteraction = true;
    }

    disableModelInteraction(){
        this._modelInteraction = false;
    }

    activateNavInteraction(onFinishPortalClick){
        this._navigationAction = true;
        this._onFinishPortalClick = onFinishPortalClick;
    }

    disableNavInteraction(){
        this._navigationAction = false;
    }

    _onClick(velocity, animationName){
        let intersects;

        if (this._navigationAction || this._modelInteraction){
            Constants.Mouse.x = (event.clientX /  document.body.clientWidth) * 2 -1;
            Constants.Mouse.y = -(event.clientY /  document.body.clientHeight) * 2 +1;
            Constants.Raycaster.setFromCamera(Constants.Mouse, this._world._camera);
        }


        if (this._navigationAction){
            console.log('click');
            intersects = Constants.Raycaster.intersectObjects([this._world.getPortalPlane('Left'), this._world._portalA.getCheckPointMesh()], false);
            if (intersects.length > 0){
                Constants.TweenGroup.ModelMovement.removeAll();
                this.moveToPoint(new THREE.Vector3(Constants.PortalPositions.Left.x, 0, 45), velocity, animationName, this._onFinishPortalClick);
                Constants.curPortal = 'Left';
                return;
            }
            intersects = Constants.Raycaster.intersectObjects([this._world.getPortalPlane('Mid'), this._world._portalB.getCheckPointMesh()], false);
            if (intersects.length > 0){
                Constants.TweenGroup.ModelMovement.removeAll();
                this.moveToPoint(new THREE.Vector3(Constants.PortalPositions.Mid.x, 0, 45), velocity, animationName, this._onFinishPortalClick);
                Constants.curPortal = 'Mid';
                return;
            }
            intersects = Constants.Raycaster.intersectObjects([this._world.getPortalPlane('Right'), this._world._portalC.getCheckPointMesh()], false);
            if (intersects.length > 0){
                Constants.TweenGroup.ModelMovement.removeAll();
                this.moveToPoint(new THREE.Vector3(Constants.PortalPositions.Right.x, 0, 45), velocity, animationName, this._onFinishPortalClick);
                Constants.curPortal = 'Right';
                return;
            }
    
            intersects = Constants.Raycaster.intersectObject(this._world._ground, false);
            if (intersects.length > 0){
                const p = intersects[0].point;
                if (p.z > 44.5){
                    p.z = 44.5;
                }
    
                Constants.TweenGroup.ModelMovement.removeAll();
                this.moveToPoint(p, velocity, animationName, () => {this._controls.idle()});
                return;
            }
        }


        if (this._modelInteraction){
            if (Constants.TweenGroup.ModelMovement.getAll().length == 0 && Constants.TweenGroup.CamMovement.getAll().length == 0 && this._controls.getCurrentState()=='idle'){
                intersects = Constants.Raycaster.intersectObject(this._controls._targetMesh, false);
                if (intersects.length > 0){
                    this._controls.react();
                    return;
                }
            }
        }
    }



    setRotSpeed(rotSpeed){
        this._rotSpeed = rotSpeed;
    }


    rotateToDefault(){
        this._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);;
    }

    rotateToOppositeDefault(){
        this._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);;
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