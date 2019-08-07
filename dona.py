import requests as rq
import csv

URL = "https://stg-bookpass-recommend-api.team-rec.jp/recommend.csv?user_id=0001759628&frame_id=9998&item_id="
#print(URL+'LT000033312000434530')
#r = rq.get(URL+'LT000033312000434530')
r = rq.get(URL+'LT000033312000434530')
print(len(r.headers))
read_text=r.text[2:]
csv_file=r.text[2:].split("\r\n")

for i in range(len(csv_file)):
    csv_file[i]=csv_file[i].split(",")
    
print(len(csv_file))
print(csv_file[:5])
print(type(r))
