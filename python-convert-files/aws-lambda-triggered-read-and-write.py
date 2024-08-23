import json
import csv
import urllib.parse
import boto3
import dateutil.tz as tz
from datetime import datetime


jsonBucket = "jaredbennatt.com"
jsonPath = 'draft-helper/data/json/rankings.json'

adpKeys = {'Sleeper', 'Yahoo', 'RTSports'}


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
    csvDictReader = None
    try:
        csvDictReader = csv.DictReader(response['Body'].read().decode('utf-8').splitlines(True))
    except Exception as e:
        print(e)
        raise e

    jsonReMappedArr = mapCsvToJson(csvDictReader)
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
    

def isAdpCsv(csvDictReader):
    return len(set(csvDictReader.fieldnames).intersection(adpKeys)) > 0


def mapCsvToJson(csvDictReader):
    if(isAdpCsv(csvDictReader)):
        remapped = [normalize_adp_csv(index, record) for index, record in enumerate(csvDictReader)]
    else:
        remapped = [normalize_csv_input(player) for player in csvDictReader]
    
    # filter out any invalid players
    return [player for player in remapped if player['player_name']]


def addMetaData(jsonArr):
    return {
        "last_update": datetime.now(tz.gettz('America/Chicago')).strftime('%m/%d/%Y %I:%M %p %Z')
        , "players": jsonArr

    }


# this function will need to be updated every year, when the CSV headings change to re-normalize to these:
#
# player_name
# rk (rank)
# pos (position)
# team
def normalize_csv_input(csv_record):
    new_record = {}

    new_record['player_name'] = csv_record['PLAYER NAME']
    new_record['rk'] = csv_record['RK']
    new_record['pos'] = csv_record['POS']
    new_record['team'] = csv_record['TEAM']

    return new_record


def normalize_adp_csv(list_index, adp_record):
    new_record = {}

    new_record['player_name'] = adp_record['Player']
    new_record['rk'] = list_index + 1
    new_record['pos'] = adp_record['POS']
    new_record['team'] = adp_record['Team']

    return new_record