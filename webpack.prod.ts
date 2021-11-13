import common from "./webpack.common";
import merge from "webpack-merge";

import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";

const config = () => {
  return merge(common, {
    mode: "production",
    plugins: [new HtmlInlineScriptPlugin([/.js(\.map)?$/])],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: "ts-loader",
          exclude: [/node_modules/],
        },
        {
          test: /.(png|jpg|svg)$/i,
          type: "asset/inline",
        },
      ],
    },
  });
};

export default config;
