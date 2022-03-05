import * as THREE from 'three';
import Constants from './constants.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import wizardGLTF from '/res/anim/wizardCompressedFINAL.glb';

class AnimationManager{
    _animations; //dict to store all the animations in the form of {animName : {clip: clip , action: action}}
    _target; // gltf.scene model
    _targetMesh; //mesh of the gltf.scene model
    _scence;
    _stateMachine;
    _mixer;

  constructor(scene){
    this._animations = {};
    this._scene = scene;
    this._LoadModelsGLTF();
  }


    _LoadModelsGLTF(){
      const loader = new GLTFLoader(Constants.GeneralLoadingManager);
      loader.load(wizardGLTF, ( gltf ) => {
        gltf.scene.scale.setScalar(10);
        this._target = gltf.scene;
        let nullSphere = new THREE.Sphere(undefined, Infinity);
        this._target.traverse( (object) => {
          if (object.isMesh) {
            //object.castShadow = true;
            object.geometry.boundingSphere = nullSphere; //in order for the raycaster to detect clicks on the target
            object.geometry.boundingBox = null;
            this._targetMesh = object;
          }
          object.frustumCulled = false; //in order to make the wizard render in all positions
        });
        this._target.name = "Merlin";
        this._stateMachine = new CharacterFSM(this._animations, this._target);
        this._target.position.set(0,0,0);
        this._target.rotateY(Math.PI);
        this._scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        const _OnLoad = (animName, anim) => {
          const clip = anim;
          const action = this._mixer.clipAction(clip);

          //console.log('loaded:' + animName)
          this._animations[animName] = {
              clip: clip,
              action: action
          };
      };

        const animations = gltf.animations;
        _OnLoad('backflip', animations[0]);
        _OnLoad('dance1', animations[1]);
        _OnLoad('dance2', animations[2]);
        _OnLoad('dive', animations[3]);
        _OnLoad('gangnam', animations[4]);
        _OnLoad('idle', animations[5]);
        _OnLoad('idle2', animations[6]);
        _OnLoad('jabcross', animations[7]);
        _OnLoad('jump', animations[8]);
        _OnLoad('leftturn', animations[9]);
        _OnLoad('reaction', animations[10]);
        _OnLoad('rightturn', animations[11]);
        _OnLoad('run', animations[12]);
        _OnLoad('runbackwards', animations[13]);
        _OnLoad('spell', animations[14]);
        _OnLoad('walk', animations[15]);
        _OnLoad('walkbackwards', animations[16]);
        _OnLoad('wave', animations[17]);
      })
    }

    idle(){
        this._stateMachine.SetState('idle');
    }
  
    walk(){
        this._stateMachine.SetState('walk');
    }

    run(){
        this._stateMachine.SetState('run');
    }

    walkbackwards(){
        this._stateMachine.SetState('walkbackwards');
    }

    runbackwards(){
        this._stateMachine.SetState('runbackwards');
    }

    jump(){//sets stateMachine back to idle when finished
        this._stateMachine.SetState('jump');
    }

    wave(){//sets stateMachine back to idle when finished
        this._stateMachine.SetState('wave');
    }

    spell(){//sets stateMachine back to idle when finished
        this._stateMachine.SetState('spell');
    }

    turnRight(){
        this._stateMachine.SetState('rightturn');
    }

    turnLeft(){
        this._stateMachine.SetState('leftturn');
    }

    react(){
        this._stateMachine.SetState('react');
    }

    dive(){
        this._stateMachine.SetState('dive');
    }

    getPosition(){
        return this._target.position;
    }

    isReady(){
        return (this._target && this._stateMachine._currentState ? true : false);
    }

    getCurrentState(){
      if (this._stateMachine._currentState != null){
        return this._stateMachine._currentState.Name;
      }
      else {
        return null;
      }
    }

    Update(timeInSeconds) {
        if (!this.isReady()) {
            return;
        }

        if (this._mixer) {
            this._mixer.update(timeInSeconds);
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
          if (prevState.Name == name || prevState.name == 'backflip') {
              return;
          }
          prevState.Exit();
        }

        const state = new this._states[name](this);

        this._currentState = state;
        state.Enter(prevState);
    }
}


class State {
    constructor(parent) {
        this._parent = parent;
    }

    Enter() {}
    Exit() {}
}

class CharacterFSM extends FiniteStateMachine {
constructor(animations, target) {
    super();
    this._animations = animations;
    this._target = target;
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
    this._AddState('react', ReactState);
    this._AddState('dive', DiveState);
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
        const curAction = this._parent._animations['idle'].action;
        if (prevState) {
          const prevAction = this._parent._animations[prevState.Name].action;
          
          curAction.time = 0.0;
          curAction.enabled = true;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
          if (prevState.Name == 'walk' || prevState.Name == 'run' || prevState.Name == 'walkbackwards' || prevState.Name == 'runbackwards' || prevState.Name == 'rightturn' || prevState.Name == 'leftturn'){
            curAction.crossFadeFrom(prevAction, 0.2, true);
          } else{
            curAction.crossFadeFrom(prevAction, 0.5, true);
          }
        }
        curAction.play();

    }

    Exit() {
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
        const curAction = this._parent._animations['walk'].action;
        if(prevState){
            const prevAction = this._parent._animations[prevState.Name].action;
            curAction.enabled = true;
            if (prevState.Name == 'run'){
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            }else{
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }
            curAction.crossFadeFrom(prevAction, 0.5, true);
        }
        curAction.play();
    }

    Exit() {
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
        const curAction = this._parent._animations['walkbackwards'].action;
        if (prevState){
            const prevAction = this._parent._animations[prevState.Name].action;
            curAction.enabled = true;
            if (prevState.Name == 'runbackwards'){
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else{
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }
            curAction.crossFadeFrom(prevAction, 0.5, true);
        }
        curAction.play();

    }

    Exit(){
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
      const curAction = this._parent._animations['run'].action;
      if(prevState){
        const prevAction = this._parent._animations[prevState.Name].action;

        curAction.enabled = true;

        if (prevState.Name == 'walk') {
            const ratio = curAction.getClip().duration / prevAction.getClip().duration;
            curAction.time = prevAction.time * ratio;
        } else{
            curAction.time = 0.0;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
        }
          curAction.crossFadeFrom(prevAction, 0.5, true);
      }
      curAction.play();
  }

  Exit() {
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
      const curAction = this._parent._animations['runbackwards'].action;
      if(prevState){
          const prevAction = this._parent._animations[prevState.Name].action;
          curAction.enabled = true;
          if (prevState.Name == 'walkbackwards'){
            const ratio = curAction.getClip().duration / prevAction.getClip().duration;
            curAction.time = prevAction.time * ratio;
          } else{
            curAction.time = 0.0;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
          }
          curAction.crossFadeFrom(prevAction, 0.5, true);
      }
      curAction.play();
  }

  Exit() {
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
    const curAction = this._parent._animations['jump'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._animations['jump'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
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
    const curAction = this._parent._animations['wave'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 1, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._animations['wave'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
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
    const curAction = this._parent._animations['spell'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      if (prevState.Name == 'idle'){
        curAction.crossFadeFrom(prevAction, 1, true);
      }
      else{
        curAction.crossFadeFrom(prevAction, 0.2, true);
      }
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._animations['spell'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
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
    const curAction = this._parent._animations['rightturn'].action;
    if(prevState){
        const prevAction = this._parent._animations[prevState.Name].action;
        
        curAction.enabled = true;
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
        curAction.crossFadeFrom(prevAction, 0.3, true);

    }
    curAction.play();
  }

  Exit(){

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
    const curAction = this._parent._animations['leftturn'].action;
    if(prevState){
        const prevAction = this._parent._animations[prevState.Name].action;
        
        curAction.enabled = true;
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
        curAction.crossFadeFrom(prevAction, 0.3, true);

    }
    curAction.play();
  }

  Exit(){

  }
}


class ReactState extends State{
  constructor(parent){
    super(parent);
    const reactAnimations = ['wave', 'backflip', 'jabcross', 'reaction', 'dance1', 'dance2', 'gangnam', 'jump'];
    this.reactAnimationName = reactAnimations[Math.floor(Math.random()*reactAnimations.length)];
    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return this.reactAnimationName;
  }

  Enter(prevState){
    const curAction = this._parent._animations[this.reactAnimationName].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.3, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._animations[this.reactAnimationName].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
    this._Cleanup();
  }

}


class DiveState extends State{

  constructor(parent){
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'dive';
  }

  Enter(prevState){
    const curAction = this._parent._animations['dive'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if(prevState){
      const prevAction = this._parent._animations[prevState.Name].action;
      
      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 1, true);
    }
    curAction.play();
  }

  _Finished() {
    this._Cleanup();
  }

  _Cleanup() {
    const action = this._parent._animations['dive'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
  }
}


export {AnimationManager};





  

