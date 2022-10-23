import random
import pandas as pd
from itertools import zip_longest
from sklearn.ensemble import RandomForestClassifier


def sample_data(n: int):
    moves = ['rock', 'paper', 'scissors']
    data = {}
    for i in range(1, n):
        data[f'round_{i}:p1'] = random.choice(moves)
        data[f'round_{i}:p2'] = random.choice(moves)
    data['round'] = n
    return data


def move_to_ordinal(move: str) -> int:
    conversion = {
        'rock': 0,
        'paper': 1,
        'scissors': 2
    }
    return conversion[move]


def to_dataframe(data, window_size):
    p1 = [move_to_ordinal(data[f'round_{i}:p1']) for i in range(1, data['round'])]
    p2 = [move_to_ordinal(data[f'round_{i}:p2']) for i in range(1, data['round'])]
    scores = [0 if x[0] == x[1] else -1 if x[0] == 2 and x[1] ==
              0 else 1 if x[0] > x[1] else -1 for x in zip_longest(p1, p2)]
    df = pd.DataFrame({
        'p1': p1,
        'p2': p2,
        'scores': scores,
    })
    for i in range(1, window_size + 1):
        df[f'p1-{i}'] = df.p1.shift(i)
        df[f'p2-{i}'] = df.p2.shift(i)
    df.drop(columns=['p2'])  # Don't want to predict based on what the opponent actually chose in the current round
    df.dropna(inplace=True)
    return df


def train(df):
    clf = RandomForestClassifier(n_jobs=-1, random_state=0)
    clf.fit(df, df['p1'])
    return clf
