/**
* @name         OpenInSoundCloud
* @description  Allows you to search for Spotify songs in SoundCloud.
* @source       https://github.com/shadowforce78/OpenInSoundCloud
* @author       ☆ scriptor.js ☆#7594
* @invite       mKXjfgGSeP
* @version      1.0
*/

module.exports = class OpenInSoundCloud {
    getName() { return "Open in SoundCloud"; }
    load() {
    }
    start() {
        activityPatch();
    }
    stop() {
        BdApi.Patcher.unpatchAll("OpenInSoundCloud");
    }
    observer(changes) {
    }
}

const UserActivity = BdApi.findModuleByDisplayName("UserActivity");
const activityPatch = () => BdApi.Patcher.after("OpenInSoundCloud", UserActivity.prototype, "render", (that, args, value) => {
    const instance = that;
    if (instance.props.activity && instance.props.activity.name === "Spotify") {
        const ytButton = {
            className: "OpenInSoundCloud",
            style: {
                position: "absolute",
                width: "25px",
                height: "25px",
                background: "url(https://i.imgur.com/ezQdCky.png) center/cover no-repeat",
            },
            dataToggle: "tooltip",
            title: "Search with SoundCloud",
            onClick: () => {
                let songName = encodeURIComponent(instance.props.activity.details.replace(/;\s/g, " "));
                let songArtist = "+" + encodeURIComponent(instance.props.activity.state.replace(/;\s/g, " "));
                let url = "https://soundcloud.com/search?q=" + songName + songArtist;
                window.open(url, '_blank');
            }
        }
        switch (instance.props.type) {
            case "Profile":
                ytButton.style["top"] = "13px";
                ytButton.style["right"] = "72px";
                break;
            case "VoiceChannel":
                ytButton.style["top"] = "11px";
                ytButton.style["right"] = "60px";
                break;
            case "UserPopout":
            default:
                ytButton.style["top"] = "-3px";
                ytButton.style["right"] = "55px";
                break;
        }
        value.props.children.push(BdApi.React.createElement("button", ytButton));
    }
    return value;
});