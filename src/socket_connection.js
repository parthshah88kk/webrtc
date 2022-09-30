import React, { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { async } from 'rxjs';
import { io } from "socket.io-client";
import WebrtcSimple from '../src/simple-master/index';

export const socket = io("http://chat.shareslate.com:3000");
const SocketConnection = ({ userName }) => {
    useEffect(() => {
        socket.on("connect", () => {
            console.log('socket id=====>', socket.id);
            socket.emit("setme", { userName: userName, socketId: socket.id })
        });
        socket.on("me", async (id) => { await EncryptedStorage.setItem('socker_id', id); });
        socket.on("callUser", async (data) => {
            const name = await EncryptedStorage.getItem('user_name');
            console.log("data.signal,name", data, name);
            if (data?.userToCall === name) {
                console.log(" ia ma call");
                // startConnection();
            }
        });
    }, []);
    return null;
};

const startConnection = async () => {
    const name = await EncryptedStorage.getItem('user_name');
    const configuration = { optional: null, key: name };
    WebrtcSimple.start(configuration, { frameRate: 120 })
        .then(async (sessionId) => {
            const newname = await EncryptedStorage.setItem('user_name', name + name);
            socket.emit("setme", { userName: newname, socketId: socket.id })
        })
        .catch(err => { console.log(err); });
};

export default SocketConnection;