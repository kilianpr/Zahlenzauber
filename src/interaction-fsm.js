import {CamTween} from "./camtween";
import * as THREE from 'three';
import {DoubleClickNavigation} from './doubleclick.js';
import * as TWEEN from '@tweenjs/tween.js';


const firstMessageText = "Herzlich Willkommen!";
const secondMessageText = "Ich bin Merlin, der Zahlenzauberer.";
const lastMessageText = "Klicke 'Start', um loszulegen!";

class InteractionFiniteStateMachine {
    _world;
    _interactionBlocks;
    _states;
    _currentState;
    _doubleClickNav;
    _controls;

    constructor(world, interactionBlocks, controls) {
        this._world = world;
        this._interactionBlocks = interactionBlocks;
        this._states = {};
        this._currentState = null;
        this._controls = controls;
        this._Init();
    }

    _Init(){
        this._AddState('transitionIn', TransitionInState);
        this._AddState('firstMessage', FirstMessageState);
        this._AddState('secondMessage', SecondMessageState);
        this._AddState('lastMessage', LastMessageState);
        this._AddState('navigation', NavigationState);
        this._AddState('transitionAnimation', TransitionAnimationState);
        
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
        console.log("---------")

        state.Enter(prevState);
    }
}


class InteractionState {
    constructor(parent) {
        this._parent = parent;
    }

    Enter() {}
    Exit() {}
}


class TransitionInState extends InteractionState {
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'transitionIn';
    }

    Enter(prevState){
        this._parent._controls.idle();
        const parent = this;

        setTimeout(function(){
            parent._parent._interactionBlocks._loadingScreen.hide();
            setTimeout(function(){
                parent._parent._interactionBlocks.remove(parent._parent._interactionBlocks._loadingScreen._element);
            }, 2000);
        }, 1200);

        let toPos = new THREE.Vector3(0, 12, -20);
        let toLook = new THREE.Vector3(0, 12,  50);
        const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
        tween
        .onComplete(function(){
            parent._parent.SetState('firstMessage');
        })
        .delay(700)
        .start();
    }

    Exit(){}
}


class FirstMessageState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'firstMessage';
    }

    Enter(prevState){
        this._parent._controls.wave();
        if (prevState.Name == 'secondMessage'){
            this._parent._interactionBlocks._lastButton.hide();
            this._parent._interactionBlocks._lastButton.removeAction();
        }
        this._parent._interactionBlocks._speechBubble.setText(firstMessageText);
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._nextButton.show();
        this._parent._interactionBlocks._nextButton.setAction(() => {this._parent.SetState('secondMessage')});
    }

    Exit(){
        this._parent._interactionBlocks._speechBubble.hide();
    }
}

class SecondMessageState extends InteractionState{
    static _visited = false;
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'secondMessage';
    }

    Enter(prevState){
        if (prevState.Name == 'firstMessage'){
            this._parent._interactionBlocks._lastButton.show();
            if (!SecondMessageState._visited){
                setTimeout(() => {
                    this._parent._controls.spell();
                    setTimeout(() =>{
                        this._parent._world._fireLeft.show();
                        this._parent._world._fireRight.show();
                        this._parent._world._portalA.showAnimation();
                        this._parent._world._portalB.showAnimation();
                        this._parent._world._portalC.showAnimation();
                    }, 1000);
                }, 1000);
                SecondMessageState._visited = true;
            }
        }
        else if (prevState.Name == 'lastMessage'){
            this._parent._interactionBlocks._nextButton.show();
            this._parent._interactionBlocks._startButton.hide();
            this._parent._interactionBlocks._startButton.removeAction();
        }
        this._parent._interactionBlocks._speechBubble.setText(secondMessageText);
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._nextButton.show();


        this._parent._interactionBlocks._lastButton.setAction(() => {this._parent.SetState('firstMessage')});
        this._parent._interactionBlocks._nextButton.setAction(() => {this._parent.SetState('lastMessage')});
    }

    Exit(){
        this._parent._interactionBlocks._speechBubble.hide();
    }
}

class LastMessageState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'lastMessage';
    }

    Enter(prevState){
        const parent = this;
        if (prevState.Name == 'secondMessage'){
            console.log("HIDE");
            this._parent._interactionBlocks._nextButton.hide();
        }
        else if (prevState.Name == 'navigation'){
            this._parent._interactionBlocks.putBack(this._parent._interactionBlocks._wrapper, 'block');
            this._parent._interactionBlocks._lastButton.show();
            this._parent._interactionBlocks._backButton.hide();
            this._parent._interactionBlocks._backButton.removeAction();
            let toPos = new THREE.Vector3(0, 12, -20);
            let toLook = new THREE.Vector3(0, 12,  50);
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .delay(700)
            .start();
                setTimeout(() => {
                    if (this._modelStillInPlace()){
                        this._parent._doubleClickNav.setRotSpeed(Math.PI/2);
                        this._parent._doubleClickNav.rotateToDefault();
                        this._parent._controls.turnLeft();
                        setTimeout(() => {
                            this._parent._controls.idle();
                        }, 2000);
                    }
                    else{
                        this._parent._controls.walk();
                        this._parent._doubleClickNav.setRotSpeed(Math.PI * 4);
                        this._parent._doubleClickNav.rotateToDefault();
                        new TWEEN.Tween(this._parent._controls._target.position)
                        .to({
                            x: 0,
                            y: 0,
                            z: 0
                        }, (2000/20)*this._parent._controls._target.position.distanceTo(new THREE.Vector3(0, 0, 0)))
                        .easing(TWEEN.Easing.myCustom.myEasingOut)
                        .onComplete(() => {
                            this._parent._controls.idle();
                        })
                        .start();
                        console.log(this._parent._controls._target.position);
                        console.log(this._parent._controls._target.rotation);
                    }
                }, 700);
        }
        this._parent._interactionBlocks._speechBubble.setText(lastMessageText);
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._startButton.show();

        this._parent._interactionBlocks._lastButton.setAction(() => {this._parent.SetState('secondMessage')});
        this._parent._interactionBlocks._startButton.setAction(() => {this._parent.SetState('navigation')});
    }

    _modelStillInPlace(){
        console.log(this._parent._controls._target.position);
        console.log(this._parent._controls._target.rotation);
        return (this._parent._controls._target.position.x < 0.1 && this._parent._controls._target.position.x > -0.1 
            && this._parent._controls._target.position.z < 0.1 && this._parent._controls._target.position.z > -0.1 
            && this._parent._controls._target.rotation.y < 0.1 && this._parent._controls._target.rotation.y > -0.1);
    }

    Exit(){
        this._parent._interactionBlocks._speechBubble.hide();
        this._parent._interactionBlocks._startButton.hide();
    }
}

class NavigationState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'navigation';
    }

    Enter(prevState){
        const parent = this;
        if (prevState.Name == 'lastMessage'){
            this._parent._doubleClickNav = new DoubleClickNavigation(this._parent._world, 20, this._parent._controls);
            this._parent._doubleClickNav.addDoubleClickAction();
            this._parent._interactionBlocks._lastButton.hide();
            setTimeout(() => {
                this._parent._interactionBlocks.remove(this._parent._interactionBlocks._wrapper);
            }, 1000);
            setTimeout(() => {
                this._parent._doubleClickNav.setRotSpeed(Math.PI/2);
                this._parent._controls.turnRight();
                this._parent._doubleClickNav._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
                setTimeout(() => {
                    this._parent._controls.idle();
                    this._parent._doubleClickNav.setRotSpeed(Math.PI * 4);
                }, 2000);
            }, 700);
            this._parent._interactionBlocks._navigationInfo.show();
            this._parent._interactionBlocks._backButton.show();
            this._parent._interactionBlocks._backButton.setAction(() => {this._parent.SetState('lastMessage')});
            let toPos = new THREE.Vector3(42, 12, -12);
            let toLook = new THREE.Vector3(0, 12, 50);
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .delay(700)
            .start();
        }
    }

    Exit(){
        this._parent._interactionBlocks._navigationInfo.hide();
    }
}

class TransitionAnimationState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'transitionAnimation';
    }
}

export{InteractionFiniteStateMachine};