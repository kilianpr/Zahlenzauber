import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import wizard2 from '/res/models/wizard.fbx';
import wizard from '/res/models/standingpose.fbx';
import walk from '/res/anim/walk.fbx';
import walkbackwards from '/res/anim/walkbackwards.fbx';
import run from '/res/anim/run.fbx';
import runbackwards from '/res/anim/runbackwards.fbx';
import jump from '/res/anim/jump.fbx';
import wave from '/res/anim/wave.fbx';
import idle2 from '/res/anim/idle2.fbx';
import spell from '/res/anim/spell.fbx';
import turn from '/res/anim/turn.fbx';
import rightturn from '/res/anim/rightturn.fbx';
import leftturn from '/res/anim/leftturn.fbx';

class BasicCharacterControllerProxy {
    constructor(animations, target, input) {
      this._animations = animations;
      this._target = target;
      this._input = input;
    }
  
    get animations() {
      return this._animations;
    }

    get target() {
      return this._target;
    }

    get input() {
      return this._input;
    }
}

class BasicCharacterController {

    constructor(params) {
        this._Init(params);
      }

    _Init(params) {
      this._params = params;
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
  
      this._animations = {};
      this._input = new BasicCharacterControllerInput();
  
      this._LoadModels();
    }

    _LoadModels(){
        const loader = new FBXLoader();
        loader.load(wizard, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
            c.castShadow = true;
            });
            const helper = new THREE.AxesHelper(50);
            helper.material.linewidth = 10;
            fbx.add(helper);
            fbx.linewidth = 3;
            this._target = fbx;
            this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations, this._target, this._input));
            this._target.position.set(0,0,0);
            this._target.rotateY(Math.PI);
            this._params.scene.add(this._target);

            this._mixer = new THREE.AnimationMixer(this._target);

            this._manager = new THREE.LoadingManager();
            this._manager.onLoad = () => {
                this._stateMachine.SetState('idle');
            };

            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);

                this._animations[animName] = {
                    clip: clip,
                    action: action
                };
            };
            
            const loader = new FBXLoader(this._manager);
            loader.load(walk, (a) => {_OnLoad('walk', a);});
            loader.load(walkbackwards, (a) => {_OnLoad('walkbackwards', a);});
            loader.load(idle2, (a) => {_OnLoad('idle', a);});
            loader.load(run, (a) => {_OnLoad('run', a);});
            loader.load(runbackwards, (a) => {_OnLoad('runbackwards', a);});
            loader.load(jump, (a) => {_OnLoad('jump', a);});
            loader.load(wave, (a) => {_OnLoad('wave', a);});
            loader.load(spell, (a) => {_OnLoad('spell', a);});
            loader.load(turn, (a) => {_OnLoad('turn', a);});
            loader.load(rightturn, (a) => {_OnLoad('rightturn', a);});
            loader.load(leftturn, (a) => {_OnLoad('leftturn', a);});
        });
    }


    _setKeysTrue(keys){
      Object.keys(this._input._keys).forEach((key)=>{
        if (keys.includes(key)){
          if (!this._input._keys[key]){
            this._input._keys[key] = true;
          }
        }
        else{
          this._input._keys[key] = false;
        }
      })
    }

    idle(){
      this._setKeysTrue([]);
    }

    walk(){
      this._setKeysTrue(["forward"]);
    }

    run(){
      this._setKeysTrue(["forward", "shift"]);
    }

    walkbackwards(){
      this._setKeysTrue(["backward"]);
    }

    runbackwards(){
      this._setKeysTrue(["backward", "shift"]);
    }

    jump(){
      this._setKeysTrue(["space"]);
    }

    wave(){
      this._setKeysTrue(["wave"]);
    }

    spell(){
      this._setKeysTrue(["spell"]);
    }

    turnRight(){
      this._setKeysTrue(["right"]);
      parent = this;
      setTimeout(function(){
        parent.idle();
      }, 1000)
    }

    turnLeft(){
      this._setKeysTrue(["left"]);
      parent = this;
      setTimeout(function(){
        parent.idle();
      }, 1000)
    }

    turn(angle, callback){
      //returns the time the turn needs
      console.log('in turn function');
      if (angle < 0){
        this._setKeysTrue(["right"]);
      }
      else{
        this._setKeysTrue(["left"]);
      }
      setTimeout(function(){
        parent.idle();
        callback();
      }, (Math.abs(angle)/Math.PI)*1000);
    }

    getPosition(){
      return this._target.position;
    }

    isReady(){
      return (this._target ? true : false);
    }

    enableControls(){
      this._input._startInput();
    }



    Update(timeInSeconds) {
        if (!this._target || !this._stateMachine._currentState) {
          return;
        }
    
        this._stateMachine.Update(timeInSeconds, this._input);

        if (this._mixer) {
          this._mixer.update(timeInSeconds);
        }
    
        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    
        velocity.add(frameDecceleration);
    
        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
    
        const acc = this._acceleration.clone();
  
        if (this._input._keys.shift) {
          acc.multiplyScalar(2.0);
        }
    
        if (this._input._keys.forward) {
          velocity.z += acc.z * timeInSeconds;
        }
        if (this._input._keys.backward) {
          velocity.z -= acc.z * timeInSeconds;
        }
  
        if (this._input._keys.left) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
          _R.multiply(_Q);
        }
        if (this._input._keys.right) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
          _R.multiply(_Q);
        }
  
        controlObject.quaternion.copy(_R);
    
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
    
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
    
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
    
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
    
        controlObject.position.add(forward);
        controlObject.position.add(sideways);
  
        oldPosition.copy(controlObject.position);
      }
}



class BasicCharacterControllerInput {
    constructor() {
      this._Init();    
    }
  
    _Init() {
      this._keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
        wave: false,
        spell: false,
        turn: false
      };
    }



    _startInput(){
      document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
      document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }
  
    _onKeyDown(event) {
      switch (event.code) {
        case "KeyW": // w
        case "ArrowUp": 
          this._keys.forward = true;
          break;
        case "KeyA": // a
        case "ArrowLeft": 
          this._keys.left = true;
          break;
        case "KeyS": // s
        case "ArrowDown": 
          this._keys.backward = true;
          break;
        case "KeyD": // d
        case "ArrowRight": 
          this._keys.right = true;
          break;
        case "Space": // SPACE
          this._keys.space = true;
          break;
        case "ShiftLeft": // SHIFT Left
        case "ShiftRight": //SHIFT Right
          this._keys.shift = true;
          break;
        case "KeyH": // h
          this._keys.wave = true;
          break;
      }
    }
  
    _onKeyUp(event) {
      switch (event.code) {
        case "KeyW": // w
        case "ArrowUp": 
          this._keys.forward = false;
          break;
        case "KeyA": // a
        case "ArrowLeft": 
          this._keys.left = false;
          break;
        case "KeyS": // s
        case "ArrowDown": 
          this._keys.backward = false;
          break;
        case "KeyD": // d
        case "ArrowRight": 
          this._keys.right = false;
          break;
        case "Space": // SPACE
          this._keys.space = false;
          break;
        case "ShiftLeft": // SHIFT Left
        case "ShiftRight": //SHIFT Right
          this._keys.shift = false;
          break;
        case "KeyH": // h
          this._keys.wave = false;
          break;
      }
    }
  }



  class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
    }
  
    _AddState(name, type) {
        this._states[name] = type;
    }
  
    SetState(name) {
        const prevState = this._currentState;
        
        if (prevState) {
        if (prevState.Name == name) {
            return;
        }
        prevState.Exit();
        }
  
        const state = new this._states[name](this);
  
        this._currentState = state;
        console.log(this._currentState.Name);
        state.Enter(prevState);
    }
  
    Update(timeElapsed, input) {
        if (this._currentState) {
        this._currentState.Update(timeElapsed, input);
        }
    }
}


class State {
    constructor(parent) {
        this._parent = parent;
    }

    Enter() {}
    Exit() {}
    Update() {}
}

class CharacterFSM extends FiniteStateMachine {
constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
}

_Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('walkbackwards', WalkbackwardsState);
    this._AddState('run', RunState);
    this._AddState('runbackwards', RunbackwardsState);
    this._AddState('jump', JumpState);
    this._AddState('wave', WaveState);
    this._AddState('spell', SpellState);
    this._AddState('rightturn', RightTurnState);
    this._AddState('leftturn', LeftTurnState);
}
}



class WalkState extends State {
    constructor(parent){
        super(parent);
    }

    get Name() {
        return 'walk';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action;
        if(prevState){
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            
            curAction.enabled = true;
            curAction.time = 0.0;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
            curAction.crossFadeFrom(prevAction, 0.5, true);

        }
        curAction.play();
    }

    Exit() {
    }

    Update(timeElapsed, input){

      if (input._keys.space){
        this._parent.SetState('jump');
      }

      else if(input._keys.forward){
        if(input._keys.shift){
          this._parent.SetState('run');
        }
        return;       
      }

      this._parent.SetState('idle');

    }
}


class WalkbackwardsState extends State {
    constructor(parent){
        super(parent);
    }

    get Name() {
        return 'walkbackwards';
    }

    Enter(prevState){
        const curAction = this._parent._proxy._animations['walkbackwards'].action;
        if (prevState){
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.time = 0.0;
            curAction.enabled = true;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
            curAction.crossFadeFrom(prevAction, 0.5, true);
        }
        curAction.play();

    }

    Exit(){
    }

    Update(timeElapsed, input){

      if (input._keys.space){
        this._parent.SetState('jump');
      }

      if (input._keys.backward){
        if (input._keys.shift){
          this._parent.SetState('runbackwards');
        }
          return;
      }

      this._parent.SetState('idle');
    }
}


class IdleState extends State {
    constructor(parent){
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['idle'].action;
        if (prevState) {
          const prevAction = this._parent._proxy._animations[prevState.Name].action;
          
          curAction.time = 0.0;
          curAction.enabled = true;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
          curAction.crossFadeFrom(prevAction, 0.5, true);
          console.log("cross Fade from")
        }
        curAction.play();

    }

    Exit() {
    }

    Update(timeElapsed, input){
        if (input._keys.forward) {
          this._parent.SetState('walk');
        } else if (input._keys.backward) {
          this._parent.SetState('walkbackwards');
        } else if (input._keys.wave) {
          this._parent.SetState('wave');
        } else if (input._keys.spell){
          this._parent.SetState('spell');
        } else if (input._keys.right){
          this._parent.SetState('rightturn');
        } else if (input._keys.left){
          this._parent.SetState('leftturn');
        } if (input._keys.space){
          this._parent.SetState('jump');
        }
    }
}

class RunState extends State {
  constructor(parent){
      super(parent);
  }

  get Name() {
      return 'run';
  }

  Enter(prevState) {
      const curAction = this._parent._proxy._animations['run'].action;

      if(prevState){
          const prevAction = this._parent._proxy._animations[prevState.Name].action;
          
          curAction.enabled = true;
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
          curAction.crossFadeFrom(prevAction, 0.5, true);

      }
      curAction.play();
  }

  Exit() {
  }

  Update(_, input){

    if (input._keys.space){
      this._parent.SetState('jump');
    }

    else if(input._keys.forward){
      if(!input._keys.shift){
        this._parent.SetState('walk');
      }
        return;       
    }

    else{
      this._parent.SetState('idle');
    }

  }
}



class RunbackwardsState extends State {
  constructor(parent){
      super(parent);
  }

  get Name() {
      return 'runbackwards';
  }

  Enter(prevState) {
      const curAction = this._parent._proxy._animations['runbackwards'].action;
      if(prevState){
          const prevAction = this._parent._proxy._animations[prevState.Name].action;
          
          curAction.enabled = true;
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
          curAction.crossFadeFrom(prevAction, 0.5, true);

      }
      curAction.play();
  }

  Exit() {
  }

  Update(_, input){

      if(input._keys.backward){
        if(!input._keys.shift){
          this._parent.SetState('walkbackwards');
        }
          return;       
      }
      else if (input._keys.space){
        this._parent.SetState('jump');
      }

      else {
        this._parent.SetState('idle');
      }

  }
}


class JumpState extends State{

  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'jump';
  }

  Enter(prevState){
    this.prevState = prevState;
    console.log("jump")
    this._parent._proxy._input._keys.space = false;
    const curAction = this._parent._proxy._animations['jump'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    if (this._parent._proxy._input._keys.forward){
      if(this._parent._proxy._input._keys.shift){
        this._parent.SetState('run');
        return;
      }
      this._parent.SetState('walk');
    } else if (this._parent._proxy._input._keys.backward){
        if(this._parent._proxy._input._keys.shift){
          this._parent.SetState('runbackwards');
          return;
        }
      this._parent.SetState('walkbackwards');
    } else if (this._parent._proxy._input._keys.right){
      this._parent.SetState('rightturn');
    } else if (this._parent._proxy._input._keys.left){
      this._parent.SetState('leftturn');
    }
    else{
      this._parent.SetState('idle');
    }
  }

  _Cleanup() {
    const action = this._parent._proxy._animations['jump'].action;
    
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
  }

  Update(_){

  }
}


class WaveState extends State{
  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'wave';
  }

  Enter(prevState){
    this._parent._proxy._input._keys.wave = false;
    const curAction = this._parent._proxy._animations['wave'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 1, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    if (this._parent._proxy._input._keys.forward){
      if(this._parent._proxy._input._keys.shift){
        this._parent.SetState('run');
        return;
      }
      this._parent.SetState('walk');
    } else if (this._parent._proxy._input._keys.backward){
        if(this._parent._proxy._input._keys.shift){
          this._parent.SetState('runbackwards');
          return;
        }
      this._parent.SetState('walkbackwards');
    }
    else{
      this._parent.SetState('idle');
    }
  }

  _Cleanup() {
    console.log("wave finished")
    const action = this._parent._proxy._animations['wave'].action;
    
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
  }

  Update(_){

  }

}


class SpellState extends State{

  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'spell';
  }

  Enter(prevState){
    this._parent._proxy._input._keys.spell = false;
    const curAction = this._parent._proxy._animations['spell'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 1, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    if (this._parent._proxy._input._keys.forward){
      if(this._parent._proxy._input._keys.shift){
        this._parent.SetState('run');
        return;
      }
      this._parent.SetState('walk');
    } else if (this._parent._proxy._input._keys.backward){
        if(this._parent._proxy._input._keys.shift){
          this._parent.SetState('runbackwards');
          return;
        }
      this._parent.SetState('walkbackwards');
    }
    else{
      this._parent.SetState('idle');
    }
  }

  _Cleanup() {
    const action = this._parent._proxy._animations['spell'].action;
    
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
  }

  Update(_){

  }
}

class RightTurnState extends State{
  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'rightturn';
  }

  Enter(prevState){
    const curAction = this._parent._proxy._animations['rightturn'].action;
    if(prevState){
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        
        curAction.enabled = true;
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
        curAction.crossFadeFrom(prevAction, 0.1, true);

    }
    curAction.play();
  }

  Update(timeElapsed, input){
    if (input._keys.space){
      this._parent.SetState('jump');
    } else if(input._keys.forward) {
      this._parent.SetState('walk');
    } else if (input._keys.backward) {
      this._parent.SetState('walkbackwards');
    } else if (input._keys.wave) {
      this._parent.SetState('wave');
    } else if (input._keys.spell){
      this._parent.SetState('spell');
    } else if (input._keys.left){
      this._parent.SetState('leftturn')
    } else if (input._keys.right){
      return;
    } else{
      this._parent.SetState('idle');
    }
  }
}


class LeftTurnState extends State{
  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'leftturn';
  }

  Enter(prevState){
    const curAction = this._parent._proxy._animations['leftturn'].action;
    if(prevState){
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        
        curAction.enabled = true;
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
        curAction.crossFadeFrom(prevAction, 0.2, true);

    }
    curAction.play();
  }

  Update(timeElapsed, input){
    if (input._keys.space){
      this._parent.SetState('jump');
    } else if (input._keys.forward) {
      this._parent.SetState('walk');
    } else if (input._keys.backward) {
      this._parent.SetState('walkbackwards');
    } else if (input._keys.wave) {
      this._parent.SetState('wave');
    } else if (input._keys.spell){
      this._parent.SetState('spell');
    } else if (input._keys.right){
      this._parent.SetState('rightturn')
    } else if (input._keys.left){
      return;
    }
    this._parent.SetState('idle');
}
}


export {BasicCharacterController};





  

