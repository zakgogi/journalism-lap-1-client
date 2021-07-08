const request = require('supertest');
// const gifRequest = require('../assets/JavaScript/createPost');
describe('testing output of gif request', () => {
        
    // global.fetch = jest.fn(() =>
    //     Promise.resolve({
    //         json: () => Promise.resolve( {url: "https://media0.giphy.com/media/gw3IWyGkC0rsazTi/200.gif?cid=b830f68392ypab84qul8yfyrhwyw1ey767dl5ugd1eyjs1o3&rid=200.gif&ct=g"})
    //     })
    // );
    let api;
    let query = "test";
    let limit = 15;
    const API_KEY = "MjgWi5LAv7OcAlh9hzV3qtIF8G9eb4o3";
    beforeAll(()=> {
        api = `https://api.giphy.com/v1/gifs/search?q=${query}&rating=g&api_key=${API_KEY}&limit=${limit}`
        // fetch.mockClear();
    })

    test('responds to get with status 200', () => {
        request(api).get('/').expect(200);
    })

    // test('after get request we are returned a gif', () => {
    //     let x = request(api).get('/')
    // })
    // test('finds gifs', async () => {
    //     const returnedGif = await gifRequest.searchGif();
    //     expect(fetch).toHaveBeenCalledTimes(1);
    //     expect(returnedGif).toEqual("https://media0.giphy.com/media/gw3IWyGkC0rsazTi/200.gif?cid=b830f68392ypab84qul8yfyrhwyw1ey767dl5ugd1eyjs1o3&rid=200.gif&ct=g");
        
    // })

})