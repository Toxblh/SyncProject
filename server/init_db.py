#!/usr/bin/python
# -*- coding: utf-8

import sqlite3

conn = sqlite3.connect('syncdb.db')
c = conn.cursor()
c.execute('''CREATE TABLE sync (id text, name text, url text, time text)''')
c.execute("INSERT INTO sync VALUES ('1','Test.MP3','test.mp3','14')")
conn.commit()
conn.close()
