import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";

const getDefaultAxiosOptions = (options: AxiosRequestConfig<any>): AxiosRequestConfig<any> => {
  return {
    ...options,
    headers: {
      ...options.headers,
      "DY-API-Key": process.env.NEXT_PUBLIC_DY_KEY || "",
    },
  };
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  //   console.log("HEADERS", req.headers);
  const id =
    req.query.userId !== null && req.query.userId !== undefined
      ? (req.query.userId as string)
      : `${Math.floor(Math.random() * 1000)}`;

  const data = {
    selector: {
      names: [req.query.campaign],
    },
    userId: `user_${id}`,
    session: {},
    context: {
      page: {
        location: "/api/dy",
        referrer: "",
        data: [],
        type: "HOMEPAGE",
      },
      device: {
        userAgent: "PostmanRuntime/7.29.0",
        ip: "",
      },
      pageAttributes: "",
    },
  };

  // console.log("data", data);
  // console.log("data", JSON.stringify(data));
  axios("https://dy-api.com/v2/serve/user/choose", getDefaultAxiosOptions({ method: "POST", data }))
    .then((r) => {
      // console.log(res);
      res.status(200).json(r.data.choices[0].variations[0].payload.data);
    })
    .catch((err) => {
      //   console.log("Error while getting variations from DY", err);
      res.status(500).json({ msg: "Error while getting variations from DY", error: err });
    });
};
