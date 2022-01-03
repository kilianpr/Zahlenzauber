import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';


class DoubleClickNavigation{
    _ground;
    _renderer;
    _camera;
    _target;
    _controls;
    _raycaster;
    _velocity;
    _targetQuaternion;

    constructor(world, velocity, controls){
        this._ground = world._ground;
        this._controls = controls;
        this._renderer = world._threejs;
        this._camera = world._camera;
        this._target = this._controls._target;
        this._raycaster = new THREE.Raycaster();
        this._velocity = velocity;
        this._targetQuaternion = new THREE.Quaternion();
    }

    addDoubleClickAction(){
        const parent = this;
        this._renderer.domElement.addEventListener('dblclick', (e) => {this._onDoubleClick(e)}, false);
    }

    _onDoubleClick(event){
        console.log('dblclick clicked')
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

            const rotationMatrix = new THREE.Matrix4()
            rotationMatrix.lookAt(p, this._target.position, this._target.up)
            this._targetQuaternion.setFromRotationMatrix(rotationMatrix)
            //this._controller._stateMachine.SetState('turnright');
            //this._target.quaternion.rotateTowards(this._targetQuaternion, 1);
            /*var callback = () => {
                console.log('in callback function');
                new TWEEN.Tween(this._target.position)
                .to({
                    x: p.x,
                    y: p.y,
                    z: p.z
                }, (2000/this._velocity)*distance)
                .start()
                .onComplete(() => {
                    this._controller.spell();
                })
            }
            this._controller.turn(angle, callback)*/         

         }
        }

    setVelocity(velocity){
        this._velocity = velocity;
    }

    Update(timeInSeconds){
        if (!this._target.quaternion.equals(this._targetQuaternion)) {
            this._target.quaternion.rotateTowards(
                this._targetQuaternion,
                timeInSeconds * 10
            )
        }
    }

}


export{DoubleClickNavigation}