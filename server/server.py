#!/usr/bin/python
# -*- coding: utf-8

import signal
import sys
import ssl
import sqlite3
import json
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser

clients = []


class SimpleChat(WebSocket):

    def handleMessage(self):
        data = json.loads(self.data)
        print data
        try:
            if 'saveTime' in data:
                print data['saveTime']['user_id']
                print data['saveTime']['curTime']
                print data['saveTime']['src']
                c.execute("INSERT INTO sync(user_id, src, cur_time) VALUES (?,?,?)", (data['saveTime']['user_id'], data['saveTime']['src'], data['saveTime']['curTime']))
                id_sync = c.lastrowid
                self.sendMessage(u'{"saveTime":%s}' % id_sync)
                conn.commit()

            elif 'loadTime' in data:
                print data['loadTime']['user_id']
                c.execute("SELECT src, cur_time FROM sync WHERE user_id = ?", [data['loadTime']['user_id']])
                DBres = c.fetchall()
                print DBres
                src_a = DBres[len(DBres) - 1][0]
                curTime_a = DBres[len(DBres) - 1][1]
                print src_a, curTime_a
                self.sendMessage(u'{"loadTime":{"src":"%s", "cur_time":%s}}' % (src_a, curTime_a))

            elif 'login' in data:
                l_name = data['login']['username']
                l_password = data['login']['password']
                c.execute("SELECT user_id FROM users WHERE name = ? AND password = ?", (l_name, l_password))
                dataDB = c.fetchall()
                print l_name, l_password, dataDB
                print len(dataDB)
                print len(dataDB) == 0
                if len(dataDB) == 0:
                    print('Bad crendel! %s' % l_name)
                    self.sendMessage(u'{"login": {"message": "Bad crendel!"}')
                    self.sendMessage(u'{"login": {"message": "Bad crendel! %s"}}' % l_name)
                else:
                    print dataDB[0][0]
                    print('It\'s good crendel! %s injoy! user_id: %s' % (l_name, dataDB[0][0]))
                    self.sendMessage(u'{"login": {"message": "It\'s good crendel! %s injoy!", "user_id" : %s}}' % (l_name, dataDB[0][0]))

            elif 'reg' in data:
                r_name = data['reg']['username']
                print r_name
                r_pass = data['reg']['password']
                print r_pass
                c.execute("INSERT INTO users(name, password) VALUES (?,?)", (r_name, r_pass))
                id_user = c.lastrowid
                print(id_user)
                conn.commit()
                self.sendMessage(u'{"registration": {"message": %s}}"' % id_user)

            else:
                for client in clients:
                    if client != self:
                        client.sendMessage(self.data)
        except Exception:
            print 'Exception!!'

    def handleConnected(self):
        print (self.address, 'connected')
        for client in clients:
            client.sendMessage(self.address[0] + u' - connected')
        clients.append(self)

    def handleClose(self):
        clients.remove(self)
        print (self.address, 'closed')
        for client in clients:
            client.sendMessage(self.address[0] + u' - disconnected')


if __name__ == "__main__":

    parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
    parser.add_option("--host", default='', type='string',
                      action="store", dest="host", help="hostname (localhost)")
    parser.add_option("--port", default=8000, type='int',
                      action="store", dest="port", help="port (8000)")
    parser.add_option("--example", default='echo', type='string',
                      action="store", dest="example", help="echo, chat")
    parser.add_option("--ssl", default=0, type='int', action="store",
                      dest="ssl", help="ssl (1: on, 0: off (default))")
    parser.add_option("--cert", default='./cert.pem', type='string',
                      action="store", dest="cert", help="cert (./cert.pem)")
    parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1,
                      type=int, action="store", dest="ver", help="ssl version")

    (options, args) = parser.parse_args()

    conn = sqlite3.connect('syncdb.db')
    c = conn.cursor()
    cls = SimpleChat

    if options.ssl == 1:
        server = SimpleSSLWebSocketServer(
            options.host, options.port, cls, options.cert, options.cert, version=options.ver)
    else:
        server = SimpleWebSocketServer(options.host, options.port, cls)

    def close_sig_handler(signal, frame):
        server.close()
        conn.commit()
        conn.close()
        sys.exit()

    signal.signal(signal.SIGINT, close_sig_handler)

    server.serveforever()
