const homeDir = "/home/Saintdoggie";

function getCSSColors() {
	const colors = JSON.parse(Utils.readFile(`${homeDir}/.config/stylix/palette.json`));

	let cssColors = "";

	for (let color in colors) {
		if (color.startsWith("base")) {
			cssColors+=`@define-color ${color} #${colors[color]};\n`;
		}
	}

	return cssColors;
}

function reloadStyles() {

	const css = Utils.readFile(`${App.configDir}/css/scss.css`);

	for (let i = 0; i < css.length; i++) {
		if (css.substring(i, i + 10) === "// @content") {
			console.log("asdfjkl")
		}
	}

	Utils.exec(`${App.configDir}/bin/sassc /tmp/scss.css /tmp/css.css`);

	//App.applyCss(colors + css);
}

export {
	getCSSColors,
	reloadStyles
}
