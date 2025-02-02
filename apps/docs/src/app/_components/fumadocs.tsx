"use client";

import { RootProvider } from "fumadocs-ui/provider";

import { Search } from "~/components/search";

function FumadocsProvider({
  children,
  _searchKey,
}: {
  children: React.ReactNode;
  _searchKey: string;
}) {
  return (
    <RootProvider
      search={{
        SearchDialog(props) {
          return <Search {...props} _searchKey={_searchKey} />;
        },
      }}
    >
      {children}
    </RootProvider>
  );
}

export default FumadocsProvider;
