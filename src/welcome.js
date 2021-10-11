import * as THREE from 'three';
import fontJson from 'three/examples/fonts/helvetiker_regular.typeface.json';

class SpeechBubble {
    constructor(camera, text, position){
        this._camera = camera;
        this.createBubble(text);
        this.position = position;
        this.moveBubble(position);
    }

    moveBubble(textPosition){
        textPosition.project(this._camera);
        console.log(textPosition);
        const x = (textPosition.x *  .5 + .5) * document.body.clientWidth;
        const y = (textPosition.y * -.5 + .5) * document.body.clientHeight;
        this._element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;  
    }

    createBubble(text){
        this._element = document.createElement('div');
        let textDiv = document.createElement('div');
        this._element.appendChild(textDiv);
        textDiv.textContent = text;
        textDiv.classList.add("text");
        this._element.classList.add("overlay", "bubble");
        document.body.appendChild(this._element);
    }
}

export{SpeechBubble};