import * as THREE from 'three';
import arrowRight from '/res/icons/arrow-right.png'
import arrowLeft from '/res/icons/arrow-left.png'

class SpeechBubble {

    _camera; //the camera of the scene
    _content = []; //an array of messages to be displayed in the SpeechBubble
    _currentContent; //index of message in _content which is currently displayed in the SpeechBubble
    _position; //Vec3 position of the SpeechBubble


    _element; _textDiv; _lastDiv; _nextDiv; //divs to create the SpeechBubble

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
        this._element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;  
    }

    //creates all divs and buttons for the SpeechBubble
    create(){
        this._element = document.createElement('div');
        this._textDiv = document.createElement('div');
        let interactDiv = document.createElement('div');
        this._lastDiv = document.createElement('div');
        let lastImg = document.createElement('img');
        this._nextDiv = document.createElement('div');
        let nextImg = document.createElement('img');


        this._element.appendChild(this._textDiv);
        this._element.appendChild(interactDiv);

        
        interactDiv.appendChild(this._lastDiv);
        this._lastDiv.appendChild(lastImg);
        lastImg.addEventListener('click', () => {this.lastContent()});
        this._lastDiv.classList.add("interact");
        lastImg.src = arrowLeft;
        this._nextDiv.classList.add("interact");
        nextImg.src = arrowRight;
        interactDiv.appendChild(this._nextDiv);
        this._nextDiv.appendChild(nextImg);
        nextImg.addEventListener('click', () => {this.nextContent()});

        this._element.classList.add("overlay", "bubble");
        this._textDiv.classList.add("text");
        interactDiv.classList.add("interact-container");

        document.body.appendChild(this._element);
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
    changeContentAndAnimate(parent){
        parent._element.style.opacity="0";
        setTimeout(function(){
            parent._textDiv.innerHTML = parent._content[parent._currentContent].text;
            parent._lastDiv.style.display = "block";
            if (parent._content[parent._currentContent].first){
                parent._lastDiv.style.display = "none";
            }
            if ((parent._content[parent._currentContent].unique && !parent._content[parent._currentContent].executed) || !parent._content[parent._currentContent].unique){
                parent._content[parent._currentContent].action();
                parent._content[parent._currentContent].executed = true;
            }
            parent._element.style.opacity="1";
        }, 1100);
    }

    //shows the SpeechBubble
    show(){
        this.move(this._position);
        this.changeContentAndAnimate(this);
    }

    //makes the SpeechBubble invisible
    remove(){
        this._element.style.opacity = "0";
    }

    //adds a message to the _content array
    addMessage(message){
        this._content.push(message);
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
        this.executed = false;
    }
}

export{SpeechBubble, LoadingScreen, Message};