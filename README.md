# myxy

### What?

Myxy is a tool to shuffle messages in an AMQP message queue.

### But why?

For testing the robustness of your services of course. One of the fundamental mistakes people often make when writing message based systems is assuming that messages will be delivered in the same order they were sent/published. This is not always true, and message brokers such as RabbitMQ explicitly do not guarantee this. Your services need to be able to handle messages which arrive out of order.

### Oh, I see

But it's not always easy to replicate conditions where messages may be delivered out of order. Enter myxy. With this tool you can give all the messages in a queue a damn good jumble, and see how your service copes with it.

### How?

`npm install -g myxy`

`λ > myxy --queue my_message_queue`

Myxy will output something like the following:

```
 _____ _ _ _ _ _ _
|     | | |_'_| | |
|_|_|_|_  |_,_|_  |
      |___|   |___|
Fetching Messages 100% [========================================] 0.0s
Myxing Messages   100% [========================================] 0.0s
Sending Messages  13%  [=====-----------------------------------] 12.3s
```

### What are my options?

```
λ myxy
Options:
  -h, --host      Hostname of the AMQP broker    [string] [default: "localhost"]
  -p, --port      AMQP broker port number               [number] [default: 5672]
  -u, --login     AMQP login user name               [string] [default: "guest"]
  -P, --password  AMQP user password                 [string] [default: "guest"]
  -v, --vhost     AMQP virtual host                      [string] [default: "/"]
  -q, --queue     The queue to be myxed                      [string] [required]
```