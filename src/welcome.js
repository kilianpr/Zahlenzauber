import * as THREE from 'three';
import arrowRight from '/res/icons/arrow-right.png'
import arrowLeft from '/res/icons/arrow-left.png'

class SpeechBubble {
    constructor(camera, content, position){
        this._camera = camera;
        this._content = content;
        this._currentContent = 0;
        this.position = position;
        this.create();
    }

    move(position){
        position.project(this._camera);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        this._element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;  
    }

    create(){
        this._element = document.createElement('div');
        this._textDiv = document.createElement('div');
        let interactDiv = document.createElement('div');
        let lastDiv = document.createElement('div');
        let lastImg = document.createElement('img');
        let nextDiv = document.createElement('div');
        let nextImg = document.createElement('img');

        this._element.appendChild(this._textDiv);
        this._element.appendChild(interactDiv);
        interactDiv.appendChild(lastDiv);
        interactDiv.appendChild(nextDiv);
        lastDiv.appendChild(lastImg);
        nextDiv.appendChild(nextImg);
        lastImg.addEventListener('click', () => {this.lastContent()});
        nextImg.addEventListener('click', () => {this.nextContent()});

        this._element.classList.add("overlay", "bubble");
        this._textDiv.classList.add("text");
        this._textDiv.innerHTML = this._content[this._currentContent].text;
        interactDiv.classList.add("interact-container");
        lastDiv.classList.add("interact");
        nextDiv.classList.add("interact");
        lastImg.src = arrowLeft;
        nextImg.src = arrowRight;

        document.body.appendChild(this._element);
    }

    nextContent(){
        parent = this;
        if (this._currentContent < this._content.length -1){
            parent._currentContent += 1
            this._element.style.opacity="0";
            setTimeout(function(){
                parent._textDiv.innerHTML = parent._content[parent._currentContent].text;
                parent._content[parent._currentContent].action();
                parent._element.style.opacity="1";
            }, 1100);
        }
    }

    lastContent(){
        parent = this;
        if (this._currentContent > 0){
            parent._currentContent -= 1
            this._element.style.opacity="0";
            setTimeout(function(){
                parent._textDiv.innerHTML = parent._content[parent._currentContent].text;
                parent._content[parent._currentContent].action();
                parent._element.style.opacity="1";
            }, 1100);
        }
    }

    show(){
        this.move(this.position);
        this._element.style.opacity="1";
    }
}

class LoadingScreen {
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
    constructor(text, action){
        this.text = text;
        this.action = action;
    }
}

export{SpeechBubble, LoadingScreen, Message};