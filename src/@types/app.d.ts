interface SearchOption {
  column: boolean;
  description: boolean;
  name: boolean;
  sql: boolean;
  tags: boolean;
}

type Deps = {
  macros: string[];
  nodes: string[];
};
