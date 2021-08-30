# AskBox

## What is AskBox?

AskBox is a simple RequestBin clone for receiving and debugging webhooks.

AskBox generates a random endpoint that saves `POST` requests it receives to a local Redis server for two days. AskBox also provides a way to view the json data of requests in a browser.

It's configured to be run locally and work with `ngrok`.

## How do I use AskBox?

1. In a new directory, clone this repository `git clone https://github.com/aumi9292/askbox.git`
2. Run the server using `node index.js`. It will run the `AskBox` server on `localhost:3000`.
3. Make sure you have [ngrok](https://developers.telnyx.com/docs/v2/development/ngrok) installed.
4. In the directory where `ngrok` is installed, run `./ngrok http 3000`. This generates a URL that will forward HTTP traffic to `localhost:3000`.
5. To see how AskBox works, navigate to any GitHub repository and add a webhook to it (`Settings => Webhooks`). Do this using the endpoint output in the `ngrok` terminal, concatenated with `r` and the path output when visiting `localhost:3000`. For example, this could be `https://c4fa-71-205-185-110.ngrok.io/r/l6DgkVc6`.
6. This will send a `ping` to the AskBox server running locally. To see the json object representation of that `POST` request, visit the `ngrok` URL, concatenated with `r`, the path output at `localhost:3000`, and the query string `inspect=true`. For example,
   `https://c4fa-71-205-185-110.ngrok.io/r/l6DgkVc6?inspect=true`.
