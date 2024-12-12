import {
  Page,
  DataTable,
  Button
} from "@shopify/polaris";

const headings = [
  { title: 'name' },
  { title: 'created at' },
  { title: 'total amount' },
  { title: 'status' },
];

import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { getProducts } from '../models/Products.server';
import { createRandomOrder, getOrders } from "../models/Orders.server";
import { useState, useEffect } from "react";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const orders = await getOrders(shop);

  return json({
    orders
  });
}

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const products = await getProducts(admin.graphql);

  const order = await createRandomOrder(shop, products.products);

  return json({ order });
}

export default function AdditionalPage() {
  const data = useLoaderData();
  const actionData = useActionData();
  const [isLoading, setIsLoading] = useState(false);

  const [ordersList, setOrdersList] = useState(data.orders);

  console.log(ordersList);

  useEffect(() => {
    if (actionData?.order) {
      setOrdersList(prevState => [...prevState, actionData.order]);
      chengeLoadingStatus();
    }
  }, [actionData]);

  const rows = ordersList.map(order => [
    order.name,
    order.created_at,
    order.total_amount,
    order.status
  ]);

  const chengeLoadingStatus = () => {
    setIsLoading(!isLoading);
  }

  return (
    <Page>

      <DataTable
        columnContentTypes={[
          'text',
          'text',
          'numeric',
          'numeric',
        ]}
        headings={headings.map((heading) => heading.title)}
        rows={rows}
      >
        
      </DataTable>
      <Form method="POST" onSubmit={chengeLoadingStatus}>
        <Button submit={true} loading={isLoading}>add random order</Button>
      </Form>
    </Page>
  );
}
