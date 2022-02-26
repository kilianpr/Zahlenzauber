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
    _clickNavigation;

    constructor(world, controls, clickNavigation){
        this._world = world;
        this._controls = controls;
        this._clickNavigation = clickNavigation;
        this._initBlocks();
    }

    _initBlocks(){
        this._initLoadingScreen();
        this._initWrapper();
        this._initBackButton();
        this._initNavigationInfo();
        this._initConfRej();
    }

    _initLoadingScreen(){
        this._loadingScreen = new LoadingScreen();
        this._loadAnim = new HTMLInteractionBlock(document.getElementById('loadAnim'), true, 'flex');
        this._prereqFullscreen = new HTMLInteractionBlock(document.getElementById('prereqFullscreen'), true, 'block');
        this._goFullscreenBtn = new Button(document.getElementById('fullscreenBtn'), true, 'block');
        this._prereqLandscape = new HTMLInteractionBlock(document.getElementById('prereqLandscape'), true, 'block');
        this._startTransBtn = new Button(document.getElementById('startTrans'), true, 'block');
    }

    _initWrapper(){
        this._wrapper = new HTMLInteractionBlock(document.getElementById('interaction-wrapper'), true, 'block');

        this._lastButton = new Button(document.getElementById('last-btn'), false, 'block');
        this._speechBubble = new TextBlock(document.getElementById('bubble'), false, 'block', 0, '');
        this._nextButton = new Button(document.getElementById('next-btn'), false, 'block');

        this._startButton = new Button(document.getElementById('start-btn'), false, 'block');
    }

    _initBackButton(){
        this._backButton = new Button(document.getElementById('back-btn'), true, 'block');
    }

    _initNavigationInfo(){
        this._navigationInfo = new TextBlock(document.getElementById('info-box'), true, 'flex', 0, "Bewege den Magier, indem du auf die Portale klickst oder WASD drückst!");
    }

    _initConfRej(){
        this._confrej = new HTMLInteractionBlock(document.getElementById('confrej-wrapper'), true, 'flex');
        this._confButton = new Button(document.getElementById('confirm-btn'), true, 'block');
        this._rejButton = new Button(document.getElementById('reject-btn'), true, 'block');
    }

    move(element, position){
        position.project(this._world._camera);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }
}


class InteractionBlock{
    _element;
    _onScreen = false;

    _create() {}
    show() {}
    hide() {}
}




class LoadingScreen {

    //a black screen to be shown when loading
    constructor(){
        this._Init();
    }

    _Init(){
        this._element = document.getElementById('loading');
    }

    hide(){
        this._element.style.opacity="0";
        setTimeout(() => {
            this._element.style.display="none";
            document.getElementById('overlay').style.display='flex';
        }, 2000);
    }
}




class HTMLInteractionBlock extends InteractionBlock{
    constructor(element, allowNone, display){ //allowNone is a boolean which indicates whether display may be set to 'none'
        super();
        this._element = element;
        this._display = display;
        this._allowNone = allowNone;
        this._element.style.opacity = 0;
    }

    show(delay=1000){
        this._element.style.display = this._display;
        this._onScreen = true;
        setTimeout(() => {
            this._element.style.opacity = "1";
            console.log("show")
        }, delay);
    }

    hide(delay=1000){
        if (this._onScreen){
            this._element.style.opacity = "0";
            this._onScreen = false;
            if (this._allowNone){
                setTimeout(() => {
                    this._element.style.display = 'none';
                }, delay)
            }
        }
    }
}

class Button extends HTMLInteractionBlock{
    _action;

    constructor(element, allowNone, display){
        super(element, allowNone, display);
        this._element.style.opacity = '0';
        this._element.style.cursor = 'default';
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
        if (this._action){
            this._element.removeEventListener('click', this._action);
            this._action = null;
        }
    }
}


class TextBlock extends HTMLInteractionBlock{
    _text;

    constructor(element, allowNone, display, child, text){
        super(element, allowNone, display);
        this._child = child;
        this._text = text;
        this.setText(this._text);
    }

    setText(text){
        this._text = text;
        const parent = this;
        setTimeout(() => {
            if (parent.child == -1){
                parent._element.innerHTML = text;
            }
            else{
                parent._element.children[parent._child].innerHTML = text;
            }
        }, 1000);
    }
}

export{InteractionBlocks};
