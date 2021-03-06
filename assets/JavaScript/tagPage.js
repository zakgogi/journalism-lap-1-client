window.onload = function() {
    getTagData("none");
    setBackgroundClass();
};
let sectionToAppend = document.getElementById('tagData');
const queryString = window.location.search;

let recentFilterButton = document.getElementById("recentFilter");
recentFilterButton.addEventListener('click', ()=>{
    sectionToAppend.innerHTML = "";
    getTagData("recent");
})
let popularFilterButton = document.getElementById("popularFilter");
popularFilterButton.addEventListener('click', ()=>{
    sectionToAppend.innerHTML = "";
    getTagData("popular");
})
let createPostButton = document.getElementById('postBtn');
createPostButton.addEventListener('click', addToLocalStorage);
const urlParams = new URLSearchParams(queryString);

document.getElementById('pageName').textContent = urlParams.get('tag');

function setBackgroundClass(){
    let sectionToStyle = document.getElementById('borderMe');
    sectionToStyle.classList.add(`${urlParams.get('tag').toLowerCase()}Section`);
}
function addToLocalStorage(){
    localStorage.setItem("tag", urlParams.get('tag'));
}

async function getTagData(filter){
    let data = await fetch(`https://journalism-project-lap-1.herokuapp.com/data/${urlParams.get('tag')}`);
    let dataJson = await data.json();
    extractArticles(dataJson, filter);
}

function applyClasses(target){
    target.classList.add('d-flex');
    target.classList.add('justify-content-center');
}

function extractArticles(data, filter){
    let targetParagraph = sectionToAppend;
    if (filter === "popular"){
        data.sort((a,b) => {
            let pa = 0;
            pa += a.emoji1;
            pa += a.emoji2;
            pa += a.emoji3;
            let pb = 0;
            pb += b.emoji1;
            pb += b.emoji2;
            pb += b.emoji3;
            return pb - pa;
        });
    } else {
        data.sort((a, b) => {
            let da = new Date(a.date),
            db = new Date(b.date);
            return db - da;
        })
    };
    for (let i=0; i<data.length; i++){
        //Appending article title
        let titleHeader = document.createElement('h2');
        titleHeader.textContent = data[i].title;
        applyClasses(titleHeader);
        targetParagraph.append(titleHeader);
        //Appending date and time
        let timeStamp = document.createElement('h4');
        let timeStampYear = data[i].date.slice(0,10);
        let timeStampTime = data[i].date.slice(11,16);
        timeStamp.textContent = `${timeStampYear}, ${timeStampTime}`
        applyClasses(timeStamp);
        targetParagraph.append(timeStamp);
        //Append Article itself
        let para = document.createElement('p');
        para.textContent = data[i].article;
        applyClasses(para);
        targetParagraph.append(para);
        //Append Gif
        if (data[i].gif){
            let newGIF = document.createElement('img');
            newGIF.src = data[i].gif;
            newGIF.style.display = "block";
            newGIF.style.marginBottom = "8px";
            newGIF.classList.add('mx-auto');
            targetParagraph.append(newGIF);
            
        }
        //Appending Emoji buttons and counters
        let buttonSection = document.createElement('div');
        applyClasses(buttonSection);
        let emojiReactions = [data[i].emoji1, data[i].emoji2, data[i].emoji3]
        for (let j=0; j<3; j++){
            let emojiButton = document.createElement('button');
            let emojiCounter = document.createElement('h5');
            let emojiImage = document.createElement('img');
            emojiCounter.textContent = emojiReactions[j];
            emojiButton.id = `id${i+1}Emoji${j+1}Btn`
            emojiCounter.id  = `id${i+1}EmojiCounter${j+1}`;
            let imagePath;
            let disabledPath;
            switch(j){
                case 0: 
                    imagePath = "./assets/images/emptyHeart.png";
                    disabledPath = "./assets/images/fullHeart.png";
                    break;
                case 1: 
                    imagePath = "./assets/images/emptyThumbUp.png";
                    disabledPath = "./assets/images/fullThumbUp.png";
                    break;
                case 2:
                    imagePath = "./assets/images/emptyThumbDown.png";
                    disabledPath = "./assets/images/fullThumbDown.png";
                    break;
            }
            emojiImage.setAttribute("src", imagePath);
            emojiImage.style.height = "35px";
            emojiImage.style.width = "35px";
            emojiButton.append(emojiImage);
            emojiButton.addEventListener('click', () => 
                {updateReactValue(data[i].id, `emojiButton${j+1}`)
                    emojiCounter.textContent = emojiReactions[j] + 1;
                    emojiButton.disabled = true;
                    emojiImage.setAttribute("src", disabledPath);
                    emojiImage.style.height = "45px";
                    emojiImage.style.width = "45px";
                });
            buttonSection.append(emojiButton);
            buttonSection.append(emojiCounter);
        }
        //Appending comment button
        let commentButton = document.createElement('button');
        let commentImage = document.createElement('img');
        commentImage.id = `commentImage${i+1}`;
        commentImage.setAttribute('src', './assets/images/EmptyChatBubble.png')
        commentButton.append(commentImage);
        commentButton.id = `commentButton${i+1}`
        commentButton.addEventListener('click', () => {
            showCommentSection(i+1);
        });
        buttonSection.append(commentButton);
        targetParagraph.append(buttonSection);
        //Adding line breaks
        let lineBreak = document.createElement('br');
        let anotherLineBreak = document.createElement('br');
        targetParagraph.append(lineBreak);
        targetParagraph.append(anotherLineBreak);
        //Appending and displaying comment section if button clicked
        let commentSection = document.createElement('section');
        commentSection.id = `sectionToHide${i + 1}`;
        commentSection.style.display = "none";
        commentSection.classList.add('text-center');
        let newHeader = document.createElement('h3');
        newHeader.textContent = "Comments section"
        commentSection.append(newHeader);
        let newCommentArea = document.createElement('textarea');
        newCommentArea.cols = "33";
        newCommentArea.rows = "2";
        newCommentArea.id = "newComment";
        newCommentArea.maxLength = 100;
        commentSection.append(newCommentArea);
        let yetAnotherLineBreak = document.createElement('br');
        commentSection.append(yetAnotherLineBreak);
        let commentAppendButton = document.createElement('button');
        commentAppendButton.textContent = "Submit your comment";
        commentAppendButton.classList.add("mb-2");
        commentAppendButton.addEventListener('click', ()=>{
            addAComment(newCommentArea.value, data[i].id);
            let comment = document.createElement('p');
            comment.textContent = newCommentArea.value;
            commentSection.append(comment);
        })
        commentSection.append(commentAppendButton);
        if (data[i].comments){
            for (let j=0; j<data[i].comments.length; j++){
                let comment = document.createElement('p');
                comment.textContent = data[i].comments[j];
                commentSection.append(comment);
                
            } 
        }
        targetParagraph.append(commentSection);
    }
};

function updateReactValue(id, buttonString){
    let dataToSend = {
        id: id,
        buttonClicked: buttonString
    }
    createPutRequest(dataToSend);
}


async function createPutRequest(jsonObject){
    const reponse = await fetch("https://journalism-project-lap-1.herokuapp.com/data", {
        method: "PUT", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonObject)
    });
}


function addAComment(comment, id){
    let dataToSend = {
        id: id,
        commentContent: comment
    }
    createCommentPutRequest(dataToSend);
}

async function createCommentPutRequest(jsonObject){
    const reponse = await fetch("https://journalism-project-lap-1.herokuapp.com/", {
        method: "PUT", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonObject)
    });
    console.log(jsonObject);
}


function showCommentSection(id){
    let sectionToShow = document.getElementById(`sectionToHide${id}`);
    let showButtonImage = document.getElementById(`commentImage${id}`)
    let isItShowing = sectionToShow.style.display;
    switch (isItShowing){
        case "block":
            showButtonImage.src = './assets/images/EmptyChatBubble.png';
            sectionToShow.style.display = "none";
            break;
        case "none":
            showButtonImage.src = './assets/images/FullChatBubble.png';
            sectionToShow.style.display = "block";
            break;
    }
}