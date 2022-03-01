import { rest } from "msw";

export const handlers = [
  rest.get("https://toto:5001/webapi/entry.cgi", (req, res, ctx) => {
    const id = req.url.searchParams.get("id");
    const byId = {
      1: {
        data: {
          list: [
            { name: "foo", id: "11" },
            { name: "bar", id: "12" },
          ],
        },
      },
      12: {
        data: {
          list: [
            { name: "babar", id: "31" },
            { name: "barnum", id: "32" },
          ],
        },
      },
    };
    return res(ctx.status(200), ctx.json(byId[id]));
  }),
];
