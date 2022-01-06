import * as THREE from 'three';
import arrowRight from '/res/icons/arrow-right.png'
import arrowLeft from '/res/icons/arrow-left.png';
import infoIcon from '/res/icons/info.svg';
import * as TWEEN from '@tweenjs/tween.js';
import Constants from './constants.js';

class InteractionBlocks{
    /*
    this class creates all objects, they are however invisible until "show" is called on them
    */

    _speechBubble; //the actual speechBubble
    _nextButton; //the button to skip to the next message
    _lastButton; //the button to skip to the last message
    _startButton; //the button to start the navigation
    _backButton; //the button to go back from the navigation
    _pointers; //three.js objects which point at clickable spots
    _loadingScreen; //loading screen which is shown in the very beginning
    _navigationInfo; //information block about how to navigate on the website

    _checkPointLeft;
    _checkPointMid;
    _checkPointRight;
    _interactiveModel; //stores the interactions with the model and can add/remove them


    _wrapper; //wraps _speechBubble, _nextBtn, _lastBtn and _startBtn to position below the wizard

    _world; //the three.js scene
    _controls; //the instance of the AnimationManager

    constructor(world, controls){
        this._world = world;
        this._controls = controls;
        this._initBlocks();
    }

    _initBlocks(){
        this._initLoadingScreen();
        this._initWrapper();
        this._initBackButton();
        this._initNavigationInfo();
        this._initCheckPoints();
        this._initInteractiveModel();
    }

    _initLoadingScreen(){
        this._loadingScreen = new LoadingScreen();
        document.body.appendChild(this._loadingScreen._element);
    }

    _initWrapper(){
        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('wrapper')
        this.move(this._wrapper, new THREE.Vector3(0, 7, 0));

        this._lastBubbleNext = document.createElement('div');
        this._lastBubbleNext.classList.add('last-bubble-next');

        console.log("image: "+arrowLeft);
        this._lastButton = new Button(arrowLeft, 'img');
        this._lastButton._element.style.width = '15%';
        this._speechBubble = new SpeechBubble("Herzlich Willkommen!");
        console.log("image: "+ arrowLeft);
        this._nextButton = new Button(arrowRight, 'img');
        this._nextButton._element.style.width = '15%';

        this._lastBubbleNext.appendChild(this._lastButton._element);
        this._lastBubbleNext.appendChild(this._speechBubble._element);
        this._lastBubbleNext.appendChild(this._nextButton._element);

        this._startButton = new Button("START", 'text');

        this._wrapper.appendChild(this._lastBubbleNext);
        this._wrapper.appendChild(this._startButton._element);
        
        document.body.appendChild(this._wrapper);
    }

    _initBackButton(){
        console.log("image: "+ arrowLeft);
        this._backButton = new Button(arrowLeft, 'img');
        this._backButton._element.style.position = 'absolute';
        this._backButton._element.style.top = '0';
        this._backButton._element.style.left = '0';
        document.body.appendChild(this._backButton._element);
    }

    _initNavigationInfo(){
        this._navigationInfo = new InfoBox("Bewege den Magier, indem du auf die Portale klickst oder WASD drückst!");
        this._navigationInfo._element.style.position = 'absolute';
        this._navigationInfo._element.style.bottom = '2%';
        this._navigationInfo._element.style.left = '0';
        this._navigationInfo._element.style.right = '0';
        this._navigationInfo._element.style.width = '50%';
        this._navigationInfo._element.style.margin = 'auto';
        document.body.appendChild(this._navigationInfo._element);
    }

    _initCheckPoints(){
        this._checkPointLeft = new CheckPoint(5);
        this._checkPointLeft.setPosition(Constants.PortalPositions.Left);

        this._checkPointMid = new CheckPoint(5);
        this._checkPointMid.setPosition(Constants.PortalPositions.Mid);

        this._checkPointRight = new CheckPoint(5);
        this._checkPointRight.setPosition(Constants.PortalPositions.Right);


        this._world._scene.add(this._checkPointLeft._element);
        this._world._scene.add(this._checkPointMid._element);
        this._world._scene.add(this._checkPointRight._element);
    }

    _initInteractiveModel(){
        this._interactiveModel = new InteractiveModel(this._controls, this._world);
        this._interactiveModel.addClickAction();
    }

    move(element, position){
        position.project(this._world._camera);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }

    remove(element){
        let oldStyle = element.style.display;
        element.style.display = 'none';
        return oldStyle;
    }

    putBack(element, display){
        element.style.display = display;
    }
}


class InteractionBlock{
    _element;
    _onScreen = false;

    _create() {}
    show() {}
    hide() {}
}


class CheckPoint extends InteractionBlock{

    constructor(radius){
        super();
        this._radius = radius
        this._create();
    }

    _create(){
        const geometry = new THREE.CylinderGeometry(this._radius, this._radius, .5, 32, 1);
        const material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, color: 0xFFD700});
        this._element = new THREE.Mesh(geometry, material);
        this._element.name = "checkpoint";
    }

    show(){
        new TWEEN.Tween(this._element.material, Constants.TweenGroup.Opacity)
        .to({opacity: 1}, 2000)
        .delay(5000)
        .start();
    }

    hide(){
        new TWEEN.Tween(this._element.material, Constants.TweenGroup.Opacity)
        .to({opacity: 0},2000)
        .start();
    }

    setPosition(position){ //x and z from position are set coordinates are set 
        this._element.position.set(position.x, 0, 45);
    }
}


class InteractiveModel{
    constructor(controls, world){
        this._controls = controls;
        this._renderer = world._threejs;
        this._world = world;
        this._model = this._controls._target;
        this._bindFunction =  this._onClick.bind(this);
    }

    addClickAction(){
        this._renderer.domElement.addEventListener('click', this._bindFunction, false);
    }

    removeClickAction(){
        this._renderer.domElement.removeEventListener('click', this._bindFunction, false);
    }

    _onClick(){
        console.log(this._world._scene.children)
        const intersects = Constants.Raycaster.intersectObjects(this._world._scene.children, true);
        console.log(intersects)
        /*if (intersects.length > 0 && Constants.TweenGroup.MovementTween.getAll()[0] == null){
            console.log('Make a reaction')
            this._controls.react();
        }*/
        if (intersects.length > 0){
            var string = "";
            for (var object of intersects){
                string += ", "+object.object.name;
            }
            console.log(string);
        }
    }


}

class LoadingScreen {

    //a black screen to be shown when loading
    constructor(){
        this._Init();
    }

    _Init(){
        this._element = document.createElement('div');
        this._element.classList.add("loading")
    }

    hide(){
        this._element.style.opacity="0";
    }
}



class HTMLInteractionBlock extends InteractionBlock{

    _create(){
        this._element = document.createElement('div');
        this._element.classList.add('interaction-block');
    }

    show(){
        const parent = this;
        if (!parent._onScreen){
            setTimeout(function () {
                    parent._element.style.opacity = "1";
                    parent._onScreen = true;
                    return true;
            }, 1100);
        }
        return false;
    }

    hide(){
        if (this._onScreen){
            console.log('hidden')
            this._element.style.opacity = "0";
            this._onScreen = false;
            return true;
        }
        return false;
    }
}

class InfoBox extends HTMLInteractionBlock{
    _text;
    _textDiv;

    constructor(text){
        super();
        this._text = text;
        this._create();
    }

    _create(){
        super._create();
        this._element.classList.add("overlay", "info-box");
        this._infoIcon = document.createElement('img');
        this._infoIcon.src = infoIcon;
        this._element.appendChild(this._infoIcon);
        this._textDiv = document.createElement('div');
        this._textDiv.classList.add("text");
        this._textDiv.innerHTML = this._text;
        this._element.appendChild(this._textDiv);
    }

    setText(text){
        const parent = this;
        setTimeout(function () {
            parent._textDiv.innerHTML = text;
        }, 1100);
    }

    show(){
        super.show();
        this._element.style.display = 'flex';
    }

    hide(){
        const parent = this;
        super.hide();
        setTimeout(function(){
            parent._element.style.display = 'none';
        }, 1000);
    }
}

class SpeechBubble extends HTMLInteractionBlock{
    _text;
    _textDiv;

    constructor(text){
        super();
        this._text = text;
        this._create();
    }

    _create(){
        super._create();
        this._element.classList.add("overlay", "bubble");
        this._textDiv = document.createElement('div');
        this._textDiv.classList.add("text");
        this._textDiv.innerHTML = this._text;
        this._element.appendChild(this._textDiv);
    }

    setText(text){
        const parent = this;
        setTimeout(function () {
            parent._textDiv.innerHTML = text;
        }, 1100);
    }
}


class Button extends HTMLInteractionBlock{
    _action;

    constructor(src, type){
        super();
        this._src = src;
        this._type = type;
        this._create();
    }

    _create(){
        super._create();
        if (this._type == 'img'){
            this._imgElement = document.createElement('img');
            this._imgElement.src = this._src;
            this._element.appendChild(this._imgElement);
            this._element.classList.add('button-img');
        } else {
            super._create();
            this._element.innerHTML = this._src;
            this._element.classList.add('button-txt');
        }
        this._element.classList.add('button');
    }

    show(){
        super.show()
        this._element.style.cursor = "pointer";
        
    }

    hide(){
        super.hide()
        this._element.style.cursor = "default"; 
    }

    setAction(action){
        this.removeAction();
        this._action = action;
        this._element.addEventListener('click', this._action);
    }

    removeAction(){
        this._element.removeEventListener('click', this._action);
        this._action = null;
    }
}

export{InteractionBlocks};
