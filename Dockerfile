FROM barnuri23/appcenter:28

COPY package.json .
RUN yarn

COPY . .
RUN chmod +x android/gradlew
RUN yarn postinstall
RUN yarn build
RUN chmod +x appcenter-login
RUN yarn appcenter:upload
