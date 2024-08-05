# TutorBot

This is a simple chatbot that can answer questions about the content of videos in a youtube playlist. I created it to be an online assistant for my music tutorial videos, but it would work for any youtube video content. 

## Technology Used

- react
- vite
- flask
- openai
- llama-index
- youtube-transcript-api
- google-api-python-client
- formik
- yup
- semantic-ui

You will need to get API Keys for both Youtube and OpenAI. 

For Youtube, go to https://console.cloud.google.com/apis/ and click "Enable APIS and Services", search for Youtube API, and then click enable. 
Then you will be able to create an API key to use with your googleapiclient.

For OpenAI go to https://platform.openai.com/docs/api-reference/introduction and follow the instructions and create an account if you need to. 
Then you will be able to create a project and secret key for it here:
https://platform.openai.com/api-keys

You can see the usage patterns for LLamaIndex's Chat Engine - Condense Question mode here, as well as documentation on other modes and usages:
https://docs.llamaindex.ai/en/stable/examples/chat_engine/chat_engine_condense_question/

Thanks to Daniel Crouthamel for his excellent Medium blog post which I used as the basis for this app.
https://medium.com/@bSharpML/summarize-youtube-videos-with-llamaindex-part-2-baaac5a7d0cd

If you want to check out the documentation for the libraries used you can find them here:

https://pypi.org/project/openai/
https://pypi.org/project/youtube-transcript-api/


https://pypi.org/project/llama-index/
https://pypi.org/project/google-api-python-client/
https://react.semantic-ui.com/usage/
https://www.npmjs.com/package/yup
https://www.npmjs.com/package/formik
