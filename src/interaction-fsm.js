import {CamTween} from "./camtween";
import Constants from './constants.js';
import * as THREE from 'three';
import {ClickNavigation} from './clicknav.js';


const firstMessageText = "Herzlich Willkommen!";
const secondMessageText = "Ich bin Merlin, der Zahlenzauberer.";
const lastMessageText = "Klicke 'Start', um loszulegen!";

class InteractionFiniteStateMachine {
    _world;
    _interactionBlocks;
    _states;
    _currentState;
    _clickNavigation;
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
        }, 1);

        let toPos = new THREE.Vector3(0, 12, -20);
        let toLook = new THREE.Vector3(0, 12,  50);
        const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
        tween
        .onComplete(function(){
            parent._parent.SetState('firstMessage');
        })
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
            this._setOnClickListeners();
        }
        else if (prevState.Name == 'navigation'){
            this._parent._clickNavigation.removeClickActions();
            this._parent._interactionBlocks.putBack(this._parent._interactionBlocks._wrapper, 'block');
            this._parent._interactionBlocks._lastButton.show();
            this._parent._interactionBlocks._backButton.hide();
            this._parent._interactionBlocks._backButton.removeAction();
            let toPos = new THREE.Vector3(0, 12, -20);
            let toLook = new THREE.Vector3(0, 12,  50);
            Constants.TweenGroup.CamMovement.removeAll();
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .delay(700)
            .start();

            if (this._modelStillInPlace()){
                this._parent._clickNavigation.setRotSpeed(Math.PI/2);
                this._parent._clickNavigation.rotateToDefault();
                this._parent._controls.turnLeft();
                setTimeout(() => {
                    this._parent._controls.idle();
                    this._setOnClickListeners();
                }, 2000);
            } else{
                this._parent._controls.idle();
                Constants.TweenGroup.ModelMovement.removeAll();
                setTimeout(() => {
                    this._parent._clickNavigation.moveToPoint(new THREE.Vector3(0, 0, 0), 25, 'walk', () => { 
                            this._parent._clickNavigation.rotateToDefault();
                            this._parent._controls.idle();
                            this._setOnClickListeners();
                        });
                }, 700);
            }
                
        }
        this._parent._interactionBlocks._speechBubble.setText(lastMessageText);
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._startButton.show();
    }

    _modelStillInPlace(){
        console.log(this._parent._controls._target.position);
        console.log(this._parent._controls._target.rotation);
        return (this._parent._controls._target.position.x < 0.1 && this._parent._controls._target.position.x > -0.1 
            && this._parent._controls._target.position.z < 0.1 && this._parent._controls._target.position.z > -0.1 
            && this._parent._controls._target.rotation.y < 0.1 && this._parent._controls._target.rotation.y > -0.1);
    }

    _setOnClickListeners(){
        this._parent._interactionBlocks._lastButton.setAction(() => {this._parent.SetState('secondMessage')});
        this._parent._interactionBlocks._startButton.setAction(() => {this._parent.SetState('navigation')});
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
            this._parent._interactionBlocks._lastButton.removeAction();
            this._parent._interactionBlocks._startButton.removeAction();
            this._parent._clickNavigation = new ClickNavigation(this._parent._world, this._parent._controls);
            this._parent._interactionBlocks._lastButton.hide();
            setTimeout(() => {
                this._parent._interactionBlocks.remove(this._parent._interactionBlocks._wrapper);
            }, 1000);
            setTimeout(() => {
                this._parent._clickNavigation.setRotSpeed(Math.PI/2);
                this._parent._controls.turnRight();
                this._parent._clickNavigation._targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
                setTimeout(() => {
                    this._parent._controls.idle();
                    this._parent._clickNavigation.setRotSpeed(Math.PI * 4);
                    this._parent._clickNavigation.addClickActions();
                    this._parent._interactionBlocks._backButton.setAction(() => {this._parent.SetState('lastMessage')});
                }, 2000);
            }, 700);
            this._parent._interactionBlocks._navigationInfo.show();
            this._parent._interactionBlocks._backButton.show();
            let toPos = new THREE.Vector3(42, 12, -12);
            let toLook = new THREE.Vector3(0, 12, 50);
            Constants.TweenGroup.CamMovement.removeAll();
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