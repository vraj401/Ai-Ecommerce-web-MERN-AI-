import { useEffect } from "react";

import toast from "react-hot-toast";

import { socket } from "../socket/socket";

function SocketListener() {

  useEffect(() => {

    // ORDER CREATED
    socket.on("order_created", (data) => {
      toast.success(data.message);
    });

    // PAYMENT SUCCESS
    socket.on("payment_success", (data) => {
      toast.success(data.message);
    });

    // ORDER STATUS UPDATE
    socket.on(
      "order_status_updated",
      (data) => {
        toast.success(
          `Order status: ${data.status}`
        );
      }
    );

    return () => {
      socket.off("order_created");
      socket.off("payment_success");
      socket.off("order_status_updated");
    };

  }, []);

  return null;
}

export default SocketListener;