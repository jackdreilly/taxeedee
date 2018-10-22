FROM gcr.io/taxeedee-212808/grpc_base as gitted
RUN apk add git

FROM gitted as npmed
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

FROM npmed as serviced
RUN pip install -e git+https://github.com/jackdreilly/taxeedee_service#egg=taxeedee_service --src ./

FROM serviced
COPY *.py ./
COPY posts posts
COPY locations locations
COPY templates templates
COPY metrics metrics
ENV STATIC_FOLDER static
ENV CLIENT_ADDR server:50051
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017
ENV port 5000
ENV EMAIL_PASSWORD junkpassword
ENV TAXEEDEE_ENV DEV
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["web.py"]
