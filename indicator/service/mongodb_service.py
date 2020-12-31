from pymongo import MongoClient
from bson.objectid import ObjectId

class MongoService ():

    _url = ''
    _db = ''
    _collection = ''

    def __init__(self, log_url, logdb, coll):
        self._url = log_url
        self._db = logdb
        self._collection = coll


    def set_coll(self, coll):
        self._collection = coll


    def original_db_conn(self):
        conn_mongo = MongoClient(self._url)
        mydb = conn_mongo[self._db]
        return mydb


    def original_coll_conn(self):
        conn_mongo = MongoClient(self._url)
        mydb = conn_mongo[self._db]
        mycoll = mydb[self._collection]
        return mycoll


    def Record_Message(self, message):
        mycoll = self.original_coll_conn()
        mycoll.insert(message)


    def Get_Message(self):
        mycoll = self.original_coll_conn()
        for i in mycoll.find():
            print(i)

    def find_count(self, jsonfilter):
        mycoll = self.original_coll_conn()
        return mycoll.count(jsonfilter)


    def upsert(self, doc):
        mycoll = self.original_coll_conn()

        if "id" not in doc.keys():
            result = mycoll.insert_one(doc)
            newid = str(result.inserted_id)
            res = mycoll.update_one({ "_id": ObjectId(newid) },{ "$set":{ "id" : newid } })
            return newid
        else:
            res = mycoll.update_one({ "id": doc["id"] },{ '$set': doc }, upsert=True)
            return doc["id"]


    def delete_one(self, v_id):
        mycoll = self.original_coll_conn()
        mycoll.delete_one({ "id": v_id })


    def find(self, query_dict, sort_by_key="", asc_or_desc="asc", pg=None, pgsize=300):
        mycoll = self.original_coll_conn()
        sorttype = 1 if asc_or_desc == 'asc' else -1
        resp = mycoll.find(query_dict, { '_id': False })
        if sort_by_key != "":
            resp  = resp.sort([(sort_by_key, sorttype)])
        if pg:
            resp  = resp.skip((int(pg)-1) * int(pgsize)).limit(pgsize)
        return [ doc for doc in resp ]


    def find_one(self, query_dict):
        mycoll = self.original_coll_conn()
        resp = mycoll.find_one(query_dict, { '_id': False })
        return resp


    def push(self,doc_id,doc):
        mycoll = self.original_coll_conn()
        mycoll.update_one({ "id": doc_id },{ '$push': doc }, upsert=True)
