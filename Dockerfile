FROM barnuri23/appcenter:28

COPY package.json .
RUN yarn

COPY . .
RUN chmod +x android/gradlew
RUN yarn build
RUN chmod +x appcenter-login.sh
RUN yarn appcenter:upload
