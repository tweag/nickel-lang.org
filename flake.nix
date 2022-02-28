{
  description = "A website for Nickel - configuration language";

  nixConfig = {
    extra-substituters = [ "https://nickel.cachix.org" ];
    extra-trusted-public-keys = [ "nickel.cachix.org-1:ABoCOGpTJbAum7U6c+04VbjvLxG9f0gJP5kYihRRdQs=" ];
  };

  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nickel.url = "github:tweag/nickel/b745c048d2939073dc27972f05a70cd65566cb87";

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
        nickelWasm = nickel.packages.${system}.buildWasm;
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
