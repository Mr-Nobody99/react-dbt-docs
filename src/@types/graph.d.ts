interface GraphFilter {
  select: string;
  exclude: string;
  tags: Set<string>;
  packages: Set<string>;
  resources: Set<string>;
}
