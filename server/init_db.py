#!/usr/bin/python
# -*- coding: utf-8

import sqlite3

conn = sqlite3.connect('syncdb.db')
c = conn.cursor()
c.execute('''CREATE TABLE sync (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,  user_id INTEGER, src text, cur_time text)''')
c.execute('''CREATE TABLE users (user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name text, password text)''')
conn.commit()
conn.close()
