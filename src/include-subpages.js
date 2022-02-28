import videos_html from './subpages/videos.html';
import exercises_html from './subpages/exercises.html';
import about_html from './subpages/about.html';

const include_html = () => {
    let includes = [videos_html, exercises_html, about_html];
    for(var i=0; i<includes.length; i++){
        let include = includes[i];
        console.log(include);
        document.getElementById('subpages').insertAdjacentHTML('beforeend', include);
    }
}

export{include_html}
