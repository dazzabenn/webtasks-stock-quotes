# webtasks-stock-quotes

To generate this webtask run the following command:

```bash
$ wt create https://raw.githubusercontent.com/dazzabenn/webtasks-stock-quotes/master/quotes.js \
--name quotes \
--secret MONGO_URL=mongodb://stock:test@ds037195.mongolab.com:37195/stock-quotes
```

To set on a cron schedule:

```bash
$ wt cron schedule -n stockcron \ 
 -s tickers=AAPL,MSFT,BP \
 "*/1 * * * *" \
 https://raw.githubusercontent.com/dazzabenn/webtasks-stock-quotes/master/quotes.js \
 --secret MONGO_URL=mongodb://stock:test@ds037195.mongolab.com:37195/stock-quotes
 ```

> This will schedule a collection of stock symbols from Google Finance every minute and insert the results into a MongoDB database.
 
Moify the cron schedule as you see fit. Any number of tickers can be set, they just need to be in a comma separated list and be valid Google stock code symbols.
