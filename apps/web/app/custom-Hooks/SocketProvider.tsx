"use client";

import React, {
  createContext,
  FC,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface RoomAcknowledgeMent {
  status: boolean;
}

export interface message {
  content: string;
  sender: user;
}
interface user {
  name: string;
  avatar: string | null;
  id: string;
}

interface IsocketContext {
  sendMessage: (roomName: string, Message: message) => Promise<boolean>;
  joinRoom: (roomName: string) => Promise<boolean>;
  Messages: Array<message>;
}

const socketContext = React.createContext<IsocketContext | null>(null);
export const useSocket = () => {
  const state = useContext(socketContext);
  if (!state) throw new Error("state not defined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [Socket, setSocket] = useState<Socket>();
  const [Messages, setMessages] = useState<message[]>([]);

  const joinRoom = useCallback(
    async (roomName: string) => {
      if (Socket === undefined) {
        return false;
      }

      const res: RoomAcknowledgeMent = await Socket.emitWithAck(
        "joinRoom",
        roomName
      );

      console.log("socket emit");

      if (res.status === false) {
        return false;
      }

      return true;
    },
    [Socket]
  );

  const sendMessage: IsocketContext["sendMessage"] = useCallback(
    async (roomName: string, Message: message) => {
      const res: RoomAcknowledgeMent = await Socket?.emitWithAck(
        "sendMessage",
        roomName,
        Message
      );

      console.log("Message send ", Message);

      if (res.status === false) {
        return false;
      }
      const create = await axios.post(
        `/api/messages/create-message?GroupName=${roomName}`,
        {
          content: Message.content,
        }
      );
      console.log(create);

      return true;
    },
    [Socket]
  );

  const onMessageRec = useCallback(
    (Message: message) => {
      console.log("Message recieved from server", Message);

      setMessages((prev) => [...prev, Message]);

      // console.log(Message);
    },
    [Socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:3002");
    _socket.on("RecivedMessage", onMessageRec);

    setSocket(_socket);

    return () => {
      _socket.disconnect;
      setSocket(undefined);
    };
  }, []);

  return (
    <socketContext.Provider value={{ sendMessage, joinRoom, Messages }}>
      {children}
    </socketContext.Provider>
  );
};
