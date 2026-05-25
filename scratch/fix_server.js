const fs = require('fs');
const path = require('path');

const serverFile = path.resolve(__dirname, '../backend/server.js');
let content = fs.readFileSync(serverFile, 'utf8');

const targetStr = `// Enable CORS with options
app.use(cors(require('./config/corsOptions')));`;

const replacementStr = `// Enable CORS with options
app.use(cors({
  origin: [
    "https://YOUR-VERCEL-APP.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false
}));

app.options("*", cors());`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(serverFile, content, 'utf8');
  console.log('Successfully updated server.js');
} else {
  console.log('Could not find target content in server.js');
}
