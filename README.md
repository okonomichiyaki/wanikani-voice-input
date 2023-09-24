# wanikani voice input

Userscript for WaniKani to enable reviews and lessons via voice input using WebSpeech API. More information available on the [WaniKani forums](https://community.wanikani.com/t/userscript-voice-input-using-webspeech-api/62368).

# development

release process:

1. find and replace tag in userscript: `sed -i "" "s/OLD/NEW/g" dist/wanikani-voice-input.user.js`
2. build `yarn parcel build`
3. git add: `git add -f dist/app.js dist/wanikani-voice-input.user.js`
4. git commit
5. git tag
6. git push
7. (test)
8. update `latest` branch
