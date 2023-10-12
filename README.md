# wanikani voice input

Userscript for WaniKani to enable reviews and lessons via voice input using WebSpeech API. More information available on the [WaniKani forums](https://community.wanikani.com/t/userscript-voice-input-using-webspeech-api/62368).

# development

release checklist:

1. build `rm dist/app*; yarn parcel build`
2. test: reviews, lessons, extra study, recent mistakes
3. find and replace tag in userscript: `sed -i "" "s/OLD/NEW/g" dist/wanikani-voice-input.user.js`
4. git add: `git add -f dist/app.js dist/wanikani-voice-input.user.js`
5. git commit
6. git tag
7. git push
8. update `latest` branch
