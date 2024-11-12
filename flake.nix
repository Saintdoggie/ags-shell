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
      src = ./.;

      buildInputs = [
        ags
        bun
        typescript
      ];
      

      buildPhase = ''
        ${bun}/bin/bun build $src/src/index.ts \
        --outfile config.js \
        --external "resource://*" \
        --external "gi://*" \
        --external "ags"

        # Retrieve typescript types, then check types with tsc

        cp -r ${ags}/share/com.github.Aylur.ags/types/* .
        cp $src/tsconfig.json .
        cp $src/src/css/css.scss .

        cp ${sassc}/bin/sassc .

        # tsc -p tsconfig.json

        touch -f run

        echo '#!/usr/bin/env sh' > run
     '';

      installPhase = ''
        mkdir -p $out
        mkdir -p $out/bin
        mkdir -p $out/css

        cp -f config.js $out/config.js

        cp -f run $out/bin/ags-shell
        cp -f sassc $out/bin/sassc

        cp -f css.scss $out/css/css.scss

        echo "${ags}/bin/ags -c $out/config.js" >> $out/bin/ags-shell

        chmod +x $out/bin/ags-shell
      '';

    };
  };
}
