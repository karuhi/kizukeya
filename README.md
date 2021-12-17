# Kizukeya!
> 絶対に気づかせるための物理通知システム
![kizukeya-light-include-bg](https://user-images.githubusercontent.com/15998572/146478337-b9ebcae4-b158-4043-ae8f-5a73eff862b3.png)


Product of Hack U KOSEN 2021 ([link](https://hacku.yahoo.co.jp/kosen2021/))

Slack <-> Node.js <-> Raspberry Pi(Python)

## Other repository:

- https://github.com/karuhi/ems-rest-api-server

Rest API Server for EMS Pad Control

## How to use this

1. `yarn start`
2. `yarn slack:serve`
3. setting `karuhi/ems-rest-api-server` on Raspberry Pi Zero.
4. `yarn rspi:serve`
5. post on slack channel `SLACK_CHAT_CHANNEL_ID` `!kizukeya`
6. you have recieve electro shock soon :)

```package.json
"rspi:serve": "cd ngrok && ./ngrok http x.x.x.x:3000 --subdomain rspirelay"
```

`x.x.x.x` should be rewritten as per your environment
