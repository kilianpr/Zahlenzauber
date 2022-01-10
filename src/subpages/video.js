import playIcon from '/res/icons/play-circle.svg';
let curLink, curIframeID;
const link1 = 'https://www.youtube-nocookie.com/embed/EYbvhWEG6kE';
const link2 = 'https://www.youtube-nocookie.com/embed/EYbvhWEG6kE';

const addAskForCookiePermission = function(link, btnID, iframeID){
    let button = document.getElementById(btnID);
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
    border: 10px solid;
    border-radius: 10px;
    font-size: var(--fs-small);
    width: 50%;
    background-color: white;
    text-align: center;
    padding: var(--fs-small); 
    `
    let text = document.createElement('div');
    text.innerHTML = "Mit Klick auf 'Akzeptieren' erklärst du dich damit einverstanden, dass das YouTube-Video auf die Website geladen wird. Dadurch werden Cookies von Google gesetzt."

    let buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = `
    display: grid;
    grid-template-columns: 45% 45%;
    column-gap: 10%;
    padding: var(--fs-small);
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

window.addEventListener('DOMContentLoaded', () => {
    let playBtns = document.getElementsByClassName('play-btn');
    for (var i = 0; i < playBtns.length; i++) {
        playBtns[i].src = playIcon;
    }
    createPopUp();
    addAskForCookiePermission(link1, 'play-btn1', 'video1-frame');
    addAskForCookiePermission(link2, 'play-btn2', 'video2-frame');
});

