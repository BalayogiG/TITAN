from googleapiclient import discovery
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import json
import requests

app= FastAPI()
origins = ["*"]

# cors setting
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {"message":"Welcome to the Cyberbullying detection model"}


@app.post('/DetectCyberbullying')
async def detectcyberbullying(request:Request):
    Response_data = await request.json()
    metrics = []
    comment = Response_data.get('sentence')

    API_KEY = 'AIzaSyBcW4EyV8oXI5TffFZ4VAstX6cNnWVSlJI'

    client = discovery.build(
        "commentanalyzer",
        "v1alpha1",
        developerKey=API_KEY,
        discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
        static_discovery=False,
    )

    analyze_request = {
        'comment': { 'text': comment },
        'requestedAttributes': {'TOXICITY': {}, 'SEVERE_TOXICITY': {}, 'THREAT': {}, 
                'IDENTITY_ATTACK': {}, 'INSULT': {}, 'PROFANITY': {}, }
    }

    response = client.comments().analyze(body=analyze_request).execute()

    labels = list(response['attributeScores'].keys())
    print(labels)
    for lab in labels:
        metrics.append(round(response['attributeScores'].get(lab).get('spanScores')[0].get('score').get('value'),1))
    print(metrics)

    d = dict()
    d['labels'] = labels
    d['metrics'] = metrics
    data = json.dumps(d)
    return data
