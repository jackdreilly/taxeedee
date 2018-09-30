from subprocess import check_output
import time

build_command = "gcloud beta builds list --limit=1 --format 'value(status)'".split(' ')

def done():
    output = check_output(build_command)
    print output
    return 'SUCCESS' in output

while True:
    if done():
        break

ssh_command = "gcloud compute ssh  --project=quiklyrics-go reilly -- cd taxeedee && git pull && sh relaunch.sh".split(' ')

check_output(ssh_command)
