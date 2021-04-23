#!/usr/bin/python
from configparser import ConfigParser

import psycopg2

db_conn = None

def config(filename='datastore.ini', section='postgresql'):
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db


def get_db_conn():
    try:
        if db_conn is None:
            params = config()
            db_conn = psycopg2.connect(**params)
            return db_conn
        else:
            return db_conn
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

def create_tables():
    """ Enable PostgreSQL Cube extension for face search and create tables  """

    commands = (
        """
        CREATE EXTENSION IF NOT EXISTS cube;
        """,
        """
        CREATE TABLE IF NOT EXISTS friends (
            id SERIAL PRIMARY KEY,
            face_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            FOREIGN_KEY (face_id) REFERENCES faces (id),
            last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS visitors (
            id SERIAL PRIMARY KEY,
            friend_id INTEGER NULL,
            face_id INTEGER NOT NULL,
            FOREIGN KEY (face_id) REFERENCES faces (id),
            visit_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """ CREATE TABLE IF NOT EXISTS faces (
            id SERIAL PRIMARY KEY,
            image_url TEXT NULL,
            vec_low cube,
            vec_high cube
        )
        """,
        """ CREATE INDEX faces_idx on faces (vec_low, vec_high);
        """
    )

    try:
        conn = get_db_conn()
        cur = conn.cursor()

        # create table one by one
        for command in commands:
            cur.execute(command)
        
        # close communication with the PostgreSQL database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()