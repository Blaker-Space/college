import os
import random
import time

SNOW_DENSITY = 10
DELAY = .1

snowflakes = ['❄️','❅','❆','❊','❈','❅']

term = os.get_terminal_size()

w = term.columns
h = term.lines


grid=[]

for _ in range (h):
    grid.append([' ']*w)

def draw_grid():
    os.system('cls' if os.name == 'nt' else 'clear')
    print('\033|?25l')
    output = ''

    for row in grid:
        output += ''.join(row)+'\n'
        output.strip('\n')
        print(output,end='')

while True:
    row = []

    for _ in range(w):
        if random.random() < SNOW_DENSITY / 100:
            row.append(random.choice(snowflakes))
        else:
            row.append(' ')

    grid.insert(0,row)
    grid.pop()


    draw_grid()
    time.sleep(DELAY)
