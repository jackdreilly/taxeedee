from subprocess import check_output, Popen, PIPE
import time

ssh_command = "gcloud compute ssh --project=quiklyrics-go reilly --zone us-central1-c -- cd /home/jackdreilly_gmail_com/taxeedee && git pull && sh relaunch.sh".split(' ')

import sys
process = Popen(ssh_command, stdout=PIPE)
for c in iter(lambda: process.stdout.read(1), ''):
    sys.stdout.write(c)
