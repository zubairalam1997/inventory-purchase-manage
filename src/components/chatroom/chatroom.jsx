import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { IoSend, IoAttach } from "react-icons/io5";


const socket = io("http://127.0.0.1:5000", {transports :["WebSocket"]})