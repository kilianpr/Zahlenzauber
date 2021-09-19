import fire from '/res/particles/fire.png'
import water from '/res/particles/water.png'
class ParticleSystem{
    constructor(params){
        const uniforms = {
            diffuseTexture: {
                value: new THREE.TextureLoader().load(fire)
            },
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
            }
        }
    }

}