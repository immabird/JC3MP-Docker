const ui = new WebUIWindow('spawnmenu_ui', 'package://spawn-menu/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

// helper settings names
const nitrousEnabledSetting = "spawnmenu/nitrousEnabled";
const turboJumpEnabledSetting = "spawnmenu/turboJumpEnabled";
const vehicleMenuCompactModeSetting = "spawnmenu/vehicleMenuCompactMode";

// default settings
const nitrousEnabledDefault = false;
const turboJumpEnabledDefault = false;
const vehicleMenuCompactModeDefault = true;

jcmp.ui.AddEvent('spawnmenu/ui/toggleMenu', toggle => {
    if (toggle && jcmp.localPlayer.controlsEnabled) {
        jcmp.localPlayer.controlsEnabled = false;
    } else if (!toggle && !jcmp.localPlayer.controlsEnabled) {
        jcmp.localPlayer.controlsEnabled = true;
    }
});

jcmp.ui.AddEvent('spawnmenu/ui/spawnVehicle', modelhash => {
    jcmp.events.CallRemote('spawnmenu/remote/spawnVehicle', modelhash);
});

jcmp.ui.AddEvent('spawnmenu/ui/spawnWeapon', modelhash => {
    jcmp.events.CallRemote('spawnmenu/remote/spawnWeapon', modelhash);
});

jcmp.ui.AddEvent('spawnmenu/ui/toggleAttr', (attr, enabled) => {
    if (attr === 'nitrous')
        jcmp.settings.Set(nitrousEnabledSetting, enabled);
    else
        jcmp.settings.Set(turboJumpEnabledSetting, enabled);

    jcmp.events.CallRemote('spawnmenu/remote/toggleAttr', (attr === 'nitrous'), enabled, false);
});

function loadSettings() {
    if (!jcmp.settings.Exists(nitrousEnabledSetting))
        jcmp.settings.Set(nitrousEnabledSetting, nitrousEnabledDefault);

    if (!jcmp.settings.Exists(turboJumpEnabledSetting))
        jcmp.settings.Set(turboJumpEnabledSetting, turboJumpEnabledDefault);

    if (!jcmp.settings.Exists(vehicleMenuCompactModeSetting))
        jcmp.settings.Set(vehicleMenuCompactModeSetting, vehicleMenuCompactModeDefault);

    let nitrousEnabled = jcmp.settings.Get(nitrousEnabledSetting);
    let turboJumpEnabled = jcmp.settings.Get(turboJumpEnabledSetting);
    let vehicleMenuCompactMode = jcmp.settings.Get(vehicleMenuCompactModeSetting);

    // add some checks just incase someone tries messing with the jcmp.settings.
    if (typeof nitrousEnabled !== 'boolean') {
        nitrousEnabled = nitrousEnabledDefault;
        jcmp.settings.Delete(nitrousEnabledSetting);
    }

    if (typeof turboJumpEnabled !== 'boolean') {
        turboJumpEnabled = turboJumpEnabledDefault;
        jcmp.settings.Delete(turboJumpEnabledSetting);
    }

    if (typeof vehicleMenuCompactMode !== 'boolean') {
        vehicleMenuCompactMode = vehicleMenuCompactModeDefault;
        jcmp.settings.Delete(vehicleMenuCompactModeSetting);
    }

    // send the settings to the UI
    jcmp.ui.CallEvent('spawnmenu/settings', nitrousEnabled, turboJumpEnabled, vehicleMenuCompactMode);

    // actually toggle them on the server
    jcmp.events.CallRemote('spawnmenu/remote/toggleAttr', true, nitrousEnabled, true);
    jcmp.events.CallRemote('spawnmenu/remote/toggleAttr', false, turboJumpEnabled, true);
}

jcmp.ui.AddEvent('spawnmenu/ready', () => {
    loadSettings();
});
