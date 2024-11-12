const homeDir = "/home/Saintdoggie";
const blank = `
$base00: #000000;
$base01: #000000;
$base02: #000000;
$base03: #000000;
$base04: #000000;
$base05: #000000;
$base06: #000000;
$base07: #000000;
$base08: #000000;
$base09: #000000;
$base0A: #000000;
$base0B: #000000;
$base0C: #000000;
$base0D: #000000;
$base0E: #000000;
$base0F: #000000;
`;

function getCSSColors() {
	try {
		const colors = JSON.parse(Utils.readFile(`${homeDir}/.config/stylix/palette.json`));

		let cssColors = "";

		for (let color in colors) {
			if (color.startsWith("base")) {
				cssColors+=`$${color}: #${colors[color]};\n`;
			}
		}

		return cssColors;
	} catch {
		return blank;
	}
}

function reloadStyles() {

	const css = Utils.readFile(`${App.configDir}/css/css.scss`);

	let withoutImports = "";

	for (let i = 0; i < css.length; i++) {
		if (css.substring(i, i + 11) === "// @content") {
			withoutImports+=css.substring(i + 11);
		}
	}

	const imports = getCSSColors();
	const scss = imports + withoutImports;

	Utils.writeFileSync(scss, "/tmp/scss.scss");
	Utils.exec(`${App.configDir}/bin/sassc /tmp/scss.scss /tmp/css.css`);

	App.applyCss(Utils.readFile("/tmp/css.css"));
}

export {
	reloadStyles
}
