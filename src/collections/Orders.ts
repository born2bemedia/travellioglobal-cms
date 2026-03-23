import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      label: "Order Number",
      unique: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
    },
    {
      name: "items",
      type: "array",
      label: "Ordered Items",
      fields: [
        {
          name: "product",
          type: "text",
          label: "Product",
          required: false,
        },
        {
          name: "quantity",
          type: "number",
          required: false,
          min: 1,
        },
        {
          name: "price",
          type: "number",
          required: false,
        },
        {
          name: "files",
          type: "array",
          label: "Files",
          fields: [
            {
              name: "file",
              type: "upload",
              relationTo: "media",
              label: "File",
              required: false,
            },
            {
              name: "filename",
              type: "text",
              label: "File Name",
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "total",
      type: "number",
      label: "Total Amount",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      defaultValue: "pending",
      required: true,
    },
    {
      name: "paymentMethod",
      type: "text",
      label: "Payment method",
      required: false,
    },
    {
      name: "orderNotes",
      type: "text",
      label: "Order Notes",
      required: false,
    },
    {
      name: "billingAddress",
      type: "group",
      fields: [
        { name: "address1", type: "text", required: false },
        { name: "address2", type: "text", required: false },
        { name: "city", type: "text", required: false },
        { name: "state", type: "text", required: false },
        { name: "zip", type: "text", required: false },
        { name: "country", type: "text", required: false },
      ],
    },
    {
      name: "createdAt",
      type: "date",
      admin: {
        position: "sidebar",
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "invoice",
      type: "upload",
      relationTo: "media",
      label: "Invoice file",
      required: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "deliverables",
      type: "upload",
      relationTo: "media",
      label: "Deliverables",
      required: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const result = await req.payload.find({
            collection: "orders",
            limit: 1,
            sort: "-createdAt",
          });

          const lastOrderNumber = result.docs.length
            ? parseInt(
                (result.docs[0].orderNumber ?? "ORD-100").replace("ORD-", ""),
                10,
              )
            : 100;

          data.orderNumber = `ORD-${lastOrderNumber + 1}`;
        }
        return data;
      },
    ],
  },
};

export default Orders;
