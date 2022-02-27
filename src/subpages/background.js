import '/src/subpages/substyles.css';
import * as THREE from 'three';
import watertexture from '/res/particles/water24.png';
import '/res/fonts/Lora.ttf';
import confirm from '/res/icons/confirm.png';


const _VSPortalPerformant = `
uniform float randomMultiplier;
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const _FSPortal = `
uniform float time;
uniform sampler2D myTexture;
varying vec2 vUv;
varying vec3 vPosition;
  void main() {
    vec2 displacedUV = vec2(vUv.x + 0.1 * sin(vUv.y*100. + time), vUv.y);
    gl_FragColor = texture2D(myTexture, displacedUV);
    gl_FragColor.a = 0.8;
  }
`;


class AnimatedBackground{
    constructor(){
        this._InitScene();
        this._InitBackBtn();
    }

    _InitScene(){
        const parent = this;
        this._clock = new THREE.Clock();
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding; //for more accurate colors
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        
        document.body.appendChild(this._threejs.domElement);
        this._threejs.domElement.style.opacity = 0;

        
        this._camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
        this._scene = new THREE.Scene();

        window.addEventListener( 'resize', function(e) {
            parent._threejs.setSize( window.innerWidth, window.innerHeight, 2 );
          });

        const uniforms = {
            myTexture: {
                value: new THREE.TextureLoader().load(watertexture),
            },
            time: {
              value: 0
            },
          };
  
      this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        side: THREE.DoubleSide,
        fragmentShader: _FSPortal,
        vertexShader: _VSPortalPerformant,
        shadowSide: THREE.DoubleSide,
      });

        
      
        const quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2, 1, 1 ), this._material );
        this._scene.add( quad );
        this._RAF();
    }

    _onLoad(){
      console.log('lol')
      document.body.style.display = 'flex';
      this._threejs.domElement.classList.add('fadeIn');
      this._askQuestion();
    }

    _askQuestion(){
      let question = document.createElement('div');
      question.innerHTML = 'Bereit?';
      question.style.cssText = `
        font-size: var(--fs-gigantic);
        padding: calc(var(--fs-large) * 0.5);
        background-color: white;
        border: 5px solid;
        border-radius: 10px;
        opacity: 0;
      `
      let confirmBtn = document.createElement('img');
      confirmBtn.src = confirm;
      confirmBtn.style.cssText = `
        opacity:0;
        position: fixed;
        display: block;
        bottom: 2%;
        margin: auto;
        width: calc(2 * var(--fs-gigantic));
      `
      confirmBtn.classList.add('button');
      confirmBtn.addEventListener('click', () => {
        this._requestFullscreen();
        let wrapper = document.getElementById('wrapper');
        let backBtn = document.getElementById('back-btn');
        wrapper.style.display = 'block';
        backBtn.style.display = 'block';
        wrapper.classList.add('fadeIn');
        backBtn.classList.add('fadeIn');
        question.style.display = 'none';
        confirmBtn.style.display = 'none';
      });
      document.body.appendChild(question);
      document.body.appendChild(confirmBtn);
      question.classList.add('fadeIn');
      setTimeout(() => {
        confirmBtn.classList.add('fadeIn');
      }, 1000);

    }

    _Step(timeElapsed) {
        if (!this._material.uniforms.time.value){
          this._material.uniforms.time.value = 0.0;
        }
        this._material.uniforms.time.value += timeElapsed*10;
      }

    _RAF(){
        requestAnimationFrame(() => {this._RAF()});
        this._threejs.render( this._scene, this._camera);
        this._Step(this._clock.getDelta());
    }

    _InitBackBtn(){
        let backBtn = document.getElementById('back-btn');
        backBtn.addEventListener('click', () => {
            window.location.href = './';
        })
    }

    _requestFullscreen(){
        if (this._isUserOnMobile()){
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
            screen.orientation.lock("landscape")
        }
    }

    _isUserOnMobile(){
        var UA = navigator.userAgent;
        return(
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

window.transitionToPage = function(href){
  document.body.classList.add('fadeOut');
  setTimeout(() => {
    window.location.href = href;
  }, 2000);
}

/*window.addEventListener('DOMContentLoaded', () => {
    const animtedBg = new AnimatedBackground();
    animtedBg._onLoad();
    console.log('loaded')
});*/
