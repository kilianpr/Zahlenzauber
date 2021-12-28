import * as THREE from 'three';
import arrowRight from '/res/icons/arrow-right.png'
import arrowLeft from '/res/icons/arrow-left.png'

class SpeechBubble {

    _camera; //the camera of the scene
    _content = []; //an array of messages to be displayed in the SpeechBubble
    _currentContent; //index of message in _content which is currently displayed in the SpeechBubble
    _position; //Vec3 position of the SpeechBubble


    _wrapper; _bubble; _textDiv; _btnLast; _btnNext; //divs to create the SpeechBubble

    constructor(camera, position){
        this._camera = camera;
        this._currentContent = 0;
        this._position = position;
        this.create();
    }


    //moves speech-bubble to specified Vec3 position
    move(position){
        position.project(this._camera);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        this._wrapper.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }

    //creates all divs and buttons for the SpeechBubble
    create(){
        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('bubble-wrapper', 'overlay');


        this._bubble = new Bubble();

        /*this._bubble = document.createElement('div');
        this._bubble.classList.add("overlay", "bubble");
        this._textDiv = document.createElement('div');
        this._textDiv.classList.add("text");
        this._bubble.appendChild(this._textDiv);*/

        this._btnLast = new Button(arrowLeft, () => {this.lastContent()});
        this._btnNext = new Button(arrowRight, () => {this.nextContent()});

        this._wrapper.appendChild(this._btnLast._element);
        this._wrapper.appendChild(this._bubble._element);
        this._wrapper.appendChild(this._btnNext._element);

        document.body.appendChild(this._wrapper);
    }

    //function which triggers when user clicks 'next'
    nextContent(){
        if (this._currentContent < this._content.length -1){
            this._currentContent += 1
            this.changeContentAndAnimate(this);
        }
    }

    //function which triggers when user clicks 'last'
    lastContent(){
        if (this._currentContent > 0){
            this._currentContent -= 1
            this.changeContentAndAnimate(this);
        }
    }

    //changes the content of the SpeechBubble and triggers the animation if it can be executed
    changeContentAndAnimate(){
        const parent = this;
        this._bubble.remove();
        setTimeout(function(){
            parent._bubble._textDiv.innerHTML = parent._content[parent._currentContent].text;
            parent._btnLast.show();
            if (parent._content[parent._currentContent].first){
                parent._btnLast.remove();
            }
            if ((parent._content[parent._currentContent].unique && !parent._content[parent._currentContent].executed) || !parent._content[parent._currentContent].unique){
                parent._content[parent._currentContent].action();
                parent._content[parent._currentContent].executed = true;
            }
            parent._bubble.show();
        }, 1100);
    }

    //shows the SpeechBubble for the first time
    firstShow(){
        this._btnLast.show();
        this._btnNext.show();
        this.changeContentAndAnimate();
    }

    //makes the SpeechBubble invisible
    remove(){
        this._wrapper.style.opacity = "0";
    }

    //adds a message to the _content array
    addMessage(message){
        this._content.push(message);
    }
}

class Bubble{
    _element;
    _textDiv;
    _shown = false;

    constructor(){
        this.create()
    }

    create(){
        this._element = document.createElement('div');
        this._element.classList.add("overlay", "bubble");
        this._textDiv = document.createElement('div');
        this._textDiv.classList.add("text");
        this._element.appendChild(this._textDiv);
    }

    show(){
        this._element.style.opacity = "1";
        this._shown = true;
    }

    remove(){
        this._element.style.opacity = "0";
        this._shown = false;
    }

}

class Button{
    _element;
    _image;
    _action;
    _shown = false;

    constructor(image, action){
        this._image = image;
        this._action = action;
        this.create();
    }

    create(){
        this._element = document.createElement("img");
        this._element.classList.add("interact");
        this._element.addEventListener('click', this._action);
        this._element.src = this._image;
    }

    show(){
        this._element.style.opacity = "1";
        this._shown = true;
    }

    remove(){
        this._element.style.opacity = "0";
        this._shown = false;
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
        document.body.appendChild(this._element);
    }

    remove(){
        this._element.style.opacity="0";
    }

}


class Message{
    //wrapper class for a message
    constructor(text, action, unique, first=false, last=false){
        this.text = text;
        this.action = action;
        this.unique = unique;
        this.first = first;
        this.last = last;
        this.executed = false;
    }
}

export{SpeechBubble, LoadingScreen, Message};