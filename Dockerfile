FROM gcr.io/taxeedee-212808/grpc_base
RUN apk add git
WORKDIR /tmp
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY html/package* /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install
COPY html/ /tmp/
RUN npm run build
WORKDIR /app/
RUN cp -rf /tmp/build static
RUN rm -rf /tmp/*
COPY *.py ./
COPY posts posts
RUN pip install -e git+https://github.com/jackdreilly/taxeedee_service#egg=taxeedee_service --src ./
COPY templates templates
ENV STATIC_FOLDER static
ENV CLIENT_ADDR server:50051
ENV port 5000
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["web.py"]
