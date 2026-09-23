FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

COPY --chown=mssql:root entrypoint.sh /usr/local/bin/holakids-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/holakids-entrypoint.sh \
    && chmod 755 /usr/local/bin/holakids-entrypoint.sh

USER mssql

ENTRYPOINT ["/bin/bash", "/usr/local/bin/holakids-entrypoint.sh"]

