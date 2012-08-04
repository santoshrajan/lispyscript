;; A simple chatserver written in LispyScript
;; Connect to the server via telnet.
;; $ telnet <host> <port>
;; Any message typed in is broadcast to all other clients connected

;; Include node TCP Library
(var net (require "net"))

;; Create TCP server
(var chatServer (net.createServer))

;; Set port to listen
(var port 3000)

;; Create array to store connected clients
(var clientList [])

;; Function to broadcast message to all the other
;; connected clients
(var broadcast
  (function (message client)
    ;; Loop through connected clients
    (each clientList
      (function (currentClient)
        ;; Make sure you don't write to client that sent the message
        (if (!= currentClient client)
          (currentClient.write (str client.name " says " message)))))))

;; The server connection event listener          
(chatServer.on "connection"
  (function (client)
    ;; set client.name to remote address + : + port
    (set client.name (str client.remoteAddress ":" client.remotePort))
    ;; Write Hi message to connected client
    (client.write (str "Hi " client.name "\n"))
    ;; Add client to client list
    (clientList.push client)
    ;; client data event listener, called whenever client sends
    ;; some data
    (client.on "data"
      (function (data)
        ;; call the broadcast function with data and client
        (broadcast data client)))
    ;; We dont want the server to crash while writing to a disconnected
    ;; client. The 'end' event listener is called if client disconnects.
    (client.on "end"
      (function ()
        (clientList.splice (clientList.indexOf client) 1)))))
        
(chatServer.listen port)
