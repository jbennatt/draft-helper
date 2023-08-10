import json
import csv
import urllib.parse
import boto3


def convertCsvToJsonArray(csvDict):
    jsonArr = []

    for row in csvDict:
        jsonArr.append(row)

    return jsonArr


def reMapPlayerKeys(player):
    newPlayer = {}
    # print(f're-mapping {player}')
    for playerKey in player.keys():
        # print(f're-mapping {playerKey} to {"_".join(playerKey.lower().split())}')
        newPlayer['_'.join(playerKey.lower().split())] = player[playerKey]
    return newPlayer


def reMapJsonArray(jsonArr):
    return [reMapPlayerKeys(player) for player in jsonArr]


s3 = boto3.client('s3')

jsonBucket = "jaredbennatt.com"
jsonPath = 'draft-helper/data/json/rankings.json'


def lambda_handler(event, context):
    firstS3Record = event['Records'][0]['s3']
    bucket = firstS3Record['bucket']['name']
    key = urllib.parse.unquote_plus(firstS3Record['object']['key'], 'utf-8')

    print(f'trying to fetch: {bucket}/{key}')

    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print(f"CONTENT TYPE: {response['ContentType']}")

        csvDict = csv.DictReader(response['Body'].read().decode('utf-8').splitlines(True))
        badJson = convertCsvToJsonArray(csvDict)
        goodJson = reMapJsonArray(badJson)

        print(f'first: {goodJson[0]}')
        print(f'last: {goodJson[-1]}')

        print(f'trying to put json into {jsonBucket}/{jsonPath}')

        s3.put_object(
            Body=json.dumps(goodJson, indent=2).encode('utf-8'),
            Bucket=jsonBucket,
            Key=jsonPath
        )
        return "SUCCESS"
    except Exception as e:
        print (e)
        print(f'Error getting object {key} from bucket {bucket}')
        raise e