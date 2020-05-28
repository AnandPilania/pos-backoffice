const data = [
  {
    id: "my-site",
    label: "menu.my-site",
    to: "/my-site",
    subs: [
      {
        label: "menu.dashboard",
        to: "/my-site/dashboard"
      },
      {
        label: "menu.site-information",
        to: "/my-site/information"
      }
    ]
  },
  {
    id: "products",
    label: "menu.products",
    to: "/products",
    subs: [
      {
        label: "menu.products",
        to: "/products/products"
      },
      {
        label: "menu.categories",
        to: "/products/categories"
      }
    ]
  },
  {
    id: "people",
    label: "menu.people",
    to: "/people",
    subs: [
      {
        label: "menu.users",
        to: "/people/users"
      },
      {
        label: "menu.customers",
        to: "/people/customers"
      }
    ]
  },
  {
    id: "reports",
    label: "menu.reports",
    to: "/reports"
  }
];
export default data;
