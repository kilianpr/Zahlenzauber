import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

const manager = new THREE.LoadingManager();
const groupA = new TWEEN.Group();
const groupB = new TWEEN.Group();
const groupC = new TWEEN.Group();
const midPortalPos = new THREE.Vector3(0, 0, 50);
const rightPortalPos = new THREE.Vector3(-25, 0, 50);
const leftPortalPos = new THREE.Vector3(25, 0, 50);

const Constants = {
    GeneralLoadingManager: manager,
    TweenGroup : {
        CamMovement : groupA,
        ModelMovement : groupB,
        Opacity: groupC,
    },
    PortalPositions : {
        Left : leftPortalPos,
        Mid: midPortalPos,
        Right: rightPortalPos
    }
}
export default Constants;
