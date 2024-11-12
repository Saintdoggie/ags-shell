import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
//import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const Workspaces = function() {
	return Widget.Box({
		class_name: 'workspaces',
		children: Hyprland.bind('workspaces').transform(ws => {

			const result = [];

			for (let i = 1; i < 10; i++) {

				result[i] = (Widget.Button({
					on_clicked: () => {
						Hyprland.sendMessage(`dispatch workspace ${i}`)
					},
					child: Widget.Label(`${i}`),
					class_name: Hyprland.active.workspace.bind('id')
				}));
			};

			return result;
		}),
	});
}

const ClientTitle = () => Widget.Label({
    class_name: 'client-title',
    label: Hyprland.active.client.bind('title'),
});

const Clock = () => Widget.Label({
    class_name: 'clock',
    setup: self => self.poll(1000, self => execAsync(['date', '+%l:%M %p'])
            .then(date => self.label = date)),
});

const Volume = () => Widget.Box({
    class_name: 'volume',
    css: 'min-width: 180px',
    children: [
        Widget.Icon().hook(Audio, self => {
            if (!Audio.speaker)
                return;

            const category = {
                101: 'overamplified',
                67: 'high',
                34: 'medium',
                1: 'low',
                0: 'muted',
            };

            const icon = Audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
                threshold => threshold <= Audio.speaker.volume * 100);

            self.icon = `audio-volume-${category[icon]}-symbolic`;
        }, 'speaker-changed'),
        Widget.Slider({
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => Audio.speaker.volume = value,
            setup: self => self.hook(Audio, () => {
                self.value = Audio.speaker?.volume || 0;
            }, 'speaker-changed'),
        }),
    ],
});

/*const SysTray = () => Widget.Box({
    class_name: 'systray',
    children: SystemTray.bind('items').transform(items => {
        return items.map(item => Widget.Button({
            child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (_, event) => item.openMenu(event),
            binds: [['tooltip-markup', item, 'tooltip-markup']],
        }));
    }),
}); */

// layout of the bar
const Left = () => Widget.Box({
    spacing: 8,
    children: [
        Workspaces(),
        ClientTitle(),
    ],
});

const Center = () => Widget.Box({
    spacing: 8,
    children: [
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    spacing: 8,
    children: [
        Volume(),
        Clock(),
        //SysTray(),
    ],
});

const Bar = function(monitor = 0) {
	return Widget.Window({
		name: "mainbar",
		class_name: 'bar',
		monitor,
		anchor: ["top", "left", "right"],
		exclusivity: 'exclusive',
		margins: [ 10, 10, 0, 10 ],
		child: Widget.CenterBox({
			start_widget: Left(),
			center_widget: Center(),
			end_widget: Right(),
		}),
	});
}

export default Bar
