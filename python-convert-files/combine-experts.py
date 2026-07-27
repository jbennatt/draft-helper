import csv
import os
import string
from collections import deque

    
ranking_name = 'FantasyPros_2024_Draft_ALL_Rankings.csv'
master_label = 'master'
QB = 'QB'
WR = 'WR'
RB = 'RB'
TE = 'TE'
K = 'K'
DST = 'DST'
positions = {QB, WR, RB, TE, K, DST}
dirs = {
    QB: 'qb',
    WR: 'wr',
    RB: 'rb',
    TE: 'te',
    K: 'pk',
    DST: 'dst',
}

name_field = 'PLAYER NAME'
rank_field = 'RK'
team_field = 'TEAM'
pos_field = 'POS'


_drive = 'E:'
_root_dir = '/Fantasy Football/2024 ADP CSVs/2024 testing'
os.chdir(_drive)
os.chdir(_root_dir)


def get_csv(pos_folder):
    with open(os.path.relpath(f'{pos_folder}/{ranking_name}'), 'r') as csv_file:
        return list(csv.DictReader(csv_file))
    


def get_pos(player):
    return player[pos_field].rstrip(string.digits)


def get_pos_deque(pos, player_rankings):
    return deque([player for player in player_rankings if get_pos(player) == pos])


def get_best_player(player, master_deques, pos_deques):
    pos = get_pos(player)
    if(pos_deques[pos]):
        _player_name = pos_deques[pos][0][name_field]
        master_deques[pos] = deque([_player for _player in master_deques[pos] if _player[name_field] != _player_name])
        return pos_deques[pos].popleft()
    else:
        return master_deques[pos].popleft()


master = get_csv(master_label)
experts = {}
for pos, dir in dirs.items():
    experts[pos] = get_pos_deque(pos, get_csv(dir))
    
master_positions = {}
for pos in positions:
    master_positions[pos] = get_pos_deque(pos, master)
    
# for key in experts:
    # print(f'{key}: {len(experts[key])}')
    
# for key in master_positions:
    # print(f'master: {key} - {len(master_positions[key])}')
    
    
final_ranking = [get_best_player(player, master_positions, experts) for player in master]

print(f'{name_field},{pos_field},{team_field},{rank_field}')
for player in final_ranking:
    print(f'{player[name_field]},{player[pos_field]},{player[team_field]},{player[rank_field]}')

def foo():
    return [{
        name_field: player[name_field],
        team_field: player[team_field],
        pos_field: player[pos_field],
        rank_field: player[rank_field]
    } for player in final_ranking]