import json
import csv


def convertCsvToJsonArray(csvPath):
    jsonArr = []

    with open(csvPath) as csvFile:
        csvDict = csv.DictReader(csvFile)
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


badJsonPlayers = convertCsvToJsonArray('./FantasyPros_2023_Draft_ALL_Rankings.csv')
goodJsonPlayers = reMapJsonArray(badJsonPlayers)

# for player in goodJsonPlayers:
#     print(player)

with open('./ffp-rankings-underscores.json', 'w') as goodJsonFile:
    goodJsonFile.write(json.dumps(goodJsonPlayers))

# with open('./ffp-rankings.json') as ffp_rankings_file:
#     badJson = json.load(ffp_rankings_file)
#     transformed = [reMapPlayerKeys(player) for player in badJson]
#     [print(player) for player in transformed]
#
#     with open('./ffp-rankings-underscores.json', 'w') as good_json_file:
#         good_json_file.write(json.dumps(transformed))