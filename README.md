# webtasks-stock-quotes

To generate this webtask run the following command:

```$ wt create https://raw.githubusercontent.com/dazzabenn/webtasks-stock-quotes/master/quotes.js```

To set on a cron schedule:

```bash
wt cron schedule -n stockcron \ 
 -s tickers=AAPL,MSFT,BP \
 "*/1 * * * *" \
 https://raw.githubusercontent.com/dazzabenn/webtasks-stock-quotes/master/quotes.js
 ```
 
Moify the cron schedule as you see fit. Any number of tickers can be set, they just need to be in a comma separated list and be valid Google stock code symbols.
