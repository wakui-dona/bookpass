from multiprocessing import Pool
import multiprocessing as multi
import eval_test2#オリジナル
import test#オリジナル
import requests as rq
import csv
import time
start_t = time.time()
mega_user = test.mega_user()
#print(time.time()-start_t)
def multi_func(num):
    #mega_user = test.mega_user()
    sample_data = eval_test2.get_purchase_dataB(mega_user, num)
    sum_MAP1 = 0
    sum_MAP2 = 0
    count = 0
    
    pre = eval_test2.c_MAP(sample_data)
    
    return mega_user[num],pre[0], pre[1]


p = Pool(8)
pre_result = p.map(multi_func, list(range(40)))
p.close()

for j in pre_result:
    print(j[0],",",j[1],",",j[2])
    
#print(time.time()-start_t)
