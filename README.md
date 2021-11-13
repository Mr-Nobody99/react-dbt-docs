# khc-dbt-docs
KHC's React based DBT Docs site.

## Why though?
One of the awesome features of [DBT](https://docs.getdbt.com/) is the [documentation site](https://www.getdbt.com/example-documentation/#!/overview) it is able to generate for your project. And for a majority of use cases the existing docs site is likely more than adequate.

However the team at kraft-heinz-engineering ran into a situation where we wanted to be able to
share a single docs site across many seperate dbt projects. This presented some challenges,
which prompted attempts at work-arounds and finagling to get the desired results which ultimatly did not pan out. Leading us to taking a closer look into the code-base behind the existing [dbt-docs](https://github.com/dbt-labs/dbt-docs) and seeing if there was some adjustments that could be made to suite our needs.

After some consideration there seemed to be two options:

1. Modify the existing code-base to get what we were looking for. And if we couldn't get the changes merged maintain our own fork essentially.
2. Create our own solution from scratch, using the existing dbt-docs as a reference/template.
 
And we decided on option 2

## Key Differences
The 3 biggest differences with the existing dbt-docs are
1. React instead of Angular.js
2. The graph editor is custom as opposed to using the [crytoscape](https://js.cytoscape.org/) library.
3. TypeScript.

## Future Plans
The project was originally created for our own internal use to fit a particular need,
but kraft-heinz-engineering loves the open source community so we are planning on making this version available for the broader public.

We would love to have this project be adopted by the great folks at [dbt-labs](https://github.com/dbt-labs) as possibly a new version of the [dbt-docs](https://github.com/dbt-labs/dbt-docs).

---


### Development
After cloning the repo run:
> yarn install

then just run:
>yarn start
