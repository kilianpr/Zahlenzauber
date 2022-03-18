import Constants from '../constants';
import playIcon from '/res/icons/play-circle.svg';
import thumbnail1 from '/res/subpages/ThumbnailFlaechen.png';
import thumbnail2 from '/res/subpages/ThumbnailNegativeZahlen.png';
let curLink, curIframeID;
const link1 = 'https://www.youtube-nocookie.com/embed/bGTnin-EykM';
const link2 = 'https://www.youtube-nocookie.com/embed/bXHWmhIDlQY';

const addAskForCookiePermission = function(link, btnID, iframeID, thumbnail, thumbnailID){
    let button = document.getElementById(btnID);
    document.getElementById(thumbnailID).style.backgroundImage = "url("+thumbnail+")";
    button.addEventListener('click', ()=>{
        showPopUp(link, iframeID);
    })
}

const createPopUp = function(){
    let box = document.createElement('div');
    box.setAttribute('id', 'pop-up');
    box.style.cssText = `
    display: none; 
    position: absolute;
    border: calc(0.5*var(--sub-fs-tiny)) solid;
    border-radius: calc(0.5*var(--sub-fs-tiny));
    font-size: var(--sub-fs-tiny);
    width: 50%;
    max-width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: white;
    padding: var(--sub-fs-tiny); 
    `
    let text = document.createElement('div');
    text.innerHTML = "Mit Klick auf 'Akzeptieren' erklärst du dich damit einverstanden, dass das YouTube-Video auf die Website geladen wird. Dadurch werden Cookies von Google gesetzt."

    let buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = `
    display: grid;
    grid-template-columns: 45% 45%;
    column-gap: 10%;
    padding: var(--sub-fs-tiny) var(--sub-fs-tiny) 0 var(--sub-fs-tiny);
    `

    const btnStyle = `
    border: 2px solid;
    border-radius: 20px;
    padding: calc(0.2 * var(--fs-small));
    `

    let acceptBtn = document.createElement('div');
    acceptBtn.innerHTML = "Akzeptieren";
    acceptBtn.style.cssText = btnStyle;
    acceptBtn.setAttribute('id', 'accept-btn');
    acceptBtn.addEventListener('click', loadIframe);

    let declineBtn = document.createElement('div');
    declineBtn.innerHTML = "Ablehnen";
    declineBtn.style.cssText = btnStyle;
    declineBtn.setAttribute('id', 'decline-btn');
    declineBtn.addEventListener('click', hidePopUp);
    
    
    buttonWrapper.appendChild(acceptBtn);
    buttonWrapper.appendChild(declineBtn);
    box.appendChild(text);
    box.appendChild(buttonWrapper);
    document.body.appendChild(box);
}

const showPopUp = function(link, iframeID){
    if (!document.getElementById('pop-up')){
        createPopUp();
    }
    document.getElementById('pop-up').style.display = 'block';
    curLink = link;
    curIframeID = iframeID;
}

const hidePopUp = function (){
    document.getElementById('pop-up').style.display = 'none';
}


const loadIframe = function(){
    hidePopUp();
    let iframe = document.getElementById(curIframeID);
    iframe.src = curLink;
    iframe.style.display = 'block';
}

const init_videos = () => {
    let playBtns = document.getElementsByClassName('play-btn');
    for (var i = 0; i < playBtns.length; i++) {
        playBtns[i].src = playIcon;
    }
    createPopUp();
    addAskForCookiePermission(link1, 'play-btn1', 'video1-frame', thumbnail1, 'video1-thumbnail');
    addAskForCookiePermission(link2, 'play-btn2', 'video2-frame', thumbnail2, 'video2-thumbnail');
};


const fadeInSubpage = (id, delay=1000) =>{
    let newSubpage = document.getElementById(id);
    newSubpage.style.display = 'block';
    setTimeout(() => {
        newSubpage.style.opacity = 1;
    }, delay);
}

const fadeOutSubpage = (id) => {
    let oldSubpage = document.getElementById(id);
    oldSubpage.style.opacity = 0;
    setTimeout(() =>{
        oldSubpage.style.display = 'none';
    }, 1000);
}


const init_links = (stateMachine) =>{
    let btns = document.getElementsByClassName('subpage-btn');
    for (let i = 0; i < btns.length; i++){
        let btn = btns[i];
        btn.addEventListener('click', () => {
            if (!Constants.cooldownActive){
                Constants.cooldownActive = true;
                setTimeout(() =>{
                    Constants.cooldownActive = false;
                }, 1000);
                stateMachine.SetState(btn.classList[1].split('-')[1]);
            }
        });
    }
}


const change_params = (param) =>{
    let params = new URLSearchParams(window.location.search);
    params.set('page', param);
    window.history.replaceState(null, null, "?"+params);
}


const init_collapsibles = () => {
    let coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
    }
}

const init_images = () => {
    let images = document.getElementsByClassName("exercise-image");
    let fullscreenDiv = document.getElementById("fullscreen-pic");
    for (let i = 0; i < images.length; i++){
        images[i].addEventListener("click", function() {
            fullscreenDiv.children[0].src = images[i].src;
            fullscreenDiv.style.zIndex = 999;
            fullscreenDiv.classList.toggle("zoomed-in");
        });
    }
    fullscreenDiv.addEventListener("click", function(e) {
        fullscreenDiv.style.zIndex = -1;
        fullscreenDiv.classList.toggle("zoomed-in");
        fullscreenDiv.children[0].src = null;
    })

}

export {init_videos, init_links, change_params, fadeOutSubpage, fadeInSubpage, init_collapsibles, init_images};
