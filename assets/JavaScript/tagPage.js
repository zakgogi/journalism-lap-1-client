window.onload = function() {
    getTagData("none");
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

function addToLocalStorage(){
    localStorage.setItem("tag", urlParams.get('tag'));
}

async function getTagData(filter){
    let data = await fetch(`http://localhost:3000/data/${urlParams.get('tag')}`);
    let dataJson = await data.json();
    extractArticles(dataJson, filter);
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
        targetParagraph.append(titleHeader);
        //Appending date and time
        let timeStamp = document.createElement('h4');
        let timeStampYear = data[i].date.slice(0,10);
        let timeStampTime = data[i].date.slice(11,16);
        timeStamp.textContent = `${timeStampYear}, ${timeStampTime}`
        targetParagraph.append(timeStamp);
        //Append Article itself
        let para = document.createElement('p');
        para.textContent = data[i].article;
        targetParagraph.append(para);
        //Append Gif
        if (data[i].gif){
            let newGIF = document.createElement('img');
            newGIF.src = data[i].gif;
            newGIF.style.display = "block";
            newGIF.style.marginBottom = "8px";
            targetParagraph.append(newGIF);
            
        }
        //Appending Emoji buttons and counters
        let emojiReactions = [data[i].emoji1, data[i].emoji2, data[i].emoji3]
        for (let j=0; j<3; j++){
            let emojiButton = document.createElement('button');
            let emojiCounter = document.createElement('h5');
            emojiCounter.textContent = emojiReactions[j];
            emojiButton.id = `id${i+1}Emoji${j+1}Btn`
            emojiCounter.id  = `id${i+1}EmojiCounter${j+1}`;
            emojiButton.textContent = `Emoji ${j+1}`
            emojiButton.addEventListener('click', () => 
                {updateReactValue(data[i].id, `emojiButton${j+1}`)
                    emojiButton.disabled = true;
                });
            targetParagraph.append(emojiButton);
            targetParagraph.append(emojiCounter);
        }
        //Appending comment button
        let commentButton = document.createElement('button');
        commentButton.textContent = "show comments"
        commentButton.id = `commentButton${i+1}`
        commentButton.addEventListener('click', () => {
            showCommentSection(i+1);
        });
        targetParagraph.append(commentButton);
        //Adding line breaks
        let lineBreak = document.createElement('br');
        let anotherLineBreak = document.createElement('br');
        targetParagraph.append(lineBreak);
        targetParagraph.append(anotherLineBreak);
        //Appending and displaying comment section if button clicked
        let commentSection = document.createElement('section');
        commentSection.id = `sectionToHide${i + 1}`;
        commentSection.style.display = "none";
        let newHeader = document.createElement('h3');
        newHeader.textContent = "Comments section"
        commentSection.append(newHeader);
        let newCommentArea = document.createElement('textarea');
        newCommentArea.cols = "33";
        newCommentArea.rows = "5";
        newCommentArea.id = "newComment";
        commentSection.append(newCommentArea);
        let yetAnotherLineBreak = document.createElement('br');
        commentSection.append(yetAnotherLineBreak);
        let commentAppendButton = document.createElement('button');
        commentAppendButton.textContent = "Submit your comment";
        commentAppendButton.addEventListener('click', ()=>{
            addAComment(newCommentArea.value, i + 1);
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
    const reponse = await fetch("http://localhost:3000/data", {
        method: "PUT", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonObject)
    });
    reFetchEmojiValue(jsonObject)
}

async function reFetchEmojiValue(object){
    let data = await fetch("http://localhost:3000/data");
    let dataJson = await data.json();
    let id = object.id;
    let buttonValue = object.buttonClicked;
    let requestedArticle = dataJson.find(dataSet => dataSet.id === id);
    if (buttonValue === "emojiButton1"){
        let toUpdate = document.getElementById(`id${id}EmojiCounter1`);
        toUpdate.textContent = requestedArticle.emoji1;
    } else if (buttonValue === "emojiButton2"){
        let toUpdate = document.getElementById(`id${id}EmojiCounter2`);
        toUpdate.textContent = requestedArticle.emoji2;
    } else if (buttonValue === "emojiButton3"){
        let toUpdate = document.getElementById(`id${id}EmojiCounter3`);
        toUpdate.textContent = requestedArticle.emoji3;
    }
}

function addAComment(comment, id){
    let dataToSend = {
        id: id,
        commentContent: comment
    }
    createCommentPutRequest(dataToSend);
}

async function createCommentPutRequest(jsonObject){
    const reponse = await fetch("http://localhost:3000/", {
        method: "PUT", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonObject)
    });
    console.log(jsonObject);
    reFetchComments(jsonObject)
}

async function reFetchComments(){
    let data = await fetch("http://localhost:3000/");
    let dataJson = await data.json();
    let id = object.id;
    let requestedArticle = dataJson.find(dataSet => dataSet.id === id);
    let newComment = document.createElement('p');
    newComment.textContent = requestedArticle.comments[requestedArticle.comments.length - 1];
    targetParagraph.append(newComment);
}

function showCommentSection(id){
    let sectionToShow = document.getElementById(`sectionToHide${id}`);
    let showButton = document.getElementById(`commentButton${id}`);
    let isItShowing = sectionToShow.style.display;
    switch (isItShowing){
        case "block":
            showButton.textContent = "Show Comments";
            sectionToShow.style.display = "none";
            break;
        case "none":
            showButton.textContent = "Hide Comments";
            sectionToShow.style.display = "block";
            break;
    }
}