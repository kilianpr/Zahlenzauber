import {CamTween} from "./camtween";
import Constants from './constants.js';
import * as THREE from 'three';
import {ClickNavigation} from './clicknav.js';
import {change_params, init_videos, init_links, fadeInSubpage, fadeOutSubpage} from "./subpages/subpages";
import { include_html } from "./include-subpages";



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
        this._clickNavigation = new ClickNavigation(this._world, this._controls);
        this._Init();
    }

    _Init(){
        this._AddState('prereqFullscreen', PrereqFullscreenState);
        this._AddState('prereqLandscape', PrereqLandscapeState);
        this._AddState('transitionIn', TransitionInState);
        this._AddState('firstMessage', FirstMessageState);
        this._AddState('secondMessage', SecondMessageState);
        this._AddState('lastMessage', LastMessageState);
        this._AddState('navigation', NavigationState);
        this._AddState('confirm', ConfirmState);
        this._AddState('transitionAnimation', TransitionAnimationState);        
        this._AddState('exercises', ExercisesState);        
        this._AddState('about', AboutState);        
        this._AddState('videos', VideosState);        
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


class PrereqFullscreenState extends InteractionState {
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'prereqFullscreen';
    }

    Enter(prevState){
        include_html();
        init_videos();
        init_links(this._parent);
        if (!Constants.isOnMobile || Document.fullscreenElement != null && screen.availHeight < screen.availWidth){
            this.transitionToNextState();
        }
        else if (Document.fullscreenElement != null && screen.availHeight >= screen.availWidth){
            this._parent.SetState('prereqLandscape');
        }
        else{
            this._parent._interactionBlocks._loadAnim._element.style.display='none';
            this._parent._interactionBlocks._prereqFullscreen.show();
            this._parent._interactionBlocks._goFullscreenBtn.show();
            this._parent._interactionBlocks._goFullscreenBtn.setAction(() => {
                var elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
                screen.orientation.lock("landscape")
                .then(() => {
                    this.transitionToNextState();
                })
                .catch((err) => { 
                    console.log(err) ;
                    this._parent.SetState('prereqLandscape');
                });
            })
        }
    }

    transitionToNextState(){
        let page = new URLSearchParams(document.location.search).get("page");
        if (page == "videos" || page == "exercises" || page == "about"){
            this._parent.SetState(page);
        } else{
            this._parent.SetState('transitionIn');
        }
    }
}

class PrereqLandscapeState extends InteractionState {
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'prereqLandscape';
    }

    Enter(prevState){
        this._parent._interactionBlocks._prereqFullscreen._element.style.display = 'none';
        this._parent._interactionBlocks._prereqLandscape.show();
        this._parent._interactionBlocks._startTransBtn.show();
        this._parent._interactionBlocks._startTransBtn.setAction(() => {
            if (page == "videos" || page == "exercises" || page == "about"){
                this._parent.SetState(page);
            } else{
                this._parent.SetState('transitionIn');
            }
        })
    }
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
        this._parent._clickNavigation.activateModelInteraction();
        this._parent._interactionBlocks._loadingScreen.hide();
        this._parent._interactionBlocks._canvas._element.style.opacity = 1;
        this._parent._interactionBlocks._canvas._onScreen = true;
        let toPos = new THREE.Vector3(0, 12, -20);
        let toLook = new THREE.Vector3(0, 12,  50);
        const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
        tween
        .onComplete(() => {
            this._parent.SetState('firstMessage');
            this._parent._interactionBlocks.move(this._parent._interactionBlocks._wrapper._element, new THREE.Vector3(0, 5, 0));
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

        this._parent._interactionBlocks._speechBubble.setText(firstMessageText)
        this._parent._interactionBlocks._wrapper.show();
        this._parent._interactionBlocks._speechBubble.show();
        this._parent._interactionBlocks._nextButton.show();
        this._parent._interactionBlocks._nextButton.setAction(() => {this._parent.SetState('secondMessage')});

        if (prevState.Name == 'secondMessage'){
            this._parent._interactionBlocks._lastButton.hide();
            this._parent._interactionBlocks._lastButton.removeAction();
        }
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

            this._parent._interactionBlocks._lastButton.show();
        }
        else if (prevState.Name == 'lastMessage'){
            this._parent._interactionBlocks._nextButton.show();
            this._parent._interactionBlocks._startButton.hide();
            this._parent._interactionBlocks._startButton.removeAction();
        }

        this._parent._interactionBlocks._speechBubble.setText(secondMessageText);
        this._parent._interactionBlocks._speechBubble.show();
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
            this._setOnClickListeners();
        }
        else if (prevState.Name == 'navigation'){
            let toPos = new THREE.Vector3(0, 12, -20);
            let toLook = new THREE.Vector3(0, 12,  50);
            Constants.TweenGroup.CamMovement.removeAll();
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .delay(700)
            .onComplete(() => {
                this._parent._interactionBlocks._wrapper.show(0);
                this._parent._interactionBlocks._lastButton.show(0);
                this._parent._interactionBlocks.move(this._parent._interactionBlocks._wrapper._element, new THREE.Vector3(0,5,0));
            })
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
        this._parent._interactionBlocks._navigationInfo.show();
        this._parent._interactionBlocks._backButton.show();

        if (prevState.Name == 'lastMessage'){
            this._parent._interactionBlocks._lastButton.removeAction();
            this._parent._interactionBlocks._startButton.removeAction();
            this._parent._interactionBlocks._wrapper.hide();
            setTimeout(() => {
                this._parent._clickNavigation.setRotSpeed(Math.PI/2);
                this._parent._controls.turnRight();
                this._parent._clickNavigation.rotateToOppositeDefault();
                setTimeout(() => {
                    this._parent._controls.idle();
                    this._setClickActions();
                }, 2000);
            }, 700);

            let toPos = new THREE.Vector3(42, 12, -12);
            let toLook = new THREE.Vector3(0, 12, 50);
            Constants.TweenGroup.CamMovement.removeAll();
            const tween = new CamTween(this._parent._world, toPos, toLook, 3000).getTween();
            tween
            .delay(700)
            .start();
        }

        else if (prevState.Name == 'confirm' || prevState.Name == 'videos' || prevState.Name == 'exercises' || prevState.Name == 'about'){
            this._parent._clickNavigation.activateModelInteraction();
            this._setClickActions();
            if (prevState.Name != 'confirm'){
                this._parent._interactionBlocks._canvas.show();
                let toPos = new THREE.Vector3(42, 12, -12);
                let toLook = new THREE.Vector3(0, 12, 50);
                Constants.TweenGroup.CamMovement.removeAll();
                const tween = new CamTween(this._parent._world, toPos, toLook, 1000).getTween();
                tween.onComplete(() => {
                    this._parent._controls.react();
                })
                .delay(1000)
                .start();
            }
        }

    }

    _setClickActions(){
        this._parent._clickNavigation.setRotSpeed(Math.PI * 4);
        this._parent._clickNavigation.activateNavInteraction(() => {
            this._parent._controls.idle();
            this._parent._clickNavigation.rotateToDefault();
            this._parent.SetState('confirm');
        });
        this._parent._interactionBlocks._backButton.setAction(() => {this._parent.SetState('lastMessage')});
    }

    Exit(){
        this._parent._interactionBlocks._navigationInfo.hide();
        this._parent._interactionBlocks._backButton.hide();
        this._parent._interactionBlocks._backButton.removeAction();
        this._parent._clickNavigation.disableNavInteraction();
    }
}


class ConfirmState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'confirm';
    }

    Enter(prevState){
        this._parent._clickNavigation.disableModelInteraction();
        this._parent._interactionBlocks._confrej.show();
        this._parent._interactionBlocks._confButton.show();
        this._parent._interactionBlocks._confButton.setAction(() => {
            this._parent.SetState('transitionAnimation');
        });
        this._parent._interactionBlocks._rejButton.show();
        this._parent._interactionBlocks._rejButton.setAction(() => {
            setTimeout(() => {
                this._parent.SetState('navigation');
            }, 100);
        });
    }

    Exit(){
        this._parent._interactionBlocks._confrej.hide();
    }

}

class TransitionAnimationState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'transitionAnimation';
    }

    Enter(prevState){
        const targetPos = this._parent._controls._target.position;
        this._parent._clickNavigation.moveToPoint(
            new THREE.Vector3(targetPos.x, 0, targetPos.z-20),
            25, 'walk', () =>{
                this._parent._clickNavigation.rotateToOppositeDefault();
                this._parent._controls.idle();
                setTimeout(() => {
                    this._parent._controls.dive();
                    setTimeout(() => {
                        Constants.hasTransitioned = true;
                        if (Constants.curPortal == 'Left'){
                            const tween = new CamTween(this._parent._world, new THREE.Vector3(25, 12, 45), new THREE.Vector3(25, 12, 50), 1000).getTween();
                            tween.onComplete(()=>{
                                this._parent.SetState('exercises');
                            })
                            .start();
                        } else if (Constants.curPortal == 'Right'){
                            const tween = new CamTween(this._parent._world, new THREE.Vector3(-25, 12, 45), new THREE.Vector3(-25, 12, 50), 1000).getTween();
                            tween.onComplete(()=>{
                                this._parent.SetState('about');
                            })
                            .start();
                        } else if (Constants.curPortal == 'Mid'){
                            const tween = new CamTween(this._parent._world, new THREE.Vector3(0, 12, 45), new THREE.Vector3(0, 12, 50), 1000).getTween();
                            tween.onComplete(()=>{
                                this._parent.SetState('videos');
                            })
                            .start();
                        }
                    }, 2000)
                }, 1000);
            })
    }
}


class SubpageState extends InteractionState{
    constructor(parent){
        super(parent);
    }

    Enter(prevState){
        if (prevState != 'exercise' && prevState != 'about' && prevState != 'videos'){
            this._parent._interactionBlocks._canvas.hide();
            this._parent._interactionBlocks._backButton.show();
            this._parent._interactionBlocks._backButton.setAction(() => {
                this._goStateBack();
            });
        } 
        if (prevState.Name == 'prereqFullscreen' || prevState.Name == 'prereqLandscape'){
            this._parent._interactionBlocks._loadingScreen.hide();
        }

        window.addEventListener('click', Constants.catchClickEvents, true);
        fadeInSubpage(this.Name);
        setTimeout(()=>{
            window.removeEventListener('click', Constants.catchClickEvents, true);
        }, 1000);
        change_params(this.Name);
    }


    Exit(){
        fadeOutSubpage(this.Name);
    }

    _goStateBack(){
        window.removeEventListener('click', Constants.catchClickEvents, true);
        if (Constants.hasTransitioned){
            const target = this._parent._controls._target;
            target.position.set(target.position.x, target.position.y, target.position.z + 20);            
            this._parent._clickNavigation.rotateToDefault();
            this._parent._controls.idle();
            this._parent._clickNavigation.activateModelInteraction();
            setTimeout(() =>{
                this._parent.SetState('navigation');
            }, 200);
        }
        else{
            this._parent.SetState('transitionIn');
            this._parent._interactionBlocks._backButton.hide();
        }
    }
}


class ExercisesState extends SubpageState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'exercises';
    }

    Enter(prevState){
        super.Enter(prevState);
    }
}


class AboutState extends SubpageState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'about';
    }

    Enter(prevState){
        super.Enter(prevState);
    }
}



class VideosState extends SubpageState{
    constructor(parent){
        super(parent);
    }

    get Name(){
        return 'videos';
    }

    Enter(prevState){
        super.Enter(prevState);
    }
}

export{InteractionFiniteStateMachine};