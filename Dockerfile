FROM barnuri23/appcenter:28

COPY package.json .
RUN yarn

COPY . .
RUN chmod +x android/gradlew
RUN yarn build
RUN yarn appcenter:upload
