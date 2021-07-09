const homeJavascript = require('../assets/JavaScript/script');
// const { appendGifs } = require('../assets/JavaScript/createPost');
let mockData = [{
    "title": "Test Title",
    "id": 3,
    "tag": "Lifestyle",
    "article": "Test for date arrangement",
    "date": "2021-07-06T13:55:50.338Z",
    "comments": [
      "hey",
      "something other than hey",
      "whats up"
    ],
    "emoji1": 48,
    "emoji2": 13,
    "emoji3": 8,
    "gif": ""
  }]
let mockWord = "recent";

describe ('main loop creating article correctly', () => {

    beforeEach(()=> {
        document.documentElement.innerHTML = "<section id='recentSort'></section>"
        global.recentTargetParagraph = document.getElementById('recentSort');
    })

    test ('target section contains the article as a paragraph', () => {
        homeJavascript.extractArticles(mockData, mockWord);
        let paraToCheck = document.querySelector("p");
        expect(paraToCheck).toBeTruthy();
        expect(paraToCheck.textContent).toBe("Test for date arrangement");
    })

    test ('target section contains correct title', () => {
        homeJavascript.extractArticles(mockData, mockWord);
        let titleToCheck = document.querySelector('h2');
        expect(titleToCheck).toBeTruthy();
        expect(titleToCheck.textContent).toBe("Test Title");
    })

    test ('target section contains correct date', () => {
        homeJavascript.extractArticles(mockData, mockWord);
        let titleToCheck = document.querySelector('h4');
        expect(titleToCheck).toBeTruthy();
        expect(titleToCheck.textContent).toBe("2021-07-06, 13:55");
    })

    test ('show comment button reveals comment section', () => {
        homeJavascript.extractArticles(mockData, mockWord);
        homeJavascript.showCommentSection(1, mockWord);
        let sectionToShow = document.getElementById(`sectionToHide1recent`);
        expect(sectionToShow.style.display).toBe("block");
    })

})

// describe ('Testing functions on post page', () => {
    
//     beforeEach(()=> {
//         document.documentElement.innerHTML = "<section id='gifSection'></section>"
//         global.sectionToAppend = document.getElementById('gifSection');
//     })

//     test ('Does gif section get displayed', () => {
//         appendGifs(mockData);
//         expect(sectionToAppend.style.display).toBe("block");
//     })


// })