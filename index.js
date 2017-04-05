'use strict';

const Hapi = require('hapi');
const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://play.google.com/store/apps/category/GAME/collection/topselling_free';

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8088
});

server.route({
  method: 'GET',
  path: '/game',
  handler: (req, reply) => {

    let url = 'https://play.google.com/store/apps/category/GAME/collection/topselling_free';
    let data_docid;
    request(url, (err, response, body) => {

      if (!err && response.statusCode === 200) {

        let $ = cheerio.load(body);
        let title_game = $('div .card-content');
        let games = [];
        data_docid = $(title_game[2]).attr('data-docid');
        title_game.each(function(i,element) {
        games.push({
            id:$(this).attr('data-docid'),
            img:$(this).find('.cover-image').attr('src'),
            title: $(this).find('.title').attr('title'),
            star: $(this).find('.tiny-star').attr('aria-label'),
          }); 
        });
          reply({games});
      } else {
        reply({
          message: `We're sorry, the requested ${url} was not found on this server.`
        });
      }
    });


    
  }
});

server.start(err => {
  console.log(`Server running at ${server.info.uri}`);
});