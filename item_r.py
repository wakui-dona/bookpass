Afrom multiprocessing import Pool
import multiprocessing as multi
import eval_test
import test
import requests as rq
import csv
import time
start_t = time.time()

URL = "https://stg-bookpass-recommend-api.team-rec.jp/recommend.csv?user_id=0001759628&frame_id=9998&item_id="

item_id = "BT000026070107407401"

def who_buy_this(_item_id):
    f = open('result.csv', 'r')
    csv_file = csv.reader(f)
    data = []
    for record in csv_file:
        if(record[2] == _item_id):
            data.append(record[1])
    return data


def item_relation(p_of_1, p_of_2):
    one_and_two = list(set(p_of_1) & set(p_of_2))
    return len(one_and_two), len(p_of_1), len(one_and_two)/len(p_of_1)


p_item1 = who_buy_this(item_id)    

#レコメデータの取得(始)
r = rq.get(URL + item_id)
if (len(r.headers) != 11):
    print("No data about", item_id)
    exit(0)
csv_file = r.text[2:].split("\r\n")
for i in range(len(csv_file)):
    csv_file[i] = csv_file[i].split(",")
#レコメデータの取得(終)

result_data = []
for i in range(100,110):
    p_item2 = who_buy_this(csv_file[i][2])
    tmp = item_relation(p_item1, p_item2)
    result_data.append(tmp)
    print(tmp)
    print(i+1," : ",time.time()-start_t)
