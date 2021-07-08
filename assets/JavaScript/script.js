window.onload = function() {
    getAllData("recent");
    getAllData("popular");
  };



async function getAllData(word){
    let data = await fetch("https://journalism-project-lap-1.herokuapp.com/data");
    let dataJson = await data.json();
    extractArticles(dataJson, word);
}

function applyClasses(target){
    target.classList.add('d-flex');
    target.classList.add('justify-content-center');
}

function determineStyleClass(target, tag){
    switch (tag){
        case "Sport": 
            target.classList.add('sportSection');
            break;
        case "Music":
            target.classList.add('musicSection');
            break;
        case "Lifestyle":
            target.classList.add('lifestyleSection');
            break;
        case "Film":
            target.classList.add('filmSection');
            break;
        case "News": 
            target.classList.add('newsSection');
            break;
        case "Other":
            target.classList.add('otherSection');
            break;
    }
};
function extractArticles(data, word){
    let recentTargetParagraph = document.getElementById("recentSort");
    let popularTargetParagraph = document.getElementById("popularSort");
    let targetParagraph;
    if (word === "recent"){
        data.sort((a, b) => {
            let da = new Date(a.date),
            db = new Date(b.date);
            return db - da;
        }); 
        targetParagraph = recentTargetParagraph;  
    } else {
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
        targetParagraph = popularTargetParagraph;
    }

    for (let i=0; i<data.length; i++){
        let sectionToStyle = document.createElement('div');
        determineStyleClass(sectionToStyle, data[i].tag);
        //Appending article title
        let titleHeader = document.createElement('h2');
        titleHeader.textContent = data[i].title;
        applyClasses(titleHeader);
        sectionToStyle.append(titleHeader);
        //Appending date and time
        let timeStamp = document.createElement('h4');
        let timeStampYear = data[i].date.slice(0,10);
        let timeStampTime = data[i].date.slice(11,16);
        timeStamp.textContent = `${timeStampYear}, ${timeStampTime}`
        applyClasses(timeStamp);
        sectionToStyle.append(timeStamp);
        //Append Article itself
        let para = document.createElement('p');
        para.textContent = data[i].article;
        applyClasses(para);
        sectionToStyle.append(para);
        //Append Gif
        if (data[i].gif){
            let newGIF = document.createElement('img');
            newGIF.src = data[i].gif;
            newGIF.style.display = "block";
            newGIF.style.marginBottom = "8px";
            newGIF.classList.add('mx-auto');

            sectionToStyle.append(newGIF);
            
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
            emojiButton.id = `id${i+1}${word}Emoji${j+1}Btn`
            emojiCounter.id  = `id${i+1}${word}EmojiCounter${j+1}`;
            // emojiButton.textContent = `Emoji ${j+1}`
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
                {updateReactValue(data[i].id, `emojiButton${j+1}`, word)
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
        commentImage.id = `commentImage${i+1}${word}`;
        commentImage.setAttribute('src', './assets/images/EmptyChatBubble.png')
        commentButton.append(commentImage);
        commentButton.id = `commentButton${i+1}${word}`
        commentButton.addEventListener('click', () => {
            showCommentSection(i+1, word);
        });
        buttonSection.append(commentButton);
        sectionToStyle.append(buttonSection);
        //Adding line breaks
        let lineBreak = document.createElement('br');
        let anotherLineBreak = document.createElement('br');
        sectionToStyle.append(lineBreak);
        sectionToStyle.append(anotherLineBreak);
        //Appending and displaying comment section if button clicked
        let commentSection = document.createElement('section');
        commentSection.id = `sectionToHide${i + 1}${word}`;
        commentSection.style.display = "none";
        commentSection.classList.add('text-center');
        let newHeader = document.createElement('h3');
        newHeader.textContent = "Comments section"
        commentSection.append(newHeader);
        let newCommentArea = document.createElement('textarea');
        newCommentArea.cols = "33";
        newCommentArea.rows = "2";
        newCommentArea.maxLength = 100;
        newCommentArea.id = "newComment";
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
            newCommentArea.value = "";
        })
        commentSection.append(commentAppendButton);
        if (data[i].comments){
            for (let j=0; j<data[i].comments.length; j++){
                let comment = document.createElement('p');
                comment.textContent = data[i].comments[j];
                commentSection.append(comment);
                
            } 
        }
        sectionToStyle.append(commentSection);
        targetParagraph.append(sectionToStyle);
    }
};


function updateReactValue(id, buttonString, word){
    let dataToSend = {
        id: id,
        buttonClicked: buttonString,
        word: word
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


function showCommentSection(id, word){
    let sectionToShow = document.getElementById(`sectionToHide${id}${word}`);
    let showButton = document.getElementById(`commentButton${id}${word}`);
    let showButtonImage = document.getElementById(`commentImage${id}${word}`)
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

module.exports = {
    extractArticles,
    showCommentSection
}