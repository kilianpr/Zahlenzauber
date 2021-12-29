import {CamTween} from "./camtween";
import * as THREE from 'three';

const firstMessageText = "Herzlich Willkommen!";
const secondMessageText = "Ich bin Merlin, der Zahlenzauberer.";
const lastMessageText = "Klicke 'Start', um loszulegen!";

class InteractionFiniteStateMachine {
    constructor(world, interactionBlocks) {
        this._world = world;
        this._interactionBlocks = interactionBlocks;
        this._states = {};
        this._currentState = null;
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
        const parent = this;

        setTimeout(function(){
            parent._parent._interactionBlocks._loadingScreen.hide();
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
        this._parent._world._controls.wave();
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
                this._parent._world._controls.spell();
                this._parent._world._controls.enableControls();
                setTimeout(() => {
                    this._parent._world._fireLeft.show();
                    this._parent._world._fireRight.show();
                    this._parent._world._portalA.showAnimation();
                    this._parent._world._portalB.showAnimation();
                    this._parent._world._portalC.showAnimation();
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
        if (prevState.Name == 'secondMessage'){
            this._parent._interactionBlocks._nextButton.hide();
        }
        else if (prevState.Name == 'navigation'){
            this._parent._interactionBlocks._lastButton.show();
        }
        this._parent._interactionBlocks._speechBubble.setText(lastMessageText);
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._startButton.show();

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
        if (prevState.Name == 'lastMessage'){
            this._parent._interactionBlocks._lastButton.hide();
            //this._parent._interactionBlocks._nextButton.hide();
            let toPos = new THREE.Vector3(42, 12, -12);
            let toLook = new THREE.Vector3(0, 12, 50);
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .onComplete(() => {
                this._parent._interactionBlocks._speechBubble.setText("Klicke auf eines der Portale oder bewege mich mit WASD um zu navigieren!");
                this._parent._interactionBlocks._speechBubble.show();
            })
            .delay(700)
            .start();
        }
    }

    Exit(){
        this._parent._interactionBlocks._wrapper.hide();
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