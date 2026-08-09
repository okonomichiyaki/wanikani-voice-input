# wanikani voice input

Userscript for WaniKani to enable reviews and lessons via voice input using WebSpeech API. More information available on the [WaniKani forums](https://community.wanikani.com/t/userscript-voice-input-using-webspeech-api/62368).

# development

1. install [this local script](https://github.com/okonomichiyaki/wanikani-voice-input/raw/refs/heads/latest/development/wanikani-voice-input-dev.user.js) and modify the @require path to point to your local clone
2. build: `rm dist/app*; yarn parcel build`
3. browser should now load the latest local build

# release:

1. build `rm dist/app*; yarn parcel build`
2. test (using local development script): reviews, lessons, extra study, recent mistakes
3. find and replace previous tag in userscript:
`OLD=$(grep version release/wanikani-voice-input.user.js | grep -o "[[:digit:]\.]\+")`
`NEW=x.y.z`
`sed -i "" "s/$OLD/$NEW/g" release/wanikani-voice-input.user.js`
4. copy to release dir: `cp dist/* release`
4. git add: `git add release/app.js release/wanikani-voice-input.user.js`
5. git commit
6. git tag $NEW
7. git push
8. update `latest` branch to point to $NEW
