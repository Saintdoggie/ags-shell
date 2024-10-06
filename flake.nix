{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: 
  let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    name = "ags-shell";
  in
  with pkgs;
  {
    packages.${system}.default = stdenv.mkDerivation {
      inherit name;
      src = ./src;

      buildInputs = [
        ags
        bun
      ];

      buildPhase = ''
        ${bun}/bin/bun build $src/index.ts \
        --outfile main.js \
        --external "resource://*" \
        --external "gi://*"

        touch -f run

        echo '#!/usr/bin/env sh' > run
     '';

      installPhase = ''
        mkdir -p $out
        mkdir -p $out/bin

        cp -f main.js $out/config.js
        cp -f run $out/bin/ags-shell

        echo "${ags}/bin/ags -c $out/config.js" >> $out/bin/ags-shell

        chmod +x $out/bin/ags-shell
      '';

    };
  };
}
