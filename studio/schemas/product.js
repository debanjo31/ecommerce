export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      title: "Default variant",
      name: "defaultProductVariant",
      type: "productVariant",
    },
    {
      title: "Variants",
      name: "variants",
      type: "array",
      of: [
        {
          title: "Variant",
          type: "productVariant",
        },
      ],
    },
    {
      title: "Tags",
      name: "tags",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        layout: "tags",
      },
    },
    {
      name: "vendor",
      title: "Vendor",
      type: "reference",
      to: { type: "vendor" },
    },
    {
      name: "blurb",
      title: "Blurb",
      type: "localeString",
    },

    {
      name: "body",
      title: "Body",
      type: "localeBlockContent",
    },
    {
      name: "likes",
      title: "Likes",
      type: "number",
      initialValue: 0,
    },
  ],

  preview: {
    select: {
      title: "title",
      manufactor: "manufactor.title",
      media: "defaultProductVariant.images[0]",
    },
  },
};
