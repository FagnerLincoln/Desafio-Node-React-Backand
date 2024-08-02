const express = require('express');
const uuid = require("uuid");
const cors = require('cors');

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors());

const orders = []; 

const checkOrderId = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id);

    if (index < 0) {
        return response.status(404).json({ message: "Order not Found" });
    }

    request.orderIndex = index;
    request.orderId = id;
    next();
};

app.get('/orders', (request, response) => {
    return response.json(orders);
});

app.post('/orders', (request, response) => {
    const { name, pedido } = request.body;
    const order = { id: uuid.v4(), name, pedido };
    orders.push(order);
    return response.status(201).json(order);
});

app.put('/orders/:id', checkOrderId, (request, response) => {
    const { name, pedido } = request.body;
    const index = request.orderIndex;
    const id = request.orderId;
    const updatedOrder = { id, name, pedido };
    orders[index] = updatedOrder;
    return response.json(updatedOrder);
});

app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex;
    orders.splice(index, 1);
    return response.status(204).json();
});

app.listen(port, () => {
    console.log(` 💀 Server Started on port ${port} 💀 `)
});
