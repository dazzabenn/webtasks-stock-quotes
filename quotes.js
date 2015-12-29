"use strict";

var http = require('http');
var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;

function save_quote(quote, db, cb) {
    db
    .collection('quotes')
    .insertOne(quote, function (err, result) {
        if(err) return cb(err);

        console.log('Successfully inserted a document into the quotes collection');

        cb(null);
    });
}

module.exports = function(ctx, done) {
    
    getQuotes(ctx.data.tickers);
    
    function getQuotes(tickerSymbols) {
        http.get({
        host: 'www.google.com',
        port: 80,
        path: '/finance/info?client=ig&q=' + tickerSymbols
    }, function(response) {
        response.setEncoding('utf8');
        var data = "";
                    
        response.on('data', function(chunk) {
            data += chunk;
        });
        
        response.on('end', function() {
            if(data.length > 0) {
                try {
                    var data_object = JSON.parse(data.substring(3));
                } catch(e) {
                    return done(e);
                }
                var quotes = [];
                
                for(var i = 0; i < data_object.length; i++) {
                    var quote = {};
                    
                    quote.ticker = data_object[i].t;
                    quote.exchange = data_object[i].e;
                    quote.price = data_object[i].l_cur;
                    quote.change = data_object[i].c;
                    quote.change_percent = data_object[i].cp;
                    quote.last_trade_time = data_object[i].lt;
                    quote.dividend = data_object[i].div;
                    quote.yield = data_object[i].yld;   
                    
                    quotes.push(quote);
                }
                
                MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
                    if(err) return done(err);

                    var job_list = quotes.map(function (quote) {

                        return function (cb) {
                            save_quote(quote, db, function (err) {
                                if(err) return cb(err);

                                cb(null);
                            });
                        };
                    }); 

                    parallel(job_list, function (err) {
                        if(err) return done(err);

                        done(null, 'Success.');
                    });
              });
            }
        });
    })
}};