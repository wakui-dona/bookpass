import test
import requests as rq
import csv
import time

start_t = time.time()

URL = "https://stg-bookpass-recommend-api.team-rec.jp/recommend.csv?user_id=0001759628&frame_id=9998&item_id="

#user_list = test.user_listup()
#print(len(user_list))

def get_purchase_dataA(user_list, user_num):
    user_id = user_list[user_num]
    sample_data = test.make_sample_dataA(user_id)
    return sample_data

def get_purchase_dataB(user_list, user_num):
    user_id = user_list[user_num]
    sample_data = test.make_sample_dataB(user_id)
    return sample_data

def get_rcm_data(item_id):
    r = rq.get(URL + item_id)
    if (len(r.headers) != 11):
        return -1
    csv_file=r.text[2:].split("\r\n")
    for i in range(len(csv_file)):
        csv_file[i] = csv_file[i].split(",")
    return csv_file


def c_precision(purchase):
    item_id = purchase[0]
    #中身見たいとき用
    #print(item_id)
    reccomend = get_rcm_data(item_id)
    if(type(reccomend) == int):
        return -1
    if(len(reccomend)<200):
        #弾かれたアイテム見たいとき用
        #print(item_id)
        return -1
    reccomend_data_3007=[]
    reccomend_data_3008=[]
    for i in range(10):
        reccomend_data_3007.append(reccomend[i][2])
        reccomend_data_3008.append(reccomend[i+100][2])
    #print(reccomend_data_3007)
    #print(reccomend_data_3008)
    purchase_data = purchase[1]
    r_and_p_3007 = list(set(reccomend_data_3007) & set(purchase_data))
    r_and_p_3008 = list(set(reccomend_data_3008) & set(purchase_data))
    #結果見たいとき用
    #print(r_and_p_3007,"\n")
    return len(r_and_p_3007)/len(reccomend_data_3007), len(r_and_p_3008)/len(reccomend_data_3008)
    
def c_AP(purchase):
    serise_AP = 0
    single_AP = 0
    item_id = purchase[0]
    reccomend = get_rcm_data(item_id)
    if(type(reccomend) == int):
        return -1
    if(len(reccomend)<200):
        #print(item_id)
        return -1
    reccomend_data=[]
    for i in range(120):
        reccomend_data.append(reccomend[i][2])
    purchase_data = purchase[1]
    del reccomend_data[10:100]
    del reccomend_data[20:]
    #ここまではPrecisionと同じ操作
    counter1=1
    for i in range(10):
        if(reccomend_data[i] in purchase_data):
            serise_AP += counter1/(i+1)
            counter1 += 1
    counter2=1
    for i in range(10,20):
        if(reccomend_data[i] in purchase_data):
            single_AP += counter2/(i-9)
            counter2 += 1
    if serise_AP != 0:
        serise_AP = serise_AP/(counter1-1)
    if single_AP != 0:
        single_AP = single_AP/(counter2-1)
    return serise_AP, single_AP

def c_MAP(sample_data):
    counter = 0
    serise_AP = 0
    single_AP = 0
    for i in range(len(sample_data)):
        AP = c_AP(sample_data[i])
        if(type(AP) != int):
            serise_AP += AP[0]
            single_AP += AP[1]
            counter += 1
    if counter != 0:
        serise_AP = serise_AP / counter
        single_AP = single_AP / counter
    return serise_AP, single_AP



def c_GMAP(sample_data):
    counter = 0
    serise_AP = 0
    single_AP = 0
    for i in range(len(sample_data)):
        AP = c_AP(sample_data[i])
        if(type(AP) != int):
            serise_AP *= AP[0]
            single_AP *= AP[1]
            counter += 1
    return serise_AP**(1/counter), single_AP**(1/counter)
    
#任意のユーザの購買履歴抽出
#sample_data = get_purchase_dataB(user_list,96616)


"""
#precision の平均を求める
sum_pre = 0
count = 0
for i in range(20):
    pre = c_precision(sample_data[i])
    if pre!=-1:
        sum_pre += pre
        count += 1
print(sum_pre/count)
"""

"""
#APを求める
AP = c_AP(sample_data[8])
print(AP[0],AP[1])
"""
"""
#MAPを求める
MAP = c_MAP(sample_data)
print(MAP)


#GMAPを求める
GMAP = c_GMAP(sample_data)
print(GMAP)

print(time.time()-start_t)
"""
