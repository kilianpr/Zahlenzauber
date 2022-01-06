import * as THREE from 'three';
import Constants from './constants.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import wizard from '/res/models/wizard.fbx';
import walk from '/res/anim/walk.fbx';
import walkbackwards from '/res/anim/walkbackwards.fbx';
import run from '/res/anim/run.fbx';
import runbackwards from '/res/anim/runbackwards.fbx';
import jump from '/res/anim/jump.fbx';
import wave from '/res/anim/wave.fbx';
import idle from '/res/anim/idle.fbx';
import spell from '/res/anim/spell.fbx';
import turn from '/res/anim/turn.fbx';
import rightturn from '/res/anim/rightturn.fbx';
import leftturn from '/res/anim/leftturn.fbx';
import backflip from '/res/anim/backflip.fbx';
import bow from '/res/anim/bow.fbx';
import jabcross from '/res/anim/jabcross.fbx';
import reaction from '/res/anim/reaction.fbx';
import dance1 from '/res/anim/sillydance1.fbx';
import dance2 from '/res/anim/sillydance2.fbx';
import wizardGLTF from '/res/anim/wizard.glb';

class AnimationManager{
    _animations;
    _target;
    _scence;
    _stateMachine;
    _mixer;
    _isTurning;

  constructor(scene){
    this._animations = {};
    this._scene = scene;
    this._LoadModelsGLTF();
  }

  _LoadModels(){
    const loader = new FBXLoader(Constants.GeneralLoadingManager);
    loader.load(wizard, (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.traverse(c => {
          c.castShadow = true;
        });
        //const helper = new THREE.AxesHelper(50);
        //helper.material.linewidth = 10;
        //fbx.add(helper);
        this._target = fbx;
        this._target.name = "Merlin";
        this._stateMachine = new CharacterFSM(this._animations, this._target);
        this._target.position.set(0,0,0);
        this._target.rotateY(Math.PI);
        this._scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        const _OnLoad = (animName, anim) => {
            const clip = anim.animations[0];
            const action = this._mixer.clipAction(clip);

            console.log('loaded:' + animName)
            this._animations[animName] = {
                clip: clip,
                action: action
            };
        };
        
        const loader = new FBXLoader(Constants.GeneralLoadingManager);
        loader.load(walk, (a) => {_OnLoad('walk', a);});
        loader.load(walkbackwards, (a) => {_OnLoad('walkbackwards', a);});
        loader.load(idle, (a) => {_OnLoad('idle', a)});
        loader.load(run, (a) => {_OnLoad('run', a);});
        loader.load(runbackwards, (a) => {_OnLoad('runbackwards', a);});
        loader.load(jump, (a) => {_OnLoad('jump', a);});
        loader.load(wave, (a) => {_OnLoad('wave', a);});
        loader.load(spell, (a) => {_OnLoad('spell', a);});
        loader.load(turn, (a) => {_OnLoad('turn', a);});
        loader.load(rightturn, (a) => {_OnLoad('rightturn', a);});
        loader.load(leftturn, (a) => {_OnLoad('leftturn', a);});
        loader.load(backflip, (a) => {_OnLoad('backflip', a);});
        loader.load(bow, (a) => {_OnLoad('bow', a);});
        loader.load(jabcross, (a) => {_OnLoad('jabcross', a);});
        loader.load(reaction, (a) => {_OnLoad('reaction', a);});
        loader.load(dance1, (a) => {_OnLoad('dance1', a);});
        loader.load(dance2, (a) => {_OnLoad('dance2', a);});
    });
    }

    _LoadModelsGLTF(){
      const loader = new GLTFLoader(Constants.GeneralLoadingManager);
      loader.load(wizardGLTF, ( gltf ) => {
        gltf.scene.scale.setScalar(10);
        this._target = gltf.scene;
        this._target.traverse( function (object){
          if (object.isMesh) object.castShadow = true;
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

          console.log('loaded:' + animName)
          this._animations[animName] = {
              clip: clip,
              action: action
          };
      };

        const animations = gltf.animations;
        _OnLoad('backflip', animations[0]);
        _OnLoad('bow', animations[1]);
        _OnLoad('dance1', animations[2]);
        _OnLoad('dance2', animations[3]);
        _OnLoad('gangnam', animations[4]);
        _OnLoad('idle1', animations[5]);
        _OnLoad('idle', animations[6]);
        _OnLoad('idle3', animations[7]);
        _OnLoad('jabcross', animations[8]);
        _OnLoad('jump', animations[9]);
        _OnLoad('leftturn', animations[10]);
        _OnLoad('reaction', animations[11]);
        _OnLoad('rightturn', animations[12]);
        _OnLoad('run', animations[13]);
        _OnLoad('runbackwards', animations[14]);
        _OnLoad('spell', animations[15]);
        _OnLoad('walk', animations[16]);
        _OnLoad('walkbackwards', animations[17]);
        _OnLoad('wave', animations[18]);
        
        console.log(animations);
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

    getPosition(){
        return this._target.position;
    }

    isReady(){
        return (this._target && this._stateMachine._currentState ? true : false);
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
      curAction.crossFadeFrom(prevAction, 1, true);
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

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name(){
    return 'react';
  }

  Enter(prevState){
    const reactAnimations = ['wave', 'backflip', 'bow', 'jabcross', 'reaction', 'dance1', 'dance2', 'gangnam', 'jump'];
    const reactAnimation = reactAnimations[Math.floor(Math.random()*reactAnimations.length)];
    const curAction = this._parent._animations[reactAnimation].action;
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
    const action = this._parent._animations['spell'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
  }

  Exit() {
    const action = this._parent._animations['spell'].action;
    action.getMixer().removeEventListener('finished', this._FinishedCallback);
    action.stop();
    this._parent.SetState('idle');
  }

}


export {AnimationManager};





  

