const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const OSC = require('node-osc');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// 确保使用正确的IP地址和端口，这里使用你电脑的局域网IP地址
const oscClient = new OSC.Client('192.168.137.1', 8000);

// 提供静态文件，如HTML、CSS和客户端JavaScript
app.use(express.static('public'));

// 处理WebSocket连接
io.on('connection', (socket) => {
    console.log('A user connected');

    // 接收来自客户端的关键词
    socket.on('sendKeywords', (data) => {
        console.log('Received keywords:', data);
        // 发送关键词作为单独的参数
        try {
            oscClient.send('/keywords', data.keyword1, data.keyword2, data.keyword3, data.keyword4);
            console.log('Keywords sent to TouchDesigner:', data.keyword1, data.keyword2, data.keyword3, data.keyword4);
        } catch (error) {
            console.error('Failed to send OSC message:', error);
        }
    });

    // 处理断开连接的情况
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 启动服务器
server.listen(3000, '192.168.137.1', () => {
    console.log('Server is running on http://192.168.137.1:3000');
});
