const express = require('express');
const app = express();
const redis = require('redis');
const PORT = 3000;
const TWO_DAYS = 172800;

app.use(express.urlencoded({extended: true})); // to handle url form encoded Content-Type
app.use(express.json()); // to handle application/json Content-Type


const rClient = redis.createClient();

function generatePath() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const len = 7;
  let url = '';

  for (let iterator = 0; iterator <= len; iterator++) {
    url += chars[Math.floor(Math.random() * (chars.length))];
  }

  return url;
}

function captureRequestDetails(req) {
  let reqDetails = {
    headers: req.headers,
    path: req.path,
    method: req.method,
    body: req.body,
    payload: req.params ? req.params.payload : null,
    createdAt: new Date(),
  };
  return reqDetails;
}

function setCacheExpiration(path) {
  rClient.llen(path, (err, reply) => {
    if (reply === 1) {
      rClient.expire(path, TWO_DAYS);
    }
  });
}

function addToOrRetrieveCache(req, res) {
  const details = captureRequestDetails(req);

  if (req.query.inspect === 'true') {
    rClient.lrange(req.path, 0, -1, (err, reply) => {
      res.json(reply);
    });
  } else {
    rClient.lpush(details.path, JSON.stringify(details));
    setCacheExpiration(details.path);
    res.json({success: "pushed into redis"});
  }
}

app.get("/", (req, res) => {
  const host = 'https://www.aumi.dev/r/';
  const path = generatePath();
  const link = host + path;

  const urlNotification = `Here's your sick webhook endpoint URL: ${link}\n`;
  const instructions = `To see requests made to your endpoint, go to ${link}?inspect=true\n`;
  res.send(urlNotification + instructions);
});

app.all("/r/*", (req, res) => {
  addToOrRetrieveCache(req, res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

