FROM gcr.io/taxeedee-212808/grpc_base
WORKDIR /tmp
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY html/package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install
COPY html/src /tmp/src
COPY html/webpack.config.js /tmp/
RUN node_modules/webpack-cli/bin/cli.js --config webpack.config.js
WORKDIR /app/
COPY html/html static
WORKDIR /app/static
RUN cp /tmp/dist/* ./
RUN rm -rf /tmp/*
WORKDIR /app
COPY web.py ./
ENV STATIC_FOLDER static
ENV CLIENT_ADDR server:50051
ENV port 5000
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["web.py"]