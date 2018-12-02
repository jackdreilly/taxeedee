#!/bin/sh
rm -rf $COMMENTS_DB_PATH
pipenv run download
pipenv run migrate