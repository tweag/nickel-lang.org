{
  description = "A website for Nickel - configuration language";

  nixConfig = {
    extra-substituters = [ "https://tweag-nickel.cachix.org" ];
    extra-trusted-public-keys = [ "tweag-nickel.cachix.org-1:GIthuiK4LRgnW64ALYEoioVUQBWs0jexyoYVeLDBwRA=" ];
  };

  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nickel.url = "github:tweag/nickel/stable";

  outputs =
    { self
    , nixpkgs
    , flake-utils
    , nickel
    }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        packageInfo = pkgs.lib.importJSON ./package.json;
        nickelWasm = nickel.packages.${system}.nickelWasm;
        nickelUserManual = nickel.packages.${system}.userManual;
      in rec {
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_latest
            autoconf
            automake
            gettext
            libtool
            cmake
            pkg-config
            libpng
            zlib
            nasm
          ];
          shellHook = ''
            rm -rf nickel-repl
            ln -s ${nickelWasm}/nickel-repl nickel-repl
            ln -s ${nickelUserManual} src/nickel-manual

            echo "== Run \`npm run develop\` to start developing"
            echo " or"
            echo "== Run \`npm run build\` to build the website"
          '';
        };
      });
}
