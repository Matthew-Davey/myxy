# myxy

### What?

Myxy is a tool to shuffle messages in an AMQP message queue. It fetches *all* of the messages from your queue down into memory, mixes them up, and then sends them back to the queue again.

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

### What could go wrong?
Myxy could fall over for any of the following reasons...
- The AMQP broker is unreachanle on the given host/port
- The login or password is incorrect
- The virtual host is not found
- The queue is not found
- The queue has other consumers
- Something else?

### Wait, that last one?

Something else?

### No the one before that?
When myxy connects to your broker, it looks at how many messages are on your queue and then fetches them all down into memory to be shuffled. If you have other consumers popping messages off the queue, myxy may end up waiting for messages which are no longer there. For this reason you'll need to disable or shut down your consuming service(s) whilst myxy jumbles up the queue. Myxy will helpfully refuse to run if it sees that there are other consumers on the queue.

### And something else?
Who knows? Messages may go missing or get corrupted? I've tested this on queues with 250,000 messages, beyond that you're off the edge of the map.

For the love of fluffy little bunnies, don't run this on your production systems.