import csv
import time

start_t = time.time()

#user_id="209748108"

def user_listup():
    f = open('result.csv', 'r')
    csv_file = csv.reader(f)
    data = []
    for record in csv_file:
        data.append(record[1])
    data = list(dict.fromkeys(data))
    return data[1:]
    
def user_extracter(user_id):
    f = open('result.csv', 'r')
    csv_file = csv.reader(f)
    data = []
    count = 0
    for record in csv_file:
        if(record[1] == user_id):
            data.append(record)
    return data

def what_you_bought(user_id):
    data_list = user_extracter(user_id)
    data=[]
    for record in data_list:
        data.append(record[2])
    return data

#Aでは[商品,[それ以外の購入商品]]
def make_sample_dataA(user_id):
    items = what_you_bought(user_id)
    data=[]
    counter=0
    for item in items:
        tmp = []
        tmp.extend(items[:counter])
        tmp.extend(items[counter+1:])
        data.append([item, tmp])
        counter+=1
    return data

#Bでは[商品,[それ以降の購入商品]]
#それ以降の購入商品＝リコメンドの影響を受けて買った（かもしれない）商品
def make_sample_dataB(user_id):
    items = what_you_bought(user_id)
    data=[]
    counter=0
    for item in items:
        tmp = []
        tmp.extend(items[counter+1:len(items)])
        data.append([item, tmp])
    return data

def mega_user():
    user_l = user_listup()
    mega_user = []
    counter = 0
    for i in range(1000):
        item_l = what_you_bought(user_l[i])
        if len(item_l) > 20:
            mega_user.append(user_l[i])
            counter += 1
        if counter == 40:
            break
    return mega_user

#user_list = user_listup()

#select user here
#user_id=user_list[96616]

#sample_data = make_sample_dataA(user_id)
#print(sample_data[0],"\n and more")
#print("sample :", len(sample_data))
#print("fin:", time.time() - start_t)



