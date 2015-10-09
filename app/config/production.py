import socket

DEFAULT_MAIL_SENDER = 'www-data@%s' % socket.getfqdn()

ADMIN_RECIPIENTS = ['jl4397@columbia.edu']
ERROR_EMAIL = 'jl4397@columbia.edu'

# dd bs=1 count=32 if=/dev/random |pbcopy
SECRET_KEY = ''
