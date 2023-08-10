import json
import csv
import urllib.parse
import boto3


jsonBucket = "jaredbennatt.com"
jsonPath = 'draft-helper/data/json/rankings.json'


def lambda_handler(event, context):
    print(json.dumps(event, indent=2))
    s3 = boto3.client('s3')
    firstS3Record = event['Records'][0]['s3']
    bucket = firstS3Record['bucket']['name']
    key = urllib.parse.unquote_plus(firstS3Record['object']['key'], 'utf-8')
    
    print(f'trying to fetch: {bucket}/{key}')
    
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print(f"CONTENT TYPE: {response['ContentType']}")
        
        csvDict = csv.DictReader(response['Body'].read().decode('utf-8').splitlines(True))
        jsonReMapped = reMapJsonArray(csvDict)
        
        print(f'first: {jsonReMapped[0]}')
        print(f'last: {jsonReMapped[-1]}')
        
        print(f'trying to put json into {jsonBucket}/{jsonPath}')
        
        # requires permission: Action s3:PutObject
        s3.put_object(
            ACL='public-read', # requires permission: Action s3:PutObjectAcl
            Body=json.dumps(jsonReMapped, indent=2).encode('utf-8'),
            Bucket=jsonBucket,
            Key=jsonPath,
            ContentType='application/json'
            )
        return "SUCCESS"
    except Exception as e:
        print (e)
        print(f'Error getting object {key} from bucket {bucket}')
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
    return [reMapPlayerKeys(player) for player in jsonArr]  