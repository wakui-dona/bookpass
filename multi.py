from multiprocessing import Pool
import multiprocessing as multi
import eval_test#オリジナル
import test#オリジナル
import requests as rq
import csv
import time
start_t = time.time()
mega_user = test.mega_user()
#print(time.time()-start_t)
def multi_func(num):
    #mega_user = test.mega_user()
    sample_data = eval_test.get_purchase_dataB(mega_user, num)
    sum_pre1 = 0
    sum_pre2 = 0
    count = 0
    for i in sample_data:
        pre = eval_test.c_precision(i)
        if type(pre) != int:
            sum_pre1 += pre[0]
            sum_pre2 += pre[1]
            count += 1
    if sum_pre1 != 0:
        sum_pre1 = sum_pre1/count
    if sum_pre2 != 0:
        sum_pre2 = sum_pre2/count
    return mega_user[num],sum_pre1, sum_pre2


p = Pool(8)
pre_result = p.map(multi_func, list(range(40)))
p.close()

for j in pre_result:
    print(j[0],",",j[1],",",j[2])
    
#print(time.time()-start_t)
