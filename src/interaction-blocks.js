import * as THREE from 'three';
import arrowRight from '/res/icons/arrow-right.png'
import arrowLeft from '/res/icons/arrow-left.png'
import infoIcon from '/res/icons/info.svg'

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

    _wrapper; //wraps _speechBubble, _nextBtn, _lastBtn and _startBtn to position below the wizard

    _world; //the three.js scene

    constructor(world){
        this._world = world;
        this._initBlocks();
    }

    _initBlocks(){
        this._initLoadingScreen();
        this._initWrapper();
        this._initBackButton();
        this._initNavigationInfo();
        this._initPointers();
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

        this._lastButton = new ImageButton(arrowLeft);
        this._lastButton._element.style.width = '15%';
        this._speechBubble = new SpeechBubble("Herzlich Willkommen!");
        this._nextButton = new ImageButton(arrowRight);
        this._nextButton._element.style.width = '15%';

        this._lastBubbleNext.appendChild(this._lastButton._element);
        this._lastBubbleNext.appendChild(this._speechBubble._element);
        this._lastBubbleNext.appendChild(this._nextButton._element);

        this._startButton = new TextButton("START");

        this._wrapper.appendChild(this._lastBubbleNext);
        this._wrapper.appendChild(this._startButton._element);
        
        document.body.appendChild(this._wrapper);
    }

    _initBackButton(){
        this._backButton = new ImageButton(arrowLeft);
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

    _initPointers(){

    }

    move(element, position){
        position.project(this._world._camera);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
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


class InteractionBlock{
    _element;
    _onScreen = false;

    _create() {}
    show() {}
    hide() {}
}

class HTMLInteractionBlock extends InteractionBlock{

    _create(){
        this._element = document.createElement('div');
        this._element.classList.add('interaction-block');
    }

    show(){
        const parent = this;
        setTimeout(function () {
            if (!parent._onScreen){
                parent._element.style.opacity = "1";
                parent._onScreen = true;
                return true;
            }
            return false;
        }, 1100);
    }

    hide(){
        if (this._onScreen){
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

    constructor(){
        super();
        this._create();
    }

    _create(){
        super._create();
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

class ImageButton extends Button{
    _image;

    constructor(image) {
        super();
        this._image = image;
        this._create();
    }

    _create(){
        super._create();
        this._imgElement = document.createElement('img');
        this._imgElement.src = this._image;
        this._element.appendChild(this._imgElement);
        this._element.classList.add('button-img');
    }
}

class TextButton extends Button{
    _text;

    constructor(text) {
        super();
        this._text = text;
        this._create();
    }

    _create(){
        super._create();
        this._element.innerHTML = this._text;
        this._element.classList.add('button-txt');
    }
}

export{InteractionBlocks};
