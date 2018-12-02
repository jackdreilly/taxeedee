FROM frolvlad/alpine-python2 as pipenved
RUN pip install pipenv
COPY Pipfile* ./
RUN pipenv install

FROM pipenved as npm_install
RUN apk add --update nodejs
RUN apk add --update nodejs-npm

FROM npm_install as npmed
WORKDIR /tmp/
COPY html/package* /tmp/
RUN npm install
COPY html/ /tmp/
RUN npm run build
WORKDIR /app/
RUN cp -rf /tmp/build static
RUN rm -rf /tmp/*

FROM npmed as sqlite3ed
RUN apk add sqlite

FROM sqlite3ed
WORKDIR /app/
COPY Pipfile* ./
RUN pipenv install
COPY *.py ./
COPY posts posts
COPY locations locations
COPY templates templates
COPY comments comments
COPY protos protos
COPY .env.prod .env
EXPOSE 5000
ENTRYPOINT ["pipenv"]
CMD ["run", "web", "--port", "$port", "--host", "0.0.0.0"]
