import prisma from "../db.server";

export async function getOrders(shop) {
    const orders = await prisma.order.findMany({
        where: {
            shop,
        },
    });

    return orders;
}

export async function createRandomOrder(shop, products) {
    try {
        const statuses = ["pending", "processing", "completed", "cancelled"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const productName = randomProduct.title;

        const order = await prisma.order.create({
            data: {
                id: Date.now().toString(),
                shop,
                name: productName,
                total_amount: parseFloat((Math.random() * 10).toFixed(0)),
                status: randomStatus,
            },
        });

        return order;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}