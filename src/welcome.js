import * as THREE from 'three';

class SpeechBubble {
    constructor(camera, text, position){
        this._camera = camera;
        this.create(text);
        this.position = position;
    }

    move(position){
        console.log(position);
        position.project(this._camera);
        console.log(position);
        const x = (position.x *  .5 + .5) * document.body.clientWidth;
        const y = (position.y * -.5 + .5) * document.body.clientHeight;
        this._element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;  
    }

    create(text){
        this._element = document.createElement('div');
        let textDiv = document.createElement('div');
        this._element.appendChild(textDiv);
        textDiv.textContent = text;
        textDiv.classList.add("text");
        this._element.classList.add("overlay", "bubble");
        document.body.appendChild(this._element);
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

export{SpeechBubble, LoadingScreen};