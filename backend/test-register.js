const http = require('http');

const data = JSON.stringify({
  username: "Test User",
  email: "rishi.learn27@gmail.com",
  phone: "1234567890",
  password: "password123"
});

const options = {
  hostname: 'localhost',
  port: 5005,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
