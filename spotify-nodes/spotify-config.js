module.exports = function(RED) {
    function SetSpotifyCredentials(config) {
        RED.nodes.createNode(this,config);
        this.redirect_uri = config.redirect_uri;
        this.client_id = config.client_id;
        this.client_secret = config.client_secret;
        this.scope = '';

    }
    RED.nodes.registerType("spotify-config",SetSpotifyCredentials);
}