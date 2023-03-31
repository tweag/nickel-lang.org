{
  description = "A website for Nickel - configuration language";

  nixConfig = {
    extra-substituters = [ "https://tweag-nickel.cachix.org" ];
    extra-trusted-public-keys = [ "tweag-nickel.cachix.org-1:GIthuiK4LRgnW64ALYEoioVUQBWs0jexyoYVeLDBwRA=" ];
  };

  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nickel.url = "github:tweag/nickel";

  outputs =
    { self
    , nixpkgs
    , flake-utils
    , nickel
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      nickelWasm = nickel.packages.${system}.nickelWasm;
      nickelUserManual = nickel.packages.${system}.userManual;
      nickelStdlibDoc = nickel.packages.${system}.stdlibJson;
    in
    {
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
          ln -sfn ${nickelWasm}/nickel-repl nickel-repl
          ln -sfn ${nickelUserManual} src/nickel-manual
          ln -sfn ${nickelStdlibDoc} src/nickel-stdlib-doc

          echo "== Run \`npm run develop\` to start developing"
          echo " or"
          echo "== Run \`npm run build\` to build the website"
        '';
      };
    });
}
