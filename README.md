# How to build the project
```bash
npm install
npm run build
```

# How to run the program with docker
```bash
docker run -t -i -v .:/root node:latest /bin/bash  
cd /root  
./execute.sh 1 9 node ./index.js
```

# Program parameters
```bash
./execute.sh <SHOOTS> <SIZE> <program> [program params]  
./execute.sh 10 9 node index.js
```

