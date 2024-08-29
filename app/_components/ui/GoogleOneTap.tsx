export const GoogleOneTap = () => {
  return (
    <div
      id="g_id_onload"
      data-client_id="280869398296-nqunek5k7ft6g6i34u73nbchne32jivs.apps.googleusercontent.com"
      data-context="signin"
      data-ux_mode="popup"
      data-login_uri={window.location.origin}
      data-nonce=""
      data-auto_select="true"
      data-close_on_tap_outside="false"
      data-itp_support="true"
    />
  );
};
