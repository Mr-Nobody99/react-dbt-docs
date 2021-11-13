import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}

import merge from "webpack-merge";
import common from "./webpack.common";

import createTransformer from "typescript-plugin-styled-components";
const styledComponentsTransformer = createTransformer();

const config = () => {
  return merge(common, {
    mode: "development",
    devtool: "source-map",
    devServer: {
      contentBase: "./dist",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                getCustomTransformers: () => ({
                  before: [styledComponentsTransformer],
                }),
              },
            },
          ],
          exclude: [/node_modules/],
        },
      ],
    },
  } as Configuration);
};

export default config;
