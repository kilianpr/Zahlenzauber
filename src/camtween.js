import * as TWEEN from '@tweenjs/tween.js';

class CamTween{
    constructor(world, toPos, toLook, duration){
        this._world = world;
        this._toPos = toPos;
        this._toLook = toLook;
        this._duration = duration;
        this._initCoords();
    }

    _initCoords(){
        this._coords = { x: this._world._camera.position.x, y: this._world._camera.position.y, z: this._world._camera.position.z, 
            xLook: this._world._cameraLook.x, yLook: this._world._cameraLook.y, zLook: this._world._cameraLook.z };
    }

    getTween(){
        this._world._cameraLook = this._toLook;
        const parent = this;
          return new TWEEN.Tween(this._coords)
          .to({ x: this._toPos.x, y: this._toPos.y, z: this._toPos.z, xLook: this._toLook.x, yLook: this._toLook.y, zLook: this._toLook.z}, this._duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(() =>{
            parent._world._camera.position.set(this._coords.x, this._coords.y, this._coords.z),
            parent._world._camera.lookAt(this._coords.xLook, this._coords.yLook, this._coords.zLook);
            }
          )
    }
}

export{CamTween}