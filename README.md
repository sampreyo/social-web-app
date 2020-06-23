# social-web-app
A sad version of linkedin.

 You need to have a mongodb database to run this. Also you will need to create a file "keys.js" in config folder of the backend which should export an object containing two keys - dbURI, secretOrKey. dbURI should contain the URL of your database. secretOrKey is a key needed to sign the jwt token and verification by passport in the backend. You can set it to any string.

To run follow- 
1. npm install
2. cd client
3. npm install
4. cd ..
5. npm run app
