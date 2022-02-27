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
    addAskForCookiePermission(link1, 'play-btn1', 'video1-frame');
    addAskForCookiePermission(link2, 'play-btn2', 'video2-frame');
};

const fromSubpageToSubpage = (oldId, newId) =>{
    let oldSubpage = document.getElementById(oldId);
    oldSubpage.style.opacity = 0;
    let newSubpage = document.getElementById(newId);
    newSubpage.style.display = 'block';
    setTimeout(() =>{
        oldSubpage.style.display = 'none';
        newSubpage.style.opacity = 1;
    }, 1000);
}

const transitionToSubpage = (newId) =>{
    let newSubpage = document.getElementById(newId);
    newSubpage.style.display = 'block';
    newSubpage.style.opacity = 1;
}

const init_links = () =>{
    document.getElementById('videos-exercises-btn').addEventListener('click', () => {
        fromSubpageToSubpage('videos', 'exercises');
    });
    document.getElementById('videos-about-btn').addEventListener('click', () => {
        fromSubpageToSubpage('videos', 'about');
    });
    document.getElementById('about-exercises-btn').addEventListener('click', () => {
        fromSubpageToSubpage('about', 'exercises');
    });
    document.getElementById('about-videos-btn').addEventListener('click', () => {
        fromSubpageToSubpage('about', 'videos');
    });
    document.getElementById('exercises-videos-btn').addEventListener('click', () => {
        fromSubpageToSubpage('exercises', 'videos');
    });
    document.getElementById('exercises-about-btn').addEventListener('click', () => {
        fromSubpageToSubpage('exercises', 'about');
    });
}

export {init_videos, init_links, transitionToSubpage};
