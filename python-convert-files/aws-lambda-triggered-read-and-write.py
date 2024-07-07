import json
import csv
import urllib.parse
import boto3
from datetime import datetime


jsonBucket = "jaredbennatt.com"
jsonPath = 'draft-helper/data/json/rankings.json'


def lambda_handler(event, context):
    print(json.dumps(event, indent=2))

    firstS3Record = None
    print('Trying to fetch first s3 record from Records array')
    try:
        s3 = boto3.client('s3')
        firstS3Record = event['Records'][0]['s3']
    except Exception as e:
        print(e)
        raise e

    bucket = firstS3Record['bucket']['name']
    key = urllib.parse.unquote_plus(firstS3Record['object']['key'], 'utf-8')

    print(f'trying to fetch: {bucket}/{key}')
    response = None
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print(f"CONTENT TYPE: {response['ContentType']}")
    except Exception as e:
        print(e)
        raise e

    print(f'Trying to read response body from: {bucket}/{key}')
    csvDict = None
    try:
        csvDict = csv.DictReader(response['Body'].read().decode('utf-8').splitlines(True))
    except Exception as e:
        print(e)
        raise e

    jsonReMappedArr = reMapJsonArray(csvDict)
    finalJson = addMetaData(jsonReMappedArr)

    print(f'update date: {finalJson["last_update"]}')
    print(f'first: {jsonReMappedArr[0]}')
    print(f'last: {jsonReMappedArr[-1]}')

    print(f'trying to put json into {jsonBucket}/{jsonPath}')
    try:
        # requires permission: Action s3:PutObject
        s3.put_object(
            ACL='public-read', # requires permission: Action s3:PutObjectAcl
            Body=json.dumps(finalJson, indent=2).encode('utf-8'),
            Bucket=jsonBucket,
            Key=jsonPath,
            ContentType='application/json'
        )
        return "SUCCESS"
    except Exception as e:
        print(e)
        raise e


def reMapPlayerKeys(player):
    newPlayer = {}

    # iterate over keys in each player object
    # remove all spaces by splitting the key on whitespace then joining the
    #   tokens with an underscore
    # update the empty newPlayer object with the "good" key to the "bad" key's value
    for playerKey in player.keys():
        newPlayer['_'.join(playerKey.lower().split())] = player[playerKey]
    return newPlayer


def reMapJsonArray(jsonArr):
    remapped = [reMapPlayerKeys(player) for player in jsonArr]
    # filter out any invalid players
    return [player for player in remapped if player['player']]


def addMetaData(jsonArr):
    return {
        "last_update": str(datetime.today().date())
        , "players": jsonArr

    }
