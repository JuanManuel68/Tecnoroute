import sqlite3

conn = sqlite3.connect('tecnoroute.sqlite3')
cursor = conn.cursor()
cursor.execute('PRAGMA table_info(user_management_userprofile)')

print('Columnas en user_management_userprofile:')
for row in cursor.fetchall():
    print(f'  ID: {row[0]}, Nombre: {row[1]}, Tipo: {row[2]}, NOT NULL: {row[3]}, Default: {row[4]}')

conn.close()
